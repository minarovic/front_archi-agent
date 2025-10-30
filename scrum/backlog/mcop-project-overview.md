---
id: MCOP-PROJECT-OVERVIEW
type: story
status: planned
priority: must-have
updated: 2025-10-30
skill_implementation: null
skill_status: "manual_only"
skill_time_saved: null
skill_created: false
---

# Metadata Copilot – Project Overview

Brief
- Popsat celkový záměr Metadata Copilota, jeho vstupy, nástrojovou sadu, orchestraci a očekávané výstupy, aby všechny work itemy vycházely ze stejného rámce.

Acceptance criteria
- [ ] Dokumentace uvádí hlavní cíl agenta a zdůrazňuje propojení business požadavků s technickými metadaty.
- [ ] Popsané jsou všechny plánované nástroje (Tool 0–7) a jejich role.
- [ ] Workflow, RAG požadavky a výstupní artefakty jsou detailně zachyceny.
- [ ] Identifikovaná jsou plánovaná budoucí rozšíření (multi-agent, heuristiky, integrace).

Notes
- **Cíl**
  - Vytvořit LangGraph agenta („Metadata Copilot“), který propojí business požadavky na datový projekt s technickou realitou v metadatech (Collibra, Databricks Unity Catalog, SAP).
  - Agent funguje jako orchestrátor s RAG schopnostmi kombinující deterministické kroky a specializovaná LLM volání.
- **Vstupní data**
  - Business kontext: dokument „Požadavek na datový projekt“ (cíle, rozsah, entity, očekávané zdroje).
  - Technická metadata: offline exporty (JSON/XML) se schématy, pohledy, sloupci, vztahy a governance atributy (`fullName`, `id`, `Hierarcy Relation`, `typeName`, `articulationScore`, `validationResult`, `securityClassification`, `sourceTags`, popisy).
- **Nástrojová sada (Tool 0–7)**
  1. Tool 0 – Analyzátor požadavků (RAG-LLM extrakce business kontextu).
  2. Tool 1 – Datové konektory (ingest & filtrování metadat).
  3. Tool 2 – Strukturální analyzátor (identifikace faktů/dimenzí/hierarchií).
  4. Tool 3 – Analyzátor kvality (`validationResult`, `articulationScore`, `Missing from source`).
  5. Tool 4 – Bezpečnostní analyzátor (klasifikace, PII, návrh RLS).
  6. Tool 5 – Generátor ER diagramu (Mermaid).
  7. Tool 6 – Generátor skriptů (Power Query M, SQL).
  8. Tool 7 – Generátor reportů (governance + RLS, RAG s business kontextem).
- **Orchestrace Workflow**
  1. Node 0 – Načtení business kontextu (Tool 0).
  2. Node 1 – Ingest a filtrování metadat (Tool 1).
  3. Node 2 – Paralelní běh Tool 2, Tool 3, případně Tool 4 nad filtrovanými daty.
  4. Node 3 – Konsolidace výsledků a rozhodování (router).
  5. Node 4 – Generování artefaktů (Tool 5–7) s využitím získaného kontextu.
  6. Node 5 – Finalizace a předání výstupů.
- **RAG požadavky**
  - Obohatit LLM o interní standardy (pojmenovávání, modeling, šablony M/SQL, RLS best-practices).
  - Dynamicky kombinovat business kontext (Tool 0) s technickými nálezy (Tool 2–4).
  - Mapovat business pojmy na technické entity (např. „dodavatelé“ → `dimv_supplier`).
- **Výstupní artefakty**
  - `structure.json`, `diagram.md`, `governance_report.md`, `security_report.md`, `query.m`.
- **Budoucí rozšíření**
  - Multi-agentní architektura se supervisorem a specializovanými agenty (Modeling, Quality, Security).
  - Pokročilé heuristiky/ML pro klasifikaci entit.
  - Integrace s interními workflow systémy, monitoring kvality vstupních exportů, automatizace následných kroků.
