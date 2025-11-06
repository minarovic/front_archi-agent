# Incident Scenario B – Port Strike & Spare Parts Allocation

**Datum aktualizace:** 2025-11-06  
**Business fokus:** Stávka v přístavu Bremerhaven blokuje servisní díly pro EV flotilu; cílem je rychle přesměrovat zásoby a minimalizovat SLA porušení.

---

## Timeline (High-Level)
- **D0:** Oznámení odborů o 72h stávce → kontejnery se servisními díly zůstávají v přístavu.
- **D0 + 2h:** Call centrum hlásí rostoucí backlog servisních zásahů; logistika hlásí, že lokální sklady vydrží max 48h.
- **D0 + 3h:** Crisis board aktivuje MCOP use-case „Port Strike Allocation“; požaduje přehled náhradních skladů, projektů v riziku a dostupných kontraktů.
- **D0 + 4h:** MCOP Tool 0–3 generují mapping logistických a servisních dat, strukturální dopady, quality report; výsledky předány architektům.
- **D0 + 6h:** Schválen plán redistribuce; follow-up tasks vytvořeny pro SCR‑09 (What-if modelling) a logistické integrace.

---

## MCOP Fokusové oblasti
- **Tool 0:** Analyzuje business dokument se scope na logistiku, servisní SLA a krizovou redistribuci.
- **Tool 1:** Upřednostňuje `dm_bs_logistics`, `inventory_snapshot`, případně SAP tabulky skladových přesunů; zároveň zachovává procurement datamarty pro cross-check.
- **Tool 2:** Identifikuje vazby mezi skladovými uzly, servisy a projekty (využívá BOM/HS mapping pro napojení na výrobky).
- **Tool 3:** Kontroluje kvalitu logistických metadat (statusy, owner), hlásí chybějící security klasifikace před sdílením dat.

---

## Klíčové úkoly pro architekty
1. Vyhodnotit, zda infrastruktura (Azure SQL + Neo4j) pokrývá multi-domain dotazy v reálném čase.
2. Rozhodnout o použití Tool 5/6 (ER diagram + skripty) pro simulaci redistribuce.
3. Zajistit, aby quality flags (chybějící owner, RLS) byly vyřešeny před nasazením.
4. Připravit následné backlog stories (např. rozšíření SCR‑09 o logistické scénáře).

---

## Vazby na dokumenty
- `BOM_HS_INTEGRATION_GAP_ANALYSIS.md` – mapování komponent → servisní díly.
- `calculated_metrics_specs.md` – metriky pro trend spotřeby, SLA rizika.
- `backlog_nepuvodni/implementation_roadmap.md` – roadmapa modulů (network analysis, alternative supplier matcher).
- `docs_langgraph/tool4-6_scenario_brief.md` – argumentace pro Tool 4–6 (bezpečnost, vizualizace, skripty).

---

> Tento scénář slouží jako sekundární showcase – demonstruje schopnost MCOP řešit multi-domain incidenty (logistika + servis) a připravuje půdu pro proaktivní What-if analýzy.
