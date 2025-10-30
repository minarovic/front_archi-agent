---
name: langchain-compliance-checker
description: Validates Python code compliance with LangChain/LangGraph documentation patterns
version: 1.0.0
owner: architecture-team
dependencies: ["pyyaml", "python>=3.11"]
trigger_files: ["src/**/*.py", "docs_langgraph/**/*.md"]
phase: "mvp"
future_enhancements:
  - "Online docs sync via MCP tool"
  - "API change notifications"
  - "Automatic update recommendations"
---

# LangChain Compliance Checker Skill

Validates that Python code using LangChain/LangGraph APIs follows documented patterns from `docs_langgraph/*.md`.

## What it checks (Phase 1 - MVP)

### 1. Import Statements
- Correct import paths (e.g., `from langchain.agents import create_agent`)
- No deprecated imports
- Missing required imports

### 2. Function Calls & API Usage
- Correct parameter names and types
- Required vs optional parameters
- Structured output patterns (`ToolStrategy`, `ProviderStrategy`)

### 3. Pydantic Models
- Field descriptions present
- Type hints correct
- Field validators usage

### 4. Best Practices
- Explicit strategy usage (not just passing schema directly)
- Error handling patterns
- Response format patterns

## Usage
```bash
# Check specific file
python .claude/skills/langchain/compliance-checker/check.py --file src/tool0/parser.py

# Check entire directory
python .claude/skills/langchain/compliance-checker/check.py --dir src/

# Check all Python files
python .claude/skills/langchain/compliance-checker/check.py --all
```

## Output
- JSON report saved to `scrum/artifacts/YYYY-MM-DD_langchain-compliance.json`
- Exit code 0 if compliant, 1 if issues found
- Console output with file-by-file details

## Future (Phase 2)
- Integration with `mcp_docslangchain_SearchDocsByLangChain`
- Automatic sync with online docs
- Notification on LangChain API changes
- Auto-generated migration guides
