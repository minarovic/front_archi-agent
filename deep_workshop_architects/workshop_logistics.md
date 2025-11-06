# TierIndex Workshop - Logistics & Organization

**Účel:** Organizační detaily pro workshop coordination (pro organizátory, ne pro architekty)
**Datum:** 2025-10-22
**Workshop datum:** ~2025-10-29 (za týden)

---

## Workshop Format

**Délka:** Půl dne (4 hodiny)
**Účastníci:**
- Solution Architects (AICC, DAPI)
- N-Tier team (Marek, Honza)
- Datový tým representatives

**Příprava:**
- ✅ Dokumenty dodány dopředu (48h před workshopem)
- ✅ Pre-read materiály: `workshop_architect_focus.md` + `physical_model.md`
- ✅ Fokus na rozhodnutí (workshop není pro edukaci, ale pro konkrétní architekturnická rozhodnutí)

---

## Pre-Workshop Checklist

### Pro N-Tier Tým (48h před workshopem)
- [ ] Dodat `workshop_architect_focus.md` architekům (email)
- [ ] Dodat `physical_model.md` a `SLA.md` jako attachments
- [ ] Připravit TierIndex mock-up demo (Mermaid nebo interactive viz)
- [ ] Připravit cost breakdown: Sayari, D&B, Semantic Vision
- [ ] List "assumed numbers" pro validaci:
  - Logistika ~50 uživatelů (odkud?)
  - Kvalita ~30 uživatelů (odkud?)
  - TierIndex rebuild 4-6h (odhad nebo measured?)

### Pro Architekty (48h před workshopem)
- [ ] Přečíst `workshop_architect_focus.md` (20 min)
- [ ] Přečíst `physical_model.md` (15 min)
- [ ] Přečíst `SLA.md` (10 min)
- [ ] Připravit otázky/concerns (list do emailu)

### Pro Meeting Owner (Marek/Honza) (24h před)
- [ ] Zarezervovat meeting room (4h block, whiteboard)
- [ ] Připravit Miro board pro remote participants
- [ ] Nastavit recording (pro follow-up reference)
- [ ] Poslat kalendářní pozvánku s agenda a attachments
- [ ] Print decision checklist (pro note-taking během workshopu)

---

## Workshop Agenda (Navrhovaná Struktura)

### Část 1: Kontext a Cíle (30 min)
- Business case: Proč TierIndex?
- Strategic priorities: MVP vs. long-term vision
- Success criteria: Jak vypadá úspěch?

### Část 2: Technické Rozhodnutí (120 min)
#### 2.1 Platformová Kapacita (30 min)
- Stávající platforma: Ano/Ne?
- Grafová logika: Jak řešit?
- Výpočetní nároky: Dostatečné?

#### 2.2 Gold Architektura (45 min) 🔴 **KRITICKÉ**
- Jeden Gold vs. více Goldů
- Performance modeling: Kolik uživatelů?
- Cost-benefit analysis: Správa vs. výkon

#### 2.3 TierIndex Sestavení (45 min)
- Sayari API integration: Frekvence, threshold
- Web scraping: Kdy použít?
- ML models: Kde běží (Silver/Gold)?

### Část 3: Roadmap a Next Steps (60 min)
- Iterativní fáze: Co kdy?
- Team responsibilities: AICC vs. DAPI vs. N-Tier
- Open items: Owner a deadline

### Část 4: Q&A a Wrap-up (30 min)
- Unresolved questions
- ADR documentation plan
- Follow-up meeting schedule

---

## Slovník Pojmů (Pro Referenci)

| Pojem                      | Definice                                                                              | Příklad                              |
| -------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------ |
| **Tier Index**             | Strom dodavatelů mapující hierarchické vztahy v dodavatelském řetězci                 | Tier 1 → Tier 2 → Tier 3             |
| **Tier 1**                 | Přímí dodavatelé s podepsanou smlouvou (SAP data)                                     | ~1500 dodavatelů                     |
| **Tier 2**                 | Subdodavatelé dodávající Tier 1                                                       | 10-30% známo, cíl: systematická mapa |
| **Tier 3**                 | Subdodavatelé dodávající Tier 2                                                       | <5% známo                            |
| **HS Kód**                 | Harmonized System Code - mezinárodní klasifikace produktů pro celní účely             | HS 8708 = auto parts                 |
| **Pre-computing**          | Strategie předpočítávání TierIndexu (ne real-time assembly při query)                 | Weekly batch rebuild                 |
| **Fork (Gold vrstva)**     | Modulární odbočka pro oddělení - vlastní Gold vrstva odvozená ze Silver               | `gold_logistics.*`                   |
| **Single Source of Truth** | Silver vrstva obsahující konsistentní, vyčištěná data jako základ pro všechny analýzy | `silver.tierindex`                   |
| **Bronze-Silver-Gold**     | Osvědčené paradigma datové architektury: raw → cleaned → consumption                  | Medallion architecture               |
| **Sayari API**             | Externí služba pro mapování dodavatelských vztahů                                     | 35 endpointů, ~25 atributů           |
| **Semantic Vision**        | Služba pro monitoring lokálních médií (PL, CZ, SK) s předzpracovanými výsledky        | Mustry = detection patterns          |

---

## Související Dokumenty (Kompletní Seznam)

### Must-Read před Workshopem
1. `workshop_architect_focus.md` 🔴 - Kritická architektonická rozhodnutí
2. `scrum/architecture/physical_model.md` 🔴 - TierIndex architektura detail
3. `scrum/architecture/SLA.md` 🔴 - SLA/SLO targets pro data freshness

### Nice-to-Have (Technical Context)
4. `scrum/architecture/tierindex_slovnik_pojmu.md` - Terminologie a koncepty
5. `scrum/architecture/synthesis-agent.md` - TierIndex-first orchestrace
6. `scrum/architecture/dap-integration/dap_gap_analysis.md` - DAP platform constraints

### Deep Technical Dive (Optional)
7. `scrum/architecture/background_monitoring/` - TierIndex runtime implementation
   - `background_monitoring.md` - DAP migration strategy, governance
   - `background_monitoring_data_model.md` - Edge taxonomy, tier classification rules
   - `background_monitoring_implementation.md` - Loader, hot-reload, performance benchmarks (435ms baseline)

### Business Context (Optional)
8. `prezentace6.10/N_TIER_REQUIRED_USE_CASES.md` - Use cases analýza pro business case

---

## Post-Workshop Follow-up Template

### Mandatory Deliverables
**Deadline: 2 dny po workshopu**

1. **ADR (Architecture Decision Records)**
   - Location: `scrum/architecture/decisions/`
   - Format: ADR template (Context, Decision, Consequences)
   - One ADR per major decision (G1, P1, ML1, T1)

2. **Roadmap Update**
   - Location: `scrum/PRIORITIES.md`
   - Add workshop outcomes to TOP 5 priorities
   - Assign owners and deadlines

3. **Implementation Stories**
   - Location: `scrum/stories/backlog/`
   - Create stories for each implementation phase
   - Link to ADR for context

### Optional Deliverables
4. **Open Items Tracker**
   - Location: `scrum/architecture/communication/deep_workshop_architects/open_items.md`
   - List unresolved questions with owner and deadline

5. **Stakeholder Communication**
   - Email summary to wider team (non-technical summary)
   - Deck for leadership (if major platform change decided)

---

## Workshop Success Criteria

### Process Success
- [ ] All MUST-DECIDE items from checklist have answers
- [ ] Each decision has clear owner for implementation
- [ ] Open items documented with deadline
- [ ] ADR written within 2 days

### Outcome Success
- [ ] Clear Gold architecture decision (A or B)
- [ ] Platform capacity confirmed (existing OK or migration needed)
- [ ] ML pipeline placement decided
- [ ] TierIndex assembly strategy agreed (confidence threshold, recursion depth, cycle handling)

### Team Success
- [ ] Architects feel "heard" (concerns addressed)
- [ ] N-Tier team has clear next steps
- [ ] No major blockers for implementation
- [ ] Timeline realistic and agreed

---

## Meeting Etiquette & Guidelines

**For Facilitator (Marek/Honza):**
- ⏱️ Timeboxing: Keep discussions on track (use timer for sections)
- 🎯 Focus: Redirect to architectural decisions when conversation drifts
- ✍️ Capture: Designate note-taker for decisions
- ❓ Clarify: Ask "Is this a MUST-DECIDE or nice-to-have?" when unclear

**For Architects:**
- 🚫 Avoid: Long tangents on non-architectural topics
- ✅ Encourage: Questions that challenge assumptions
- 📊 Request: Data/benchmarks if decisions feel speculative
- 💡 Suggest: Alternative solutions if proposed approach has issues

**For Everyone:**
- "Parking lot" for off-topic items (address later)
- "Fist-to-five" voting for quick consensus checks
- Coffee break at 2h mark (avoid decision fatigue)

---

## Metadata

**Vytvořeno:** 2025-10-22
**Pro workshop:** AICC + Datový tým (plánováno ~2025-10-29)
**Účel:** Organizační detaily (checklist, agenda, odkazy) separované od architektonických rozhodnutí
**Source:** Extracted logistics z `workshop_pripravaArchitectAICC.md`
