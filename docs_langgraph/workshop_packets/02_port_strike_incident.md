# Incident Scenario B – Port Strike & Spare Parts Allocation

**Datum aktualizace:** 2025-11-06
**Business fokus:** Stávka v přístavu Bremerhaven blokuje servisní díly pro EV flotilu; cílem je rychle přesměrovat zásoby a minimalizovat SLA porušení.

---

## Business Kontext (Proč je tento incident odlišný?)

**Incident A = Procurement crisis** (jeden dodavatel vypadl)
**Incident B = Logistics crisis** (distribuce zablokována)

**Klíčový rozdíl:**
- Incident A: "Kde najdeme náhradní dodavatele?" → **vertical mapping** (Tier 1→2→3)
- Incident B: "Jak přesměrujeme zásoby?" → **horizontal mapping** (sklady, distribuce, service)

**Business Dopad:**
- 📦 **1,200+ kontejnerů** blokováno v Bremerhaven
- 🚗 **250 EV servisních zásahů** v backlogu (SLA: 48h)
- 📉 **Customer satisfaction risk** – každý den zpoždění = -5% NPS
- 💰 **€800K potenciální pokuty** za nedodržení warranty SLA

**Klíčová otázka:** Dokážeme rychle identifikovat alternativní distribuční cesty a posoudit dopad na různé service regiony?

---

## Timeline (High-Level)
- **D0:** Oznámení odborů o 72h stávce → kontejnery se servisními díly zůstávají v přístavu.
- **D0 + 2h:** Call centrum hlásí rostoucí backlog servisních zásahů; logistika hlásí, že lokální sklady vydrží max 48h.
- **D0 + 3h:** Crisis board aktivuje MCOP use-case „Port Strike Allocation“; požaduje přehled náhradních skladů, projektů v riziku a dostupných kontraktů.
- **D0 + 4h:** MCOP Tool 0–3 generují mapping logistických a servisních dat, strukturální dopady, quality report; výsledky předány architektům.
- **D0 + 6h:** Schválen plán redistribuce; follow-up tasks vytvořeny pro SCR‑09 (What-if modelling) a logistické integrace.

---

## Link to SCR-06

Tento incident rozšiřuje SCR-06 use case o **multi-domain perspektivu**:

- **Logistika + BOM integrace:** Port strike vyžaduje rychlé mapování inventory → BOM nodes → affected projects
- **N-tier dependency tracking:** Identifikace, které Tier 2/3 suppliers dodávají servisní díly pro EV flotilu
- **Real-time queries:** Demonstruje potřebu rychlých multi-domain dotazů → ovlivňuje SCR-06 rozhodnutí o Gold architektuře
- **What-if scenarios:** Připravuje půdu pro SCR-09 (proaktivní simulace), které staví na SCR-06 infrastructure

**Workshop fokus:** Tento incident ukazuje **škálovatelnost** SCR-06 řešení napříč různými doménami (procurement → logistics → service).

---

## MCOP Fokusové oblasti
- **Tool 0:** Analyzuje business dokument se scope na logistiku, servisní SLA a krizovou redistribuci.
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
