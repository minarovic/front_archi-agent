# Deep Workshop Architects Brief – Review Ideas

## Kontext
- Dokument `docs_langgraph/deep_workshop_architects_brief.md` slouží jako podklad pro interní workshop architektů zaměřený na incident „Supplier Disruption“.
- Cílem je propojit výsledky Tool 0–3 s praktickými potřebami architektů (domény procurement/logistika/BOM, kvalita metadat, governance).
- Připravované materiály musí podporovat rozhodování během workshopu a zapadat do roadmapy MCOP MVP.

## Co by měl Sonnet 4.5 posoudit
1. **Narrativ & relevance**
   - Zda úvod jasně vysvětluje „why now“ pro architekty.
   - Jestli je incidentní scénář dostatečně ukotvený ve firemní realitě (sourcing, supply chain, auditní požadavky).
2. **Napojení na pipeline Tool 0–3**
   - Jsou popsané vstupy/výstupy každého toolu srozumitelné a přímé?
   - Nechybí krok Tool 3 → `quality_report.json`, který je pro governance klíčový?
3. **Workshop flow**
   - Dává navržený postup (5 kroků) smysl pro facilitátora i účastníky?
   - Jsou definovány očekávané diskusní body (decision points) a follow-up akce?
4. **Artefakty & data**
   - Jsou všechny zmíněné soubory (např. `data/tool1/filtered_dataset.json`, `scrum/artifacts/...`) dostupné a aktuální?
   - Potřebuje architekt další vizualizace (diagramy, tabulky) či dashboardy?
5. **Governance & risk**
   - Dokáže dokument upozornit na kritická metadata (owner, security classification, articulation score)?
   - Jaké fallback scénáře nebo mitigace by se měly zmínit?

## Doporučené doplnění obsahu
- **Business storyline**: Krátký výtah incidentu (kdo, co, kdy, dopad) pro rychlé uvedení.
- **Role & zodpovědnosti**: Tabulka „kdo reaguje“ (Enterprise Architect, Data Steward, Incident Manager) s očekávanými rozhodnutími.
- **Quality flags**: Sekce shrnující TOP 5 problémů z `quality_report.json` a jejich priority.
- **Integration map**: Přidat vizualizaci, jak se Tool 2 výstupy napojují na integrační landscape (ERP, MES, SCM).
- **Action tracker**: Šablona pro zápis závěrů (entity, rozhodnutí, owner, due date).
- **Follow-up**: Návrh, jak výstupy uložit zpět do backlogu (odkaz na konkrétní story, workflow).

## Otázky pro Sonnet 4.5
1. Jak dobře dokument navazuje na enterprise architektonické standardy (TOGAF, governance gates)?
2. Je Mermaid diagram dostatečný, nebo potřebujeme variantu pro prezentaci (např. obrázek v PPT)?
3. Máme v briefu jasně vysvětleno, proč Tool 3 musí běžet před workshopem (bez něj není audit trail)?
4. Co by architekti potřebovali vidět v „Workshop Packetu“ z Toolu 7, aby mohli učinit rozhodnutí?
5. Jak doplnit KPI nebo metriky úspěchu workshopu (např. čas do rozhodnutí, počet mitigovaných rizik)?

## Další nápady / open items
- Přidat „FAQ“ sekci (např. co dělat, když Tool 1 vrátí nízké confidence, nebo Tool 3 nahlásí blocker).
- Rozmyslet, zda se má brief odkazovat na reálné incidenty z minulosti (anonimizované lessons learned).
- Zvážit přidání checklistu před workshopem (ověření dat, restart notebooků, dostupnost API).
- Připravit verzi pro stakeholdery mimo IT (zjednodušený jazyk, vysvětlení pojmů).
- Uvést, jak se výsledky promítnou do governance boardu a jaký je časový rámec eskalace.
