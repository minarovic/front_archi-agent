# Metadata Copilot - AI Agent Guidelines

This document provides guidance for AI agents (Claude, GitHub Copilot, etc.) working on the Metadata Copilot project.

## Project Mission
Build a LangGraph agent that connects business requirements with technical metadata from Collibra, Databricks Unity Catalog, and SAP. Current focus: MVP implementation of Tool 0 (Business Request Parser).

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

### 3. Definition of Done

**General DoD (all stories):**
- [ ] Code reviewed and approved
- [ ] Tests written and passing  
- [ ] Documentation updated

**Skill DoD (when `skill_created: true`):**
- [ ] Skill implementation exists at declared path
- [ ] Valid `SKILL.md` with frontmatter (name, description, version, owner)
- [ ] Skill executed successfully (locally or CI)
- [ ] Output saved to `scrum/artifacts/YYYY-MM-DD_<skill-name>.json`
- [ ] README.md with usage instructions

## LangChain/LangGraph Requirements

### Mandatory Patterns

**1. Structured Output - Always use explicit strategy:**
```python
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy

# ✅ CORRECT
agent = create_agent(
    model="openai:gpt-4o-mini",
    response_format=ToolStrategy(MySchema)
)

# ❌ WRONG - deprecated, will fail validation
agent = create_agent(
    model="openai:gpt-4o-mini",
    response_format=MySchema  # Don't pass schema directly
)
```

**2. Pydantic Models - Always include Field descriptions:**
```python
from pydantic import BaseModel, Field

class MyModel(BaseModel):
    """Model description required."""
    field: str = Field(description="Field description required")
    # ❌ field: str  # Missing description - will trigger warning
```

**3. Imports - Use current LangChain v1 paths:**
```python
# ✅ CORRECT
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy, ProviderStrategy

# ❌ DEPRECATED
from langchain.prebuilt import create_react_agent  # Old path
```

### Validation Workflow
**ALWAYS run before committing LangChain code:**
```bash
python3 .claude/skills/langchain/compliance-checker/check.py --file <path>
# or check entire directory:
python3 .claude/skills/langchain/compliance-checker/check.py --all
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

## Tool 0 Implementation Guide

**Status:** Planned (not yet implemented)  
**Path:** `src/tool0/parser.py`  
**Story:** `scrum/backlog/tool0-business-parser.md`

**Requirements:**
- Parse standardized Markdown business documents
- Return structured JSON using Pydantic schema
- Use `ToolStrategy` for structured output
- Support Czech/English mixed content
- Fallback to `"unknown"` for missing sections
- Return tuple: `(parsed_json, raw_response, prompt)`
- Save samples to `data/tool0_samples/` for regression tests

**Schema Structure:**
```python
class ProjectMetadata(BaseModel):
    project_name: str = Field(description="Project name")
    sponsor: str = Field(description="Sponsor name")
    submitted_at: str = Field(description="Date in ISO 8601 format")
    extra: dict[str, str] = Field(default_factory=dict)

class BusinessRequest(BaseModel):
    """Parsed business request document."""
    project_metadata: ProjectMetadata
    goal: str = Field(default="unknown")
    scope_in: str = Field(default="unknown")
    scope_out: str = Field(default="unknown")
    entities: list[str] = Field(default_factory=list)
    metrics: list[str] = Field(default_factory=list)
    sources: list[str] = Field(default_factory=list)
    constraints: list[str] = Field(default_factory=list)
    deliverables: list[str] = Field(default_factory=list)
```

## Python Environment

- **Version:** Python 3.13
- **Command:** Always use `python3` (not `python`)
- **Dependencies:** pyyaml, pydantic, langchain, langgraph
- **Date handling:** Use `.isoformat()` for JSON serialization

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
- ⏭️ Tool 0 implementation pending

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
- `scrum/backlog/_STORY_TEMPLATE.md` - Story template
- `/memories/scrum-skills-implementation.md` - Implementation notes

**Online:**
- https://docs.langchain.com/mcp (via MCP tool)

## File Structure

```
archi-agent/
├── .github/
│   └── copilot-instructions.md       # GitHub Copilot config
├── .claude/skills/
│   ├── scrum/backlog-validator/      # Validates story frontmatter
│   └── langchain/compliance-checker/ # Validates LangChain code
├── scrum/
│   ├── artifacts/                    # Skill execution logs (auto-generated)
│   └── backlog/
│       ├── _STORY_TEMPLATE.md        # Template (skip in validators)
│       ├── tool0-business-parser.md  # Tool 0 story
│       ├── mcop-mvp-v1-scope.md      # MVP scope
│       └── mcop-project-overview.md  # Project overview
├── docs_langgraph/                   # LangChain/LangGraph docs
│   ├── structured_output.md
│   ├── workflow_agents.md
│   └── rag.md
├── src/                              # Source code (Tool 0-7)
├── data/                             # Samples and test data
└── AGENTS.md                         # This file
```

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
