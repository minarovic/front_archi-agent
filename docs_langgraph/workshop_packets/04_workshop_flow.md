# Workshop Flow & Governance Highlights

**Datum aktualizace:** 2025-11-06
**Účel:** Struktura průběhu workshopu + hlavní governance a quality témata k pokrytí.

---

## Facilitační Strategie

**Klíčové principy:**
1. 🎯 **Start with WHY** – Business dopad před technickými detaily
2. 🔄 **Show, don't tell** – Reálné artefakty (JSONs) místo abstraktních diagramů
3. ❓ **Decision-driven** – Každá sekce končí otázkou nebo hlasováním
4. ⏱️ **Time-boxed** – 60 min total (10+15+20+10+5)

---

## Doporučený průběh (60 min)

### 🔥 Fáze 1: HOOK (0-10 min)
**Cíl:** Zaujmout pozornost, ukázat business value

1. **Start with impact** – "Co kdyby vám v pátek ráno volali..."
   - Incident A timeline: T0-T4 (55 minut od problému k rozhodnutí)
   - Business čísla: €2.5M/den, 28% produkce, 6 dní zásoby
   - **Facilitační tip:** Ptát se: "Kočká z vás řešil podobnou situaci?"

2. **Show the problem** – TierIndex diagram s "blind spots"
   - Dnes: Vidíme jen Tier 1
   - Potřebujeme: Tier 1→2→3
   - **Facilitační tip:** Nechat 30s ticho, ať si to architekti "stráví"

### 💡 Fáze 2: EDUCATE (10-25 min)
**Cíl:** Vysvětlit řešení (SCR-06), ukázat demo

3. **Explain SCR-06** – Co je Mapping & Verification of Sub-Supplier Chains?
   - Business value: 30+ min → <5 min response
   - **Facilitační tip:** Použít analógii (GPS navigation vs paper map)

4. **Demo Tool 1** – Projít `data/tool1/filtered_dataset.json`
   - Ukázat confidence skóre, 3 kandidátní dodavatelé
   - Vysvětlit, kde hrozí sporné mappingy
   - **Facilitační tip:** "Co byste udělali s confidence 0.75 vs 0.95?"

5. **Demo Tool 2** – Ukázat `data/tool2/structure.json`
   - Jak zachycuje BOM/logistické hierarchie
   - Které projekty/produkty jsou dotčené (3V0, 3J0)
   - Link na SCR-06: "Potřebujeme `ti_bom_usage_s` Silver table"
   - **Facilitační tip:** Projít reálný JSON live (ne screenshot)

6. **Demo Tool 3** – Quality & Governance
   - Top 3 Quality Flags: description coverage 5.8%, owner 8.3%, security <1%
   - Vyzdvihnout: "Bez metadata quality nemůžeme incident řešit auditovatelně"
   - **Facilitační tip:** "Kdo je odpovědný za opravu těchto flagů?"

### ⚙️ Fáze 3: DECIDE (25-45 min)
**Cíl:** Architektonická rozhodnutí, voting

7. **Bronze/Silver/Gold overview** – Data flow diagram
   - Bronze: `sap_bom_structure` (čeká na ETL)
   - Silver: `ti_bom_usage_s` (materiál↔dodavatel↔projekt)
   - Gold: Domain views (Logistics/Risk/Quality)
   - **Facilitační tip:** "Kdo z vás pracoval s Medallion architekturou?"

8. **Decision voting** – Použít [SCR-06/key_decisions.md](../../metadata_BOM/SCR-06/key_decisions.md)
   - **Decision #2:** Multi-Gold vs Shared Gold? → Hlasovat (show of hands)
   - **Decision #3:** SQL vs Neo4j? → Hlasovat (po test recursive CTEs)
   - Zapsat mitigace do action trackeru
   - **Facilitační tip:** "Prosím všechny za názor, ne jen senior architekty"

### 🔗 Fáze 4: CONNECT (45-55 min)
**Cíl:** Ukázat downstream value, navázat na další stories

9. **Downstream impact** – Jak SCR-06 podporuje SCR-05/07/09
   - Navázat na SCR‑07/05/06/09 backlog ([03_backlog_focus.md](03_backlog_focus.md))
   - Metadata agent role: konzument, ne vlastník
   - Export views: `vw_bom_tier_path`, `vw_bom_coverage`
   - **Facilitační tip:** "Který use case je pro vás nejzajímavější?"

### ✅ Fáze 5: ACT (55-60 min)
**Cíl:** Action plan, owners, timeline

10. **Action tracker** – Určit deadline/owner pro každé rozhodnutí
    - Template: viz Incident A (action tracker tabulka)
    - **CRITICAL:** Test recursive CTEs na DAP (deadline: 2025-11-10)
    - **CRITICAL:** Bronze ingest ETL job (deadline: 2025-11-15)
    - **Facilitační tip:** "Kdo může toto vlastnit? Potřebujeme jméno, ne tým."

---

## Facilitační Tipy

### Jak řídit čas
- ⏰ **Time keeper:** Označit 1 osobu pro sledování času
- ⚠️ **Yellow flag:** Když zbývá 5 min do další fáze
- 🛑 **Red flag:** Když překročíme deadline → přesunout diskuzi do parking lot

### Jak zapálit engagement
- 🚀 **Start energetic:** První 2 minuty určují tempo
- ❓ **Ask questions:** Min. 1 otázka každých 5 minut
- 👀 **Read the room:** Pokud vidíte směšované tváře → změnit tempo
- 🎯 **Redirect rambling:** "Skvělý bod, zapíšeme do parking lot a vrátíme se k tomu"

### Jak řézt konflikty
- 🤝 **Acknowledge both sides:** "Rozumím oběma perspektivám..."
- 📊 **Data over opinions:** "Pojďme se podívat na čísla"
- 🗓️ **Defer to timeline:** "Můžeme to otestovat a rozhodnout příští týden?"

---

## Předchozí doporučený průběh (legacy)
1. **Set the scene** – Stručně představit vybraný incident (A nebo B), zdůraznit scope_in/out a business priority.
2. **Tool 1 deep dive** – Projít `data/tool1/filtered_dataset.json`, vysvětlit confidence skóre a kde hrozí sporné mappingy.
3. **Tool 2 review** – Ukázat, jak `data/tool2/structure.json` zachycuje BOM/logistické hierarchie a které projekty/produkty jsou dotčené.
4. **Tool 3 governance** – Vyzdvihnout quality flags (popisy, owner, security classification) a co je nutné doplnit před rozhodnutím.
5. **Decision & backlog** – Zapsat mitigace do action trackeru, navázat na SCR‑07/05/06/09 a určit deadline/owner.

### SCR-06 Specifické Decisions

Pro architektonická rozhodnutí související s incidents použijte [SCR-06/key_decisions.md](../../metadata_BOM/SCR-06/key_decisions.md):

| Decision                        | Relevance pro incidents                                         | Odkaz                                                            |
| ------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------- |
| **#1: Bronze Ingest ownership** | Kdo zajistí `sap_bom_structure` data pro Tool 1/2?              | [key_decisions.md#1](../../metadata_BOM/SCR-06/key_decisions.md) |
| **#3: Gold Architecture**       | Multi-Gold (Logistics/Risk/Quality) vs Shared Gold?             | [key_decisions.md#3](../../metadata_BOM/SCR-06/key_decisions.md) |
| **#5: Graph Persistence**       | SQL recursive CTEs stačí nebo potřeba Neo4j pro N-tier queries? | [key_decisions.md#5](../../metadata_BOM/SCR-06/key_decisions.md) |
| **#8: Timeline & Milestones**   | Kdy musí být Bronze ingest hotový pro SCR-05/07?                | [key_decisions.md#8](../../metadata_BOM/SCR-06/key_decisions.md) |

---

## Governance & Quality body
- **Metadata completeness:** Bez popisů/owner/security nelze incident řešit auditovatelně → priorita pro Tool 4 (Security Analyzer).
- **Audit trail:** `scrum/artifacts/<datum>_incident-drill.json` musí být vyplněn po každém běhu.
- **RLS & compliance:** Jakmile se přidá nový dodavatel, security team musí potvrdit RLS před produkčním nasazením.
- **Lessons learned:** Po workshopu aktualizovat FAQ/Checklist a natočit follow-up stories.

---

## Artefakty ke sdílení během workshopu
- `data/tool1/filtered_dataset.json`
- `data/tool2/structure.json`
- `scrum/artifacts/2025-11-03_datamarts-dq-audit.json`
- `scrum/artifacts/<datum>_incident-drill.json`
- `docs_langgraph/tool4-6_scenario_brief.md`
