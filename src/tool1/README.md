# Tool 1: Metadata Ingest & Filter Module

**Purpose:** Load and filter Collibra metadata export by scope (bs/ba/all).

## Quick Start

```python
from src.tool1.ingest import filter_metadata, load_collibra_export

# Filter for Business Systems (bs) scope
result = filter_metadata("data/analysis/ba_bs_datamarts_summary.json", scope="bs")
print(f"Found {result['stats']['total_assets']} assets")

# Or load full export without filtering
full_data = load_collibra_export("data/analysis/ba_bs_datamarts_summary.json")
```

## API Reference

### `filter_metadata(json_path, scope) -> FilteredMetadata`

Filter Collibra metadata export by scope.

**Parameters:**
- `json_path`: Path to Collibra JSON export
- `scope`: Filter scope - `"bs"` (Business Systems), `"ba"` (Business Analytics), or `None` (all)

**Returns:** `FilteredMetadata` dict with:
- `schemas`: List of schema objects matching scope
- `views`: List of Database View objects matching scope
- `columns`: List of Column objects matching scope
- `stats`: Summary statistics
- `quality`: Quality metrics (articulation, validation)

### `load_collibra_export(json_path) -> dict`

Load raw Collibra JSON export without filtering.

## Output Location

Filtered results are saved to: `data/tool1/filtered_{scope}.json`

## Testing

```bash
# Run tests
python -m pytest tests/test_tool1.py -v

# Quick validation
python -c "from src.tool1.ingest import filter_metadata; print(filter_metadata('data/analysis/ba_bs_datamarts_summary.json', 'bs')['stats'])"
```
