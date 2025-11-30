"""Pydantic models for API requests and responses.

These models define the schema for all REST API endpoints.
"""

from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel, Field


# =============================================================================
# Pipeline Models
# =============================================================================


class PipelineRequest(BaseModel):
    """Request to run the MCOP pipeline.

    Example:
        {
            "document": "# Business Request\n\n## Goal\nAnalyze suppliers...",
            "scope": "bs",
            "skip_tool0": false
        }
    """

    document: Optional[str] = Field(
        default=None,
        description="Business document to parse (Markdown format)",
    )
    metadata_path: str = Field(
        default="data/analysis/ba_bs_datamarts_summary.json",
        description="Path to Collibra metadata JSON",
    )
    scope: Optional[str] = Field(
        default=None,
        description="Filter scope: 'bs', 'ba', or null for all",
    )
    skip_tool0: bool = Field(
        default=True,
        description="Skip Tool 0 parsing (use for pre-parsed docs)",
    )


class PipelineResponse(BaseModel):
    """Response after starting pipeline execution.

    Example:
        {
            "session_id": "abc-123",
            "status": "started",
            "message": "Pipeline started. Poll status endpoint for updates."
        }
    """

    session_id: str = Field(description="Session ID for tracking")
    status: str = Field(description="Current status")
    message: str = Field(description="Human-readable message")


class PipelineStatus(BaseModel):
    """Pipeline execution status.

    Example:
        {
            "session_id": "abc-123",
            "status": "completed",
            "current_step": "tool3_validated",
            "has_result": true,
            "has_diagram": true,
            "error": null
        }
    """

    session_id: str
    status: str
    current_step: Optional[str] = None
    has_result: bool = False
    has_diagram: bool = False
    error: Optional[str] = None


class PipelineResult(BaseModel):
    """Full pipeline execution result.

    Contains outputs from all tools and execution metrics.
    """

    session_id: str
    status: str
    current_step: str
    tool0_output: Optional[dict] = None
    tool1_output: Optional[dict] = None
    tool2_output: Optional[dict] = None
    tool3_output: Optional[dict] = None
    step_timings: list[dict] = Field(default_factory=list)
    total_duration_seconds: Optional[float] = None
    error: Optional[str] = None


class DiagramResponse(BaseModel):
    """Mermaid ER diagram response.

    Example:
        {
            "diagram": "erDiagram\n  SUPPLIER ||--o{ ORDER : places",
            "format": "mermaid"
        }
    """

    diagram: str = Field(description="Mermaid diagram code")
    format: str = Field(default="mermaid", description="Diagram format")


# =============================================================================
# Chat/WebSocket Models
# =============================================================================


class ChatMessage(BaseModel):
    """WebSocket chat message.

    Example:
        {
            "type": "user",
            "content": "List all fact tables",
            "timestamp": "2025-11-30T10:30:00Z"
        }
    """

    type: str = Field(
        description="Message type: user, agent, agent_partial, tool, error"
    )
    content: str = Field(description="Message content")
    tool_name: Optional[str] = Field(
        default=None,
        description="Tool name if type is 'tool'",
    )
    timestamp: Optional[str] = Field(
        default=None,
        description="ISO format timestamp",
    )


class ChatRequest(BaseModel):
    """Chat request for REST endpoint (non-WebSocket).

    Example:
        {
            "content": "What tables are in dm_bs_purchase schema?",
            "session_id": "abc-123"
        }
    """

    content: str = Field(description="User message")
    session_id: Optional[str] = Field(
        default=None,
        description="Session ID for context continuity",
    )


class ChatResponse(BaseModel):
    """Chat response from agent.

    Example:
        {
            "content": "The dm_bs_purchase schema contains...",
            "session_id": "abc-123",
            "message_count": 5
        }
    """

    content: str = Field(description="Agent response")
    session_id: str = Field(description="Session ID")
    message_count: int = Field(description="Total messages in session")


# =============================================================================
# Table/Metadata Models
# =============================================================================


class TableSummary(BaseModel):
    """Summary info for a table/view.

    Example:
        {
            "name": "factv_purchase_order",
            "full_name": "Systems>dap_gold_prod>dm_bs_purchase>factv_purchase_order",
            "table_type": "FACT",
            "table_schema": "dm_bs_purchase",
            "column_count": 15,
            "confidence": 0.95
        }
    """

    name: str
    full_name: str
    table_type: str
    table_schema: Optional[str] = Field(default=None, alias="schema")
    description: Optional[str] = None
    column_count: int = 0
    confidence: float = 0.5

    model_config = {"populate_by_name": True}


class TableDetails(BaseModel):
    """Full details for a table.

    Includes columns, measures, relationships, and classification info.
    """

    name: str
    full_name: str
    table_type: str
    table_schema: Optional[str] = Field(default=None, alias="schema")
    description: Optional[str] = None
    business_key: Optional[str] = None
    grain: Optional[str] = None
    measures: list[str] = Field(default_factory=list)
    attributes: list[str] = Field(default_factory=list)
    date_columns: list[str] = Field(default_factory=list)
    columns: list[dict] = Field(default_factory=list)
    confidence: float = 0.5
    rationale: Optional[str] = None

    model_config = {"populate_by_name": True}


class SchemaInfo(BaseModel):
    """Schema summary.

    Example:
        {
            "name": "dm_bs_purchase",
            "total_views": 25,
            "dimensions": 8,
            "facts": 5,
            "relations": 12
        }
    """

    name: str
    total_views: int = 0
    dimensions: int = 0
    facts: int = 0
    relations: int = 0
    validated_count: int = 0


# =============================================================================
# Health/Stats Models
# =============================================================================


class HealthResponse(BaseModel):
    """Health check response.

    Example:
        {
            "status": "healthy",
            "version": "0.1.0",
            "timestamp": "2025-11-30T10:30:00Z"
        }
    """

    status: str = "healthy"
    version: str = "0.1.0"
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())


class StatsResponse(BaseModel):
    """API statistics response.

    Example:
        {
            "active_sessions": 5,
            "total_tables": 45,
            "total_columns": 380
        }
    """

    active_sessions: int = 0
    total_tables: int = 0
    total_columns: int = 0
    tables_by_type: dict[str, int] = Field(default_factory=dict)
