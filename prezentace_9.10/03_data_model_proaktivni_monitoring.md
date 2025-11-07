# Proactive Monitoring - Data Model & Runtime Flows



**Date:** October 9, 2025

---

## Overview

**Data Model for proactive monitoring consists of 3 layers:**

1. **TierIndex Gold Layer** - Static baseline (monthly refresh)
2. **Feature Store** - Time-series snapshots (hourly/daily)
3. **Alert Pipeline** - Runtime detection + delivery

---

## 1. TierIndex Gold Layer (Static Baseline)


### **Key Tables:**

```sql
-- Supplier master data
staging_wsp.gold.ti_supplier_metrics (
    duns STRING PRIMARY KEY,
    company_name STRING,
    country STRING,
    tier_level INT,
    -- Financial (DnB)
    credit_rating INT,
    financial_risk_score FLOAT,
    -- Compliance (Sayari)
    sanctions_flag BOOLEAN,
    adverse_media_count INT,
    ubo_complexity_score FLOAT,
    -- Operational (SAP source: dm_bs_purchase in DAP)
    payment_late_pct FLOAT, -- % invoices past due (dm_bs_purchase.factv_bs_purchase_ekl_metric_current)
    credit_note_ratio FLOAT, -- credit_note_amount / (STD_Price * menge)
    std_price_volatility FLOAT, -- price stability (coefficient of variation)
    -- Quality (BeON)
    defect_rate_ppm INT,
    -- Metadata
    last_updated_at TIMESTAMP,
    data_completeness_score FLOAT -- 0-1
)

-- Tier assignments
staging_wsp.gold.ti_tier_summary (
    tier_level INT,
    supplier_count INT,
    avg_risk_score FLOAT,
    high_risk_count INT
)
```

**Refresh:** Monthly baseline + daily incremental updates

---

## 2. Feature Store (Time-Series Snapshots)

### **Purpose:**
Historical snapshots pro trend analysis a ML training

### **Schema:**

```sql
-- Hourly/Daily snapshots
staging_wsp.features.supplier_monitoring_snapshots (
    -- Primary Key
    snapshot_id STRING PRIMARY KEY, -- UUID
    snapshot_date TIMESTAMP,
    supplier_id STRING, -- DUNS

    -- Current Values (DnB Financial)
    credit_rating INT,
    employee_count INT,
    revenue_eur BIGINT,

    -- Compliance (Sayari)
    sanctions_count INT,
    adverse_media_count INT,

    -- Operational (SAP source: dm_bs_purchase in DAP)
    payment_late_pct FLOAT, -- % invoices past due (factv_bs_purchase_ekl_metric_current)
    credit_note_amount BIGINT, -- Returns/corrections (factv_bs_purchase_ekl_metric_current)
    std_price_avg FLOAT, -- Standard price (factv_bs_purchase_ekl_metric_current)
    volume_menge BIGINT, -- Purchase quantity (factv_bs_purchase_ekl_metric_current)

    -- Quality (BeON)
    defect_rate_ppm INT,

    -- Rolling Windows (7d, 30d, 90d)
    credit_rating_7d_avg FLOAT,
    credit_rating_30d_avg FLOAT,
    credit_rating_90d_avg FLOAT,
    credit_rating_30d_trend FLOAT, -- slope (linear regression)

    payment_late_7d_avg FLOAT,
    payment_late_30d_avg FLOAT,

    -- Derived Features
    credit_rating_volatility FLOAT, -- std dev over 90d
    revenue_trend_slope FLOAT, -- 6-month regression
    industry_benchmark_zscore FLOAT, -- peer comparison

    -- UBO Changes (Sayari)
    ubo_hash STRING, -- hash of UBO structure
    ubo_changed_flag BOOLEAN, -- detected change since last snapshot

    -- Metadata
    data_completeness FLOAT, -- 0-1
    feature_version STRING -- v1, v2 (for A/B testing)
)

-- Partitioned by snapshot_date (YYYY-MM-DD)
PARTITIONED BY (snapshot_date)
```



---

### **Feature Engineering Pipeline:**

```python
# Pseudo-code (Databricks Notebook)

def create_monitoring_snapshot():
    """
    Generate hourly snapshot with rolling windows + derived features
    """

    # Step 1: Fetch current data from Gold layer
    current = spark.table("gold.ti_supplier_metrics")

    # Step 1b: Fetch SAP source metrics (dm_bs_purchase in DAP)
    sap_bs_metrics = spark.sql("""
        SELECT
            supplier_id,
            AVG(payment_late_pct) as payment_late_pct_3m,
            SUM(credit_note_amount) as credit_note_amount_3m,
            AVG(STD_Price) as std_price_avg_3m,
            STDDEV(STD_Price) / NULLIF(AVG(STD_Price), 0) as std_price_volatility_3m,
            SUM(menge) as volume_menge_3m
        FROM dap_gold_prod.dm_bs_purchase.factv_bs_purchase_ekl_metric_current
        WHERE metric_month >= DATE_SUB(CURRENT_DATE, 90)
        GROUP BY supplier_id
    """)

    # Step 1c: Join with SAP source metrics
    current = current.join(sap_bs_metrics, "supplier_id", "left")

    # Step 2: Fetch historical snapshots (for rolling windows)
    historical = spark.table("features.supplier_monitoring_snapshots") \
        .filter(f"snapshot_date >= current_date() - INTERVAL 90 DAYS")

    # Step 3: Calculate rolling windows
    window_7d = historical.filter("snapshot_date >= current_date() - 7")
    window_30d = historical.filter("snapshot_date >= current_date() - 30")
    window_90d = historical

    # Step 4: Calculate derived features
    features = current.alias("c").join(
        window_7d.groupBy("supplier_id").agg(
            avg("credit_rating").alias("credit_rating_7d_avg")
        ).alias("w7"), "supplier_id"
    ).join(
        window_30d.groupBy("supplier_id").agg(
            avg("credit_rating").alias("credit_rating_30d_avg"),
            linear_regression_slope("snapshot_date", "credit_rating").alias("credit_rating_30d_trend")
        ).alias("w30"), "supplier_id"
    ).join(
        window_90d.groupBy("supplier_id").agg(
            stddev("credit_rating").alias("credit_rating_volatility")
        ).alias("w90"), "supplier_id"
    )

    # Step 5: Add metadata
    features = features.withColumn("snapshot_id", uuid()) \
        .withColumn("snapshot_date", current_timestamp()) \
        .withColumn("feature_version", lit("v1"))

    # Step 6: Write to Feature Store
    features.write.mode("append") \
        .partitionBy("snapshot_date") \
        .saveAsTable("features.supplier_monitoring_snapshots")
```

**Databricks Workflow:** Scheduled  (cron: `0 * * * *`)

---

## 3. Alert Pipeline (Runtime Detection + Delivery)

### **3.1 Alert Detection Logic**

**Rule-Based Approach:**

```python
# Pseudo-code (Databricks Notebook)

def detect_deterioration_alerts():
    """
    Rule-based anomaly detection
    """

    # Fetch latest snapshots
    latest = spark.table("features.supplier_monitoring_snapshots") \
        .filter("snapshot_date = (SELECT MAX(snapshot_date) FROM ...)")

    # Apply business rules
    alerts = []

    for row in latest.collect():
        supplier = row.asDict()

        # Rule 1: Credit rating trend
        if supplier["credit_rating_30d_trend"] < -0.10:
            alerts.append({
                "supplier_id": supplier["supplier_id"],
                "alert_type": "credit_rating_decline",
                "severity": "HIGH",
                "message": f"Credit rating declining 10% monthly",
                "evidence": f"30d trend: {supplier['credit_rating_30d_trend']:.2f}"
            })

        # Rule 2: Payment behavior
        if supplier["payment_late_pct"] > 0.20:
            alerts.append({
                "supplier_id": supplier["supplier_id"],
                "alert_type": "payment_late",
                "severity": "MEDIUM",
                "message": f"20%+ invoices past due",
                "evidence": f"{supplier['payment_late_pct']*100:.0f}% late"
            })

        # Rule 3: UBO changes
        if supplier["ubo_changed_flag"]:
            alerts.append({
                "supplier_id": supplier["supplier_id"],
                "alert_type": "ownership_change",
                "severity": "HIGH",
                "message": "Ownership structure changed",
                "evidence": "New UBO detected via Sayari"
            })

    return alerts
```

**ML-Enhanced Approach:**

```python
# Pseudo-code

def predict_deterioration_ml():
    """
    LightGBM inference for 3-month prediction
    """

    # Load ML model from MLflow
    model = mlflow.pyfunc.load_model("models:/deterioration_lgbm/Production")

    # Fetch features
    features = spark.table("features.supplier_monitoring_snapshots") \
        .filter("snapshot_date = (SELECT MAX(snapshot_date) FROM ...)")

    # ML inference
    predictions = model.predict(features)

    # Filter high-probability alerts
    alerts = predictions.filter("probability > 0.80").select(
        "supplier_id",
        "probability",
        "shap_top3_features" # SHAP explanations
    )

    # Format alerts
    return alerts.withColumn("alert_type", lit("ml_prediction")) \
        .withColumn("severity", lit("HIGH")) \
        .withColumn("message",
            concat(
                round(col("probability")*100, 0),
                lit("% probability credit downgrade in 3 months")
            ))
```

---

### **3.2 Alert Storage Schema**

```sql
-- Alert history table
staging_wsp.gold.alert_history (
    alert_id STRING PRIMARY KEY, -- UUID
    created_at TIMESTAMP,
    supplier_id STRING,
    supplier_name STRING,

    -- Alert Details
    alert_type STRING, -- credit_rating_decline | payment_late | ownership_change | ml_prediction
    severity STRING, -- HIGH | MEDIUM | LOW
    message STRING, -- Human-readable
    evidence STRING, -- Supporting data

    -- ML-specific features
    ml_probability FLOAT, -- NULL for rule-based
    ml_shap_factors ARRAY<STRUCT<feature STRING, impact FLOAT>>, -- Top 3

    -- Delivery Status
    delivered_at TIMESTAMP,
    delivery_channels ARRAY<STRING>, -- ["teams", "email"]
    recipients ARRAY<STRING>, -- ["procurement@skoda.cz"]

    -- Resolution
    resolved_at TIMESTAMP,
    resolved_by STRING,
    resolution_notes STRING
)

-- Partitioned by created_at (YYYY-MM-DD)
PARTITIONED BY (DATE(created_at))
```

---

### **3.3 Alert Delivery Pipeline**

```python
# Pseudo-code (Azure Function or Databricks Notebook)

def deliver_alerts(alerts):
    """
    Send notifications to configured channels
    """

    for alert in alerts:
        # Step 1: Enrich with supplier details
        supplier = get_supplier_details(alert["supplier_id"])

        # Step 2: Format message
        message = format_alert_message(alert, supplier)

        # Step 3: Determine recipients (based on severity)
        if alert["severity"] == "HIGH":
            recipients = ["procurement_manager@skoda.cz", "category_manager@skoda.cz"]
            channels = ["teams", "email"]
        elif alert["severity"] == "MEDIUM":
            recipients = ["buyer@skoda.cz"]
            channels = ["email"]
        else:
            recipients = []
            channels = ["dashboard"] # Low severity → Power BI only

        # Step 4: Deliver notifications
        if "teams" in channels:
            teams_webhook.post(message)

        if "email" in channels:
            email_service.send(
                to=recipients,
                subject=f"🚨 Supplier Alert: {supplier['name']}",
                body=message
            )

        # Step 5: Log delivery
        insert_alert_log(alert_id, channels, recipients)
```

**Azure Functions Trigger:** HTTP webhook from Databricks Workflow

---

### **3.4 Alert Message Format**

```
🚨 SUPPLIER RISK ALERT

Supplier: FLIDR PLAST s.r.o.
DUNS: 495185217
Risk Level: HIGH
Detected: 2025-10-09 14:23:15

Evidence:
- Credit rating declining 10% monthly (78 → 70 in 30 days)
- 23% of invoices past due (was 5% last month)
- Industry benchmark: 1.2 std dev below peer average

Recommended Actions:
- Increase safety stock (+20%)
- Request updated financial statements
- Activate alternative supplier (SUPPLIER_Y)
- SLA: Respond within 4 hours

View Details: https://ntier.skoda/supplier/495185217
Dismiss Alert: https://ntier.skoda/alert/abc123/dismiss
```

---

## 4. Data Retention & Archival

### **Retention Policies:**

| Table             | Retention | Archival                 | Rationale        |
| ----------------- | --------- | ------------------------ | ---------------- |
| **Gold Layer**    | 24 months | → Cold storage (Parquet) | Audit trail      |
| **Feature Store** | 12 months | → Archive table          | ML training data |
| **Alert History** | 36 months | → Cold storage           | Compliance       |

### **Implementation:**

```sql
-- Databricks Workflow (monthly)
DELETE FROM features.supplier_monitoring_snapshots
WHERE snapshot_date < current_date() - INTERVAL 12 MONTHS;

-- Archive before deletion
INSERT INTO features.supplier_monitoring_snapshots_archive
SELECT * FROM features.supplier_monitoring_snapshots
WHERE snapshot_date < current_date() - INTERVAL 12 MONTHS;
```

---

## 5. Performance Optimization

### **5.1 Partitioning Strategy**

```sql
-- Feature Store (partitioned by date)
CREATE TABLE features.supplier_monitoring_snapshots (...)
PARTITIONED BY (snapshot_date DATE)
CLUSTER BY (supplier_id); -- Delta Lake optimization

-- Alert History (partitioned by date)
CREATE TABLE gold.alert_history (...)
PARTITIONED BY (DATE(created_at))
CLUSTER BY (supplier_id);
```

### **5.2 Z-Ordering (Delta Lake)**

```sql
-- Optimize for queries by supplier_id
OPTIMIZE features.supplier_monitoring_snapshots
ZORDER BY (supplier_id);

-- Optimize for queries by alert_type + severity
OPTIMIZE gold.alert_history
ZORDER BY (alert_type, severity);
```

### **5.3 Caching**

```python
# Cache frequently accessed tables in Databricks
spark.table("gold.ti_supplier_metrics").cache()
spark.table("features.supplier_monitoring_snapshots").cache()
```

---

## 6. Unity Catalog Permissions

### **Access Control:**

```sql
-- Grant permissions to monitoring pipeline service account
GRANT SELECT ON staging_wsp.gold.ti_supplier_metrics TO `monitoring_pipeline_sa`;
GRANT INSERT ON staging_wsp.features.supplier_monitoring_snapshots TO `monitoring_pipeline_sa`;
GRANT INSERT ON staging_wsp.gold.alert_history TO `monitoring_pipeline_sa`;

-- Grant read-only to business users
GRANT SELECT ON staging_wsp.gold.alert_history TO `ntier_business_users`;
GRANT SELECT ON staging_wsp.features.supplier_monitoring_snapshots TO `ntier_business_users`;
```

---
