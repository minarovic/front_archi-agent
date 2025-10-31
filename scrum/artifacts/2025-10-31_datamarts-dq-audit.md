# Data‑Quality Audit — BA/BS Datamarts Metadata

Date: 2025-10-31
Dataset: docs_langgraph/BA-BS_Datamarts_metadata.json
Scope: Schema integrity, keys/relations, duplicates/gaps, Tool 1 mapping, quick fixes, readiness score

## Findings

- Root struktura
  - Kořen je JSON „pole polí“ (3 vnořené seznamy), bez top-level objektových klíčů. Skupinová sémantika není popsána.
  - Skupina 0: typName „Schema“ (dm_ba_purchase, dm_bs_purchase).
  - Skupina 1: „Database View“ pro BA i BS (dimensions, facts, rels).
  - Skupina 2: opakuje mnoho BA „Database View“ + přidává „Column“.
  - Dopad: spotřebitel musí sám odvodit význam skupin (dle typeName a fullName).

- Klíče a významy (většinově konzistentní)
  - Identifikátory: id (GUID), displayName, fullName (hierarchická cesta), url (Collibra odkaz).
  - Klasifikace: typeName ("Schema", "Database View", "Column"), status ("Implemented", "Missing from source").
  - Kvalita/governance: articulationScore (číslo), validationResult (bool), domainName, communityName.
  - Popisy: description a/nebo descriptionFromSourceSystem; často jen descriptionFromSourceSystem.
  - Vazby/lineage: "Hierarcy Relation" (pozor na překlep), referuje rodičovský id.
  - Nepravidelné klíče: dataSourceType (u Schemas), sourceTags, archivalPeriod, retentionPeriod, dq*, businessName, tableType, sapSourceName, czechDescription, mappingTable, mappingColumn, ownerInSource; u Column: technicalDataType, columnPosition, isNullable, isPrimaryKey, originalName.

- Typová konzistence
  - id/displayName/fullName/url/typeName/status: stringy (OK).
  - articulationScore: číslo (float).
  - validationResult/hasDqMonitoring/hasManualEntry/isNullable/isPrimaryKey: bool.
  - deletionApproach: pole stringů.
  - columnPosition: číslo s desetinnou tečkou (semanticky integer).
  - "Hierarcy Relation": string GUID na parent id.

- Kritická pole
  - id, displayName, fullName, typeName, status, validationResult se objevují konzistentně.
  - "Hierarcy Relation" na Views (→ Schema id) i Columns (→ View id).
  - dataSourceType převážně jen u Schema.
  - descriptionFromSourceSystem je většinový zdroj popisu; description občas chybí.
  - Časté sentinel hodnoty "N/A" místo null/absence.

- Vztahy a klíče
  - Primary‑like: id (globálně unikátní), fullName (pravděpodobně unikátní).
  - Foreign‑like: "Hierarcy Relation" ukazuje na parent (View → Schema, Column → View).
  - Hierarchie je zřejmá i z fullName path.

- Duplicity a mezery
  - Duplicity napříč skupinami: řada BA views se opakuje se stejným id.
  - Potenciální dvojice sloupců jen s odlišným casingem (např. Framework_agr_item_quantity vs framework_agr_item_quantity).
  - Nekonzistentní přítomnost některých klíčů (dataSourceType, sourceTags, businessName).
  - validationResult = false je hojné, i když status = "Implemented".
  - "Missing from source" smíchané s mapping informacemi → nejasná sémantika.
  - Sentinel "N/A" v řadě polí.
  - columnPosition jako float místo integer.
  - Mix lokalizace (czechDescription) bez explicitního locale klíče.

- Zdrojové systémy (stopy)
  - Databricks Unity Catalog (Schemas).
  - SAP (MARA, LFA1, EKKO, EKKN, ZMM_FC_PUR_D_CC, ZMM_NB_QUEUE_H, zmhonak3_zal, zmhonist_puvod) a LDAP.
  - Lakehouse „silver“ reference.

- Mapování pro Tool 1 (kandidáti)
  - entities[] (výběr, deduplikováno): dm_ba_purchase, dm_bs_purchase, dimv_material, dimv_material_group, dimv_supplier, dimv_purchase_group, dimv_currency, dimv_cost_center, dimv_person, dimv_document_created_date, dimv_system_requisition_date, dimv_accounting_currency, dimv_invoicing_supplier, dimv_manufacturer_supplier, dimv_m_project, factv_purchase_order_item, factv_purchase_order_item_detail, factv_purchase_requisition, factv_invoice_document, factv_framework_agreement, factv_framework_agreement_detail, factv_bs_purchase_ekl_metric, factv_bs_purchase_ekl_metric_current, factv_bs_purchase_ekl_metric_closing_date, factv_bs_project_share_current, relv_ba_purchase, relv_ba_framework_agreement, relv_ba_purchase_security.
  - metrics[]: credit_note_amount, STD_Price, menge, EKL metrics (bs_purchase_ekl_metric*).
  - sources[]: Databricks Unity Catalog; SAP (MARA, LFA1, EKKO, EKKN, ZMM_FC_PUR_D_CC, ZMM_NB_QUEUE_H, zmhonak3_zal, zmhonist_puvod); LDAP.

## Quick fixes (max 10)

1) Zaveď top-level strukturu: { schemas:[], views:[], columns:[] } nebo jednotné pole s klíči level, parentId, parentType.
2) Přejmenuj „Hierarcy Relation“ na „hierarchyRelation“ a vynucuj referenční integritu (view→schema, column→view).
3) Deduplicituj záznamy podle id a zvol „canonical“ zdroj.
4) Normalizuj status a pravidla: “Missing from source” používej jen když skutečně chybí; jinak “Implemented” + separátní flag availability/sourcePresence.
5) Nahraď „N/A“ za null/absenci a dokumentuj povolené hodnoty (archivalPeriod, retentionPeriod, dqCheckType…).
6) Typy čísel: columnPosition jako integer; ponech float jen tam, kde dává smysl (articulationScore).
7) Přidej „entityCategory“ s řízenými hodnotami: schema|dimension|fact|relation|column.
8) Propaguj zdrojová metadata na úroveň View (sourceSystem, sourceObject) – extrahuj ze stávajících popisů a mappingů.
9) Odstraň kolize názvů sloupců lišící se jen casingem.
10) Definuj pravidla pro validationResult a proveď hromadnou revalidaci.

## Readiness score

72 — Silné identifikátory, jasná (byť implicitní) hierarchie, bohaté popisy a zřetelné zdroje. Zdržují duplicity, překlep ve vazebním klíči, nekonzistentní status/validation a kořenová struktura „pole polí“. Po aplikaci quick fixes je dataset pro Tool 1 velmi dobře připravitelný.

## JSON summary

{
  "entities": [
    "dm_ba_purchase",
    "dm_bs_purchase",
    "dimv_material",
    "dimv_material_group",
    "dimv_supplier",
    "dimv_purchase_group",
    "dimv_currency",
    "dimv_cost_center",
    "dimv_person",
    "dimv_document_created_date",
    "dimv_system_requisition_date",
    "dimv_accounting_currency",
    "dimv_invoicing_supplier",
    "dimv_manufacturer_supplier",
    "dimv_m_project",
    "factv_purchase_order_item",
    "factv_purchase_order_item_detail",
    "factv_purchase_requisition",
    "factv_invoice_document",
    "factv_framework_agreement",
    "factv_framework_agreement_detail",
    "factv_bs_purchase_ekl_metric",
    "factv_bs_purchase_ekl_metric_current",
    "factv_bs_purchase_ekl_metric_closing_date",
    "factv_bs_project_share_current",
    "relv_ba_purchase",
    "relv_ba_framework_agreement",
    "relv_ba_purchase_security"
  ],
  "metrics": [
    "credit_note_amount",
    "STD_Price",
    "menge",
    "EKL metrics (bs_purchase_ekl_metric family)"
  ],
  "sources": [
    "Databricks Unity Catalog",
    "SAP MARA",
    "SAP LFA1",
    "SAP EKKO",
    "SAP EKKN",
    "SAP ZMM_FC_PUR_D_CC",
    "SAP ZMM_NB_QUEUE_H",
    "SAP zmhonak3_zal",
    "SAP zmhonist_puvod",
    "LDAP"
  ],
  "issues_count": 12,
  "readiness_score": 72
}
