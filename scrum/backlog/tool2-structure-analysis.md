---
id: MCOP-TOOL2-STRUCTURE
type: story
status: planned
priority: must-have
updated: 2025-11-01
skill_implementation: null
skill_status: "needs_design"
skill_time_saved: null
skill_created: false
---
# Tool 2 – Strukturální analýza

## Brief
- Navrhnout LangGraph uzel/agent, který z filtrovaného výstupu Tool 1 odvodí fakta, dimenze, hierarchie a vztahy.
- Kombinovat deterministické heuristiky (FK/join patterny) s LLM analýzou pro klasifikaci entit a popis grainu.
- Standardizovat výstup do `structure.json` + shrnutí metrik, které se stanou podkladem pro Tool 3 a Tool 7.
- Poskytnout auditovatelné artefakty v `scrum/artifacts/` s popisem kroků/konfidenčních skóre.

## Acceptance Criteria
- [ ] Story frontmatter aktualizováno při každém posunu stavu (`status`, `updated`, `skill_*` pole).
- [ ] Notebook/skill načítá `data/tool1/filtered_dataset.json` a doplňková metadata (`docs_langgraph/BA-BS_Datamarts_metadata.json`).
- [ ] Uzly LangGraphu pokrývají minimálně: `load_context`, `classify_entities` (LLM), `identify_relationships` (deterministicky + LLM), `assemble_structure`, `save_outputs`.
- [ ] Pydantic model `StructuralAnalysis` (a dílčí modely) splňuje povinné Field popisy a projde compliance checkerem.
- [ ] Výstupní `structure.json` obsahuje sekce `facts`, `dimensions`, `hierarchies`, `relationships`, `metrics` (coverage %, unresolved entities).
- [ ] Edge cases ošetřeny:
  - Žádné FK matches (fallback: `"unknown"`)
  - Empty candidates list (raise validation error)
  - Missing `Hierarcy Relation` field (skip hierarchy detection)
  - CZ/EN terminology mismatch (use alias dictionary)
- [ ] Artefakt `scrum/artifacts/YYYY-MM-DD_tool2-structure-summary.json` shrnuje klíčové statistiky (např. počty tabulek, průměrná jistota).
- [ ] Dokumentace popisuje workflow, vstupy, výstupy a omezení (Markdown buď v notebooku, nebo samostatný README).

## Definition of Done

**General DoD:**
- [ ] Code reviewed and approved.
- [ ] Tests written and passing (minimálně smoketest pro pilotní dataset).
- [ ] Documentation updated (workflow + usage sekce).

**Skill DoD (When `skill_created: true`):**
- [ ] Skill implementace existuje na `src/tool2/structure_analyzer.py` (nebo referencovaném notebooku v MVP).
- [ ] `SKILL.md` s frontmatterem (name, description, version, owner, dependencies, trigger_files).
- [ ] Skill úspěšně vykonán (lokálně nebo CI) a log uložen do `scrum/artifacts/YYYY-MM-DD_tool2-structure-summary.json`.
- [ ] `structure.json` uložen v `data/tool2/` a validován proti schématu.
- [ ] README s návodem na spuštění (v adresáři skillu nebo notebooku).

## Notes
- **Vstupy**
  - **Tool 1 output:** `data/tool1/filtered_dataset.json` - entity mappings (entity → candidate_id, confidence, rationale)
  - **Full metadata:** `docs_langgraph/BA-BS_Datamarts_metadata.json` - complete schemas, tables, columns, relationships
  - **Business context:** Tool 0 output (scope_in/out, entities) - for filtering irrelevant structures
  - **❗ CRITICAL:** Tool 1 provides entity-to-candidate mappings, NOT detailed schemas. Tool 2 must load full metadata separately.
- **LangGraph návrh**
  1. `load_context` – rozšíří stav o kandidátské tabulky/sloupce, připraví slovník aliasů CZ/EN.
  2. `classify_entities` – LLM + `ToolStrategy(StructuralClassification)` → přiřadí entity k faktům/dimenzím, odhadne grain a business keys.
  3. `identify_relationships` – heuristiky (název sloupce, `_id`, `fk`, `Hierarchy Relation`) + LLM validace (`RelationshipBundle` schema) → poskytne FK návrhy, hierarchické vazby.
  4. `assemble_structure` – konsoliduje výsledek do `StructuralAnalysis`, dopočítá coverage, unresolved a rizika.
  5. `save_outputs` – uloží `data/tool2/structure.json`, připraví auditní JSON (`avg_confidence`, počty faktů/dimenzí, seznam gapů).
- **Pydantic modely**
  - `FactTable`, `DimensionTable`, `Hierarchy`, `Relationship`, `StructuralMetric`, `StructuralAnalysis`.
  - Každé pole s popisem (`Field(description=...)`), validace na ISO8601 timestampy (`field_validator`).
- **LLM / Heuristiky**
  - **LLM:** `openai:gpt-5-mini` (consistent with Tool 1) with explicit `ToolStrategy(StructuralClassification)`.
  - **Heuristiky (konkrétní):**
    1. **Fact table detection:**
       - Prefix: `factv_*`, `fact_*`
       - Contains: date columns + numeric measures
       - Example: `factv_purchase_order_item`
    2. **Dimension table detection:**
       - Prefix: `dimv_*`, `dim_*`
       - Contains: business keys + attributes
       - Example: `dimv_supplier`
    3. **Foreign key detection:**
       - Suffix: `*_id`, `*_fk`, `*_key`
       - Column name matching dim table name
       - Example: `supplier_id` → `dimv_supplier`
    4. **Hierarchy detection:**
       - Field: `Hierarcy Relation` (note: typo in actual metadata!)
       - Pattern: parent-child relationships in descriptions
       - Example: `dimv_material_group` (parent) → `dimv_material` (child)
  - **Context injection:** scope_out/scope_in via system_prompt (similar to Tool 1 pattern).
- **Artefakty**
  - `data/tool2/structure.json` – hlavní strukturovaný výstup.
    **Příklad struktury:**
    ```json
    {
      "timestamp": "2025-11-01T...",
      "business_context": {
        "entities": ["Suppliers", "Purchase Orders"],
        "scope_out": "HR data, Real-time monitoring"
      },
      "facts": [
        {
          "table_id": "factv_purchase_order_item",
          "table_name": "Systems>dap_gold_prod>dm_bs_purchase>factv_purchase_order_item",
          "grain": "Purchase order item level",
          "measures": ["order_quantity", "order_value"],
          "date_columns": ["order_date", "delivery_date"],
          "confidence": 0.95,
          "rationale": "Contains date + numeric columns, prefix 'factv_'"
        }
      ],
      "dimensions": [
        {
          "table_id": "dimv_supplier",
          "table_name": "Systems>dap_gold_prod>dm_bs_purchase>dimv_supplier",
          "business_key": "supplier_id",
          "attributes": ["supplier_name", "supplier_country"],
          "confidence": 0.92,
          "rationale": "Prefix 'dimv_', contains business key + descriptive attributes"
        }
      ],
      "hierarchies": [
        {
          "parent_table": "dimv_material_group",
          "child_table": "dimv_material",
          "relationship_type": "1:N",
          "confidence": 0.88,
          "rationale": "Hierarcy Relation field present, parent-child pattern in descriptions"
        }
      ],
      "relationships": [
        {
          "from_table": "factv_purchase_order_item",
          "to_table": "dimv_supplier",
          "join_column": "supplier_id",
          "relationship_type": "FK",
          "confidence": 0.90,
          "rationale": "Column name matches dimension table, suffix '_id'"
        }
      ],
      "metrics": {
        "total_facts": 5,
        "total_dimensions": 12,
        "total_hierarchies": 3,
        "total_relationships": 18,
        "coverage": 0.87,
        "unresolved_entities": ["Delivery Performance"]
      }
    }
    ```
  - `scrum/artifacts/YYYY-MM-DD_tool2-structure-summary.json` – shrnutí metrik.
  - Volitelně `scrum/artifacts/YYYY-MM-DD_tool2-step-log.json` pro audit debug.
- **Testovací scénáře**
  - Regresní dataset v `data/tool2_samples/` (variace entit, prázdné dimenze).
  - Unit test pro heuristiky (např. mapping join columns).
  - Kontrola, že v případě chybějícího match se vrací `"unknown"` default.
- **Rizika**
  - Nedostatečná granularita metadat → fallback na `unknown`/manual review flag.
  - CZ/EN mismatch → slovník aliasů + LLM nápověda.
  - Odlady schema → přidat verzování `StructuralAnalysis` (verze 1.0.0) pro budoucí kompatibilitu.
- **Návaznost (Tool Chain)**
  - **Vstup:** Tool 1 mappings (`data/tool1/filtered_dataset.json`)
  - **Výstup:** Tool 3 čte `data/tool2/structure.json` a validuje kvalitu metadat
  - **Kontext:** Tool 7 používá `structure.json` pro governance report
  - **Orchestrace:** Tool 2 běží paralelně s Tool 3 (Node 2 v MVP workflow podle `mcop-mvp-v1-scope.md`)
  - **Model:** `openai:gpt-5-mini` (consistent with Tool 1 for cost/performance baseline)
