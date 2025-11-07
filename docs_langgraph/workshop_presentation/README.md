# Workshop Presentation – Deep Architects

**Účel:** Čistá, business-friendly prezentace pro deep architects bez interních SCR-XX a Tool čísel.

**Datum vytvoření:** 2025-11-07

---

## Struktura Prezentace

### **Part 1: Foundation – Co je TierIndex**
**03_tierindex_context.md** (⏱️ čtení)
- Co je TierIndex a proč ho potřebujeme
- 4 praktické příklady (HS codes, BOM mappings, SPOF, WGR clusters)
- 4 datové komponenty vysvětlené through examples
- 3 zdroje dat (Sayari, DnB, SAP)
- Databricks architecture (Bronze → Silver → Gold)
- MCOP jako metadata orchestrator

### **Part 2: Business Capabilities**
**02_capabilities_overview.md** (⏱️ čtení)
- 4 klíčové capabilities postavené na TierIndex:
  1. Mapping & Verification (N-tier visibility)
  2. Crisis Impact Analysis (real-time response)
  3. SPOF Detection (proactive risk)
  4. Early Warning (predictive monitoring)
- Každá capability s business scenario
- ROI quantification (9.6M EUR/year)

**01_mapping_verification_use_case.md** (⏱️ čtení)
- Deep dive: Hamburg Port Blockage scenario
- Step-by-step data journey
- Real SQL queries + outputs
- MCOP orchestration workflow
- Path to predictive monitoring

### **Part 3: Architektura**
**04_architecture_decisions.md** (⏱️ čtení)
- 5 klíčových rozhodnutí:
  1. Data Ownership (Bronze reference strategy)
  2. Update Strategy (monthly + daily deltas)
  3. Storage Architecture (Databricks Delta Lake)
  4. Access Patterns (SQL + API + Power BI)
  5. Governance (Unity Catalog)
- Business rationale pro každé rozhodnutí
- Open discussion points

### **Part 4: Executive Summary**
**05_slide_deck.md** (⏱️ čtení)
- 15 slides: TierIndex overview → Roadmap
- Roadmap: Phase 1 (Foundation) → Phase 2 (MCOP) → Phase 3 (ML)
- MCOP role explained
- Q&A preparation

---

## Klíčové principy

### ✅ Business-Friendly Terminology
- ❌ "SCR-06" → ✅ "Mapping & Verification of Sub-Supplier Chains"
- ❌ "SCR-07" → ✅ "Crisis Impact Analysis"
- ❌ "SCR-05" → ✅ "SPOF Detection"
- ❌ "SCR-03" → ✅ "Early Warning"
- ❌ "Tool 0/1/2/3" → ✅ "Business Parser", "Source Finder", "Relationship Analyzer", "Quality Checker"

### ✅ TierIndex + MCOP Positioning
- **TierIndex** = Core data platform (HS codes, WGR, BOM, Tier1/2/3 mappings)
- **MCOP** = Metadata orchestrator (propojuje TierIndex ↔ Collibra/Unity Catalog/DAP)
- **Future:** MCOP metadata jako základ pro ML-powered proaktivní monitoring
- Focus: TierIndex = foundation, MCOP = enrichment layer

### ✅ Audience-Aware
- Deep architects need to understand business value, not internal story IDs
- Decisions driven by capabilities, not technical implementation details
- Self-explanatory materials for newcomers

---

## Source Materials (Original)

Reference originals v `docs_langgraph/workshop_packets/`:
- `01_supplier_disruption_incident.md` (má SCR-XX, Tool X)
- `02_port_strike_incident.md`
- `03_backlog_focus.md`
- `04_workshop_flow.md`

Reference master briefs:
- `docs_langgraph/deep_workshop_architects_master.md`
- `docs_langgraph/deep_workshop_architects_brief.md`

---

## Status

✅ **COMPLETED** - Všechny prezentační materiály vytvořeny (2025-11-07)

### Vytvořené soubory:
- ✅ 03_tierindex_context.md (Foundation s praktickými příklady)
- ✅ 02_capabilities_overview.md (4 business capabilities overview)
- ✅ 01_mapping_verification_use_case.md (Hamburg scenario deep dive)
- ✅ 04_architecture_decisions.md (5 klíčových rozhodnutí)
- ✅ 05_slide_deck.md (15-slide executive deck)

### Workshop Flow:
1. **Start:** 03_tierindex_context.md (Co je TierIndex, proč ho potřebujeme)
2. **Capabilities:** 02_capabilities_overview.md (4 use cases overview)
3. **Deep Dive:** 01_mapping_verification_use_case.md (optional, podle času)
4. **Architecture:** 04_architecture_decisions.md (rozhodnutí + diskuze)
5. **Summary:** 05_slide_deck.md (roadmap + Q&A)
