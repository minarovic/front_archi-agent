# Subagent Normalizer

This skill normalizes Copilot subagent outputs (either Markdown or JSON) into a canonical JSON artifact saved to `scrum/artifacts/`.

## Why
- Subagents return a final message, but teams need durable, auditable artifacts under version control.
- This skill extracts the `Metrics JSON` from a subagent report (or accepts a raw JSON file) and produces a timestamped artifact.

## What it does
- Parses Markdown to find a JSON object in a section titled "Metrics JSON"; if the input is already a JSON file, it loads it directly.
- Validates the presence of expected top-level keys (e.g., `totals`, `counts`, `validation`).
- Writes `scrum/artifacts/YYYY-MM-DD_subagent-normalized.json` with pretty formatting.

## Usage

```bash
python3 .claude/skills/subagent/subagent-normalizer/normalize.py --input <path-to-md-or-json>
```

Omit `--input` to auto-pick the newest file from:
- `scrum/artifacts/subagents/`
- `data/analysis/`

## Notes
- This tool is non-destructive and only writes to `scrum/artifacts/`.
- If parsing fails, it returns a clear error message and a non-zero exit code.
