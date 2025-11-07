# Prezentace: Data Model - Proaktivní Monitoring
**Dokument:** `03_data_model_proaktivni_monitoring.html`
**Audience:** Data engineers, data architects, technical leads
**Účel:** Technický deep dive do Gold Layer, Feature Store a Alert Pipeline

---

## Slajd 1: Data Architecture Overview

### Co říkám:
> "Proaktivní monitoring stojí na 3 klíčových datových komponentách - každá má specifický účel."

### 3 komponenty:

1. **Gold Layer (Static Baseline)**
   - **Co:** Předpočítané metriky (TierIndex baseline)
   - **Frekvence:** Měsíční refresh
   - **Účel:** Fast query performance pro API/Power BI
   - **Retention:** 24 měsíců

2. **Feature Store (Time-Series Snapshots)**
   - **Co:** Hodinové snapshoty všech features pro ML
   - **Frekvence:** Hodinový ingest
   - **Účel:** Training data + real-time inference
   - **Retention:** 12 měsíců

3. **Alert Pipeline (Detection + Delivery)**
   - **Co:** Alert generation + notification delivery
   - **Frekvence:** Hodinová
   - **Účel:** Rule-based + ML monitoring
   - **Retention:** 36 měsíců (compliance audit trail)

### Proč 3 separátní komponenty?
"Každá má různé požadavky na latency, storage, retention. Gold Layer optimizujeme na speed, Feature Store na ML training, Alert Pipeline na audit compliance."

---

## Slajd 2: Gold Layer Schema

### Co říkám:
> "Gold Layer je předpočítaný TierIndex - optimalizováno na rychlé dotazy."

### SQL schema vysvětlit:

```sql
CREATE TABLE IF NOT EXISTS staging_wsp.gold.ti_supplier_metrics (
    duns_number STRING NOT NULL,
    supplier_name STRING,
    tier_level INT,

    -- Financial risk
    credit_rating INT,
    credit_rating_agency STRING,
    paydex_score INT,
    failure_score DECIMAL(5,2),
    delinquency_score DECIMAL(5,2),

    -- Compliance
    sanctions_count INT,
    adverse_media_count INT,
    ...
)
USING DELTA
LOCATION 'abfss://staging_wsp@gold/ti_supplier_metrics'
PARTITIONED BY (tier_level)
ZORDER BY (duns_number);
```

### Klíčové features:

**Financial risk columns:**
- `credit_rating` - DnB rating (0-100)
- `paydex_score` - Payment behavior score
- `failure_score` - Probability of failure (0-100)
- `delinquency_score` - Late payment likelihood

**Compliance columns:**
- `sanctions_count` - # of sanctions
- `adverse_media_count` - Negative news mentions

### Delta Lake features:

**PARTITIONED BY (tier_level):**
"Physical partition - queries na Tier-1 dodavatele (1500 rows) nečtou Tier-2/3/4 (13,500 rows). 10x rychlejší."

**ZORDER BY (duns_number):**
"Z-ORDER optimization - fyzické uspořádání dat v Parquet files. Queries s WHERE duns_number = '...' využijí data skipping → 50x rychlejší."

### Proč ne CLUSTER BY?
"CLUSTER BY sortuje data, ale nevytváří multi-dimensional index. Z-ORDER funguje i pro více column combinations (duns_number, tier_level apod.)."

---

## Slajd 3: Gold Layer - Unity Catalog Paths

### Co říkám:
> "Všechny Gold Layer tabulky jsou v Unity Catalog - centralizovaná governance."

### Tabulky vysvětlit:

| Table                       | Unity Catalog Path                           | Size   | Retention |
| --------------------------- | -------------------------------------------- | ------ | --------- |
| `ti_supplier_metrics`       | `staging_wsp.gold.ti_supplier_metrics`       | 2.1 GB | 24 měsíců |
| `ti_supplier_relationships` | `staging_wsp.gold.ti_supplier_relationships` | 8.5 GB | 24 měsíců |
| `ti_risk_scores`            | `staging_wsp.gold.ti_risk_scores`            | 450 MB | 24 měsíců |
| `ti_project_mapping`        | `staging_wsp.gold.ti_project_mapping`        | 1.2 GB | 24 měsíců |

### Unity Catalog benefits:

**1. RBAC (Role-Based Access Control):**
```sql
GRANT SELECT ON TABLE staging_wsp.gold.ti_supplier_metrics
TO `ntier_reader`;

GRANT ALL PRIVILEGES ON TABLE staging_wsp.gold.ti_supplier_metrics
TO `ntier_admin`;
```
"Dva roles: ntier_reader (read-only pro Power BI uživatele), ntier_admin (full access pro data engineers)."

**2. Data Lineage:**
"Databricks automatically tracks: Bronze → Silver → Gold transformations. Můžeme zpětně dohledat, kde feature vznikl."

**3. Schema Evolution:**
"ALTER TABLE ADD COLUMN automaticky propaguje schema changes. Backwards compatible - staré queries fungují."

### Retention policy enforcement:
```sql
DELETE FROM staging_wsp.gold.ti_supplier_metrics
WHERE snapshot_date < CURRENT_DATE - INTERVAL 24 MONTHS;
```
"Automated job běží měsíčně - GDPR compliance."

---

## Slajd 4: Feature Store Schema

### Co říkám:
> "Feature Store je srdce ML pipeline - historické snapshoty všech features."

### SQL schema vysvětlit:

```sql
CREATE TABLE IF NOT EXISTS staging_wsp.gold.fs_supplier_features (
    snapshot_timestamp TIMESTAMP NOT NULL,
    duns_number STRING NOT NULL,

    -- 6-month historical arrays (180 values = hourly for 6 months)
    credit_rating_6m ARRAY<INT>,
    revenue_trend_6m ARRAY<DECIMAL(15,2)>,
    sanctions_count_6m ARRAY<INT>,

    -- Derived features
    credit_rating_slope DECIMAL(10,4),  -- linear regression slope
    revenue_volatility DECIMAL(10,4),   -- std dev
    sanctions_velocity INT,             -- rate of change

    -- Macro context
    industry_benchmark_zscore DECIMAL(5,2),
    peer_group_volatility DECIMAL(5,2),

    -- Target variable (for supervised learning)
    label_downgrade_3m BOOLEAN,  -- Did credit rating drop >10pts in next 3 months?

    PRIMARY KEY (snapshot_timestamp, duns_number)
)
USING DELTA
LOCATION 'abfss://staging_wsp@gold/fs_supplier_features'
PARTITIONED BY (DATE(snapshot_timestamp))
ZORDER BY (duns_number);
```

### Co je důležité vysvětlit:

**Historické arrays:**
"`credit_rating_6m` = array 180 values (hodinové měření za 6 měsíců)"
"Proč 6 měsíců? ML model potřebuje vidět seasonal patterns."

**Derived features:**
"`credit_rating_slope` = linear regression slope (rostoucí/klesající trend)"
"`revenue_volatility` = standard deviation (stabilita/volatilita)"

**Target variable:**
"`label_downgrade_3m` = supervised learning label (TRUE pokud rating klesl o 10+ bodů za následující 3 měsíce)"

### Partitioning:
"PARTITIONED BY date - query na poslední 24h nečte 12 měsíců dat. Kritické pro performance."

---

## Slajd 5: Feature Store - Engineering Pipeline

### Co říkám:
> "Ukážu, jak vytváříme features z raw data - Python pseudo-code."

### Python pipeline vysvětlit:

```python
def compute_features(duns: str, snapshot_timestamp: datetime):
    # Step 1: Load 6-month history from Silver layer
    history = spark.sql(f"""
        SELECT timestamp, credit_rating, revenue, sanctions_count
        FROM staging_wsp.silver.ti_entity_risk
        WHERE duns_number = '{duns}'
          AND timestamp BETWEEN '{snapshot_timestamp - 180d}'
                            AND '{snapshot_timestamp}'
        ORDER BY timestamp
    """)

    # Step 2: Create historical arrays
    credit_rating_6m = history.select("credit_rating").collect()
    revenue_trend_6m = history.select("revenue").collect()
    sanctions_count_6m = history.select("sanctions_count").collect()

    # Step 3: Derive features
    credit_rating_slope = np.polyfit(
        x=range(len(credit_rating_6m)),
        y=credit_rating_6m,
        deg=1
    )[0]

    revenue_volatility = np.std(revenue_trend_6m)

    sanctions_velocity = (
        sanctions_count_6m[-30] - sanctions_count_6m[0]
    ) / 30  # rate per day

    # Step 4: Macro context (industry benchmark)
    peer_group = get_peer_group(duns, industry_code)
    industry_avg = np.mean([s.credit_rating for s in peer_group])
    industry_benchmark_zscore = (
        credit_rating_6m[-1] - industry_avg
    ) / np.std([s.credit_rating for s in peer_group])

    # Step 5: Label (for training data)
    future_3m = spark.sql(f"""
        SELECT credit_rating
        FROM staging_wsp.silver.ti_entity_risk
        WHERE duns_number = '{duns}'
          AND timestamp = '{snapshot_timestamp + 90d}'
    """)
    label_downgrade_3m = (
        future_3m.credit_rating < credit_rating_6m[-1] - 10
    )

    return {
        "credit_rating_6m": credit_rating_6m,
        "credit_rating_slope": credit_rating_slope,
        "revenue_volatility": revenue_volatility,
        "sanctions_velocity": sanctions_velocity,
        "industry_benchmark_zscore": industry_benchmark_zscore,
        "label_downgrade_3m": label_downgrade_3m
    }
```

### Krok po kroku:

**Step 1:** "Load 6-month history z Silver layer (raw snapshoty)"

**Step 2:** "Create arrays - ML model dostane celou time-series"

**Step 3:** "Derived features - slope (trend), volatility (stabilita), velocity (rychlost změn)"

**Step 4:** "Macro context - jak si dodavatel vede vs peer group? (z-score)"

**Step 5:** "Label - pokud máme future data, vytvoříme training label (downgrade za 3 měsíce?)"

### Proč derivované features?
"ML model by mohl počítat slope sám, ale snazší interpretability + rychlejší trénink pokud to dopočítáme předem."

---

## Slajd 6: Feature Store - Retention Policy

### Co říkám:
> "Feature Store má 12-měsíční retention - balancujeme ML training needs vs storage cost."

### Retention breakdown:

| Data Type                | Retention | Rationale                 |
| ------------------------ | --------- | ------------------------- |
| **Raw snapshots**        | 12 měsíců | Seasonal patterns pro ML  |
| **Derived features**     | 12 měsíců | Training data pro retrain |
| **Training checkpoints** | 6 měsíců  | MLflow experiment history |
| **Inference logs**       | 36 měsíců | Audit trail (compliance)  |

### Proč 12 měsíců?
"ML model potřebuje vidět seasonal patterns - Q4 má vždycky nižší credit ratings (holiday spending). 12 měsíců = 4 quarters."

### Proč NE více než 12 měsíců?
"Storage cost: 12 měsíců = 450 GB data. 24 měsíců = 900 GB. 12 měsíců je sweet spot pro cost/benefit."

### Archival strategy:
```sql
-- Move >12 month data to cold storage (Blob Storage)
CREATE TABLE IF NOT EXISTS archive.fs_supplier_features_archive
USING PARQUET
LOCATION 'abfss://archive@cold/fs_supplier_features'
AS SELECT * FROM staging_wsp.gold.fs_supplier_features
WHERE snapshot_timestamp < CURRENT_TIMESTAMP - INTERVAL 12 MONTHS;

-- Delete from hot storage
DELETE FROM staging_wsp.gold.fs_supplier_features
WHERE snapshot_timestamp < CURRENT_TIMESTAMP - INTERVAL 12 MONTHS;
```
"Cold storage je 10x levnější než Delta Lake - archivujeme pro compliance, ale nepotřebujeme query performance."

---

## Slajd 7: Alert Pipeline Schema

### Co říkám:
> "Alert Pipeline má 3 tabulky - rule engine, alert history, notification audit."

### Tabulka 1: Alert Rules (konfigurace)

```sql
CREATE TABLE IF NOT EXISTS staging_wsp.gold.alert_rules (
    rule_id STRING PRIMARY KEY,
    rule_name STRING,
    rule_type STRING,  -- 'threshold' | 'ml_prediction' | 'event_trigger'

    -- Threshold rules
    threshold_metric STRING,
    threshold_value DECIMAL(10,2),
    threshold_operator STRING,  -- '>', '<', '>=', etc.
    lookback_days INT,

    -- ML rules
    ml_model_id STRING,
    probability_threshold DECIMAL(3,2),

    -- Notification config
    severity STRING,  -- 'HIGH' | 'MEDIUM' | 'LOW'
    notification_channels ARRAY<STRING>,  -- ['email', 'teams']
    recipients ARRAY<STRING>,

    enabled BOOLEAN,
    created_by STRING,
    updated_at TIMESTAMP
)
USING DELTA;
```

**Proč separate table pro rules?**
"Umožňuje non-technical usery (Procurement Managers) upravovat prahy přes web UI - nemusí editovat code."

### Tabulka 2: Alert History (audit trail)

```sql
CREATE TABLE IF NOT EXISTS staging_wsp.gold.alert_history (
    alert_id STRING PRIMARY KEY,
    rule_id STRING,
    duns_number STRING,
    alert_timestamp TIMESTAMP,
    severity STRING,

    -- Evidence
    metric_name STRING,
    metric_value DECIMAL(10,2),
    threshold_value DECIMAL(10,2),

    -- ML explanation (if applicable)
    ml_probability DECIMAL(3,2),
    shap_top_factors ARRAY<STRUCT<feature: STRING, contribution: DECIMAL(5,2)>>,

    -- Delivery tracking
    notification_status STRING,  -- 'sent' | 'failed' | 'pending'
    notification_channels ARRAY<STRING>,
    delivered_at TIMESTAMP,

    -- User response
    acknowledged_by STRING,
    acknowledged_at TIMESTAMP,
    resolution_notes STRING,

    FOREIGN KEY (rule_id) REFERENCES staging_wsp.gold.alert_rules(rule_id)
)
USING DELTA
PARTITIONED BY (DATE(alert_timestamp))
ZORDER BY (duns_number);
```

**Proč 36-měsíční retention?**
"Compliance requirement - musíme prokázat due diligence. Audit trail: Kdy jsme detekovali problém? Kdo byl notifikován? Jak rychle reagovali?"

### Tabulka 3: Notification Audit

```sql
CREATE TABLE IF NOT EXISTS staging_wsp.gold.notification_audit (
    notification_id STRING PRIMARY KEY,
    alert_id STRING,
    channel STRING,  -- 'email' | 'teams'
    recipient STRING,
    sent_at TIMESTAMP,
    delivery_status STRING,  -- 'delivered' | 'bounced' | 'failed'
    error_message STRING,

    FOREIGN KEY (alert_id) REFERENCES staging_wsp.gold.alert_history(alert_id)
)
USING DELTA;
```

"Tracking delivery success - pokud email bounce, můžeme followup jiným kanálem."

---

## Slajd 8: Alert Pipeline - Execution Flow

### Co říkám:
> "Ukážu, jak běží monitoring job každou hodinu."

### Python pseudo-code:

```python
def hourly_monitoring_job():
    # Step 1: Load latest feature snapshot
    latest_snapshot = spark.sql("""
        SELECT * FROM staging_wsp.gold.fs_supplier_features
        WHERE snapshot_timestamp = (
            SELECT MAX(snapshot_timestamp)
            FROM staging_wsp.gold.fs_supplier_features
        )
    """)

    # Step 2: Load enabled alert rules
    rules = spark.sql("""
        SELECT * FROM staging_wsp.gold.alert_rules
        WHERE enabled = TRUE
    """)

    alerts_to_fire = []

    for rule in rules:
        if rule.rule_type == 'threshold':
            # Evaluate threshold rule
            violations = latest_snapshot.filter(
                f"{rule.threshold_metric} {rule.threshold_operator} {rule.threshold_value}"
            )
            for violation in violations:
                alerts_to_fire.append(create_alert(rule, violation))

        elif rule.rule_type == 'ml_prediction':
            # ML inference
            predictions = ml_model.predict(latest_snapshot)
            high_risk = predictions.filter(
                f"probability > {rule.probability_threshold}"
            )
            for pred in high_risk:
                alerts_to_fire.append(create_ml_alert(rule, pred))

    # Step 3: Insert into alert_history
    spark.createDataFrame(alerts_to_fire).write.mode("append").saveAsTable(
        "staging_wsp.gold.alert_history"
    )

    # Step 4: Deliver notifications
    for alert in alerts_to_fire:
        for channel in alert.notification_channels:
            if channel == 'email':
                send_email(alert)
            elif channel == 'teams':
                send_teams_message(alert)

        # Log delivery
        log_notification_audit(alert, channel, status)

    return len(alerts_to_fire)
```

### Krok po kroku:

**Step 1:** "Load latest snapshot z Feature Store (hodinový snapshot)"

**Step 2:** "Load enabled rules - pouze rules s `enabled=TRUE`"

**Threshold evaluation:**
"Jednoduchá podmínka: pokud `credit_rating < 70` → alert"

**ML inference:**
"ML model.predict() na celý latest snapshot → probability > 0.80 → alert"

**Step 3:** "Insert alerts do alert_history - audit trail"

**Step 4:** "Deliver notifications přes configured channels (email, Teams)"

### SLA enforcement:
"Job musí skončit do 15 minut (hodinový interval). Pokud trvá déle, escalate k data engineer."

---

## Slajd 9: Data Lineage (Bronze → Silver → Gold)

### Co říkám:
> "Ukážu, jak data putují od raw ingest do Gold Layer."

### Lineage diagram vysvětlit:

```
Bronze (Raw Data)
├── sayari_bulk_data (3.22 TiB)
├── dnb_api_responses (JSON)
└── sap_exports (CSV)
         ↓
Silver (Fact Tables)
├── ti_entity (20k dodavatelů)
├── ti_edge (200k vztahů)
├── ti_entity_risk (15k dodavatelů s risk atributy)
└── ti_entity_matches (Sayari ↔ SAP mapping)
         ↓
Gold (Pre-calculated Metrics)
├── ti_supplier_metrics (Baseline metriky)
├── fs_supplier_features (Feature Store)
└── alert_history (Alert audit trail)
         ↓
Consumption Layer
├── Power BI dashboards
├── FastAPI endpoints
└── React frontend
```

### Bronze → Silver transformations:

**Sayari Bulk → ti_entity:**
```python
# Extract entities from Sayari JSON
spark.read.json("bronze/sayari_bulk/").select(
    col("id").alias("sayari_id"),
    col("name"),
    col("country"),
    col("identifiers.duns").alias("duns_number")
).write.mode("overwrite").saveAsTable("silver.ti_entity")
```

**DnB API → ti_entity_risk:**
```python
# Parse DnB JSON responses
spark.read.json("bronze/dnb_api/").select(
    col("organization.duns").alias("duns_number"),
    col("financialStrength.dnbRating").alias("credit_rating"),
    col("principalsAndContacts.mostSeniorPrincipal").alias("ubo")
).write.mode("append").saveAsTable("silver.ti_entity_risk")
```

### Silver → Gold transformations:

**ti_entity_risk → ti_supplier_metrics:**
```sql
INSERT INTO gold.ti_supplier_metrics
SELECT
    duns_number,
    credit_rating,
    COUNT(*) OVER (PARTITION BY duns_number) AS sanctions_count,
    AVG(credit_rating) OVER (PARTITION BY industry_code) AS industry_avg
FROM silver.ti_entity_risk;
```

**Silver → fs_supplier_features:**
"Hodinový feature engineering job (viz předchozí slajd - `compute_features()` funkce)."

---

## Slajd 10: Unity Catalog Governance

### Co říkám:
> "Unity Catalog zajišťuje centralizovanou governance napříč všemi vrstvami."

### RBAC (Role-Based Access Control):

| Role           | Permissions                 | Použití                      |
| -------------- | --------------------------- | ---------------------------- |
| `ntier_reader` | SELECT na Gold layer        | Power BI uživatelé, analysts |
| `ntier_writer` | INSERT/UPDATE na Gold       | ETL jobs                     |
| `ntier_admin`  | ALL PRIVILEGES              | Data engineers               |
| `ntier_ml`     | SELECT Gold + Feature Store | ML engineers                 |

### SQL permissions vysvětlit:

```sql
-- Reader role
CREATE ROLE ntier_reader;
GRANT SELECT ON SCHEMA staging_wsp.gold TO ntier_reader;
GRANT USE CATALOG staging_wsp TO ntier_reader;

-- Writer role (ETL jobs)
CREATE ROLE ntier_writer;
GRANT SELECT, INSERT, UPDATE ON SCHEMA staging_wsp.gold TO ntier_writer;

-- Admin role (data engineers)
CREATE ROLE ntier_admin;
GRANT ALL PRIVILEGES ON SCHEMA staging_wsp.gold TO ntier_admin;
GRANT ALL PRIVILEGES ON SCHEMA staging_wsp.silver TO ntier_admin;
```

### Row-level security (RLS):

```sql
-- Restrict by tier level
CREATE ROW ACCESS POLICY tier1_only
AS (tier_level INT) RETURNS BOOLEAN
RETURN tier_level = 1;

ALTER TABLE staging_wsp.gold.ti_supplier_metrics
SET ROW FILTER tier1_only ON (tier_level);

GRANT POLICY tier1_only TO ntier_reader;
```

"Procurement Manager vidí jen Tier-1 dodavatele - ne Tier-2/3/4 (ochrana confidential data)."

---

## Slajd 11: Retention Policies Summary

### Co říkám:
> "Každá vrstva má jinou retention policy - driven by business needs a compliance."

### Tabulka vysvětlit:

| Layer       | Table                            | Retention | Rationale                        |
| ----------- | -------------------------------- | --------- | -------------------------------- |
| **Bronze**  | Raw data (Sayari, DnB, SAP)      | 36 měsíců | Compliance audit trail           |
| **Silver**  | Fact tables (ti_entity, ti_edge) | 24 měsíců | Data lineage traceability        |
| **Gold**    | ti_supplier_metrics              | 24 měsíců | Historical trend analysis        |
| **Gold**    | fs_supplier_features             | 12 měsíců | ML training seasonal data        |
| **Gold**    | alert_history                    | 36 měsíců | Compliance (due diligence proof) |
| **Archive** | Cold storage                     | 5+ let    | Legal hold, GDPR requests        |

### Automated cleanup jobs:

```python
# Monthly job - remove >24 month data from Gold
spark.sql("""
    DELETE FROM staging_wsp.gold.ti_supplier_metrics
    WHERE snapshot_date < CURRENT_DATE - INTERVAL 24 MONTHS
""")

# Archive before delete
spark.sql("""
    INSERT INTO archive.ti_supplier_metrics_archive
    SELECT * FROM staging_wsp.gold.ti_supplier_metrics
    WHERE snapshot_date < CURRENT_DATE - INTERVAL 24 MONTHS
""")
```

### GDPR considerations:
"Right to be forgotten - pokud dodavatel požádá o removal, musíme purge z všech layers včetně archivu."

---

## Q&A - Očekávané otázky

### Q: "Proč používáte Delta Lake místo Iceberg?"
**A:** "3 důvody:
1. **Native Databricks integration** - Delta Lake je first-class citizen
2. **Z-ORDER optimization** - Iceberg nemá equivalent
3. **ACID guarantees** - Delta Lake má better concurrency control

Iceberg je dobrá alternativa pokud multi-cloud, ale na DAP platformě je Delta Lake standard."

### Q: "Jak velkýstorage footprint má Feature Store?"
**A:** "Breakdown:
- **Raw snapshots:** 180 days × 15k suppliers × 50 features × 8 bytes = 108 GB
- **Derived features:** 50 GB
- **ML checkpoints:** 20 GB
- **Total:** ~450 GB (12 měsíců)

S compression (Parquet) je to ~180 GB on disk."

### Q: "Můžeme změnit retention policy?"
**A:** "Ano, ale zvažte:
- **Shorter retention (<12m):** ML model ztratí seasonal context
- **Longer retention (>12m):** Storage cost increase (linear)

Recommendation: Zachovat 12m pro hot storage, archivovat >12m do cold storage."

### Q: "Jak rychle můžeme přidat nový feature?"
**A:** "End-to-end timeline:
1. **Feature definition:** 1 den (data engineer + domain expert)
2. **Pipeline implementation:** 2-3 dny (Python ETL code)
3. **Backfill historical data:** 4-8 hodin (depends on feature complexity)
4. **Testing:** 1 den (validate feature quality)
5. **Production rollout:** 1 hodina (Databricks Workflow deploy)

Total: ~1 týden od idea do production."

---

## Závěr - Key Takeaways

### Co říkám:
> "Shrňme si 3 klíčové architektonické rozhodnutí."

### 1. Separace Gold Layer vs Feature Store
"Gold Layer = static baseline (měsíční refresh), Feature Store = time-series snapshots (hodinová). Různé use cases, různé optimalizace."

### 2. Unity Catalog governance
"RBAC, data lineage, schema evolution - all centralized. Zajišťuje compliance a security."

### 3. Konfigurovatelné retention policies
"24m/12m/36m retention driven by business needs. Archival strategy pro cold storage."

### Next steps:
"Ukážeme diagramy ETL pipeline a monitoring architektury v posledním dokumentu."
