"""Tests for MVP Orchestrator."""

from pathlib import Path

import pytest

from src.orchestrator.pipeline import (
    run_pipeline_sync,
    print_pipeline_summary,
)
from src.orchestrator.state import (
    PipelineState,
    PipelineStep,
    create_initial_state,
    update_step,
    finalize_state,
)


class TestPipelineState:
    """Tests for pipeline state management."""

    def test_create_initial_state(self):
        """Test initial state creation."""
        state = create_initial_state(
            document_path="doc.md",
            metadata_path="meta.json",
            scope="bs",
        )

        assert state["document_path"] == "doc.md"
        assert state["metadata_path"] == "meta.json"
        assert state["scope"] == "bs"
        assert state["current_step"] == PipelineStep.INITIALIZED.value
        assert state["error"] is None
        assert state["tool0_output"] is None
        assert state["tool1_output"] is None
        assert state["tool2_output"] is None
        assert state["tool3_output"] is None

    def test_update_step_with_output(self):
        """Test updating state with tool output."""
        state = create_initial_state("doc.md", "meta.json")

        updated = update_step(
            state,
            PipelineStep.TOOL1_FILTERED,
            output={"schemas": [], "stats": {}},
        )

        assert updated["current_step"] == PipelineStep.TOOL1_FILTERED.value
        assert updated["tool1_output"] is not None
        assert updated["tool1_output"]["schemas"] == []

    def test_update_step_with_error(self):
        """Test updating state with error."""
        state = create_initial_state("doc.md", "meta.json")

        updated = update_step(
            state,
            PipelineStep.TOOL1_FILTERED,
            error="File not found",
        )

        assert updated["current_step"] == PipelineStep.FAILED.value
        assert updated["error"] == "File not found"

    def test_finalize_state(self):
        """Test finalizing state with completion info."""
        state = create_initial_state("doc.md", "meta.json")

        finalized = finalize_state(state)

        assert finalized["completed_at"] is not None
        assert finalized["total_duration_seconds"] is not None
        assert finalized["total_duration_seconds"] >= 0


class TestRunPipeline:
    """Tests for pipeline execution."""

    def test_run_pipeline_bs_scope(
        self, sample_collibra_json_path: Path, tmp_path: Path
    ):
        """Test pipeline with BS scope."""
        result = run_pipeline_sync(
            metadata_path=str(sample_collibra_json_path),
            scope="bs",
            output_dir=str(tmp_path),
        )

        assert result["current_step"] == PipelineStep.COMPLETED.value
        assert result["error"] is None
        assert result["tool1_output"] is not None
        assert result["tool2_output"] is not None
        assert result["tool3_output"] is not None

    def test_run_pipeline_ba_scope(
        self, sample_collibra_json_path: Path, tmp_path: Path
    ):
        """Test pipeline with BA scope."""
        result = run_pipeline_sync(
            metadata_path=str(sample_collibra_json_path),
            scope="ba",
            output_dir=str(tmp_path),
        )

        assert result["current_step"] == PipelineStep.COMPLETED.value
        assert result["tool3_output"]["risk_level"] in [
            "LOW",
            "MEDIUM",
            "HIGH",
            "CRITICAL",
        ]

    def test_run_pipeline_all_scope(
        self, sample_collibra_json_path: Path, tmp_path: Path
    ):
        """Test pipeline with all schemas (no scope filter)."""
        result = run_pipeline_sync(
            metadata_path=str(sample_collibra_json_path),
            scope=None,
            output_dir=str(tmp_path),
        )

        assert result["current_step"] == PipelineStep.COMPLETED.value
        # All scope should include both bs and ba schemas
        assert result["tool1_output"]["stats"]["schemas_count"] >= 1

    def test_pipeline_saves_outputs(
        self, sample_collibra_json_path: Path, tmp_path: Path
    ):
        """Test pipeline saves output files."""
        result = run_pipeline_sync(
            metadata_path=str(sample_collibra_json_path),
            scope="bs",
            output_dir=str(tmp_path),
        )

        # Check output files exist
        assert (tmp_path / "pipeline_state.json").exists()
        assert (tmp_path / "tool1" / "filtered_bs.json").exists()
        assert (tmp_path / "tool2" / "structure.json").exists()
        assert (tmp_path / "tool3" / "quality_report.json").exists()

    def test_pipeline_timing(self, sample_collibra_json_path: Path, tmp_path: Path):
        """Test pipeline records timing information."""
        result = run_pipeline_sync(
            metadata_path=str(sample_collibra_json_path),
            scope="bs",
            output_dir=str(tmp_path),
        )

        assert result["started_at"] is not None
        assert result["completed_at"] is not None
        assert result["total_duration_seconds"] is not None
        assert result["total_duration_seconds"] >= 0

        # Should have timing for each step
        assert len(result["step_timings"]) == 3  # tool1, tool2, tool3

    def test_pipeline_with_tool0_json(
        self,
        sample_collibra_json_path: Path,
        tmp_path: Path,
    ):
        """Test pipeline with pre-parsed Tool 0 JSON."""
        # Create a sample Tool 0 JSON
        tool0_json = tmp_path / "tool0_output.json"
        tool0_json.write_text('{"project_name": "Test", "entities": []}')

        result = run_pipeline_sync(
            metadata_path=str(sample_collibra_json_path),
            tool0_json_path=str(tool0_json),
            scope="bs",
            output_dir=str(tmp_path / "output"),
        )

        assert result["current_step"] == PipelineStep.COMPLETED.value
        assert result["tool0_output"] is not None
        assert result["tool0_output"]["project_name"] == "Test"

    def test_pipeline_invalid_metadata_path(self, tmp_path: Path):
        """Test pipeline with invalid metadata path."""
        result = run_pipeline_sync(
            metadata_path="/nonexistent/path.json",
            scope="bs",
            output_dir=str(tmp_path),
        )

        assert result["current_step"] == PipelineStep.FAILED.value
        assert result["error"] is not None


class TestPipelineOutputs:
    """Tests for pipeline output structure."""

    def test_tool1_output_structure(
        self, sample_collibra_json_path: Path, tmp_path: Path
    ):
        """Test Tool 1 output has expected structure."""
        result = run_pipeline_sync(
            metadata_path=str(sample_collibra_json_path),
            scope="bs",
            output_dir=str(tmp_path),
        )

        t1 = result["tool1_output"]
        assert "schemas" in t1
        assert "stats" in t1
        assert "quality" in t1
        assert t1["stats"]["scope"] == "bs"

    def test_tool2_output_structure(
        self, sample_collibra_json_path: Path, tmp_path: Path
    ):
        """Test Tool 2 output has expected structure."""
        result = run_pipeline_sync(
            metadata_path=str(sample_collibra_json_path),
            scope="bs",
            output_dir=str(tmp_path),
        )

        t2 = result["tool2_output"]
        assert "facts" in t2
        assert "dimensions" in t2
        assert "relationships" in t2
        assert "metrics" in t2

    def test_tool3_output_structure(
        self, sample_collibra_json_path: Path, tmp_path: Path
    ):
        """Test Tool 3 output has expected structure."""
        result = run_pipeline_sync(
            metadata_path=str(sample_collibra_json_path),
            scope="bs",
            output_dir=str(tmp_path),
        )

        t3 = result["tool3_output"]
        assert "coverage" in t3
        assert "recommendations" in t3
        assert "anomalies" in t3
        assert "risk_level" in t3
        assert "quality_score" in t3

        # Quality score should be between 0 and 1
        assert 0 <= t3["quality_score"] <= 1


class TestPrintSummary:
    """Tests for summary printing."""

    def test_print_summary_completed(
        self,
        sample_collibra_json_path: Path,
        tmp_path: Path,
        capsys,
    ):
        """Test summary printing for completed pipeline."""
        result = run_pipeline_sync(
            metadata_path=str(sample_collibra_json_path),
            scope="bs",
            output_dir=str(tmp_path),
        )

        print_pipeline_summary(result)
        captured = capsys.readouterr()

        assert "MCOP PIPELINE RESULTS" in captured.out
        assert "completed" in captured.out
        assert "Tool 1 (Filter)" in captured.out
        assert "Tool 2 (Structure)" in captured.out
        assert "Tool 3 (Quality)" in captured.out

    def test_print_summary_failed(self, tmp_path: Path, capsys):
        """Test summary printing for failed pipeline."""
        result = run_pipeline_sync(
            metadata_path="/nonexistent/path.json",
            scope="bs",
            output_dir=str(tmp_path),
        )

        print_pipeline_summary(result)
        captured = capsys.readouterr()

        assert "Error" in captured.out or "failed" in captured.out
