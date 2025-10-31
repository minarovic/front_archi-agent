# Subagent Orchestration (Background) + Skills Handoff

This guide standardizes how to run long-running, context-isolated Copilot subagents in the background and hand off their results to deterministic Skills for validation, archiving, and downstream automation.

## Roles
- Subagent: autonomous research/analysis; returns a single final message.
- Skill(s): deterministic validators/normalizers; produce durable artifacts in `scrum/artifacts/`.

## Flow (10 minutes)
1) Create/identify the task (story) in `scrum/doing/` and ensure frontmatter is complete.
2) Launch the subagent with a prepared prompt (see below) and attach relevant files.
3) When the subagent completes, save its final message as:
   - `scrum/artifacts/subagents/<YYYY-MM-DD>_<task>.md`
   - If the message contains a JSON section, keep the fenced JSON as-is.
4) Normalize and archive via skill:
   ```bash
   python3 .claude/skills/subagent/subagent-normalizer/normalize.py --input scrum/artifacts/subagents/<YYYY-MM-DD>_<task>.md
   ```
   This writes: `scrum/artifacts/YYYY-MM-DD_subagent-normalized.json`.
5) Optionally run additional validators and commit.

## Ready-to-run prompt (paste to Copilot subagent)
```
Analyze the workspace files attached. Produce two sections:
(1) Executive summary — concise bullets with key figures and 3–5 recommendations.
(2) Metrics JSON — a single JSON object containing all computed metrics.

Constraints:
- JSON must be valid, compact, and contain keys: totals, counts, validation, articulation, data_quality, missing_fields, status_specific, per_schema, field_anomalies, top_articulated_assets.
- Use numbers for numeric fields, not strings.
- If you cannot compute a field, set it to null.

Return only the final message with both sections.
```

## Conventions
- Subagent outputs are not modified; Skills produce auditable artifacts.
- Skills never write into `scrum/backlog/` or `scrum/doing/` — only `scrum/artifacts/`.
- Prefer timestamped names to maintain an execution trail.

## Troubleshooting
- If normalization fails with "No JSON block found", ensure the subagent report has a "Metrics JSON" fenced code block.
- You can also run `normalize.py` directly on a JSON file (e.g., from `data/analysis/`).
