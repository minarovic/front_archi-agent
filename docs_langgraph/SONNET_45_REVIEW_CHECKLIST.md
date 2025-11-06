# Sonnet 4.5 – Review Checklist: Archi-Agent Deep Dive

**Datum přípravy:** 6. listopadu 2025  
**Účel:** Komplexní příprava pro workshop review s Sonnet 4.5 zaměřený na přípravu deep dive prezentace pro architekty  
**Cíl:** Ověřit, že máme vše potřebné pro workshop, identifikovat mezery, doporučit další kroky

---

## 1. Kontext & Cíl Projektu

### ✅ Ověřovací checklist pro Sonnet

- [ ] **Jasná mise projektu:** Je v dokumentaci jednoznačně popsáno, co Metadata Copilot (MCOP) dělá a proč?
- [ ] **Cílová skupina:** Je jasné, pro koho je tool určený (business analyst, data architekt, procurement manager)?
- [ ] **Fáze projektu:** Je zřejmé, že jsme v MVP fázi (Tool 0-3 + Tool 7 hotové, Tool 4-6 plánované na Q1/Q2 2026)?
- [ ] **Závislosti:** Jsou jasné technické závislosti (Collibra, Databricks UC, SAP, Sayari API, DnB API, Azure SQL)?

### 📄 Hlavní dokumenty pro kontext

| Dokument | Lokace | Klíčové informace |
|----------|---------|-------------------|
| MCOP Architecture | \`docs_langgraph/mcop-architecture.md\` (1172 řádků) | Section 11 obsahuje Tool 4-6 roadmap, 8 nástrojů, 5-Node workflow, Azure AI Foundry |
| MVP Scope | \`scrum/backlog/mcop-mvp-v1-scope.md\` | Tool 0-3 + Tool 7 v MVP, Tool 4-6 plánované, quality gates Week 2/4/8/12 |
| Project Overview | \`scrum/backlog/mcop-project-overview.md\` | Historie, cílová skupina, business přínosy |
| Deep Workshop Brief | \`docs_langgraph/deep_workshop_architects_brief.md\` | Workshop focus, cílová skupina (architekti), procurement intelligence scénáře |

### 🎯 Shrnutí mise (pro Sonnet review)

**MCOP** = LangGraph agent propojující business požadavky s technickými metadaty (Collibra, Databricks Unity Catalog, SAP). Cíl: Automatizovat mapování požadavků na datové zdroje, eliminovat manuální práci business analytiků.

**MVP fokus:** Tool 0 (Business Request Parser), Tool 1 (Data Ingest), Tool 2 (Structural Analysis), Tool 3 (Quality Validator - plánovaný), Tool 7 (Governance Report).

---

## 2. Prioritní Backlog Stories (SCR-06, SCR-05, SCR-07, SCR-09)

### SCR-06: Sub-Supplier Mapping (N-Tier Visibility)

**Lokace:** \`backlog_nepuvodni/01_prioritized_backlog/SCR-06-subsupplier-mapping.md\`

**Status:** \`planned\` | **Typ:** \`story\` | **Priorita:** \`must-have\` | **Aktualizováno:** 2025-11-01

**Popis:**  
Jako procurement manager chci vidět sub-dodavatelskou síť (N-tier), abych identifikoval skryté závislosti.

**Acceptance Criteria:**
1. ✅ Integrace s Sayari API pro sub-supplier data
2. ✅ Grafová UI vizualizace dodavatelské sítě (Neo4j nebo Cytoscape.js)
3. ✅ Zobrazení rizikových uzlů v grafu (SPOF, high-risk countries)
4. ✅ Export do PDF/Excel
5. ✅ Cache mechanism (denní refresh)

**Závislosti:**
- **Závisí na:** Sayari API dostupnost, API mapping hotový
- **Blokuje:** SCR-05 (SPOF Detection), SCR-07 (Crisis Impact)

**Testovací data:**  
\`data/tool1/sayari_ingested.json\` - obsahuje sub-supplier hierarchii

**Skill Implementation:** null  
**Skill Status:** \`needs_design\`

**DoD Checklist:**
- [ ] Sayari API integration tested
- [ ] UI mockup approved
- [ ] Performance test (500+ suppliers, <3s load)
- [ ] Export functionality verified

**Poznámky pro Sonnet:**
- SCR-06 je foundational story - blokuje další 2 priority stories
- Vyžaduje ověření Sayari API license (viz Gap #1 níže)
- UI design není ještě finalizovaný (viz Gap #8 níže)

---

### SCR-05: SPOF Detection (Single Point of Failure)

**Lokace:** \`backlog_nepuvodni/01_prioritized_backlog/SCR-05-spof-detection.md\`

**Status:** \`planned\` | **Typ:** \`story\` | **Priorita:** \`must-have\` | **Aktualizováno:** 2025-11-01

**Popis:**  
Jako risk manager chci automaticky detekovat Single Point of Failure v dodavatelské síti.

**Acceptance Criteria:**
1. ✅ SPOF algoritmus implementovaný (viz \`calculated_metrics_specs.md\`)
2. ✅ Detekce critical path ve supply chain
3. ✅ Alert mechanismus pro nové SPOF (email/Teams)
4. ✅ Dashboard s SPOF přehledem (Power BI nebo Grafana)
5. ✅ Historical trend analýza (12-month rolling)

**Závislosti:**
- **Závisí na:** SCR-06 (sub-supplier mapping musí být hotové)
- **Blokuje:** SCR-07 (Crisis Impact)

**Technické detaily:**  
SPOF algoritmus popsán v \`backlog_nepuvodni/03_calculated_metrics/calculated_metrics_specs.md\`:
- Supplier Concentration Index
- Alternative Supplier Count
- Lead Time to Alternative
- Kombinovaný SPOF score (0-100)

**Python implementace:**  
Sekce 4.3 v \`calculated_metrics_specs.md\` (řádky 400-450) obsahuje kompletní Python kód.

**Skill Implementation:** null  
**Skill Status:** \`ready_to_execute\` (algoritmus existuje, potřebuje jen integraci)

**DoD Checklist:**
- [ ] SPOF algorithm unit tests (95% coverage)
- [ ] Alert mechanism tested (mock Teams webhook)
- [ ] Dashboard deployed (dev environment)
- [ ] Historical data backfill completed

**Poznámky pro Sonnet:**
- Algoritmus je již specifikovaný a funkční (Python kód v metrics spec)
- Hlavní práce = integrace do Tool 3 + alert setup
- Dashboard design není finální (viz Gap #8)

---

### SCR-07: Crisis Impact Simulation

**Lokace:** \`backlog_nepuvodni/01_prioritized_backlog/SCR-07-crisis-impact.md\`

**Status:** \`planned\` | **Typ:** \`story\` | **Priorita:** \`must-have\` | **Aktualizováno:** 2025-11-01

**Popis:**  
Jako procurement lead chci simulovat dopad krizových scénářů (požár ve fabrice, geopolitické sankce) na dodavatelský řetězec.

**Acceptance Criteria:**
1. ✅ Incident scenario engine (fire, flood, sanctions, bankruptcy)
2. ✅ Výpočet dopadů: % production stoppage, financial loss, affected customers
3. ✅ Tier-level propagation (ripple effects)
4. ✅ Response time <5 minut pro 500+ supplier network
5. ✅ PDF export s executive summary

**Závislosti:**
- **Závisí na:** SCR-06 (sub-supplier mapping), SCR-05 (SPOF detection), SCR-03 (Deterioration Index)
- **Blokuje:** SCR-09 (What-If Scenarios)

**Technické detaily:**  
Crisis Impact algoritmus v \`calculated_metrics_specs.md\` (Sekce 4.6):
\`\`\`python
def calculate_crisis_impact(supplier, scenario_type, network):
    """
    Params:
      supplier: Supplier entity affected
      scenario_type: 'fire' | 'flood' | 'sanctions' | 'bankruptcy'
      network: Graph of supplier relationships
    Returns:
      {
        "affected_customers": [...],
        "production_stoppage_pct": float,
        "financial_loss_usd": float,
        "alternative_suppliers": [...],
        "recovery_time_days": int
      }
    """
\`\`\`

**Performance SLA:** <5 minut pro network 500+ suppliers

**Skill Implementation:** null  
**Skill Status:** \`needs_design\` (scénář engine není detailně specifikovaný)

**DoD Checklist:**
- [ ] 4 scenario types implemented (fire, flood, sanctions, bankruptcy)
- [ ] Performance test passed (<5 min pro 500+ network)
- [ ] PDF export tested (executive summary format)
- [ ] Ripple effect calculation validated (manual QA)

**Poznámky pro Sonnet:**
- Velmi komplexní story - vyžaduje graph traversal algorithms
- SLA <5 min je kritické pro executive decision-making
- Scénář engine detaily chybí (viz Gap #4 níže)

---

### SCR-09: What-If Alternative Supplier Scenarios

**Lokace:** \`backlog_nepuvodni/01_prioritized_backlog/SCR-09-whatif-scenarios.md\`

**Status:** \`planned\` | **Typ:** \`story\` | **Priorita:** \`should-have\` | **Aktualizováno:** 2025-11-01

**Popis:**  
Jako strategic sourcing manager chci testovat "what-if" scénáře: Co když nahradím Supplier X za Supplier Y?

**Acceptance Criteria:**
1. ✅ UI pro definici "swap" scénářů (replace Supplier X with Y)
2. ✅ Výpočet rozdílů: cost delta, quality delta, risk delta, lead time delta
3. ✅ Porovnání side-by-side (before/after metrics)
4. ✅ Save/load scenario functionality (Azure Cosmos DB nebo SQL)
5. ✅ Multi-scenario comparison (up to 5 scenarios at once)

**Závislosti:**
- **Závisí na:** SCR-07 (Crisis Impact), SCR-03 (Deterioration Index), SCR-05 (SPOF)
- **Blokuje:** nic (leaf story)

**Technické detaily:**  
Scenario engine ukládá snapshoty metrik:
\`\`\`json
{
  "scenario_id": "uuid",
  "name": "Replace Supplier X with Y",
  "changes": [
    {"type": "swap", "old_supplier": "X", "new_supplier": "Y"}
  ],
  "metrics_before": {...},
  "metrics_after": {...},
  "deltas": {
    "cost_delta_usd": -50000,
    "quality_delta": +5,
    "risk_delta": -10,
    "lead_time_delta_days": +3
  }
}
\`\`\`

**Storage:** Azure SQL Database (table: \`scenarios\`)

**Skill Implementation:** null  
**Skill Status:** \`needs_design\` (UI + storage schema není hotový)

**DoD Checklist:**
- [ ] UI mockup approved (Figma nebo sketch)
- [ ] Scenario CRUD operations implemented (Create, Read, Update, Delete)
- [ ] Multi-scenario comparison UI tested (5 scenarios side-by-side)
- [ ] Performance test (100+ scenarios stored, <2s load)

**Poznámky pro Sonnet:**
- Nejméně kritická z 4 stories (should-have, ne must-have)
- Vyžaduje UI design (viz Gap #8)
- Storage schema potřebuje detailní návrh

---

### 📊 Souhrnná tabulka prioritních stories

| Story | Status | Priority | Závisí na | Blokuje | Skill Ready? | Kritické mezery |
|-------|--------|----------|-----------|---------|--------------|-----------------|
| **SCR-06** | planned | must-have | Sayari API | SCR-05, SCR-07 | ❌ needs_design | Sayari license ověření, UI design |
| **SCR-05** | planned | must-have | SCR-06 | SCR-07 | ✅ ready_to_execute | Dashboard design |
| **SCR-07** | planned | must-have | SCR-06, SCR-05, SCR-03 | SCR-09 | ❌ needs_design | Scenario engine spec, <5 min SLA test |
| **SCR-09** | planned | should-have | SCR-07, SCR-03, SCR-05 | nic | ❌ needs_design | UI mockup, storage schema |

---

## 3. Podpůrné Materiály

### 3.1 Implementation Timeline

**Dokument:** \`backlog_nepuvodni/00_implementation_roadmap/roadmap.md\`

**Obsah:**
- **Fáze 1 (Weeks 1-4):** Tool 0-1 implementace + Sayari API integration
- **Fáze 2 (Weeks 5-8):** Tool 2-3 implementace + SPOF algoritmy
- **Fáze 3 (Weeks 9-10):** Tool 7 (Governance Report) + SCR-06 (Sub-Supplier Mapping)
- **Fáze 4 (Weeks 11-12):** SCR-05, SCR-07 implementace + UAT

**Quality Gates:**
- Week 2: Tool 0 validation (compliance checker)
- Week 4: Tool 1 integration test (Sayari + DnB API)
- Week 8: Tool 2-3 validation + SPOF algorithm unit tests
- Week 12: End-to-end UAT

**Team Structure:** 6 FTE (2x backend dev, 1x data engineer, 1x UI dev, 1x QA, 1x product owner)

**Sonnet review question:**  
Je timeline realistický? 12 týdnů pro Tool 0-3 + Tool 7 + 2 priority stories?

---

### 3.2 Architecture Documentation

**Dokument:** \`docs_langgraph/mcop-architecture.md\` (1172 řádků)

**Klíčové sekce:**
- **Section 3:** 5-Node LangGraph workflow (Ingest → Structure → Validate → Generate → Report)
- **Section 7:** Azure AI Foundry setup (gpt-5-mini-2025-08-07, Sweden Central)
- **Section 11:** Tool 4-6 roadmap (Q1/Q2 2026) - Security Analyzer, ER Diagram Generator, Script Generator
- **Section 9:** Error handling & retry logic
- **Section 10:** Observability (Azure Application Insights, LangSmith tracing)

**Coverage:** ✅ Comprehensive - all 8 tools dokumentovány

**Sonnet review question:**  
Je architektura konzistentní napříč sekcemi? Jsou Tool 4-6 dependency na MVP jasné?

---

### 3.3 API Mapping & Integration

**Dokument:** \`backlog_nepuvodni/02_api_mapping/api_endpoints.md\`

**Pokrytí:**
- **Sayari API:** 35+ endpoints (100% coverage) - company search, ownership chain, sanctions check, UBO discovery
- **DnB API:** 7/12 endpoints (58% coverage) - company profile, financials, D&B rating; CHYBÍ risk alerts, trade references
- **Azure SQL Database:** Integration layer (5 tables: suppliers, products, contracts, metadata, audit_log)

**Rate Limits:**
- Sayari: 1000 req/hour
- DnB: 500 req/hour

**Authentication:** API keys (gitignored \`.env\` file)

**Sonnet review question:**  
Je DnB API coverage (58%) dostatečné pro MVP? Které chybějící endpointy jsou kritické?

---

### 3.4 Calculated Metrics Specifications

**Dokument:** \`backlog_nepuvodni/03_calculated_metrics/calculated_metrics_specs.md\` (1173 řádků)

**6 hlavních metrik:**

1. **Combined Risk Score (CRS)** - Sekce 4.1
   - Weighted sum: Country Risk (30%) + Financial Health (25%) + Supply Chain Complexity (20%) + Compliance (15%) + Performance History (10%)
   - Python kód: řádky 150-200

2. **Deterioration Index** - Sekce 4.2
   - 12-month rolling trend analýza
   - Detekuje negative trends ve financial health, delivery performance, quality metrics
   - Python kód: řádky 250-300

3. **SPOF Score** - Sekce 4.3
   - Supplier Concentration Index, Alternative Supplier Count, Lead Time to Alternative
   - Python kód: řádky 400-450

4. **Hidden Risk Accumulation** - Sekce 4.4
   - Sub-supplier risk propagation
   - Python kód: řádky 500-550

5. **Crisis Impact Score** - Sekce 4.6
   - Incident scenario simulation (fire, flood, sanctions, bankruptcy)
   - Python kód: řádky 650-700

6. **Alternative Supplier Similarity Score** - Sekce 4.7
   - Feature-based similarity (location, capacity, certifications, price)
   - Python kód: řádky 750-800

**Coverage:** ✅ All 6 metrics mají Python implementations

**Sonnet review question:**  
Jsou algoritmy dostatečně dokumentované pro implementation? Chybí nějaké edge cases?

---

### 3.5 Azure Integration Details

**Dokument:** \`backlog_nepuvodni/04_integration/azure_sql_schema.md\`

**Schema:**
- \`suppliers\` table (15 columns: supplier_id, name, country, tier_level, risk_score, ...)
- \`products\` table (10 columns: product_id, name, category, supplier_id FK, ...)
- \`contracts\` table (12 columns: contract_id, supplier_id FK, start_date, end_date, value_usd, ...)
- \`metadata\` table (8 columns: metadata_id, entity_type, entity_id, key, value, ...)
- \`audit_log\` table (6 columns: log_id, timestamp, user_id, action, details, ...)

**Indexy:**
- Primary keys: all tables
- Foreign keys: products.supplier_id, contracts.supplier_id, metadata.entity_id
- Additional indexes: suppliers.risk_score, contracts.end_date

**Migration Strategy:**
- Phase 1: Manual CSV import (data/tool1/)
- Phase 2: Automated ETL (Azure Data Factory)

**Sonnet review question:**  
Je schema dostatečně normalizované? Chybí nějaké důležité indexy pro performance?

---

### 3.6 Backlog Dependency Analysis

**Dokument:** \`backlog_nepuvodni/05_dependencies/backlog_info.md\`

**Dependency Graph (text description):**
\`\`\`
SCR-06 (Sub-Supplier Mapping)
  ├─ blocks → SCR-05 (SPOF Detection)
  │            └─ blocks → SCR-07 (Crisis Impact)
  │                        └─ blocks → SCR-09 (What-If Scenarios)
  └─ blocks → SCR-07 (Crisis Impact)
\`\`\`

**Critical Path:**  
SCR-06 → SCR-05 → SCR-07 → SCR-09 (must be implemented in sequence)

**Parallel Work Opportunities:**
- Tool 0-1 (nezávislé na SCR stories)
- Tool 2-3 (může běžet paralelně s SCR-06 implementation)

**Sonnet review question:**  
Jsou dependency jasně komunikované? Měli bychom mít Mermaid diagram místo text popisu?

---

### 📊 Souhrnná tabulka podpůrných materiálů

| Dokument | Lokace | Rozsah | Klíčové sekce | Coverage | Sonnet priority |
|----------|--------|--------|---------------|----------|-----------------|
| **Roadmap** | \`backlog_nepuvodni/00_implementation_roadmap/roadmap.md\` | 4 fáze, 12 týdnů | Quality gates, team structure | ✅ Complete | 🔴 HIGH - verify timeline realisticity |
| **Architecture** | \`docs_langgraph/mcop-architecture.md\` | 1172 řádků | 5-Node workflow, Tool 4-6 roadmap | ✅ Comprehensive | 🟡 MEDIUM - verify consistency |
| **API Mapping** | \`backlog_nepuvodni/02_api_mapping/api_endpoints.md\` | 47+ endpoints | Sayari 100%, DnB 58% | 🟡 Partial (DnB gaps) | 🔴 HIGH - assess DnB gap impact |
| **Metrics Specs** | \`backlog_nepuvodni/03_calculated_metrics/calculated_metrics_specs.md\` | 1173 řádků | 6 algorithms + Python code | ✅ Complete | 🟢 LOW - algorithms ready |
| **Azure Schema** | \`backlog_nepuvodni/04_integration/azure_sql_schema.md\` | 5 tables | Indexy, migration strategy | ✅ Complete | 🟡 MEDIUM - verify normalization |
| **Dependencies** | \`backlog_nepuvodni/05_dependencies/backlog_info.md\` | Text diagram | Critical path | 🟡 Text only | 🔴 HIGH - needs visual diagram |

---

## 4. Workshop Presentation Assets

### 4.1 Existující materiály

**Workshop Brief:**  
\`docs_langgraph/deep_workshop_architects_brief.md\`

**Obsah:**
- Target Audience: Architekti (20-30 účastníků)
- Focus Areas: Procurement intelligence, N-tier supply chain visibility, incident response scenarios
- Workshop Goals: Validovat architekturu, získat feedback na Tool 4-6 roadmap, diskutovat security & compliance
- Agenda (tentative): 2h session s live demo + Q&A

**Doplňkové dokumenty:**
- \`deep_workshop_architects/workshop_architect_focus.md\` - detailní focus areas
- \`deep_workshop_architects/workshop_logistics.md\` - logistika (datum, místnost, catering)
- \`deep_workshop_architects/validation_report.md\` - předpřipravené otázky pro feedback (⚠️ obsahuje 5 unverified assumptions, viz Gap #1)
- \`deep_workshop_architects/tierindex_update_workflow.md\` - workflow pro update Tier Indexu post-workshop

**JSON Examples (pro demo):**
- \`data/tool0_samples/*.json\` - ukázkové business requests
- \`data/tool1/sayari_ingested.json\` - sub-supplier hierarchie
- \`data/tool2/structure.json\` - klasifikované entities/metrics
- \`data/tool3/quality_report.json\` - quality validation (placeholder)

**Mermaid Diagrams:**
Embedované v \`mcop-architecture.md\` (Sekce 3: 5-Node workflow, Sekce 11: Tool 4-6 timeline)

---

### 4.2 Chybějící materiály (Gaps)

**🔴 CRITICAL - Pre-Workshop (48h před workshopem):**

1. **Prezentační slides**
   - **Status:** ❌ Neexistují
   - **Potřeba:** 20-slide deck pokrývající:
     - Slide 1-3: Project intro (mise, scope, timeline)
     - Slide 4-8: Architecture overview (5-Node workflow, Tool 0-7 popis)
     - Slide 9-12: Priority stories (SCR-06/05/07/09) s use cases
     - Slide 13-15: Live demo walkthrough (Tool 0 → Tool 3 chain)
     - Slide 16-18: Tool 4-6 roadmap + discussion points
     - Slide 19-20: Q&A + feedback collection
   - **Tool:** PowerPoint nebo Google Slides
   - **Zdroj:** \`workshop_architect_focus.md\` + \`mcop-architecture.md\`

2. **Demo walkthrough script**
   - **Status:** ❌ Neexistuje
   - **Potřeba:** 5-10 min demo script:
     - Step 1: Ukázat business request (Tool 0 input)
     - Step 2: Spustit Tool 0 parser → JSON output
     - Step 3: Spustit Tool 1 ingest → Sayari data pulled
     - Step 4: Spustit Tool 2 structure → Entities/metrics classified
     - Step 5: Spustit Tool 3 quality → Validation report (mock data OK, real Tool 3 není hotový)
     - Step 6: Ukázat Tool 7 output → Governance report (mock PDF)
   - **Tool:** Jupyter notebook (\`notebooks/demo_walkthrough.ipynb\`) nebo Python script
   - **Timing:** 5-10 min max (architects mají krátkou attention span)

3. **Decision capture template**
   - **Status:** ❌ Neexistuje
   - **Potřeba:** Strukturovaný formulář pro feedback:
     - Architecture approval: ✅ Approved | 🟡 Approved with concerns | ❌ Rejected
     - Tool 4-6 priority: Rank 1-3 (Security Analyzer, ER Generator, Script Generator)
     - Security concerns: Free text
     - Compliance concerns: Free text
     - Timeline feasibility: ✅ Realistic | 🟡 Tight but doable | ❌ Unrealistic
     - Open questions: Free text
   - **Tool:** Google Form nebo Excel template
   - **Distribuce:** Email 24h před workshopem

**🟡 MEDIUM - Post-Workshop (Week 1 po workshopu):**

4. **KPI Tracking Mechanism**
   - **Status:** ❌ Není dokumentováno
   - **Potřeba:** Jak měříme success post-MVP?
     - Business KPIs: Time saved (hours/week), accuracy improvement (%), user satisfaction (NPS)
     - Technical KPIs: API uptime (%), response time (p95), error rate (%)
     - Adoption KPIs: Active users, feature usage, support tickets
   - **Tool:** \`docs_langgraph/KPI_TRACKING.md\`
   - **Vlastník:** Product Owner

5. **RACI Matrix**
   - **Status:** ❌ Neexistuje
   - **Potřeba:** Kdo je Responsible, Accountable, Consulted, Informed pro:
     - Tool 0-3 implementation
     - Tool 4-6 design
     - API integration (Sayari, DnB)
     - Workshop follow-up
     - Production deployment
   - **Tool:** \`docs_langgraph/ROLES_AND_RESPONSIBILITIES.md\`
   - **Formát:** Tabulka (Role vs. Aktivita)

6. **Action Items Tracker**
   - **Status:** ❌ Neexistuje
   - **Potřeba:** Jak trackujeme action items z workshopu?
     - Template: \`ACTION_ITEMS.md\` (Task, Owner, Due Date, Status, Notes)
     - Integration: GitHub Issues nebo Jira
   - **Process:** Email summary 48h po workshopu s action items list

**🟢 LOW - Nice-to-Have:**

7. **Storyboard pro incident scenarios**
   - **Status:** ❌ Neexistuje, ale není kritické
   - **Potřeba:** Vizuální timeline pro SCR-07 (Crisis Impact):
     - T=0: Incident occurs (fire at Supplier X)
     - T=5 min: MCOP detects SPOF
     - T=10 min: Alternative suppliers identified
     - T=30 min: Executive report generated
   - **Tool:** Mermaid sequence diagram nebo Lucidchart
   - **Přidaná hodnota:** Pomůže architects vizualizovat real-time response

8. **UI Mockups pro SCR-06/09**
   - **Status:** ❌ Neexistují, ale UI není v MVP scope
   - **Potřeba:** Wireframe pro:
     - SCR-06: Grafová vizualizace dodavatelské sítě
     - SCR-09: What-If scenario comparison UI
   - **Tool:** Figma nebo Sketch
   - **Timeline:** Q1 2026 (post-MVP)

---

### 📊 Souhrnná tabulka workshop assets

| Asset | Status | Priority | Potřeba | Timeline | Owner |
|-------|--------|----------|---------|----------|-------|
| **Prezentační slides** | ❌ Missing | 🔴 CRITICAL | 20-slide deck | 48h před workshopem | Product Owner |
| **Demo script** | ❌ Missing | 🔴 CRITICAL | 5-10 min walkthrough | 48h před workshopem | Tech Lead |
| **Decision capture template** | ❌ Missing | 🔴 CRITICAL | Google Form | 24h před workshopem | Product Owner |
| **KPI tracking** | ❌ Missing | 🟡 MEDIUM | KPI_TRACKING.md | Week 1 post-workshop | Product Owner |
| **RACI matrix** | ❌ Missing | 🟡 MEDIUM | ROLES_AND_RESPONSIBILITIES.md | Week 1 post-workshop | Product Owner |
| **Action items tracker** | ❌ Missing | 🟡 MEDIUM | ACTION_ITEMS.md template | Week 1 post-workshop | Product Owner |
| **Incident storyboard** | ❌ Missing | 🟢 LOW | Mermaid diagram | Nice-to-have | Tech Lead |
| **UI mockups** | ❌ Missing | 🟢 LOW | Figma wireframes | Q1 2026 (post-MVP) | UI Designer |

---

## 5. Gaps & Missing Pieces

### 🔴 CRITICAL Gaps (musí být vyřešené před workshopem)

**Gap #1: Unverified Assumptions v \`validation_report.md\`**

**Problém:**  
Dokument \`deep_workshop_architects/validation_report.md\` obsahuje 5 assumptions, které nejsou ověřené:

1. **Sayari API license:** Máme enterprise tier? Rate limity 1000 req/hour jsou dostatečné?
2. **DnB API access:** 58% coverage je OK, ale chybějící endpointy (risk alerts, trade references) - lze doplnit později?
3. **Azure AI Foundry quota:** gpt-5-mini deployment má dostatečnou kapacitu pro production load?
4. **User count estimate:** Kolik business analytiků/procurement managers bude tool používat? (10? 50? 100?)
5. **Databricks UC permissions:** Máme read access k production Unity Catalog? Nebo jen dev/test?

**Dopad:**  
Pokud assumptions jsou špatné, může to zablokovat MVP implementation.

**Akce:**
- [ ] Ověřit s IT/procurement: Sayari license tier
- [ ] Ověřit s IT: DnB API access (které endpointy máme?)
- [ ] Ověřit s Azure admin: AI Foundry quota limits
- [ ] Ověřit s product owner: User count estimate (vliv na sizing)
- [ ] Ověřit s data team: Databricks UC permissions

**Fallback:**  
Pokud nelze ověřit před workshopem, přidat disclaimer do slides: **"[ESTIMATE - needs verification]"**

---

**Gap #2: Tool 3 (Quality Validator) není implementovaný**

**Problém:**  
Tool 3 je v MVP scope, ale není hotový. Demo walkthrough bude potřebovat mock data.

**Dopad:**  
Live demo nebude end-to-end, musíme použít placeholder JSON output.

**Akce:**
- [ ] Připravit mock \`data/tool3/quality_report.json\` s realistic sample data
- [ ] V demo scriptu explicitně říct: "Tool 3 is in development, this is mock data"
- [ ] Timeline: Tool 3 implementation Week 5-8 (podle roadmap.md)

**Fallback:**  
Ukázat only Tool 0 → Tool 1 → Tool 2 chain, skip Tool 3 v demo.

---

**Gap #3: Compliance Checker pro Tool 2 neproběhl**

**Problém:**  
Tool 2 (\`notebooks/tool2_structure_demo.ipynb\`) měl 2 bugs (fixed), ale compliance checker neproběhl post-fix.

**Dopad:**  
Nevíme, jestli Tool 2 kód splňuje LangChain best practices (ToolStrategy usage, Pydantic Field descriptions, etc.).

**Akce:**
- [ ] Spustit: \`python3 .claude/skills/langchain/compliance-checker/check.py --file notebooks/tool2_structure_demo.ipynb\`
- [ ] Verify output v \`scrum/artifacts/YYYY-MM-DD_langchain-compliance.json\`
- [ ] Fix any violations before workshop demo

**Timeline:** Před spuštěním demo scriptu

---

### 🟡 MEDIUM Gaps (měly by být vyřešené, ale nejsou blokující)

**Gap #4: Scenario Engine pro SCR-07 není detailně specifikovaný**

**Problém:**  
SCR-07 (Crisis Impact) vyžaduje "incident scenario engine", ale spec je high-level (fire, flood, sanctions, bankruptcy). Chybí:
- Event triggering mechanism (manual vs. automated?)
- Propagation rules (jak se ripple effects počítají?)
- Recovery time estimation (based on what data?)

**Dopad:**  
Implementation effort pro SCR-07 může být underestimated.

**Akce:**
- [ ] Prodiskutovat na workshopu: "How should scenario engine work?" (získat architect feedback)
- [ ] Post-workshop: Napsat detailed spec do \`backlog_nepuvodni/01_prioritized_backlog/SCR-07-crisis-impact-detailed-spec.md\`

---

**Gap #5: DnB API 58% coverage - chybějící endpointy**

**Problém:**  
Viz Gap #1 - DnB API mapping má jen 7/12 endpoints. Chybějící:
- Real-time risk alerts
- Trade references
- Legal filings
- Ownership changes
- Credit limit recommendations

**Dopad:**  
Pokud tyto endpointy jsou kritické pro business use cases, musíme je doplnit.

**Akce:**
- [ ] Prodiskutovat na workshopu: "Which DnB endpoints are must-have for MVP?"
- [ ] Post-workshop: Update API mapping doc + implementation plan

---

**Gap #6: Performance Testing nezahrnutý v roadmap**

**Problém:**  
Roadmap.md má quality gates Week 2/4/8/12, ale nespecifikuje performance testing:
- Tool 2 performance (500+ supplier network, <3s response time)
- SCR-07 performance (<5 min SLA)
- API rate limit handling (Sayari 1000 req/hour, DnB 500 req/hour)

**Dopad:**  
Production issues s performance, pokud netestujeme před deployment.

**Akce:**
- [ ] Přidat performance testing do roadmap: Week 10 (před UAT Week 12)
- [ ] Define konkrétní metriky: response time targets, throughput, error rate
- [ ] Tool: Azure Load Testing nebo Locust

---

**Gap #7: Security & Compliance review chybí**

**Problém:**  
Workshop brief zmiňuje "security & compliance discussion", ale není připravený checklist:
- Data encryption (at rest, in transit)
- GDPR compliance (personal data handling)
- API key management (Azure Key Vault?)
- Audit logging (Azure Application Insights?)
- Role-based access control (Azure AD integration?)

**Dopad:**  
Architects budou ptát security otázky, ale nemáme připravené odpovědi.

**Akce:**
- [ ] Připravit security checklist do slides (1-2 slides)
- [ ] Prodiskutovat na workshopu: "What security controls are must-have?"
- [ ] Post-workshop: Napsat \`docs_langgraph/SECURITY_COMPLIANCE.md\`

---

### 🟢 LOW Gaps (nice-to-have, ale ne kritické)

**Gap #8: UI Design není finální**

**Problém:**  
SCR-06 (grafová vizualizace), SCR-09 (what-if scenarios) vyžadují UI, ale mockups neexistují.

**Dopad:**  
Minimální - UI není v MVP scope (Tool 0-3 jsou backend-focused).

**Akce:**
- [ ] Q1 2026: UI design phase (post-MVP)

---

**Gap #9: Mermaid Dependency Diagram chybí**

**Problém:**  
\`backlog_info.md\` má text-based dependency popis, ale vizuální diagram by byl lepší.

**Dopad:**  
Minimální - text popis je dostatečný, ale diagram by pomohl na workshopu.

**Akce:**
- [ ] Vytvořit Mermaid diagram:
\`\`\`mermaid
graph TD
    SCR06[SCR-06: Sub-Supplier Mapping] --> SCR05[SCR-05: SPOF Detection]
    SCR06 --> SCR07[SCR-07: Crisis Impact]
    SCR05 --> SCR07
    SCR07 --> SCR09[SCR-09: What-If Scenarios]
\`\`\`
- [ ] Vložit do \`backlog_info.md\` nebo workshop slides

---

### 📊 Souhrnná tabulka gaps

| Gap | Priority | Problém | Dopad | Akce | Timeline |
|-----|----------|---------|-------|------|----------|
| **#1: Unverified assumptions** | 🔴 CRITICAL | 5 assumptions v validation_report.md nejsou ověřené | Může zablokovat MVP | Ověřit s IT/procurement/Azure admin, nebo přidat "[ESTIMATE]" disclaimer | Před workshopem (48h) |
| **#2: Tool 3 není hotový** | 🔴 CRITICAL | Tool 3 v MVP scope, ale není implementovaný | Live demo nebude end-to-end | Připravit mock data, explicitně říct v demo | Před workshopem (48h) |
| **#3: Compliance checker neproběhl** | 🔴 CRITICAL | Tool 2 kód není LangChain-validated | Nevíme, jestli kód splňuje best practices | Spustit compliance checker, fix violations | Před demo (24h) |
| **#4: Scenario engine spec** | 🟡 MEDIUM | SCR-07 scenario engine není detailně specifikovaný | Underestimated effort | Diskutovat na workshopu, napsat detailed spec post-workshop | Post-workshop Week 1 |
| **#5: DnB API gaps** | 🟡 MEDIUM | 58% coverage, chybí 5 endpoints | Pokud kritické, musíme doplnit | Diskutovat na workshopu, update API mapping | Post-workshop Week 1 |
| **#6: Performance testing** | 🟡 MEDIUM | Není v roadmap | Production issues | Přidat Week 10 do roadmap, define metriky | Post-workshop Week 1 |
| **#7: Security checklist** | 🟡 MEDIUM | Není připravený security checklist | Architects budou ptát, nemáme odpovědi | Připravit 1-2 slides, diskutovat na workshopu | Před workshopem (48h) |
| **#8: UI design** | 🟢 LOW | Mockups neexistují | Minimální (UI není v MVP) | Q1 2026 post-MVP | Q1 2026 |
| **#9: Mermaid diagram** | 🟢 LOW | Text-only dependency popis | Minimální | Vytvořit Mermaid diagram | Nice-to-have |

---

## 6. Sonnet Review Questions

### Meta-Questions pro Sonnet 4.5

**1. Narrativ & Story Flow**
- Je projekt příběh jasný? (business problem → MVP solution → post-MVP expansion)
- Jsou priority stories (SCR-06/05/07/09) logicky seřazené?
- Je Tool 4-6 roadmap dobře komunikovaný?

**2. Architectural Consistency**
- Je 5-Node LangGraph workflow konzistentní napříč dokumentací?
- Jsou Tool 0-7 dependency jasné?
- Je Azure AI Foundry setup dostatečně popsaný?

**3. Workshop Readiness**
- Máme všechny materiály pro 2h workshop?
- Je demo walkthrough executable (i s mock Tool 3 data)?
- Jsou discussion pointy pro architekty jasné?

**4. Gaps & Risks**
- Jsou identifikované gaps (5 unverified assumptions, missing slides, etc.) správně priorizované?
- Jsou fallback plány dostatečné?
- Chybí nějaké kritické otázky, které by architects mohli položit?

**5. Action Plan**
- Je action plan (48h před workshopem, Week 1 post-workshop) executable?
- Jsou owners pro každý action item jasní?
- Je timeline (12-week MVP roadmap) realistický?

---

## 🎯 Recommended Next Steps

### Pre-Workshop (48h před workshopem)

**Priority 1: CRITICAL**
1. ✅ Ověřit 5 unverified assumptions (Gap #1) NEBO přidat "[ESTIMATE - needs verification]" disclaimery do slides
2. ✅ Vytvořit prezentační slides (20-slide deck) z \`workshop_architect_focus.md\` + \`mcop-architecture.md\`
3. ✅ Napsat demo walkthrough script (5-10 min) + připravit mock \`data/tool3/quality_report.json\`
4. ✅ Vytvořit decision capture template (Google Form)
5. ✅ Spustit compliance checker na Tool 2 (\`python3 .claude/skills/langchain/compliance-checker/check.py --file notebooks/tool2_structure_demo.ipynb\`)
6. ✅ Připravit 1-2 security checklist slides (Gap #7)

**Priority 2: HIGH**
7. ✅ Test demo walkthrough end-to-end (Tool 0 → Tool 1 → Tool 2 → mock Tool 3)
8. ✅ Připravit backup plan: pokud live demo failuje, mít pre-recorded video nebo screenshots
9. ✅ Distribute decision capture template emailem 24h před workshopem

### Post-Workshop (Week 1 po workshopu)

**Priority 1: CRITICAL**
1. ✅ Shrnout feedback z decision capture template
2. ✅ Vytvořit action items list z workshop discussions
3. ✅ Email summary účastníkům (48h po workshopu)

**Priority 2: HIGH**
4. ✅ Napsat detailed spec pro scenario engine (Gap #4) based on architect feedback
5. ✅ Update API mapping doc s DnB endpoint priorities (Gap #5)
6. ✅ Přidat performance testing do roadmap Week 10 (Gap #6)
7. ✅ Napsat \`SECURITY_COMPLIANCE.md\` (Gap #7)

**Priority 3: MEDIUM**
8. ✅ Vytvořit \`KPI_TRACKING.md\` (Gap #4 z Workshop Assets)
9. ✅ Vytvořit \`ROLES_AND_RESPONSIBILITIES.md\` s RACI matrix (Gap #5 z Workshop Assets)
10. ✅ Vytvořit \`ACTION_ITEMS.md\` template + GitHub Issues integration (Gap #6 z Workshop Assets)

**Priority 4: LOW (Nice-to-Have)**
11. ✅ Vytvořit Mermaid dependency diagram (Gap #9) a vložit do \`backlog_info.md\`
12. ✅ Napsat incident storyboard pro SCR-07 (Gap #7 z Workshop Assets)

---

## 📋 Sonnet Review Checklist (pro Sonnet 4.5)

**Po přečtení tohoto dokumentu, prosím ohodnoť:**

- [ ] **Context & Mission Clarity:** Je mise projektu jasná? (✅ Yes | 🟡 Partially | ❌ No)
- [ ] **Story Prioritization:** Jsou SCR-06/05/07/09 správně priorizované? (✅ Yes | 🟡 Needs adjustment | ❌ No)
- [ ] **Timeline Realisticity:** Je 12-week roadmap realistic? (✅ Yes | 🟡 Tight but doable | ❌ Unrealistic)
- [ ] **Architectural Consistency:** Je architektura konzistentní napříč dokumenty? (✅ Yes | 🟡 Minor gaps | ❌ Inconsistent)
- [ ] **Workshop Readiness:** Máme všechny kritické materiály? (✅ Yes | 🟡 Missing some | ❌ Not ready)
- [ ] **Gaps Identification:** Jsou gaps správně identifikované a priorizované? (✅ Yes | 🟡 Missing some | ❌ Incorrect)
- [ ] **Action Plan:** Je pre/post-workshop action plan executable? (✅ Yes | 🟡 Needs refinement | ❌ Not executable)

**Open Questions for Discussion:**
1. ...
2. ...
3. ...

**Recommended Changes:**
1. ...
2. ...
3. ...

---

**End of Checklist**  
**Prepared by:** GitHub Copilot (Claude Sonnet 4.5)  
**Date:** 6. listopadu 2025  
**Version:** 1.0
