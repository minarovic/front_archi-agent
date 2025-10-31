---
id: MCOP-TOOL0-PARSER
type: story
status: done
priority: should-have
updated: 2025-10-31
skill_implementation: "src/tool0/parser.py"
skill_status: "ready_to_execute"
skill_time_saved: "1-2h per request"
skill_created: true
---

# Tool 0 – Business Request Parser (LLM MVP)

Brief
- Vyvinout první verzi parseru, který přečte standardizovaný business dokument a vrátí strukturovaný JSON popis projektu (včetně projektových metadat s ISO 8601 datem, sponzorem, názvem), aby další kroky filtrace metadat a analýzy dostaly jasně definované vstupy (`goal`, `scope_in`, `entities`, zdroje atd.). Parser využívá jednorázové volání LLM bez regex post-processingu.

Acceptance criteria
- [ ] Připravený Jupyter notebook obsahuje ukázkový Markdown dokument se sekcemi `Projekt`, `Cíl`, `Rozsah`, `Klíčové entity & metriky`, `Očekávané zdroje`, `Omezení`, `Požadované artefakty`.
- [ ] Jedno volání LLM (bez regexů) převede tento dokument na validní JSON se strukturou: `project_metadata` {`project_name`, `sponsor`, `submitted_at` (ISO 8601), `extra`}, `goal`, `scope_in`, `scope_out`, `entities[]`, `metrics[]`, `sources[]`, `constraints[]`, `deliverables[]`.
- [ ] Jedno volání LLM (bez regexů) převede tento dokument na validní JSON se strukturou: `project_metadata` {`project_name`, `sponsor`, `submitted_at` (ISO 8601), `extra`}, `goal`, `scope_in`, `scope_out`, `entities[]`, `metrics[]`, `sources[]`, `constraints[]`, `deliverables[]`. Výstup je generován přes structured-output strategii (Pydantic/TypedDict schema) a vrací se jako `structured_response`.
- [ ] Notebook vrací JSON přímo pod buňkou a ukládá výsledek i prompt do souboru (`data/tool0_samples/<timestamp>.json` a `.md`).
- [ ] První verze (v1) může použít inline implementaci pro jednodušší testování (bez importu modulu). Modul `src/tool0/parser.py` existuje a bude využit v další iteraci (refactor); modul obsahuje i README se stručným návodem.

Notes
- Prompt je cílený na naši referenční šablonu a explicitně vyplňuje `"unknown"`, pokud chybí hodnota; instrukce musí počítat s tím, že sekce mohou obsahovat volný text s víc hodnotami.
- JSON schema je fixní; volitelné položky se ukládají do slovníku `project_metadata.extra` (klíč/hodnota string). Pokud sekce chybí, vrací se `"unknown"`.
- Modul `src/tool0/parser.py` by měl vracet tuple `(parsed_json, raw_response, prompt)` pro budoucí logování a jednoduchou `try/except` ochranu proti nevalidnímu JSON.
- Notebook poslouží jako integrační test pro Tool 0; soubory v `data/tool0_samples/` budou využité při regresním testování. Vývoj probíhá nad reálným/realistickým příkladem dokumentu.
- Před implementací sepsat/finalizovat Markdown šablonu pro zadavatele (sekce Projekt, Cíl, Rozsah, Klíčové entity & metriky, Zdroje, Omezení, Požadované artefakty).
- Prompt musí počítat s mixem češtiny/angličtiny v názvech sekcí.
- Udržet fallback `"unknown"` pro chybějící sekce; do budoucna plánovaná validační smyčka.
- Implementace structured output vychází z `docs_langgraph/structured_output.md` (použít Pydantic/TypedDict schema místo ručního parsování).

Risks & Considerations
- Silná závislost na přesné šabloně: jakákoli odchylka (chybějící sekce, jiný nadpis) vede k neúplnému JSON → nutné mít fallback `"unknown"` a logování chyb.
- Volný text se seznamy: LLM musí z volného textu extrahovat seznamy (`entities`, `sources`), jinak hrozí směsné řetězce; v promptu zdůraznit formát pole stringů.
- Jazyková variabilita: dokument může obsahovat mix češtiny/angličtiny; prompt musí být vícejazyčný.
- Metadata (datum, sponzor): bez validace hrozí různé formáty → instruktáž v promptu na ISO 8601.
- Bez repair loop: jednorázové volání může selhat; orchestrátor potřebuje `try/except` a log.

Implementation Outline
1. Finalizovat Markdown šablonu (README) pro dokument zadavatele.
2. Připravit Jupyter notebook s ukázkovým dokumentem a voláním funkce `parse_business_request`.
3. Implementovat `src/tool0/parser.py`:
   - definice Pydantic/TypedDict schema,
   - sestavení systémového promptu,
   - volání LLM (structured output),
   - návrat `(parsed_json, raw_response, prompt)`.
4. Notebook uloží výstup i prompt do `data/tool0_samples/` (JSON + Markdown).
5. Dokumentovat v `src/tool0/README.md` postup použití.
