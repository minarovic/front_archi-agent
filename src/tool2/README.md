# Tool 2: Structure Classifier

Classify filtered metadata into FACT and DIMENSION tables with FK relationships.

## Quick Start

```python
from src.tool1 import filter_metadata
from src.tool2 import classify_structure

# Step 1: Filter metadata (Tool 1)
filtered = filter_metadata("data/analysis/ba_bs_datamarts_summary.json", scope="bs")

# Step 2: Classify structure (Tool 2)
structure = classify_structure(filtered)

print(f"Facts: {structure['metrics']['fact_count']}")
print(f"Dimensions: {structure['metrics']['dimension_count']}")
print(f"Relationships: {structure['metrics']['relationship_count']}")
```

## CLI Usage

```bash
# Basic usage
python -m src.tool2.classifier data/tool1/filtered_bs.json

# With Tool 0 context
python -m src.tool2.classifier data/tool1/filtered_bs.json data/tool0_samples/latest.json
```

## API Reference

### `classify_structure(filtered_metadata, tool0_context, output_dir)`

Classify filtered metadata into FACT and DIMENSION tables.

**Parameters:**
- `filtered_metadata`: Output from Tool 1 (`FilteredMetadata`)
- `tool0_context`: Optional parsed business request from Tool 0
- `output_dir`: Optional directory to save `structure.json`

**Returns:** `StructuralClassification` with:
- `facts`: List of fact tables with grain and size
- `dimensions`: List of dimension tables with type and SCD flag
- `relationships`: Detected FK relationships with confidence
- `metrics`: Counts and classification metadata
- `unclassified`: Tables that couldn't be classified

### `detect_relationships(facts, dimensions)`

Detect FK relationships using heuristic matching.

**Returns:** List of `Relationship` objects with confidence scores.

### `classify_single_table(table_name, table_metadata)`

Quick classification of a single table.

**Returns:** `"fact"`, `"dimension"`, or `"unknown"`

## Output Format

```json
{
  "facts": [
    {
      "name": "factv_purchase_order",
      "entity_id": "Purchase Order Header",
      "description": "PO level facts",
      "grain": "transaction",
      "estimated_size": "large",
      "source_schema": "dm_bs_purchase"
    }
  ],
  "dimensions": [
    {
      "name": "dimv_supplier",
      "entity_id": "Supplier Master",
      "description": "Supplier dimension",
      "dim_type": "master",
      "slowly_changing": false,
      "source_schema": "dm_bs_purchase"
    }
  ],
  "relationships": [
    {
      "from_table": "factv_purchase_order",
      "to_table": "dimv_supplier",
      "relationship_type": "one-to-many",
      "confidence": 0.8,
      "detected_by": "fk_suffix_pattern"
    }
  ],
  "metrics": {
    "fact_count": 7,
    "dimension_count": 11,
    "relationship_count": 5,
    "unclassified_count": 0,
    "classification_timestamp": "2025-11-30T03:15:00",
    "classification_method": "heuristic"
  }
}
```

## Classification Heuristics

### Fact Detection
- Prefix: `fact_`, `factv_`, `f_`
- Suffix: `_fact`
- Keywords: order, transaction, event, invoice, payment, receipt, shipment, purchase

### Dimension Detection
- Prefix: `dim_`, `dimv_`, `d_`
- Suffix: `_dim`
- Keywords: master, customer, supplier, product, location, calendar, date, time

### Grain Detection
| Grain       | Keywords                                   |
| ----------- | ------------------------------------------ |
| transaction | order, invoice, payment, receipt, purchase |
| event       | event, log, click, action, activity        |
| snapshot    | snapshot, balance, inventory, stock        |
| aggregate   | agg, summary, total, daily, monthly        |

### Dimension Type Detection
| Type      | Keywords                                      |
| --------- | --------------------------------------------- |
| master    | master, supplier, customer, product, employee |
| reference | reference, ref, lookup                        |
| lookup    | code, status, type, category                  |
| bridge    | bridge, link, xref, cross                     |
| calendar  | calendar, date, time, fiscal, period          |

## Pipeline Integration

Tool 2 receives input from Tool 1 and passes output to Tool 3:

```
Tool 0 (Parser) → Tool 1 (Filter) → Tool 2 (Classify) → Tool 3 (Quality)
```

## Testing

```bash
python -m pytest tests/test_tool2.py -v
```
