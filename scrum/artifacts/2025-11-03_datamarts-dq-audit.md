# BA-BS Datamarts Metadata - Data Quality Audit
**Date:** 2025-11-03
**File:** `docs_langgraph/BA-BS_Datamarts_metadata.json`
**Total Records Analyzed:** 2,182

---

## Executive Summary

Comprehensive data quality audit of BA-BS Datamarts metadata reveals **moderate** readiness for Tool 1 ingestion. The dataset demonstrates excellent structural consistency (100% coverage of core technical fields) but **critical gaps in business metadata** (description, businessName, owner) significantly impact usability for semantic search and business requirement matching.

**Key Concern:** Only 5.8% of records have business descriptions, making it challenging to map user requests to technical assets without heavy reliance on `descriptionFromSourceSystem` technical documentation.

---

## Findings

### Schema Issues

- **[schema]** `$[*][*].description` – Only **5.8%** coverage (126 records). Most records rely solely on `descriptionFromSourceSystem` (99.5% coverage), which contains technical rather than business-oriented definitions. **Impact:** Tool 1 semantic matching will struggle with business terminology.

- **[schema]** `$[*][*].ownerInSource` – Only **8.3%** coverage (181 records). Ownership information is sparse, appearing primarily in UUID format (`c9c9fdf4-27ed-479d-b03b-f8ccec7a9f91`). **Impact:** Cannot reliably populate `business_owner` field for Tool 1 entities.

- **[schema]** `$[*][*].businessName` – Only **0.1%** coverage (3 records: `dimv_material` only). Nearly absent across the dataset. **Impact:** Loss of human-readable business terminology.

- **[schema]** `$[*][*].securityClassification` – Only **0.1%** coverage (2 records: `dm_ba_purchase`, `dm_bs_purchase` schemas marked as "Confidential"). **Impact:** Cannot enforce security constraints in Tool 1.

- **[schema]** `$[*][*].sapSourceName` – Only **0.1%** coverage (3 records: `MARA` for material table). **Impact:** Limited SAP lineage traceability.

- **[schema]** Field type consistency – **100% consistent**. All fields maintain their declared types across all records. No type anomalies detected.

### Key Candidates

#### Primary-Like Keys

- **[keys]** `$[*][*].id` – **2,182 UUIDs** found, all in format `0192480d-a0dc-736e-b034-c740659fcbcd`. **Reason:** Each record has unique UUID identifier. This is the definitive primary key for Collibra assets.

- **[keys]** `$[*][*].displayName` + `$[*][*].typeName` – **Composite natural key**. While `displayName` alone has 107 duplicates, the combination with `typeName` provides business-level uniqueness. **Reason:** Tables like `dimv_material` appear in both `dm_ba_purchase` and `dm_bs_purchase` schemas but with different IDs.

- **[keys]** `$[*][*].fullName` – **2,182 unique values**. Format: `Systems>dap_gold_prod>dm_ba_purchase>dimv_material`. **Reason:** Hierarchical path serves as human-readable natural key.

#### Foreign-Like Keys

- **[keys]** `$[*][*].Hierarcy Relation` (note: typo in source) – **2,364 references** found across 2,182 records. **Reason:** References parent entity ID in hierarchy. Multiple records can share same parent (e.g., all columns in `dimv_material` reference table ID `0192480d-a107-7358-899c-e945db393618`).

- **[keys]** `$[*][*].ownerInSource` – **181 UUID references**. **Reason:** References owner entity (person/role) when populated. Values like `c9c9fdf4-27ed-479d-b03b-f8ccec7a9f91` appear repeatedly, suggesting shared ownership.

- **[keys]** `$[*][*].domainName` + `$[*][*].communityName` – **Semantic foreign keys**. All records belong to "DAP Business Partner Gold" domain within "DAP (Databricks) Business Partner" community. **Reason:** Logical grouping for governance.

### Duplication Issues

- **[duplication]** **107 duplicate `displayName` values** detected. Examples:
  - `dimv_material` – appears 2× (in `dm_ba_purchase` and `dm_bs_purchase`)
  - `dimv_material_group` – appears 2×
  - `dimv_purchase_group` – appears 2×
  - `dimv_supplier` – appears 2×
  - Date dimension views (e.g., `dimv_purchase_order_created_date`) – appear 2×

  **Impact:** Ambiguity when user requests "material dimension" without schema context. Tool 1 must use `fullName` or schema prefix to disambiguate.

- **[duplication]** **No conflicting aliases** detected. All `displayName` duplicates are legitimate cross-schema reuse of same logical entities.

- **[duplication]** **Missing critical fields** – See Schema Issues section. Description, owner, and business name gaps affect majority of records.

- **[duplication]** **Inconsistent status values** – Two records (`factv_bs_material_share`, `factv_bs_material_share_current`) marked as `"Missing from source"` while having full metadata. **Impact:** Status field reliability questionable.

### Mapping Coverage for Tool 1

#### Entities (`entities[]`)
- **Coverage:** 100% (2,182/2,182 records)
- **Rationale:** All records have `typeName` (Schema/Database View/Column), `displayName`, and `fullName`, which are sufficient for basic entity extraction.
- **Gap:** Only 5.8% have business `description`, limiting semantic richness.
- **Tool 1 Mapping Strategy:** Use `descriptionFromSourceSystem` as fallback, but flag as "technical description" for user awareness.

#### Metrics (`metrics[]`)
- **Coverage:** 93.4% (2,038/2,182 records)
- **Rationale:** Records with `fact` in `displayName` (e.g., `factv_purchase_order_item`) or Column type are potential metrics. Also includes `articulationScore` (100% coverage) as quality metric.
- **Gap:** No explicit KPI/measure metadata. Metrics identification relies on naming conventions.
- **Tool 1 Mapping Strategy:** Extract column-level records with numeric data types from fact tables. Use `czechDescription` when available (5.7% coverage) for localized metric names.

#### Sources (`sources[]`)
- **Coverage:** 0.2% (4/2,182 records)
- **Rationale:** Only 4 records have `dataSourceType` ("Databricks Unity Catalog") or `sapSourceName` ("MARA").
- **Critical Gap:** Source lineage is severely underrepresented. Cannot reliably trace to SAP or other upstream systems.
- **Tool 1 Mapping Strategy:** Default to "Databricks Unity Catalog" for all records (inferred from `fullName` path `Systems>dap_gold_prod`). Flag source lineage as "incomplete."

#### Constraints (`constraints[]`)
- **Coverage:** 100% (2,182/2,182 records)
- **Rationale:** All records have `validationResult` (boolean true/false) and `status` (Implemented/Missing from source).
- **Gap:** `dqCheckType` and `dqMonitoringFrequency` present in schemas (e.g., "Ad hoc", "N/A") but not in columns. No validation rules or business constraints captured.
- **Tool 1 Mapping Strategy:** Extract `validationResult` as quality constraint, `status` as availability constraint. Note absence of DQ rules.

### Anomaly Check

- **[anomaly]** `$[0][0].Hierarcy Relation` – Field name is **misspelled** ("Hierarcy" instead of "Hierarchy"). **Standardization:** Correct typo in future metadata exports or create alias field.

- **[anomaly]** `$[*][*].deletionApproach` – Arrays like `["N/A"]` mixed with string values. **Standardization:** Normalize to consistent array format or convert all "N/A" to null.

- **[anomaly]** `$[*][*].status` – Enum inconsistency: Most records are "Implemented", but 2 are "Missing from source" despite having full metadata. **Standardization:** Audit status field logic in Collibra.

- **[anomaly]** **Nested array structure** – Data is structured as `[[schemas], [tables/views], [columns], ...]`. While valid JSON, this implicit grouping by hierarchy level is not documented. **Standardization:** Add explicit `hierarchyLevel` field or flatten to single array with level indicator.

- **[anomaly]** **No unknown keys** detected. All fields conform to expected Collibra asset schema.

- **[anomaly]** **No invalid JSON** detected. File parses successfully with 2,182 valid objects.

---

## Quick Fixes

### Priority 0 (Blockers for Tool 1)
1. **[P0] Enrich `description` field for 2,056 records (94.2% missing)** – Export business glossary definitions from Collibra or conduct SME interviews to populate human-readable descriptions. Without this, semantic matching relies solely on technical column names.

2. **[P0] Populate `ownerInSource` for 2,001 records (91.7% missing)** – Map UUID owner references to actual names/emails. Tool 1 needs to identify stakeholders for follow-up questions.

3. **[P0] Add `dataSourceType` metadata to 2,178 records (99.8% missing)** – Default to "Databricks Unity Catalog" as inferred value, but ideally trace to SAP tables (e.g., via `sapSourceName`).

### Priority 1 (Quality Issues)
4. **[P1] Standardize `displayName` duplicates** – Add schema prefix to 107 duplicate names (e.g., `dm_ba.dimv_material` vs. `dm_bs.dimv_material`) to eliminate ambiguity in user queries.

5. **[P1] Populate `businessName` field for 2,179 records (99.9% missing)** – Critical for business user adoption. Extract from `czechDescription` where available (5.7%) and extend to all assets.

6. **[P1] Add `securityClassification` to 2,180 records** – Only 2 schemas marked "Confidential". Extend classification to all tables/views/columns for access control in Tool 1.

### Priority 2 (Nice-to-Have)
7. **[P2] Correct `Hierarcy Relation` typo** – Rename field to `HierarchyRelation` in next metadata export or create alias.

8. **[P2] Add SAP lineage mappings** – Only 3 records have `sapSourceName`. Enrich with SAP table names (e.g., EKKO, EKPO for purchasing) to enable end-to-end lineage.

9. **[P2] Document `deletionApproach` and `retentionPeriod` logic** – Currently all set to "N/A". Populate with actual data retention policies for compliance.

10. **[P2] Investigate 2 "Missing from source" status records** – `factv_bs_material_share` and `factv_bs_material_share_current` have full metadata but incorrect status. Audit Collibra synchronization logic.

---

## Readiness Score

**Score: 28.1 / 100**

**Reasoning:** Schema integrity is strong (no structural errors), but critical business metadata gaps significantly limit Tool 1 usability. Without descriptions and ownership, semantic matching will be constrained to technical field names, reducing precision for business user queries.

**Breakdown:**
- Description coverage: 1.5 pts (5.8% × 0.25)
- Owner coverage: 1.7 pts (8.3% × 0.20)
- Validation coverage: 15.0 pts (100% × 0.15)
- Business name coverage: 0.0 pts (0.1% × 0.15)
- Structural quality: 10.0 pts (no anomalies × 0.10)
- Deduplication: 0.0 pts (107 duplicates × 0.10)
- Source metadata: 0.0 pts (0.2% × 0.05)

---

## Coverage Table

| Field                       | % Present | Notes                                                                                        |
| --------------------------- | --------- | -------------------------------------------------------------------------------------------- |
| description                 | 5.8%      | Critical gap – only 126/2,182 records. Most rely on technical `descriptionFromSourceSystem`. |
| businessName                | 0.1%      | Near-total absence – only 3 records (`dimv_material`). Blocks business user adoption.        |
| ownerInSource               | 8.3%      | Limited ownership metadata. UUIDs present but not human-readable.                            |
| sapSourceName               | 0.1%      | Severely limited SAP lineage – only 3 records (MARA).                                        |
| securityClassification      | 0.1%      | Only 2 schemas classified. No column-level security metadata.                                |
| czechDescription            | 5.7%      | Localized descriptions present for 124 records. Useful for Czech business users.             |
| descriptionFromSourceSystem | 99.5%     | Excellent technical documentation coverage. Use as fallback.                                 |
| dataSourceType              | 0.2%      | Critical lineage gap – only 4 records. Infer "Databricks Unity Catalog" for others.          |
| validationResult            | 100.0%    | All records have quality validation flag. Good baseline for constraints.                     |
| id (UUID)                   | 100.0%    | Perfect primary key coverage. All records uniquely identified.                               |
| displayName                 | 100.0%    | Full coverage but 107 duplicates require schema disambiguation.                              |
| typeName                    | 100.0%    | Perfect entity type classification (Schema/View/Column).                                     |
| Hierarcy Relation           | 108.3%    | More FK refs than records (2,364 vs 2,182) – expected for column→table hierarchy.            |

---

## JSON Summary

```json
{
  "readiness_score": 28.1,
  "key_candidates": {
    "primary_like": [
      "$[0][0].id - UUID format - unique identifier for each asset",
      "$[0][1].id - UUID format - unique identifier for each asset",
      "$[1][0].id - UUID format - unique identifier for each asset",
      "$[1][1].id - UUID format - unique identifier for each asset",
      "$[1][2].id - UUID format - unique identifier for each asset"
    ],
    "foreign_like": [
      "$[0][0].Hierarcy Relation - References parent entity in hierarchy",
      "$[0][0].ownerInSource - References owner entity (person/role)",
      "$[0][1].Hierarcy Relation - References parent entity in hierarchy",
      "$[0][1].ownerInSource - References owner entity (person/role)",
      "$[1][0].Hierarcy Relation - References parent entity in hierarchy"
    ]
  },
  "missing_fields": [
    "description: 2056 records",
    "ownerInSource: 2001 records",
    "businessName: 2179 records"
  ],
  "duplicates": [
    "dimv_material: 2 occurrences",
    "dimv_material_group: 2 occurrences",
    "dimv_purchase_group: 2 occurrences",
    "dimv_supplier: 2 occurrences",
    "dimv_bs_purchase_ekl_created_date: 2 occurrences",
    "dimv_bs_purchase_ekl_metric: 2 occurrences",
    "dimv_bs_purchase_ekl_metric_month: 2 occurrences",
    "dimv_bs_purchase_ekl_metric_property: 2 occurrences",
    "dimv_real_bs_purchase_ekl_metric_property: 2 occurrences",
    "dimv_share_full_material_bs_purchase_ekl_metric_property: 2 occurrences"
  ],
  "mapping_coverage": {
    "entities": 1.0,
    "metrics": 0.93,
    "sources": 0.0,
    "constraints": 1.0
  },
  "quick_fixes": [
    "P0: Add business_owner metadata to 2001 records missing ownership",
    "P0: Complete description field for 2056 records",
    "P1: Standardize type definitions - found 3 unique types",
    "P1: Add businessName to 2179 records for improved discoverability",
    "P2: Review and deduplicate 107 duplicate displayNames",
    "P2: Investigate 0 type inconsistencies across fields",
    "P2: Enrich SAP source mappings - only 0.1% have this metadata"
  ]
}
```

---

## Recommendations for Tool 1 Implementation

### Immediate Actions
1. **Fallback Strategy:** Use `descriptionFromSourceSystem` as primary description source, but prepend with "[Technical]" tag to signal to users that it's not business-oriented language.

2. **Schema Disambiguation:** Always include schema name in entity display (e.g., "Material Dimension (BA Purchase)" vs. "Material Dimension (BS Purchase)").

3. **Owner Resolution:** Create separate lookup service to resolve `ownerInSource` UUIDs to actual names before ingestion.

### Medium-Term Enhancements
4. **Business Glossary Integration:** Export Collibra business glossary terms and map to technical assets via fuzzy matching on `displayName`.

5. **SAP Lineage Enrichment:** Query SAP metadata repositories (e.g., ABAP Dictionary) to backfill `sapSourceName` for all tables/views that originate from SAP ERP.

6. **Metric Detection:** Implement heuristic to identify metrics:
   - Fact table columns with numeric data types
   - Column names ending in `_amount`, `_quantity`, `_count`, `_value`
   - Aggregatable fields in views with `factv_` prefix

### Long-Term Strategy
7. **Metadata Quality Gates:** Establish minimum metadata completeness requirements in Collibra before assets are promoted to "Implemented" status:
   - Business description: mandatory
   - Business owner: mandatory
   - Data source: mandatory
   - Security classification: mandatory (default to lowest level)

8. **Automated Enrichment:** Deploy NLP pipeline to generate candidate business descriptions from `descriptionFromSourceSystem`, then route to SMEs for approval.

---

**Audit Completed:** 2025-11-03
**Auditor:** Data Quality Automation (Python analysis script)
**Next Review:** Before Tool 1 Beta Release
