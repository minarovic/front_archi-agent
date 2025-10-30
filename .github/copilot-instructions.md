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

   # ✅ CORRECT
   agent = create_agent(
       model="openai:gpt-4o-mini",
       response_format=ToolStrategy(MySchema)
   )

   # ❌ INCORRECT - deprecated
   agent = create_agent(
       model="openai:gpt-4o-mini",
       response_format=MySchema
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

**Status:** Planned (not yet implemented)
**Implementation Path:** `src/tool0/parser.py`
**Key Requirements:**
- Parse standardized Markdown business documents
- Return structured JSON via Pydantic schema
- Use LangChain structured output (ToolStrategy)
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
**Key Dependencies:** pyyaml, pydantic, langchain, langgraph

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
- ⏭️ Tool 0 implementation pending

### Phase 2 (Planned)
- Online docs sync via MCP tool
- API change notifications
- Auto-migration guides
- CI/CD integration (GitHub Actions)
- Tool 1-7 implementation

## Contact & References

**Documentation:**
- Local: `docs_langgraph/*.md`
- Memory: `/memories/scrum-skills-implementation.md`
- Template: `scrum/backlog/_STORY_TEMPLATE.md`

**Skills Pattern Reference:**
- Based on Anthropic Skills best practices
- Hybrid documentation/execution model
- Progressive disclosure (keep SKILL.md minimal)
