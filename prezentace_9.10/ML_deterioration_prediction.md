# ML Deterioration Prediction (SCR-06)

**Audience:** 🏗️ Architect, 👨‍💻 Developer, 📊 Data Scientist
**Purpose:** ML model design for supplier deterioration early warning
**Priority:** 🔴 CRITICAL (Jarmila priority)
**Date:** October 9, 2025

---

## 1. Problem Definition

### What is "deterioration"?

**Deterioration = significant worsening of supplier metric** within a short period, indicating growing risk.

**3 types of deterioration:**

1. **Financial Deterioration**
   - Credit rating drop by ≥2 levels within 3 months
   - Revenue drop >30% year-over-year
   - DSO (Days Sales Outstanding) increase >50%

2. **Operational Deterioration**
   - On-time delivery rate drop >15 percentage points
   - Quality defect rate increase >2x
   - Payment late % increase >20 percentage points

3. **Compliance Deterioration**
   - New sanctions or adverse media events
   - UBO change without notification
   - Regulatory violations

---

## 2. Data Sources

### 2.1 SAP Source Data (dm_bs_purchase in DAP)

**Unity Catalog path:** `dap_gold_prod.dm_bs_purchase`

**Relevant tables (from BA-BS metadata JSON):**

```python
# Fact tables - supplier purchase metrics
factv_bs_purchase_ekl_metric            # EKL (development) metrics
factv_bs_purchase_ekl_metric_current    # Current fiscal year only
factv_bs_material_share_current         # Material-level shares

# Dimensions
dimv_supplier                           # Supplier master data
dimv_material                           # Material master (MARA)
dimv_purchase_group                     # Purchase groups (BS org)
dimv_bs_purchase_ekl_metric             # EKL metric definitions
dimv_bs_purchase_ekl_metric_property    # Additional metric attributes

# Key metrics from EKL (zmhonak3_zal, zmhonist_puvod):
# - STD_Price (standard price per unit)
# - credit_note_amount (financial corrections)
# - menge (quantity)
# - payment_late_pct (derived from invoice data)
```

**Data refresh:** Daily (SAP source → DAP)

---

### 2.2 External Data (DnB + Sayari)

**Dun & Bradstreet:**
- `financial_stress_score` (0-100, higher = worse)
- `credit_rating` (AAA → D)
- `payment_behavior_score` (historical trends)
- `viability_rating` (1-9, 1 = lowest risk)

**Sayari:**
- `sanctions_count` (OFAC, EU, UN lists)
- `adverse_media_count` (last 90 days)
- `ubo_change_flag` (boolean, last 6 months)
- `supply_chain_depth` (tier depth, higher = more fragile)

---

## 3. Approach 1: Rule-Based (CUSUM Algorithm)

### 3.1 CUSUM (Cumulative Sum Control Chart)

**Principle:** Detection of persistent mean shift in metric.

**Parameters:**
- `k` = allowable slack (half of target change, e.g., 0.5 σ)
- `h` = decision interval (typically 4-5 σ)

**For supplier monitoring:**
```python
# Pseudo-code: CUSUM pro payment_late_pct monitoring

def cusum_monitor(supplier_id: str, metric: str):
    # Step 1: Load historical values (6 months)
    historical = get_snapshots(
        supplier_id=supplier_id,
        metric=metric,
        lookback_days=180
    )

    # Step 2: Calculate baseline (moving average)
    baseline_mean = np.mean(historical[-30:])  # Last 30 days
    baseline_std = np.std(historical[-30:])

    # Step 3: Initialize CUSUM
    k = 0.5 * baseline_std  # Slack parameter
    h = 4.0 * baseline_std  # Decision threshold

    S_high = 0  # Upper cumulative sum
    S_low = 0   # Lower cumulative sum

    # Step 4: Iterate over new values
    current_value = get_latest_value(supplier_id, metric)

    # Upper CUSUM (deterioration)
    S_high = max(0, S_high + (current_value - baseline_mean - k))

    # Lower CUSUM (improvement - less interesting)
    S_low = max(0, S_low - (current_value - baseline_mean + k))

    # Step 5: Evaluation
    if S_high > h:
        alert = {
            "supplier_id": supplier_id,
            "metric": metric,
            "severity": "HIGH",
            "cusum_value": S_high,
            "threshold": h,
            "baseline_mean": baseline_mean,
            "current_value": current_value,
            "shift_magnitude": current_value - baseline_mean,
            "evidence": f"CUSUM crossed threshold: {S_high:.2f} > {h:.2f}"
        }
        return alert

    return None  # No alert
```

**MVP rules (combination of 4 CUSUM monitors):**

```python
# Pseudo-code: MVP rule-based detection

def detect_deterioration_mvp(supplier_id: str):
    alerts = []

    # Rule 1: Payment late % (SAP source metric)
    alert1 = cusum_monitor(supplier_id, "payment_late_pct")
    if alert1:
        alerts.append(alert1)

    # Rule 2: Credit rating trend (DnB)
    rating_history = get_credit_ratings(supplier_id, lookback_months=6)
    if len(rating_history) >= 2:
        rating_drop = rating_history[0].numeric_value - rating_history[-1].numeric_value
        if rating_drop >= 2:  # 2+ levels drop
            alerts.append({
                "supplier_id": supplier_id,
                "metric": "credit_rating",
                "severity": "HIGH",
                "rating_drop": rating_drop,
                "evidence": f"Credit rating dropped {rating_drop} levels in 6 months"
            })

    # Rule 3: Sanctions count (Sayari)
    sanctions = get_sayari_sanctions(supplier_id)
    if len(sanctions) > 0:
        most_recent = max(sanctions, key=lambda x: x.date)
        days_since = (datetime.now() - most_recent.date).days
        if days_since <= 90:  # New sanction in last 3 months
            alerts.append({
                "supplier_id": supplier_id,
                "metric": "sanctions",
                "severity": "CRITICAL",
                "evidence": f"New sanction added {days_since} days ago"
            })

    # Rule 4: UBO change without notification (Sayari)
    ubo_change = check_ubo_change(supplier_id, lookback_months=6)
    if ubo_change.detected and not ubo_change.notified:
        alerts.append({
            "supplier_id": supplier_id,
            "metric": "ubo_ownership",
            "severity": "MEDIUM",
            "evidence": f"UBO changed on {ubo_change.date} without notification"
        })

    return alerts
```

**Performance Targets:**
- **Latency:** <5 minutes (hourly batch job)
- **False Positive Rate:** <30% (business tolerance)

---

## 4. Approach 2: ML-Enhanced (LightGBM)

### 4.1 Problem Framing

**Supervised Learning Task:** Binary classification

**Target Label:** `deterioration_3m` (boolean)
- `True` = deterioration occurred within next 3 months
- `False` = no deterioration in next 3 months

**Deterioration definition (labeling rule):**
```python
# Pseudo-code: Automatic labeling from historical data

def label_deterioration(supplier_id: str, snapshot_date: date):
    # Lookback: features from snapshot_date
    # Lookahead: check if deterioration occurred in next 3 months

    future_window = [snapshot_date + timedelta(days=d) for d in range(1, 91)]

    # Check financial deterioration
    rating_drop = check_credit_rating_drop(supplier_id, future_window, threshold=2)
    revenue_drop = check_revenue_drop(supplier_id, future_window, threshold=0.30)

    # Check operational deterioration
    otd_drop = check_otd_drop(supplier_id, future_window, threshold=15)  # percentage points
    payment_late_spike = check_payment_late_spike(supplier_id, future_window, threshold=20)

    # Check compliance deterioration
    new_sanction = check_new_sanction(supplier_id, future_window)

    # Label = True if ANY condition met
    deterioration = any([
        rating_drop,
        revenue_drop,
        otd_drop,
        payment_late_spike,
        new_sanction
    ])

    return deterioration
```

**Training data:** 2020-2024 historical snapshots (5 years)
- **Positive samples:** ~100-150 labeled deterioration events
- **Negative samples:** ~5000 normal snapshots (imbalanced dataset)
- **Strategy:** SMOTE oversampling + class weighting

---

### 4.2 Feature Engineering (12 dimensions)

**SAP Source Features (z dm_bs_purchase in DAP):**

```python
# Pseudo-code: Extract SAP source features

def extract_sap_bs_features(supplier_id: str, as_of_date: date):
    # Query: dap_gold_prod.dm_bs_purchase.factv_bs_purchase_ekl_metric_current

    # Feature 1: Payment late % (3-month trend)
    payment_late_3m = query(f"""
        SELECT AVG(payment_late_pct) as avg_payment_late
        FROM dap_gold_prod.dm_bs_purchase.factv_bs_purchase_ekl_metric_current
        WHERE supplier_id = '{supplier_id}'
          AND metric_month BETWEEN DATE_SUB('{as_of_date}', 90) AND '{as_of_date}'
    """)

    # Feature 2: STD_Price volatility (coefficient of variation)
    std_price_volatility = query(f"""
        SELECT STDDEV(STD_Price) / AVG(STD_Price) as cv_std_price
        FROM dap_gold_prod.dm_bs_purchase.factv_bs_purchase_ekl_metric_current
        WHERE supplier_id = '{supplier_id}'
          AND metric_month BETWEEN DATE_SUB('{as_of_date}', 180) AND '{as_of_date}'
    """)

    # Feature 3: Credit note amount ratio (returns/corrections)
    credit_note_ratio = query(f"""
        SELECT SUM(credit_note_amount) / SUM(STD_Price * menge) as credit_note_ratio
        FROM dap_gold_prod.dm_bs_purchase.factv_bs_purchase_ekl_metric_current
        WHERE supplier_id = '{supplier_id}'
          AND metric_month BETWEEN DATE_SUB('{as_of_date}', 90) AND '{as_of_date}'
    """)

    # Feature 4: Purchase volume trend (6-month slope)
    volume_trend = query(f"""
        WITH monthly_vol AS (
            SELECT
                metric_month,
                SUM(menge) as total_quantity
            FROM dap_gold_prod.dm_bs_purchase.factv_bs_purchase_ekl_metric_current
            WHERE supplier_id = '{supplier_id}'
              AND metric_month BETWEEN DATE_SUB('{as_of_date}', 180) AND '{as_of_date}'
            GROUP BY metric_month
        )
        SELECT REGR_SLOPE(total_quantity, MONTH(metric_month)) as volume_slope
        FROM monthly_vol
    """)

    return {
        "payment_late_3m_avg": payment_late_3m,
        "std_price_volatility": std_price_volatility,
        "credit_note_ratio": credit_note_ratio,
        "volume_trend_6m": volume_trend
    }
```

**External Features (DnB + Sayari):**

```python
# Pseudo-code: Extract external features

def extract_external_features(supplier_id: str, as_of_date: date):
    # DnB features
    dnb_data = get_dnb_profile(supplier_id, as_of_date)

    # Feature 5: Financial stress score (0-100)
    financial_stress = dnb_data.financial_stress_score

    # Feature 6: Credit rating numeric (AAA=10, D=1)
    credit_rating_numeric = map_rating_to_numeric(dnb_data.credit_rating)

    # Feature 7: Credit rating 6-month change
    rating_6m_ago = get_dnb_profile(supplier_id, as_of_date - timedelta(days=180))
    rating_change_6m = credit_rating_numeric - map_rating_to_numeric(rating_6m_ago.credit_rating)

    # Feature 8: Payment behavior score (0-100, lower = better)
    payment_behavior = dnb_data.payment_behavior_score

    # Sayari features
    sayari_data = get_sayari_profile(supplier_id, as_of_date)

    # Feature 9: Sanctions count (current)
    sanctions_count = len(sayari_data.sanctions)

    # Feature 10: Adverse media count (last 90 days)
    adverse_media_90d = len([
        media for media in sayari_data.adverse_media
        if (as_of_date - media.date).days <= 90
    ])

    # Feature 11: UBO change indicator (0/1)
    ubo_change_6m = int(sayari_data.ubo_change_detected_last_6m)

    # Feature 12: Supply chain depth (tier depth)
    supply_chain_depth = sayari_data.max_tier_depth

    return {
        "dnb_financial_stress": financial_stress,
        "dnb_credit_rating_numeric": credit_rating_numeric,
        "dnb_rating_change_6m": rating_change_6m,
        "dnb_payment_behavior": payment_behavior,
        "sayari_sanctions_count": sanctions_count,
        "sayari_adverse_media_90d": adverse_media_90d,
        "sayari_ubo_change_6m": ubo_change_6m,
        "sayari_supply_chain_depth": supply_chain_depth
    }
```

**Complete feature vector (12D):**

| Feature                     | Source     | Type   | Range      | Missing Strategy             |
| --------------------------- | ---------- | ------ | ---------- | ---------------------------- |
| `payment_late_3m_avg`       | SAP source | float  | [0, 100] % | Fill with category median    |
| `std_price_volatility`      | SAP source | float  | [0, ∞)     | Fill with 0 (stable price)   |
| `credit_note_ratio`         | SAP source | float  | [0, 1]     | Fill with 0 (no corrections) |
| `volume_trend_6m`           | SAP source | float  | (-∞, ∞)    | Fill with 0 (flat trend)     |
| `dnb_financial_stress`      | DnB        | int    | [0, 100]   | Fill with 50 (median)        |
| `dnb_credit_rating_numeric` | DnB        | int    | [1, 10]    | Fill with 5 (BBB equivalent) |
| `dnb_rating_change_6m`      | DnB        | int    | [-9, 9]    | Fill with 0 (no change)      |
| `dnb_payment_behavior`      | DnB        | int    | [0, 100]   | Fill with 50 (median)        |
| `sayari_sanctions_count`    | Sayari     | int    | [0, ∞)     | Fill with 0 (no sanctions)   |
| `sayari_adverse_media_90d`  | Sayari     | int    | [0, ∞)     | Fill with 0 (no media)       |
| `sayari_ubo_change_6m`      | Sayari     | binary | {0, 1}     | Fill with 0 (no change)      |
| `sayari_supply_chain_depth` | Sayari     | int    | [1, 10]    | Fill with 3 (typical depth)  |

---

### 4.3 Model Training

**Algorithm:** LightGBM (Gradient Boosted Decision Trees)

**Why LightGBM?**
- Fast training (<10 min on 5000 samples)
- Handles missing values natively
- Built-in SHAP support (interpretability)
- Works well with imbalanced data

**Hyperparameters:**

```python
# Pseudo-code: LightGBM training pipeline

import lightgbm as lgb
from sklearn.model_selection import TimeSeriesSplit
from imblearn.over_sampling import SMOTE

def train_deterioration_model():
    # Step 1: Load training data
    X_train, y_train = load_historical_snapshots(
        start_date="2020-01-01",
        end_date="2024-06-30"
    )

    # Step 2: SMOTE oversampling (balance classes)
    smote = SMOTE(sampling_strategy=0.3, random_state=42)
    X_resampled, y_resampled = smote.fit_resample(X_train, y_train)

    # Step 3: Time series cross-validation (5 folds)
    tscv = TimeSeriesSplit(n_splits=5)

    # Step 4: Define LightGBM parameters
    params = {
        'objective': 'binary',
        'metric': 'auc',
        'boosting_type': 'gbdt',
        'num_leaves': 31,
        'learning_rate': 0.05,
        'feature_fraction': 0.8,
        'bagging_fraction': 0.8,
        'bagging_freq': 5,
        'max_depth': 6,
        'min_child_samples': 20,
        'scale_pos_weight': 3.0,  # Class weighting (positive = 3x important)
        'verbose': -1
    }

    # Step 5: Train model
    train_data = lgb.Dataset(X_resampled, label=y_resampled)

    model = lgb.train(
        params,
        train_data,
        num_boost_round=500,
        valid_sets=[train_data],
        early_stopping_rounds=50
    )

    # Step 6: Evaluate on holdout (2024-07 → 2024-12)
    X_test, y_test = load_historical_snapshots(
        start_date="2024-07-01",
        end_date="2024-12-31"
    )

    y_pred_proba = model.predict(X_test)

    from sklearn.metrics import roc_auc_score, precision_recall_fscore_support

    auc = roc_auc_score(y_test, y_pred_proba)

    # Threshold = 0.80 (high confidence)
    y_pred_class = (y_pred_proba >= 0.80).astype(int)
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred_class, average='binary')

    print(f"AUC: {auc:.3f}")
    print(f"Precision@0.80: {precision:.3f}")
    print(f"Recall@0.80: {recall:.3f}")
    print(f"F1@0.80: {f1:.3f}")

    # Step 7: Register to MLflow
    import mlflow.lightgbm

    with mlflow.start_run():
        mlflow.log_params(params)
        mlflow.log_metrics({
            "auc": auc,
            "precision_at_0.80": precision,
            "recall_at_0.80": recall,
            "f1_at_0.80": f1
        })
        mlflow.lightgbm.log_model(model, "deterioration_model_v1")

    return model
```

**Performance Targets:**
- **AUC:** >0.80 (good discrimination)
- **Precision@0.80:** >0.75 (low false positives)
- **Recall@0.80:** >0.70 (catch most deteriorations)
- **Batch processing:** 1500 suppliers in 2 minutes

---

### 4.4 Model Inference

**Deployment:** Databricks Model Serving (real-time endpoint)

**Inference pipeline:**

```python
# Pseudo-code: Real-time deterioration scoring

def predict_deterioration_probability(supplier_id: str):
    # Step 1: Extract features
    as_of_date = datetime.now().date()

    sap_features = extract_sap_bs_features(supplier_id, as_of_date)
    external_features = extract_external_features(supplier_id, as_of_date)

    # Step 2: Combine features into vector
    feature_vector = {
        **sap_features,
        **external_features
    }

    # Step 3: Handle missing values (fill strategy)
    feature_vector = impute_missing_values(feature_vector)

    # Step 4: Load model from MLflow
    model_uri = "models:/deterioration_model_v1/Production"
    model = mlflow.lightgbm.load_model(model_uri)

    # Step 5: Predict probability
    X = pd.DataFrame([feature_vector])
    probability = model.predict(X)[0]

    # Step 6: SHAP explanations (top 3 features)
    import shap

    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X)[0]

    # Get top 3 contributing features
    feature_importance = sorted(
        zip(X.columns, shap_values),
        key=lambda x: abs(x[1]),
        reverse=True
    )[:3]

    return {
        "supplier_id": supplier_id,
        "deterioration_probability": probability,
        "risk_level": "HIGH" if probability >= 0.80 else "MEDIUM" if probability >= 0.50 else "LOW",
        "top_factors": [
            {
                "feature": feat,
                "shap_value": val,
                "feature_value": feature_vector[feat]
            }
            for feat, val in feature_importance
        ],
        "model_version": "v1",
        "prediction_timestamp": datetime.now().isoformat()
    }
```

**Example output:**

```json
{
  "supplier_id": "SUPPLIER_12345",
  "deterioration_probability": 0.87,
  "risk_level": "HIGH",
  "top_factors": [
    {
      "feature": "dnb_rating_change_6m",
      "shap_value": 0.23,
      "feature_value": -3
    },
    {
      "feature": "payment_late_3m_avg",
      "shap_value": 0.18,
      "feature_value": 42.5
    },
    {
      "feature": "sayari_adverse_media_90d",
      "shap_value": 0.12,
      "feature_value": 7
    }
  ],
  "model_version": "v1",
  "prediction_timestamp": "2025-10-09T14:30:00Z"
}
```

---

## 5. Model Retraining Strategy

**Frequency:** Quarterly (every 3 months)

**Triggers:**
1. **Scheduled:** Automatic retrain každý Q1/Q2/Q3/Q4 start
2. **Performance degradation:** AUC drops <0.75 na validation set
3. **Data drift detected:** Feature distributions shift >15%

**Retraining pipeline:**

```python
# Pseudo-code: Automated retraining workflow (Databricks Job)

def retrain_deterioration_model():
    # Step 1: Fetch latest historical data (rolling 5-year window)
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=1825)  # 5 years

    X_new, y_new = load_historical_snapshots(start_date, end_date)

    # Step 2: Evaluate current production model
    current_model = mlflow.lightgbm.load_model("models:/deterioration_model_v1/Production")

    X_val, y_val = load_validation_set(last_n_months=3)
    current_auc = roc_auc_score(y_val, current_model.predict(X_val))

    print(f"Current model AUC: {current_auc:.3f}")

    # Step 3: Train new model candidate
    new_model = train_deterioration_model()  # See section 4.3

    # Step 4: Evaluate new model
    new_auc = roc_auc_score(y_val, new_model.predict(X_val))

    print(f"New model AUC: {new_auc:.3f}")

    # Step 5: Champion/Challenger comparison
    if new_auc > current_auc + 0.02:  # At least 2% improvement
        # Promote new model to Production
        client = mlflow.tracking.MlflowClient()

        latest_version = client.get_latest_versions("deterioration_model_v1", stages=["None"])[0].version

        client.transition_model_version_stage(
            name="deterioration_model_v1",
            version=latest_version,
            stage="Production",
            archive_existing_versions=True
        )

        print(f"✅ New model v{latest_version} promoted to Production")
    else:
        print(f"⚠️ New model not better than current. Keep current Production model.")

    # Step 6: Log metrics to Azure Monitor
    log_custom_metric(
        metric_name="deterioration_model_auc",
        value=new_auc,
        dimensions={"model_version": "v_latest", "retrain_date": end_date.isoformat()}
    )
```

---

## 6. Integration do Monitoring Pipeline

**Databricks Workflow (hourly):**

```python
# Pseudo-code: Scheduled monitoring job

def hourly_deterioration_check():
    # Step 1: Get list of Tier 1 suppliers (from TierIndex Gold)
    tier1_suppliers = query("""
        SELECT DISTINCT supplier_id
        FROM staging_wsp.gold.tierindex_entities
        WHERE tier_level = 1
          AND is_active = true
    """)

    alerts = []

    # Step 2: Iterate through suppliers
    for supplier_id in tier1_suppliers:
        # ML inference
        prediction = predict_deterioration_probability(supplier_id)

        if prediction["risk_level"] == "HIGH":
            # Step 3: Enrich alert with context
            supplier_details = get_supplier_details(supplier_id)

            alert = {
                "alert_id": f"DET_{supplier_id}_{datetime.now().strftime('%Y%m%d%H%M')}",
                "supplier_id": supplier_id,
                "supplier_name": supplier_details.name,
                "alert_type": "DETERIORATION_PREDICTION",
                "severity": "HIGH",
                "probability": prediction["deterioration_probability"],
                "top_factors": prediction["top_factors"],
                "recommended_actions": [
                    "Review recent payment behavior",
                    "Schedule supplier audit call",
                    "Check alternative supplier capacity"
                ],
                "created_at": datetime.now().isoformat(),
                "expires_at": (datetime.now() + timedelta(days=7)).isoformat()
            }

            alerts.append(alert)

    # Step 4: Bulk insert to alert history
    if alerts:
        insert_alerts(alerts)

        # Step 5: Trigger notification delivery
        deliver_alerts(alerts)

    print(f"✅ Processed {len(tier1_suppliers)} suppliers, generated {len(alerts)} HIGH alerts")
```

---

## Related Docs

- [02_use_cases_proaktivni_monitoring.md](./02_use_cases_proaktivni_monitoring.md) - SCR-06 use case detail
- [03_data_model_proaktivni_monitoring.md](./03_data_model_proaktivni_monitoring.md) - Feature Store schema
- [04_diagrams_proaktivni_monitoring.md](./04_diagrams_proaktivni_monitoring.md) - Alert delivery workflow
- `scrum/architecture/machine_learning/ML_PREDICTIVE_ROADMAP.md` - ML strategy

---

**Last Updated:** October 9, 2025
**Status:** Draft
**Next Steps:**
1. ✅ Validate SAP source metric availability (payment_late, STD_Price, credit_note)
2. ⏸️ Label 100+ historical deterioration events (2020-2024)
3. ⏸️ Train LightGBM baseline model
4. ⏸️ Deploy to Databricks Model Serving
