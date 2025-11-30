"""MVP Pipeline Orchestrator.

Runs the complete MCOP metadata pipeline:
Tool 0 (optional) → Tool 1 → Tool 2 → Tool 3

For MVP, Tool 0 is optional - can use pre-parsed JSON instead.

Example:
    >>> from src.orchestrator import run_pipeline_sync
    >>> result = run_pipeline_sync(
    ...     metadata_path="data/analysis/ba_bs_datamarts_summary.json",
    ...     scope="bs",
    ... )
    >>> print(f"Quality Score: {result['tool3_output']['quality_score']:.1%}")
"""

import asyncio
import json
from datetime import datetime
from pathlib import Path
from typing import Any, Literal, Optional

from src.orchestrator.state import (
    PipelineState,
    PipelineStep,
    StepTiming,
    create_initial_state,
    finalize_state,
)


def _record_timing(
    state: PipelineState,
    step_name: str,
    start_time: datetime,
) -> StepTiming:
    """Record timing for a step."""
    end_time = datetime.now()
    return {
        "step": step_name,
        "started_at": start_time.isoformat(),
        "completed_at": end_time.isoformat(),
        "duration_seconds": (end_time - start_time).total_seconds(),
    }


async def run_pipeline(
    metadata_path: str = "data/analysis/ba_bs_datamarts_summary.json",
    document_path: Optional[str] = None,
    tool0_json_path: Optional[str] = None,
    scope: Optional[Literal["bs", "ba"]] = None,
    output_dir: str = "data/pipeline_output",
    skip_tool0: bool = True,
) -> PipelineState:
    """Run the MCOP metadata pipeline asynchronously.

    Pipeline flow:
    1. Tool 0: Parse business document → structured JSON (optional)
    2. Tool 1: Filter metadata by scope
    3. Tool 2: Classify structure (FACT/DIMENSION)
    4. Tool 3: Validate quality and generate report

    Args:
        metadata_path: Path to Collibra metadata JSON (required)
        document_path: Path to business request MD (optional, for Tool 0)
        tool0_json_path: Path to pre-parsed Tool 0 JSON (optional)
        scope: Filter scope - "bs", "ba", or None for all
        output_dir: Directory to save outputs
        skip_tool0: If True, skip Tool 0 (default for MVP)

    Returns:
        PipelineState with all tool outputs

    Example:
        >>> state = await run_pipeline(
        ...     metadata_path="data/analysis/ba_bs_datamarts_summary.json",
        ...     scope="bs",
        ... )
        >>> print(state["tool3_output"]["risk_level"])
    """
    # Initialize state
    state = create_initial_state(
        document_path=document_path or "",
        metadata_path=metadata_path,
        scope=scope,
        output_dir=output_dir,
    )

    # Create output directory
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    try:
        # Tool 0: Parse business document (optional)
        if not skip_tool0 and document_path:
            step_start = datetime.now()
            state = await _run_tool0(state, document_path)
            state["step_timings"].append(_record_timing(state, "tool0", step_start))
        elif tool0_json_path:
            # Load pre-parsed Tool 0 output
            step_start = datetime.now()
            with open(tool0_json_path, "r", encoding="utf-8") as f:
                state["tool0_output"] = json.load(f)
            state["current_step"] = PipelineStep.TOOL0_PARSED.value
            state["step_timings"].append(
                _record_timing(state, "tool0_load", step_start)
            )
        else:
            # Skip Tool 0 entirely
            state["current_step"] = PipelineStep.TOOL0_PARSED.value

        # Tool 1: Filter metadata
        step_start = datetime.now()
        state = await _run_tool1(state)
        state["step_timings"].append(_record_timing(state, "tool1", step_start))

        # Tool 2: Classify structure
        step_start = datetime.now()
        state = await _run_tool2(state)
        state["step_timings"].append(_record_timing(state, "tool2", step_start))

        # Tool 3: Validate quality
        step_start = datetime.now()
        state = await _run_tool3(state)
        state["step_timings"].append(_record_timing(state, "tool3", step_start))

        # Save final state
        _save_state(state, output_path)

    except Exception as e:
        state["error"] = str(e)
        state["current_step"] = PipelineStep.FAILED.value

    # Finalize
    state = finalize_state(state)
    return state


async def _run_tool0(
    state: PipelineState,
    document_path: str,
) -> PipelineState:
    """Run Tool 0: Parse business document."""
    from src.tool0.parser import parse_business_request

    # Read document
    with open(document_path, "r", encoding="utf-8") as f:
        document = f.read()

    # Parse (this requires LLM)
    parsed, _raw, _prompt = parse_business_request(document)

    state["tool0_output"] = parsed
    state["current_step"] = PipelineStep.TOOL0_PARSED.value
    return state


async def _run_tool1(state: PipelineState) -> PipelineState:
    """Run Tool 1: Filter metadata by scope."""
    from src.tool1 import filter_metadata

    result = filter_metadata(
        json_path=state["metadata_path"],
        scope=state["scope"],
        output_dir=Path(state["output_dir"]) / "tool1",
    )

    state["tool1_output"] = result
    state["current_step"] = PipelineStep.TOOL1_FILTERED.value
    return state


async def _run_tool2(state: PipelineState) -> PipelineState:
    """Run Tool 2: Classify structure."""
    from src.tool2 import classify_structure

    result = classify_structure(
        filtered_metadata=state["tool1_output"],
        tool0_context=state["tool0_output"],
        output_dir=Path(state["output_dir"]) / "tool2",
    )

    state["tool2_output"] = result
    state["current_step"] = PipelineStep.TOOL2_CLASSIFIED.value
    return state


async def _run_tool3(state: PipelineState) -> PipelineState:
    """Run Tool 3: Validate quality."""
    from src.tool3 import validate_quality

    result = validate_quality(
        structure=state["tool2_output"],
        output_dir=Path(state["output_dir"]) / "tool3",
    )

    state["tool3_output"] = result
    state["current_step"] = PipelineStep.TOOL3_VALIDATED.value
    return state


def _save_state(state: PipelineState, output_path: Path) -> None:
    """Save pipeline state to JSON."""
    state_file = output_path / "pipeline_state.json"
    with open(state_file, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)


def run_pipeline_sync(
    metadata_path: str = "data/analysis/ba_bs_datamarts_summary.json",
    document_path: Optional[str] = None,
    tool0_json_path: Optional[str] = None,
    scope: Optional[Literal["bs", "ba"]] = None,
    output_dir: str = "data/pipeline_output",
    skip_tool0: bool = True,
) -> PipelineState:
    """Synchronous wrapper for run_pipeline.

    Use this when not in an async context.

    Args:
        Same as run_pipeline()

    Returns:
        PipelineState with all tool outputs
    """
    return asyncio.run(
        run_pipeline(
            metadata_path=metadata_path,
            document_path=document_path,
            tool0_json_path=tool0_json_path,
            scope=scope,
            output_dir=output_dir,
            skip_tool0=skip_tool0,
        )
    )


def print_pipeline_summary(state: PipelineState) -> None:
    """Print a human-readable summary of pipeline results."""
    print("\n" + "=" * 80)
    print("MCOP PIPELINE RESULTS")
    print("=" * 80)

    print(f"\n📋 Configuration:")
    print(f"   Metadata: {state['metadata_path']}")
    print(f"   Scope: {state['scope'] or 'all'}")
    print(f"   Output: {state['output_dir']}")

    print(f"\n⏱️  Execution:")
    print(f"   Status: {state['current_step']}")
    if state.get("error"):
        print(f"   ❌ Error: {state['error']}")
    print(f"   Total time: {state.get('total_duration_seconds', 0):.3f}s")

    for timing in state.get("step_timings", []):
        print(f"   - {timing['step']}: {timing['duration_seconds']:.3f}s")

    # Tool 1 summary
    if state.get("tool1_output"):
        t1 = state["tool1_output"]
        print(f"\n📊 Tool 1 (Filter):")
        print(f"   Schemas: {t1['stats']['schemas_count']}")
        print(f"   Views: {t1['stats']['views_count']}")
        print(f"   Assets: {t1['stats']['total_assets']}")

    # Tool 2 summary
    if state.get("tool2_output"):
        t2 = state["tool2_output"]
        print(f"\n🏗️  Tool 2 (Structure):")
        print(f"   Facts: {t2['metrics']['fact_count']}")
        print(f"   Dimensions: {t2['metrics']['dimension_count']}")
        print(f"   Relationships: {t2['metrics']['relationship_count']}")

    # Tool 3 summary
    if state.get("tool3_output"):
        t3 = state["tool3_output"]
        print(f"\n✅ Tool 3 (Quality):")
        print(f"   Risk Level: {t3['risk_level']}")
        print(f"   Quality Score: {t3['quality_score']:.1%}")
        print(f"   Recommendations: {len(t3['recommendations'])}")
        print(f"   Anomalies: {len(t3['anomalies'])}")

        coverage = t3["coverage"]
        print(f"\n   Coverage:")
        print(f"   - Description: {coverage['description_coverage']:.1%}")
        print(f"   - Owner: {coverage['owner_coverage']:.1%}")
        print(f"   - Source: {coverage['source_coverage']:.1%}")

    print("\n" + "=" * 80)


if __name__ == "__main__":
    import sys

    # CLI usage
    if len(sys.argv) < 2:
        print(
            "Usage: python -m src.orchestrator.pipeline <metadata_path> [scope] [output_dir]"
        )
        print("  metadata_path: Path to Collibra JSON (required)")
        print("  scope: 'bs', 'ba', or omit for all")
        print("  output_dir: Output directory (default: data/pipeline_output)")
        sys.exit(1)

    metadata_path = sys.argv[1]
    scope = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2] in ("bs", "ba") else None
    output_dir = sys.argv[3] if len(sys.argv) > 3 else "data/pipeline_output"

    # Run pipeline
    result = run_pipeline_sync(
        metadata_path=metadata_path,
        scope=scope,  # type: ignore
        output_dir=output_dir,
    )

    # Print summary
    print_pipeline_summary(result)
