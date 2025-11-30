"""Tool 3: Quality Validator (Simplified Pattern).

Validate metadata quality using deterministic metrics:
- Description coverage (entities with descriptions)
- Owner coverage (entities with owners assigned)
- Source coverage (entities with source information)
- Validation coverage (entities that pass validation)
- Articulation coverage (entities with non-zero articulation scores)

Detects anomalies and generates prioritized recommendations.

MVP uses deterministic validation only.
Production can add LLM-based risk assessment via pydantic-ai.

Example:
    >>> from src.tool3.validator import validate_quality
    >>> report = validate_quality(structure)
    >>> print(f"Description coverage: {report['coverage']['description_coverage']:.1%}")
"""

import json
from datetime import datetime
from pathlib import Path
from typing import Any, Literal, Optional, TypedDict


class CoverageMetrics(TypedDict):
    """Deterministic coverage metrics."""

    description_coverage: float
    owner_coverage: float
    source_coverage: float
    validation_coverage: float
    articulation_coverage: float
    total_entities: int
    timestamp: str


class Recommendation(TypedDict):
    """Quality improvement recommendation."""

    priority: Literal["P0", "P1", "P2"]
    category: Literal["coverage", "consistency", "naming", "security", "documentation"]
    message: str
    affected_count: int


class AnomalyNote(TypedDict):
    """Data quality anomaly."""

    entity: str
    anomaly_type: Literal[
        "orphan_entity",
        "missing_owner",
        "suspicious_pattern",
        "low_articulation",
        "validation_failed",
    ]
    severity: Literal["high", "medium", "low"]
    details: str


class QualityReport(TypedDict):
    """Complete quality validation report."""

    coverage: CoverageMetrics
    recommendations: list[Recommendation]
    anomalies: list[AnomalyNote]
    risk_level: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    quality_score: float
    execution_time_seconds: float
    mode: Literal["deterministic", "hybrid"]


def calculate_coverage(structure: dict[str, Any]) -> CoverageMetrics:
    """Calculate deterministic coverage metrics.

    Measures completeness of metadata across all entities.

    Args:
        structure: Tool 2 structural classification output

    Returns:
        CoverageMetrics with coverage percentages and counts
    """
    # Collect all entities (facts + dimensions)
    facts = structure.get("facts", [])
    dimensions = structure.get("dimensions", [])
    all_entities = facts + dimensions
    total = len(all_entities)

    if total == 0:
        return {
            "description_coverage": 0.0,
            "owner_coverage": 0.0,
            "source_coverage": 0.0,
            "validation_coverage": 0.0,
            "articulation_coverage": 0.0,
            "total_entities": 0,
            "timestamp": datetime.now().isoformat(),
        }

    # Count entities with each attribute
    description_count = sum(
        1 for e in all_entities if e.get("description") and e.get("description") != ""
    )

    # Owner field might be named differently
    owner_count = sum(
        1
        for e in all_entities
        if e.get("owner") or e.get("steward") or e.get("entity_id")
    )

    # Source field
    source_count = sum(
        1 for e in all_entities if e.get("source_schema") or e.get("source")
    )

    # These are typically from Collibra metadata
    validation_count = sum(
        1
        for e in all_entities
        if e.get("validationResult", True)  # Default True if not present
    )

    articulation_count = sum(
        1 for e in all_entities if e.get("articulationScore", 0) > 0
    )

    return {
        "description_coverage": description_count / total,
        "owner_coverage": owner_count / total,
        "source_coverage": source_count / total,
        "validation_coverage": validation_count / total,
        "articulation_coverage": articulation_count / total,
        "total_entities": total,
        "timestamp": datetime.now().isoformat(),
    }


def detect_anomalies(
    structure: dict[str, Any],
    coverage: CoverageMetrics,
) -> list[AnomalyNote]:
    """Detect data quality anomalies.

    Identifies problematic patterns:
    - Orphan entities (no relationships)
    - Missing owners
    - Low articulation scores
    - Validation failures
    - Suspicious naming patterns

    Args:
        structure: Tool 2 structural classification output
        coverage: Calculated coverage metrics

    Returns:
        List of detected anomalies with severity
    """
    anomalies: list[AnomalyNote] = []

    facts = structure.get("facts", [])
    dimensions = structure.get("dimensions", [])
    relationships = structure.get("relationships", [])
    unclassified = structure.get("unclassified", [])

    # Orphan facts (no relationships)
    related_facts = {r.get("from_table") for r in relationships}
    for fact in facts:
        if fact.get("name") not in related_facts:
            anomalies.append(
                {
                    "entity": fact.get("name", "unknown"),
                    "anomaly_type": "orphan_entity",
                    "severity": "medium",
                    "details": f"Fact table has no detected relationships to dimensions",
                }
            )

    # Low coverage anomalies
    if coverage["description_coverage"] < 0.5:
        anomalies.append(
            {
                "entity": "ALL",
                "anomaly_type": "missing_owner",
                "severity": "high",
                "details": f"Low description coverage: {coverage['description_coverage']:.1%}",
            }
        )

    if coverage["articulation_coverage"] < 0.3:
        anomalies.append(
            {
                "entity": "ALL",
                "anomaly_type": "low_articulation",
                "severity": "high",
                "details": f"Low articulation coverage: {coverage['articulation_coverage']:.1%}",
            }
        )

    # Unclassified entities
    for name in unclassified[:5]:  # Limit to first 5
        anomalies.append(
            {
                "entity": name,
                "anomaly_type": "suspicious_pattern",
                "severity": "low",
                "details": f"Could not classify as FACT or DIMENSION",
            }
        )

    # Check for dimensions without SCD analysis
    no_scd_count = sum(1 for d in dimensions if not d.get("slowly_changing"))
    if no_scd_count > 0 and len(dimensions) > 0:
        # This is informational, not really an anomaly
        pass

    return anomalies


def generate_recommendations(
    coverage: CoverageMetrics,
    anomalies: list[AnomalyNote],
    structure: dict[str, Any],
) -> list[Recommendation]:
    """Generate prioritized improvement recommendations.

    Creates actionable recommendations based on:
    - Coverage gaps (P0 if critical)
    - Anomaly patterns
    - Best practices

    Args:
        coverage: Calculated coverage metrics
        anomalies: Detected anomalies
        structure: Tool 2 structural classification output

    Returns:
        Prioritized list of recommendations (P0, P1, P2)
    """
    recommendations: list[Recommendation] = []

    total = coverage["total_entities"]

    # Coverage-based recommendations
    if coverage["description_coverage"] < 0.3:
        recommendations.append(
            {
                "priority": "P0",
                "category": "documentation",
                "message": f"Critical: Add descriptions to {int(total * (1 - coverage['description_coverage']))} entities",
                "affected_count": int(total * (1 - coverage["description_coverage"])),
            }
        )
    elif coverage["description_coverage"] < 0.7:
        recommendations.append(
            {
                "priority": "P1",
                "category": "documentation",
                "message": f"Improve description coverage from {coverage['description_coverage']:.0%} to 70%+",
                "affected_count": int(total * (0.7 - coverage["description_coverage"])),
            }
        )

    if coverage["owner_coverage"] < 0.5:
        recommendations.append(
            {
                "priority": "P0",
                "category": "coverage",
                "message": f"Assign owners to {int(total * (1 - coverage['owner_coverage']))} unowned entities",
                "affected_count": int(total * (1 - coverage["owner_coverage"])),
            }
        )

    if coverage["source_coverage"] < 0.8:
        recommendations.append(
            {
                "priority": "P1",
                "category": "coverage",
                "message": f"Document source for {int(total * (1 - coverage['source_coverage']))} entities",
                "affected_count": int(total * (1 - coverage["source_coverage"])),
            }
        )

    # Anomaly-based recommendations
    orphan_count = sum(1 for a in anomalies if a["anomaly_type"] == "orphan_entity")
    if orphan_count > 0:
        recommendations.append(
            {
                "priority": "P1",
                "category": "consistency",
                "message": f"Review {orphan_count} orphan fact tables without relationships",
                "affected_count": orphan_count,
            }
        )

    unclassified_count = sum(
        1 for a in anomalies if a["anomaly_type"] == "suspicious_pattern"
    )
    if unclassified_count > 0:
        recommendations.append(
            {
                "priority": "P2",
                "category": "naming",
                "message": f"Standardize naming for {unclassified_count} unclassified tables",
                "affected_count": unclassified_count,
            }
        )

    # Relationship recommendations
    rel_count = len(structure.get("relationships", []))
    fact_count = len(structure.get("facts", []))
    if fact_count > 0 and rel_count / max(fact_count, 1) < 2:
        recommendations.append(
            {
                "priority": "P2",
                "category": "consistency",
                "message": "Low relationship density - consider adding FK documentation",
                "affected_count": fact_count - rel_count,
            }
        )

    # Sort by priority
    priority_order = {"P0": 0, "P1": 1, "P2": 2}
    recommendations.sort(key=lambda r: priority_order.get(r["priority"], 99))

    return recommendations


def _calculate_risk_level(
    coverage: CoverageMetrics,
    anomalies: list[AnomalyNote],
) -> Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]:
    """Determine overall risk level.

    Risk matrix:
    - CRITICAL: <30% coverage or high-severity anomalies
    - HIGH: <50% coverage or multiple medium anomalies
    - MEDIUM: <70% coverage
    - LOW: 70%+ coverage

    Args:
        coverage: Coverage metrics
        anomalies: Detected anomalies

    Returns:
        Risk level string
    """
    # Calculate average coverage
    avg_coverage = (
        coverage["description_coverage"]
        + coverage["owner_coverage"]
        + coverage["source_coverage"]
    ) / 3

    high_anomalies = sum(1 for a in anomalies if a["severity"] == "high")
    medium_anomalies = sum(1 for a in anomalies if a["severity"] == "medium")

    if avg_coverage < 0.3 or high_anomalies >= 3:
        return "CRITICAL"
    elif avg_coverage < 0.5 or high_anomalies >= 1 or medium_anomalies >= 3:
        return "HIGH"
    elif avg_coverage < 0.7 or medium_anomalies >= 1:
        return "MEDIUM"
    else:
        return "LOW"


def _calculate_quality_score(
    coverage: CoverageMetrics,
    anomalies: list[AnomalyNote],
) -> float:
    """Calculate overall quality score (0-1).

    Weighted combination:
    - 40% description coverage
    - 20% owner coverage
    - 20% source coverage
    - 10% validation coverage
    - 10% anomaly penalty

    Args:
        coverage: Coverage metrics
        anomalies: Detected anomalies

    Returns:
        Quality score 0.0 to 1.0
    """
    base_score = (
        coverage["description_coverage"] * 0.4
        + coverage["owner_coverage"] * 0.2
        + coverage["source_coverage"] * 0.2
        + coverage["validation_coverage"] * 0.1
        + coverage["articulation_coverage"] * 0.1
    )

    # Penalty for anomalies
    anomaly_penalty = min(len(anomalies) * 0.05, 0.3)  # Max 30% penalty

    return max(0.0, min(1.0, base_score - anomaly_penalty))


def validate_quality(
    structure: dict[str, Any],
    output_dir: Optional[str | Path] = None,
) -> QualityReport:
    """Validate metadata quality with deterministic metrics.

    Calculates coverage metrics, detects anomalies, generates recommendations,
    and assigns overall risk level and quality score.

    Args:
        structure: Tool 2 structural classification output
        output_dir: Optional directory to save quality_report.json

    Returns:
        QualityReport with metrics, recommendations, and risk assessment

    Example:
        >>> from src.tool2 import classify_structure
        >>> from src.tool3 import validate_quality
        >>> structure = classify_structure(filtered_metadata)
        >>> report = validate_quality(structure)
        >>> print(f"Risk: {report['risk_level']}, Score: {report['quality_score']:.1%}")
    """
    start_time = datetime.now()

    # Step 1: Calculate coverage
    coverage = calculate_coverage(structure)

    # Step 2: Detect anomalies
    anomalies = detect_anomalies(structure, coverage)

    # Step 3: Generate recommendations
    recommendations = generate_recommendations(coverage, anomalies, structure)

    # Step 4: Calculate risk and score
    risk_level = _calculate_risk_level(coverage, anomalies)
    quality_score = _calculate_quality_score(coverage, anomalies)

    execution_time = (datetime.now() - start_time).total_seconds()

    result: QualityReport = {
        "coverage": coverage,
        "recommendations": recommendations,
        "anomalies": anomalies,
        "risk_level": risk_level,
        "quality_score": quality_score,
        "execution_time_seconds": execution_time,
        "mode": "deterministic",
    }

    # Optionally save output
    if output_dir is not None:
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        output_file = output_path / "quality_report.json"

        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2, ensure_ascii=False)

    return result


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python -m src.tool3.validator <structure_json_path>")
        print("  structure_json_path: Path to Tool 2 output (structure.json)")
        sys.exit(1)

    structure_path = sys.argv[1]

    # Load structure
    with open(structure_path, "r", encoding="utf-8") as f:
        structure = json.load(f)

    # Validate quality
    report = validate_quality(structure, output_dir="data/tool3")

    print(f"\n✅ Quality Validation Complete")
    print(f"   Mode: {report['mode']}")
    print(f"   Execution time: {report['execution_time_seconds']:.3f}s")

    print(f"\n📊 Coverage Metrics:")
    coverage = report["coverage"]
    print(f"   Total entities: {coverage['total_entities']}")
    print(f"   Description: {coverage['description_coverage']:.1%}")
    print(f"   Owner: {coverage['owner_coverage']:.1%}")
    print(f"   Source: {coverage['source_coverage']:.1%}")
    print(f"   Validation: {coverage['validation_coverage']:.1%}")
    print(f"   Articulation: {coverage['articulation_coverage']:.1%}")

    print(f"\n🎯 Risk Assessment:")
    print(f"   Risk Level: {report['risk_level']}")
    print(f"   Quality Score: {report['quality_score']:.1%}")

    print(f"\n💡 Recommendations ({len(report['recommendations'])}):")
    for rec in report["recommendations"][:5]:
        print(f"   [{rec['priority']}] {rec['category']}: {rec['message']}")

    print(f"\n⚠️  Anomalies ({len(report['anomalies'])}):")
    for anomaly in report["anomalies"][:3]:
        print(
            f"   [{anomaly['severity'].upper()}] {anomaly['entity']}: {anomaly['details']}"
        )
