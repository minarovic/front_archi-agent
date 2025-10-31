# BA/BS Datamarts – Executive Summary (2025-10-30T23-10-10)

- Totals:
  - Raw assets: 2182
  - Deduplicated assets: 2092
  - Schemas: 2

- Composition:
  - Types: {'Schema': 2, 'Database View': 90, 'Column': 2000}
  - Statuses: {'Implemented': 1045, 'Missing from source': 1047}

- Quality signals:
  - Validation true rate: 0.060
  - Articulation mean/median/min/max: 5.975/0.000/0.0/100.0
  - Non-zero articulation share: 0.060

- Data Quality (schemas):
  - Monitoring frequency: {'Ad hoc': 2}
  - Has monitoring: {False: 2}
  - Check type: {'N/A': 2}

- Missing fields:
  - Both descriptions missing: 12
  - ownerInSource missing: 2000 (mostly Columns)

- Status issues:
  - 'Missing from source': 1047

- Per schema:
  - dm_ba_purchase: children=72, dims=52, facts=11, rels=9, validated_true=1, articulation_gt0=1
  - dm_bs_purchase: children=18, dims=11, facts=7, rels=0, validated_true=0, articulation_gt0=0

- Field anomalies:
  - Misspelled hierarchy field present: True

- Top articulated assets:
  - dm_ba_purchase (Schema) – score 100.0, schema=None
  - dm_bs_purchase (Schema) – score 100.0, schema=None
  - dimv_material (Database View) – score 100.0, schema=dm_ba_purchase
  - accounting_currency_code (Column) – score 100.0, schema=None
  - accounting_currency_name_cz (Column) – score 100.0, schema=None
  - accounting_currency_name_en (Column) – score 100.0, schema=None
  - accounting_reporting_currency_group (Column) – score 100.0, schema=None
  - accounting_reporting_sort_order (Column) – score 100.0, schema=None
  - dim_accounting_currency_key (Column) – score 100.0, schema=None
  - cost_center_code (Column) – score 100.0, schema=None

## Recommendations
- Standardize field name to "Hierarchy Relation"; avoid typos in metadata keys.
- Replace "Missing from source" with a clear lifecycle state (e.g., Draft/Planned) and track sync jobs to resolve deltas.
- Raise articulation by adding descriptions and business names to all views; target >0.7 non-zero articulation.
- Expand validation coverage beyond schemas; aim for >60% validationResult=true on key views.
- Populate ownerInSource for non-schema assets (or explicitly mark N/A).
- Establish DQ monitoring cadence per view; avoid Ad hoc. Define dqCheckType taxonomy (completeness, validity, timeliness).