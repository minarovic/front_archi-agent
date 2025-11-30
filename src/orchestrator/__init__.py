"""MVP Orchestrator: Pipeline Tool 0 → 1 → 2 → 3.

Run the complete MCOP metadata pipeline from business document to quality report.

Example:
    >>> from src.orchestrator import run_pipeline
    >>> result = await run_pipeline("data/sample_business_request.md", scope="bs")
    >>> print(f"Quality: {result['quality']['risk_level']}")
"""

from src.orchestrator.pipeline import run_pipeline, run_pipeline_sync
from src.orchestrator.state import PipelineState, PipelineStep

__all__ = [
    "run_pipeline",
    "run_pipeline_sync",
    "PipelineState",
    "PipelineStep",
]
