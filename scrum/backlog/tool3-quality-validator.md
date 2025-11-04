---
id: MCOP-TOOL3-QUALITY
type: story
status: planned
priority: must-have
updated: 2025-11-04
skill_implementation: "src/tool3/validator.py"
skill_status: "ready_to_execute"
skill_time_saved: "~3h per audit run (manual analysis)"
skill_created: false
---

# Tool 3 – Quality Validator

## Brief

Implementovat **hybrid agentic validator** (LangGraph StateGraph s 4 nodes) kombinující:
- **Deterministickou validaci** (Python heuristiky pro artikulační skóre, missing entity detection)
- **LLM enhancement layer** (risk assessment, recommendations P0-P2, anomaly detection)

**Architektura:** Load → Calculate (deterministický) → Enhance (LLM) → Save

Pattern konzistentní s Tool 1 & Tool 2 (žádný middleware, context injection přes system_prompt).

**Výstupy:**
- `data/tool3/quality_report.json` (hlavní report)
- `scrum/artifacts/YYYY-MM-DD_tool3-quality-summary.json` (audit log)

S timestamp ISO8601, scoring breakdown, P0-P2 recommendations a coverage metrics.

## Acceptance Criteria

- [ ] Frontmatter této story je vždy aktuální (`status`, `updated`, `skill_*`), změny stavu se logují do git historie.
- [ ] Existuje Pydantic schema `QualityReport` (a podpůrné modely: `Recommendation`, `AnomalyNote`, `LLMEnhancement`, `QualityMetrics`) s docstringem, Field popisy a enumem `ValidationResult` (pass | warning | fail).
- [ ] **Node 2 (calculate)** implementuje deterministické heuristiky inline (žádné @tool dekorátory): `calculate_articulation_score()`, `detect_missing_entities()`, `validate_entity_status()` jako běžné Python funkce uvnitř node funkce.
- [ ] **Node 3 (enhance)** používá Pattern B: `AzureChatOpenAI` + `create_agent(..., response_format=ToolStrategy(LLMEnhancement))`, žádné deprecated importy (langchain.agents, langchain.agents.structured_output.ToolStrategy).
- [ ] Pipeline validuje: `articulationScore` (0–100, deterministický), `validationResult` (pass | warning | fail, deterministický), `missingFromSource` (list entit, deterministický), `riskLevel` (LLM), `recommendations[]` (LLM), `anomalyNotes` (LLM).
- [ ] **Timing target:** <15s end-to-end (Load <1s, Calculate <3s, Enhance <10s LLM call, Save <1s).
- [ ] Načtený `structure.json` i business request jsou validovány proti existujícím schématům; prázdné nebo chybné vstupy vyvolají jasnou výjimku s logem.
- [ ] Výstupní `data/tool3/quality_report.json` + `scrum/artifacts/YYYY-MM-DD_tool3-quality-summary.json` obsahují timestamp v ISO8601, odkazy na vstupní soubory a audit trail kroků.
- [ ] Compliance checker (`python3 .claude/skills/langchain/compliance-checker/check.py --file src/tool3/validator.py`) prochází bez chyb, backlog validator běží po update story.
- [ ] Heuristiky reflektují nálezy z `scrum/artifacts/2025-11-03_datamarts-dq-audit.{md,json}` (nízké coverage description/owner 28.1/100) a validator umí vygenerovat doporučení pro Quick fixes formátu P0–P2.
- [ ] **LLM hallucination mitigation:** Node 3 validuje LLM-generated entity IDs proti input structure (reject neexistující entity), recommendations jsou cross-referenced s deterministickými findings (enforce P0 pro critical missing fields).
- [ ] **Fallback strategy:** Pokud LLM call v Node 3 selže (timeout, API error), pipeline pokračuje s deterministickými výsledky + generic recommendations (audit log zaznamená fallback mode).
- [ ] Existuje `notebooks/tool3_quality_demo.ipynb` demonstrující end-to-end flow s real structure.json input (min 1 fact + 1 dimension) a výstupní quality_report.json validation.

## Definition of Done

### General DoD
- [ ] Code reviewed and approved (min. 1 reviewer).
- [ ] Tests pokrývají hlavní větve (unit test heuristik + smoketest proti sample strukturám).
- [ ] Dokumentace (README nebo notebook sekce) popisuje workflow, vstupy, výstupy, konfig.

### Skill DoD (pokud `skill_created: true`)
- [ ] Implementace existuje na `src/tool3/validator.py` a odpovídá `skill_implementation` cestě.
- [ ] `.claude/skills/.../SKILL.md` obsahuje validní frontmatter, README vysvětluje spuštění.
- [ ] Skill byl spuštěn s reálným `structure.json` a log zapsán do `scrum/artifacts/YYYY-MM-DD_tool3-quality-summary.json`.
- [ ] Výstup `quality_report.json` prošel Pydantic validací a je verzovaný (např. `schema_version`).
- [ ] V repozitáři je uveden příkaz na opakované spuštění (Makefile target nebo `python3 src/tool3/validator.py`).

## Notes

### Architecture Decision: Hybrid Agentic Pattern (4-Node LangGraph)

**Pipeline Flow:**
```
START → Node 1: Load → Node 2: Calculate → Node 3: Enhance → Node 4: Save → END
          ↓              ↓                    ↓                  ↓
      Validate inputs  Deterministické    LLM agent          Serialize outputs
      (structure.json, heuristiky         (ToolStrategy)     (quality_report.json,
       business_context) (artikulační skóre, (recommendations,  artifacts summary)
                         validation flags,  risk_level,
                         missing entities)  anomaly_notes)
```

**Node Responsibilities:**
- **Node 1 (load_and_validate):** Load structure.json + business_request.json, schema validation, input sanitization
- **Node 2 (calculate_deterministic):** Python heuristiky pro artikulační skóre (0-100), validation flags (pass/warning/fail), missing entity detection - ŽÁDNÉ LLM volání, ŽÁDNÉ @tool dekorátory
- **Node 3 (enhance_with_llm):** LLM agent s ToolStrategy(LLMEnhancement) - dostane deterministické výsledky jako context, generuje risk_level, recommendations[], anomaly_notes
- **Node 4 (merge_and_serialize):** Merge deterministických + LLM výsledků do QualityReport, save JSON/artifacts, audit logging

**State Management:** `Tool3State` TypedDict (shared state pattern z Tool 1/2) - žádný middleware, context injection přes system_prompt string interpolace

**Důvody pro tuto architekturu:**
- Konzistence s Tool 1 (5 nodes, 2 LLM) & Tool 2 (5 nodes, 1 LLM) - proven pattern
- Deterministická část garantuje stabilní baseline (skóre vždy stejné pro stejný vstup)
- LLM enhancement přidává value (semantic quality assessment, contextual recommendations) bez rizika destabilizace core metrics
- Fallback možný (pokud LLM selže, deterministické výsledky stačí)
- Debugging friendly (vidíš přesně co je rule-based vs LLM-driven)

---

### Inputs & Configuration

- **Vstupy:**
  - `data/tool2/structure.json` (facts, dimensions, hierarchies, relationships)
  - `data/tool0_samples/YYYY-MM-DDTHH:MM:SS.json` (business_context: entities, scope_out)
  - Optional: `data/metadata_sources/*.json` (full Collibra/Unity Catalog dumps pro extended validation)

- **LLM konfigurace (Node 3 only):** `AzureChatOpenAI` (deployment `test-gpt-5-mini`, api_version `2024-10-21`), ToolStrategy se schema `LLMEnhancement` (NOT QualityReport - LLM generuje jen enhancement část).

- **Cost estimate:** ~$0.01 per run (4000 input tokens + 1500 output tokens, gpt-5-mini pricing).

---

### Pydantic Schemas (src/tool3/schemas.py)

```python
from pydantic import BaseModel, Field
from typing import Literal, TypedDict

class Recommendation(BaseModel):
    """Single actionable recommendation (P0-P2 priority)."""
    priority: Literal["P0", "P1", "P2"] = Field(
        description="Priority level: P0=blocker (missing critical fields), P1=quality issue, P2=nice-to-have"
    )
    entity_id: str | None = Field(
        description="Affected entity table_id, null if project-wide recommendation"
    )
    issue_type: str = Field(
        description="Issue category (e.g., 'MISSING_DESCRIPTION', 'LOW_ARTICULATION', 'MISSING_OWNER')"
    )
    description: str = Field(
        description="User-friendly explanation of the issue"
    )
    action: str = Field(
        description="Specific action to resolve (e.g., 'Add description in Collibra for entity dimv_supplier')"
    )
    estimated_impact: str = Field(
        description="Expected improvement (e.g., '+20 articulation score', 'unblock production deployment')"
    )

class AnomalyNote(BaseModel):
    """Structural anomaly detected by LLM."""
    entity_id: str = Field(description="Entity with anomaly")
    anomaly_type: str = Field(
        description="Type: 'UNEXPECTED_FIELD', 'NAME_MISMATCH', 'SCHEMA_DRIFT', 'VALUE_OUTLIER'"
    )
    severity: Literal["high", "medium", "low"] = Field(
        description="Impact level on data quality"
    )
    explanation: str = Field(
        description="Why this is anomalous and potential impact"
    )

class LLMEnhancement(BaseModel):
    """LLM output schema for ToolStrategy (Node 3 only)."""

    risk_level: Literal["high", "medium", "low"] = Field(
        description="Overall metadata quality risk: high=P0 blockers present, medium=P1 issues, low=minor P2 only"
    )
    risk_rationale: str = Field(
        description="2-3 sentence explanation why this risk level was assigned"
    )

    text_quality_score: float | None = Field(
        description="Subjective quality of descriptions/naming (0.0-1.0), null if not assessed",
        ge=0.0,
        le=1.0,
        default=None
    )
    text_quality_notes: str | None = Field(
        description="Explanation of text quality assessment (brevity, clarity, terminology)",
        default=None
    )

    recommendations: list[Recommendation] = Field(
        description="Prioritized list of fixes, P0 blockers first"
    )

    anomaly_notes: list[AnomalyNote] = Field(
        description="Structural outliers or unexpected patterns",
        default_factory=list
    )

    summary: str = Field(
        description="2-3 sentence summary for governance report (non-technical audience)"
    )

class QualityReport(BaseModel):
    """Final output schema (merge of deterministické + LLM results)."""
    schema_version: str = Field(description="Schema version for backward compatibility", default="1.0.0")
    timestamp: str = Field(description="Analysis timestamp in ISO 8601 format")

    source_files: dict = Field(
        description="Paths to input files (structure.json, business_context.json)"
    )

    # Deterministické results (Node 2)
    articulation_scores: dict[str, int] = Field(
        description="Entity_id → articulation_score (0-100) mapping"
    )
    validation_results: dict[str, str] = Field(
        description="Entity_id → validation_result ('pass'|'warning'|'fail') mapping"
    )
    missing_from_source: list[str] = Field(
        description="List of business entities not found in structure.json"
    )

    # LLM enhancement (Node 3)
    risk_level: str = Field(description="high | medium | low")
    risk_rationale: str = Field(description="Explanation for risk level")
    recommendations: list[Recommendation] = Field(description="P0-P2 prioritized recommendations")
    anomaly_notes: list[AnomalyNote] = Field(description="Detected anomalies", default_factory=list)
    summary: str = Field(description="Executive summary")

    # Metrics (computed in Node 4)
    metrics: dict = Field(
        description="Summary stats: total_entities, avg_articulation_score, entities_with_issues, p0_blockers, coverage"
    )

class Tool3State(TypedDict, total=False):
    """Shared state across all Tool 3 nodes."""
    # Inputs
    structure: dict
    business_context: dict
    metadata: dict
    # Node 2 outputs
    entity_scores: dict[str, int]
    validation_flags: dict[str, str]
    missing_entities: list[str]
    # Node 3 outputs
    llm_enhancements: LLMEnhancement
    llm_fallback_mode: bool
    # Node 4 outputs
    final_report: QualityReport
    output_path: str
```

---

### Deterministické Heuristiky (Node 2)

**calculate_articulation_score():**
```python
def calculate_articulation_score(entity_metadata: dict) -> int:
    """
    Deterministický scoring based on field presence.
    Weights aligned with DQ audit findings (28.1/100 baseline).
    """
    score = 0

    # Critical fields (P0 blockers)
    if entity_metadata.get("description") and entity_metadata["description"] not in [None, "", "unknown"]:
        score += 20
    if entity_metadata.get("owner") and entity_metadata["owner"] not in [None, "", "unknown"]:
        score += 20

    # Important fields (P1 quality)
    if entity_metadata.get("lineage") and len(entity_metadata["lineage"]) > 0:
        score += 15
    if entity_metadata.get("source_mapping") and entity_metadata["source_mapping"] not in ["unknown", None]:
        score += 15

    # Nice-to-have fields (P2)
    if entity_metadata.get("dq_rules") and len(entity_metadata["dq_rules"]) > 0:
        score += 10
    if entity_metadata.get("governance_tags") and len(entity_metadata["governance_tags"]) > 0:
        score += 10
    if entity_metadata.get("last_updated"):
        from datetime import datetime, timedelta
        try:
            last_update = datetime.fromisoformat(entity_metadata["last_updated"])
            if datetime.now() - last_update < timedelta(days=90):
                score += 10
        except:
            pass

    return min(max(score, 0), 100)
```

**validate_entity_status():**
```python
def validate_entity_status(entity_metadata: dict, articulation_score: int) -> str:
    """Returns: 'pass' | 'warning' | 'fail'"""
    if entity_metadata.get("status") == "Missing from source":
        return "fail"
    if articulation_score == 0:
        return "fail"
    if articulation_score < 50:
        return "warning"
    if not entity_metadata.get("description"):
        return "warning"
    return "pass"
```

**detect_missing_entities():**
```python
def detect_missing_entities(business_entities: list[str], mapped_entities: list[dict]) -> list[str]:
    """Compare business request entities with structure.json coverage."""
    business_ids = {e.strip().lower() for e in business_entities}
    mapped_ids = {e["table_id"].strip().lower() for e in mapped_entities}
    return sorted(list(business_ids - mapped_ids))
```

---

### LLM Enhancement Layer (Node 3)

**System Prompt:**
```python
SYSTEM_PROMPT = """You are a metadata quality analyst for enterprise data governance.

You receive DETERMINISTIC validation results (pre-calculated scores, flags, missing entities) and structural metadata. Your task is to:

1. **Assess risk level**: Based on deterministic findings, assign risk:
   - HIGH: P0 blockers present (missing descriptions/owners for >30% entities) OR missing entities from business request
   - MEDIUM: P1 quality issues (low articulation scores 30-70, duplicates) but usable
   - LOW: Minor P2 issues only (>70 avg articulation score)

2. **Generate recommendations**: Prioritize P0→P1→P2 fixes. Be specific:
   - P0 example: "Add description in Collibra for entity dimv_supplier (currently null)"
   - P1 example: "Improve lineage documentation for factv_purchase_order"
   - P2 example: "Add governance tags for dimv_material_group"

3. **Detect anomalies**: Flag structural outliers (unexpected fields, naming inconsistencies, value outliers)

4. **Write executive summary**: 2-3 sentences for non-technical stakeholders.

**IMPORTANT CONSTRAINTS:**
- Do NOT recalculate scores (they are pre-computed deterministically)
- Do NOT hallucinate entity IDs (only reference entities from input)
- Base recommendations on P0-P2 guidelines (description/owner=P0, lineage=P1, tags=P2)
- Be actionable: specify WHERE to fix (Collibra, Unity Catalog) and WHAT to add
"""
```

**LLM Invocation:**
```python
def enhance_with_llm(state: Tool3State) -> dict:
    """Node 3: LLM enhancement layer."""
    print("🤖 Node 3: LLM enhancement...")

    deterministic_summary = {
        "entity_scores": state["entity_scores"],
        "validation_flags": state["validation_flags"],
        "missing_entities": state["missing_entities"],
        "avg_score": sum(state["entity_scores"].values()) / len(state["entity_scores"]),
        "p0_blocker_count": sum(1 for v in state["validation_flags"].values() if v == "fail")
    }

    structure_sample = [...]  # First 3 entities

    agent = create_agent(
        model=AZURE_LLM,
        response_format=ToolStrategy(LLMEnhancement),
        tools=[],
        system_prompt=SYSTEM_PROMPT
    )

    try:
        result = agent.invoke({"messages": [{"role": "user", "content": json.dumps({...})}]})
        llm_enhancements = result["structured_response"]

        # Validate entity IDs (hallucination check)
        valid_ids = {e["table_id"] for e in state["structure"]["facts"] + state["structure"]["dimensions"]}
        for rec in llm_enhancements.recommendations:
            if rec.entity_id and rec.entity_id not in valid_ids:
                print(f"⚠️  LLM hallucinated entity: {rec.entity_id}")
                rec.entity_id = None

        return {"llm_enhancements": llm_enhancements, "llm_fallback_mode": False}
    except Exception as e:
        print(f"❌ LLM call failed: {e}, using fallback")
        return {"llm_enhancements": generate_fallback_enhancements(...), "llm_fallback_mode": True}
```

---

### Concrete Example: End-to-End

**Input structure.json:**
```json
{
  "dimensions": [
    {
      "table_id": "dimv_supplier",
      "table_name": "Systems>dap_gold_prod>dm_bs_purchase>dimv_supplier",
      "business_key": "supplier_id",
      "attributes": ["supplier_name"]
    }
  ]
}
```

**Metadata (dimv_supplier):**
```json
{
  "description": null,
  "owner": null,
  "lineage": "unknown",
  "source_mapping": "Databricks Unity Catalog",
  "dq_rules": null,
  "governance_tags": null,
  "last_updated": "2025-11-03"
}
```

**Node 2 Output:**
```json
{
  "entity_scores": {"dimv_supplier": 25},
  "validation_flags": {"dimv_supplier": "warning"},
  "missing_entities": []
}
```

**Node 3 LLM Output:**
```json
{
  "risk_level": "high",
  "risk_rationale": "P0 blockers: dimv_supplier lacks description+owner. Score 25/100.",
  "recommendations": [
    {
      "priority": "P0",
      "entity_id": "dimv_supplier",
      "issue_type": "MISSING_DESCRIPTION",
      "description": "No business description",
      "action": "Add description in Collibra: 'Supplier master data from SAP'",
      "estimated_impact": "+20 articulation score"
    }
  ],
  "anomaly_notes": [],
  "summary": "High risk. Immediate P0 action required: Add descriptions and ownership."
}
```

**Node 4 Final Output (quality_report.json):**
```json
{
  "schema_version": "1.0.0",
  "timestamp": "2025-11-04T20:15:00Z",
  "articulation_scores": {"dimv_supplier": 25},
  "validation_results": {"dimv_supplier": "warning"},
  "missing_from_source": [],
  "risk_level": "high",
  "recommendations": [...],
  "metrics": {
    "total_entities": 1,
    "avg_articulation_score": 25.0,
    "entities_with_issues": 1,
    "p0_blockers": 2,
    "coverage": 0.0
  }
}
```

---

### CLI Command

**Usage:**
```bash
python3 src/tool3/validator.py \
  --structure data/tool2/structure.json \
  --business-context data/tool0_samples/2025-10-31T01:14:27.960789.json \
  --output data/tool3/quality_report.json \
  --verbose
```

**Or via LangGraph:**
```python
from src.tool3.validator import graph

result = graph.invoke({
    "structure_path": "data/tool2/structure.json",
    "business_context_path": "data/tool0_samples/2025-10-31T01:14:27.960789.json"
})

print(f"Risk level: {result['final_report'].risk_level}")
print(f"P0 blockers: {result['final_report'].metrics['p0_blockers']}")
```

---

### Performance & Cost

**Timing Breakdown (target <15s):**
- Node 1 (load): <1s
- Node 2 (calculate): <3s
- Node 3 (enhance): <10s (LLM call)
- Node 4 (save): <1s

**Cost:** ~$0.01 per run (4000 input + 1500 output tokens)

---

## Risks & Considerations

- Nekonzistentní struktura `structure.json` → nutné verzování schématu a fallback na deterministické kontroly.
- LLM může vracet halucinace → validovat doporučení proti známým entitám, limitovat systémový prompt.
- Citlivá data v artefaktech → anonymizace identifikátorů před uložením do `scrum/artifacts/`.
- **LLM timeout:** Implementovat retry s exponential backoff (3 attempts, 10s → 20s → 30s)
- **Fallback quality:** Generic recommendations z fallback mode mohou být méně actionable než LLM-generated

---

## Implementation Outline

### Phase 1: Setup & Schemas (1-2h)
1. Create `src/tool3/schemas.py` s Pydantic schemas (copy from Notes)
2. Create test fixtures in `data/tool3_samples/`
3. Review Tool 1/2 notebooks for patterns

### Phase 2: Node Implementation (3-4h)
4. Implement Node 1 (load_and_validate)
5. Implement Node 2 (calculate_deterministic) - copy pseudokód from Notes
6. Implement Node 3 (enhance_with_llm) - LLM agent s ToolStrategy
7. Implement Node 4 (merge_and_serialize)
8. Build LangGraph StateGraph

### Phase 3: CLI, Tests, Docs (2-3h)
9. Add CLI interface (argparse)
10. Create `notebooks/tool3_quality_demo.ipynb`
11. Unit tests (`tests/test_tool3_validator.py`)
12. Documentation (`src/tool3/README.md`)

### Phase 4: Validation (1h)
13. Run compliance checker
14. Run backlog validator
15. Update story metadata (status=done, skill_created=true)
16. Performance baseline (10 runs, measure timing)

**Estimated Total: 7-10 hours**

**Success Criteria:**
- All AC checkboxes ✅
- Compliance checker passes
- Performance <15s
- quality_report.json validates against schema
