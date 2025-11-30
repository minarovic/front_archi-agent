"""Tests for Explorer Agent module - MCOP-S1-004.

Tests cover:
- CollibraAPIMock data loading and indexing
- Table listing and filtering
- Relationship detection
- Column search
- Lineage retrieval
- Agent tool registration (without LLM calls)
"""

import json
import pytest
from pathlib import Path
from datetime import datetime

from src.explorer.mock_client import CollibraAPIMock
from src.explorer.agent import create_explorer_agent, ExplorerDeps


# ============================================================================
# Fixtures
# ============================================================================


@pytest.fixture
def sample_summary() -> dict:
    """Create sample datamarts summary data."""
    return {
        "totals": {"total_assets_raw": 100, "total_assets_dedup": 90, "schemas": 2},
        "counts": {"by_type": {"Schema": 2, "Database View": 20, "Column": 68}},
        "schemas_breakdown": {
            "dm_bs_purchase": {
                "total_children": 18,
                "views": 18,
                "dimensions": 11,
                "facts": 7,
                "relations": 5,
                "validated_true": 2,
                "articulation_gt0": 3,
            },
            "dm_ba_analytics": {
                "total_children": 24,
                "views": 24,
                "dimensions": 15,
                "facts": 9,
                "relations": 8,
                "validated_true": 5,
                "articulation_gt0": 7,
            },
        },
        "top_articulated_assets": [
            {
                "displayName": "dimv_test_view",
                "id": "test-uuid-1",
                "typeName": "Database View",
                "schema": "dm_bs_purchase",
                "articulationScore": 85.0,
                "validationResult": True,
            }
        ],
    }


@pytest.fixture
def sample_structure() -> dict:
    """Create sample tool2 structure data."""
    return {
        "timestamp": datetime.now().isoformat(),
        "facts": [
            {
                "table_id": "factv_orders",
                "table_name": "Systems>dap_gold_prod>dm_bs_purchase>factv_orders",
                "grain": "Order line level",
                "measures": ["order_amount", "quantity"],
                "date_columns": ["order_date", "ship_date"],
                "confidence": 0.92,
                "rationale": "Order transactions fact table",
            },
            {
                "table_id": "factv_deliveries",
                "table_name": "Systems>dap_gold_prod>dm_bs_purchase>factv_deliveries",
                "grain": "Delivery event level",
                "measures": ["delivery_count", "on_time_rate"],
                "date_columns": ["delivery_date"],
                "confidence": 0.88,
                "rationale": "Delivery performance fact",
            },
        ],
        "dimensions": [
            {
                "table_id": "dimv_supplier",
                "table_name": "Systems>dap_gold_prod>dm_bs_purchase>dimv_supplier",
                "business_key": "supplier_id",
                "attributes": ["supplier_name", "supplier_country", "supplier_rating"],
                "confidence": 0.95,
                "rationale": "Supplier master dimension",
            },
            {
                "table_id": "dimv_product",
                "table_name": "Systems>dap_gold_prod>dm_bs_purchase>dimv_product",
                "business_key": "product_id",
                "attributes": ["product_name", "product_category", "brand"],
                "confidence": 0.90,
                "rationale": "Product master dimension",
            },
        ],
        "relationships": [
            {
                "from_table": "factv_orders",
                "to_table": "dimv_supplier",
                "join_column": "supplier_id",
                "relationship_type": "FK",
                "confidence": 0.95,
            },
            {
                "from_table": "factv_orders",
                "to_table": "dimv_product",
                "join_column": "product_id",
                "relationship_type": "FK",
                "confidence": 0.92,
            },
        ],
        "hierarchies": [
            {
                "parent_table": "dimv_category",
                "child_table": "dimv_product",
                "relationship_type": "1:N",
                "confidence": 0.85,
            }
        ],
    }


@pytest.fixture
def temp_data_files(tmp_path, sample_summary, sample_structure) -> tuple[Path, Path]:
    """Create temporary JSON files for testing."""
    summary_path = tmp_path / "summary.json"
    structure_path = tmp_path / "structure.json"

    summary_path.write_text(json.dumps(sample_summary))
    structure_path.write_text(json.dumps(sample_structure))

    return summary_path, structure_path


@pytest.fixture
def mock_client(temp_data_files) -> CollibraAPIMock:
    """Create mock client with test data."""
    summary_path, structure_path = temp_data_files
    return CollibraAPIMock(
        summary_path=str(summary_path), structure_path=str(structure_path)
    )


# ============================================================================
# Mock Client Tests
# ============================================================================


class TestCollibraAPIMockLoading:
    """Tests for data loading and initialization."""

    def test_load_data_files(self, mock_client):
        """Test that data files are loaded correctly."""
        assert mock_client.summary_data is not None
        assert mock_client.structure_data is not None

    def test_build_index_schemas(self, mock_client):
        """Test that schemas are indexed."""
        assert len(mock_client.schemas) == 2
        assert "dm_bs_purchase" in mock_client.schemas
        assert "dm_ba_analytics" in mock_client.schemas

    def test_build_index_tables(self, mock_client):
        """Test that tables are indexed."""
        # Should have: 2 schemas + 2 facts + 2 dims + 1 view = 7
        assert len(mock_client.tables_by_name) == 7

    def test_build_index_columns(self, mock_client):
        """Test that columns are indexed for search."""
        assert len(mock_client.columns_index) > 0

    def test_get_stats(self, mock_client):
        """Test statistics retrieval."""
        stats = mock_client.get_stats()

        assert "loaded_at" in stats
        assert "total_tables" in stats
        assert "total_columns" in stats
        assert "total_schemas" in stats
        assert "tables_by_type" in stats


class TestCollibraAPIMockListMethods:
    """Tests for listing methods."""

    def test_list_tables_all(self, mock_client):
        """Test listing all tables."""
        tables = mock_client.list_tables()

        # Should return non-schema tables
        assert len(tables) == 5  # 2 facts + 2 dims + 1 view

        # Check required fields
        for table in tables:
            assert "name" in table
            assert "table_type" in table
            assert "column_count" in table

    def test_list_tables_by_schema(self, mock_client):
        """Test filtering tables by schema."""
        tables = mock_client.list_tables(schema="dm_bs_purchase")

        # All returned tables should be in the specified schema
        for table in tables:
            assert table.get("schema") == "dm_bs_purchase"

    def test_list_tables_sorted(self, mock_client):
        """Test that tables are sorted by name."""
        tables = mock_client.list_tables()
        names = [t["name"] for t in tables]

        assert names == sorted(names)

    def test_list_schemas(self, mock_client):
        """Test listing schemas."""
        schemas = mock_client.list_schemas()

        assert len(schemas) == 2

        # Check required fields
        for schema in schemas:
            assert "name" in schema
            assert "total_views" in schema
            assert "dimensions" in schema
            assert "facts" in schema


class TestCollibraAPIMockTableDetails:
    """Tests for table detail retrieval."""

    def test_get_table_fact(self, mock_client):
        """Test getting fact table details."""
        table = mock_client.get_table("factv_orders")

        assert table["name"] == "factv_orders"
        assert table["table_type"] == "FACT"
        assert "measures" in table
        assert "date_columns" in table
        assert table["grain"] == "Order line level"

    def test_get_table_dimension(self, mock_client):
        """Test getting dimension table details."""
        table = mock_client.get_table("dimv_supplier")

        assert table["name"] == "dimv_supplier"
        assert table["table_type"] == "DIMENSION"
        assert table["business_key"] == "supplier_id"
        assert "attributes" in table

    def test_get_table_case_insensitive(self, mock_client):
        """Test that table lookup is case-insensitive."""
        table1 = mock_client.get_table("DIMV_SUPPLIER")
        table2 = mock_client.get_table("dimv_supplier")
        table3 = mock_client.get_table("Dimv_Supplier")

        assert table1["name"] == table2["name"] == table3["name"]

    def test_get_table_not_found(self, mock_client):
        """Test error handling for missing table."""
        result = mock_client.get_table("nonexistent_table")

        assert "error" in result
        assert "not found" in result["error"]


class TestCollibraAPIMockRelationships:
    """Tests for relationship retrieval."""

    def test_get_relationships_fact(self, mock_client):
        """Test getting relationships for fact table."""
        relationships = mock_client.get_relationships("factv_orders")

        assert len(relationships) == 2  # FK to supplier and product

        to_tables = [r["to_table"] for r in relationships]
        assert "dimv_supplier" in to_tables
        assert "dimv_product" in to_tables

    def test_get_relationships_dimension(self, mock_client):
        """Test getting relationships for dimension (hierarchy)."""
        relationships = mock_client.get_relationships("dimv_product")

        # Should include hierarchy relationship
        assert any(r["relationship_type"] == "HIERARCHY" for r in relationships)

    def test_get_relationships_empty(self, mock_client):
        """Test handling of table with no relationships."""
        relationships = mock_client.get_relationships("dimv_test_view")

        assert relationships == []


class TestCollibraAPIMockColumnSearch:
    """Tests for column search functionality."""

    def test_search_columns_wildcard(self, mock_client):
        """Test wildcard pattern matching."""
        results = mock_client.search_columns("*supplier*")

        assert len(results) > 0
        for col in results:
            assert "supplier" in col["column"].lower()

    def test_search_columns_prefix(self, mock_client):
        """Test prefix pattern matching."""
        results = mock_client.search_columns("order_*")

        for col in results:
            assert col["column"].lower().startswith("order_")

    def test_search_columns_suffix(self, mock_client):
        """Test suffix pattern matching."""
        results = mock_client.search_columns("*_id")

        for col in results:
            assert col["column"].lower().endswith("_id")

    def test_search_columns_limit(self, mock_client):
        """Test that results are limited to 50."""
        results = mock_client.search_columns("*")

        assert len(results) <= 50

    def test_search_columns_no_match(self, mock_client):
        """Test handling of no matches."""
        results = mock_client.search_columns("xyz_nonexistent_abc")

        assert results == []


class TestCollibraAPIMockLineage:
    """Tests for lineage retrieval."""

    def test_get_lineage_bs_schema(self, mock_client):
        """Test lineage for BS schema table."""
        lineage = mock_client.get_lineage("factv_orders")

        assert "table" in lineage
        assert "upstream" in lineage
        assert "downstream" in lineage
        assert "refresh_frequency" in lineage

    def test_get_lineage_not_found(self, mock_client):
        """Test error handling for missing table."""
        result = mock_client.get_lineage("nonexistent_table")

        assert "error" in result


# ============================================================================
# Agent Tests (without LLM calls)
# ============================================================================


class TestExplorerAgent:
    """Tests for agent creation and tool registration."""

    def test_create_agent(self, monkeypatch):
        """Test that agent can be created."""
        # Set required env var for Azure provider
        monkeypatch.setenv("OPENAI_API_VERSION", "2024-10-21")

        agent = create_explorer_agent()

        assert agent is not None
        assert agent._deps_type is ExplorerDeps

    def test_agent_has_tools(self, monkeypatch):
        """Test that agent has registered tools."""
        # Set required env var for Azure provider
        monkeypatch.setenv("OPENAI_API_VERSION", "2024-10-21")

        agent = create_explorer_agent()

        # Check tool names - API varies by version
        if hasattr(agent, "_function_toolset"):
            toolset = agent._function_toolset
            if hasattr(toolset, "tools") and isinstance(toolset.tools, dict):
                tool_names = list(toolset.tools.keys())
            else:
                # Skip if we can't inspect tools
                pytest.skip("Cannot inspect agent tools in this pydantic-ai version")
        else:
            tool_names = [tool.name for tool in agent._function_tools.values()]

        assert "list_tables" in tool_names
        assert "get_table_details" in tool_names
        assert "find_relationships" in tool_names
        assert "search_columns" in tool_names
        assert "get_lineage" in tool_names

    def test_explorer_deps(self, mock_client):
        """Test ExplorerDeps dataclass."""
        deps = ExplorerDeps(collibra=mock_client, session_id="test-123")

        assert deps.collibra is mock_client
        assert deps.session_id == "test-123"


# ============================================================================
# Integration Tests (using real data files if available)
# ============================================================================


class TestExplorerIntegration:
    """Integration tests using actual project data files."""

    @pytest.fixture
    def real_client(self):
        """Try to create client with real data files."""
        try:
            return CollibraAPIMock()
        except FileNotFoundError:
            pytest.skip("Real data files not available")

    def test_real_data_loading(self, real_client):
        """Test loading actual project data."""
        stats = real_client.get_stats()

        assert stats["total_tables"] > 0
        print(
            f"Loaded {stats['total_tables']} tables, {stats['total_columns']} columns"
        )

    def test_real_data_schemas(self, real_client):
        """Test listing real schemas."""
        schemas = real_client.list_schemas()

        assert len(schemas) > 0
        for schema in schemas:
            print(
                f"  {schema['name']}: {schema['dimensions']} dims, {schema['facts']} facts"
            )

    def test_real_data_tables(self, real_client):
        """Test listing real tables."""
        tables = real_client.list_tables()

        assert len(tables) > 0

        # Check table types
        types = set(t["table_type"] for t in tables)
        print(f"Table types: {types}")


# ============================================================================
# CLI Tests
# ============================================================================


class TestExplorerCLI:
    """Tests for CLI module imports and structure."""

    def test_cli_imports(self):
        """Test that CLI module can be imported."""
        from src.explorer.cli import main, run_repl, run_single_query

        assert callable(main)
        assert callable(run_repl)
        assert callable(run_single_query)

    def test_cli_help_functions(self):
        """Test CLI helper functions."""
        from src.explorer.cli import print_banner, print_help

        # These should not raise
        print_banner()
        print_help()
