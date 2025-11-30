"""MCOP FastAPI Application.

Main FastAPI application with REST and WebSocket endpoints.

Run with:
    uvicorn src.api.main:app --reload --port 8000

Endpoints:
    GET  /health              - Health check
    GET  /api/stats           - API statistics
    POST /api/pipeline/run    - Start pipeline
    GET  /api/pipeline/{id}/status - Pipeline status
    GET  /api/pipeline/{id}/result - Pipeline result
    GET  /api/diagram/{id}    - Get Mermaid diagram
    GET  /api/tables          - List tables
    GET  /api/tables/{name}   - Get table details
    GET  /api/schemas         - List schemas
    POST /api/chat            - Chat with explorer (REST)
    WS   /ws/{session_id}     - Chat with explorer (WebSocket)
"""

import asyncio
import os
import uuid
from contextlib import asynccontextmanager
from datetime import datetime
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from src.api.models import (
    ChatRequest,
    ChatResponse,
    DiagramResponse,
    HealthResponse,
    PipelineRequest,
    PipelineResponse,
    PipelineResult,
    PipelineStatus,
    SchemaInfo,
    StatsResponse,
    TableDetails,
    TableSummary,
)
from src.api.sessions import Session, SessionManager

# Load environment variables
load_dotenv()


# =============================================================================
# App Initialization
# =============================================================================

# Global instances
session_manager = SessionManager()
collibra_client = None  # Lazy initialized


def get_collibra_client():
    """Get or create Collibra mock client (lazy loading)."""
    global collibra_client
    if collibra_client is None:
        from src.explorer.mock_client import CollibraAPIMock

        try:
            collibra_client = CollibraAPIMock()
        except FileNotFoundError:
            # Return None if data files not available
            return None
    return collibra_client


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup
    print("🚀 MCOP API starting...")

    # Try to initialize Collibra client
    client = get_collibra_client()
    if client:
        stats = client.get_stats()
        print(
            f"📊 Loaded {stats['total_tables']} tables, {stats['total_columns']} columns"
        )
    else:
        print("⚠️  Collibra data not available - some endpoints will be limited")

    yield

    # Shutdown
    print("👋 MCOP API shutting down...")
    cleaned = session_manager.cleanup_old(max_age_hours=0)  # Cleanup all
    print(f"🧹 Cleaned up {cleaned} sessions")


app = FastAPI(
    title="MCOP API",
    description="Metadata Copilot Pipeline API - REST and WebSocket endpoints for metadata exploration",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React dev
        "http://localhost:5173",  # Vite dev
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        # Add production origins here
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =============================================================================
# Health & Stats Endpoints
# =============================================================================


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint for load balancers and monitoring."""
    return HealthResponse(
        status="healthy",
        version="0.1.0",
        timestamp=datetime.now().isoformat(),
    )


@app.get("/api/stats", response_model=StatsResponse, tags=["Health"])
async def get_stats():
    """Get API statistics including session and table counts."""
    client = get_collibra_client()

    if client:
        client_stats = client.get_stats()
        return StatsResponse(
            active_sessions=session_manager.count(),
            total_tables=client_stats["total_tables"],
            total_columns=client_stats["total_columns"],
            tables_by_type=client_stats["tables_by_type"],
        )
    else:
        return StatsResponse(
            active_sessions=session_manager.count(),
            total_tables=0,
            total_columns=0,
        )


# =============================================================================
# Pipeline Endpoints
# =============================================================================


@app.post("/api/pipeline/run", response_model=PipelineResponse, tags=["Pipeline"])
async def run_pipeline_endpoint(request: PipelineRequest):
    """Start pipeline execution.

    The pipeline runs asynchronously. Use the status endpoint to track progress.

    Args:
        request: Pipeline configuration

    Returns:
        Session ID and status
    """
    # Create session
    session = session_manager.create()
    session.status = "running"

    # Run pipeline in background
    asyncio.create_task(
        _run_pipeline_background(
            session_id=session.id,
            document=request.document,
            metadata_path=request.metadata_path,
            scope=request.scope,
            skip_tool0=request.skip_tool0,
        )
    )

    return PipelineResponse(
        session_id=session.id,
        status="started",
        message=f"Pipeline started. Poll /api/pipeline/{session.id}/status for updates.",
    )


async def _run_pipeline_background(
    session_id: str,
    document: Optional[str],
    metadata_path: str,
    scope: Optional[str],
    skip_tool0: bool,
):
    """Run pipeline in background and update session."""
    from src.orchestrator import run_pipeline

    try:
        # Run pipeline
        result = await run_pipeline(
            metadata_path=metadata_path,
            scope=scope,  # type: ignore
            skip_tool0=skip_tool0,
        )

        # Update session with result
        session_manager.update(
            session_id,
            status="completed",
            pipeline_result=result,
        )

        # Generate diagram if structure available
        if result.get("tool2_output"):
            try:
                diagram = _generate_diagram(result["tool2_output"])
                session_manager.update(session_id, diagram=diagram)
            except Exception:
                pass  # Diagram generation is optional

    except Exception as e:
        session_manager.update(
            session_id,
            status="failed",
            error=str(e),
        )


def _generate_diagram(structure: dict) -> str:
    """Generate Mermaid ER diagram from structure."""
    lines = ["erDiagram"]

    # Add facts
    for fact in structure.get("facts", []):
        name = fact.get("table_id", "unknown").upper()
        lines.append(f"    {name} {{")
        for measure in fact.get("measures", [])[:5]:  # Limit columns
            lines.append(f"        float {measure}")
        lines.append("    }")

    # Add dimensions
    for dim in structure.get("dimensions", []):
        name = dim.get("table_id", "unknown").upper()
        lines.append(f"    {name} {{")
        if dim.get("business_key"):
            lines.append(f"        string {dim['business_key']} PK")
        for attr in dim.get("attributes", [])[:5]:  # Limit columns
            lines.append(f"        string {attr}")
        lines.append("    }")

    # Add relationships
    for rel in structure.get("relationships", []):
        from_t = rel.get("from_table", "").upper()
        to_t = rel.get("to_table", "").upper()
        if from_t and to_t:
            lines.append(f"    {from_t} ||--o{{ {to_t} : references")

    return "\n".join(lines)


@app.get(
    "/api/pipeline/{session_id}/status",
    response_model=PipelineStatus,
    tags=["Pipeline"],
)
async def get_pipeline_status(session_id: str):
    """Get pipeline execution status.

    Args:
        session_id: Session ID from run endpoint

    Returns:
        Current pipeline status
    """
    session = session_manager.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    result = session.pipeline_result or {}
    return PipelineStatus(
        session_id=session_id,
        status=session.status,
        current_step=result.get("current_step"),
        has_result=session.pipeline_result is not None,
        has_diagram=session.diagram is not None,
        error=session.error,
    )


@app.get(
    "/api/pipeline/{session_id}/result",
    response_model=PipelineResult,
    tags=["Pipeline"],
)
async def get_pipeline_result(session_id: str):
    """Get pipeline execution result.

    Args:
        session_id: Session ID from run endpoint

    Returns:
        Full pipeline result with all tool outputs

    Raises:
        404: Session not found
        400: Pipeline not completed
    """
    session = session_manager.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session.status != "completed":
        raise HTTPException(
            status_code=400,
            detail=f"Pipeline status: {session.status}. Wait for completion.",
        )

    result = session.pipeline_result or {}
    return PipelineResult(
        session_id=session_id,
        status=session.status,
        current_step=result.get("current_step", "unknown"),
        tool0_output=result.get("tool0_output"),
        tool1_output=result.get("tool1_output"),
        tool2_output=result.get("tool2_output"),
        tool3_output=result.get("tool3_output"),
        step_timings=result.get("step_timings", []),
        total_duration_seconds=result.get("total_duration_seconds"),
        error=session.error,
    )


@app.get("/api/diagram/{session_id}", response_model=DiagramResponse, tags=["Pipeline"])
async def get_diagram(session_id: str):
    """Get generated Mermaid ER diagram.

    Args:
        session_id: Session ID from run endpoint

    Returns:
        Mermaid diagram code

    Raises:
        404: Session or diagram not found
    """
    session = session_manager.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if not session.diagram:
        raise HTTPException(status_code=404, detail="No diagram available")

    return DiagramResponse(
        diagram=session.diagram,
        format="mermaid",
    )


# =============================================================================
# Table/Schema Endpoints
# =============================================================================


@app.get("/api/tables", response_model=list[TableSummary], tags=["Metadata"])
async def list_tables(schema: Optional[str] = None):
    """List all available tables.

    Args:
        schema: Optional schema name to filter by

    Returns:
        List of table summaries
    """
    client = get_collibra_client()
    if not client:
        raise HTTPException(
            status_code=503,
            detail="Metadata not available. Run pipeline first.",
        )

    tables = client.list_tables(schema=schema)
    return [TableSummary(**t) for t in tables]


@app.get("/api/tables/{table_name}", response_model=TableDetails, tags=["Metadata"])
async def get_table(table_name: str):
    """Get table details.

    Args:
        table_name: Table name (case-insensitive)

    Returns:
        Full table details
    """
    client = get_collibra_client()
    if not client:
        raise HTTPException(
            status_code=503,
            detail="Metadata not available. Run pipeline first.",
        )

    result = client.get_table(table_name)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])

    return TableDetails(**result)


@app.get("/api/schemas", response_model=list[SchemaInfo], tags=["Metadata"])
async def list_schemas():
    """List all schemas with summary info.

    Returns:
        List of schema summaries
    """
    client = get_collibra_client()
    if not client:
        raise HTTPException(
            status_code=503,
            detail="Metadata not available. Run pipeline first.",
        )

    schemas = client.list_schemas()
    return [SchemaInfo(**s) for s in schemas]


# =============================================================================
# Chat Endpoints (REST)
# =============================================================================


@app.post("/api/chat", response_model=ChatResponse, tags=["Chat"])
async def chat_with_explorer(request: ChatRequest):
    """Chat with Explorer Agent (REST version).

    For real-time streaming, use WebSocket endpoint instead.

    Args:
        request: Chat request with message

    Returns:
        Agent response
    """
    client = get_collibra_client()
    if not client:
        raise HTTPException(
            status_code=503,
            detail="Metadata not available. Run pipeline first.",
        )

    # Get or create session
    session_id = request.session_id or str(uuid.uuid4())
    session = session_manager.get_or_create(session_id)

    # Record user message
    session_manager.add_chat_message(session_id, "user", request.content)

    try:
        from src.explorer.agent import ExplorerDeps, create_explorer_agent

        deps = ExplorerDeps(collibra=client, session_id=session_id)
        agent = create_explorer_agent()

        # Run agent
        result = await agent.run(request.content, deps=deps)

        # Record assistant response
        session_manager.add_chat_message(session_id, "assistant", result.output)

        return ChatResponse(
            content=result.output,
            session_id=session_id,
            message_count=len(session.chat_history),
        )

    except Exception as e:
        # Record error
        session_manager.add_chat_message(session_id, "error", str(e))
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")


# =============================================================================
# WebSocket Chat
# =============================================================================


@app.websocket("/ws/{session_id}")
async def websocket_chat(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for real-time chat with Explorer Agent.

    Protocol:
        1. Client sends: {"content": "user message"}
        2. Server sends: {"type": "user", "content": "..."}
        3. Server sends: {"type": "agent_partial", "content": "..."} (multiple)
        4. Server sends: {"type": "agent", "content": "final response"}

    On error:
        Server sends: {"type": "error", "content": "error message"}
    """
    await websocket.accept()

    # Get or create session
    session = session_manager.get_or_create(session_id)
    session.status = "chat"

    # Get Collibra client
    client = get_collibra_client()
    if not client:
        await websocket.send_json(
            {
                "type": "error",
                "content": "Metadata not available. Run pipeline first.",
            }
        )
        await websocket.close()
        return

    try:
        from src.explorer.agent import ExplorerDeps, create_explorer_agent

        deps = ExplorerDeps(collibra=client, session_id=session_id)
        agent = create_explorer_agent()

        while True:
            # Receive message from client
            data = await websocket.receive_json()
            user_message = data.get("content", "")

            if not user_message:
                continue

            # Echo user message
            await websocket.send_json(
                {
                    "type": "user",
                    "content": user_message,
                    "timestamp": datetime.now().isoformat(),
                }
            )

            # Record in session
            session_manager.add_chat_message(session_id, "user", user_message)

            try:
                # Check if streaming is available
                if hasattr(agent, "run_stream"):
                    # Stream response
                    async with agent.run_stream(user_message, deps=deps) as stream:
                        async for chunk in stream.stream_text():
                            await websocket.send_json(
                                {
                                    "type": "agent_partial",
                                    "content": chunk,
                                }
                            )

                        result = await stream.get_data()
                        final_output = (
                            result.output if hasattr(result, "output") else str(result)
                        )
                else:
                    # Non-streaming fallback
                    result = await agent.run(user_message, deps=deps)
                    final_output = result.output

                # Send final response
                await websocket.send_json(
                    {
                        "type": "agent",
                        "content": final_output,
                        "timestamp": datetime.now().isoformat(),
                    }
                )

                # Record in session
                session_manager.add_chat_message(session_id, "assistant", final_output)

            except Exception as e:
                error_msg = f"Agent error: {str(e)}"
                await websocket.send_json(
                    {
                        "type": "error",
                        "content": error_msg,
                        "timestamp": datetime.now().isoformat(),
                    }
                )
                session_manager.add_chat_message(session_id, "error", error_msg)

    except WebSocketDisconnect:
        # Client disconnected - clean exit
        pass
    except Exception as e:
        # Unexpected error
        try:
            await websocket.send_json(
                {
                    "type": "error",
                    "content": f"Connection error: {str(e)}",
                }
            )
        except Exception:
            pass


# =============================================================================
# Main Entry Point
# =============================================================================


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "src.api.main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
    )
