# Metadata Copilot - AI Agent Guidelines

This document provides guidance for AI agents (Claude, GitHub Copilot, etc.) working on the Metadata Copilot project.

## Project Mission
Build a metadata orchestration pipeline that connects business requirements with technical metadata from Collibra, Databricks Unity Catalog, and SAP. Architecture evolves through 3 phases:

- **Phase 1 (MVP - NOW):** Simplified sequential functions (Tool 0→1→2→3→7)
- **Phase 2 (Production - Q1 2026):** Multi-agent orchestrator with error recovery
- **Phase 3 (Advanced - Q2 2026+):** Pydantic Graph state machine with conditional branching

Current focus: Refactoring Tool 2 & 3 to simplified pattern, creating MVP orchestrator.

## Core Principles

### 1. Skills-Based Architecture
- **Documentation (Markdown)** = Source of truth for "what" and "why"
- **Skills (Python scripts)** = Executable automation for "how"
- Skills never replace documentation, only augment it
- All skill outputs must be logged to `scrum/artifacts/` for audit trail

### 2. Scrum Story Structure
Every story in `scrum/backlog/*.md` requires this frontmatter:
```yaml
---
id: MCOP-XXX                                    # Unique identifier
type: story | epic | task                       # Story type
status: planned | in-progress | done | blocked # Current status
priority: must-have | should-have | could-have | wont-have
updated: YYYY-MM-DD                             # Last update date
skill_implementation: "path/to/skill.py" | null # Path to skill or null
skill_status: "ready_to_execute" | "needs_design" | "manual_only"
skill_time_saved: "estimate" | null             # Time saved estimate
skill_created: true | false                     # Implementation flag
---
```

## MCOP Architecture Patterns

### Pattern Selection Guide (2025-11-10)

| Tool        | Current Pattern | Action                  | Reasoning                         | Timeline  |
| ----------- | --------------- | ----------------------- | --------------------------------- | --------- |
| Tool 0      | ✅ Simplified    | Keep                    | Optimal for single-shot parsing   | Done      |
| Tool 1      | Pydantic Graph  | ✅ Keep                  | 2 LLM agents + checkpoint benefit | Document  |
| Tool 2      | Pydantic Graph  | ⚠️ Refactor → Simplified | Lineární flow, graph overkill     | This week |
| Tool 3      | Pydantic Graph  | ⚠️ Refactor → Simplified | Hybrid better as function         | This week |
| MVP Orch.   | ❌ Doesn't exist | 🆕 Create Simplified     | Basic Tool 0→1→2→3 flow           | Next week |
| Prod. Orch. | ❌ Doesn't exist | 📅 Create Multi-Agent    | Error recovery + delegation       | Q1 2026   |
| Adv. Graph  | ❌ Doesn't exist | 📅 Consider              | Conditional branching + parallel  | Q2 2026+  |

### Pydantic AI Patterns (PREFERRED)

**For Phase 2+ (Multi-Agent Orchestrator):**
```python
from pydantic_ai import Agent

orchestrator = Agent('gpt-5-mini', instructions='Coordinate MCOP pipeline')

@orchestrator.tool
async def parse_business_request(ctx, document: str) -> dict:
    """Parse business document using Tool 0."""
    return await tool0_agent.run(document, usage=ctx.usage)

@orchestrator.tool
async def map_entities(ctx, parsed: dict) -> dict:
    """Map entities using Tool 1."""
    return await tool1_agent.run(parsed, usage=ctx.usage)
```

**For Phase 3 (Pydantic Graph State Machine):**
```python
from pydantic_graph import Graph, BaseNode, GraphRunContext, End

@dataclass
class ValidateQuality(BaseNode[MCOPState]):
    async def run(self, ctx: GraphRunContext[MCOPState]) -> RerunMapping | EnrichSecurity | End:
        if ctx.state.quality_score < 0.7:
            return RerunMapping()  # Loop back
        elif ctx.state.risk_level == "HIGH":
            return EnrichSecurity()  # Parallel Tool 4+5+6
        else:
            return End()
```

### LangChain (LEGACY - Tool 1 only)

**Only use for Tool 1 maintenance:**
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
agent = create_agent(
    model=AZURE_LLM,
    response_format=ToolStrategy(MySchema)
)
```

## Available Skills

### Backlog Validator
- **Purpose:** Validates frontmatter in `scrum/backlog/*.md`
- **Run:** `python3 .claude/skills/scrum/backlog-validator/validate.py`
- **Output:** `scrum/artifacts/YYYY-MM-DD_backlog-validation.json`
- **Checks:** Required fields, enum values, skill metadata

### LangChain Compliance Checker
- **Purpose:** Validates Python code against LangChain docs
- **Run:**
  ```bash
  python3 .claude/skills/langchain/compliance-checker/check.py --file src/tool0/parser.py
  python3 .claude/skills/langchain/compliance-checker/check.py --dir src/
  python3 .claude/skills/langchain/compliance-checker/check.py --all
  ```
- **Output:** `scrum/artifacts/YYYY-MM-DD_langchain-compliance.json`
- **Checks:** Imports, API usage, Pydantic models, deprecated patterns

## Code Generation Rules

### Creating New Stories
1. Start from template: `scrum/backlog/_STORY_TEMPLATE.md`
2. Fill all required frontmatter fields
3. Add skill metadata if story has executable component
4. Write clear acceptance criteria with checkboxes
5. Include DoD checklist

### Implementing Skills
1. **Directory structure:**
   ```
   .claude/skills/<category>/<skill-name>/
   ├── SKILL.md          # Metadata frontmatter
   ├── <skill-name>.py   # Implementation
   └── README.md         # Usage docs
   ```

2. **Naming convention:** lowercase-hyphen (e.g., `backlog-validator`)

3. **SKILL.md frontmatter:**
   ```yaml
   ---
   name: skill-name
   description: Action-oriented description
   version: 1.0.0
   owner: team-name
   dependencies: ["pyyaml", "python>=3.13"]
   trigger_files: ["glob/pattern/*.py"]
   ---
   ```

4. **Output location:** Always save to `scrum/artifacts/YYYY-MM-DD_<skill-name>.json`

### Writing LangChain Code
1. **Check docs first:** Reference `docs_langgraph/structured_output.md`
2. **Use explicit strategies:** ToolStrategy or ProviderStrategy, never bare schema
3. **Document Pydantic models:**
   - Class docstring required
   - Field descriptions required
   - Add field_validator for complex validation (e.g., ISO 8601 dates)
4. **Error handling:** No bare `try/except`, always log errors
5. **Run compliance checker:** Before commit

## Current Tool Status (2025-11-10)

**Implemented:**
- ✅ **Tool 0** (Simplified): Direct OpenAI SDK with JSON mode
  - Path: `src/tool0/parser.py`
  - Demo: `notebooks/tool0_parser_demo.ipynb`
  - Pattern: Single-shot parsing (optimal)
- ✅ **Tool 1** (Pydantic Graph): LangChain agents with state management
  - Path: `notebooks/tool1_ingest_demo.ipynb`
  - Pattern: 2 LLM agents + checkpoint (keep as-is)

**Refactoring (This week):**
- ⚠️ **Tool 2** (Pydantic Graph → Simplified): Linear flow doesn't need graph
  - Current: `notebooks/tool2_structure_demo.ipynb`
  - Target: `src/tool2/classifier_simplified.py`
- ⚠️ **Tool 3** (Pydantic Graph → Simplified): Hybrid better as function
  - Current: `notebooks/tool3_hybrid_demo.ipynb`
  - Target: `src/tool3/validator_simplified.py`

**Next Steps:**
- 🆕 **MVP Orchestrator** (Next week): Sequential Tool 0→1→2→3→7 pipeline
  - Target: `src/orchestrator.py`
  - Pattern: Simplified function chaining

**See:** `docs_langgraph/pydantic_analysis/graph_vs_multiagent_mcop.md` for full pattern analysis and decision matrix.

## Python Environment

- **Version:** Python 3.13
- **Command:** Always use `python3` (not `python`)
- **Dependencies:** pyyaml, pydantic, langchain, langgraph, openai, python-dotenv
- **Date handling:** Use `.isoformat()` for JSON serialization

## Azure AI Foundry Configuration

**Model:** gpt-5-mini-2025-08-07
**Deployment:** test-gpt-5-mini
**Region:** Sweden Central
**API Version:** 2024-10-21

**Environment Setup:** `.env` file (gitignored)
```bash
AZURE_OPENAI_ENDPOINT=https://minar-mhi2wuzy-swedencentral.cognitiveservices.azure.com/openai/v1/
AZURE_OPENAI_API_KEY=<your-key>
AZURE_OPENAI_DEPLOYMENT_NAME=test-gpt-5-mini
```

**Usage Patterns:**

### Pattern A: Direct OpenAI SDK (Tool 0)
For simple LLM calls with JSON mode:
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
    messages=[{"role": "user", "content": "..."}],
    response_format={"type": "json_object"}
)
```

### Pattern B: LangChain Agents (Tool 1, Tool 2)
For agent-based workflows with LangGraph:
```python
from langchain_openai import AzureChatOpenAI
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy
from dotenv import load_dotenv

load_dotenv()
AZURE_LLM = AzureChatOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    azure_deployment=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
    api_version="2024-10-21"
)
agent = create_agent(
    model=AZURE_LLM,
    response_format=ToolStrategy(MySchema),
    tools=[],
    system_prompt="..."
)
```

**Model Limitations:**
- Temperature parameter NOT supported (uses default=1)
- Use JSON mode or ToolStrategy for structured output
- Test with `test_azure_model.py` before implementing

## Common Mistakes to Avoid

1. ❌ Passing Pydantic schema directly to `create_agent` (use ToolStrategy wrapper)
2. ❌ Forgetting Field descriptions in Pydantic models
3. ❌ Using deprecated import paths (e.g., `langchain.prebuilt`)
4. ❌ Manually editing files in `scrum/artifacts/` (they're auto-generated)
5. ❌ Not skipping template files starting with `_` in validators
6. ❌ Using `datetime.date()` directly in JSON (convert to `.isoformat()`)
7. ❌ Bare `try/except` without proper error handling

## Pre-Commit Checklist

**For any commit, run:**
```bash
# 1. Validate backlog structure
python3 .claude/skills/scrum/backlog-validator/validate.py

# 2. Check LangChain compliance (if touching Python code)
python3 .claude/skills/langchain/compliance-checker/check.py --all
```

**When updating a story:**
- [ ] Update `updated: YYYY-MM-DD` field
- [ ] Set `skill_created: true` when skill is implemented
- [ ] Change `skill_status` if applicable
- [ ] Run backlog validator

**When adding a skill:**
- [ ] Update story with `skill_implementation` path
- [ ] Create SKILL.md with required frontmatter
- [ ] Test execution, verify output in `scrum/artifacts/`
- [ ] Write README.md with usage examples
- [ ] Update story: `skill_created: true`

## MCP Tools Available

### docsLangchain
- **Tool:** `mcp_docslangchain_SearchDocsByLangChain`
- **Purpose:** Search up-to-date LangChain/LangGraph documentation
- **When to use:** Verify API patterns, check for updates
- **Config:** `.vscode/mcp.json`

## Project Status

### Current (MVP Phase)
- ✅ Skills framework implemented
- ✅ Backlog validator working
- ✅ LangChain compliance checker (Phase 1 - static analysis)
- ✅ Tool 0 implemented with Azure AI Foundry (Pattern A: OpenAI SDK + JSON mode)
- ✅ All notebooks migrated to Azure:
  - tool0_parser_demo.ipynb (Pattern A: OpenAI SDK)
  - tool1_ingest_demo.ipynb (Pattern B: LangChain agents)
  - tool2_structure_demo.ipynb (Pattern B: LangChain agents)
- ✅ **Workshop Presentation Materials (2025-11-07):**
  - TierIndex Foundation Workshop (5 documents)
  - Praktické příklady bez SQL/Python kódu
  - UML diagramy a pseudo-kód approach
  - MCOP jako metadata orchestrator

### Planned (Phase 2)
- 🔮 Online docs sync via MCP tool
- 🔮 API change notifications
- 🔮 Auto-migration guides
- 🔮 CI/CD integration (GitHub Actions)
- 🔮 Tool 1-7 implementation

## Documentation References

**Local:**
- `docs_langgraph/structured_output.md` - Primary reference for Tool 0
- `docs_langgraph/workflow_agents.md` - Agent orchestration
- `docs_langgraph/rag.md` - RAG patterns
- `docs_langgraph/workshop_presentation/` - TierIndex workshop materials (01-05.md)
- `scrum/backlog/_STORY_TEMPLATE.md` - Story template

**Memory:**
- `/memories/azure-ai-foundry-setup.md` - Azure model configuration (2025-11-03)
- `/memories/workshop-terminology-translation.md` - Workshop prep context (2025-11-07)
- `/memories/datamarts-dq-audit-2025-11-03.md` - Collibra metadata quality audit

**Online:**
- https://docs.langchain.com/mcp (via MCP tool)

## Decision Framework

**When to create a Skill:**
- Task repeats more than 3x per month
- Combines multiple data sources
- Needs consistent validation
- Multi-step procedure that's error-prone

**When to keep as documentation:**
- One-time decisions
- Conceptual explanations
- Policy statements
- Strategic discussions

---

**Remember:** Skills augment documentation, they don't replace it. Markdown files are the single source of truth for "what" and "why". Skills provide the "how" through automation.
