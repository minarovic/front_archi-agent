# LangChain Compliance Checker

Kontroluje, že Python kód používající LangChain/LangGraph API odpovídá dokumentovaným vzorům z `docs_langgraph/*.md`.

## Instalace
```bash
pip install pyyaml
```

## Použití

### Kontrola konkrétního souboru
```bash
python .claude/skills/langchain/compliance-checker/check.py --file src/tool0/parser.py
```

### Kontrola celého adresáře
```bash
python .claude/skills/langchain/compliance-checker/check.py --dir src/tool0/
```

### Kontrola všech Python souborů v src/
```bash
python .claude/skills/langchain/compliance-checker/check.py --all
```

## Co kontroluje (Fáze 1 - MVP)

### 1. Import Statements
- ✅ Správné import cesty
- ❌ Deprecated importy
- ⚠️ Neověřené importy

### 2. API Usage Patterns
- ✅ `ToolStrategy()` / `ProviderStrategy()` explicitně
- ❌ Přímé předání schema bez wrapperu
- ⚠️ Deprecated patterns z dokumentace

### 3. Pydantic Models
- ⚠️ Chybějící docstring u modelu
- ⚠️ Chybějící `Field(description=...)` u fieldu
- ✅ Správné type hints

### 4. create_agent Usage
- ❌ `response_format` bez ToolStrategy/ProviderStrategy
- ✅ Správné použití parametrů

## Výstup

### JSON Report
Uložen do `scrum/artifacts/YYYY-MM-DD_langchain-compliance.json`:
```json
{
  "timestamp": "2025-10-30T...",
  "phase": "mvp",
  "total_files": 2,
  "compliant_files": 1,
  "non_compliant_files": 1,
  "total_issues": 3,
  "errors": 1,
  "warnings": 2,
  "results": [...]
}
```

### Console Output
```
============================================================
LangChain Compliance Report
============================================================
Total files:       2
Compliant files:   1
Non-compliant:     1

Total issues:      3
  Errors:          1
  Warnings:        2

Report saved to: scrum/artifacts/2025-10-30_langchain-compliance.json

============================================================
Issues found:
============================================================

📄 src/tool0/parser.py
  ❌ Line 42: response_format should use ToolStrategy() or ProviderStrategy()
     💡 Wrap schema in ToolStrategy(schema) or ProviderStrategy(schema)
     📚 docs_langgraph/structured_output.md
  ⚠️ Line 15: Field 'goal' in model 'BusinessRequest' missing description
     💡 Add Field(..., description='...')
     📚 docs_langgraph/structured_output.md
```

## Exit Codes
- `0` - Žádné chyby (warnings jsou OK)
- `1` - Nalezeny errors

## Fáze 2 (Budoucnost)

### Online Docs Sync
```python
# Bude používat mcp_docslangchain_SearchDocsByLangChain
# Pro pravidelný sync s online dokumentací
python check.py --sync-docs
```

### API Change Notifications
```python
# Detekce změn v LangChain API
python check.py --check-updates
```

### Auto-migration Guides
```python
# Generování doporučení pro migraci
python check.py --suggest-migration
```

## Integrace do CI/CD

### GitHub Actions
```yaml
- name: Check LangChain Compliance
  run: |
    python .claude/skills/langchain/compliance-checker/check.py --all
```

### Pre-commit Hook
```bash
# .git/hooks/pre-commit
python .claude/skills/langchain/compliance-checker/check.py --all
```

## Dokumentace Reference

Skill kontroluje proti těmto lokálním dokumentům:
- `docs_langgraph/structured_output.md` - Structured output patterns
- `docs_langgraph/workflow_agents.md` - Agent workflow patterns
- `docs_langgraph/rag.md` - RAG patterns

## Rozšíření Patterns

Přidání nového pattern:
```python
# V check.py, sekce DEPRECATED_PATTERNS
{
    "pattern": r"your_regex_here",
    "message": "Explanation",
    "severity": "error|warning",
    "docs_ref": "docs_langgraph/file.md"
}
```
