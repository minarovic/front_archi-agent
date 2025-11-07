# Metadata Copilot Project - GitHub Copilot Instructions

## Project Overview
**Name:** Metadata Copilot (MCOP)
**Purpose:** LangGraph agent connecting business requirements with technical metadata (Collibra, Databricks Unity Catalog, SAP)
**Current Phase:** MVP - Tool 0 (Business Request Parser)

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
skill_implementation: "path/to/skill.py" | null
skill_status: "ready_to_execute" | "needs_design" | "manual_only"
skill_time_saved: "estimate" | null
skill_created: true | false
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

## LangChain/LangGraph Best Practices

### Required Patterns
1. **Structured Output:** Always use explicit strategy
   ```python
   from langchain.agents import create_agent
   from langchain.agents.structured_output import ToolStrategy
   from langchain_openai import AzureChatOpenAI

   # ✅ CORRECT (Azure AI Foundry)
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

   # ❌ INCORRECT - deprecated (passing schema directly)
   agent = create_agent(
       model=AZURE_LLM,
       response_format=MySchema  # Don't pass schema directly
   )
   ```

2. **Pydantic Models:** Always include Field descriptions
   ```python
   from pydantic import BaseModel, Field

   class MyModel(BaseModel):
       """Model description."""
       field: str = Field(description="Field description")
   ```

3. **Import Paths:** Use current LangChain v1 imports
   ```python
   # ✅ CORRECT
   from langchain.agents import create_agent
   from langchain.agents.structured_output import ToolStrategy, ProviderStrategy

   # ❌ DEPRECATED
   from langchain.prebuilt import create_react_agent
   ```

### Validation Before Commit
Always run compliance checker before committing LangChain code:
```bash
python3 .claude/skills/langchain/compliance-checker/check.py --file <path>
```

## Available Skills

### 1. Backlog Validator
**Purpose:** Validates frontmatter in scrum/backlog/*.md files
**Usage:** `python3 .claude/skills/scrum/backlog-validator/validate.py`
**Output:** `scrum/artifacts/YYYY-MM-DD_backlog-validation.json`

### 2. LangChain Compliance Checker
**Purpose:** Validates Python code against LangChain/LangGraph documentation
**Usage:**
```bash
python3 .claude/skills/langchain/compliance-checker/check.py --file src/tool0/parser.py
python3 .claude/skills/langchain/compliance-checker/check.py --dir src/
python3 .claude/skills/langchain/compliance-checker/check.py --all
```
**Output:** `scrum/artifacts/YYYY-MM-DD_langchain-compliance.json`

## Code Generation Guidelines

### When Creating New Stories
1. Use template: `scrum/backlog/_STORY_TEMPLATE.md`
2. Include all required frontmatter fields
3. Add skill metadata if applicable
4. Define clear acceptance criteria

### When Implementing Skills
1. Create directory: `.claude/skills/<category>/<skill-name>/`
2. Required files:
   - `SKILL.md` - Metadata (name, description, version, owner, dependencies)
   - `<skill-name>.py` - Implementation
   - `README.md` - Usage documentation
3. Follow naming: lowercase-hyphen format
4. Output to: `scrum/artifacts/`

### When Implementing LangChain Code
1. Check `docs_langgraph/` for patterns first
2. Use explicit ToolStrategy/ProviderStrategy
3. Add Field descriptions to all Pydantic models
4. Include docstrings on models and functions
5. Run compliance checker before commit
6. Handle errors appropriately (no bare try/except)

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
