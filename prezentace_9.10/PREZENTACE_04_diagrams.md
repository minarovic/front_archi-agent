# Prezentace: Diagramy - Proaktivní Monitoring
**Dokument:** `04_diagrams_proaktivni_monitoring.html`
**Audience:** Solutions architects, technical leads, data engineers
**Účel:** Vizualizace datových toků, procesů a architektur

---

## Slajd 1: Diagramy Overview

### Co říkám:
> "Tento dokument obsahuje 6 klíčových diagramů - každý ukazuje jiný aspect architektury."

### 6 diagramů:

1. **ETL Pipeline Diagram**
   - *Co ukazuje:* Tok dat z Bronze → Silver → Gold
   - *Pro koho:* Data engineers

2. **Monitoring Pipeline Architecture**
   - *Co ukazuje:* Hodinový monitoring workflow
   - *Pro koho:* Solutions architects

3. **SCR-06 Sequence Diagram**
   - *Co ukazuje:* Supplier Deterioration Prediction flow
   - *Pro koho:* Business analysts

4. **SCR-07 Sequence Diagram**
   - *Co ukazuje:* Crisis Impact Analysis flow
   - *Pro koho:* Procurement managers

5. **Alert State Machine**
   - *Co ukazuje:* Alert lifecycle (created → delivered → acknowledged)
   - *Pro koho:* Technical leads

6. **Feature Engineering Pipeline**
   - *Co ukazuje:* Jak vytváříme ML features
   - *Pro koho:* ML engineers

### Jak diagramy používat:
"Nejsou to statické obrázky - jsou to Mermaid.js diagrams v HTML files. Můžete je interaktivně prohlížet v browseru, zoom in/out, kliknout na node pro detail."

---

## Slajd 2: ETL Pipeline Diagram - Overview

### Co říkám:
> "První diagram ukazuje klasický Medallion pattern - Bronze → Silver → Gold."

### Diagram breakdown:

```
[Bronze Layer: Raw Data]
    ├── Sayari Bulk Data (3.22 TiB)
    ├── DnB API Responses (JSON)
    └── SAP Exports (CSV)
          ↓
    [ETL Jobs: Cleanse, Normalize, Enrich]
          ↓
[Silver Layer: Fact Tables]
    ├── ti_entity (20k suppliers)
    ├── ti_edge (200k relationships)
    ├── ti_entity_risk (15k suppliers with risk)
    └── ti_entity_matches (Sayari ↔ SAP mapping)
          ↓
    [Aggregation Jobs: Pre-calculate Metrics]
          ↓
[Gold Layer: Business-Ready Data]
    ├── ti_supplier_metrics (Baseline)
    ├── fs_supplier_features (Feature Store)
    └── alert_history (Audit trail)
          ↓
    [Consumption Layer]
    ├── Power BI Dashboards
    ├── FastAPI Endpoints
    └── React Frontend
```

### Co vysvětlit u každé vrstvy:

**Bronze Layer:**
- "Raw data immutable - nikdy nemodifikujeme originály"
- "Sayari Bulk = měsíční full snapshot (3.22 TiB)"
- "DnB API = daily incremental updates (JSON responses)"
- "SAP Exports = weekly extracts z dm_ba_purchase datamarts"

**ETL Jobs:**
- "Cleanse: Remove duplicates, fix encoding issues"
- "Normalize: Standardize DUNS numbers, country codes"
- "Enrich: Join Sayari ↔ DnB ↔ SAP (entity resolution)"

**Silver Layer:**
- "Normalized, denormalized fact tables"
- "Optimized pro joins a graph traversal"
- "24-měsíční retention"

**Gold Layer:**
- "Pre-calculated business metrics"
- "Optimized pro Power BI queries (<1s latency)"
- "12-36 měsíční retention (depends on table)"

**Consumption Layer:**
- "Read-only access přes APIs nebo direct SQL"
- "Power BI pro dashboards, FastAPI pro integrace"

---

## Slajd 3: ETL Pipeline Diagram - Scheduling

### Co říkám:
> "ETL jobs běží na různých frekvencích - podle data source refresh rates."

### Tabulka vysvětlit:

| Job                                | Frequency | Duration   | Dependencies           |
| ---------------------------------- | --------- | ---------- | ---------------------- |
| **Bronze Ingest: Sayari Bulk**     | Měsíčně   | 6-8 hodin  | None (full refresh)    |
| **Bronze Ingest: DnB API**         | Denně     | 2-3 hodiny | None (incremental)     |
| **Bronze Ingest: SAP Exports**     | Týdně     | 1 hodina   | None (weekly batch)    |
| **Silver ETL: ti_entity**          | Denně     | 30 min     | Bronze: Sayari, DnB    |
| **Silver ETL: ti_edge**            | Denně     | 45 min     | Bronze: Sayari         |
| **Silver ETL: ti_entity_risk**     | Denně     | 20 min     | Bronze: DnB, SAP       |
| **Gold ETL: ti_supplier_metrics**  | Týdně     | 1 hodina   | Silver: All tables     |
| **Gold ETL: fs_supplier_features** | Hodinově  | 15 min     | Silver: ti_entity_risk |

### Critical path analysis:
"Nejdelší path: Sayari Bulk Ingest (8h) → ti_entity ETL (30min) → ti_supplier_metrics (1h) = **9.5 hodin total**"

"Pokud Sayari Bulk začne v pátek 18:00, máme ready Gold Layer v sobotu 3:30 AM."

### Failure recovery:
"Všechny jobs jsou idempotent - můžeme re-run bez side effects. Delta Lake ACID guarantees zajišťují konzistenci."

---

## Slajd 4: Monitoring Pipeline Architecture

### Co říkám:
> "Druhý diagram ukazuje, jak běží real-time monitoring každou hodinu."

### Diagram breakdown:

```
[Feature Store] ← Hodinový snapshot
       ↓
[Monitoring Engine]
   ├── Rule-Based Checks (Thresholds)
   │   ├── Credit rating drop >10 pts?
   │   ├── Payment late >20%?
   │   ├── New sanctions detected?
   │   └── UBO ownership change?
   │
   └── ML-Based Predictions (LightGBM)
       ├── Load model from MLflow
       ├── Predict probability (3m horizon)
       └── SHAP explanations
       ↓
[Alert Engine]
   ├── Severity Scoring (HIGH/MEDIUM/LOW)
   ├── Deduplication (suppress duplicates <24h)
   └── Routing Logic
       ↓
[Notification Delivery]
   ├── HIGH → Teams + Email (instant)
   ├── MEDIUM → Email digest (daily)
   └── LOW → Power BI dashboard (weekly)
       ↓
[Audit Log] → alert_history table (36m retention)
```

### Co vysvětlit u každého bloku:

**Feature Store snapshot:**
"Každou hodinu: latest snapshot všech 15k dodavatelů (50+ features per supplier)"

**Monitoring Engine - Rule-Based:**
"4 základní rules: credit drop, payment late, sanctions, UBO change"
"Simple Python conditions - fast execution (<5 min)"

**Monitoring Engine - ML-Based:**
"LightGBM model z MLflow registry"
"Predict probability pro všech 15k suppliers → filter >80%"
"SHAP explanations pro top 3 contributing features"

**Alert Engine:**
"Severity scoring: HIGH pokud probability >80% + tier=1"
"Deduplication: Pokud alert pro stejný supplier <24h ago → suppress (anti-spam)"
"Routing logic: HIGH → Teams, MEDIUM → Email, LOW → Dashboard"

**Notification Delivery:**
"Multi-channel delivery přes configured recipients"
"Tracking delivery status v notification_audit table"

**Audit Log:**
"Každý alert zapisujeme do alert_history - compliance audit trail"

---

## Slajd 5: SCR-06 Sequence Diagram

### Co říkám:
> "Třetí diagram ukazuje, jak funguje Supplier Deterioration Prediction end-to-end."

### Sequence diagram krok po kroku:

```
User → API: "Monitor supplier DUNS 644479883"
API → Feature Store: Get latest snapshot
Feature Store → API: {credit_rating: 78, payment_late: 0.23, ...}
API → ML Model: Predict deterioration
ML Model → API: {probability: 0.82, SHAP: [credit_trend, payment_behavior]}
API → Alert Engine: Check threshold (>0.80)
Alert Engine → Notification Service: HIGH severity alert
Notification Service → Teams: Send webhook
Notification Service → Email: Send email
Notification Service → Audit Log: Log delivery
Audit Log → API: Acknowledged
API → User: Alert created, notifications sent
```

### Co vysvětlit u každého kroku:

**Step 1: User trigger**
"User může trigger monitoring ručně (API call) nebo automatic (hodinový cron job)"

**Step 2-3: Feature Store query**
"Fetch latest snapshot pro requested supplier - všechny features (credit rating, payment behavior, sanctions, etc.)"

**Step 4-5: ML inference**
"LightGBM model predikuje probability of deterioration za 3 měsíce"
"SHAP explanations: Které features nejvíc přispěly k high probability?"

**Step 6: Threshold check**
"Alert Engine: Je probability > configured threshold (default 0.80)?"

**Step 7: Severity routing**
"HIGH severity → immediate notification (Teams + Email)"

**Step 8-10: Multi-channel delivery**
"Teams webhook pro instant message"
"Email pro backup (pokud user není online na Teams)"
"Audit log pro compliance"

**Step 11-12: Acknowledgement**
"User dostane confirmation: Alert vytvořen, notifikace odeslány"

### SLA targets:
"End-to-end latency: <5 minut (od feature fetch do notification delivery)"

---

## Slajd 6: SCR-07 Sequence Diagram

### Co říkám:
> "Čtvrtý diagram ukazuje Crisis Impact Analysis workflow."

### Sequence diagram krok po kroku:

```
User → API: "Analyze crisis: SUPPLIER_X bankrupt"
API → Graph DB: Upstream traversal (who buys from X?)
Graph DB → API: [12 Tier-1 suppliers, 6 Tier-2 suppliers]
API → SAP API: Project mapping for affected suppliers
SAP API → API: [PROJECT_Y, PROJECT_Z critical]
API → TierIndex Gold: Alternative suppliers search
TierIndex Gold → API: [SUPPLIER_Y (92% match), SUPPLIER_Z (87% match)]
API → Synthesis Agent: Generate comprehensive report
Synthesis Agent → API: Crisis report (18 suppliers affected, 3 critical projects)
API → User: Display report
```

### Co vysvětlit u každého kroku:

**Step 1: User trigger**
"User input: 'SUPPLIER_X bankrupt' - může být manual nebo automatic (Sayari Notifications API detekuje insolvenci)"

**Step 2-3: Graph traversal**
"Upstream: Kdo kupuje od SUPPLIER_X? (incoming edges)"
"Downstream: Kdo dodává SUPPLIER_X? (outgoing edges)"
"Max depth: 2 hopy (Tier-1, Tier-2)"

**Step 4-5: Project mapping**
"Pro každého zasaženého dodavatele: které projekty ho používají?"
"SAP API query: dm_ba_purchase datamart → project assignments"

**Step 6-7: Alternative matching**
"Semantic search v TierIndex Gold: suppliers s podobnými capabilities (HS codes)"
"Match score = sémantická podobnost + capacity score"

**Step 8-9: Report synthesis**
"LLM orchestrátor kombinuje všechny data sources → comprehensive report"
"Strukturovaný output: Impacted suppliers, critical projects, alternatives, recommended actions"

**Step 10: Display**
"User dostane report v <4 minutách (vs 2-3 hodiny manuální Excel)"

### Key performance metrics:
- **Graph traversal:** <30s (20k entit, 200k vztahů)
- **Project mapping:** <1 min (SAP API call)
- **Alternative matching:** <2 min (semantic search 15k suppliers)
- **Report synthesis:** <1 min (LLM orchestration)
- **Total:** <4 min end-to-end

---

## Slajd 7: Alert State Machine

### Co říkám:
> "Pátý diagram ukazuje alert lifecycle - od created do resolved."

### State machine vysvětlit:

```
[Created] → First state when alert fires
    ↓
    ├── HIGH severity → [Notification Pending]
    │       ↓
    │   [Notification Sent]
    │       ↓
    │   [Acknowledged] ← User clicks "Acknowledge" in Teams/Email
    │       ↓
    │   [In Progress] ← User assigns to team member
    │       ↓
    │   [Resolved] ← User marks as resolved with notes
    │
    ├── MEDIUM severity → [Queued for Daily Digest]
    │       ↓
    │   [Digest Sent]
    │       ↓
    │   [Acknowledged]
    │       ↓
    │   [Resolved]
    │
    └── LOW severity → [Dashboard Visible]
            ↓
        [Reviewed] ← User reviews in Power BI
            ↓
        [Resolved]
```

### Transitions vysvětlit:

**[Created] → [Notification Pending]:**
"Alert se vytvoří v alert_history table"
"Status: `created`, notification_status: `pending`"

**[Notification Pending] → [Notification Sent]:**
"Notification Service doručí Teams/Email"
"Status: `notification_sent`, delivered_at timestamp"

**[Notification Sent] → [Acknowledged]:**
"User klikne 'Acknowledge' button v Teams message"
"Status: `acknowledged`, acknowledged_by, acknowledged_at"

**[Acknowledged] → [In Progress]:**
"User assigns alert k team member (e.g., Buyer)"
"Status: `in_progress`, assigned_to, assigned_at"

**[In Progress] → [Resolved]:**
"User marks jako resolved s resolution notes"
"Status: `resolved`, resolution_notes, resolved_at"

### Auto-close logic:
"Pokud alert není acknowledged do 7 dní → auto-close jako `stale`"
"Rationale: Pravděpodobně false positive nebo resolved externě"

---

## Slajd 8: Feature Engineering Pipeline

### Co říkám:
> "Poslední diagram ukazuje, jak vytváříme ML features z raw data."

### Pipeline breakdown:

```
[Silver Layer: Raw Snapshots]
    ├── ti_entity_risk (credit_rating, sanctions, UBO)
    ├── ti_edge (supplier relationships)
    └── SAP dm_bs_purchase (payment behavior)
        ↓
[Feature Extraction]
    ├── Historical Arrays (6-month windows)
    │   ├── credit_rating_6m [180 values]
    │   ├── revenue_trend_6m [180 values]
    │   └── sanctions_count_6m [180 values]
    │
    ├── Derived Features
    │   ├── credit_rating_slope (linear regression)
    │   ├── revenue_volatility (std dev)
    │   └── sanctions_velocity (rate of change)
    │
    └── Macro Context
        ├── industry_benchmark_zscore
        └── peer_group_volatility
        ↓
[Feature Store: fs_supplier_features]
    ├── Snapshot timestamp: Hourly
    ├── 50+ features per supplier
    └── 12-month retention
        ↓
[ML Training Pipeline]
    ├── Extract training data (labeled samples)
    ├── Train LightGBM model
    ├── Register model in MLflow
    └── Deploy to production
        ↓
[ML Inference Pipeline]
    ├── Load latest snapshot from Feature Store
    ├── Predict probability (3m horizon)
    ├── SHAP explanations
    └── Write predictions to alert_history
```

### Co vysvětlit u každého bloku:

**Feature Extraction - Historical Arrays:**
"6-month sliding window (180 hourly values)"
"Allows ML model to see temporal patterns"

**Feature Extraction - Derived Features:**
"`credit_rating_slope` = trend direction (up/down)"
"`revenue_volatility` = stability measure (low volatility = stable)"
"`sanctions_velocity` = acceleration (how fast sanctions increase)"

**Feature Extraction - Macro Context:**
"`industry_benchmark_zscore` = how supplier compares to peer group"
"`peer_group_volatility` = how volatile is entire industry (macro risk)"

**ML Training Pipeline:**
"Extract labeled samples: suppliers where we know ground truth (deterioration happened or not)"
"Train LightGBM: Gradient boosted decision trees"
"MLflow: Model registry + versioning + A/B testing"

**ML Inference Pipeline:**
"Load model from MLflow"
"Batch inference na všech 15k suppliers každou hodinu"
"SHAP: Explain predictions (which features contributed most)"

### Retraining frequency:
"Model se retrain týdně s novými labeled samples"
"MLflow experiment tracking: Srovnáváme nové verze vs production baseline"

---

## Slajd 9: Diagram Interactions

### Co říkám:
> "Ukážu, jak diagramy navzájem souvisí - není to 6 isolated views, ale integrated architecture."

### Vztahy mezi diagramy:

**ETL Pipeline ↔ Monitoring Pipeline:**
"ETL Pipeline populuje Feature Store → Monitoring Pipeline čte z Feature Store"

**Monitoring Pipeline ↔ SCR-06:**
"Monitoring Pipeline detekuje deterioration → SCR-06 sequence diagram shows user-facing workflow"

**SCR-06 ↔ Alert State Machine:**
"SCR-06 vytváří alert → Alert State Machine řídí lifecycle"

**ETL Pipeline ↔ Feature Engineering:**
"ETL Pipeline populuje Silver Layer → Feature Engineering pipeline čte z Silver"

**Feature Engineering ↔ SCR-06:**
"Feature Engineering vytváří features → SCR-06 používá ML model trained na těch features"

**SCR-07 ↔ ETL Pipeline:**
"SCR-07 queries TierIndex Gold → ETL Pipeline populuje Gold Layer"

### Master flow (all diagrams together):

```
1. ETL Pipeline: Bronze → Silver → Gold
2. Feature Engineering: Silver → Feature Store
3. Monitoring Pipeline: Feature Store → Alert Engine
4. SCR-06: Alert Engine → Notification Delivery
5. Alert State Machine: Notification → Acknowledged → Resolved
6. SCR-07: Crisis trigger → Graph traversal → Report
```

"Všech 6 diagramů společně tvoří complete architecture story - od raw data ingest (ETL) přes feature engineering a monitoring až po user-facing workflows (SCR-06, SCR-07)."

---

## Slajd 10: Mermaid.js Interactive Features

### Co říkám:
> "Důležitá poznámka - tyto diagramy jsou interaktivní v HTML files, ne statické obrázky."

### Co můžete dělat v browseru:

**1. Zoom & Pan:**
"Ctrl + Scroll = zoom in/out"
"Click + Drag = pan around diagram"

**2. Click on Nodes:**
"Kliknutím na node můžete otevřít detail (pokud je linkovaný)"
"Příklad: Node 'Feature Store' může odkazovat na data model dokumentaci"

**3. Export:**
"Right-click → Save as SVG/PNG"
"Můžete embedovat do PowerPoint prezentací"

**4. Live Editing:**
"Pokud máte přístup k Mermaid source code, můžete editovat diagram live"
"Changes se okamžitě reflektují v browseru"

### Proč Mermaid.js?
"Alternativa: Visio, Lucidchart, Draw.io"
"Výhody Mermaid:"
- ✅ **Version control friendly** - Diagramy jsou plain text (Markdown)
- ✅ **Auto-layout** - Nemusíte ručně pozicovat nodes
- ✅ **Embeddable** - Funguje v GitLab, GitHub, Confluence
- ✅ **Lightweight** - Žádná external dependency kromě JavaScript library

---

## Q&A - Očekávané otázky

### Q: "Můžeme přidat další diagramy?"
**A:** "Ano! Navrhované additional diagrams:
1. **Cost breakdown diagram** - Sayari vs DnB vs compute costs
2. **Security architecture** - Azure AD, Key Vault, SA DMZ accounts
3. **Disaster recovery** - Backup strategy, RTO/RPO targets
4. **CI/CD pipeline** - GitHub Actions → Azure DevOps migration plan

Každý diagram by měl mít clear purpose a target audience."

### Q: "Jak často se diagramy updatují?"
**A:** "Guidelines:
- **ETL Pipeline:** Update při změně data sources nebo ETL jobs
- **Monitoring Pipeline:** Update při změně alert rules nebo delivery channels
- **SCR-06/07:** Update při změně business logic
- **Feature Engineering:** Update při přidání nových features
- **Alert State Machine:** Update při změně workflow states

Recommendation: Review diagramy quarterly (každé 3 měsíce) - even if no changes, validate accuracy."

### Q: "Mermaid.js má performance issues pro large diagrams?"
**A:** "Ano, limitace:
- **Max ~50 nodes** - Větší diagramy jsou hard to read
- **Browser rendering** - Complex diagrams můžou být slow na old browsers

Solutions:
1. **Break into sub-diagrams** - Místo 1 giant diagram, udělejte 3 smaller
2. **Use zoom levels** - High-level overview + detailed sub-flows
3. **Export to SVG** - Pre-render pro embedding v dokumentech"

---

## Závěr - Key Takeaways

### Co říkám:
> "Shrňme si 3 hlavní insights z diagramů."

### 1. Layered architecture
"Bronze → Silver → Gold není jen buzzword - každá vrstva má clear purpose a optimization strategy."

### 2. Real-time monitoring workflow
"Hodinový cycle: Feature Store snapshot → Monitoring Engine → Alert delivery → <5 min end-to-end SLA."

### 3. Integrated system
"6 diagramů nejsou isolated views - všechno je propojené: ETL → Features → Monitoring → Alerts → User workflows."

### Next steps:
"Live demo: Projdeme si real alert example end-to-end - od feature snapshot po Teams notification."

---

**Tip pro prezentaci:**
- Otevřete HTML file v browseru během prezentace
- Ukažte interaktivní features (zoom, pan, click)
- Highlight critical paths (např. ETL Pipeline critical path = 9.5h)
- Relate diagramy k business use cases (SCR-06, SCR-07)
