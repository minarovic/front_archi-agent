# Workshop Flow & Governance Highlights

**Datum aktualizace:** 2025-11-06  
**Účel:** Struktura průběhu workshopu + hlavní governance a quality témata k pokrytí.

---

## Doporučený průběh
1. **Set the scene** – Stručně představit vybraný incident (A nebo B), zdůraznit scope_in/out a business priority.
2. **Tool 1 deep dive** – Projít `data/tool1/filtered_dataset.json`, vysvětlit confidence skóre a kde hrozí sporné mappingy.
3. **Tool 2 review** – Ukázat, jak `data/tool2/structure.json` zachycuje BOM/logistické hierarchie a které projekty/produkty jsou dotčené.
4. **Tool 3 governance** – Vyzdvihnout quality flags (popisy, owner, security classification) a co je nutné doplnit před rozhodnutím.
5. **Decision & backlog** – Zapsat mitigace do action trackeru, navázat na SCR‑07/05/06/09 a určit deadline/owner.

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
