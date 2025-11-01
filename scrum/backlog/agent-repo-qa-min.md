---
id: MCOP-AGENT-REPO-QA-MIN
type: story
status: planned
priority: must-have
updated: 2025-11-01
skill_implementation: null
skill_status: needs_design
skill_time_saved: null
skill_created: false
---

# Repo QA Agent – zjednodušené zadání (deepagents / Agent Builder)

Nejmenší možný test agenta: ověřit, že JSON existuje a je čitelný, a že existují backlogové markdowny s frontmatter blokem.

## Cíl
- Ověřit:
  - `data/tool1/filtered_dataset.json` existuje a lze jej načíst jako validní JSON.
  - existuje alespoň jeden `scrum/backlog/*.md` a každý zjištěný soubor začíná řádkem `---` (YAML frontmatter).
- Vrátit jediný krátký textový souhrn (≤ 3 věty). JSON summary je volitelné.

## Vstupy (agent běží mimo repo)
- `project_root` (absolutní cesta ke kořeni projektu)
- `filtered_json_rel` (výchozí: `data/tool1/filtered_dataset.json`)
- `backlog_glob_rel` (výchozí: `scrum/backlog/*.md`)

Agent skládá cesty bezpečně (join + normalize) a nečte mimo `project_root`.

## Nástroje
- Pouze vestavěné filesystem nástroje deepagents:
  - `ls` – vyhledání souborů podle globu relativně k `project_root`
  - `read_file` – načtení obsahu souboru

## Akceptační kritéria (MVP)
1) `filtered_dataset.json` existuje a lze jej úspěšně parsovat jako JSON.
2) Existuje ≥ 1 backlog MD a každý začíná `---`.
3) Agent vrátí stručný PASS/FAIL souhrn (≤ 3 věty) s počty souborů a případně seznamem problémových cest.
4) Všechny cesty jsou odvozeny od `project_root` (žádný přístup mimo kořen).

## Definice hotovo (DoD)
- [ ] Story zdokumentovaná a schválená
- [ ] (Volitelně) Demo běh v konzoli bez zápisu do souborů

## Poznámky k běhu
- Proměnné prostředí: `ANTHROPIC_API_KEY`
- Balíčky: `deepagents`
- Vzorek konfigurace: `prompts/agent-repo-qa/CONFIG.sample.json`

## Další kroky (po MVP)
- Přidat kontrolu povinných klíčů ve frontmatteru
- Přidat JSON summary a/nebo uložení výsledků do `scrum/artifacts/`