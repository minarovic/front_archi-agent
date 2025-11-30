"""Tests for Tool 1: Metadata Ingest & Filter."""

from pathlib import Path

import pytest

from src.tool1.ingest import (
    filter_metadata,
    load_collibra_export,
    get_schema_details,
    list_available_schemas,
)


class TestLoadCollibraExport:
    """Tests for load_collibra_export function."""

    def test_load_existing_file(self, minimal_collibra_json: Path):
        """Test loading existing JSON file."""
        data = load_collibra_export(minimal_collibra_json)

        assert "totals" in data
        assert "schemas_breakdown" in data
        assert data["totals"]["schemas"] == 2

    def test_load_nonexistent_file(self, tmp_path: Path):
        """Test loading non-existent file raises error."""
        with pytest.raises(FileNotFoundError):
            load_collibra_export(tmp_path / "nonexistent.json")

    def test_load_with_path_object(self, minimal_collibra_json: Path):
        """Test loading with Path object."""
        data = load_collibra_export(minimal_collibra_json)
        assert data is not None

    def test_load_with_string_path(self, minimal_collibra_json: Path):
        """Test loading with string path."""
        data = load_collibra_export(str(minimal_collibra_json))
        assert data is not None


class TestFilterMetadata:
    """Tests for filter_metadata function."""

    def test_filter_bs_scope(self, minimal_collibra_json: Path):
        """Test filtering for BS (Business Systems) scope."""
        result = filter_metadata(minimal_collibra_json, scope="bs")

        assert result["stats"]["scope"] == "bs"
        assert result["stats"]["schemas_count"] == 1
        assert len(result["schemas"]) == 1
        assert result["schemas"][0]["name"] == "dm_bs_purchase"

    def test_filter_ba_scope(self, minimal_collibra_json: Path):
        """Test filtering for BA (Business Analytics) scope."""
        result = filter_metadata(minimal_collibra_json, scope="ba")

        assert result["stats"]["scope"] == "ba"
        assert result["stats"]["schemas_count"] == 1
        assert len(result["schemas"]) == 1
        assert result["schemas"][0]["name"] == "dm_ba_purchase"

    def test_filter_all_scope(self, minimal_collibra_json: Path):
        """Test filtering with no scope (all schemas)."""
        result = filter_metadata(minimal_collibra_json, scope=None)

        assert result["stats"]["scope"] is None
        assert result["stats"]["schemas_count"] == 2
        assert len(result["schemas"]) == 2

    def test_invalid_scope_raises_error(self, minimal_collibra_json: Path):
        """Test invalid scope raises ValueError."""
        with pytest.raises(ValueError, match="Invalid scope"):
            filter_metadata(minimal_collibra_json, scope="invalid")  # type: ignore

    def test_stats_structure(self, minimal_collibra_json: Path):
        """Test stats dictionary structure."""
        result = filter_metadata(minimal_collibra_json, scope="bs")
        stats = result["stats"]

        assert "total_assets" in stats
        assert "schemas_count" in stats
        assert "views_count" in stats
        assert "columns_count" in stats
        assert "scope" in stats
        assert "source_file" in stats
        assert "filtered_at" in stats

    def test_quality_metrics(self, minimal_collibra_json: Path):
        """Test quality metrics extraction."""
        result = filter_metadata(minimal_collibra_json, scope="bs")
        quality = result["quality"]

        assert "articulation_mean" in quality
        assert "articulation_median" in quality
        assert "validation_rate" in quality
        assert quality["articulation_mean"] == 25.5
        assert quality["validation_rate"] == 0.21

    def test_schema_breakdown(self, minimal_collibra_json: Path):
        """Test schema breakdown structure."""
        result = filter_metadata(minimal_collibra_json, scope="bs")
        schema = result["schemas"][0]

        assert schema["name"] == "dm_bs_purchase"
        assert schema["views"] == 18
        assert schema["facts"] == 7
        assert schema["dimensions"] == 11
        assert schema["total_children"] == 50

    def test_top_articulated_filtering(self, minimal_collibra_json: Path):
        """Test top articulated assets are filtered by scope."""
        result_bs = filter_metadata(minimal_collibra_json, scope="bs")
        result_ba = filter_metadata(minimal_collibra_json, scope="ba")

        # BS scope should include bs-related assets
        bs_names = [a["displayName"] for a in result_bs["top_articulated"]]
        assert "dm_bs_purchase" in bs_names
        assert "fact_bs_orders" in bs_names

        # BA scope should include ba-related assets
        ba_names = [a["displayName"] for a in result_ba["top_articulated"]]
        assert "dm_ba_purchase" in ba_names
        assert "fact_ba_sales" in ba_names

    def test_output_file_saved(self, minimal_collibra_json: Path, output_dir: Path):
        """Test output file is saved when output_dir specified."""
        result = filter_metadata(
            minimal_collibra_json, scope="bs", output_dir=output_dir
        )

        output_file = output_dir / "filtered_bs.json"
        assert output_file.exists()

    def test_output_file_all_scope(self, minimal_collibra_json: Path, output_dir: Path):
        """Test output file naming for all scope."""
        filter_metadata(minimal_collibra_json, scope=None, output_dir=output_dir)

        output_file = output_dir / "filtered_all.json"
        assert output_file.exists()


class TestGetSchemaDetails:
    """Tests for get_schema_details function."""

    def test_existing_schema(self, minimal_collibra_json: Path):
        """Test getting details for existing schema."""
        details = get_schema_details(minimal_collibra_json, "dm_bs_purchase")

        assert details is not None
        assert details["name"] == "dm_bs_purchase"
        assert details["views"] == 18
        assert details["facts"] == 7

    def test_nonexistent_schema(self, minimal_collibra_json: Path):
        """Test getting details for non-existent schema."""
        details = get_schema_details(minimal_collibra_json, "nonexistent_schema")

        assert details is None


class TestListAvailableSchemas:
    """Tests for list_available_schemas function."""

    def test_list_schemas(self, minimal_collibra_json: Path):
        """Test listing available schemas."""
        schemas = list_available_schemas(minimal_collibra_json)

        assert len(schemas) == 2
        assert "dm_bs_purchase" in schemas
        assert "dm_ba_purchase" in schemas


class TestIntegrationWithRealData:
    """Integration tests using real Collibra data (skipped if not available)."""

    def test_filter_real_data_bs(self, sample_collibra_json_path: Path):
        """Test filtering real Collibra export for BS scope."""
        result = filter_metadata(sample_collibra_json_path, scope="bs")

        # Should have at least one BS schema
        assert result["stats"]["schemas_count"] >= 1

        # All schemas should start with dm_bs_
        for schema in result["schemas"]:
            assert schema["name"].startswith("dm_bs_")

    def test_filter_real_data_ba(self, sample_collibra_json_path: Path):
        """Test filtering real Collibra export for BA scope."""
        result = filter_metadata(sample_collibra_json_path, scope="ba")

        # Should have at least one BA schema
        assert result["stats"]["schemas_count"] >= 1

        # All schemas should start with dm_ba_
        for schema in result["schemas"]:
            assert schema["name"].startswith("dm_ba_")

    def test_real_data_quality_metrics(self, sample_collibra_json_path: Path):
        """Test quality metrics from real data."""
        result = filter_metadata(sample_collibra_json_path, scope=None)

        # Quality metrics should be present and reasonable
        assert 0 <= result["quality"]["validation_rate"] <= 1
        assert 0 <= result["quality"]["articulation_mean"] <= 100
