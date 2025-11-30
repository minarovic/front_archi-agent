"""Tool 3: Quality Validator.

Validate metadata quality with coverage metrics and optional LLM enhancement.

MVP version uses deterministic validation only (no LLM required).
Production version can add LLM-based risk assessment via pydantic-ai.

Example:
    >>> from src.tool3 import validate_quality
    >>> report = validate_quality(structure)
    >>> print(f"Description coverage: {report['coverage']['description_coverage']:.1%}")
"""

from src.tool3.validator import (
    validate_quality,
    calculate_coverage,
    detect_anomalies,
    generate_recommendations,
    CoverageMetrics,
    Recommendation,
    AnomalyNote,
    QualityReport,
)

__all__ = [
    "validate_quality",
    "calculate_coverage",
    "detect_anomalies",
    "generate_recommendations",
    "CoverageMetrics",
    "Recommendation",
    "AnomalyNote",
    "QualityReport",
]
