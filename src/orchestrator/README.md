# MVP Orchestrator

Run the complete MCOP metadata pipeline: Tool 0 → 1 → 2 → 3.

## Quick Start

```python
from src.orchestrator import run_pipeline_sync

# Run pipeline with BS scope
result = run_pipeline_sync(
    metadata_path="data/analysis/ba_bs_datamarts_summary.json",
    scope="bs",
    output_dir="data/pipeline_output",
)

print(f"Status: {result['current_step']}")
print(f"Quality Score: {result['tool3_output']['quality_score']:.1%}")
```

## CLI Usage

```bash
# Basic usage
python -m src.orchestrator.pipeline data/analysis/ba_bs_datamarts_summary.json

# With scope
python -m src.orchestrator.pipeline data/analysis/ba_bs_datamarts_summary.json bs

# With custom output directory
python -m src.orchestrator.pipeline data/analysis/ba_bs_datamarts_summary.json bs data/my_output
```

## Pipeline Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                     MCOP MVP Pipeline                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐│
│   │ Tool 0  │  →   │ Tool 1  │  →   │ Tool 2  │  →   │ Tool 3  ││
│   │ Parser  │      │ Filter  │      │Classify │      │ Quality ││
│   │(optional)│      │         │      │         │      │         ││
│   └─────────┘      └─────────┘      └─────────┘      └─────────┘│
│                                                                  │
│   business.md      filtered.json    structure.json   quality.json│
│       ↓                 ↓                ↓               ↓       │
│   (skip MVP)       by scope        FACT/DIM         risk level   │
│                                   relationships    recommendations│
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## API Reference

### `run_pipeline_sync(...)`

Synchronous pipeline execution.

**Parameters:**
- `metadata_path`: Path to Collibra JSON (required)
- `document_path`: Path to business request MD (optional)
- `tool0_json_path`: Path to pre-parsed Tool 0 JSON (optional)
- `scope`: "bs", "ba", or None for all
- `output_dir`: Directory for outputs
- `skip_tool0`: Skip Tool 0 (default: True for MVP)

**Returns:** `PipelineState` with all tool outputs

### `run_pipeline(...)`

Async version of `run_pipeline_sync`.

### `print_pipeline_summary(state)`

Print human-readable summary of results.

## Output Files

After running, the output directory contains:

```
data/pipeline_output/
├── pipeline_state.json     # Complete state with all outputs
├── tool1/
│   └── filtered_bs.json    # Tool 1 output
├── tool2/
│   └── structure.json      # Tool 2 output
└── tool3/
    └── quality_report.json # Tool 3 output
```

## Pipeline State

The `PipelineState` dictionary contains:

```python
{
    # Configuration
    "document_path": str,
    "metadata_path": str,
    "scope": "bs" | "ba" | None,
    "output_dir": str,

    # Status
    "current_step": "completed" | "failed" | ...,
    "error": str | None,

    # Tool outputs
    "tool0_output": dict | None,  # ParsedRequest
    "tool1_output": dict | None,  # FilteredMetadata
    "tool2_output": dict | None,  # StructuralClassification
    "tool3_output": dict | None,  # QualityReport

    # Timing
    "started_at": str,
    "completed_at": str,
    "total_duration_seconds": float,
    "step_timings": [...]
}
```

## Example Output

```
================================================================================
MCOP PIPELINE RESULTS
================================================================================

📋 Configuration:
   Metadata: data/analysis/ba_bs_datamarts_summary.json
   Scope: bs
   Output: data/pipeline_output

⏱️  Execution:
   Status: completed
   Total time: 0.015s
   - tool1: 0.003s
   - tool2: 0.008s
   - tool3: 0.004s

📊 Tool 1 (Filter):
   Schemas: 1
   Views: 18
   Assets: 19

🏗️  Tool 2 (Structure):
   Facts: 7
   Dimensions: 11
   Relationships: 3

✅ Tool 3 (Quality):
   Risk Level: LOW
   Quality Score: 82.5%
   Recommendations: 2
   Anomalies: 1

   Coverage:
   - Description: 100.0%
   - Owner: 100.0%
   - Source: 100.0%

================================================================================
```

## Testing

```bash
python -m pytest tests/test_orchestrator.py -v
```
