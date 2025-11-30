# Metadata Copilot Backend - AI Agent Guidelines

This document provides guidance for AI agents (Claude, GitHub Copilot, etc.) working on the **MCOP Backend** project.

## Repository Context
**This is the BACKEND repository** after monorepo split (2025-11-30).
**Frontend repository:** https://github.com/minarovic/archi-agent-frontend

## Project Mission
Build a metadata orchestration pipeline (Python FastAPI backend) that connects business requirements with technical metadata from Collibra, Databricks Unity Catalog, and SAP.

## Architecture Evolution

- **Phase 1 (MVP - NOW):** Simplified sequential functions (Tool 0→1→2→3→7)
- **Phase 2 (Production - Q1 2026):** Multi-agent orchestrator with error recovery
- **Phase 3 (Advanced - Q2 2026+):** Pydantic Graph state machine with conditional branching

Current focus: Sprint 2 - Tool 5 implementation, production hardening

## Core Principles

### 1. API Contract as Source of Truth
- Backend generates `src/api/openapi.json` via `generate_openapi.py`
- Frontend consumes this schema via `npm run sync-api`
- **ALWAYS run schema generation after API changes**

### 2. Skills-Based Architecture
- **Documentation (Markdown)** = Source of truth for "what" and "why"
- **Skills (Python scripts)** = Executable automation for "how"
- All skill outputs logged to `scrum/artifacts/`

### 3. Testing First
- Write tests before implementation
- 265 tests passing in Sprint 1
- Target: 90%+ coverage for Tool modules

## MCOP Tool Architecture

| Tool         | Pattern               | Status        | Path                                 |
| ------------ | --------------------- | ------------- | ------------------------------------ |
| Tool 0       | Simplified            | ✅ Done        | `src/tool0/parser.py`                |
| Tool 1       | Pydantic Graph        | ✅ Done        | `notebooks/tool1_ingest_demo.ipynb`  |
| Tool 2       | Simplified (refactor) | ⚠️ In Progress | `src/tool2/classifier_simplified.py` |
| Tool 3       | Simplified (refactor) | ⚠️ In Progress | `src/tool3/validator_simplified.py`  |
| Tool 5       | Simplified            | 📅 Sprint 2    | `src/tool5/diagram_generator.py`     |
| Orchestrator | Simplified            | ✅ Done        | `src/orchestrator/`                  |

## Code Generation Rules

### Creating New Tools
1. **Module structure:**
   ```
   src/tool{N}/
   ├── __init__.py
   ├── {tool_name}.py      # Main logic
   ├── schemas.py          # Pydantic models
   └── README.md           # Usage docs
   ```

2. **Pydantic models:**
   ```python
   from pydantic import BaseModel, Field

   class ToolInput(BaseModel):
       """Input schema description."""
       field: str = Field(description="Field purpose")

   class ToolOutput(BaseModel):
       """Output schema description."""
       result: dict = Field(description="Result structure")
   ```

3. **API endpoint:**
   ```python
   # src/api/main.py
   from src.tool5.diagram_generator import generate_diagram
   from src.tool5.schemas import DiagramRequest, DiagramResponse

   @app.post("/diagram/generate", response_model=DiagramResponse)
   async def generate_er_diagram(request: DiagramRequest):
       """Generate Mermaid ER diagram from taxonomy."""
       result = generate_diagram(request.taxonomy)
       return DiagramResponse(**result)
   ```

4. **Generate schema:**
   ```bash
   python3 src/api/generate_openapi.py
   git add src/api/openapi.json
   ```

### Writing Tests
```python
# tests/test_tool5.py
import pytest
from src.tool5.diagram_generator import generate_diagram
from src.tool5.schemas import DiagramRequest

def test_generate_diagram_basic():
    """Test basic ER diagram generation."""
    request = DiagramRequest(
        taxonomy={
            "gold": [{"name": "Customer", "attributes": ["id", "name"]}]
        }
    )
    result = generate_diagram(request.taxonomy)
    assert "erDiagram" in result["diagram"]
    assert "Customer" in result["diagram"]

@pytest.mark.parametrize("entity_count", [1, 10, 50])
def test_generate_diagram_performance(entity_count):
    """Test diagram generation scales linearly."""
    entities = [{"name": f"Entity{i}", "attributes": ["id"]} for i in range(entity_count)]
    request = DiagramRequest(taxonomy={"gold": entities})

    import time
    start = time.time()
    result = generate_diagram(request.taxonomy)
    duration = time.time() - start

    assert duration < 0.1  # <100ms for 50 entities
    assert len(result["entities"]) == entity_count
```

## Python Environment

**Version:** Python 3.13
**Package Manager:** pip + venv
**Key Dependencies:**
- fastapi>=0.104.0
- uvicorn[standard]>=0.24.0
- pydantic>=2.5.0
- pydantic-ai>=0.0.13
- openai>=1.0.0
- python-dotenv>=1.0.0
- pytest>=7.4.0
- httpx>=0.25.0

## Azure AI Foundry Configuration

**Model:** gpt-5-mini-2025-08-07
**Deployment:** test-gpt-5-mini
**Region:** Sweden Central

**Environment Setup (.env):**
```bash
AZURE_OPENAI_ENDPOINT=https://minar-mhi2wuzy-swedencentral.cognitiveservices.azure.com/openai/v1/
AZURE_OPENAI_API_KEY=<your-key>
AZURE_OPENAI_DEPLOYMENT_NAME=test-gpt-5-mini
COLLIBRA_API_URL=https://your-instance.collibra.com
COLLIBRA_API_KEY=<your-collibra-key>
```

**Usage Pattern (Simplified):**
```python
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(
    base_url=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY")
)

response = client.chat.completions.create(
    model=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
    messages=[{"role": "user", "content": prompt}],
    response_format={"type": "json_object"}
)

result = MySchema.model_validate_json(response.choices[0].message.content)
```

## Pre-Commit Checklist

**For any commit:**
```bash
# 1. Run tests
pytest tests/ -v

# 2. Generate OpenAPI schema (if API changed)
python3 src/api/generate_openapi.py

# 3. Validate backlog (if story changed)
python3 .claude/skills/scrum/backlog-validator/validate.py

# 4. Check LangChain compliance (if using LangChain)
python3 .claude/skills/langchain/compliance-checker/check.py --all
```

## Common Mistakes to Avoid

1. ❌ Forgetting to generate OpenAPI schema after API changes
2. ❌ Not adding Field descriptions to Pydantic models
3. ❌ Bare `try/except` without proper error logging
4. ❌ Hardcoding API URLs (use environment variables)
5. ❌ Skipping tests for new features
6. ❌ Not using `.isoformat()` for datetime JSON serialization

## Deployment

**Platform:** Railway
**Region:** us-west1
**Auto-Deploy:** On main branch push

**Manual Deploy:**
```bash
railway up
```

**Health Check:**
```bash
curl https://archi-agent.railway.app/health
```

## Cross-Repo Workflow

### Backend Developer Makes API Change
1. Modify endpoint in `src/api/main.py`
2. Update Pydantic schemas
3. Write/update tests
4. Run: `python3 src/api/generate_openapi.py`
5. Commit: `git add src/api/openapi.json src/api/main.py tests/`
6. Open PR with "🔄 API Change" label
7. After merge, tag release: `git tag v0.2.0`
8. Create GitHub issue in frontend repo: "API Update: v0.2.0"

### Frontend Consumes API
Frontend runs: `npm run sync-api` to download latest schema.

## Sprint 2 Focus (Current)

### Stories
1. **MCOP-S2-001:** Tool 5 (ER Diagram Generator) - 5-6h
   - Move inline logic to `src/tool5/`
   - Add CLI interface
   - Write 8+ unit tests
   - Update API endpoint

2. **MCOP-S2-002:** Production Hardening - 2-3d
   - JWT authentication
   - Redis session storage
   - Sentry error tracking
   - Rate limiting

3. **MCOP-S2-003:** Real Collibra API - 3-5d
   - Replace mock data
   - Implement pagination
   - Add caching layer

4. **MCOP-S2-004:** Tool 4 Security Analyzer - 2-3d
   - Detect PII/sensitive columns
   - Risk scoring
   - Compliance checks

## Documentation References

**Local:**
- `docs_langgraph/structured_output.md` - Tool 0 patterns
- `docs_langgraph/workflow_agents.md` - Orchestrator patterns
- `scrum/sprint_2/README.md` - Current sprint plan
- `scrum/architecture/tool5-er-diagram.md` - Tool 5 architecture

**External:**
- Frontend Repo: https://github.com/minarovic/archi-agent-frontend
- FastAPI Docs: https://fastapi.tiangolo.com
- Pydantic Docs: https://docs.pydantic.dev
- Railway Docs: https://docs.railway.app

## Decision Framework

**When to create a new Tool (Tool 4-7):**
- Distinct business capability (security, lineage, SAP, versioning)
- Can be tested independently
- Has clear input/output schema
- Takes >30min to execute manually

**When to extend existing Tool:**
- Enhancement to current capability
- Shares same input schema
- Minimal code changes (<100 lines)

---

**Remember:** Backend is the **source of truth** for API contract. Always generate and commit `openapi.json` after API changes.
