# Metadata Copilot Backend - GitHub Copilot Instructions

## Project Overview
**Name:** Metadata Copilot (MCOP) Backend
**Purpose:** Python FastAPI backend for metadata orchestration pipeline (Collibra, Databricks, SAP)
**Current Phase:** MVP - Tool 0-3 + Orchestrator implemented, Sprint 2 in progress
**Architecture Strategy:** Progressive evolution from Simplified → Multi-Agent Orchestrator → Pydantic Graph

## Repository Context
**This is the BACKEND repository** after monorepo split (2025-11-30).
**Frontend repository:** https://github.com/minarovic/archi-agent-frontend

**Key Principle:** Backend is the **source of truth** for API contract via `src/api/openapi.json`.

## MCOP Architecture Patterns

### Pattern Selection Guide (2025-11-10)

| Tool          | Current Pattern    | Action                | Reasoning                          | Timeline  |
|---------------|--------------------|-----------------------|------------------------------------|-----------|
| Tool 0        | ✅ Simplified       | Keep                  | Optimal for single-shot parsing    | Done      |
| Tool 1        | Pydantic Graph     | ✅ Keep                | 2 LLM agents + checkpoint benefit  | Document  |
| Tool 2        | Pydantic Graph     | ⚠️ Refactor → Simplified | Lineární flow, graph overkill     | This week |
| Tool 3        | Pydantic Graph     | ⚠️ Refactor → Simplified | Hybrid better as function         | This week |
| MVP Orch.     | ❌ Doesn't exist    | 🆕 Create Simplified   | Basic Tool 0→1→2→3 flow            | Next week |
| Prod. Orch.   | ❌ Doesn't exist    | 📅 Create Multi-Agent  | Error recovery + delegation        | Q1 2026   |
| Adv. Graph    | ❌ Doesn't exist    | 📅 Consider            | Conditional branching + parallel   | Q2 2026+  |

**Reference:** `docs_langgraph/pydantic_analysis/graph_vs_multiagent_mcop.md`

## Architecture Principles

### Skills-Based Documentation
- **Markdown files** = source of truth ("what/why")
- **Skills** = executable automation layer ("how")
- Skills augment documentation without replacing it
- All skill outputs logged to `scrum/artifacts/` for audit trail

### Project Structure
```
archi-agent/ (backend)
├── src/
│   ├── tool0/           # Business Request Parser
│   ├── tool1/           # Collibra Ingestion
│   ├── tool2/           # Taxonomy Classifier
│   ├── tool3/           # Quality Validator
│   ├── tool5/           # ER Diagram Generator
│   ├── orchestrator/    # Pipeline Coordinator
│   └── api/
│       ├── main.py      # FastAPI app
│       └── openapi.json # API contract (auto-generated)
├── tests/               # pytest tests
├── docs_langgraph/      # LangChain/LangGraph reference
├── scrum/               # Scrum artifacts, backlog, sprints
├── requirements.txt
└── README.md
```

## Scrum Story Frontmatter

All stories in `scrum/backlog/*.md` must include:
```yaml
---
id: MCOP-XXX
type: story | epic | task
status: planned | in-progress | done | blocked
priority: must-have | should-have | could-have | wont-have
updated: YYYY-MM-DD
---
```

## Pydantic AI Best Practices (PREFERRED)

### Phase 1: Simplified Pattern (Current)
```python
from openai import OpenAI
from pydantic import BaseModel, Field

class ParsedRequest(BaseModel):
    """Model description."""
    field: str = Field(description="Field description")

client = OpenAI(
    base_url=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY")
)

response = client.chat.completions.create(
    model=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
    response_format={"type": "json_object"},
    messages=[{"role": "user", "content": prompt}]
)

result = ParsedRequest.model_validate_json(response.choices[0].message.content)
```

### Phase 2: Multi-Agent Orchestrator (Q1 2026)
```python
from pydantic_ai import Agent

orchestrator = Agent('gpt-5-mini', instructions='Coordinate MCOP pipeline')

@orchestrator.tool
async def parse_business_request(ctx, document: str) -> dict:
    """Delegate to Tool 0."""
    return await tool0_agent.run(document, usage=ctx.usage)
```

### Phase 3: Pydantic Graph (Q2 2026+)
```python
from pydantic_graph import Graph, BaseNode, GraphRunContext, End

@dataclass
class ValidateQuality(BaseNode[MCOPState]):
    async def run(self, ctx: GraphRunContext[MCOPState]) -> RerunMapping | EnrichSecurity | End:
        if ctx.state.quality_score < 0.7:
            return RerunMapping()
        elif ctx.state.risk_level == "HIGH":
            return EnrichSecurity()
        else:
            return End()
```

## LangChain (LEGACY - Tool 1 maintenance only)

**Only use for Tool 1 existing implementation:**
```python
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy
from langchain_openai import AzureChatOpenAI

AZURE_LLM = AzureChatOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    azure_deployment=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
    api_version="2024-10-21"
)
agent = create_agent(model=AZURE_LLM, response_format=ToolStrategy(MySchema))
```

## Python Environment

**Version:** Python 3.13
**Command:** Use `python3` (not `python`)
**Key Dependencies:** fastapi, uvicorn, pydantic, pydantic-ai, openai, python-dotenv, pytest

## Azure AI Foundry Configuration

**Model:** gpt-5-mini-2025-08-07
**Deployment:** test-gpt-5-mini
**Region:** Sweden Central
**API Version:** 2024-10-21

**Environment variables** (`.env` file, gitignored):
```
AZURE_OPENAI_ENDPOINT=https://minar-mhi2wuzy-swedencentral.cognitiveservices.azure.com/openai/v1/
AZURE_OPENAI_API_KEY=<your-key>
AZURE_OPENAI_DEPLOYMENT_NAME=test-gpt-5-mini
COLLIBRA_API_URL=https://your-instance.collibra.com
COLLIBRA_API_KEY=<your-collibra-key>
```

## API Contract Management

### Generate OpenAPI Schema
**CRITICAL:** Run after any API endpoint change:
```bash
python3 src/api/generate_openapi.py
```

This updates `src/api/openapi.json`, which frontend consumes.

### CI Auto-Commit
`.github/workflows/backend-ci.yml` automatically:
1. Runs tests
2. Generates OpenAPI schema
3. Commits schema changes to main
4. Deploys to Railway

### Versioning
When making breaking API changes:
1. Bump version in `src/api/main.py` (e.g., `v0.2.0`)
2. Tag release: `git tag v0.2.0`
3. Document in `CHANGELOG.md`
4. Notify frontend team

## Testing & Validation

### Run Tests
```bash
# All tests
pytest tests/ -v

# Specific tool
pytest tests/test_tool0.py -v

# With coverage
pytest tests/ --cov=src --cov-report=html
```

**Test Status (Sprint 1):** 265 passing
- 71 Tool tests (Tool 0-3)
- 16 Orchestrator tests
- 118 Explorer Agent tests
- 36 Backend API tests
- 24 Frontend E2E tests (removed after split)

### Validation Workflow
```bash
# 1. Validate backlog structure
python3 .claude/skills/scrum/backlog-validator/validate.py

# 2. Check LangChain compliance
python3 .claude/skills/langchain/compliance-checker/check.py --all

# 3. Generate OpenAPI schema
python3 src/api/generate_openapi.py
```

## Common Pitfalls to Avoid

1. ❌ Don't pass Pydantic schema directly to create_agent
2. ❌ Don't forget Field descriptions in Pydantic models
3. ❌ Don't modify files in `scrum/artifacts/` manually
4. ❌ Don't forget to generate OpenAPI schema after API changes
5. ❌ Don't use bare `try/except` without proper error handling
6. ❌ Don't forget `.isoformat()` for datetime JSON serialization

## Deployment

**Platform:** Railway
**Region:** us-west1
**Auto-Deploy:** On main branch push

**Manual Deploy:**
```bash
railway up
```

## Cross-Repo Workflow

### Backend Developer Makes API Change
1. Modify endpoint in `src/api/main.py`
2. Update tests in `tests/test_api.py`
3. Run: `python3 src/api/generate_openapi.py`
4. Commit: `git add src/api/openapi.json src/api/main.py tests/`
5. Open PR with API changes highlighted
6. After merge, tag release: `git tag v0.2.0`
7. Notify frontend team (GitHub issue or Slack)

### Frontend Consumes API Changes
Frontend runs: `npm run sync-api` to download latest `openapi.json`

## Sprint 2 Focus (Current)

### Stories
1. **MCOP-S2-001:** Tool 5 (ER Diagram Generator) - 5-6h
2. **MCOP-S2-002:** Production Hardening (Auth, Redis, Sentry) - 2-3d
3. **MCOP-S2-003:** Real Collibra API Integration - 3-5d
4. **MCOP-S2-004:** Tool 4 Security Analyzer - 2-3d

### Priority Tasks
- [ ] Tool 5: Move inline ER diagram logic to `src/tool5/`
- [ ] Auth: JWT tokens + rate limiting
- [ ] Redis: Replace in-memory sessions
- [ ] Sentry: Error tracking + performance monitoring

## Documentation References

**Local:**
- `docs_langgraph/structured_output.md` - Tool 0 patterns
- `docs_langgraph/workflow_agents.md` - Orchestrator patterns
- `scrum/sprint_2/README.md` - Current sprint plan
- `scrum/architecture/tool5-er-diagram.md` - Tool 5 architecture

**External:**
- Frontend Repo: https://github.com/minarovic/archi-agent-frontend
- Railway Docs: https://docs.railway.app
- FastAPI Docs: https://fastapi.tiangolo.com

## Contact

**Repository:** https://github.com/minarovic/archi-agent
**Frontend:** https://github.com/minarovic/archi-agent-frontend
**Owner:** @minarovic
