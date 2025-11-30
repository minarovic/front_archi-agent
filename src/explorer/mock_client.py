"""Mock Collibra API client reading from JSON exports.

This module provides a mock implementation of Collibra API that reads
from local JSON dumps produced by the MCOP pipeline.

Usage:
    from src.explorer.mock_client import CollibraAPIMock

    client = CollibraAPIMock()
    tables = client.list_tables()
    details = client.get_table("dimv_supplier")
"""

import json
import fnmatch
from pathlib import Path
from typing import TypedDict, Optional
from datetime import datetime

# ============================================================================
# Type definitions
# ============================================================================


class TableSummary(TypedDict):
    """Summary info for a table/view."""

    name: str
    full_name: str
    table_type: str  # FACT, DIMENSION, VIEW, SCHEMA
    schema: str | None
    description: str
    column_count: int
    confidence: float


class TableDetails(TypedDict):
    """Full details for a table."""

    name: str
    full_name: str
    table_type: str
    schema: str | None
    description: str
    business_key: str | None
    grain: str | None
    measures: list[str]
    attributes: list[str]
    date_columns: list[str]
    columns: list[dict]
    confidence: float
    rationale: str


class RelationshipInfo(TypedDict):
    """Relationship between tables."""

    from_table: str
    to_table: str
    join_column: str
    relationship_type: str  # FK, HIERARCHY
    confidence: float


class ColumnInfo(TypedDict):
    """Column search result."""

    table: str
    column: str
    column_type: str
    description: str


class LineageInfo(TypedDict):
    """Lineage information for a table."""

    table: str
    upstream: list[str]
    downstream: list[str]
    refresh_frequency: str


class SchemaInfo(TypedDict):
    """Schema summary."""

    name: str
    total_views: int
    dimensions: int
    facts: int
    relations: int
    validated_count: int


# ============================================================================
# Mock Client
# ============================================================================


class CollibraAPIMock:
    """Mock Collibra API client reading from JSON dumps.

    This client combines data from multiple pipeline outputs:
    - ba_bs_datamarts_summary.json - schemas, metrics, top assets
    - data/tool2/structure.json - classified tables (facts, dimensions)
    - data/tool1/filtered_*.json - filtered schema details

    Attributes:
        summary_data: Data from ba_bs_datamarts_summary.json
        structure_data: Data from tool2/structure.json
        tables_by_name: Index of tables by lowercase name
        columns_index: Flat list of all columns for search
    """

    def __init__(
        self,
        summary_path: str = "data/analysis/ba_bs_datamarts_summary.json",
        structure_path: str = "data/tool2/structure.json",
    ):
        """Initialize mock client with data paths.

        Args:
            summary_path: Path to datamarts summary JSON
            structure_path: Path to tool2 structure JSON
        """
        self.summary_data = self._load_json(summary_path)
        self.structure_data = self._load_json(structure_path, optional=True)
        self._build_index()
        self._loaded_at = datetime.now().isoformat()

    def _load_json(self, path: str, optional: bool = False) -> dict:
        """Load JSON data from file with fallback pattern matching.

        Args:
            path: Path to JSON file
            optional: If True, return empty dict if not found

        Returns:
            Parsed JSON data

        Raises:
            FileNotFoundError: If file not found and not optional
        """
        file_path = Path(path)

        # Try exact path first
        if file_path.exists():
            return json.loads(file_path.read_text())

        # Try pattern matching for timestamped files
        if "*" not in path:
            # Try to find any matching timestamped file
            parent = file_path.parent
            stem = file_path.stem.split("_")[0:3]  # e.g., ba_bs_datamarts
            pattern = f"{'_'.join(stem)}*.json"

            if parent.exists():
                files = list(parent.glob(pattern))
                if files:
                    # Use most recent file
                    newest = max(files, key=lambda f: f.stat().st_mtime)
                    return json.loads(newest.read_text())

        if optional:
            return {}

        raise FileNotFoundError(
            f"No data file found at {path}. " "Run the pipeline first to generate data."
        )

    def _build_index(self) -> None:
        """Build lookup indexes for fast access."""
        self.tables_by_name: dict[str, dict] = {}
        self.columns_index: list[dict] = []
        self.schemas: dict[str, SchemaInfo] = {}

        # Index schemas from summary
        for schema_name, schema_info in self.summary_data.get(
            "schemas_breakdown", {}
        ).items():
            self.schemas[schema_name.lower()] = {
                "name": schema_name,
                "total_views": schema_info.get("views", 0),
                "dimensions": schema_info.get("dimensions", 0),
                "facts": schema_info.get("facts", 0),
                "relations": schema_info.get("relations", 0),
                "validated_count": schema_info.get("validated_true", 0),
            }

            # Add schema as a "table" for listing
            self.tables_by_name[schema_name.lower()] = {
                "name": schema_name,
                "full_name": f"Systems>dap_gold_prod>{schema_name}",
                "table_type": "SCHEMA",
                "schema": None,
                "description": f"Schema with {schema_info.get('views', 0)} views, {schema_info.get('dimensions', 0)} dimensions, {schema_info.get('facts', 0)} facts",
                "columns": [],
                "confidence": 1.0,
                "rationale": "From Collibra export",
            }

        # Index facts from structure
        for fact in self.structure_data.get("facts", []):
            name = fact.get("table_id", "").lower()
            if name:
                self.tables_by_name[name] = {
                    "name": fact.get("table_id"),
                    "full_name": fact.get("table_name", ""),
                    "table_type": "FACT",
                    "schema": self._extract_schema(fact.get("table_name", "")),
                    "description": fact.get("rationale", ""),
                    "business_key": None,
                    "grain": fact.get("grain", ""),
                    "measures": fact.get("measures", []),
                    "attributes": [],
                    "date_columns": fact.get("date_columns", []),
                    "columns": self._build_fact_columns(fact),
                    "confidence": fact.get("confidence", 0.5),
                    "rationale": fact.get("rationale", ""),
                }

                # Index columns for search
                for col in self.tables_by_name[name]["columns"]:
                    self.columns_index.append(
                        {
                            "table": name,
                            "column": col.get("name", ""),
                            "column_type": col.get("type", "unknown"),
                            "description": col.get("description", ""),
                        }
                    )

        # Index dimensions from structure
        for dim in self.structure_data.get("dimensions", []):
            name = dim.get("table_id", "").lower()
            if name:
                self.tables_by_name[name] = {
                    "name": dim.get("table_id"),
                    "full_name": dim.get("table_name", ""),
                    "table_type": "DIMENSION",
                    "schema": self._extract_schema(dim.get("table_name", "")),
                    "description": dim.get("rationale", ""),
                    "business_key": dim.get("business_key", ""),
                    "grain": None,
                    "measures": [],
                    "attributes": dim.get("attributes", []),
                    "date_columns": [],
                    "columns": self._build_dim_columns(dim),
                    "confidence": dim.get("confidence", 0.5),
                    "rationale": dim.get("rationale", ""),
                }

                # Index columns for search
                for col in self.tables_by_name[name]["columns"]:
                    self.columns_index.append(
                        {
                            "table": name,
                            "column": col.get("name", ""),
                            "column_type": col.get("type", "unknown"),
                            "description": col.get("description", ""),
                        }
                    )

        # Index top articulated assets as views
        for asset in self.summary_data.get("top_articulated_assets", []):
            if asset.get("typeName") == "Database View":
                name = asset.get("displayName", "").lower()
                if name and name not in self.tables_by_name:
                    self.tables_by_name[name] = {
                        "name": asset.get("displayName"),
                        "full_name": f"Systems>dap_gold_prod>{asset.get('schema', '')}.{asset.get('displayName')}",
                        "table_type": "VIEW",
                        "schema": asset.get("schema"),
                        "description": f"View with articulation score {asset.get('articulationScore', 0)}",
                        "business_key": None,
                        "grain": None,
                        "measures": [],
                        "attributes": [],
                        "date_columns": [],
                        "columns": [],
                        "confidence": asset.get("articulationScore", 0) / 100.0,
                        "rationale": f"Validation: {asset.get('validationResult', False)}",
                    }

    def _extract_schema(self, full_name: str) -> str | None:
        """Extract schema name from full table path.

        Args:
            full_name: Full path like 'Systems>dap_gold_prod>dm_bs_purchase>table'

        Returns:
            Schema name or None
        """
        parts = full_name.split(">")
        if len(parts) >= 3:
            return parts[2]  # e.g., dm_bs_purchase
        return None

    def _build_fact_columns(self, fact: dict) -> list[dict]:
        """Build column list from fact table info."""
        columns = []

        # Add measures as columns
        for measure in fact.get("measures", []):
            columns.append(
                {
                    "name": measure,
                    "type": "numeric",
                    "description": f"Measure: {measure}",
                    "is_measure": True,
                    "is_foreign_key": False,
                }
            )

        # Add date columns
        for date_col in fact.get("date_columns", []):
            columns.append(
                {
                    "name": date_col,
                    "type": "date",
                    "description": f"Date column: {date_col}",
                    "is_measure": False,
                    "is_foreign_key": False,
                }
            )

        return columns

    def _build_dim_columns(self, dim: dict) -> list[dict]:
        """Build column list from dimension table info."""
        columns = []

        # Add business key
        if dim.get("business_key"):
            columns.append(
                {
                    "name": dim["business_key"],
                    "type": "string",
                    "description": f"Business key: {dim['business_key']}",
                    "is_measure": False,
                    "is_foreign_key": False,
                }
            )

        # Add attributes as columns
        for attr in dim.get("attributes", []):
            columns.append(
                {
                    "name": attr,
                    "type": "string",
                    "description": f"Attribute: {attr}",
                    "is_measure": False,
                    "is_foreign_key": False,
                }
            )

        return columns

    # ========================================================================
    # Public API methods
    # ========================================================================

    def list_tables(self, schema: str | None = None) -> list[TableSummary]:
        """List all tables with summary info.

        Args:
            schema: Optional schema name to filter by

        Returns:
            List of table summaries
        """
        results = []

        for name, table in self.tables_by_name.items():
            # Skip schemas when listing tables
            if table["table_type"] == "SCHEMA":
                continue

            # Filter by schema if specified
            if schema and table.get("schema", "").lower() != schema.lower():
                continue

            results.append(
                {
                    "name": table["name"],
                    "full_name": table["full_name"],
                    "table_type": table["table_type"],
                    "schema": table.get("schema"),
                    "description": table.get("description", "")[:100],
                    "column_count": len(table.get("columns", [])),
                    "confidence": table.get("confidence", 0.5),
                }
            )

        # Sort by name
        results.sort(key=lambda t: t["name"])
        return results

    def list_schemas(self) -> list[SchemaInfo]:
        """List all schemas with summary info.

        Returns:
            List of schema summaries
        """
        return list(self.schemas.values())

    def get_table(self, name: str) -> TableDetails | dict:
        """Get full table details.

        Args:
            name: Table name (case-insensitive)

        Returns:
            Full table details or error dict
        """
        table = self.tables_by_name.get(name.lower())
        if not table:
            return {"error": f"Table '{name}' not found"}
        return table

    def get_relationships(self, table_name: str) -> list[RelationshipInfo]:
        """Get relationships for a table.

        Args:
            table_name: Table name to find relationships for

        Returns:
            List of relationships
        """
        results = []
        name_lower = table_name.lower()

        # Check FK relationships from structure
        for rel in self.structure_data.get("relationships", []):
            from_table = rel.get("from_table", "").lower()
            to_table = rel.get("to_table", "").lower()

            if name_lower in (from_table, to_table):
                results.append(
                    {
                        "from_table": rel.get("from_table"),
                        "to_table": rel.get("to_table"),
                        "join_column": rel.get("join_column", ""),
                        "relationship_type": rel.get("relationship_type", "FK"),
                        "confidence": rel.get("confidence", 0.5),
                    }
                )

        # Check hierarchies from structure
        for hier in self.structure_data.get("hierarchies", []):
            parent = hier.get("parent_table", "").lower()
            child = hier.get("child_table", "").lower()

            if name_lower in (parent, child):
                results.append(
                    {
                        "from_table": hier.get("child_table"),
                        "to_table": hier.get("parent_table"),
                        "join_column": "",
                        "relationship_type": "HIERARCHY",
                        "confidence": hier.get("confidence", 0.5),
                    }
                )

        return results

    def search_columns(self, pattern: str) -> list[ColumnInfo]:
        """Search columns using wildcard pattern.

        Args:
            pattern: Wildcard pattern (e.g., '*supplier*', 'order_*')

        Returns:
            List of matching columns (max 50)
        """
        results = []
        pattern_lower = pattern.lower()

        for col_info in self.columns_index:
            col_name = col_info["column"].lower()

            # Support wildcard matching
            if fnmatch.fnmatch(col_name, pattern_lower):
                results.append(col_info)
            # Also support substring matching
            elif pattern_lower.strip("*") in col_name:
                results.append(col_info)

        return results[:50]  # Limit results

    def get_lineage(self, table_name: str) -> LineageInfo | dict:
        """Get lineage info for a table.

        Note: This is mock data based on available metadata.
        Real implementation would query Collibra lineage API.

        Args:
            table_name: Table name

        Returns:
            Lineage info or error dict
        """
        table = self.tables_by_name.get(table_name.lower())
        if not table:
            return {"error": f"Table '{table_name}' not found"}

        # Infer upstream from schema
        schema = table.get("schema", "")
        upstream = []
        if "bs" in schema.lower():
            upstream = ["SAP ERP", "Unity Catalog Bronze"]
        elif "ba" in schema.lower():
            upstream = ["External Analytics", "Unity Catalog Bronze"]
        else:
            upstream = ["Unknown Source"]

        # Infer downstream based on table type
        downstream = []
        if table["table_type"] == "FACT":
            downstream = ["Business Reports", "Executive Dashboards"]
        elif table["table_type"] == "DIMENSION":
            downstream = ["Fact Tables", "Lookup Services"]
        else:
            downstream = ["Reports", "Analytics"]

        return {
            "table": table_name,
            "upstream": upstream,
            "downstream": downstream,
            "refresh_frequency": "Daily",
        }

    def get_stats(self) -> dict:
        """Get overall statistics about loaded data.

        Returns:
            Dictionary with counts and metadata
        """
        table_types = {}
        for table in self.tables_by_name.values():
            t = table["table_type"]
            table_types[t] = table_types.get(t, 0) + 1

        return {
            "loaded_at": self._loaded_at,
            "total_tables": len(self.tables_by_name),
            "total_columns": len(self.columns_index),
            "total_schemas": len(self.schemas),
            "tables_by_type": table_types,
            "relationships": len(self.structure_data.get("relationships", [])),
            "hierarchies": len(self.structure_data.get("hierarchies", [])),
        }


# ============================================================================
# CLI for testing
# ============================================================================

if __name__ == "__main__":
    import sys

    print("=== Collibra API Mock Client ===\n")

    try:
        client = CollibraAPIMock()
        stats = client.get_stats()

        print(f"Loaded at: {stats['loaded_at']}")
        print(f"Total tables: {stats['total_tables']}")
        print(f"Total columns: {stats['total_columns']}")
        print(f"Total schemas: {stats['total_schemas']}")
        print(f"Tables by type: {stats['tables_by_type']}")
        print()

        print("=== Schemas ===")
        for schema in client.list_schemas():
            print(
                f"  - {schema['name']}: {schema['total_views']} views, "
                f"{schema['dimensions']} dims, {schema['facts']} facts"
            )
        print()

        print("=== Tables ===")
        for table in client.list_tables():
            print(
                f"  [{table['table_type']:10}] {table['name']}: {table['column_count']} columns"
            )
        print()

        if len(sys.argv) > 1:
            table_name = sys.argv[1]
            print(f"=== Table Details: {table_name} ===")
            details = client.get_table(table_name)
            print(json.dumps(details, indent=2))

    except FileNotFoundError as e:
        print(f"Error: {e}")
        print("Run the pipeline first to generate data files.")
        sys.exit(1)
