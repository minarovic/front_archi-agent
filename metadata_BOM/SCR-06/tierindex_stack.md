# TierIndex Stack for SCR‑06

## 1. Bronze Layer – „Get the data in“
- **Tabulka:** `skoda_tierindex_{env}.bronze.sap_bom_structure`
- **Formát:** Delta Lake + Unity Catalog registrace (viz `04_core_constraints.md`)
- **Obsah:** `bom_id`, `matnr`, `parent_node`, `idnrk`, `werks`, `level_depth`, `tree_path_aennr`, `product_class`, `ingestion_date`
- **Pipeline:** Databricks job `ti_bronze_bom_ingest` (weekly baseline + ad-hoc refresh)
- **Kontroly:** row-count vs source CSV, mandatory columns, partition completeness

## 2. Silver Layer – „Normalize and link“
- **Tabulky:** `ti_entity_s`, `ti_edge_s`, `ti_bom_usage_s`, `ti_module_owner_s`
- **Akce pro SCR‑06:**
  - Join SAP BOM nodes s Sayari/DnB entitami → generovat `bom_edge` záznamy
  - Validovat parent-child integrity (`is_cycle`, `missing_parent`)
  - Ukládat mapping `product_class_id ↔ TierIndex root entity`
- **Monitoring:** background monitoring parity (baseline vs changeset), quality metrics (coverage %, duplicates)

## 3. Gold Layer – „Serve per domain“
- **Varianty:**
  - *Gold_shared*: jediné view s RLS (rychlejší start, méně izolace)
  - *Gold_per_domain*: `gold_logistics`, `gold_quality`, `gold_risk` (lepší výkon, jasné SLA)
- **Architecture Decisions:**  
  1. Multi-Gold ano/ne?  
  2. Cascade vs parallel update?  
  3. Jaké materializované pohledy (např. `vw_bom_tier_path` pro MCOP)?
- **Outputs:** curated graf pro SCR‑05/07/09, exporty pro MCOP/metadata agent (sekundární).

## 4. Governance Essentials
- Unity Catalog owner: TierIndex platform team
- Data classification: INTERNAL – Supplier Sensitive
- Audit trail: `DESCRIBE HISTORY`, EventHub/Monitor logs pro ingest
- RLS: definovat access policies už na Gold layer (logistika ≠ risk)

## 5. Závislosti mimo TierIndex
- Sayari unlimited API (Tier 2/3)
- DnB Company Master (Tier 1 enrichment)
- MCOP metadata agent → jen consumer (`vw_bom_tier_path`), ne ovlivňovatel pipeline
- CORE data model (`CORE/03_core_data_model.md`) – závazná schémata: `ti_entity` (supplier/manufacturer/owner), `ti_edge` (supply/ownership/control taxonomy), `ti_tier_assignment`, `ti_manifest`; při návrhu Silver/Gold vrstev dodržet povinná pole a validační pravidla (no self-reference, confidence bounds, checksum manifestů).
