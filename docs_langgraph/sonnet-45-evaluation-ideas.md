# Sonnet 4.5 Review Packet

## Kontext
- MVP workflow předepisuje sekvenci Tool 0 → Tool 1 → Tool 2 → Tool 3 (paralelně) → orchestrátor → částečný Tool 7.
- Tool 2 je nyní stabilizovaný a produkuje `data/tool2/structure.json`, což odblokovává navazující části pipeline.
- Tool 3 (Quality Validator) je povinný artefakt MVP — bez něj chybí metriky kvality (`validationResult`, `articulationScore`, `Missing from source`).

## Důvody, proč následuje Tool 3
1. **MVP závazek** – `scrum/backlog/mcop-mvp-v1-scope.md` vyžaduje dostupnost Toolů 0–3 pro splnění definice MVP.
2. **Workflow závislost** – orchestrátor (Node 2) spouští Tool 2 a Tool 3 paralelně; Tool 3 proto bezprostředně navazuje na výstup Toolu 2.
3. **Vstupy** – `structure.json` z Toolu 2 je primární vstup pro validace Toolu 3.
4. **Downstream artefakty** – Tool 7 (governance report) potřebuje quality report z Toolu 3 jako vstupní data.

## Navržená posloupnost kroků
1. **Ověřit Tool 2**
   - Spustit notebook / skript, uložit `structure.json`, zkontrolovat metriky a auditní logy.
2. **Specifikovat Tool 3**
   - Doplnit/aktualizovat story v `scrum/backlog/` (frontmatter, acceptance criteria, odkazy na artefakty).
   - Formalizovat očekávané metriky: `validationResult`, `articulationScore`, identifikace „Missing from source“ a další datové red flags.
3. **Navrhnout architekturu Toolu 3**
   - Vstup: `data/tool2/structure.json` + případné doplňky (např. Tool 0 kontext).
   - Výstup: `data/tool3/quality_report.json` + audit ve `scrum/artifacts/`.
   - Logika: deterministické kontroly (schema rules) + volitelná LLM validace komentářů.
4. **Implementace**
   - Vytvořit notebook / modul v `src/tool3/`.
   - Definovat Pydantic schémata pro quality report, zapsat do JSON.
   - Zajistit logování a případný fallback pro chybějící údaje.
5. **Testování a validace**
   - Spustit pipeline Tool 0 → Tool 3 (ručně nebo orchestrací).
   - Připravit unit testy / snapshoty pro standardní dataset.
   - Ověřit, že auditní artefakt je uložen v `scrum/artifacts/` se správným názvem.
6. **Procesní kroky**
   - Aktualizovat story frontmatter (`updated`, `skill_status`, `skill_created`).
   - Spustit compliance checker: `python3 .claude/skills/langchain/compliance-checker/check.py --file <path>`.
   - Připravit shrnutí pro backlog a Sonnet review (hlavní learnings, doporučení).

## Doporučení pro Sonnet 4.5
- Zhodnotit pokrytí MVP metrik: zda kombinace Tool 2 + navrhovaný Tool 3 poskytuje dostatečný insight o kvalitě metadat.
- Ověřit, že navržené deterministické kontroly pokrývají nejkritičtější scénáře (chybějící entity, nevalidní status, nulový articulation score).
- Posoudit, zda je vhodné doplnit LLM-based komentářovou vrstvu (např. shrnutí rizik) nebo postačí čistě deterministický přístup v MVP.
- Zkontrolovat připravenost na orchestraci: jasně definované vstupy/výstupy, pojmenování souborů, strukturovaný JSON.
- Doporučit případná rozšíření pro post-MVP (např. automatizovaný benchmark, alerting, integrace s Tool 7).
