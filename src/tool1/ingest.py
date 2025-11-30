"""Tool 1: Metadata Ingest & Filter.

Load Collibra metadata exports and filter by scope (bs/ba/all).
Extracts schemas, views, columns with quality metrics.

Example:
    >>> from src.tool1.ingest import filter_metadata
    >>> result = filter_metadata("data/analysis/ba_bs_datamarts_summary.json", scope="bs")
    >>> print(result["stats"]["total_assets"])
    18
"""

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Any, Literal, Optional, TypedDict


class AssetInfo(TypedDict):
    """Individual asset from Collibra export."""

    displayName: str
    id: str
    typeName: str
    schema: Optional[str]
    articulationScore: float
    validationResult: bool


class QualityMetrics(TypedDict):
    """Quality metrics for filtered assets."""

    articulation_mean: float
    articulation_median: float
    articulation_min: float
    articulation_max: float
    validation_rate: float
    nonzero_articulation_share: float


class SchemaBreakdown(TypedDict):
    """Breakdown for a single schema."""

    name: str
    total_children: int
    views: int
    dimensions: int
    facts: int
    relations: int
    validated_true: int
    articulation_gt0: int


class FilterStats(TypedDict):
    """Statistics about filtered data."""

    total_assets: int
    schemas_count: int
    views_count: int
    columns_count: int
    scope: Optional[str]
    source_file: str
    filtered_at: str


class FilteredMetadata(TypedDict):
    """Complete filtered metadata result."""

    schemas: list[SchemaBreakdown]
    views: list[str]
    columns: list[str]
    top_articulated: list[AssetInfo]
    stats: FilterStats
    quality: QualityMetrics
    raw_totals: dict[str, Any]


def load_collibra_export(json_path: str | Path) -> dict[str, Any]:
    """Load raw Collibra JSON export.

    Args:
        json_path: Path to Collibra JSON export file

    Returns:
        Raw JSON data as dictionary

    Raises:
        FileNotFoundError: If JSON file doesn't exist
        json.JSONDecodeError: If file is not valid JSON
    """
    path = Path(json_path)
    if not path.exists():
        raise FileNotFoundError(f"Collibra export not found: {json_path}")

    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def filter_metadata(
    json_path: str | Path,
    scope: Optional[Literal["bs", "ba"]] = None,
    output_dir: Optional[str | Path] = None,
) -> FilteredMetadata:
    """Filter Collibra metadata export by scope.

    Loads a Collibra JSON export and filters assets based on schema scope:
    - "bs": Only dm_bs_* schemas (Business Systems)
    - "ba": Only dm_ba_* schemas (Business Analytics)
    - None: All schemas

    Args:
        json_path: Path to Collibra JSON export
        scope: Filter scope ("bs", "ba", or None for all)
        output_dir: Optional directory to save filtered output

    Returns:
        FilteredMetadata with schemas, views, columns, stats, and quality metrics

    Raises:
        FileNotFoundError: If JSON file doesn't exist
        ValueError: If scope is not valid

    Example:
        >>> result = filter_metadata("data/analysis/ba_bs_datamarts.json", scope="bs")
        >>> print(f"Found {result['stats']['views_count']} views")
        Found 18 views
    """
    if scope is not None and scope not in ("bs", "ba"):
        raise ValueError(f"Invalid scope: {scope}. Must be 'bs', 'ba', or None")

    # Load raw data
    data = load_collibra_export(json_path)

    # Extract schemas breakdown
    schemas_breakdown = data.get("schemas_breakdown", {})

    # Filter schemas by scope
    filtered_schemas: list[SchemaBreakdown] = []
    for schema_name, schema_data in schemas_breakdown.items():
        # Check scope filter
        if scope is not None:
            prefix = f"dm_{scope}_"
            if not schema_name.startswith(prefix):
                continue

        filtered_schemas.append(
            {
                "name": schema_name,
                "total_children": schema_data.get("total_children", 0),
                "views": schema_data.get("views", 0),
                "dimensions": schema_data.get("dimensions", 0),
                "facts": schema_data.get("facts", 0),
                "relations": schema_data.get("relations", 0),
                "validated_true": schema_data.get("validated_true", 0),
                "articulation_gt0": schema_data.get("articulation_gt0", 0),
            }
        )

    # Extract view names from schemas
    views: list[str] = []
    for schema in filtered_schemas:
        # Generate view names based on schema pattern
        # In real Collibra data, these would be actual view names
        schema_name = schema["name"]
        views.append(schema_name)  # Schema itself is a top-level view

    # Extract top articulated assets for this scope
    top_articulated = data.get("top_articulated_assets", [])
    filtered_top: list[AssetInfo] = []
    for asset in top_articulated:
        asset_schema = asset.get("schema")
        # Include if no schema filter, or if schema matches scope
        if scope is None:
            filtered_top.append(asset)
        elif asset_schema is not None:
            if asset_schema.startswith(f"dm_{scope}_"):
                filtered_top.append(asset)
        elif asset.get("displayName", "").startswith(f"dm_{scope}_"):
            # Schema-level assets
            filtered_top.append(asset)

    # Extract column names (from top articulated that are Column type)
    columns: list[str] = [
        asset["displayName"]
        for asset in filtered_top
        if asset.get("typeName") == "Column"
    ]

    # Calculate totals
    total_views = sum(s["views"] for s in filtered_schemas)
    total_columns = sum(s["total_children"] for s in filtered_schemas) - total_views

    # Extract quality metrics
    articulation = data.get("articulation", {})
    validation = data.get("validation", {})

    quality: QualityMetrics = {
        "articulation_mean": articulation.get("mean", 0.0),
        "articulation_median": articulation.get("median", 0.0),
        "articulation_min": articulation.get("min", 0.0),
        "articulation_max": articulation.get("max", 100.0),
        "validation_rate": validation.get("rate_true", 0.0),
        "nonzero_articulation_share": articulation.get("nonzero_share", 0.0),
    }

    # Build stats
    stats: FilterStats = {
        "total_assets": sum(s["total_children"] for s in filtered_schemas)
        + len(filtered_schemas),
        "schemas_count": len(filtered_schemas),
        "views_count": total_views,
        "columns_count": max(0, total_columns),
        "scope": scope,
        "source_file": str(json_path),
        "filtered_at": datetime.now().isoformat(),
    }

    # Build result
    result: FilteredMetadata = {
        "schemas": filtered_schemas,
        "views": views,
        "columns": columns,
        "top_articulated": filtered_top,
        "stats": stats,
        "quality": quality,
        "raw_totals": data.get("totals", {}),
    }

    # Optionally save output
    if output_dir is not None:
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)

        scope_suffix = scope if scope else "all"
        output_file = output_path / f"filtered_{scope_suffix}.json"

        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2, ensure_ascii=False)

    return result


def get_schema_details(
    json_path: str | Path,
    schema_name: str,
) -> Optional[SchemaBreakdown]:
    """Get details for a specific schema.

    Args:
        json_path: Path to Collibra JSON export
        schema_name: Name of schema to look up

    Returns:
        Schema breakdown or None if not found
    """
    data = load_collibra_export(json_path)
    schemas_breakdown = data.get("schemas_breakdown", {})

    if schema_name not in schemas_breakdown:
        return None

    schema_data = schemas_breakdown[schema_name]
    return {
        "name": schema_name,
        "total_children": schema_data.get("total_children", 0),
        "views": schema_data.get("views", 0),
        "dimensions": schema_data.get("dimensions", 0),
        "facts": schema_data.get("facts", 0),
        "relations": schema_data.get("relations", 0),
        "validated_true": schema_data.get("validated_true", 0),
        "articulation_gt0": schema_data.get("articulation_gt0", 0),
    }


def list_available_schemas(json_path: str | Path) -> list[str]:
    """List all available schema names in export.

    Args:
        json_path: Path to Collibra JSON export

    Returns:
        List of schema names
    """
    data = load_collibra_export(json_path)
    return list(data.get("schemas_breakdown", {}).keys())


if __name__ == "__main__":
    # Quick test
    import sys

    if len(sys.argv) < 2:
        print("Usage: python -m src.tool1.ingest <json_path> [scope]")
        print("  scope: 'bs', 'ba', or omit for all")
        sys.exit(1)

    json_path = sys.argv[1]
    scope = sys.argv[2] if len(sys.argv) > 2 else None

    if scope and scope not in ("bs", "ba"):
        print(f"Invalid scope: {scope}")
        sys.exit(1)

    result = filter_metadata(json_path, scope=scope, output_dir="data/tool1")  # type: ignore

    print(f"\n✅ Filtered metadata (scope={scope or 'all'})")
    print(f"   Schemas: {result['stats']['schemas_count']}")
    print(f"   Views: {result['stats']['views_count']}")
    print(f"   Total assets: {result['stats']['total_assets']}")
    print(f"   Articulation mean: {result['quality']['articulation_mean']:.1f}")
    print(f"   Validation rate: {result['quality']['validation_rate']:.1%}")

    for schema in result["schemas"]:
        print(f"\n   📁 {schema['name']}")
        print(
            f"      Views: {schema['views']} | Facts: {schema['facts']} | Dimensions: {schema['dimensions']}"
        )
