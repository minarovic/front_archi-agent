# SCR‑06 Sources Manifest (pro LLM / audit)

**Datum:** 2025-11-06
**Účel:** Uvést všechny zdroje, ze kterých vychází materiály v `metadata_BOM/SCR-06/` (slouží jako audit stopa pro jiné asistenty nebo LLM).

---

## Primární zdroje

| Zdroj                                                    | Umístění     | Co bylo použito                                                                                                                       |
| -------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `metadata_BOM/04_core_constraints.md`                    | Lokální repo | Platformní požadavky (Unity Catalog, Delta Lake, Databricks, audit logging) – sekce 1–6.                                              |
| `metadata_BOM/bom_structure.md`                          | Lokální repo | BOM node typy, lifecycle (VSS → H2M → P-SSL), doporučený relační model – sekce 1–4.                                                   |
| `metadata_BOM/BOM_HS_INTEGRATION_GAP_ANALYSIS.md`        | Lokální repo | Pomocný dokument při sestavování (chybějící bronze ingest, WGR-HS mapping) – historický kontext.                                      |
| `metadata_BOM/TIERINDEX_BACKGROUND_MONITORING_HS_BOM.md` | Lokální repo | Data flow Bronze→Silver→Gold, baseline/changeset pattern, role BOM v TierIndexu.                                                      |
| `metadata_BOM/archi_agent_metadata_cards.md`             | Lokální repo | Metadata kartičky pro BOM tabulky, klasifikace, owner, ingest status.                                                                 |
| `metadata_BOM/workshop_architect_focus.md`               | Lokální repo | Architektonická rozhodnutí (Gold vrstva, update pattern, ML pipeline) – přejato pro checklist.                                        |
| `CORE/03_core_data_model.md`                             | Lokální repo | Detailní data model TierIndexu (entity, edge, BOM usage, baseline/changeset, governance).                                             |
| `metadata_BOM/physical_model.md`                         | Lokální repo | Fyzická implementace TierIndex (Bronze/Silver/Gold tabulky, partitioning, ingestion mechanismy) – starší, ale vhodné pro ETL kontext. |
| `metadata_BOM/tierindex_visual.md`                       | Lokální repo | Mermaid diagramy TierIndex konceptu (Tier 0→2, reálný příklad 3V0) použitelné pro prezentace.                                         |
| `hs_codes/wgr_hs_mapping_analysis.md`                    | Lokální repo | Mapování WGR↔HS, statistiky match score, příklady pro Semantic Vision filtraci (podpora BOM+HS integrace).                            |

---

## Doplňkové zdroje

| Zdroj                                 | Umístění     | Využití                                                                                   |
| ------------------------------------- | ------------ | ----------------------------------------------------------------------------------------- |
| `docs_langgraph/mcop-architecture.md` | Lokální repo | Kontext MCOP Tool 0–3 a incidentní orchestrátor – pouze pro poznámku o metadata agentovi. |
| `metadata_BOM/bom_use_cases.md`       | Lokální repo | Shrnutí, co lze s BOM dělat; použito pro sekci „Downstream Impact“.                       |
| `metadata_BOM/bom_story_alignment.md` | Lokální repo | Potvrzení, že SCR‑06 je top priorita pro deep architects.                                 |

---

## Poznámky
- Všechny odkazy odkazují na soubory v tomto repozitáři `/Users/marekminarovic/archi-agent`.
- Žádná externí síťová volání nebyla potřeba (čerpáno čistě z lokálních docs).
- Pokud se dokumenty aktualizují, je potřeba manifest upravit – zejména při změně CORE constraints nebo gap analýzy.
