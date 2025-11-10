# Metadata Copilot Project - GitHub Copilot Instructions

## Project Overview
**Name:** Metadata Copilot (MCOP)
**Purpose:** Metadata orchestration pipeline connecting business requirements with technical metadata (Collibra, Databricks Unity Catalog, SAP)
**Current Phase:** MVP Refactoring - Simplifying Tool 2 & 3, creating orchestrator
**Architecture Strategy:** Progressive evolution from Simplified → Multi-Agent Orchestrator → Pydantic Graph (see AGENTS.md for full pattern guide)

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

**Reference:** `docs_langgraph/pydantic_analysis/graph_vs_multiagent_mcop.md` for comprehensive analysis, 3 Mermaid diagrams, and decision matrix.

## Architecture Principles

### Skills-Based Documentation
- **Markdown files** = source of truth ("what/why")
- **Skills** = executable automation layer ("how")
- Skills augment documentation without replacing it
- All skill outputs logged to `scrum/artifacts/` for audit trail

### Project Structure
```
archi-agent/
├── .claude/skills/           # Executable skills (Anthropic pattern)
│   ├── scrum/backlog-validator/
│   └── langchain/compliance-checker/
├── scrum/
│   ├── artifacts/            # Audit trail (skill execution outputs)
│   └── backlog/              # Stories with skill metadata
├── docs_langgraph/           # LangChain/LangGraph reference docs
├── src/                      # Source code (Tool 0-7)
└── data/                     # Samples and test data
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

## Definition of Done

### General DoD
- Code reviewed and approved
- Tests written and passing
- Documentation updated

### Skill DoD (when `skill_created: true`)
- Skill implementation exists at path defined in `skill_implementation`
- Skill has valid `SKILL.md` with frontmatter
- Skill executed successfully (locally or CI)
- Output saved to `scrum/artifacts/YYYY-MM-DD_<skill-name>.json`
- README with usage instructions created

## Pydantic AI Best Practices (PREFERRED)

### Phase 1: Simplified Pattern (Current - Tool 0, 2, 3, MVP Orchestrator)
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
            return RerunMapping()  # Loop back to Tool 1
        elif ctx.state.risk_level == "HIGH":
            return EnrichSecurity()  # Parallel Tool 4+5+6
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

**Validation (if modifying Tool 1):**
```bash
python3 .claude/skills/langchain/compliance-checker/check.py --file <path>
```



## Tool 0 (Business Request Parser) Specifics

**Status:** ✅ Implemented (using Azure AI Foundry)
**Implementation Path:** `src/tool0/parser.py`
**Demo Notebook:** `notebooks/tool0_parser_demo.ipynb`
**Key Requirements:**
- Parse standardized Markdown business documents
- Return structured JSON via Pydantic schema
- Use OpenAI SDK with JSON mode (NOT LangChain/ToolStrategy)
- Support Czech/English mixed content
- Fallback to "unknown" for missing sections
- Return tuple: `(parsed_json, raw_response, prompt)`
- Save samples to `data/tool0_samples/` for regression testing

**Schema Fields:**
- `project_metadata` (project_name, sponsor, submitted_at in ISO 8601, extra)
- `goal`, `scope_in`, `scope_out`
- `entities[]`, `metrics[]`, `sources[]`, `constraints[]`, `deliverables[]`

## MCP Tools Available

### docsLangchain (mcp_docslangchain_SearchDocsByLangChain)
**Purpose:** Search LangChain documentation
**When to use:** Need up-to-date LangChain/LangGraph patterns
**Config:** `.vscode/mcp.json`

## Python Environment

**Version:** Python 3.13
**Command:** Use `python3` (not `python`)
**Key Dependencies:** pyyaml, pydantic, langchain, langgraph, openai, python-dotenv

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
```

**Two usage patterns:**

1. **Pattern A (Tool 0):** Direct OpenAI SDK with JSON mode
   ```python
   from openai import OpenAI
   client = OpenAI(
       base_url=os.getenv("AZURE_OPENAI_ENDPOINT"),
       api_key=os.getenv("AZURE_OPENAI_API_KEY")
   )
   response = client.chat.completions.create(
       model=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
       response_format={"type": "json_object"}
   )
   ```

2. **Pattern B (Tool 1, Tool 2):** LangChain agents with AzureChatOpenAI
   ```python
   from langchain_openai import AzureChatOpenAI
   AZURE_LLM = AzureChatOpenAI(
       azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
       api_key=os.getenv("AZURE_OPENAI_API_KEY"),
       azure_deployment=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
       api_version="2024-10-21"
   )
   agent = create_agent(model=AZURE_LLM, ...)
   ```

**Model limitations:**
- Temperature parameter NOT supported (uses default=1)
- Use JSON mode or ToolStrategy for structured output

## Common Pitfalls to Avoid

1. ❌ Don't pass Pydantic schema directly to create_agent
2. ❌ Don't forget Field descriptions in Pydantic models
3. ❌ Don't use deprecated import paths
4. ❌ Don't modify files in `scrum/artifacts/` manually
5. ❌ Don't skip template files (starting with `_`) in validators
6. ❌ Don't forget to convert dates to `.isoformat()` for JSON
7. ❌ Don't use bare `try/except` without proper error handling

## Testing & Validation Workflow

1. **Before Commit:**
   ```bash
   # Validate backlog structure
   python3 .claude/skills/scrum/backlog-validator/validate.py

   # Check LangChain compliance
   python3 .claude/skills/langchain/compliance-checker/check.py --all
   ```

2. **When Updating Story:**
   - Update frontmatter fields (especially `updated` date)
   - Set `skill_created: true` when skill is implemented
   - Change `skill_status` appropriately

3. **When Adding Skill:**
   - Update story frontmatter with `skill_implementation` path
   - Create SKILL.md with required metadata
   - Test execution and verify output in artifacts/
   - Document in README.md

## Future Roadmap

### MVP Phase (Current)
- ✅ Skills framework implemented
- ✅ Backlog validator working
- ✅ LangChain compliance checker (Phase 1)
- ✅ Tool 0 implemented with Azure AI Foundry
- ✅ All notebooks migrated to Azure (tool0, tool1, tool2)
- ✅ Workshop Presentation Materials (2025-11-07):
  - 5 documents: TierIndex foundation, capabilities, architecture, use cases, slides
  - Pseudo-kód a UML diagramy místo SQL/Python
  - MCOP positioned as metadata orchestrator

### Phase 2 (Planned)
- Online docs sync via MCP tool
- API change notifications
- Auto-migration guides
- CI/CD integration (GitHub Actions)
- Tool 1-7 implementation

## Contact & References

**Documentation:**
- Local: `docs_langgraph/*.md`, `docs_langgraph/workshop_presentation/*.md`
- Memory: `/memories/azure-ai-foundry-setup.md`, `/memories/workshop-terminology-translation.md`
- Template: `scrum/backlog/_STORY_TEMPLATE.md`

**Workshop Materials (2025-11-07):**
- `docs_langgraph/workshop_presentation/README.md` - Workshop structure
- `03_tierindex_context.md` - Foundation with practical examples
- `02_capabilities_overview.md` - 4 business capabilities
- `04_architecture_decisions.md` - 5 key decisions
- `05_slide_deck.md` - 15-slide executive presentation
- `01_mapping_verification_use_case.md` - Optional deep dive

**Skills Pattern Reference:**
- Based on Anthropic Skills best practices
- Hybrid documentation/execution model
- Progressive disclosure (keep SKILL.md minimal)
