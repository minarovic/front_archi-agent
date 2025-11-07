# Workshop Presentation – Deep Architects

**Účel:** Čistá, business-friendly prezentace pro deep architects bez interních SCR-XX a Tool čísel.

**Datum vytvoření:** 2025-11-07

---

## Obsah Prezentace

**Klíčová témata:**
- TierIndex jako core data platforma pro supply chain visibility
- 4 datové komponenty (HS Codes, WGR, BOM, Tier Mappings)
- 3 zdroje dat (Sayari, DnB, SAP)
- 4 business capabilities (Mapping, Crisis Response, SPOF Detection, Early Warning)
- DAP architektura (Bronze/Silver/Gold) a governance
- Metadata Copilot (MCOP) jako orchestrátor
- Roadmap a implementační fáze

---

## Struktura Prezentace

### **Part 1: Foundation – Co je TierIndex**
**03_tierindex_context.md**
- Co je TierIndex a proč jej potřebujeme
- 6 praktických příkladů (onboarding screening, financial deterioration, SPOF detection, risk accumulation, what-if scenarios, mapping verification)
- 4 datové komponenty:
  - **HS Codes:** Struktura napříč tiery (každý tier má odlišný kód z důvodu transformace produktu)
  - **WGR:** Interní commodity taxonomy
  - **BOM:** Kusovník v tabulkovém formátu (impact propagation)
  - **Tier Mappings:** N-tier visibility
- 3 zdroje dat (Sayari, DnB, SAP)
- DAP architektura (Bronze → Silver → Gold)
- Metadata Copilot (MCOP) jako metadata orchestrátor propojující TierIndex s governance systémy

### **Part 2: Business Capabilities**
**02_capabilities_overview.md**
- 4 klíčové capabilities postavené na TierIndex:
  1. Mapping & Verification (N-tier visibility, onboarding screening)
  2. Crisis Impact Analysis (real-time response, immediate disruption assessment)
  3. SPOF Detection (proactive risk identification, vendor lock-in prevention)
  4. Early Warning (predictive monitoring, financial deterioration detection)
- Každá capability s konkrétním business scenario
- "Mentální Most" framework: TierIndex (CORE) → Metadata Copilot (HELPER) → ML (FUTURE)

**01_mapping_verification_use_case.md** (optional deep dive)
- Anonymizovaný critical logistics disruption use case
- Krok za krokem datový journey napříč systémy
- Referenční SQL queries a výstupy
- Metadata Copilot orchestrační workflow mezi TierIndex a governance systémy
- Cesta k prediktivnímu monitoringu

### **Part 3: Architektura**
**04_architecture_decisions.md**
- 5 klíčových architektonických rozhodnutí
- Technická rationale a trade-offs
- Diskusní body pro deep architects

### **Part 4: Executive Summary**
**05_slide_deck.md**
- 15 slides: TierIndex overview → Roadmap
- Roadmap fáze: Phase 1 (Foundation) → Phase 2 (Metadata Copilot) → Phase 3 (ML)
- Metadata Copilot role vysvětlena jako orchestrátor mezi systémy
- Q&A příprava s běžnými otázkami

---

## Klíčové principy

### ✅ Business-Friendly Terminology
- ❌ "SCR-06" → ✅ "Mapping & Verification of Sub-Supplier Chains"
- ❌ "SCR-07" → ✅ "Crisis Impact Analysis"
- ❌ "SCR-05" → ✅ "SPOF Detection"
- ❌ "SCR-03" → ✅ "Early Warning"
- ❌ "Tool 0/1/2/3" → ✅ "Business Parser", "Source Finder", "Relationship Analyzer", "Quality Checker"

### ✅ TierIndex + Metadata Copilot Positioning
- **TierIndex** = Core data platforma (HS codes, WGR, BOM, Tier1/2/3 mappings)
- **Metadata Copilot (MCOP)** = Metadata orchestrátor propojující TierIndex ↔ Collibra/DAP Catalog/SAP DAP
- **Metadata Copilot role:** Pomáhá vytvořit mentální most mezi daty a jejich významem - bez něj vzniká mentální gap pro ML modely
- **Future:** Metadata Copilot jako základ pro ML-powered proaktivní monitoring
- Focus: TierIndex = foundation, Metadata Copilot = enrichment layer

### ✅ Audience-Aware
- Deep architects potřebují rozumět business hodnotě, nikoli interním story ID
- Rozhodnutí řízená capabilities, nikoli technickými implementačními detaily
- Samostatně srozumitelné materiály pro nováčky v projektu

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

- ✅ 03_tierindex_context.md (Foundation s praktickými příklady)
- ✅ 02_capabilities_overview.md (4 business capabilities overview)
- ✅ 01_mapping_verification_use_case.md (anonymizovaný disruption use case)
- ✅ 04_architecture_decisions.md (5 klíčových rozhodnutí)
- ✅ 05_slide_deck.md (15-slide executive deck)

### Workshop Flow:
1. **Start:** 03_tierindex_context.md nebo 02_capabilities_overview.md (podle času)
2. **Deep Dive:** 01_mapping_verification_use_case.md (optional)
3. **Architecture:** 04_architecture_decisions.md (technická diskuze)
4. **Summary:** 05_slide_deck.md (roadmap + Q&A)
