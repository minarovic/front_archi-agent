# SCR‑06 Key Decisions Checklist

| # | Téma | Otázka k rozhodnutí | Navržené možnosti | Poznámka |
|---|------|---------------------|-------------------|----------|
| 1 | Bronze Ingest | Kdo vlastní ETL `ti_bronze_bom_ingest` a jaký je SLA? | TierIndex ETL squad vs sdílený DAP tým | Musí splňovat CORE constraints (Unity Catalog, Delta); inspirace `physical_model.md` |
| 2 | Silver Validation | Jaké automatické testy spustíme na `ti_bom_usage_s`? | cycle check, missing parent, coverage per product class | Výsledky logovat do audit artefaktů |
| 3 | Gold Architektura | Shared Gold vs Multi-Gold? | Varianta A (shared), Varianta B (per domain) | Ovlivní RLS, výkon a monitoring |
| 4 | Update Pattern | Cascade vs Parallel update při Silver → Gold propagaci? | Waterfall / Parallel | Nutné promyslet retry/rollback |
| 5 | Graph Persistence | Stačí SQL (Delta + recursive CTE), nebo přidat specializovaný graph store? | SQL only / SQL + Neo4j / SQL + Graph Table | Rozhodnutí ovlivní SCR‑05 (SPOF) |
| 6 | Export Views | Jaké výřezy poskytujeme MCOP/metadata agentovi? | `vw_bom_tier_path`, `vw_bom_coverage` | Jen jako read-only view, bez dalších požadavků |
| 7 | Security & RLS | Kdo schvaluje přístupy k BOM datům v Gold vrstvách? | Security lead vs domain owner | BOM = Supplier Sensitive → RLS povinné |
| 8 | Commodity Enrichment | Jaký je plán a owner pro WGR→HS mapování? | Procurement data steward / TierIndex ETL | Postupně: WGR (dnes) → HS (6/8cif), viz `wgr_hs_mapping_analysis.md` |
| 9 | Timeline & Milestones | Kdy musí být Bronze ingest hotový, aby SCR‑05/07 stihly Q1 2026? | Termín navrhnout na workshopu | Zapsat do action trackeru |

Použij tento checklist při workshopu; vyplněné odpovědi přidej do akčního logu.
