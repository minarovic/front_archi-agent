# TierIndex Architecture Workshop - Architect Focus Brief

**Datum workshopu:** ~2025-10-29 (za týden)
**Audience:** Solution Architects (AICC, DAPI)
**Účel:** Rozhodnout kritická architektonická rozhodnutí pro TierIndex systém
**Formát:** Půldenní workshop, fokus na rozhodnutí (ne edukace)

---

## Executive Summary

TierIndex = Předpočítaný "strom dodavatelů" mapující Tier 1 → Tier 2 → Tier 3 vztahy pro prediktivní monitoring dodavatelského řetězce.

**Strategický kontext:**
- Přechod od reaktivního → proaktivní řízení rizik
- Současně známo pouze 10-30% z Tier 2/3, cíl: systematická mapa
- Datové zdroje: SAP (Tier 1), Sayari API, D&B, web scraping + ML

**Architektonické principy:**
1. **Škálovatelnost** - návrh z finálního cílového stavu, vyhnout se "mělkým základům"
2. **Modularita** - Fork concept (každé oddělení vlastní Gold vrstva ze společného Silver)
3. **Pre-computing** - TierIndex se předpočítává (ne real-time), využít Sayari unlimited queries
4. **Iterativní dodávka** - komponenty samostatně, postupná obchodní hodnota

---

## KRITICKÉ ROZHODNUTÍ

### 1. Gold Vrstva Architektura 🔴 **MUST DECIDE**

**Problém:** Jak optimalizovat Gold vrstvu pro očekávaný velký počet souběžných uživatelů?

#### Varianta A: Jeden Gold s více tabulkami
**Architektura:**
```
Silver (Single Source of Truth)
  ↓
Gold (Centralized)
  ├─ table: logistics_view
  ├─ table: quality_view
  └─ table: finance_view
```

**Pro:**
- Centralizovaná správa (jeden deployment, jeden monitoring)
- Jednodušší governance (single point of control)
- Méně infrastruktury (shared resources)

**Proti:**
- Riziko performance při velkém počtu uživatelů (Logistika ~50, Kvalita ~30, další oddělení)
- Vzájemné ovlivňování dotazů (Logistika query blokuje Kvalita query)
- Složitější row-level security (musí být v každém query)

---

#### Varianta B: Více Gold vrstev (per oddělení) ⭐ **N-Tier doporučení**
**Architektura:**
```
Silver (Single Source of Truth)
  ↓
  ├─→ Gold_Logistics (dedicated)
  ├─→ Gold_Quality (dedicated)
  └─→ Gold_Finance (dedicated, future)
```

**Pro:**
- **Izolace** - Logistika Gold nezasahuje Kvalita Gold
- **Lepší výkon** - dedicated resources per oddělení
- **Škálovatelnost** - přidání nového oddělení = nová Gold vrstva (nezasahuje existující)
- **Autonomie** - každé oddělení může mít vlastní release cycle

**Proti:**
- Vyšší náročnost správy (více deployments, více monitoring)
- Duplicita dat (každá Gold drží kopii TierIndex base)
- Potenciální inconsistency (pokud Silver update není atomický)

---

**⚡ WORKSHOP DECISION:**
- [ ] **Varianta A** (jeden Gold) nebo **Varianta B** (více Goldů)?
- [ ] Pokud B: Jak zajistit konzistenci při update ze Silver? (cascade vs parallel)
- [ ] Feature Store: Shared napříč Gold vrstvami nebo per-Gold?

---

### 2. Platformová Kapacita 🔴 **MUST DECIDE**

**Otázky:**
- [ ] **P1:** Stávající datová platforma → má kapacitu pro TierIndex grafovou logiku?
  - Podporuje recursive CTEs? (SQL self-referential hierarchie)
  - Graph extensions dostupné? (Apache AGE, Neo4j, nebo custom)
  - Performance estimate: TierIndex full rebuild = 4-6h batch job (acceptable?)

- [ ] **P2:** Výpočetní nároky:
  - **Batch processing:** Weekly full rebuild (~5000 entities, 4-6h), daily incremental (~500 changes, 30 min)
  - **ML models:** Monthly training (financial stability, HS matching), daily inference (5000 entities)
  - **Alert generation:** Real-time rule evaluation (~100-500 events/den)
  - Potřeba autoscaling? Dedicated compute pool pro ML?

- [ ] **P3:** Úložiště:
  - Bronze: ~500GB raw (Sayari responses, web scraping)
  - Silver: ~100GB structured (TierIndex + faktovky)
  - Gold: ~50GB per oddělení (denormalizované)
  - Storage format: Delta Lake, Iceberg, Parquet?

---

### 3. TierIndex Sestavení 🟡 **IMPORTANT**

**Proces:**
1. **Tier 1** (SAP) → denní export, IDOC nebo API
2. **Tier 2/3** (Sayari API) → rekurzivní dotazování:
   ```
   GET /api/v1/suppliers/{tier1_id}/relationships
   → vrací subdodavatele s probability (0.0-1.0)
   → rekurze: Pro každý Tier 2 → query Tier 3
   ```
3. **Tier 2/3 doplňkově** (Web scraping + ML) → pro neznámé dodavatele

**Technické výzvy:**
- [ ] **Cirkulární vztahy:** A dodává B, B dodává C, C dodává A → jak řešit cycles?
  - DFS/BFS cycle detection? Ignore cycles? Flag for manual review?
- [ ] **Confidence threshold:** Ignorovat Sayari vztahy s `probability < X`?
  - Doporučení N-Tier: 0.3 (30%) - ale architects decide
- [ ] **Rekurze depth:** Zastavit na Tier 3 nebo jít hlouběji (Tier 4, 5)?
  - Trade-off: Kompletnost vs. výpočetní náročnost

---

### 4. Fork Concept - Update Strategie 🟡 **IMPORTANT**

**Problém:** Silver se updatuje → jak synchronizovat všechny Gold vrstvy?

#### Řešení A: Cascade Update (Waterfall)
```
Silver update
  ↓ (wait)
Gold_Logistics update
  ↓ (wait)
Gold_Quality update
  ↓ (wait)
Gold_Finance update
```

**Pro:** Jednoduché, seriové, snadné debug
**Proti:** Pomalé, jeden failed update blokuje ostatní

---

#### Řešení B: Parallel Update ⭐ **N-Tier doporučení**
```
Silver update
  ↓
  ├─→ Gold_Logistics (parallel)
  ├─→ Gold_Quality (parallel)
  └─→ Gold_Finance (parallel)
```

**Pro:** Rychlé, škálovatelné
**Proti:** Složitější orchestrace, potenciální inconsistency (partial failures)

---

**⚡ WORKSHOP DECISION:**
- [ ] Řešení A nebo B?
- [ ] Pokud B: Jak řešit partial failures? (retry? rollback? eventual consistency OK?)
- [ ] Transaction isolation: Jak zajistit, že Power BI nečte "half-updated" Gold?

---

### 5. ML Pipeline Placement 🟡 **IMPORTANT**

**Kde běží ML modely?**

**Option 1: Silver (Training) + Gold (Inference)**
- Training v Silver → features dostupné pro všechny Gold vrstvy
- Inference v Gold → každá Gold může mít vlastní model variantu

**Option 2: Centralized ML Pipeline (samostatná vrstva)**
- ML models mimo Bronze-Silver-Gold
- Outputs zapisuje do Silver jako faktovky

**Option 3: Per-Gold ML (decentralized)**
- Každá Gold vrstva vlastní ML pipeline
- Flexibilita, ale duplicita kódu

**⚡ WORKSHOP DECISION:**
- [ ] **ML1:** Kde běží training? Kde běží inference?
- [ ] **ML2:** Výstupy ML modelů → materializace kam? (Silver faktovky? Gold denormalized?)
- [ ] **ML3:** MLOps platform: Databricks MLflow, Azure ML, custom?

---

## Use Cases - Architektonický Dopad

### UC1: Finanční Nestabilita (Tier 2/3)
**Datový tok:**
```
Sayari API (ownership changes, litigation)
D&B API (credit scores, financials)
  ↓
Silver: fact_financial_events
  ↓
ML Model: financial_stability_score (0-100)
  ↓
Gold: denormalized alerts table
  ↓
Power BI: Alert dashboard pro nákupčí
```

**Architektonické otázky:**
- [ ] Real-time scoring nebo batch? (trade-off: latence vs. compute cost)
- [ ] Alert propagation: Tier 3 issue → jak rychle alertovat Tier 1?

---

### UC2: Impact Analysis (Dodavatel vypadne)
**Logika:**
```
Tier 3 supplier X vypadl
  ↓ (propagate up tree)
Find all Tier 2 depending on X
  ↓ (propagate up tree)
Find all Tier 1 depending on those Tier 2
  ↓
Quantify impact: % produkce, critical path, alternativy
```

**Architektonické otázky:**
- [ ] Real-time analýza nebo pre-computed scenarios?
  - Pre-compute: Všechny možné failure scénáře? (combinatorial explosion)
  - Real-time: Query TierIndex graph při výpadku? (latence?)
- [ ] Integrace s ERP (SAP) pro volume data?

---

### UC3: Compliance & Sankce
**Datový tok:**
```
Sayari Media + Semantic Vision (structured alerts)
  ↓
Silver: fact_media_alerts
  ↓
Match to TierIndex (supplier_id nebo fuzzy name matching)
  ↓
Propagate alert: Tier 3 issue → všechny Tier 1 dependencies
  ↓
Gold: compliance_dashboard
```

**Architektonické otázky:**
- [ ] Fuzzy matching strategie: Jak matchovat media mentions na supplier_id?
- [ ] False positive handling: Automated filtering nebo manual review?

---

## Datový Model - Klíčové Entity

### TierIndex (Core)
```sql
CREATE TABLE silver.tierindex (
  supplier_id STRING PRIMARY KEY,
  tier_level INT,  -- 1, 2, 3
  parent_supplier_id STRING,  -- self-reference (FK)
  relationship_probability FLOAT,  -- 0.0-1.0 (Sayari confidence)
  relationship_evidence STRING,  -- JSON (contracts, shipping, filings)
  hs_codes ARRAY<STRING>,  -- product categories
  last_updated TIMESTAMP
);
```

**Architektonické otázky:**
- [ ] Self-referential hierarchy → jak indexovat pro performance?
  - Materialized path? Nested sets? Closure table?
- [ ] Jak verzovat TierIndex? (baseline snapshots? event sourcing?)

---

### Faktové Tabulky (Silver)

**Společné faktovky:**
- `fact_sayari_ownership` - vlastnické změny
- `fact_sayari_risk_scores` - rizikové skóre
- `fact_dnb_financials` - finanční data (quarterly)
- `fact_media_alerts` - compliance/sankce (daily)

**Oddělené faktovky:**
- `fact_quality_audits` - audity kvality (Kvalita team)
- `fact_logistics_delays` - dodací problémy (Logistika team)

**Architektonické otázky:**
- [ ] Partitioning strategy: By date? By supplier? Hybrid?
- [ ] Retention policy: Jak dlouho držet historical events?

---

## Decision Checklist - MUST DECIDE Today

### Platforma (P)
- [ ] **P1:** Stávající platforma → kapacita pro grafovou logiku? (Ano/Ne)
- [ ] **P2:** Autoscaling pro batch jobs? (Ano/Ne/TBD)

### Gold Vrstva (G)
- [ ] **G1:** Jeden Gold vs. více Goldů? (A / B)
- [ ] **G2:** Pokud více Goldů: Cascade nebo Parallel update? (A / B)

### ML Pipeline (ML)
- [ ] **ML1:** Kde běží ML training? (Silver / Gold / Separate)
- [ ] **ML2:** Kde běží ML inference? (Silver / Gold / Separate)

### TierIndex (T)
- [ ] **T1:** Confidence threshold pro Sayari vztahy? (0.3 / jiná hodnota)
- [ ] **T2:** Rekurze depth limit? (Tier 3 / hlouběji)
- [ ] **T3:** Cycle detection strategy? (Ignore / Flag / Custom)

---

## Next Steps (Post-Workshop)

**Mandatory outputs:**
- [ ] **ADR (Architecture Decision Records)** - každé rozhodnutí zdokumentovat
- [ ] **Roadmap update** - iterativní fáze implementace
- [ ] **Open items** - co zůstalo nerozhodnuto (owner + deadline)
- [ ] **Implementation stories** - vytvořit v `scrum/stories/backlog/`

**Follow-up meetings:**
- [ ] DAP team: Unity Catalog permissions, workspace allocation
- [ ] N-Tier team: Implementation kick-off
- [ ] Stakeholders: Architecture decision communication

---

## Reference Dokumenty

**Pre-read (MUST):**
1. `scrum/architecture/physical_model.md` - Silver/Gold/API detail
2. `scrum/architecture/SLA.md` - Data freshness targets

**Technical deep-dive (OPTIONAL):**
3. `scrum/architecture/background_monitoring/background_monitoring_data_model.md` - Edge taxonomy, tier rules
4. `scrum/architecture/tierindex_slovnik_pojmu.md` - Terminologie

---

**Metadata:**
- **Vytvořeno:** 2025-10-22
- **Zdroj:** Distilled z `workshop_pripravaArchitectAICC.md` (focus na architektonická rozhodnutí)
- **Délka:** ~350 řádků (vs 600+ v původním brifu)
- **Účel:** Eliminovat information overload, fokus na kritická rozhodnutí
