# CORE Data Model Summary (TierIndex)

**Zdroj:** `CORE/03_core_data_model.md` (verze 1.0, 2025-10-22)  
**Účel:** Přinést klíčové části CORE datového modelu TierIndex přímo do složky SCR‑06 pro rychlý odkaz během deep-architecture přípravy.

---

## 1. Entity (`ti_entity`)
- **Primární klíč:** `entity_id` (STRING, not null)  
- **Povinné sloupce:** `entity_type` (supplier/manufacturer/owner/...), `name`, `country` (ISO-2), `tier_level` (1/2/3 nebo NULL), `source_system`.  
- **Volitelné atributy:** `duns_number`, `sayari_id`, `address`, `industry_code`, `employee_count`, `revenue`.  
- **Validace:** unikátní `entity_id`, správné ISO kódy, `tier_level` pouze {1,2,3,NULL}.

## 2. Edge (`ti_edge`)
- **Primární klíč:** `edge_id`.  
- **Povinné sloupce:** `source_entity_id`, `target_entity_id`, `raw_type`, `category` (supply/ownership/control), `direction`.  
- **Taxonomie:**  
  - *Supply:* `ships_to`, `procures_from`, `supplies_to`, `carrier_of`, `notify_party_of`…  
  - *Ownership:* `parent_of`, `subsidiary_of`, `shareholder_of`, `ultimate_parent_of`…  
  - *Control:* `director_of`, `officer_of`, `employee_of`, `legal_representative_of`…  
- **Volitelné:** `confidence` (0.00–1.00), `from_date`, `to_date`, `former`, `ownership_percentage`.  
- **Validace:** zákaz self-referencí, `raw_type` musí odpovídat `category`, datumová logika, confidence bounds.

## 3. Tier Assignment (`ti_tier_assignment`)
- **Pole:** `assignment_id`, `root_entity_id`, `entity_id`, `tier_level`, `effective_from`, `effective_to`, `source`.  
- **Pravidla:** jen tier levels 1–3, každá entita má max. jeden aktivní tier na root, cizí klíče na `ti_entity`.  
- **Logika:** baseline rebuild přidává full snapshot, changesety přepisují záznamy podle `effective_from`.

## 4. BOM Usage & Related Tables
- **`ti_bom_usage_s` (Silver):** mapuje `product_class`, `bom_node`, `component_entity_id`, `quantity`, `uom`, `source_system`.  
- **`ti_module_owner_s`:** určuje modul/cockpit (Farb, Termin, MF) zodpovědný za node variant.  
- **Note:** tabulky musí být registrovány v Unity Catalog jako Delta, navázané na entity/edge přes cizí klíče.

## 5. Manifest (`ti_manifest`)
- **Obsah:** `manifest_id`, `baseline_version`, `applied_changesets[]`, `published_at`, `checksum`, `status`.  
- **Checksum:** SHA256 přes baseline + changesets – povinné pro integritu.  
- **Lifecycle:** draft → validated → published → archived.

## 6. Validation Rules (výběr)
- **Entity:** unikátní `entity_id`, platné `entity_type`, `tier_level`, `country`.  
- **Edge:** žádné self-references, platné entity, category consistency, CONSTRAINT na `edge_key = source:target:raw_type`.  
- **Tier Assignment:** validní reference na entity, beze duplicit, časová souvislost.  
- **Manifest:** existence baseline i changesetů, chronologické pořadí, správný checksum.

## 7. Constraints & Cascade
- **Referenční integrita:** `ti_edge.source/target → ti_entity`, `ti_tier_assignment.root/entity → ti_entity`.  
- **Cascade delete:** smazání entity musí smazat související edges + tier assignments.  
- **Unique:** `entity_id`, `edge_key`, `(root_entity_id, entity_id, effective_from)`, `manifest_id`.

---

> Použij tuto rekapitulaci při navrhování Silver/Gold struktur v SCR‑06 – všechny tabulky a validace musí být s CORE modelem kompatibilní.
