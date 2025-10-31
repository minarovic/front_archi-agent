---
name: subagent-normalizer
description: Normalize Copilot subagent outputs (Markdown or JSON) into a structured JSON artifact for auditing.
version: 1.0.0
owner: data-platform
dependencies: ["python>=3.13"]
trigger_files: ["scrum/artifacts/subagents/**/*", "data/analysis/**/*json", "data/analysis/**/*md"]
---

# subagent-normalizer

Normalizes Subagent results into a canonical JSON structure and writes an auditable artifact to `scrum/artifacts/`.

Outputs a file named `scrum/artifacts/YYYY-MM-DD_subagent-normalized.json`.

## Input formats supported
- Markdown with a section "Metrics JSON" containing a JSON object
- Raw JSON file (already the metrics object)

## Usage

```
python3 .claude/skills/subagent/subagent-normalizer/normalize.py --input <path-to-md-or-json>
```

If `--input` is omitted, the script will try to locate the newest file under `scrum/artifacts/subagents/` or `data/analysis/`.
