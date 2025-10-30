# Scrum Artifacts

Tento adresář obsahuje výstupy ze spuštění Skills a validačních nástrojů jako audit trail.

## Struktura
- `YYYY-MM-DD_skill-name.json` - Výsledek běhu konkrétního skillu
- `YYYY-MM-DD_skill-name.md` - Detailní report (pokud JSON nestačí)

## Pravidla
- Soubory jsou generované automaticky
- Neměňte ručně (jen čtení pro review)
- Retention: uchovávat minimálně posledních 30 dní
- Používá se pro:
  - CI/CD validace
  - Definition of Done
  - Retrospektivní analýzu

## Příklady
- `2025-10-30_backlog-validation.json` - Validace frontmatter v backlog/*.md
- `2025-10-30_tool0-test-run.json` - Regresní test Tool 0 parseru
- `2025-11-01_skill-coverage.json` - Statistika pokrytí stories skills
- `2025-11-01_langchain-compliance.json` - Kontrola souladu s LangChain dokumentací
