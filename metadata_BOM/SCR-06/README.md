# SCR‑06 – Mapping & Verification of Sub-Supplier Chains

**Audience:** Deep Architects / TierIndex Core Team
**Focus:** TierIndex platform (Bronze→Silver→Gold, Unity Catalog, graph storage) – metadata agent slouží jen jako pomocník, ne hlavní téma.

---

## 1. Mandát story
- **Cíl:** Získat úplnou N-tier viditelnost (Tier 1 → Tier 3+) kombinací SAP Tier 1, Sayari vztahů a BOM struktury.
- **Rozsah:** Ingest BOM do Unity Catalog, propojit se Sayari/DnB entitami, ověřit konzistenci (missing nodes, conflicting ownership).
- **Výsledek:** Ověřená mapovací vrstva (`ti_bom_usage_s`, `ti_edge_s`) dostupná v TierIndex Gold pro downstream use cases (SCR‑05/07/09).

---

## 2. Proč TierIndex stojí ve středu prezentace
| Vrstva     | Co musíme ukázat architektům                                                                                                                                 | Status / poznámky                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| **Bronze** | `sap_bom_structure` Delta tabulka v `skoda_tierindex_{env}.bronze` + existující `bronze.dnb_raw`, `bronze.sayari_raw` (viz `physical_model.md`, kap. Bronze) | ETL job `ti_bronze_bom_ingest` inspirovaný `physical_model` (API-based ingest) – čeká na implementaci |
| **Silver** | `ti_entity_s`, `ti_edge_s`, `ti_bom_usage_s`, `ti_module_owner_s`                                                                                            | CORE model definován (viz `core_data_model_summary.md`); BOM usage čeká na Bronze ingest              |
| **Gold**   | Doménové view (`gold_logistics`, `gold_risk`, `gold_quality`) + commodity dimenze (WGR/HS)                                                                   | Rozhodnutí A vs B (shared vs multi-Gold) + plánované rozšíření o WGR→HS (viz roadmap níže)            |

Bez těchto kroků MCOP ani metadata agent nedostanou konzistentní mapu, takže prezentace staví hlavně na TierIndex architektuře, governance a refinovaném commodity modelu (WGR dnes, HS postupně).

---

## 2.1 Commodity roadmap (WGR → HS)
- **Dnešní stav:** BOM usage nese `material_group` (WGR). Rychlé filtrování (např. group 250 = Glass) – viz dataset v `hs_codes/wgr_hs_mapping_analysis.md`.
- **Další krok:** Silver vrstva obohatí usage záznamy o `hs_code_6` (mapa WGR↔HS). Start s 6cif úrovní, možnost detailu na 8cif (trim posledních 2 číslic).
- **Výsledek v Gold:** View `vw_bom_tier_path` bude mít sloupce `tier_level`, `product_class`, `wgr_group`, `hs_code_6`. MCOP/dashboards mohou drill-downovat podle úrovně detailu (Tier1 = hotový díl, Tier2 = sub-komponenta, Tier3 = materiál).
- **Metadata agent role:** Sleduje, jestli nová pole mají popisy/owner/security (Tool 3), doporučuje mapování při incidentu (Tool 0/1).

---

## 2.2 Visual Intro
Použij diagramy z `metadata_BOM/tierindex_visual.md` (Core Concept + příklad 3V0). V prezentaci budeme mít slide „Typický TierIndex graf“ – anonymizovat názvy podle potřeby, ale diagramy jsou připravené (Mermaid kód).

---

## 3. Co chceme na workshopu rozhodnout
1. **Ingest & governance:** potvrdit Unity Catalog/Delta standardy z `04_core_constraints.md`; kdo vlastní Bronze/Silver pipelines.
2. **Gold vrstva:** vybrat variantu (shared vs per-domain) a způsob aktualizace (cascade vs parallel).
3. **Graph storage & query pattern:** Potřebujeme čistě SQL (recursive CTE) nebo doplnit o Neo4j/Graphlake?
4. **Validation & monitoring:** Jak se ověří, že Sayari + BOM data tvoří konzistentní N-tier graf (test cases, quality rules).
5. **Rozhraní pro metadata agent:** jen definovat export (např. `ti_bom_usage_s` view), není třeba deep dive.

---

## 4. Podklady v tomto adresáři
- `tierindex_stack.md` – detailní pohled na Bronze/Silver/Gold, Unity Catalog, audit požadavky.
- `presentation_outline.md` – storyline pro deep architects (slide bullet points, decision prompts).
- `key_decisions.md` – checklist rozhodnutí a odpovědností.
- *(volitelně)* `handoff_to_mc`
