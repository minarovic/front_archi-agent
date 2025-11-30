---
id: MCOP-S1-005
type: story
status: planned
priority: must-have
updated: 2025-11-30
sprint: sprint_1
effort: 8-12 hours
depends_on: [MCOP-S1-002, MCOP-S1-004]
blocks: [MCOP-S1-006]
---

# FastAPI Backend s WebSocket

## Brief
Vytvor FastAPI backend, ktorý exponuje REST API pre MCOP pipeline a WebSocket endpoint pre real-time streaming odpovedí z Explorer Agent-a.

## Business Value
- Frontend môže volať pipeline cez REST
- Real-time streaming odpovedí pre lepší UX
- Session management pre multi-user support
- Základ pre production deployment

## Acceptance Criteria

- [ ] `src/api/__init__.py` existuje
- [ ] `src/api/main.py` obsahuje FastAPI app
- [ ] REST endpoints:
  - [ ] `POST /api/pipeline/run` - Spustí celý pipeline (Tool 0→1→2→3)
  - [ ] `GET /api/pipeline/{session_id}/status` - Status pipeline
  - [ ] `GET /api/pipeline/{session_id}/result` - Výsledok pipeline
  - [ ] `GET /api/diagram/{session_id}` - Vygenerovaný Mermaid diagram
- [ ] WebSocket endpoint:
  - [ ] `WS /ws/{session_id}` - Real-time chat s Explorer Agent
- [ ] In-memory session storage (dict, nie Redis)
- [ ] CORS enabled pre localhost:3000 (React dev)
- [ ] Health check endpoint: `GET /health`
- [ ] Test `tests/test_api.py` prechádza
- [ ] Dockerfile pre Railway deployment

## Technical Notes

### FastAPI Application Structure
```python
# src/api/main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uuid
import asyncio

from src.orchestrator import run_pipeline, PipelineState
from src.explorer.agent import explorer_agent, ExplorerDeps
from src.explorer.mock_client import CollibraAPIMock

app = FastAPI(
    title="MCOP API",
    description="Metadata Copilot Pipeline API",
    version="0.1.0"
)

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session storage (MVP - no Redis)
sessions: dict[str, dict] = {}

# Shared Collibra mock client
collibra_client = CollibraAPIMock()

# --- Models ---

class PipelineRequest(BaseModel):
    """Request to run pipeline."""
    document: str
    options: Optional[dict] = None

class PipelineResponse(BaseModel):
    """Pipeline execution response."""
    session_id: str
    status: str
    message: str

class ChatMessage(BaseModel):
    """WebSocket chat message."""
    type: str  # "user" | "agent" | "tool" | "error"
    content: str
    tool_name: Optional[str] = None

# --- Health Check ---

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "version": "0.1.0"}

# --- Pipeline Endpoints ---

@app.post("/api/pipeline/run", response_model=PipelineResponse)
async def run_pipeline_endpoint(request: PipelineRequest):
    """Start pipeline execution."""
    session_id = str(uuid.uuid4())

    # Initialize session
    sessions[session_id] = {
        "status": "running",
        "result": None,
        "diagram": None,
        "error": None
    }

    # Run pipeline in background
    asyncio.create_task(_run_pipeline_async(session_id, request.document))

    return PipelineResponse(
        session_id=session_id,
        status="started",
        message="Pipeline started. Poll /api/pipeline/{session_id}/status for updates."
    )

async def _run_pipeline_async(session_id: str, document: str):
    """Run pipeline asynchronously."""
    try:
        result = await run_pipeline(document)
        sessions[session_id]["status"] = "completed"
        sessions[session_id]["result"] = result

        # Generate diagram if structure available
        if result.get("structure"):
            from src.tool5.diagram_generator import generate_mermaid_diagram
            sessions[session_id]["diagram"] = generate_mermaid_diagram(result["structure"])
    except Exception as e:
        sessions[session_id]["status"] = "failed"
        sessions[session_id]["error"] = str(e)

@app.get("/api/pipeline/{session_id}/status")
async def get_pipeline_status(session_id: str):
    """Get pipeline execution status."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    return {
        "session_id": session_id,
        "status": session["status"],
        "has_result": session["result"] is not None,
        "has_diagram": session["diagram"] is not None,
        "error": session.get("error")
    }

@app.get("/api/pipeline/{session_id}/result")
async def get_pipeline_result(session_id: str):
    """Get pipeline execution result."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    if session["status"] != "completed":
        raise HTTPException(status_code=400, detail=f"Pipeline status: {session['status']}")

    return session["result"]

@app.get("/api/diagram/{session_id}")
async def get_diagram(session_id: str):
    """Get generated Mermaid ER diagram."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    diagram = sessions[session_id].get("diagram")
    if not diagram:
        raise HTTPException(status_code=404, detail="No diagram available")

    return {"diagram": diagram, "format": "mermaid"}

# --- WebSocket Chat ---

@app.websocket("/ws/{session_id}")
async def websocket_chat(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for Explorer Agent chat."""
    await websocket.accept()

    # Initialize session if not exists
    if session_id not in sessions:
        sessions[session_id] = {"status": "chat", "history": []}

    deps = ExplorerDeps(collibra=collibra_client, session_id=session_id)

    try:
        while True:
            # Receive message from client
            data = await websocket.receive_json()
            user_message = data.get("content", "")

            # Send acknowledgment
            await websocket.send_json({
                "type": "user",
                "content": user_message
            })

            # Run agent with streaming
            try:
                async with explorer_agent.run_stream(user_message, deps=deps) as stream:
                    # Stream partial responses
                    async for chunk in stream.stream_text():
                        await websocket.send_json({
                            "type": "agent_partial",
                            "content": chunk
                        })

                    # Get final result
                    result = await stream.get_data()
                    await websocket.send_json({
                        "type": "agent",
                        "content": result
                    })

            except Exception as e:
                await websocket.send_json({
                    "type": "error",
                    "content": f"Agent error: {str(e)}"
                })

    except WebSocketDisconnect:
        # Clean up on disconnect
        pass

# --- Tables API (for frontend) ---

@app.get("/api/tables")
async def list_tables():
    """List all available tables."""
    return collibra_client.list_tables()

@app.get("/api/tables/{table_name}")
async def get_table(table_name: str):
    """Get table details."""
    result = collibra_client.get_table(table_name)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result
```

### Session Management
```python
# src/api/sessions.py
from typing import Optional
from dataclasses import dataclass, field
from datetime import datetime
import uuid

@dataclass
class Session:
    """Session state for a user interaction."""
    id: str
    created_at: datetime = field(default_factory=datetime.now)
    status: str = "active"
    pipeline_result: Optional[dict] = None
    diagram: Optional[str] = None
    chat_history: list = field(default_factory=list)

class SessionManager:
    """In-memory session manager (MVP - no Redis)."""

    def __init__(self):
        self._sessions: dict[str, Session] = {}

    def create(self) -> Session:
        """Create new session."""
        session_id = str(uuid.uuid4())
        session = Session(id=session_id)
        self._sessions[session_id] = session
        return session

    def get(self, session_id: str) -> Optional[Session]:
        """Get session by ID."""
        return self._sessions.get(session_id)

    def update(self, session_id: str, **kwargs) -> Optional[Session]:
        """Update session fields."""
        session = self._sessions.get(session_id)
        if session:
            for key, value in kwargs.items():
                if hasattr(session, key):
                    setattr(session, key, value)
        return session

    def delete(self, session_id: str) -> bool:
        """Delete session."""
        if session_id in self._sessions:
            del self._sessions[session_id]
            return True
        return False

    def cleanup_old(self, max_age_hours: int = 24):
        """Remove sessions older than max_age_hours."""
        now = datetime.now()
        to_delete = []
        for sid, session in self._sessions.items():
            age = (now - session.created_at).total_seconds() / 3600
            if age > max_age_hours:
                to_delete.append(sid)

        for sid in to_delete:
            del self._sessions[sid]
```

### Dockerfile
```dockerfile
# Dockerfile
FROM python:3.13-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY src/ ./src/
COPY data/ ./data/

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run server
CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Requirements Update
```txt
# Add to requirements.txt
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
websockets>=12.0
python-multipart>=0.0.6
```

## Testing

### Unit Tests
```python
# tests/test_api.py
import pytest
from fastapi.testclient import TestClient
from src.api.main import app

client = TestClient(app)

def test_health_check():
    """Test health endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_list_tables():
    """Test tables listing."""
    response = client.get("/api/tables")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_pipeline_start():
    """Test starting pipeline."""
    response = client.post(
        "/api/pipeline/run",
        json={"document": "# Test\n\n## Cíl\nTest goal"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "session_id" in data
    assert data["status"] == "started"

def test_session_not_found():
    """Test 404 for missing session."""
    response = client.get("/api/pipeline/nonexistent/status")
    assert response.status_code == 404
```

### WebSocket Test
```python
# tests/test_websocket.py
import pytest
from fastapi.testclient import TestClient
from src.api.main import app

def test_websocket_connection():
    """Test WebSocket chat endpoint."""
    client = TestClient(app)

    with client.websocket_connect("/ws/test-session") as websocket:
        # Send message
        websocket.send_json({"content": "List all tables"})

        # Receive acknowledgment
        data = websocket.receive_json()
        assert data["type"] == "user"

        # Should eventually receive agent response
        # (may take time due to LLM call)
```

### Manual Testing
```bash
# Start server
uvicorn src.api.main:app --reload --port 8000

# Test health
curl http://localhost:8000/health

# Test tables
curl http://localhost:8000/api/tables

# Test pipeline (start)
curl -X POST http://localhost:8000/api/pipeline/run \
  -H "Content-Type: application/json" \
  -d '{"document": "# Test Request\n\n## Cíl\nTest pipeline"}'

# Test WebSocket (use wscat or browser)
wscat -c ws://localhost:8000/ws/test-session
```

### Docker Testing
```bash
# Build image
docker build -t mcop-api .

# Run container
docker run -p 8000:8000 --env-file .env mcop-api

# Test
curl http://localhost:8000/health
```

## Deployment Notes

### Railway
1. Connect GitHub repo
2. Set environment variables:
   - `OPENAI_API_BASE`
   - `OPENAI_API_KEY`
   - `OPENAI_API_VERSION`
3. Railway auto-detects Dockerfile
4. Health check at `/health`

### Environment Variables
```bash
# Required
OPENAI_API_BASE=https://your-endpoint.openai.azure.com/
OPENAI_API_KEY=your-key
OPENAI_API_VERSION=2024-10-21

# Optional
CORS_ORIGINS=http://localhost:3000,https://your-frontend.vercel.app
LOG_LEVEL=INFO
```

## Definition of Done
- [ ] Všetky AC splnené
- [ ] REST endpoints fungujú
- [ ] WebSocket chat funguje
- [ ] Session management funguje
- [ ] Unit testy prechádzajú
- [ ] Docker build funguje
- [ ] Deployed na Railway (staging)
- [ ] Code review approved
