# MCOP API Backend

FastAPI backend for the Metadata Copilot pipeline with REST and WebSocket endpoints.

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Start server (development)
uvicorn src.api.main:app --reload --port 8000

# Or run directly
python -m src.api.main
```

## API Endpoints

### Health & Stats

| Endpoint     | Method | Description    |
| ------------ | ------ | -------------- |
| `/health`    | GET    | Health check   |
| `/api/stats` | GET    | API statistics |

### Pipeline

| Endpoint                            | Method | Description              |
| ----------------------------------- | ------ | ------------------------ |
| `/api/pipeline/run`                 | POST   | Start pipeline execution |
| `/api/pipeline/{session_id}/status` | GET    | Get pipeline status      |
| `/api/pipeline/{session_id}/result` | GET    | Get pipeline result      |
| `/api/diagram/{session_id}`         | GET    | Get Mermaid ER diagram   |

### Metadata

| Endpoint             | Method | Description       |
| -------------------- | ------ | ----------------- |
| `/api/tables`        | GET    | List all tables   |
| `/api/tables/{name}` | GET    | Get table details |
| `/api/schemas`       | GET    | List all schemas  |

### Chat

| Endpoint           | Method    | Description               |
| ------------------ | --------- | ------------------------- |
| `/api/chat`        | POST      | Chat with Explorer (REST) |
| `/ws/{session_id}` | WebSocket | Real-time chat streaming  |

## Usage Examples

### Start Pipeline

```bash
curl -X POST http://localhost:8000/api/pipeline/run \
  -H "Content-Type: application/json" \
  -d '{
    "metadata_path": "data/analysis/ba_bs_datamarts_summary.json",
    "scope": "bs",
    "skip_tool0": true
  }'
```

Response:
```json
{
  "session_id": "abc-123",
  "status": "started",
  "message": "Pipeline started. Poll /api/pipeline/abc-123/status for updates."
}
```

### Check Status

```bash
curl http://localhost:8000/api/pipeline/abc-123/status
```

Response:
```json
{
  "session_id": "abc-123",
  "status": "completed",
  "current_step": "tool3_validated",
  "has_result": true,
  "has_diagram": true,
  "error": null
}
```

### List Tables

```bash
curl http://localhost:8000/api/tables
```

### Get Table Details

```bash
curl http://localhost:8000/api/tables/factv_purchase_order
```

### Chat (REST)

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "content": "List all fact tables",
    "session_id": "my-session"
  }'
```

### WebSocket Chat

Using `wscat`:
```bash
wscat -c ws://localhost:8000/ws/my-session

> {"content": "List all tables"}
< {"type": "user", "content": "List all tables"}
< {"type": "agent_partial", "content": "Here are..."}
< {"type": "agent", "content": "Here are the available tables: ..."}
```

## Environment Variables

```bash
# Required for LLM features
AZURE_OPENAI_ENDPOINT=https://your-endpoint.openai.azure.com/
AZURE_OPENAI_API_KEY=your-key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4

# Or use OpenAI directly
OPENAI_API_KEY=your-key

# Optional
PORT=8000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Docker

### Build

```bash
docker build -t mcop-api .
```

### Run

```bash
docker run -p 8000:8000 --env-file .env mcop-api
```

### Test

```bash
curl http://localhost:8000/health
```

## Testing

```bash
# Run all API tests
pytest tests/test_api.py -v

# Run with coverage
pytest tests/test_api.py --cov=src.api
```

## Development

### Interactive API Docs

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Project Structure

```
src/api/
├── __init__.py      # Package exports
├── main.py          # FastAPI app and endpoints
├── models.py        # Pydantic request/response models
├── sessions.py      # Session management
└── README.md        # This file
```

## Deployment

### Railway

1. Connect GitHub repo
2. Set environment variables in Railway dashboard
3. Railway auto-detects Dockerfile
4. Health check at `/health`

### Vercel (Serverless)

Not recommended for this app due to:
- WebSocket support limitations
- In-memory session storage
- Background task requirements

Use Railway, Render, or Fly.io instead.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      FastAPI Backend                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   REST API  │    │  WebSocket  │    │   Session   │     │
│  │  Endpoints  │    │    Chat     │    │   Manager   │     │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘     │
│         │                  │                   │            │
│         └──────────────────┼───────────────────┘            │
│                            │                                │
│                   ┌────────▼────────┐                       │
│                   │   Orchestrator  │                       │
│                   │  (Tool 0→1→2→3) │                       │
│                   └────────┬────────┘                       │
│                            │                                │
│         ┌──────────────────┼──────────────────┐            │
│         │                  │                  │             │
│    ┌────▼────┐       ┌─────▼─────┐      ┌────▼────┐       │
│    │ Explorer │       │  Mock     │      │ Pipeline│       │
│    │  Agent   │       │ Collibra  │      │  State  │       │
│    └──────────┘       └───────────┘      └─────────┘       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
