# SCR‑06 Audit Guide (pro externí LLM)

**Účel:** Pomoci dalšímu agentovi rychle zkontrolovat, zda jsou všechny informace pro SCR‑06 dostupné a konzistentní.  
**Poznámka:** Všechny soubory jsou v tomto repu (`/Users/marekminarovic/archi-agent`).  

---

## 1. Jak začít
1. Přečti `metadata_BOM/SCR-06/README.md` – shrnuje mandát, vrstvy a commodity roadmap.  
2. Podívej se na `presentation_outline.md` – obsahuje storyboard pro deep architects.  
3. Pokud potřebuješ auditovat rozhodnutí, použij `key_decisions.md`.  

---

## 2. Technické zdroje
| Oblast | Soubory | Co zde najdeš |
|--------|---------|---------------|
| Platformní požadavky | `metadata_BOM/04_core_constraints.md` | Unity Catalog/Delta/Databricks pravidla |
| CORE datový model | `CORE/03_core_data_model.md`, `SCR-06/core_data_model_summary.md` | Entity/edge/tier schema, validace |
| Fyzický návrh | `metadata_BOM/physical_model.md` | Inspirační ETL design (Bronze/Silver/Gold tabulky) |
| Vizuály | `metadata_BOM/tierindex_visual.md` | Mermaid diagramy TierIndexu |
| WGR↔HS | `hs_codes/wgr_hs_mapping_analysis.md`, `SCR-06/wgr_hs_summary.md` | Mapování commodity dimenze |
| Gap analýza BOM | `metadata_BOM/BOM_HS_INTEGRATION_GAP_ANALYSIS.md` | Seznam mezer a plánů |

---

## 3. Co ověřit
1. **Bronze ingest** – je `sap_bom_structure` popsaný (viz README + physical_model)?  
2. **Silver** – máme definici `ti_bom_usage_s` a validace (viz core model + tierindex_stack).  
3. **Gold** – je rozhodnuto, zda bude shared vs multi (viz key_decisions)?  
4. **Commodity roadmap** – existuje WGR (ano) a plán HS (viz README + wgr_hs_summary).  
5. **Vizuální materiál** – odkaz na `tierindex_visual` pro slide 1.  
6. **Audit logy** – `sources_manifest.md` uvádí všechny reference.  
7. **Metadata agent role** – zmiň v README/presentation outline, že je konzument (Tool 0–3).  

---

## 4. Tipy pro review
- Pokud dokument chybí, zkontroluj `sources_manifest.md` – obsahuje kompletní seznam s umístěním.  
- Při kontrole WGR/HS se soustřeď na kvalitu mapy (score 3 vs 2) a to, že dataset zatím není v UC (gap).  
- Připomeň, že `physical_model` je návrhový dokument (není finální implementace).  
- V action trackeru (viz README) si ověř, že Bronze ingest a HS mapování mají vlastníky.  

---

> Po auditu aktualizuj `metadata_BOM/SCR-06/AUDIT_REPORT.md` (pokud existuje) a doplň, jaké kontroly proběhly.
