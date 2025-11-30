---
id: MCOP-S1-002
type: story
status: planned
priority: must-have
updated: 2025-11-30
sprint: sprint_1
effort: 2-3 days
depends_on: [MCOP-S1-001]
blocks: [MCOP-S1-005]
---

# MVP Orchestrator: Tool 0→1→2→3 Pipeline

## Brief
Vytvor orchestrátor, ktorý sekvenčne spúšťa Tool 0→1→2→3 a produkuje kompletný výstup (structure.json, quality_report.json) z jedného business požiadavku.

## Acceptance Criteria

- [ ] `src/orchestrator/__init__.py` existuje
- [ ] `src/orchestrator/pipeline.py` obsahuje `run_pipeline(business_request: str) -> PipelineState`
- [ ] Pipeline sekvenčne volá Tool 0 → Tool 1 → Tool 2 → Tool 3
- [ ] Pri chybe v ktoromkoľvek kroku sa pipeline zastaví a vráti error state
- [ ] Výstupy sa ukladajú do `data/output/`
- [ ] Test `tests/test_orchestrator.py` prechádza
- [ ] CLI wrapper `src/orchestrator/run.py` funguje

## Technical Notes

### Architektúra
```python
# src/orchestrator/pipeline.py
from dataclasses import dataclass, field
from typing import Optional
import json

from src.tool0.parser import parse_business_request
from src.tool1.ingest import filter_metadata
from src.tool2.classifier import classify_structure
from src.tool3.validator import validate_quality

@dataclass
class PipelineState:
    """State passed between pipeline stages."""
    business_request: str
    tool0_output: Optional[dict] = None
    tool1_output: Optional[dict] = None
    tool2_output: Optional[dict] = None
    tool3_output: Optional[dict] = None
    errors: list[str] = field(default_factory=list)

    @property
    def is_success(self) -> bool:
        return len(self.errors) == 0 and self.tool3_output is not None

def run_pipeline(
    business_request: str,
    metadata_path: str = "data/analysis/ba_bs_datamarts_summary.json"
) -> PipelineState:
    """
    Run full MCOP pipeline: Tool 0 → 1 → 2 → 3.

    Args:
        business_request: Raw business request text/markdown
        metadata_path: Path to Collibra metadata JSON

    Returns:
        PipelineState with all tool outputs or errors
    """
    state = PipelineState(business_request=business_request)

    # Tool 0: Parse business request
    try:
        state.tool0_output, _, _ = parse_business_request(business_request)
    except Exception as e:
        state.errors.append(f"Tool 0 failed: {e}")
        return state

    # Tool 1: Filter metadata by scope
    try:
        scope = state.tool0_output.get("scope_in", ["bs"])[0]
        state.tool1_output = filter_metadata(metadata_path, scope)
    except Exception as e:
        state.errors.append(f"Tool 1 failed: {e}")
        return state

    # Tool 2: Classify structure
    try:
        state.tool2_output = classify_structure(state.tool1_output)
    except Exception as e:
        state.errors.append(f"Tool 2 failed: {e}")
        return state

    # Tool 3: Validate quality
    try:
        state.tool3_output = validate_quality(state.tool2_output)
    except Exception as e:
        state.errors.append(f"Tool 3 failed: {e}")
        return state

    return state
```

### CLI Wrapper
```python
# src/orchestrator/run.py
import argparse
import json
from pathlib import Path
from .pipeline import run_pipeline

def main():
    parser = argparse.ArgumentParser(description="Run MCOP Pipeline")
    parser.add_argument("--request", "-r", required=True, help="Path to business request file")
    parser.add_argument("--output", "-o", default="data/output", help="Output directory")
    args = parser.parse_args()

    # Load business request
    request_text = Path(args.request).read_text()

    # Run pipeline
    result = run_pipeline(request_text)

    # Save outputs
    output_dir = Path(args.output)
    output_dir.mkdir(exist_ok=True)

    if result.is_success:
        (output_dir / "structure.json").write_text(
            json.dumps(result.tool2_output, indent=2)
        )
        (output_dir / "quality_report.json").write_text(
            json.dumps(result.tool3_output, indent=2)
        )
        print(f"✅ Pipeline completed. Outputs in {output_dir}")
    else:
        print(f"❌ Pipeline failed: {result.errors}")
        exit(1)

if __name__ == "__main__":
    main()
```

### Štruktúra súborov
```
src/orchestrator/
├── __init__.py
├── pipeline.py      # PipelineState + run_pipeline()
└── run.py           # CLI wrapper
```

## Testing

### Unit Tests
```python
# tests/test_orchestrator.py
import pytest
from src.orchestrator.pipeline import run_pipeline, PipelineState

def test_pipeline_happy_path():
    """Test successful pipeline execution."""
    request = """
    # Business Request
    Goal: Analyze BS purchase data
    Scope: dm_bs_purchase
    """

    result = run_pipeline(request)

    assert result.is_success
    assert result.tool0_output is not None
    assert result.tool1_output is not None
    assert result.tool2_output is not None
    assert result.tool3_output is not None
    assert len(result.errors) == 0

def test_pipeline_invalid_request():
    """Test pipeline with invalid business request."""
    result = run_pipeline("")

    assert not result.is_success
    assert len(result.errors) > 0
    assert "Tool 0" in result.errors[0]

def test_pipeline_state_dataclass():
    """Test PipelineState properties."""
    state = PipelineState(business_request="test")

    assert not state.is_success
    assert state.errors == []
```

### CLI Test
```bash
# Create test request
cat > /tmp/test_request.md << 'EOF'
# Business Request
## Goal
Analyze supplier data quality

## Scope
BS purchase domain (dm_bs_purchase)

## Entities
- suppliers
- purchase orders
EOF

# Run pipeline
python -m src.orchestrator.run --request /tmp/test_request.md --output /tmp/output

# Verify outputs
ls -la /tmp/output/
cat /tmp/output/structure.json | jq '.facts | length'
cat /tmp/output/quality_report.json | jq '.issues | length'
```

## Definition of Done
- [ ] Všetky AC splnené
- [ ] Unit testy prechádzajú
- [ ] CLI wrapper funguje
- [ ] Code review approved
- [ ] Dokumentácia v `src/orchestrator/README.md`
