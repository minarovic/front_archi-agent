"""Pytest configuration and fixtures."""

import json
import os
from pathlib import Path
from typing import Any

import pytest


# Paths
PROJECT_ROOT = Path(__file__).parent.parent
DATA_DIR = PROJECT_ROOT / "data"
ANALYSIS_DIR = DATA_DIR / "analysis"


@pytest.fixture
def project_root() -> Path:
    """Return project root directory."""
    return PROJECT_ROOT


@pytest.fixture
def data_dir() -> Path:
    """Return data directory."""
    return DATA_DIR


@pytest.fixture
def sample_collibra_json_path() -> Path:
    """Return path to sample Collibra JSON export.

    Uses the actual data file for integration-style tests.
    """
    # Try timestamped file first
    timestamped = ANALYSIS_DIR / "ba_bs_datamarts_summary_2025-10-30T23-10-10.json"
    if timestamped.exists():
        return timestamped

    # Fall back to symlink
    symlink = ANALYSIS_DIR / "ba_bs_datamarts_summary.json"
    if symlink.exists():
        return symlink

    pytest.skip("No Collibra JSON export found in data/analysis/")


@pytest.fixture
def sample_collibra_data(sample_collibra_json_path: Path) -> dict[str, Any]:
    """Load sample Collibra JSON data."""
    with open(sample_collibra_json_path, "r", encoding="utf-8") as f:
        return json.load(f)


@pytest.fixture
def minimal_collibra_json(tmp_path: Path) -> Path:
    """Create minimal Collibra JSON for unit tests."""
    data = {
        "totals": {"total_assets_raw": 100, "total_assets_dedup": 95, "schemas": 2},
        "counts": {"by_type": {"Schema": 2, "Database View": 10, "Column": 83}},
        "articulation": {
            "count": 95,
            "mean": 25.5,
            "median": 10.0,
            "min": 0.0,
            "max": 100.0,
            "nonzero_share": 0.4,
        },
        "validation": {
            "has_validation_field": 95,
            "true": 20,
            "false": 75,
            "rate_true": 0.21,
        },
        "schemas_breakdown": {
            "dm_bs_purchase": {
                "total_children": 50,
                "views": 18,
                "dimensions": 11,
                "facts": 7,
                "relations": 0,
                "validated_true": 5,
                "articulation_gt0": 10,
            },
            "dm_ba_purchase": {
                "total_children": 45,
                "views": 20,
                "dimensions": 15,
                "facts": 5,
                "relations": 2,
                "validated_true": 15,
                "articulation_gt0": 20,
            },
        },
        "top_articulated_assets": [
            {
                "displayName": "dm_bs_purchase",
                "id": "test-id-1",
                "typeName": "Schema",
                "schema": None,
                "articulationScore": 100.0,
                "validationResult": True,
            },
            {
                "displayName": "fact_bs_orders",
                "id": "test-id-2",
                "typeName": "Database View",
                "schema": "dm_bs_purchase",
                "articulationScore": 80.0,
                "validationResult": True,
            },
            {
                "displayName": "dm_ba_purchase",
                "id": "test-id-3",
                "typeName": "Schema",
                "schema": None,
                "articulationScore": 100.0,
                "validationResult": True,
            },
            {
                "displayName": "fact_ba_sales",
                "id": "test-id-4",
                "typeName": "Database View",
                "schema": "dm_ba_purchase",
                "articulationScore": 75.0,
                "validationResult": False,
            },
        ],
    }

    json_path = tmp_path / "test_collibra.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f)

    return json_path


@pytest.fixture
def output_dir(tmp_path: Path) -> Path:
    """Create temporary output directory."""
    output = tmp_path / "output"
    output.mkdir(exist_ok=True)
    return output
