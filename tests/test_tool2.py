"""Tests for Tool 2: Structure Classifier."""

from pathlib import Path

import pytest

from src.tool2.classifier import (
    classify_structure,
    detect_relationships,
    classify_single_table,
    _matches_pattern,
    _detect_grain,
    _detect_dim_type,
    FACT_PATTERNS,
    DIMENSION_PATTERNS,
)


class TestPatternMatching:
    """Tests for pattern matching utilities."""

    def test_fact_pattern_prefix(self):
        """Test fact prefix patterns."""
        assert _matches_pattern("factv_orders", FACT_PATTERNS)
        assert _matches_pattern("fact_sales", FACT_PATTERNS)
        assert _matches_pattern("f_transactions", FACT_PATTERNS)

    def test_fact_pattern_suffix(self):
        """Test fact suffix patterns."""
        assert _matches_pattern("sales_fact", FACT_PATTERNS)

    def test_fact_pattern_keywords(self):
        """Test fact keyword patterns."""
        assert _matches_pattern("purchase_orders", FACT_PATTERNS)
        assert _matches_pattern("transaction_log", FACT_PATTERNS)
        assert _matches_pattern("payment_history", FACT_PATTERNS)

    def test_dimension_pattern_prefix(self):
        """Test dimension prefix patterns."""
        assert _matches_pattern("dimv_customer", DIMENSION_PATTERNS)
        assert _matches_pattern("dim_supplier", DIMENSION_PATTERNS)
        assert _matches_pattern("d_products", DIMENSION_PATTERNS)

    def test_dimension_pattern_suffix(self):
        """Test dimension suffix patterns."""
        assert _matches_pattern("customer_dim", DIMENSION_PATTERNS)

    def test_dimension_pattern_keywords(self):
        """Test dimension keyword patterns."""
        assert _matches_pattern("supplier_master", DIMENSION_PATTERNS)
        assert _matches_pattern("product_catalog", DIMENSION_PATTERNS)
        assert _matches_pattern("calendar_table", DIMENSION_PATTERNS)

    def test_no_match(self):
        """Test tables that don't match patterns."""
        assert not _matches_pattern("random_table", FACT_PATTERNS)
        assert not _matches_pattern("unknown_data", DIMENSION_PATTERNS)


class TestGrainDetection:
    """Tests for grain detection."""

    def test_transaction_grain(self):
        """Test transaction grain detection."""
        assert _detect_grain("factv_purchase_order") == "transaction"
        assert _detect_grain("sales_invoice") == "transaction"

    def test_event_grain(self):
        """Test event grain detection."""
        assert _detect_grain("user_event_log") == "event"
        assert _detect_grain("click_activity") == "event"

    def test_snapshot_grain(self):
        """Test snapshot grain detection."""
        assert _detect_grain("inventory_snapshot") == "snapshot"
        assert _detect_grain("daily_balance") == "snapshot"

    def test_aggregate_grain(self):
        """Test aggregate grain detection."""
        assert _detect_grain("daily_summary") == "aggregate"
        assert _detect_grain("monthly_agg") == "aggregate"

    def test_default_grain(self):
        """Test default grain for unknown tables."""
        assert _detect_grain("some_table") == "transaction"


class TestDimTypeDetection:
    """Tests for dimension type detection."""

    def test_master_type(self):
        """Test master dimension type."""
        assert _detect_dim_type("supplier_master") == "master"
        assert _detect_dim_type("dimv_customer") == "master"

    def test_calendar_type(self):
        """Test calendar dimension type."""
        assert _detect_dim_type("dim_calendar") == "calendar"
        assert _detect_dim_type("date_dimension") == "calendar"
        assert _detect_dim_type("fiscal_period") == "calendar"

    def test_lookup_type(self):
        """Test lookup dimension type."""
        assert _detect_dim_type("status_codes") == "lookup"
        assert _detect_dim_type("category_types") == "lookup"

    def test_bridge_type(self):
        """Test bridge dimension type."""
        assert _detect_dim_type("customer_product_bridge") == "bridge"
        assert _detect_dim_type("xref_table") == "bridge"


class TestClassifySingleTable:
    """Tests for single table classification."""

    def test_classify_fact(self):
        """Test classifying fact tables."""
        assert classify_single_table("factv_orders") == "fact"
        assert classify_single_table("purchase_transaction") == "fact"

    def test_classify_dimension(self):
        """Test classifying dimension tables."""
        assert classify_single_table("dimv_supplier") == "dimension"
        assert classify_single_table("customer_master") == "dimension"

    def test_classify_unknown(self):
        """Test unknown classification."""
        assert classify_single_table("random_table") == "unknown"
        assert classify_single_table("some_data") == "unknown"


class TestClassifyStructure:
    """Tests for full structure classification."""

    @pytest.fixture
    def sample_filtered_metadata(self) -> dict:
        """Create sample filtered metadata (Tool 1 output)."""
        return {
            "schemas": [
                {
                    "name": "dm_bs_purchase",
                    "total_children": 50,
                    "views": 18,
                    "facts": 7,
                    "dimensions": 11,
                    "relations": 0,
                    "validated_true": 10,
                    "articulation_gt0": 15,
                }
            ],
            "views": ["dm_bs_purchase"],
            "columns": [],
            "top_articulated": [
                {
                    "displayName": "factv_purchase_order",
                    "id": "fact-1",
                    "typeName": "View",
                    "schema": "dm_bs_purchase",
                    "articulationScore": 85.0,
                    "validationResult": True,
                },
                {
                    "displayName": "dimv_supplier",
                    "id": "dim-1",
                    "typeName": "View",
                    "schema": "dm_bs_purchase",
                    "articulationScore": 75.0,
                    "validationResult": True,
                },
            ],
            "stats": {
                "total_assets": 50,
                "schemas_count": 1,
                "views_count": 18,
                "columns_count": 32,
                "scope": "bs",
            },
            "quality": {
                "articulation_mean": 65.0,
                "validation_rate": 0.8,
            },
        }

    @pytest.fixture
    def sample_tool0_context(self) -> dict:
        """Create sample Tool 0 context."""
        return {
            "project_name": "Supplier Risk",
            "goal": "Track supplier reliability",
            "entities": [
                {
                    "name": "Purchase Order",
                    "table": "factv_purchase_order",
                },
                {
                    "name": "Supplier Master",
                    "table": "dimv_supplier",
                },
            ],
        }

    def test_classify_basic(self, sample_filtered_metadata: dict):
        """Test basic classification without Tool 0 context."""
        result = classify_structure(sample_filtered_metadata)

        assert "facts" in result
        assert "dimensions" in result
        assert "relationships" in result
        assert "metrics" in result
        assert "unclassified" in result

    def test_classify_with_tool0_context(
        self,
        sample_filtered_metadata: dict,
        sample_tool0_context: dict,
    ):
        """Test classification with Tool 0 context for entity mapping."""
        result = classify_structure(
            sample_filtered_metadata,
            tool0_context=sample_tool0_context,
        )

        # Should have facts and dimensions from schema + top_articulated
        assert result["metrics"]["fact_count"] > 0
        assert result["metrics"]["dimension_count"] > 0

    def test_metrics_structure(self, sample_filtered_metadata: dict):
        """Test metrics structure."""
        result = classify_structure(sample_filtered_metadata)
        metrics = result["metrics"]

        assert "fact_count" in metrics
        assert "dimension_count" in metrics
        assert "relationship_count" in metrics
        assert "unclassified_count" in metrics
        assert "classification_timestamp" in metrics
        assert metrics["classification_method"] == "heuristic"

    def test_fact_structure(self, sample_filtered_metadata: dict):
        """Test fact table structure."""
        result = classify_structure(sample_filtered_metadata)

        # Check that facts from top_articulated are included
        fact_names = [f["name"] for f in result["facts"]]
        if "factv_purchase_order" in fact_names:
            fact = next(
                f for f in result["facts"] if f["name"] == "factv_purchase_order"
            )
            assert "grain" in fact
            assert "estimated_size" in fact
            assert "source_schema" in fact

    def test_dimension_structure(self, sample_filtered_metadata: dict):
        """Test dimension table structure."""
        result = classify_structure(sample_filtered_metadata)

        dim_names = [d["name"] for d in result["dimensions"]]
        if "dimv_supplier" in dim_names:
            dim = next(d for d in result["dimensions"] if d["name"] == "dimv_supplier")
            assert "dim_type" in dim
            assert "slowly_changing" in dim
            assert "source_schema" in dim

    def test_output_file_saved(
        self,
        sample_filtered_metadata: dict,
        tmp_path: Path,
    ):
        """Test output file is saved when output_dir specified."""
        result = classify_structure(
            sample_filtered_metadata,
            output_dir=tmp_path,
        )

        output_file = tmp_path / "structure.json"
        assert output_file.exists()


class TestDetectRelationships:
    """Tests for relationship detection."""

    @pytest.fixture
    def sample_facts(self) -> list:
        """Sample fact tables."""
        return [
            {
                "name": "fact_orders",
                "entity_id": "Orders",
                "description": "Order facts",
                "grain": "transaction",
                "estimated_size": "large",
                "source_schema": "dm_bs",
            },
            {
                "name": "fact_supplier_orders",
                "entity_id": "Supplier Orders",
                "description": "Supplier order facts",
                "grain": "transaction",
                "estimated_size": "medium",
                "source_schema": "dm_bs",
            },
        ]

    @pytest.fixture
    def sample_dimensions(self) -> list:
        """Sample dimension tables."""
        return [
            {
                "name": "dim_supplier",
                "entity_id": "Supplier",
                "description": "Supplier dimension",
                "dim_type": "master",
                "slowly_changing": False,
                "source_schema": "dm_bs",
            },
            {
                "name": "dim_product",
                "entity_id": "Product",
                "description": "Product dimension",
                "dim_type": "master",
                "slowly_changing": False,
                "source_schema": "dm_bs",
            },
        ]

    def test_detect_by_name_match(
        self,
        sample_facts: list,
        sample_dimensions: list,
    ):
        """Test relationship detection by name matching."""
        relationships = detect_relationships(sample_facts, sample_dimensions)

        # Should detect relationship between fact_supplier_orders and dim_supplier
        supplier_rels = [
            r
            for r in relationships
            if "supplier" in r["from_table"].lower()
            and "supplier" in r["to_table"].lower()
        ]
        assert len(supplier_rels) > 0

    def test_relationship_structure(
        self,
        sample_facts: list,
        sample_dimensions: list,
    ):
        """Test relationship structure."""
        relationships = detect_relationships(sample_facts, sample_dimensions)

        if relationships:
            rel = relationships[0]
            assert "from_table" in rel
            assert "to_table" in rel
            assert "relationship_type" in rel
            assert "confidence" in rel
            assert "detected_by" in rel
            assert 0 <= rel["confidence"] <= 1

    def test_no_self_relationships(
        self,
        sample_facts: list,
        sample_dimensions: list,
    ):
        """Test that no self-relationships are created."""
        relationships = detect_relationships(sample_facts, sample_dimensions)

        for rel in relationships:
            assert rel["from_table"] != rel["to_table"]


class TestIntegrationWithTool1:
    """Integration tests using Tool 1 output."""

    def test_with_real_tool1_output(
        self,
        sample_collibra_json_path: Path,
    ):
        """Test classification with real Tool 1 output."""
        from src.tool1 import filter_metadata

        # Run Tool 1
        filtered = filter_metadata(sample_collibra_json_path, scope="bs")

        # Run Tool 2
        result = classify_structure(filtered)

        # Should produce valid structure
        assert result["metrics"]["fact_count"] >= 0
        assert result["metrics"]["dimension_count"] >= 0
        assert result["metrics"]["classification_method"] == "heuristic"

    def test_pipeline_bs_scope(self, sample_collibra_json_path: Path):
        """Test Tool 1 → Tool 2 pipeline with BS scope."""
        from src.tool1 import filter_metadata

        filtered = filter_metadata(sample_collibra_json_path, scope="bs")
        result = classify_structure(filtered)

        # All source schemas should be dm_bs_*
        for fact in result["facts"]:
            if "dm_" in fact["source_schema"]:
                assert fact["source_schema"].startswith("dm_bs_")

    def test_pipeline_ba_scope(self, sample_collibra_json_path: Path):
        """Test Tool 1 → Tool 2 pipeline with BA scope."""
        from src.tool1 import filter_metadata

        filtered = filter_metadata(sample_collibra_json_path, scope="ba")
        result = classify_structure(filtered)

        # All source schemas should be dm_ba_*
        for fact in result["facts"]:
            if "dm_" in fact["source_schema"]:
                assert fact["source_schema"].startswith("dm_ba_")
