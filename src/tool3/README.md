# Tool 3: Quality Validator

Validate metadata quality with coverage metrics, anomaly detection, and recommendations.

## Quick Start

```python
from src.tool1 import filter_metadata
from src.tool2 import classify_structure
from src.tool3 import validate_quality

# Step 1: Filter metadata (Tool 1)
filtered = filter_metadata("data/analysis/ba_bs_datamarts_summary.json", scope="bs")

# Step 2: Classify structure (Tool 2)
structure = classify_structure(filtered)

# Step 3: Validate quality (Tool 3)
report = validate_quality(structure)

print(f"Risk Level: {report['risk_level']}")
print(f"Quality Score: {report['quality_score']:.1%}")
print(f"Recommendations: {len(report['recommendations'])}")
```

## CLI Usage

```bash
# Basic usage
python -m src.tool3.validator data/tool2/structure.json
```

## API Reference

### `validate_quality(structure, output_dir)`

Validate metadata quality with deterministic metrics.

**Parameters:**
- `structure`: Tool 2 output (`StructuralClassification`)
- `output_dir`: Optional directory to save `quality_report.json`

**Returns:** `QualityReport` with:
- `coverage`: Coverage metrics (description, owner, source, etc.)
- `recommendations`: Prioritized improvement suggestions (P0/P1/P2)
- `anomalies`: Detected quality issues
- `risk_level`: LOW, MEDIUM, HIGH, or CRITICAL
- `quality_score`: Overall score 0.0 to 1.0

### `calculate_coverage(structure)`

Calculate deterministic coverage metrics.

**Returns:** `CoverageMetrics` with coverage percentages.

### `detect_anomalies(structure, coverage)`

Detect data quality anomalies.

**Returns:** List of `AnomalyNote` objects.

### `generate_recommendations(coverage, anomalies, structure)`

Generate prioritized recommendations.

**Returns:** Sorted list of `Recommendation` objects (P0 first).

## Output Format

```json
{
  "coverage": {
    "description_coverage": 0.75,
    "owner_coverage": 0.60,
    "source_coverage": 0.90,
    "validation_coverage": 0.85,
    "articulation_coverage": 0.65,
    "total_entities": 18,
    "timestamp": "2025-11-30T03:30:00"
  },
  "recommendations": [
    {
      "priority": "P1",
      "category": "documentation",
      "message": "Improve description coverage from 75% to 70%+",
      "affected_count": 4
    }
  ],
  "anomalies": [
    {
      "entity": "fact_orphan",
      "anomaly_type": "orphan_entity",
      "severity": "medium",
      "details": "Fact table has no detected relationships"
    }
  ],
  "risk_level": "MEDIUM",
  "quality_score": 0.72,
  "execution_time_seconds": 0.001,
  "mode": "deterministic"
}
```

## Coverage Metrics

| Metric                | Description                      | Weight |
| --------------------- | -------------------------------- | ------ |
| description_coverage  | % entities with descriptions     | 40%    |
| owner_coverage        | % entities with owners/stewards  | 20%    |
| source_coverage       | % entities with source info      | 20%    |
| validation_coverage   | % entities passing validation    | 10%    |
| articulation_coverage | % entities with articulation > 0 | 10%    |

## Risk Levels

| Level    | Criteria                                        |
| -------- | ----------------------------------------------- |
| CRITICAL | <30% avg coverage OR 3+ high-severity anomalies |
| HIGH     | <50% avg coverage OR 1+ high-severity anomaly   |
| MEDIUM   | <70% avg coverage OR 1+ medium anomaly          |
| LOW      | 70%+ avg coverage with no significant anomalies |

## Anomaly Types

| Type               | Description                | Severity |
| ------------------ | -------------------------- | -------- |
| orphan_entity      | Fact with no relationships | medium   |
| missing_owner      | Low owner coverage         | high     |
| low_articulation   | Low articulation coverage  | high     |
| suspicious_pattern | Unclassified table         | low      |
| validation_failed  | Entity failed validation   | medium   |

## Recommendation Priorities

| Priority | Description                  | Action Timeline |
| -------- | ---------------------------- | --------------- |
| P0       | Critical - blocks deployment | Immediate       |
| P1       | High - affects quality SLA   | This sprint     |
| P2       | Medium - nice to have        | Backlog         |

## Pipeline Integration

Tool 3 receives input from Tool 2 and produces final quality report:

```
Tool 0 (Parser) → Tool 1 (Filter) → Tool 2 (Classify) → Tool 3 (Quality) → Report
```

## Testing

```bash
python -m pytest tests/test_tool3.py -v
```
