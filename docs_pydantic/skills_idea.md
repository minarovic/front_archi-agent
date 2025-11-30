Integrace principů "Skills Factory" do Metadata Copilot
=======================================================

Účel dokumentu
---------------
- Shrnuje, co si z metodiky "Claude Skills Factory" bereme pro MVP Toolu 0.
- Navazuje na aktuální artefakty v repozitáři (`scrum/doing/tool0-business-parser.md`, `docs_langgraph/structured_output.md`, `.claude/skills/langchain/compliance-checker/README.md`).
- Slouží jako zdroj "co a proč" – implementační postupy musí žít ve Skills a v backlogových stories.

Motivace
--------
- Tool 0 (Business Request Parser) je ve stavu `planned`; dokumentace popisuje cílové chování, ale chybí jednotný postup, jak nové Skills navrhovat a validovat ještě před zápisem do repa.
- Stávající procesy (Scrum backlog, DoD, compliance checker) řeší až fázi provedení. Potřebujeme doplnit disciplínu při samotném vzniku nápadů, aby výstupy byly znovupoužitelné a auditovatelné.
- "Skills Factory" dává rámec, jak vést konverzaci s AI jako inženýrský proces – s důrazem na strukturu výstupu, defenzivní programování a rychlou iteraci.

Co přebíráme ze Skills Factory
-------------------------------
- **Konverzační checklist** – při návrhu nové schopnosti si tým projde sady otázek (účel, vstupy, závislosti, DoD). Checklist bude součástí story šablony (`scrum/backlog/_STORY_TEMPLATE.md`).
- **Shift-left validace** – definujeme min. pravidla, která se ověřují přímo během generování návrhu (typové anotace, Field popisy, zachování ToolStrategy patternu). Instrukce odkazují na `docs_langgraph/structured_output.md` a `.claude/skills/langchain/compliance-checker/README.md`.
- **Auditní artefakt** – každé použití subagentů nebo Skills končí záznamem v `scrum/artifacts/` s datem, aby bylo jasné, co bylo generováno, jaké validace proběhly a kde je výstup použit v dokumentaci.

Dopad na náš provoz
-------------------
- **Backlog** – stories ve `scrum/doing/` musí mít vyplněný frontmatter včetně `skill_status` a `skill_implementation`. Konverzační checklist se přidá jako nová sekce "Generační poznámky".
- **LangChain kód** – všechny nové soubory v `src/tool0/` musí procházet compliance checkerem před review (viz `.claude/skills/langchain/compliance-checker/README.md`). V dokumentaci explicitně zdůrazníme používání `ToolStrategy` a Pydantic `Field` popisů.
- **Subagent workflow** – návaznost na `prompts/subagent-orchestration.md`. Výstupy subagentů se bez úprav ukládají do `scrum/artifacts/subagents/`, poté je spouštěn normalizační skill (`.claude/skills/subagent/subagent-normalizer/`).

Akční roadmapa
--------------

| Číslo | Aktivita | Popis & výstup | Kam zapsat |
|-------|----------|----------------|-------------|
| 1 | Story "Capability Library schema" | Definovat strukturu JSON/Markdown pro katalog schopností, včetně polí owner, závislosti, DoD odkazy. | `scrum/backlog/` (nová story) |
| 2 | Update Tool 0 story | Doplnit konverzační checklist a vazbu na `.claude/skills/langchain/compliance-checker/`. | `scrum/doing/tool0-business-parser.md` |
| 3 | CI krok "shift-left prompts" | Připravit návrh automatického připomenutí checklistu (např. pre-commit hook nebo MCP). | `scrum/backlog/` |

Kontrolní checklist (před dokončením story)
------------------------------------------
- [ ] Story má aktualizovaný frontmatter (`updated`, `skill_status`, `skill_created`).
- [ ] Existuje přiložený záznam v `scrum/artifacts/YYYY-MM-DD_*.json` dokládající běh Skills/subagentů.
- [ ] Příslušný Python kód prošel `python3 .claude/skills/langchain/compliance-checker/check.py --file <cesta>`.
- [ ] Dokumentace v Markdown popisuje "co a proč" a odkazuje na konkrétní Skill (`SKILL.md`, `README.md`).

Další zdroje
------------
- `docs_langgraph/structured_output.md` – interní přehled strukturovaného výstupu a ToolStrategy.
- `.claude/skills/langchain/compliance-checker/README.md` – pravidla pro validaci LangChain kódu.
- `.claude/skills/subagent/subagent-normalizer/README.md` – jak archivovat a normalizovat subagent výstupy.
- Externí inspirace: "Claude Skills Factory" (Anthropic blog, 2024) – referenční metodika pro konverzační generování schopností.
