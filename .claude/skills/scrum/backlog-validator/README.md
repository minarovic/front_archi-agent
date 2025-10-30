# Backlog Validator

Validuje správnost frontmatter ve všech markdown souborech v `scrum/backlog/`.

## Instalace
```bash
pip install pyyaml
```

## Použití
```bash
# Z root adresáře projektu
python .claude/skills/scrum/backlog-validator/validate.py
```

## Co kontroluje
1. **Validní YAML frontmatter** - začíná/končí `---`
2. **Povinná pole**: `id`, `type`, `status`, `priority`, `updated`
3. **Skill metadata** (doporučené): `skill_implementation`, `skill_status`, `skill_time_saved`, `skill_created`
4. **Validní hodnoty**:
   - `status`: planned | in-progress | done | blocked
   - `skill_status`: ready_to_execute | needs_design | manual_only
   - `type`: story | epic | task
   - `priority`: must-have | should-have | could-have | wont-have

## Výstup
- JSON report v `scrum/artifacts/YYYY-MM-DD_backlog-validation.json`
- Exit code 0 = vše OK, 1 = nalezeny chyby
- Detailní výpis chyb v konzoli

## Příklad výstupu
```
============================================================
Backlog Validation Report
============================================================
Total files:   3
Valid files:   3
Invalid files: 0

Report saved to: scrum/artifacts/2025-10-30_backlog-validation.json
```

Nebo s chybami:
```
============================================================
Backlog Validation Report
============================================================
Total files:   3
Valid files:   2
Invalid files: 1

Report saved to: scrum/artifacts/2025-10-30_backlog-validation.json

============================================================
Errors found:
============================================================

📄 scrum/backlog/example.md
  ❌ Missing required field: id
  ⚠️  Missing skill field: skill_implementation (recommended)
```
