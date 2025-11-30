"""Tool 2: Structural Classifier (Simplified Pattern).

Classify tables into FACT and DIMENSION using heuristics:
- Tables with "fact" prefix or containing transactional keywords → FACT
- Tables with "dim" prefix or containing reference keywords → DIMENSION
- Detect FK relationships using naming conventions (suffix patterns)

MVP uses heuristic classification only.
Production can add LLM-based classification via pydantic-ai.

Example:
    >>> from src.tool2.classifier import classify_structure
    >>> result = classify_structure(filtered_metadata, tool0_context)
    >>> print(f"Found {result['metrics']['fact_count']} facts")
"""

import json
import re
from datetime import datetime
from pathlib import Path
from typing import Any, Literal, Optional, TypedDict


class FactTable(TypedDict):
    """Fact table (transactional/event data)."""

    name: str
    entity_id: str
    description: str
    grain: Literal["transaction", "event", "snapshot", "aggregate"]
    estimated_size: Literal["small", "medium", "large", "huge"]
    source_schema: str


class DimensionTable(TypedDict):
    """Dimension table (reference/master data)."""

    name: str
    entity_id: str
    description: str
    dim_type: Literal["master", "reference", "lookup", "bridge", "calendar"]
    slowly_changing: bool
    source_schema: str


class Relationship(TypedDict):
    """Foreign key relationship between tables."""

    from_table: str
    to_table: str
    relationship_type: Literal["one-to-one", "one-to-many", "many-to-many"]
    confidence: float
    detected_by: str


class StructuralMetrics(TypedDict):
    """Metrics about the structural classification."""

    fact_count: int
    dimension_count: int
    relationship_count: int
    unclassified_count: int
    classification_timestamp: str
    classification_method: str


class StructuralClassification(TypedDict):
    """Complete structural classification result."""

    facts: list[FactTable]
    dimensions: list[DimensionTable]
    relationships: list[Relationship]
    metrics: StructuralMetrics
    unclassified: list[str]


# Heuristic patterns for classification
FACT_PATTERNS = [
    r"^fact[v_]",  # factv_, fact_
    r"^f_",  # f_
    r"_fact$",  # _fact suffix
    r"(order|transaction|event|invoice|payment|receipt|shipment|purchase)",
]

DIMENSION_PATTERNS = [
    r"^dim[v_]",  # dimv_, dim_
    r"^d_",  # d_
    r"_dim$",  # _dim suffix
    r"(master|customer|supplier|product|location|calendar|date|time)",
]

# Grain detection patterns
GRAIN_KEYWORDS = {
    "transaction": ["order", "invoice", "payment", "receipt", "purchase"],
    "event": ["event", "log", "click", "action", "activity"],
    "snapshot": ["snapshot", "balance", "inventory", "stock"],
    "aggregate": ["agg", "summary", "total", "daily", "monthly", "weekly"],
}

# Dimension type keywords - ordered by specificity (more specific first)
DIM_TYPE_KEYWORDS = {
    "bridge": ["bridge", "link", "xref", "cross"],  # Check first - most specific
    "calendar": ["calendar", "date", "time", "fiscal", "period"],
    "lookup": ["code", "status", "type", "category"],
    "reference": ["reference", "ref"],
    "master": [
        "master",
        "supplier",
        "customer",
        "product",
        "employee",
    ],  # Check last - most generic
}


def _matches_pattern(name: str, patterns: list[str]) -> bool:
    """Check if name matches any of the patterns."""
    name_lower = name.lower()
    for pattern in patterns:
        if re.search(pattern, name_lower):
            return True
    return False


def _detect_grain(
    name: str,
) -> Literal["transaction", "event", "snapshot", "aggregate"]:
    """Detect grain type from table name."""
    name_lower = name.lower()
    for grain, keywords in GRAIN_KEYWORDS.items():
        for keyword in keywords:
            if keyword in name_lower:
                return grain  # type: ignore
    return "transaction"  # Default


def _detect_dim_type(
    name: str,
) -> Literal["master", "reference", "lookup", "bridge", "calendar"]:
    """Detect dimension type from table name."""
    name_lower = name.lower()
    for dim_type, keywords in DIM_TYPE_KEYWORDS.items():
        for keyword in keywords:
            if keyword in name_lower:
                return dim_type  # type: ignore
    return "reference"  # Default


def _estimate_size(
    views: int, total_children: int
) -> Literal["small", "medium", "large", "huge"]:
    """Estimate table size category based on metadata."""
    if total_children < 20:
        return "small"
    elif total_children < 100:
        return "medium"
    elif total_children < 500:
        return "large"
    else:
        return "huge"


def _is_slowly_changing(name: str, schema_data: dict[str, Any]) -> bool:
    """Detect if dimension might be SCD Type 2."""
    name_lower = name.lower()
    # Look for typical SCD2 indicators
    scd2_indicators = [
        "valid_from",
        "valid_to",
        "effective",
        "expiry",
        "version",
        "history",
    ]
    return any(ind in name_lower for ind in scd2_indicators)


def _extract_entities_from_tool0(tool0_context: dict[str, Any]) -> dict[str, str]:
    """Extract entity name -> table mappings from Tool 0 context."""
    mappings: dict[str, str] = {}
    entities = tool0_context.get("entities", [])
    for entity in entities:
        name = entity.get("name", "")
        table = entity.get("table", "")
        if name and table:
            mappings[table.lower()] = name
    return mappings


def classify_structure(
    filtered_metadata: dict[str, Any],
    tool0_context: Optional[dict[str, Any]] = None,
    output_dir: Optional[str | Path] = None,
) -> StructuralClassification:
    """Classify filtered metadata into FACT and DIMENSION tables.

    Uses heuristic-based classification:
    - Naming patterns (fact_, dim_, etc.)
    - Keyword detection in table names
    - Schema metadata (views, children counts)

    Args:
        filtered_metadata: Output from Tool 1 (FilteredMetadata)
        tool0_context: Optional parsed business request from Tool 0
        output_dir: Optional directory to save structure.json

    Returns:
        StructuralClassification with facts, dimensions, relationships, metrics

    Example:
        >>> from src.tool1 import filter_metadata
        >>> filtered = filter_metadata("data/analysis/ba_bs_datamarts.json", scope="bs")
        >>> structure = classify_structure(filtered)
        >>> print(structure["metrics"]["fact_count"])
    """
    facts: list[FactTable] = []
    dimensions: list[DimensionTable] = []
    unclassified: list[str] = []

    # Extract entity mappings from Tool 0 if available
    entity_map = _extract_entities_from_tool0(tool0_context or {})

    # Process schemas from filtered metadata
    schemas = filtered_metadata.get("schemas", [])

    for schema in schemas:
        schema_name = schema.get("name", "")
        schema_views = schema.get("views", 0)
        schema_facts = schema.get("facts", 0)
        schema_dims = schema.get("dimensions", 0)
        total_children = schema.get("total_children", 0)

        # Classify based on Collibra metadata (if available)
        # Collibra already identifies facts vs dimensions
        if schema_facts > 0:
            for i in range(schema_facts):
                fact_name = f"{schema_name}_fact_{i+1}"
                facts.append(
                    {
                        "name": fact_name,
                        "entity_id": entity_map.get(
                            fact_name.lower(), f"entity_{len(facts)+1}"
                        ),
                        "description": f"Fact table from {schema_name}",
                        "grain": _detect_grain(schema_name),
                        "estimated_size": _estimate_size(schema_views, total_children),
                        "source_schema": schema_name,
                    }
                )

        if schema_dims > 0:
            for i in range(schema_dims):
                dim_name = f"{schema_name}_dim_{i+1}"
                dimensions.append(
                    {
                        "name": dim_name,
                        "entity_id": entity_map.get(
                            dim_name.lower(), f"entity_{len(dimensions)+1}"
                        ),
                        "description": f"Dimension table from {schema_name}",
                        "dim_type": _detect_dim_type(schema_name),
                        "slowly_changing": _is_slowly_changing(dim_name, schema),
                        "source_schema": schema_name,
                    }
                )

    # Also process top_articulated assets if available
    top_assets = filtered_metadata.get("top_articulated", [])
    for asset in top_assets:
        asset_name = asset.get("displayName", "")
        asset_type = asset.get("typeName", "")

        # Skip if already processed or not a view/table
        if asset_type not in ("View", "Table", "Schema"):
            continue

        # Skip schema-level assets (already processed above)
        if asset_type == "Schema":
            continue

        # Classify view based on naming pattern
        if _matches_pattern(asset_name, FACT_PATTERNS):
            facts.append(
                {
                    "name": asset_name,
                    "entity_id": entity_map.get(
                        asset_name.lower(), f"asset_{asset.get('id', '')}"
                    ),
                    "description": f"Fact from {asset.get('schema', 'unknown')}",
                    "grain": _detect_grain(asset_name),
                    "estimated_size": "medium",  # Default when no size info
                    "source_schema": asset.get("schema", "unknown"),
                }
            )
        elif _matches_pattern(asset_name, DIMENSION_PATTERNS):
            dimensions.append(
                {
                    "name": asset_name,
                    "entity_id": entity_map.get(
                        asset_name.lower(), f"asset_{asset.get('id', '')}"
                    ),
                    "description": f"Dimension from {asset.get('schema', 'unknown')}",
                    "dim_type": _detect_dim_type(asset_name),
                    "slowly_changing": False,
                    "source_schema": asset.get("schema", "unknown"),
                }
            )
        else:
            unclassified.append(asset_name)

    # Detect relationships
    relationships = detect_relationships(facts, dimensions)

    # Build metrics
    metrics: StructuralMetrics = {
        "fact_count": len(facts),
        "dimension_count": len(dimensions),
        "relationship_count": len(relationships),
        "unclassified_count": len(unclassified),
        "classification_timestamp": datetime.now().isoformat(),
        "classification_method": "heuristic",
    }

    result: StructuralClassification = {
        "facts": facts,
        "dimensions": dimensions,
        "relationships": relationships,
        "metrics": metrics,
        "unclassified": unclassified,
    }

    # Optionally save output
    if output_dir is not None:
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        output_file = output_path / "structure.json"

        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2, ensure_ascii=False)

    return result


def detect_relationships(
    facts: list[FactTable],
    dimensions: list[DimensionTable],
) -> list[Relationship]:
    """Detect FK relationships between facts and dimensions.

    Uses heuristic matching:
    - Column suffix patterns: product_id → products dimension
    - Name similarity: fact contains dimension name

    Args:
        facts: List of classified fact tables
        dimensions: List of classified dimension tables

    Returns:
        List of detected relationships with confidence scores
    """
    relationships: list[Relationship] = []

    # Build lookup of dimension names (singularized)
    dim_lookup: dict[str, DimensionTable] = {}
    for dim in dimensions:
        # Store original name
        dim_lookup[dim["name"].lower()] = dim
        # Also store singular form (remove trailing 's')
        singular = dim["name"].lower().rstrip("s")
        dim_lookup[singular] = dim

    # Match facts to dimensions
    for fact in facts:
        fact_name_lower = fact["name"].lower()

        for dim_key, dim in dim_lookup.items():
            # Skip if same table
            if dim_key == fact_name_lower:
                continue

            # Check if dimension key appears in fact name
            if dim_key in fact_name_lower or dim["name"].lower() in fact_name_lower:
                relationships.append(
                    {
                        "from_table": fact["name"],
                        "to_table": dim["name"],
                        "relationship_type": "one-to-many",
                        "confidence": 0.7,
                        "detected_by": "name_matching",
                    }
                )

            # Check for FK suffix pattern
            # e.g., fact contains "supplier" and dim is "dim_supplier"
            dim_core = dim["name"].lower().replace("dim_", "").replace("dimv_", "")
            if dim_core in fact_name_lower:
                # Avoid duplicates
                existing = [
                    r
                    for r in relationships
                    if r["from_table"] == fact["name"] and r["to_table"] == dim["name"]
                ]
                if not existing:
                    relationships.append(
                        {
                            "from_table": fact["name"],
                            "to_table": dim["name"],
                            "relationship_type": "one-to-many",
                            "confidence": 0.8,
                            "detected_by": "fk_suffix_pattern",
                        }
                    )

    return relationships


def classify_single_table(
    table_name: str,
    table_metadata: Optional[dict[str, Any]] = None,
) -> Literal["fact", "dimension", "unknown"]:
    """Classify a single table as fact, dimension, or unknown.

    Useful for quick classification without full pipeline.

    Args:
        table_name: Name of the table to classify
        table_metadata: Optional metadata about the table

    Returns:
        Classification: "fact", "dimension", or "unknown"
    """
    if _matches_pattern(table_name, FACT_PATTERNS):
        return "fact"
    elif _matches_pattern(table_name, DIMENSION_PATTERNS):
        return "dimension"
    else:
        return "unknown"


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print(
            "Usage: python -m src.tool2.classifier <filtered_json_path> [tool0_json_path]"
        )
        print("  filtered_json_path: Path to Tool 1 output (filtered metadata)")
        print("  tool0_json_path: Optional path to Tool 0 output (business context)")
        sys.exit(1)

    filtered_path = sys.argv[1]
    tool0_path = sys.argv[2] if len(sys.argv) > 2 else None

    # Load filtered metadata
    with open(filtered_path, "r", encoding="utf-8") as f:
        filtered_data = json.load(f)

    # Load tool0 context if provided
    tool0_context = None
    if tool0_path:
        with open(tool0_path, "r", encoding="utf-8") as f:
            tool0_context = json.load(f)

    # Classify structure
    result = classify_structure(
        filtered_data,
        tool0_context=tool0_context,
        output_dir="data/tool2",
    )

    print(f"\n✅ Structural Classification Complete")
    print(f"   Facts: {result['metrics']['fact_count']}")
    print(f"   Dimensions: {result['metrics']['dimension_count']}")
    print(f"   Relationships: {result['metrics']['relationship_count']}")
    print(f"   Unclassified: {result['metrics']['unclassified_count']}")
    print(f"   Method: {result['metrics']['classification_method']}")

    if result["facts"]:
        print(f"\n📊 Sample Facts:")
        for fact in result["facts"][:3]:
            print(
                f"   - {fact['name']} (grain: {fact['grain']}, size: {fact['estimated_size']})"
            )

    if result["dimensions"]:
        print(f"\n🗂️  Sample Dimensions:")
        for dim in result["dimensions"][:3]:
            print(
                f"   - {dim['name']} (type: {dim['dim_type']}, SCD2: {dim['slowly_changing']})"
            )

    if result["relationships"]:
        print(f"\n🔗 Sample Relationships:")
        for rel in result["relationships"][:3]:
            print(
                f"   - {rel['from_table']} → {rel['to_table']} ({rel['confidence']:.0%})"
            )
