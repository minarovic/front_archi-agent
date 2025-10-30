# Tool 0 - Business Request Parser

MVP implementation of a business request parser using LangChain structured output.

## Purpose

Parses standardized Markdown business documents into structured JSON with project metadata, goals, scope, entities, metrics, sources, constraints, and deliverables.

## Usage

### Basic Usage

```python
from src.tool0.parser import parse_business_request

# Sample business document
document = """
# Projekt
Název: Analytics Platform
Sponzor: Jan Novák
Datum: 2025-10-30

## Cíl
Vytvořit analytickou platformu pro reporting.

## Rozsah
In: Customer analytics, sales reporting
Out: HR data, financial forecasting

## Klíčové entity & metriky
- Customers
- Orders
- Revenue (měsíční)

## Očekávané zdroje
- Databricks Unity Catalog
- SAP tables

## Omezení
- GDPR compliance required
- Max response time 3s

## Požadované artefakty
- ER diagram
- Power Query scripts
"""

# Parse document
parsed_json, raw_response, prompt = parse_business_request(document)

print(parsed_json['project_metadata']['project_name'])
# Output: 'Analytics Platform'
```

### With File Logging

```python
from src.tool0.parser import parse_business_request_with_logging

# Parse and save results to data/tool0_samples/
parsed_json, raw_response, prompt = parse_business_request_with_logging(
    document,
    log_to_file=True
)
```

## Output Format

```json
{
  "project_metadata": {
    "project_name": "Analytics Platform",
    "sponsor": "Jan Novák",
    "submitted_at": "2025-10-30",
    "extra": {}
  },
  "goal": "Vytvořit analytickou platformu pro reporting.",
  "scope_in": "Customer analytics, sales reporting",
  "scope_out": "HR data, financial forecasting",
  "entities": ["Customers", "Orders", "Revenue (měsíční)"],
  "metrics": [],
  "sources": ["Databricks Unity Catalog", "SAP tables"],
  "constraints": ["GDPR compliance required", "Max response time 3s"],
  "deliverables": ["ER diagram", "Power Query scripts"]
}
```

## Schema

See `src/tool0/schemas.py` for complete Pydantic model definitions:
- `ProjectMetadata` - Project name, sponsor, submission date
- `BusinessRequest` - Complete request structure

## Requirements

- Python 3.13+
- langchain
- pydantic

Install dependencies:
```bash
pip install langchain pydantic
```

## Validation

The parser includes automatic validation:
- ISO 8601 date format for `submitted_at`
- Default values ("unknown" or empty lists) for missing sections
- Type checking via Pydantic models

## Multi-language Support

The parser supports both Czech and English section headers:
- "Projekt" / "Project"
- "Cíl" / "Goal"
- "Rozsah" / "Scope"
- "Klíčové entity & metriky" / "Key entities & metrics"
- "Očekávané zdroje" / "Expected sources"
- "Omezení" / "Constraints"
- "Požadované artefakty" / "Required artifacts"

## Error Handling

```python
try:
    result = parse_business_request(document)
except ValueError as e:
    print(f"Parsing failed: {e}")
```

Common errors:
- Invalid date format (not ISO 8601)
- Malformed document structure
- Missing required fields in metadata

## Integration with Jupyter Notebook

See `notebooks/tool0_demo.ipynb` for interactive examples.
