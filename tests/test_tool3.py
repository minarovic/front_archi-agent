"""Tests for Tool 3: Quality Validator."""

from pathlib import Path

import pytest

from src.tool3.validator import (
    validate_quality,
    calculate_coverage,
    detect_anomalies,
    generate_recommendations,
    _calculate_risk_level,
    _calculate_quality_score,
)


class TestCalculateCoverage:
    """Tests for coverage calculation."""

    @pytest.fixture
    def sample_structure(self) -> dict:
        """Create sample structure with mixed coverage."""
        return {
            "facts": [
                {
                    "name": "fact_orders",
                    "entity_id": "Orders",
                    "description": "Order transactions",
                    "source_schema": "dm_bs_purchase",
                },
                {
                    "name": "fact_payments",
                    "entity_id": "Payments",
                    "description": "",  # Missing description
                    "source_schema": "dm_bs_purchase",
                },
            ],
            "dimensions": [
                {
                    "name": "dim_customer",
                    "entity_id": "Customer",
                    "description": "Customer master",
                    "source_schema": "dm_bs_purchase",
                },
                {
                    "name": "dim_product",
                    "entity_id": "Product",
                    "description": "Product catalog",
                    "source_schema": "dm_bs_purchase",
                },
            ],
            "relationships": [],
            "metrics": {},
            "unclassified": [],
        }

    def test_calculate_coverage_basic(self, sample_structure: dict):
        """Test basic coverage calculation."""
        coverage = calculate_coverage(sample_structure)

        assert "description_coverage" in coverage
        assert "owner_coverage" in coverage
        assert "source_coverage" in coverage
        assert "total_entities" in coverage
        assert "timestamp" in coverage

    def test_coverage_values(self, sample_structure: dict):
        """Test coverage values are calculated correctly."""
        coverage = calculate_coverage(sample_structure)

        # 3 out of 4 have descriptions
        assert coverage["description_coverage"] == 0.75

        # All 4 have entity_id (treated as owner)
        assert coverage["owner_coverage"] == 1.0

        # All 4 have source_schema
        assert coverage["source_coverage"] == 1.0

        assert coverage["total_entities"] == 4

    def test_empty_structure(self):
        """Test coverage with empty structure."""
        coverage = calculate_coverage({"facts": [], "dimensions": []})

        assert coverage["description_coverage"] == 0.0
        assert coverage["owner_coverage"] == 0.0
        assert coverage["total_entities"] == 0


class TestDetectAnomalies:
    """Tests for anomaly detection."""

    @pytest.fixture
    def structure_with_orphans(self) -> dict:
        """Structure with orphan entities."""
        return {
            "facts": [
                {"name": "fact_orders", "entity_id": "O1"},
                {"name": "fact_orphan", "entity_id": "O2"},
            ],
            "dimensions": [
                {"name": "dim_customer", "entity_id": "D1"},
            ],
            "relationships": [
                {"from_table": "fact_orders", "to_table": "dim_customer"},
            ],
            "unclassified": ["unknown_table_1", "unknown_table_2"],
        }

    def test_detect_orphan_entities(self, structure_with_orphans: dict):
        """Test detection of orphan fact tables."""
        coverage = calculate_coverage(structure_with_orphans)
        anomalies = detect_anomalies(structure_with_orphans, coverage)

        orphan_anomalies = [
            a for a in anomalies if a["anomaly_type"] == "orphan_entity"
        ]
        assert len(orphan_anomalies) >= 1
        assert any(a["entity"] == "fact_orphan" for a in orphan_anomalies)

    def test_detect_unclassified(self, structure_with_orphans: dict):
        """Test detection of unclassified tables."""
        coverage = calculate_coverage(structure_with_orphans)
        anomalies = detect_anomalies(structure_with_orphans, coverage)

        suspicious = [a for a in anomalies if a["anomaly_type"] == "suspicious_pattern"]
        assert len(suspicious) >= 1

    def test_anomaly_structure(self, structure_with_orphans: dict):
        """Test anomaly note structure."""
        coverage = calculate_coverage(structure_with_orphans)
        anomalies = detect_anomalies(structure_with_orphans, coverage)

        if anomalies:
            anomaly = anomalies[0]
            assert "entity" in anomaly
            assert "anomaly_type" in anomaly
            assert "severity" in anomaly
            assert "details" in anomaly


class TestGenerateRecommendations:
    """Tests for recommendation generation."""

    @pytest.fixture
    def low_coverage(self) -> dict:
        """Coverage metrics with low values."""
        return {
            "description_coverage": 0.2,
            "owner_coverage": 0.3,
            "source_coverage": 0.5,
            "validation_coverage": 0.8,
            "articulation_coverage": 0.6,
            "total_entities": 20,
            "timestamp": "2025-11-30T00:00:00",
        }

    @pytest.fixture
    def good_coverage(self) -> dict:
        """Coverage metrics with good values."""
        return {
            "description_coverage": 0.9,
            "owner_coverage": 0.85,
            "source_coverage": 0.95,
            "validation_coverage": 0.9,
            "articulation_coverage": 0.8,
            "total_entities": 20,
            "timestamp": "2025-11-30T00:00:00",
        }

    def test_generate_p0_for_low_coverage(self, low_coverage: dict):
        """Test P0 recommendations for critical coverage gaps."""
        recommendations = generate_recommendations(
            low_coverage,
            [],
            {"facts": [], "dimensions": [], "relationships": []},
        )

        p0_recs = [r for r in recommendations if r["priority"] == "P0"]
        assert len(p0_recs) >= 1
        assert any(
            "description" in r["category"].lower()
            or "documentation" in r["category"].lower()
            for r in p0_recs
        )

    def test_recommendations_sorted_by_priority(self, low_coverage: dict):
        """Test recommendations are sorted P0 -> P1 -> P2."""
        recommendations = generate_recommendations(
            low_coverage,
            [],
            {"facts": [], "dimensions": [], "relationships": []},
        )

        if len(recommendations) > 1:
            priority_order = {"P0": 0, "P1": 1, "P2": 2}
            for i in range(len(recommendations) - 1):
                current = priority_order.get(recommendations[i]["priority"], 99)
                next_rec = priority_order.get(recommendations[i + 1]["priority"], 99)
                assert current <= next_rec

    def test_fewer_recommendations_for_good_coverage(
        self,
        low_coverage: dict,
        good_coverage: dict,
    ):
        """Test fewer recommendations for good coverage."""
        low_recs = generate_recommendations(
            low_coverage,
            [],
            {"facts": [], "dimensions": [], "relationships": []},
        )
        good_recs = generate_recommendations(
            good_coverage,
            [],
            {"facts": [], "dimensions": [], "relationships": []},
        )

        assert len(good_recs) <= len(low_recs)


class TestRiskLevel:
    """Tests for risk level calculation."""

    def test_critical_risk_low_coverage(self):
        """Test CRITICAL risk for very low coverage."""
        coverage = {
            "description_coverage": 0.1,
            "owner_coverage": 0.2,
            "source_coverage": 0.1,
            "validation_coverage": 0.5,
            "articulation_coverage": 0.3,
            "total_entities": 10,
            "timestamp": "2025-11-30T00:00:00",
        }
        risk = _calculate_risk_level(coverage, [])
        assert risk == "CRITICAL"

    def test_low_risk_good_coverage(self):
        """Test LOW risk for good coverage."""
        coverage = {
            "description_coverage": 0.9,
            "owner_coverage": 0.85,
            "source_coverage": 0.9,
            "validation_coverage": 0.95,
            "articulation_coverage": 0.8,
            "total_entities": 10,
            "timestamp": "2025-11-30T00:00:00",
        }
        risk = _calculate_risk_level(coverage, [])
        assert risk == "LOW"

    def test_high_risk_with_anomalies(self):
        """Test HIGH risk with high-severity anomalies."""
        coverage = {
            "description_coverage": 0.6,
            "owner_coverage": 0.6,
            "source_coverage": 0.6,
            "validation_coverage": 0.8,
            "articulation_coverage": 0.7,
            "total_entities": 10,
            "timestamp": "2025-11-30T00:00:00",
        }
        anomalies = [
            {
                "entity": "X",
                "anomaly_type": "missing_owner",
                "severity": "high",
                "details": "...",
            },
        ]
        risk = _calculate_risk_level(coverage, anomalies)
        assert risk == "HIGH"


class TestQualityScore:
    """Tests for quality score calculation."""

    def test_score_range(self):
        """Test quality score is between 0 and 1."""
        coverage = {
            "description_coverage": 0.5,
            "owner_coverage": 0.5,
            "source_coverage": 0.5,
            "validation_coverage": 0.5,
            "articulation_coverage": 0.5,
            "total_entities": 10,
            "timestamp": "2025-11-30T00:00:00",
        }
        score = _calculate_quality_score(coverage, [])
        assert 0.0 <= score <= 1.0

    def test_perfect_score(self):
        """Test perfect coverage gives high score."""
        coverage = {
            "description_coverage": 1.0,
            "owner_coverage": 1.0,
            "source_coverage": 1.0,
            "validation_coverage": 1.0,
            "articulation_coverage": 1.0,
            "total_entities": 10,
            "timestamp": "2025-11-30T00:00:00",
        }
        score = _calculate_quality_score(coverage, [])
        assert score >= 0.9

    def test_anomaly_penalty(self):
        """Test anomalies reduce quality score."""
        coverage = {
            "description_coverage": 0.8,
            "owner_coverage": 0.8,
            "source_coverage": 0.8,
            "validation_coverage": 0.8,
            "articulation_coverage": 0.8,
            "total_entities": 10,
            "timestamp": "2025-11-30T00:00:00",
        }
        anomalies = [
            {
                "entity": "X",
                "anomaly_type": "orphan_entity",
                "severity": "medium",
                "details": "...",
            },
            {
                "entity": "Y",
                "anomaly_type": "missing_owner",
                "severity": "high",
                "details": "...",
            },
        ]
        score_clean = _calculate_quality_score(coverage, [])
        score_with_anomalies = _calculate_quality_score(coverage, anomalies)

        assert score_with_anomalies < score_clean


class TestValidateQuality:
    """Tests for full quality validation."""

    @pytest.fixture
    def sample_structure(self) -> dict:
        """Create sample structure for testing."""
        return {
            "facts": [
                {
                    "name": "fact_orders",
                    "entity_id": "Orders",
                    "description": "Order transactions",
                    "source_schema": "dm_bs_purchase",
                    "grain": "transaction",
                    "estimated_size": "large",
                },
            ],
            "dimensions": [
                {
                    "name": "dim_customer",
                    "entity_id": "Customer",
                    "description": "Customer master",
                    "source_schema": "dm_bs_purchase",
                    "dim_type": "master",
                    "slowly_changing": False,
                },
            ],
            "relationships": [
                {
                    "from_table": "fact_orders",
                    "to_table": "dim_customer",
                    "relationship_type": "one-to-many",
                    "confidence": 0.8,
                },
            ],
            "metrics": {
                "fact_count": 1,
                "dimension_count": 1,
                "relationship_count": 1,
            },
            "unclassified": [],
        }

    def test_validate_returns_report(self, sample_structure: dict):
        """Test validate_quality returns complete report."""
        report = validate_quality(sample_structure)

        assert "coverage" in report
        assert "recommendations" in report
        assert "anomalies" in report
        assert "risk_level" in report
        assert "quality_score" in report
        assert "execution_time_seconds" in report
        assert report["mode"] == "deterministic"

    def test_validate_saves_output(self, sample_structure: dict, tmp_path: Path):
        """Test output file is saved when output_dir specified."""
        report = validate_quality(sample_structure, output_dir=tmp_path)

        output_file = tmp_path / "quality_report.json"
        assert output_file.exists()

    def test_validate_fast_execution(self, sample_structure: dict):
        """Test deterministic mode is fast."""
        report = validate_quality(sample_structure)

        # Should complete in under 1 second
        assert report["execution_time_seconds"] < 1.0


class TestPipelineIntegration:
    """Integration tests with Tool 1 and Tool 2."""

    def test_full_pipeline(self, sample_collibra_json_path: Path):
        """Test Tool 1 → Tool 2 → Tool 3 pipeline."""
        from src.tool1 import filter_metadata
        from src.tool2 import classify_structure

        # Tool 1
        filtered = filter_metadata(sample_collibra_json_path, scope="bs")

        # Tool 2
        structure = classify_structure(filtered)

        # Tool 3
        report = validate_quality(structure)

        # Verify complete report
        assert report["coverage"]["total_entities"] >= 0
        assert report["risk_level"] in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
        assert 0.0 <= report["quality_score"] <= 1.0

    def test_pipeline_ba_scope(self, sample_collibra_json_path: Path):
        """Test pipeline with BA scope."""
        from src.tool1 import filter_metadata
        from src.tool2 import classify_structure

        filtered = filter_metadata(sample_collibra_json_path, scope="ba")
        structure = classify_structure(filtered)
        report = validate_quality(structure)

        assert report["mode"] == "deterministic"
