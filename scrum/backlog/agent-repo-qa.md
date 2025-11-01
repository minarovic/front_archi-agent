---
id: MCOP-AGENT-REPO-QA
type: story
status: planned
priority: must-have
updated: 2025-11-01
skill_implementation: null
skill_status: needs_design
skill_time_saved: null
skill_created: false
---

# Repo QA Agent (deepagents / LangSmith Agent Builder) – Zadání

Tento příběh definuje jednoduchého AI agenta pro rychlé otestování Agent Builderu (postaveného na deepagents) na lokálních datech našeho projektu. Cílem je minimální, ale užitečná validace repo artefaktů bez externích integrací.

## Cíl
- Zkontrolovat základní konzistenci projektu:
  - `data/tool1/filtered_dataset.json` – existuje, je validní a neprázdný JSON.
  - `scrum/backlog/*.md` – každý soubor má povinný frontmatter dle našeho standardu.
  - Existence složek `docs_langgraph/` a `notebooks/` (jen informačně).
- Vrátit krátký lidsky čitelný souhrn + JSON summary.

## Proč projekt-agnosticky (agent mimo repo)
- Agent může běžet jinde (LangSmith Agent Builder / cloud) a nezná lokální cesty.
- Vstupem MUSÍ být absolutní `project_root` a relativní vzory cest. Agent nikdy nesmí přistupovat mimo tento kořen.
- Nástroje (ls/read_file/custom) musí pracovat relativně k `project_root` (tzn. cesty skládat přes join/path-normalizaci a validovat, že zůstávají uvnitř kořene).

## Rozsah (Scope)
### In
- Soubory a cesty:
  - `data/tool1/filtered_dataset.json`
  - `scrum/backlog/*.md`
  - (INFO) existence `docs_langgraph/` a `notebooks/`
- Kontroly:
  - File existence (základní)
  - JSON sanity (parsování + neprázdný obsah; nepovinné přehledové metriky)
  - YAML frontmatter – přítomnost a základní validace hodnot (viz níže)

### Vstupní rozhraní (projekt-agnostické)
- Parametr: `project_root` (absolutní cesta)
- Vzory/relativní cesty:
  - `filtered_json_rel`: `data/tool1/filtered_dataset.json`
  - `backlog_glob_rel`: `scrum/backlog/*.md`
  - `info_dirs_rel`: `["docs_langgraph", "notebooks"]`
- Agent:
  - Sestavuje absolutní cesty jako `abs = normalize(join(project_root, rel))`
  - Kontroluje, že `abs` je pod `project_root` (ochrana proti path traversal)
  - Nepřistupuje mimo `project_root`

### Out (mimo rozsah pro MVP)
- Křížové ověřování mezi soubory (např. existence souboru ze `skill_implementation`)
- Detailní schema validace všech JSONů
- Parsování obsahu `docs_langgraph/*` a `notebooks/*`
- Webové akce a vzdálené zdroje (čistě lokální běh)

## Povinný frontmatter pro `scrum/backlog/*.md`
- id: string
- type: one of [story, epic, task]
- status: one of [planned, in-progress, done, blocked]
- priority: one of [must-have, should-have, could-have, wont-have]
- updated: ISO 8601 (YYYY-MM-DD)
- skill_implementation: string | null (nepovinné → WARNING, pokud chybí)
- skill_status: one of [ready_to_execute, needs_design, manual_only]
- skill_time_saved: string | null (nepovinné → WARNING, pokud chybí)
- skill_created: boolean

Tolerance a chování:
- Chybějící nepovinné klíče → WARNING (ne FAIL)
- Neznámé klíče → WARNING
- Chybné enumy/typy nebo nevalidní `updated` (neformát YYYY-MM-DD) → FAIL

## Agent – návrh (deepagents)
- Model: Anthropic (ANTHROPIC_API_KEY již k dispozici)
- Nástroje (≤3):
  1) `ls` (filesystem) – pro zjištění souborů/složek
  2) `read_file` (filesystem) – pro načtení obsahu JSON/MD
  3) `validate_repo_artifacts` (custom) – provede JSON/frontmatter kontroly a vrátí summary
- System prompt (stručný):
  - „Jsi repo QA asistent. Použij ‘ls’ a ‘read_file’ jen lokálně. Nástrojem ‘validate_repo_artifacts’ zkontroluj vybrané soubory. Výstup udrž krátký (pár vět) + přilož JSON summary.“

### Vstupy a výstupy
- Vstupy (default):
  - `data/tool1/filtered_dataset.json`
  - `scrum/backlog/*.md`
  - existence `docs_langgraph/` a `notebooks/`
- Výstupy:
  - Textový souhrn (PASS/FAIL + počty)
  - JSON summary: `{ files_checked, failures: [], warnings: [], pass: true|false }`

### Akceptační kritéria
1) Agent úspěšně přečte `data/tool1/filtered_dataset.json` (validní a neprázdný JSON) a aspoň 1 `scrum/backlog/*.md`.
2) Frontmatter ve všech zjištěných backlog souborech obsahuje povinné klíče a validní hodnoty (viz výše).
3) Chybějící nepovinná pole (skill_implementation, skill_time_saved) se reportují jako WARNING, ne jako FAIL.
4) `updated` je validní ISO datum ve formátu YYYY-MM-DD.
5) Výstup obsahuje krátký text + JSON summary (viz struktura výše).
6) Agent neprovádí webové akce ani zápis do souborů (read-only mimo vlastní výstup do konzole).
7) Agent vyžaduje `project_root` a všechny cesty odvozuje vůči němu; běží správně i mimo pracovní adresář repozitáře.

### Definice hotovo (DoD)
**Obecné DoD:**
- [ ] Příběh zdokumentován a schválen
- [ ] (Pokud bude implementace) Testovací běh proběhl úspěšně v lokálním prostředí
- [ ] Dokumentace použití (README/poznámky v notebooku)

**Skill DoD (až `skill_created: true`):**
- [ ] Implementace nástroje `validate_repo_artifacts` existuje
- [ ] Validní `SKILL.md` s metadaty (name, description, version, owner, dependencies)
- [ ] Úspěšné spuštění, volitelný log v `scrum/artifacts/YYYY-MM-DD_repo-qa-summary.json`
- [ ] README s návodem ke spuštění

## Poznámky k běhu (lokální demo)
- Python balíčky: `deepagents` (minimálně), `pyyaml` (pro YAML frontmatter), případně `pydantic` pro typové kontroly
- Proměnné prostředí: `ANTHROPIC_API_KEY` (případně lze přepnout na OpenAI)
- Doporučená forma: jednoduchý skript nebo demo notebook (např. `notebooks/agent_repo_qa_demo.ipynb`)

### Vzor konfigurace pro externího agenta
Soubor: `data/agent_repo_qa_config.sample.json` (projekt může dodat původní hodnoty, agent si načte a použije):

```json
{
  "project_root": "/absolute/path/to/archi-agent",
  "paths": {
    "filtered_json_rel": "data/tool1/filtered_dataset.json",
    "backlog_glob_rel": "scrum/backlog/*.md",
    "info_dirs_rel": ["docs_langgraph", "notebooks"]
  },
  "frontmatter": {
    "required": [
      "id", "type", "status", "priority", "updated", "skill_status", "skill_created"
    ],
    "optional": ["skill_implementation", "skill_time_saved"],
    "enums": {
      "type": ["story", "epic", "task"],
      "status": ["planned", "in-progress", "done", "blocked"],
      "priority": ["must-have", "should-have", "could-have", "wont-have"],
      "skill_status": ["ready_to_execute", "needs_design", "manual_only"]
    },
    "updated_pattern": "^\\d{4}-\\d{2}-\\d{2}$"
  }
}
```

## Rozšíření v dalších iteracích
- Křížová kontrola: pokud `skill_created: true`, ověřit existenci souboru v `skill_implementation`
- Přísnější schema validace `filtered_dataset.json`
- Validace konzistence statusů napříč backlogem
- Uložení JSON summary jako artefaktu do `scrum/artifacts/`

## Reference
- LangSmith Agent Builder: https://docs.langchain.com/langsmith/agent-builder
- deepagents (LangChain OSS): https://github.com/langchain-ai/deepagents
