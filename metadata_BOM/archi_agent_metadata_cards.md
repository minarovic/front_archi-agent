# TierIndex → Archi-Agent Metadata Cards

**Datum:** 6. listopadu 2025
**Autor:** GitHub Copilot (GPT-5-Codex Preview)
**Scope:** Metadata pro sdílení s Metadata Copilot (archi-agent) bez nutnosti kopírování surových dat.

---

## Jak tuto šablonu používat
- **Cíl:** Poskytnout archi-agentovi jednotné kartičky o zdrojových tabulkách, které potřebuje pro Incident "Supplier Disruption + Compliance".
- **Obsahuje:** Účel, klíčové atributy, vlastníky, klasifikaci, původ dat, refresh a status připravenosti (ingest pipelines vs. backlog).
- **Rozsah:** Zaměřeno na metadata, nikoli na samotná data. Lze importovat do katalogu nebo využít pro ADR/ingestion backlog.

---

## 1. BOM Core Data (VSS / P-SSL)

### 1.1 `product_classes`
| Pole                     | Hodnota                                                                                                     |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| **Business účel**        | Kotevní tabulka projektů/vozidel (např. převodovky, 3V0 Superb). Vymezuje, které produkty incident zasáhne. |
| **Klíčové atributy**     | `class_code`, `description`, `lifecycle_status`, `responsible_department`, `entry_node_id`.                 |
| **Data Owner / Steward** | PLV (výroba) + ESD (engineering) – viz cockpit H2M.                                                         |
| **Data Classification**  | INTERNAL – Supplier Sensitive.                                                                              |
| **Primární zdroj**       | TI-Syncro VSS (entry node), H2M Cockpit.                                                                    |
| **Aktualizace**          | Nightly (převod VSS → P-SSL).                                                                               |
| **Ingest status**        | ❌ Není v Unity Catalogu (součást Gap 1).                                                                    |
| **Poznámky**             | Doporučeno udržovat mapování na TierIndex root entity (viz Gap 4 v BOM_HS_INTEGRATION_GAP_ANALYSIS.md).     |

### 1.2 `bom_nodes`
| Pole                     | Hodnota                                                                                                          |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| **Business účel**        | Hierarchie parent-child pro usage locations (MIO, Structural, PBE). Jádro pro dopad incidentu v rámci komponent. |
| **Klíčové atributy**     | `node_id`, `parent_node_id`, `product_class_id`, `node_type`, `node_code`, `name`, `module_id`.                  |
| **Data Owner / Steward** | ESD (engineering struktura) + modulární kokpity (viz `module_permissions`).                                      |
| **Data Classification**  | INTERNAL – Supplier Sensitive.                                                                                   |
| **Primární zdroj**       | TI-Syncro VSS (Variant Structural BOM).                                                                          |
| **Aktualizace**          | Nightly (VSS export).                                                                                            |
| **Ingest status**        | ❌ Chybí Bronze tabulka (`sap_bom_structure`) – Gap 1.                                                            |
| **Poznámky**             | Nutné zachovat adjacency list + computed path pro rychlé dotazy archi-agenta.                                    |

### 1.3 `node_variants`
| Pole                     | Hodnota                                                                                                     |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| **Business účel**        | Varianty/konfigurace v rámci uzlů (pozice 100/200/...). Zajišťuje, že incident sleduje správné konfigurace. |
| **Klíčové atributy**     | `node_variant_id`, `node_id`, `variant_code`, `sequence_no`, `release_status`, `valid_from`, `valid_to`.    |
| **Data Owner / Steward** | ESD + modulární kokpity (PR, Termin, Farb).                                                                 |
| **Data Classification**  | INTERNAL – Supplier Sensitive.                                                                              |
| **Primární zdroj**       | TI-Syncro VSS + H2M sequence logs.                                                                          |
| **Aktualizace**          | Nightly / on-change při release varianty.                                                                   |
| **Ingest status**        | ❌ V backlogu (součást Gap 1).                                                                               |
| **Poznámky**             | Doporučeno připojit historii (`variant_history`) pro audit incidentů.                                       |

### 1.4 `node_materials`
| Pole                     | Hodnota                                                                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Business účel**        | Junction tabulka: které materiály jsou namontovány na jakých variantách. Kritické pro kvantifikaci dopadu (qty, UoM).                 |
| **Klíčové atributy**     | `node_material_id`, `node_variant_id`, `material_id`, `quantity`, `uom`, `pr_rule_id`, `color_code`, `taufung_path_id`, `termin_key`. |
| **Data Owner / Steward** | PPS-1 (výroba), PLV (logistika).                                                                                                      |
| **Data Classification**  | INTERNAL – Supplier Sensitive.                                                                                                        |
| **Primární zdroj**       | P-SSL Cockpit + Taufung modul + Farb + Termin.                                                                                        |
| **Aktualizace**          | Nightly (po H2M konverzi) + ad-hoc změny.                                                                                             |
| **Ingest status**        | ❌ Gap 1.                                                                                                                              |
| **Poznámky**             | Archi-agent musí respektovat module governance (`module_permissions`).                                                                |

### 1.5 `materials` (MARA / TEIVON mirror)
| Pole                     | Hodnota                                                                                                                                                              |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Business účel**        | Master data pro komponenty – identifikace dodavatele (`supplier_code`), compliance flagy (`type_test_flag`).                                                         |
| **Klíčové atributy**     | `material_number`, `material_type`, `material_group`, `description_long`, `supplier_code`, `color_relevance_flag`, `type_test_flag`, `drawing_number`, `bmg_status`. |
| **Data Owner / Steward** | ESD (materiálový master), MARA/TEIVON tým.                                                                                                                           |
| **Data Classification**  | INTERNAL – Supplier Sensitive.                                                                                                                                       |
| **Primární zdroj**       | SAP MARA / TEIVON.                                                                                                                                                   |
| **Aktualizace**          | On-change (schválení, revize výkresu).                                                                                                                               |
| **Ingest status**        | ⚠️ Částečně – existují exporty, ale není oficiální Delta pipeline.                                                                                                    |
| **Poznámky**             | Pro compliance potřebujeme mapovat `material_group` na HS kódy (viz sekce 3).                                                                                        |

---

## 2. Governance & Ownership Metadata

### 2.1 `modules`
| Pole                     | Hodnota                                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **Business účel**        | Katalog kokpitů / modulů, které vlastní konkrétní atributy (Farb, Termin, MF...). Užitečné pro eskalace během incidentu. |
| **Klíčové atributy**     | `module_id`, `name`, `scope`, `owning_department`.                                                                       |
| **Data Owner / Steward** | DAP Platform Governance.                                                                                                 |
| **Data Classification**  | INTERNAL.                                                                                                                |
| **Primární zdroj**       | TI-Syncro konfigurace.                                                                                                   |
| **Aktualizace**          | On-change (přidání/odebrání modulu).                                                                                     |
| **Ingest status**        | ❌ Chybí v UC (doporučeno jako reference tabulka).                                                                        |
| **Poznámky**             | Při importu doporučeno přidat `contact_person` a `service_now_group`.                                                    |

### 2.2 `module_permissions`
| Pole                     | Hodnota                                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| **Business účel**        | Přesné řízení, která entita může měnit který atribut – klíčové pro governance archi-agenta (čtení vs. zápis). |
| **Klíčové atributy**     | `permission_id`, `module_id`, `attribute_name`, `control_level` (read/write/approve).                         |
| **Data Owner / Steward** | DAP Governance + moduly vlastnící atributy.                                                                   |
| **Data Classification**  | INTERNAL.                                                                                                     |
| **Primární zdroj**       | TI-Syncro Cockpit konfigurace.                                                                                |
| **Aktualizace**          | Ad-hoc (změna governance).                                                                                    |
| **Ingest status**        | ❌ Gap – zatím jen v dokumentaci.                                                                              |
| **Poznámky**             | Bez této tabulky archi-agent nedokáže validovat governance pravidla.                                          |

### 2.3 `node_documents`
| Pole                     | Hodnota                                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------------------ |
| **Business účel**        | Traceability na výkresy, schvalovací dokumenty, certifikace (užitečné při compliance incidentu). |
| **Klíčové atributy**     | `node_document_id`, `node_id`, `document_id`, `role`, `valid_from`, `valid_to`.                  |
| **Data Owner / Steward** | PLV + Quality Management.                                                                        |
| **Data Classification**  | INTERNAL – některá dokumentace může mít sub-klassifikaci (regulated).                            |
| **Primární zdroj**       | Dokumentové úložiště TI-Syncro (např. NextDoc).                                                  |
| **Aktualizace**          | On-change (release dokumentů).                                                                   |
| **Ingest status**        | ❌ Gap – zatím není v UC.                                                                         |
| **Poznámky**             | Zvažte doplnění linků na SharePoint / DMS (URL) + `sensitive_flag`.                              |

### 2.4 `lifecycle_events`
| Pole                     | Hodnota                                                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| **Business účel**        | Audit trail (H2M konverze, release, rollback). Pomáhá dokázat, kdy komponenta prošla určitou fází během incidentu. |
| **Klíčové atributy**     | `event_id`, `node_variant_id`, `event_type`, `source_module`, `event_timestamp`, `status_before`, `status_after`.  |
| **Data Owner / Steward** | PPS-1 (H2M), PLV (P-SSL), DAP audit.                                                                               |
| **Data Classification**  | INTERNAL.                                                                                                          |
| **Primární zdroj**       | H2M logy, P-SSL audit trail.                                                                                       |
| **Aktualizace**          | Near real-time (při spuštění workflow).                                                                            |
| **Ingest status**        | ❌ Gap – chybí ingestion pipeline.                                                                                  |
| **Poznámky**             | Doporučeno přidat `initiated_by` (uživatel / service account).                                                     |

---

## 3. Risk & Compliance Metadata

### 3.1 `wgr_hs_mapping`
| Pole                     | Hodnota                                                                                                                                                          |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Business účel**        | Převod WGR (materiálových skupin) na HS kódy pro compliance filtry – nezbytné pro "Supplier Disruption + Compliance".                                            |
| **Klíčové atributy**     | `material_group`, `wgr_level1_commodity`, `wgr_level2_category`, `hs_code`, `match_score`, `common_keywords`, `match_method`, `validated_by`, `validation_date`. |
| **Data Owner / Steward** | Procurement Analytics + Semantic Vision tým.                                                                                                                     |
| **Data Classification**  | INTERNAL – může odhalovat obchodní strategii.                                                                                                                    |
| **Primární zdroj**       | WGR-HS CSV (495 párů) + manuální validace.                                                                                                                       |
| **Aktualizace**          | Ad-hoc (při revizi SAP WGR nebo celních pravidel).                                                                                                               |
| **Ingest status**        | ❌ Gap 2 – tabulka neexistuje v Unity Catalogu.                                                                                                                   |
| **Poznámky**             | Při ingestu zachovat pouze Match Score ≥ 2, doplnit `coverage_pct` a `supplier_count` (viz gap analýza).                                                         |

### 3.2 `ti_supplier_metrics`
| Pole                     | Hodnota                                                                                                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Business účel**        | Gold pohled na dodavatele – rizikové skóre, SPOF flagy, budoucí `primary_hs_codes` (po implementaci Gap 3).                                                         |
| **Klíčové atributy**     | `duns`, `name`, `tier_level`, `combined_risk_score`, `financial_risk`, `compliance_risk`, `spof_flag`, *(plánované)* `primary_hs_codes`, `hs_code_diversity_score`. |
| **Data Owner / Steward** | N-Tier tým (TierIndex orchestrátor).                                                                                                                                |
| **Data Classification**  | INTERNAL – Business Critical.                                                                                                                                       |
| **Primární zdroj**       | Silver `ti_entity_s` + `ti_edge_s` + Sayari/D&B enrichments.                                                                                                        |
| **Aktualizace**          | Daily (po changesetu).                                                                                                                                              |
| **Ingest status**        | ✅ Existuje v Gold vrstvě (ale chybí HS columns – Gap 3).                                                                                                            |
| **Poznámky**             | Archi-agent by měl reflektovat budoucí rozšíření o HS a SPOF metriky.                                                                                               |

### 3.3 `taufung_paths`
| Pole                     | Hodnota                                                                                                         |
| ------------------------ | --------------------------------------------------------------------------------------------------------------- |
| **Business účel**        | Mapuje materiálový tok (od dodavatele k výrobnímu místu). Pomáhá odhadnout logistickou náročnost při incidentu. |
| **Klíčové atributy**     | `taufung_path_id`, `description`, `source_location`, `target_location`, `depth_of_manufacture_flag`.            |
| **Data Owner / Steward** | MF Cockpit (PPS-1).                                                                                             |
| **Data Classification**  | INTERNAL – Logistics Sensitive.                                                                                 |
| **Primární zdroj**       | MF Cockpit (material flow).                                                                                     |
| **Aktualizace**          | On-change (změna toku).                                                                                         |
| **Ingest status**        | ❌ Gap – zatím jen v dokumentaci.                                                                                |
| **Poznámky**             | Doporučeno doplnit `transit_time_days`, `primary_carrier`, `incoterms`.                                         |

---

## 4. Doporučené doplňkové metadata (future backlog)
| Název                       | Popis                                                                 | Stav                                            |
| --------------------------- | --------------------------------------------------------------------- | ----------------------------------------------- |
| `component_costs`           | Obsahuje nákupní cenu, kontraktní podmínky, currency.                 | ⚠️ Není dostupné (Finance / Procurement systém). |
| `supplier_backup_links`     | M:N mapa primárních a alternativních dodavatelů + `switch_time_days`. | ⚠️ Potřeba spolupráce s Procurementem.           |
| `inventory_buffers`         | Plánované a reálné zásoby pro kritické komponenty.                    | ⚠️ Třeba napojit na MPS / SAP.                   |
| `regulatory_certifications` | Evidence certifikací a homologací (ISO, TÜV, emise).                  | ⚠️ V dokumentech, nutno strukturovat.            |

*Tyto datasetty nejsou povinné pro počáteční onboarding archi-agenta, ale výrazně zvýší kvalitu odpovědí při compliance incidentech.*

---

## 5. Governance & Ingestion Checklist
- [ ] Vytvořit Bronze tabulku `staging_wsp.bronze.sap_bom_structure` (Gap 1) a přidat datové kvality (row count, checksum).
- [ ] Založit referenční tabulku `tierindex_gold.wgr_hs_mapping` (Gap 2) a doplnit auditní metadata.
- [ ] Rozšířit `ti_supplier_metrics` o HS sloupce + aktualizovat klasifikaci (Gap 3).
- [ ] Přidat per-tab metadata do Unity Catalogu: `owner`, `comment`, `data_classification`.
- [ ] Vytvořit ADR pro sdílení s archi-agentem + nastavit RBAC (`ntier_archi_agent_reader`).
- [ ] Napojit ingestion joby na Databricks Workflows (weekly baseline, daily changeset).

---

## 6. Zdroje a reference
- `scrum/architecture/bom/bom_structure.md`
- `scrum/architecture/BOM_HS_INTEGRATION_GAP_ANALYSIS.md`
- `scrum/architecture/background_monitoring/TIERINDEX_BACKGROUND_MONITORING_HS_BOM.md`
- `scrum/architecture/CORE/04_core_constraints.md`
- `scrum/architecture/communication/deep_workshop_architects/workshop_architect_focus.md`

> *Tento dokument je možné přímo importovat do Metadata Copilot katalogu nebo použít jako podklad pro backlog ingest pipeline.*
