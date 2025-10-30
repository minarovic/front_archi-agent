---
id: MCOP-MVP-V1
type: story
status: planned
priority: must-have
updated: 2025-10-30
skill_implementation: null
skill_status: "manual_only"
skill_time_saved: null
skill_created: false
---

# Metadata Copilot – MVP Scope (v1.0)

Brief
- Definovat minimální rozsah první verze Metadata Copilota tak, aby ověřil schopnost porovnat business požadavek s technickou realitou a doručil základní artefakty.

Acceptance criteria
- [ ] Dokumentace popisuje cíle, zahrnuté funkce, workflow a výstupy MVP.
- [ ] MVP zahrnuje pouze Tool 0–3, orchestrátor a částečný Tool 7 zaměřený na governance report.
- [ ] Definována jsou měřítka úspěchu a jasně odlišeny post-MVP aktivity.

Notes
- **Cíle**
  - Propojit business požadavek s technickou realitou v metadatech BA/BS datamartů.
  - Identifikovat klíčové entity, fakta a dimenze v rámci určeného rozsahu.
  - Vyhodnotit základní kvalitu metadat (`status`, `validationResult`, `articulationScore`).
  - Dodat minimální dvojici artefaktů: `structure.json` a `governance_report.md`.
- **Zahrnuté funkce (v1.0)**
  - Tool 0 – Analyzátor požadavků (parsování standardizovaného dokumentu).
  - Tool 1 – Datový ingest & filtrování (JSON/XML exporty podle rozsahu).
  - Tool 2 – Strukturální analýza (identifikace faktů/dimenzí, hierarchií).
  - Tool 3 – Kvalitativní kontrola (`validationResult`, `articulationScore`, `Missing from source`).
  - LangGraph orchestrátor: Node 0–4 (načtení kontextu, ingest, paralelní analýzy, konsolidace, generování artefaktů).
  - Tool 7 (omezeně) – generace governance reportu porovnávající očekávání vs. realita.
- **Workflow (v1)**
  1. Node 0 – Tool 0 načte business kontext a uloží ho do stavu.
  2. Node 1 – Tool 1 načte metadata a filtruje podle rozsahu (BA/BS).
  3. Node 2 – Paralelně běží Tool 2 a Tool 3 nad filtrovanými daty.
  4. Node 3 – Konsolidace analýz a vyhodnocení rizik vůči očekáváním.
  5. Node 4 – Generování `structure.json` a `governance_report.md`.
- **Výstupy**
  - `structure.json` – strukturovaná reprezentace faktů, dimenzí, hierarchií a vazeb.
  - `governance_report.md` – shrnutí souladu/nesouladu a kvality metadat.
- **Měřítka úspěchu**
  - Pokrytí alespoň jednoho pilotního business požadavku koncem MVP.
  - Zpracování referenčních exportů BA/BS bez manuálních zásahů.
  - Identifikace klíčových datových mezer (např. `Missing from source`, nízký `articulationScore`).
- **Post-MVP backlog (shrnutí)**
  - Tool 4 – Bezpečnostní analyzátor a `security_report.md`.
  - Tool 5 – ER diagram (Mermaid), Tool 6 – Power Query/SQL skripty (`diagram.md`, `query.m`).
  - Multi-agentní architektura, pokročilé heuristiky/ML, integrace s workflow systémy.
