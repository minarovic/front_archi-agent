# Prompts for Subagents + Skills

This folder contains prompt templates and guidance to combine VS Code Copilot Chat subagents with our Skills-inspired workflow.

- Subagents (VS Code Insiders): Use `#runSubagent` in the prompt to run an isolated subagent that returns only the final result.
- Skills (idea-only here): We adopt the filesystem-based knowledge pattern (SKILL.md + scripts), but run validations via local scripts/MCP rather than Claude Code.
- MCP: Subagents can access MCP tools (e.g., docsLangchain) to consult documentation during research.

## Files

- `subagent-skills-templates.md` — ready-to-use Czech prompts for research tasks, validation flow, and MCP-assisted RAG.

## How to use in VS Code

1. Use VS Code Insiders and open Copilot Chat.
2. For research-heavy tasks, add `#runSubagent` in your prompt, e.g.:
   "Proveď rešerši dostupných mechanismů autentizace pro tuto aplikaci #runSubagent …"
3. When the subagent returns a final summary, follow up in the main chat to apply changes or run validations.
4. For deterministic checks, reference our validator scripts or consider wrapping them as MCP tools if you want one-click invocation from subagents.

## Recommended workflow

1) Research (subagent) → 2) Propose changes (main chat) → 3) Validate (Skills-like validators) → 4) Commit

## Optional next step

Expose validators (e.g., backlog validator, LangChain compliance checker) as MCP tools so subagents can invoke them directly.
