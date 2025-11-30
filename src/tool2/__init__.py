"""Tool 2: Structure Classifier.

Classify filtered metadata into FACT and DIMENSION tables with relationships.

MVP version uses heuristic classification (no LLM required).
Production version can use LLM-based classification with pydantic-ai.

Example:
    >>> from src.tool2 import classify_structure
    >>> result = classify_structure(filtered_metadata, tool0_context)
    >>> print(f"Facts: {result['metrics']['fact_count']}")
"""

from src.tool2.classifier import (
    classify_structure,
    detect_relationships,
    FactTable,
    DimensionTable,
    Relationship,
    StructuralMetrics,
    StructuralClassification,
)

__all__ = [
    "classify_structure",
    "detect_relationships",
    "FactTable",
    "DimensionTable",
    "Relationship",
    "StructuralMetrics",
    "StructuralClassification",
]
