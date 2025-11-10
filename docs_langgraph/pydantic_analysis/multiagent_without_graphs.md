# MCOP Multi-Agent Guidance (Phase 1)

**Datum:** 2025-11-10
**Kontext:** MVP fáze (Tool 0→3) – grafy nahrazujeme sekvenčními funkcemi a multi-agentní orchestrací.

## Proč se nyní vyhýbáme Pydantic Graphu
- 🧩 **Lineární průběh**: Většina aktuálních toolů (0, 2, 3) běží jako jednoduché funkce s jedním LLM nebo čistě deterministicky.
- ⏱️ **Nižší režie**: Multi-agent (nebo jen async funkce) znamená méně boilerplate kódu, rychlejší úpravy a kratší debug.
- 🔁 **Checkpointy nejsou kritické**: Dnešní běhy trvají desítky sekund, restart od začátku pipeline je přijatelný.
- 🗂️ **Databricks nasazení**: Údržba notebooků je snazší bez grafových stavů (`graph_state/`).

## Jaký vzor používáme místo grafu
1. **Single-shot funkce** – pro tooly s jedním LLM/par neutrálním krokem.
2. **Multi-agent orchestrátor** – když potřebujeme více LLM kroků, ale stále lineárně.
3. **Koordinátor `@tool`** – orchestrátor agent přepouští práci specializovaným agentům, každý vrací typově bezpečná data (Pydantic schema).

```python
from pydantic_ai import Agent
from pydantic import BaseModel

class StructureResult(BaseModel):
    facts: list[str]
    dimensions: list[str]

classifier_agent = Agent(
    "openai:gpt-5-mini",
    output_type=StructureResult,
    system_prompt="Classify entities as FACT or DIMENSION."
)

async def classify_structure(parsed_doc: dict, mapping: dict) -> StructureResult:
    prompt = f"Parsed: {parsed_doc}\nMapping: {mapping}"
    result = await classifier_agent.run(prompt)
    return result.output
```

## Doporučený postup podle toolů
| Tool               | Aktuální stav     | Co dělat teď                          | Důvod                                                               |
| ------------------ | ----------------- | ------------------------------------- | ------------------------------------------------------------------- |
| Tool 0 (parser)    | Simplified funkce | Ponechat                              | Jednorázový JSON výstup, žádné větvení                              |
| Tool 1 (mapping)   | Pydantic Graph    | Refaktor na multi-agent (bez grafu)   | Lze paralelizovat ranking + mapping, checkpoint nepotřebujeme v MVP |
| Tool 2 (structure) | Graph → refaktor  | Přepsat na async funkci / multi-agent | Lineární flow, jeden agent                                          |
| Tool 3 (quality)   | Graph → refaktor  | Přepsat na async funkci s fallbackem  | Hybrid (deterministický + 1 LLM)                                    |

## Vzor orchestrátoru (MVP)
```python
orchestrator = Agent("openai:gpt-5-mini", instructions="Coordinate MCOP MVP pipeline")

@orchestrator.tool
async def run_tool0(ctx, document_path: str) -> dict:
    return await tool0_parse(document_path)

@orchestrator.tool
async def run_tool1(ctx, parsed: dict) -> dict:
    return await tool1_ingest(parsed)

@orchestrator.tool
async def run_tool2(ctx, parsed: dict, mapped: dict) -> dict:
    return await tool2_structure_classifier(parsed, mapped)

@orchestrator.tool
async def run_tool3(ctx, structure: dict) -> dict:
    return await tool3_quality_validator(structure)
```

## Kdy bude Graph znovu potřeba (Phase 2+) 
- **Conditional branching** (retry při nízké kvalitě, risk-based enrichments)
- **State persistence** (pause/resume mezi dlouhými kroky)
- **Parallel execution** (Tool 4–6 současně)
- **Human-in-the-loop** (schvalovací uzly)

Do té doby multi-agent vzor poskytuje dostatek flexibility a redukuje množství kódu v noteboocích i v repo.

### Návrh: Tool 1 bez grafu

**Cíl:** zachovat auditovatelnost (ranking i mapping), ale běžet čistě na multi-agent orchestrace.

1. **Specializovaní agenti:**
   - `ranking_agent` – vrací top kandidáty včetně racionalizace.
   - `mapping_agent` – generuje finální mapping + confidence + rationale.
2. **Parallel fan-out:** orchestrátor spustí oba agenty současně (`asyncio.gather`).
3. **Fan-in kontrola:** po dokončení spojíme výsledky a validujeme, že doporučené kandidáty leží v top seznamu (příp. flagujeme neshody).
4. **Výstup:** uložit `ranked_candidates`, `mappings`, `consistency_flag` do `dbfs:/FileStore/mcop/tool1/` (stejný formát jako dnes, jen bez `graph_state/`).

```python
ranking_task = asyncio.create_task(ranking_agent.run(ranking_prompt))
mapping_task = asyncio.create_task(mapping_agent.run(mapping_prompt))

ranking_result, mapping_result = await asyncio.gather(ranking_task, mapping_task)

consistency = any(
    m["candidate_id"] in ranking_result.output.top_candidates
    for m in mapping_result.output.mappings
)

return {
    "ranked_candidates": ranking_result.output.top_candidates,
    "mappings": mapping_result.output.mappings,
    "consistency": consistency
}
```

Tento přístup dává první verzi Toolu 1 bez grafu, rychlejší na úpravy a vyhovující MVP orchestrátoru.
