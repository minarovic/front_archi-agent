---
id: MCOP-S1-001
type: story
status: planned
priority: must-have
updated: 2025-11-30
sprint: sprint_1
effort: 3-5 days
depends_on: []
blocks: [MCOP-S1-002, MCOP-S1-003]
---

# Tool 1-3 Refactor: Notebooks → Python Modules

## Brief
Prepiš Tool 1, 2, 3 z Databricks notebookov do standalone Python modulov v `src/` adresári, aby boli volateľné z orchestrátora.

## Acceptance Criteria

### Tool 1 (Ingest & Filter)
- [ ] `src/tool1/__init__.py` existuje
- [ ] `src/tool1/ingest.py` obsahuje `filter_metadata(json_path, scope) -> dict`
- [ ] Funkcia filtruje metadata podľa scope (napr. "bs_purchase")
- [ ] Output ukladá do `data/tool1/filtered_dataset.json`
- [ ] Test `tests/test_tool1.py` prechádza

### Tool 2 (Structure Analyzer)
- [ ] `src/tool2/__init__.py` existuje
- [ ] `src/tool2/classifier.py` obsahuje `classify_structure(filtered_data) -> dict`
- [ ] Identifikuje FACT vs DIMENSION tabuľky
- [ ] Detekuje FK vzťahy
- [ ] Output ukladá do `data/tool2/structure.json`
- [ ] Test `tests/test_tool2.py` prechádza

### Tool 3 (Quality Validator)
- [ ] `src/tool3/__init__.py` existuje
- [ ] `src/tool3/validator.py` obsahuje `validate_quality(structure) -> dict`
- [ ] Extrahuje `articulationScore`, `validationResult`
- [ ] Generuje P0/P1/P2 odporúčania
- [ ] Output ukladá do `data/tool3/quality_report.json`
- [ ] Test `tests/test_tool3.py` prechádza

## Technical Notes

### Štruktúra modulov
```
src/
├── tool0/          # ✅ už existuje
│   ├── __init__.py
│   ├── parser.py
│   └── schemas.py
├── tool1/          # 🆕 NEW
│   ├── __init__.py
│   └── ingest.py
├── tool2/          # 🆕 NEW
│   ├── __init__.py
│   └── classifier.py
└── tool3/          # 🆕 NEW
    ├── __init__.py
    └── validator.py
```

### Referenčné notebooky
- `notebooks/tool1_ingest_databricks.ipynb`
- `notebooks/tool2_structure_databricks.ipynb`
- `notebooks/tool3_quality_databricks.ipynb`

### Vstupné dáta
- Collibra datamart JSON: `data/analysis/ba_bs_datamarts_summary_2025-10-30T23-10-10.json`

### Príklad API
```python
# src/tool1/ingest.py
from typing import Optional

def filter_metadata(
    json_path: str,
    scope: Optional[str] = "bs"
) -> dict:
    """
    Filter Collibra metadata export by scope.

    Args:
        json_path: Path to Collibra JSON export
        scope: Filter scope ("bs", "ba", or None for all)

    Returns:
        Filtered metadata dict with assets matching scope
    """
    # Implementation from notebook
    ...
```

## Testing

### Unit Tests
```bash
# Test all tools
python -m pytest tests/test_tool1.py tests/test_tool2.py tests/test_tool3.py -v

# Individual tests
python -m pytest tests/test_tool1.py::test_filter_bs_scope -v
python -m pytest tests/test_tool2.py::test_classify_fact_dimension -v
python -m pytest tests/test_tool3.py::test_articulation_score_extraction -v
```

### Integration Test
```bash
# Full pipeline test
python -c "
from src.tool1.ingest import filter_metadata
from src.tool2.classifier import classify_structure
from src.tool3.validator import validate_quality

data = filter_metadata('data/analysis/ba_bs_datamarts_summary.json', 'bs')
structure = classify_structure(data)
report = validate_quality(structure)

print(f'Filtered: {len(data[\"assets\"])} assets')
print(f'Facts: {len(structure[\"facts\"])}')
print(f'Quality issues: {len(report[\"issues\"])}')
"
```

## Definition of Done
- [ ] Všetky AC splnené
- [ ] Testy prechádzajú
- [ ] Code review approved
- [ ] Dokumentácia v `src/tool{1,2,3}/README.md`
