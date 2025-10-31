# Subagent Prompt — Analyze BA/BS Datamarts Metadata

> Status: DISABLED for auto-run. Do not trigger `#runSubagent` for this prompt until re-enabled. Keep for manual reference only.

Cíl: Tento soubor obsahuje tři připravené prompty pro VS Code Copilot Chat (Insiders) s použitím subagenta (`#runSubagent`). Zkopíruj jeden z promptů do Copilot Chatu a spusť.

Cílový soubor k analýze: `docs_langgraph/BA-BS_Datamarts_metadata.json`

---

## 1) Rychlý přehled (1–2 min)

Proveď analýzu souboru docs_langgraph/BA-BS_Datamarts_metadata.json #runSubagent.

Cíle:
- Stručné shrnutí co dataset obsahuje (doména, hlavní entity, metriky).
- Vypiš top-level klíče a krátce popiš jejich význam.
- Uveď počty (počet entit/tablů, metrik, zdrojů), pokud to lze určit.
- Zjisti zjevné anomálie (chybějící hodnoty, duplikáty klíčů, nekonzistentní typy).
- Zakonči 3–5 doporučeními pro další kroky (např. co zvalidovat, co sjednotit).

Výstup:
- Stručný executive summary (max 10 řádků)
- Oddíl „Schéma & statistiky“
- Oddíl „Anomálie & rizika“
- Oddíl „Doporučení“

---

## 2) Hloubková analýza + strukturovaný výstup

Otevři a analyzuj soubor docs_langgraph/BA-BS_Datamarts_metadata.json #runSubagent.

Úkoly:
1) Přehled a schéma
   - Identifikuj hlavní entity (tabulky/objekty), metriky a zdroje.
   - Uveď top-level strukturu (klíče) a stručně ji okomentuj.
   - Pokud existují vztahy mezi entitami, popiš je (1:N, N:M, referenční klíče).

2) Měřitelné statistiky
   - Počty entit/tablů, metrik, zdrojů (pokud odvoditelné).
   - Seznam 5 nejdůležitějších entit + proč.
   - Vypiš klíče, které často chybí nebo mají různé typy hodnot.

3) Kvalita dat a konzistence
   - Vypiš anomálie (např. prázdné názvy, konfliktní typy, duplicity).
   - Navrhni normalizace (naming, typy, povinná pole).

4) Mapování na náš MCOP (Tool 0/1)
   - Navrhni candidates pro:
     - entities[] (seznam jmen)
     - metrics[] (seznam jmen popř. definic)
     - sources[] (zdrojové systémy či katalogy)
     - constraints[] (GDPR, RLS, SLA, retence, cokoliv odvoditelné)
   - Uveď doporučený „scope_in“ a „scope_out“ pro první iteraci Tool 1 (ingest & filtrování).

5) Výstupy
   - Markdown report s oddíly: Executive summary, Schéma, Statistiky, Anomálie, Doporučení, MCOP mapování.
   - Na závěr přilož JSON shrnutí (validní JSON) ve struktuře:
     {
       "dataset_overview": {"entities_count": ..., "metrics_count": ..., "sources_count": ...},
       "entities": ["..."],
       "metrics": ["..."],
       "sources": ["..."],
       "constraints": ["..."],
       "scope_in": "...",
       "scope_out": "..."
     }

Poznámky:
- Pokud bude soubor velký, pracuj iterativně: nejdřív top-level struktura, pak z ní odvod další kroky (ale vrať pouze finální výsledek).
- Buď konzervativní: raději „unknown“ než halucinovat z nejasných míst.

---

## 3) Data‑quality audit (připravenost pro Tool 1)

Proveď data‑quality audit souboru docs_langgraph/BA-BS_Datamarts_metadata.json #runSubagent.

Zaměř se na:
- Integritu schématu (konzistence klíčů, typy hodnot).
- Identifikaci „primary‑like“ a „foreign‑like“ klíčů.
- Detekci duplicit a chybějících kritických polí.
- Mapovatelná pole na entities/metrics/sources pro Tool 1.
- Seznam rychlých fixů, které zvýší úspěšnost ingestu a filtrování.

Výstup:
- „Findings“ v odrážkách s odkazem na konkrétní klíče/oddíly.
- „Quick fixes“ (do 10 bodů, akční a konkrétní).
- „Readiness score“ (0–100) + krátké zdůvodnění.

---

Tipy:
- Pro dosažení praktických výsledků přidej požadavek na „konkrétní seznam entit/metrik/zdrojů jako pole v JSON“.
- Pokud chceš navázat validacemi, odkazuj v dalším kroku na naše skripty (backlog-validator, compliance) nebo je zvaž zabalit do MCP nástroje.
