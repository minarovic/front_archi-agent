"""Pipeline State Model.

Defines the state that flows through the MCOP pipeline.
Each tool adds its output to the state.
"""

from datetime import datetime
from enum import Enum
from typing import Any, Literal, Optional, TypedDict


class PipelineStep(Enum):
    """Pipeline execution steps."""

    INITIALIZED = "initialized"
    TOOL0_PARSED = "tool0_parsed"
    TOOL1_FILTERED = "tool1_filtered"
    TOOL2_CLASSIFIED = "tool2_classified"
    TOOL3_VALIDATED = "tool3_validated"
    COMPLETED = "completed"
    FAILED = "failed"


class StepTiming(TypedDict):
    """Timing for a single step."""

    step: str
    started_at: str
    completed_at: str
    duration_seconds: float


class PipelineState(TypedDict):
    """Complete pipeline state.

    Accumulates outputs from each tool as the pipeline executes.
    """

    # Configuration
    document_path: str
    metadata_path: str
    scope: Optional[Literal["bs", "ba"]]
    output_dir: str

    # Current status
    current_step: str
    error: Optional[str]

    # Tool outputs (populated as pipeline runs)
    tool0_output: Optional[dict[str, Any]]  # ParsedRequest
    tool1_output: Optional[dict[str, Any]]  # FilteredMetadata
    tool2_output: Optional[dict[str, Any]]  # StructuralClassification
    tool3_output: Optional[dict[str, Any]]  # QualityReport

    # Timing
    started_at: str
    completed_at: Optional[str]
    total_duration_seconds: Optional[float]
    step_timings: list[StepTiming]


def create_initial_state(
    document_path: str,
    metadata_path: str,
    scope: Optional[Literal["bs", "ba"]] = None,
    output_dir: str = "data/pipeline_output",
) -> PipelineState:
    """Create initial pipeline state.

    Args:
        document_path: Path to business request document (MD or JSON)
        metadata_path: Path to Collibra metadata JSON
        scope: Filter scope (bs, ba, or None for all)
        output_dir: Directory for output files

    Returns:
        Initialized PipelineState
    """
    return {
        "document_path": document_path,
        "metadata_path": metadata_path,
        "scope": scope,
        "output_dir": output_dir,
        "current_step": PipelineStep.INITIALIZED.value,
        "error": None,
        "tool0_output": None,
        "tool1_output": None,
        "tool2_output": None,
        "tool3_output": None,
        "started_at": datetime.now().isoformat(),
        "completed_at": None,
        "total_duration_seconds": None,
        "step_timings": [],
    }


def update_step(
    state: PipelineState,
    step: PipelineStep,
    output: Optional[dict[str, Any]] = None,
    error: Optional[str] = None,
) -> PipelineState:
    """Update pipeline state with new step.

    Args:
        state: Current pipeline state
        step: New step to transition to
        output: Tool output (if successful)
        error: Error message (if failed)

    Returns:
        Updated PipelineState (new dict, doesn't mutate input)
    """
    new_state = state.copy()
    new_state["current_step"] = step.value

    if error:
        new_state["error"] = error
        new_state["current_step"] = PipelineStep.FAILED.value

    # Set output based on step
    if output:
        if step == PipelineStep.TOOL0_PARSED:
            new_state["tool0_output"] = output
        elif step == PipelineStep.TOOL1_FILTERED:
            new_state["tool1_output"] = output
        elif step == PipelineStep.TOOL2_CLASSIFIED:
            new_state["tool2_output"] = output
        elif step == PipelineStep.TOOL3_VALIDATED:
            new_state["tool3_output"] = output

    return new_state


def finalize_state(state: PipelineState) -> PipelineState:
    """Finalize pipeline state with completion info.

    Args:
        state: Pipeline state to finalize

    Returns:
        Finalized state with timing info
    """
    new_state = state.copy()
    new_state["completed_at"] = datetime.now().isoformat()

    # Calculate total duration
    start = datetime.fromisoformat(state["started_at"])
    end = datetime.fromisoformat(new_state["completed_at"])
    new_state["total_duration_seconds"] = (end - start).total_seconds()

    if not new_state.get("error"):
        new_state["current_step"] = PipelineStep.COMPLETED.value

    return new_state
