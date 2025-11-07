# ML Combined Risk Scoring (SCR-02)

**Audience:** 🏗️ Architect, 👨‍💻 Developer, 📊 Data Scientist
**Purpose:** Multi-source risk scoring algorithm for supplier comparison
**Priority:** 🟡 HIGH
**Date:** October 9, 2025

---

## 1. Problem Definition

### What is "Combined Risk Score"?

**Combined Risk Score** = aggregated metric from 4 data sources, enabling:
- Quick comparison of 2+ suppliers (<2 seconds)
- Objective supplier ranking for sourcing decisions
- Identification of outliers with high/low risk

**4 data sources:**
1. **DnB (Financial Risk)** - credit rating, financial stress, viability
3. **Sayari (Geopolitical Risk)** - sanctions, adverse media, UBO complexity
4. **BeON (Quality Risk)** - defect rates, recall history, certifications
5. **SAP source (Operational Risk)** - payment behavior, invoice disputes, delivery performance

---

## 2. Scoring Algorithm

### 2.1 Single-Source Scores (Normalization)

**Each source provides **raw metrics** → normalize to **0-1 scale**.

**DnB Financial Risk Score:**

```python
# Pseudo-code: DnB financial risk normalization

def calculate_dnb_financial_score(supplier_id: str):
    # Step 1: Fetch DnB data
    dnb = get_dnb_profile(supplier_id)

    # Step 2: Normalize individual metrics (0-1, lower = better)

    # 2a. Credit rating (AAA=10 → 0.0, D=1 → 1.0)
    credit_rating_numeric = map_rating_to_numeric(dnb.credit_rating)  # AAA=10, D=1
    credit_score = (10 - credit_rating_numeric) / 9.0  # Invert to [0, 1]

    # 2b. Financial stress score (0-100, higher = worse)
    stress_score = dnb.financial_stress_score / 100.0

    # 2c. Viability rating (1-9, 1=lowest risk → 0.0, 9=highest risk → 1.0)
    viability_score = (dnb.viability_rating - 1) / 8.0

    # 2d. Payment behavior (0-100 days beyond terms, normalize to [0, 1])
    payment_days_beyond = dnb.payment_days_beyond_terms
    payment_score = min(1.0, payment_days_beyond / 90.0)  # Cap at 90 days

    # Step 3: Weighted average (equal weights for simplicity)
    financial_risk_score = (
        0.40 * credit_score +
        0.30 * stress_score +
        0.20 * viability_score +
        0.10 * payment_score
    )

    return {
        "financial_risk_score": financial_risk_score,  # [0, 1]
        "components": {
            "credit_rating": credit_score,
            "financial_stress": stress_score,
            "viability": viability_score,
            "payment_behavior": payment_score
        },
        "raw_values": {
            "credit_rating": dnb.credit_rating,
            "financial_stress_score": dnb.financial_stress_score,
            "viability_rating": dnb.viability_rating,
            "payment_days_beyond_terms": payment_days_beyond
        }
    }
```

**Sayari Compliance Risk Score:**

```python
# Pseudo-code: Sayari compliance risk normalization

def calculate_sayari_compliance_score(supplier_id: str):
    # Step 1: Fetch Sayari data
    sayari = get_sayari_profile(supplier_id)

    # Step 2: Normalize individual metrics

    # 2a. Sanctions count (0 = best, 5+ = worst)
    sanctions_count = len(sayari.sanctions)
    sanctions_score = min(1.0, sanctions_count / 5.0)  # Cap at 5

    # 2b. Adverse media count (last 90 days)
    adverse_media = len([
        m for m in sayari.adverse_media
        if (datetime.now() - m.date).days <= 90
    ])
    adverse_media_score = min(1.0, adverse_media / 10.0)  # Cap at 10

    # 2c. UBO complexity (1 layer = simple = 0.0, 5+ layers = complex = 1.0)
    ubo_layers = sayari.ubo_ownership_layers
    ubo_complexity_score = min(1.0, (ubo_layers - 1) / 4.0)  # Cap at 5 layers

    # 2d. Supply chain depth (1 tier = robust = 0.0, 5+ tiers = fragile = 1.0)
    supply_chain_depth = sayari.max_tier_depth
    depth_score = min(1.0, (supply_chain_depth - 1) / 4.0)  # Cap at 5 tiers

    # Step 3: Weighted average
    compliance_risk_score = (
        0.50 * sanctions_score +
        0.25 * adverse_media_score +
        0.15 * ubo_complexity_score +
        0.10 * depth_score
    )

    return {
        "compliance_risk_score": compliance_risk_score,  # [0, 1]
        "components": {
            "sanctions": sanctions_score,
            "adverse_media": adverse_media_score,
            "ubo_complexity": ubo_complexity_score,
            "supply_chain_depth": depth_score
        },
        "raw_values": {
            "sanctions_count": sanctions_count,
            "adverse_media_90d": adverse_media,
            "ubo_ownership_layers": ubo_layers,
            "supply_chain_depth": supply_chain_depth
        }
    }
```

**SAP Source Operational Risk Score:**

```python
# Pseudo-code: SAP source operational risk normalization (from dm_bs_purchase in DAP)

def calculate_operational_risk(supplier_id: str):
    # Step 1: Query SAP source datamart

    # 1a. Payment late % (last 3 months average)
    payment_late_pct = query(f"""
        SELECT AVG(payment_late_pct) as avg_payment_late
        FROM dap_gold_prod.dm_bs_purchase.factv_bs_purchase_ekl_metric_current
        WHERE supplier_id = '{supplier_id}'
          AND metric_month >= DATE_SUB(CURRENT_DATE, 90)
    """)["avg_payment_late"]

    # 1b. Credit note ratio (returns/corrections indicator)
    credit_note_ratio = query(f"""
        SELECT SUM(credit_note_amount) / NULLIF(SUM(STD_Price * menge), 0) as ratio
        FROM dap_gold_prod.dm_bs_purchase.factv_bs_purchase_ekl_metric_current
        WHERE supplier_id = '{supplier_id}'
          AND metric_month >= DATE_SUB(CURRENT_DATE, 90)
    """)["ratio"]

    # 1c. Price volatility (coefficient of variation)
    price_volatility = query(f"""
        SELECT STDDEV(STD_Price) / NULLIF(AVG(STD_Price), 0) as cv_price
        FROM dap_gold_prod.dm_bs_purchase.factv_bs_purchase_ekl_metric_current
        WHERE supplier_id = '{supplier_id}'
          AND metric_month >= DATE_SUB(CURRENT_DATE, 180)
    """)["cv_price"]

    # 1d. Purchase volume stability (6-month trend)
    volume_trend = query(f"""
        WITH monthly_vol AS (
            SELECT
                metric_month,
                SUM(menge) as total_quantity
            FROM dap_gold_prod.dm_bs_purchase.factv_bs_purchase_ekl_metric_current
            WHERE supplier_id = '{supplier_id}'
              AND metric_month >= DATE_SUB(CURRENT_DATE, 180)
            GROUP BY metric_month
        )
        SELECT ABS(REGR_SLOPE(total_quantity, UNIX_TIMESTAMP(metric_month))) as abs_slope
        FROM monthly_vol
    """)["abs_slope"]

    # Step 2: Normalize metrics

    # 2a. Payment late (0% = best, 50%+ = worst)
    payment_late_score = min(1.0, (payment_late_pct or 0) / 50.0)

    # 2b. Credit note ratio (0 = best, 10%+ = worst)
    credit_note_score = min(1.0, (credit_note_ratio or 0) / 0.10)

    # 2c. Price volatility (CV < 0.1 = stable = 0.0, CV > 0.5 = volatile = 1.0)
    volatility_score = min(1.0, (price_volatility or 0) / 0.5)

    # 2d. Volume instability (slope = 0 = stable = 0.0, high slope = 1.0)
    # Normalize by typical supplier volume range
    volume_instability_score = min(1.0, (volume_trend or 0) / 1000.0)

    # Step 3: Weighted average
    operational_risk_score = (
        0.40 * payment_late_score +
        0.30 * credit_note_score +
        0.20 * volatility_score +
        0.10 * volume_instability_score
    )

    return {
        "operational_risk_score": operational_risk_score,  # [0, 1]
        "components": {
            "payment_late": payment_late_score,
            "credit_note_ratio": credit_note_score,
            "price_volatility": volatility_score,
            "volume_instability": volume_instability_score
        },
        "raw_values": {
            "payment_late_pct_3m": payment_late_pct,
            "credit_note_ratio_3m": credit_note_ratio,
            "price_volatility_6m": price_volatility,
            "volume_trend_slope_6m": volume_trend
        }
    }
```

**BeOn Quality Risk Score:**

```python
# Pseudo-code: BeOn quality risk normalization

def calculate_beon_quality_score(supplier_id: str):
    # Step 1: Fetch BeON data
    beon = get_beon_profile(supplier_id)

    # Step 2: Normalize metrics

    # 2a. Defect rate (PPM - parts per million)
    defect_ppm = beon.defect_rate_ppm
    defect_score = min(1.0, defect_ppm / 1000.0)  # 1000 PPM = max

    # 2b. Recall count (last 24 months)
    recall_count = len([
        r for r in beon.recalls
        if (datetime.now() - r.date).days <= 730
    ])
    recall_score = min(1.0, recall_count / 3.0)  # 3+ recalls = max risk

    # 2c. Certification compliance (ISO 9001, IATF 16949, etc.)
    certifications_valid = len([
        c for c in beon.certifications
        if c.valid_until >= datetime.now().date()
    ])
    # Invert: more certs = lower risk
    cert_score = max(0.0, 1.0 - (certifications_valid / 3.0))  # 3+ certs = 0 risk

    # Step 3: Weighted average
    quality_risk_score = (
        0.50 * defect_score +
        0.30 * recall_score +
        0.20 * cert_score
    )

    return {
        "quality_risk_score": quality_risk_score,  # [0, 1]
        "components": {
            "defect_rate": defect_score,
            "recalls": recall_score,
            "certifications": cert_score
        },
        "raw_values": {
            "defect_rate_ppm": defect_ppm,
            "recall_count_24m": recall_count,
            "certifications_valid": certifications_valid
        }
    }
```

---

### 2.2 Combined Risk Score (Weighted Aggregation)

**Formula:**

```
Combined_Risk_Score = w1 * Financial + w2 * Compliance + w3 * Operational + w4 * Quality
```

**Default weights (configurable):**
- `w1 = 0.30` (Financial - DnB)
- `w2 = 0.30` (Compliance - Sayari)
- `w3 = 0.20` (Operational - SAP source)
- `w4 = 0.20` (Quality - BeOn)

**Implementation:**

```python
# Pseudo-code: Combined risk scoring

def calculate_combined_risk_score(supplier_id: str, weights: dict = None):
    # Step 1: Define default weights
    if weights is None:
        weights = {
            "financial": 0.30,
            "compliance": 0.30,
            "operational": 0.20,
            "quality": 0.20
        }

    # Validate weights sum to 1.0
    assert sum(weights.values()) == 1.0, "Weights must sum to 1.0"

    # Step 2: Fetch individual scores
    financial = calculate_dnb_financial_score(supplier_id)
    compliance = calculate_sayari_compliance_score(supplier_id)
    operational = calculate_sap_operational_score(supplier_id)
    quality = calculate_beon_quality_score(supplier_id)

    # Step 3: Calculate combined score
    combined_score = (
        weights["financial"] * financial["financial_risk_score"] +
        weights["compliance"] * compliance["compliance_risk_score"] +
        weights["operational"] * operational["operational_risk_score"] +
        weights["quality"] * quality["quality_risk_score"]
    )

    # Step 4: Identify top 3 risk factors (highest component scores)
    all_factors = []

    for source, data in [
        ("DnB Financial", financial),
        ("Sayari Compliance", compliance),
        ("SAP source Operational", operational),
        ("BeOn Quality", quality)
    ]:
        for component_name, component_score in data["components"].items():
            all_factors.append({
                "source": source,
                "factor": component_name,
                "score": component_score,
                "raw_value": data["raw_values"].get(component_name)
            })

    # Sort by score descending
    top_factors = sorted(all_factors, key=lambda x: x["score"], reverse=True)[:3]

    # Step 5: Calculate confidence score (based on data completeness)
    data_completeness = calculate_data_completeness([
        financial, compliance, operational, quality
    ])

    return {
        "supplier_id": supplier_id,
        "combined_risk_score": combined_score,  # [0, 1], lower = better
        "risk_level": classify_risk_level(combined_score),
        "confidence": data_completeness,
        "breakdown": {
            "financial": financial["financial_risk_score"],
            "compliance": compliance["compliance_risk_score"],
            "operational": operational["operational_risk_score"],
            "quality": quality["quality_risk_score"]
        },
        "top_risk_factors": top_factors,
        "weights": weights,
        "timestamp": datetime.now().isoformat()
    }
```

**Risk level classification:**

```python
def classify_risk_level(combined_score: float) -> str:
    if combined_score <= 0.30:
        return "LOW"
    elif combined_score <= 0.60:
        return "MEDIUM"
    else:
        return "HIGH"
```

---

### 2.3 Confidence Score (Data Completeness)

**Purpose:** Indicate reliability of Combined Risk Score based on missing data.

**Algorithm:**

```python
# Pseudo-code: Confidence calculation

def calculate_data_completeness(source_scores: list) -> float:
    # Step 1: Count non-null components across all sources
    total_components = 0
    available_components = 0

    for source_data in source_scores:
        for component_name, component_value in source_data["components"].items():
            total_components += 1

            # Check if component is available (not None, not default fill)
            raw_value = source_data["raw_values"].get(component_name)

            if raw_value is not None and raw_value != 0:  # 0 might be default fill
                available_components += 1

    # Step 2: Calculate completeness ratio
    completeness = available_components / total_components

    # Step 3: Map to confidence level
    if completeness >= 0.90:
        confidence_level = "HIGH"
    elif completeness >= 0.70:
        confidence_level = "MEDIUM"
    else:
        confidence_level = "LOW"

    return {
        "completeness_ratio": completeness,
        "confidence_level": confidence_level,
        "available_components": available_components,
        "total_components": total_components
    }
```

**Example:**
- All 4 sources available → `completeness = 1.0` → `confidence = HIGH`
- BeOn missing → `completeness = 0.75` → `confidence = MEDIUM`
- SAP source + BeOn missing → `completeness = 0.50` → `confidence = LOW`

---

## 3. Supplier Comparison

**Use case:** Compare 2 suppliers for sourcing decision.

```python
# Pseudo-code: Compare 2 suppliers

def compare_suppliers(supplier_a_id: str, supplier_b_id: str):
    # Step 1: Calculate scores for both
    score_a = calculate_combined_risk_score(supplier_a_id)
    score_b = calculate_combined_risk_score(supplier_b_id)

    # Step 2: Determine winner (lower score = better)
    if score_a["combined_risk_score"] < score_b["combined_risk_score"]:
        winner = supplier_a_id
        winner_score = score_a
        loser = supplier_b_id
        loser_score = score_b
    else:
        winner = supplier_b_id
        winner_score = score_b
        loser = supplier_a_id
        loser_score = score_a

    # Step 3: Calculate relative difference
    score_diff = abs(score_a["combined_risk_score"] - score_b["combined_risk_score"])
    percent_diff = (score_diff / max(score_a["combined_risk_score"], score_b["combined_risk_score"])) * 100

    # Step 4: Identify key differentiators (biggest delta in breakdown)
    deltas = {}
    for dimension in ["financial", "compliance", "operational", "quality"]:
        deltas[dimension] = abs(
            score_a["breakdown"][dimension] - score_b["breakdown"][dimension]
        )

    # Sort by delta descending
    key_differentiators = sorted(
        deltas.items(),
        key=lambda x: x[1],
        reverse=True
    )[:2]  # Top 2

    return {
        "comparison_id": f"{supplier_a_id}_vs_{supplier_b_id}",
        "winner": winner,
        "winner_score": winner_score["combined_risk_score"],
        "loser": loser,
        "loser_score": loser_score["combined_risk_score"],
        "score_difference": score_diff,
        "percent_difference": percent_diff,
        "key_differentiators": [
            {
                "dimension": dim,
                "delta": delta,
                "winner_value": winner_score["breakdown"][dim],
                "loser_value": loser_score["breakdown"][dim]
            }
            for dim, delta in key_differentiators
        ],
        "recommendation": generate_recommendation(winner_score, loser_score),
        "timestamp": datetime.now().isoformat()
    }
```

**Example output:**

```json
{
  "comparison_id": "SUPPLIER_A_vs_SUPPLIER_B",
  "winner": "SUPPLIER_B",
  "winner_score": 0.32,
  "loser": "SUPPLIER_A",
  "loser_score": 0.55,
  "score_difference": 0.23,
  "percent_difference": 41.8,
  "key_differentiators": [
    {
      "dimension": "compliance",
      "delta": 0.18,
      "winner_value": 0.15,
      "loser_value": 0.33
    },
    {
      "dimension": "operational",
      "delta": 0.12,
      "winner_value": 0.28,
      "loser_value": 0.40
    }
  ],
  "recommendation": "SUPPLIER_B has 23% lower overall risk. Key advantages: cleaner compliance record (no sanctions) and better operational performance (lower payment delays).",
  "timestamp": "2025-10-09T15:00:00Z"
}
```

---

## 4. LLM Explanation Generation

**Input:** Combined risk score + breakdown + top factors
**Output:** Natural language explanation (2-3 sentences)

```python
# Pseudo-code: Generate LLM explanation

def generate_risk_explanation(combined_score: dict):
    # Step 1: Prepare context for LLM
    prompt = f"""
You are a procurement risk analyst. Explain the following supplier risk assessment in 2-3 clear sentences.

Supplier: {combined_score["supplier_id"]}
Combined Risk Score: {combined_score["combined_risk_score"]:.2f} ({combined_score["risk_level"]})
Confidence: {combined_score["confidence"]["confidence_level"]}

Breakdown:
- Financial Risk: {combined_score["breakdown"]["financial"]:.2f} (DnB)
- Compliance Risk: {combined_score["breakdown"]["compliance"]:.2f} (Sayari)
- Operational Risk: {combined_score["breakdown"]["operational"]:.2f} (SAP source)
- Quality Risk: {combined_score["breakdown"]["quality"]:.2f} (BeOn)

Top 3 Risk Factors:
1. {combined_score["top_risk_factors"][0]["source"]} - {combined_score["top_risk_factors"][0]["factor"]}: {combined_score["top_risk_factors"][0]["score"]:.2f}
2. {combined_score["top_risk_factors"][1]["source"]} - {combined_score["top_risk_factors"][1]["factor"]}: {combined_score["top_risk_factors"][1]["score"]:.2f}
3. {combined_score["top_risk_factors"][2]["source"]} - {combined_score["top_risk_factors"][2]["factor"]}: {combined_score["top_risk_factors"][2]["score"]:.2f}

Generate a concise explanation focusing on:
1. Overall risk level and what it means
2. Key strengths or weaknesses (top factors)
3. Confidence in the assessment
"""

    # Step 2: Call LLM (Azure OpenAI)
    from openai import AzureOpenAI

    client = AzureOpenAI(
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        api_version="2024-05-01-preview"
    )

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a concise risk analyst."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        max_tokens=150
    )

    explanation = response.choices[0].message.content

    return explanation
```

**Example explanation:**

> "SUPPLIER_A has a MEDIUM overall risk score (0.55) with MEDIUM confidence. The primary concern is compliance risk (0.33) driven by recent adverse media events and complex UBO ownership structure. Financial and quality metrics are relatively strong, but operational performance shows elevated payment delays (42% late payments in last 3 months). Based on available data (75% complete), this supplier requires closer monitoring for compliance issues."

---

## 5. Configurable Weights (User Customization)

**Use case:** Category Manager wants to prioritize quality over finance.

```python
# Pseudo-code: Custom weights configuration

# Default weights (balanced)
DEFAULT_WEIGHTS = {
    "financial": 0.30,
    "compliance": 0.30,
    "operational": 0.20,
    "quality": 0.20
}

# Custom weights: Quality-focused (automotive)
AUTOMOTIVE_WEIGHTS = {
    "financial": 0.20,
    "compliance": 0.25,
    "operational": 0.15,
    "quality": 0.40  # Prioritize quality
}

# Custom weights: Compliance-focused (regulated industries)
COMPLIANCE_HEAVY_WEIGHTS = {
    "financial": 0.20,
    "compliance": 0.50,  # Prioritize compliance
    "operational": 0.15,
    "quality": 0.15
}

# Usage
score_default = calculate_combined_risk_score("SUPPLIER_X")
score_auto = calculate_combined_risk_score("SUPPLIER_X", weights=AUTOMOTIVE_WEIGHTS)
score_regulated = calculate_combined_risk_score("SUPPLIER_X", weights=COMPLIANCE_HEAVY_WEIGHTS)
```

**Storage:** User-defined weight profiles → `Unity Catalog: staging_wsp.gold.risk_scoring_profiles`

```sql
-- Schema for custom weight profiles

CREATE TABLE staging_wsp.gold.risk_scoring_profiles (
    profile_id STRING PRIMARY KEY,
    profile_name STRING,
    description STRING,
    weight_financial DOUBLE,
    weight_compliance DOUBLE,
    weight_operational DOUBLE,
    weight_quality DOUBLE,
    created_by STRING,
    created_at TIMESTAMP,
    is_default BOOLEAN,
    CONSTRAINT weights_sum_check CHECK (
        weight_financial + weight_compliance + weight_operational + weight_quality = 1.0
    )
);

-- Example rows
INSERT INTO staging_wsp.gold.risk_scoring_profiles VALUES
('default', 'Balanced Risk', 'Equal weight to all dimensions', 0.30, 0.30, 0.20, 0.20, 'system', CURRENT_TIMESTAMP, true),
('automotive', 'Quality-Focused', 'Prioritize quality for automotive', 0.20, 0.25, 0.15, 0.40, 'category_manager_auto', CURRENT_TIMESTAMP, false),
('regulated', 'Compliance-Heavy', 'Prioritize compliance for regulated', 0.20, 0.50, 0.15, 0.15, 'category_manager_pharma', CURRENT_TIMESTAMP, false);
```

---

## 6. Batch Scoring (Ranking Multiple Suppliers)

**Use case:** Rank all Tier 1 suppliers monthly.

```python
# Pseudo-code: Batch scoring for ranking

def rank_suppliers_by_risk(supplier_ids: list, weights: dict = None):
    scores = []

    # Step 1: Score each supplier
    for supplier_id in supplier_ids:
        score = calculate_combined_risk_score(supplier_id, weights)
        scores.append(score)

    # Step 2: Sort by combined_risk_score ascending (lower = better)
    ranked = sorted(scores, key=lambda x: x["combined_risk_score"])

    # Step 3: Assign rank
    for i, score in enumerate(ranked):
        score["rank"] = i + 1
        score["percentile"] = (i + 1) / len(ranked) * 100

    # Step 4: Store results to Gold layer
    df = pd.DataFrame(ranked)

    df.to_sql(
        "supplier_risk_rankings",
        con=databricks_connection,
        schema="staging_wsp.gold",
        if_exists="replace",
        index=False
    )

    return ranked
```

**Output table schema:**

```sql
CREATE TABLE staging_wsp.gold.supplier_risk_rankings (
    ranking_id STRING PRIMARY KEY,
    supplier_id STRING,
    combined_risk_score DOUBLE,
    risk_level STRING,
    confidence_level STRING,
    rank INT,
    percentile DOUBLE,
    financial_score DOUBLE,
    compliance_score DOUBLE,
    operational_score DOUBLE,
    quality_score DOUBLE,
    ranking_date DATE,
    profile_id STRING  -- Reference to risk_scoring_profiles
);
```

---

## Related Docs

- [02_use_cases_proaktivni_monitoring.md](./02_use_cases_proaktivni_monitoring.md) - SCR-02 use case detail
- [03_data_model_proaktivni_monitoring.md](./03_data_model_proaktivni_monitoring.md) - Feature Store schema
- `ML_deterioration_prediction.md` - ML model for SCR-06

---

**Last Updated:** October 9, 2025
**Status:** Draft
**Next Steps:**
1. ✅ Validate SAP source metrics (payment_late, credit_note, STD_Price)
2. ⏸️ Define configurable weight profiles (automotive, regulated, etc.)
3. ⏸️ Implement LLM explanation pipeline (Azure OpenAI)
4. ⏸️ Create batch scoring Databricks job (monthly ranking)
