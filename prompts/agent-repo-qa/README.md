# Repo QA Agent (Minimal) – How to Use

This folder contains a minimal, project-agnostic setup to test LangSmith Agent Builder (powered by deepagents) against your repository.

## What it does
- Verifies that a JSON file exists and parses correctly
- Verifies that at least one backlog markdown exists and that each begins with a YAML frontmatter block (`---`)
- Produces a short PASS/FAIL summary (≤ 3 sentences)

## Files
- `PROMPT.md` – a concise System Prompt for the agent
- `INPUT.sample.json` – example input payload to pass at runtime (edit `project_root`)
- `CONFIG.sample.json` – minimal config (same keys as INPUT) colocated for convenience

## Inputs
- `project_root` (absolute path to the target repo root)
- `filtered_json_rel` (relative path; default `data/tool1/filtered_dataset.json`)
- `backlog_glob_rel` (relative glob; default `scrum/backlog/*.md`)

## Agent constraints
- Use ONLY filesystem tools: `ls` and `read_file`
- Do NOT read outside `project_root`
- Keep the final answer under 3 sentences

## Using with LangSmith Agent Builder
1. Create a new agent.
2. Paste the contents of `PROMPT.md` as the agent instructions/System Prompt.
3. Ensure the agent has access to filesystem tools (`ls`, `read_file`).
4. Provide runtime inputs using `INPUT.sample.json` (set your absolute `project_root`). Alternatively, copy `CONFIG.sample.json` and adjust paths.
5. Run the agent. Review the short PASS/FAIL summary.

## Using with deepagents (local)
- Model key: set `ANTHROPIC_API_KEY` (or configure your preferred provider)
- Install: `pip install deepagents`
- Build your agent with `create_deep_agent(tools=[...], system_prompt=...)` and only include `ls` and `read_file`.
- Provide the three inputs above at runtime; return a short PASS/FAIL message.

## Next steps (optional)
- Enforce frontmatter keys (id/type/status/priority/updated)
- Emit a JSON summary file under `scrum/artifacts/`
- Add a custom tool for fast YAML parsing
