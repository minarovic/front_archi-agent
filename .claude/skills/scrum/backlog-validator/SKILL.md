---
name: backlog-validator
description: Validates frontmatter structure and required fields in scrum backlog markdown files
version: 1.0.0
owner: scrum-team
dependencies: ["pyyaml", "python>=3.11"]
trigger_files: ["scrum/backlog/*.md"]
---

# Backlog Validator Skill

Validates that all markdown files in `scrum/backlog/` have correct frontmatter structure.

## What it checks
- Valid YAML frontmatter
- Required fields: `id`, `type`, `status`, `priority`, `updated`
- Skill fields: `skill_implementation`, `skill_status`, `skill_time_saved`, `skill_created`
- Valid enum values for `status` (planned | in-progress | done | blocked)
- Valid enum values for `skill_status` (ready_to_execute | needs_design | manual_only)

## Usage
```bash
python .claude/skills/scrum/backlog-validator/validate.py
```

## Output
- JSON report saved to `scrum/artifacts/YYYY-MM-DD_backlog-validation.json`
- Exit code 0 if all valid, 1 if errors found
