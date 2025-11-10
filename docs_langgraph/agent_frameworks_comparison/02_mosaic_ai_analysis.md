# Mosaic AI Agent Framework - Podrobná analýza

**Datum:** 2025-11-08
**Kontext:** Srovnání LangGraph vs Mosaic AI Agent Framework pro MCOP projekt

---

## 🎯 TL;DR - Doporučení pro MCOP

**HYBRID APPROACH = Best of Both Worlds**

```python
# LangGraph workflow + Mosaic AI deployment (100% Databricks-native)
from langgraph.graph import StateGraph
from databricks import agents
import mlflow

# Custom checkpointer - persistence v Unity Catalog (viz 01_langgraph_analysis.md)
from custom_checkpointers import DeltaLakeCheckpointer

# 1. Build complex workflow in LangGraph
graph = StateGraph(MCOPState)
graph.add_node("tool0_parse", tool0_node)
graph.add_node("tool1_ingest", tool1_node)
graph.add_conditional_edges("tool3_quality", should_retry)  # ✅ Conditionals

# Unity Catalog checkpointer - ŽÁDNÝ external Postgres!
checkpointer = DeltaLakeCheckpointer(table_name="main.mcop.agent_checkpoints")
compiled_graph = graph.compile(checkpointer=checkpointer, interrupt_before=["human_review"])  # ✅ Human-in-loop

# 2. Wrap do MLflow model
class MCOPAgent(mlflow.pyfunc.PythonModel):
    def load_context(self, context):
        self.graph = compiled_graph
    def predict(self, context, model_input):
        return self.graph.invoke(...)

# 3. Deploy přes Mosaic AI → automaticky do Unity Catalog!
mlflow.pyfunc.log_model("agent", python_model=MCOPAgent())
agents.deploy(model_name="main.mcop.metadata_agent")  # ✅ Model v UC: main.mcop.metadata_agent
```

**Co získáš (100% Unity Catalog):**
- ✅ **LangGraph**: Complex workflows, human-in-loop, conditional retry logic
- ✅ **Mosaic AI**: Unity Catalog governance, automatic monitoring, Review App
- ✅ **MLflow**: Automatic tracing všech LangGraph stepů
- ✅ **Production-ready**: REST API, dashboards, inference tables
- ✅ **Checkpoints v UC**: `main.mcop.agent_checkpoints` Delta table
- ✅ **Agent model v UC**: `main.mcop.metadata_agent` (verzování, lineage, ACLs)
- ✅ **ŽÁDNÉ external dependencies**: Postgres ❌, Redis ❌

**Vše v Unity Catalog:**
- Agent model: `main.mcop.metadata_agent`
- Checkpoints: `main.mcop.agent_checkpoints`
- Inference logs: `main.mcop.metadata_agent_inference_table`
- Business data: `main.mcop.*` (Collibra mappings, quality scores)

---

## Co je Mosaic AI Agent Framework?

**Mosaic AI Agent Framework** je **Databricks-native platforma** pro vývoj, deployment a monitoring AI agentů. Je postavená na **MLflow 3** a tight integrovaná s **Unity Catalog**, **Model Serving** a **Agent Evaluation**.

### Klíčové vlastnosti

1. **Library-agnostic**
   - Podporuje LangChain, LangGraph, OpenAI SDK, pure Python
   - Wrappuješ libovolný agent do MLflow Model

2. **MLflow 3 integrace**
   - Automatic tracing (každý krok agenta logovaný)
   - Experiment tracking (parametry, metriky, artifacts)
   - Model Registry (verzování v Unity Catalog)

3. **Deployment na Model Serving**
   - REST API endpoint s auto-scaling
   - Built-in authentication (Unity Catalog passthrough)
   - Monitoring dashboards (latency, cost, error rates)

4. **Agent Evaluation**
   - LLM-as-judge metrics (relevance, groundedness)
   - Human feedback collection (Review App)
   - Cost & latency tracking

5. **Unity Catalog governance**
   - Model lineage (data → features → agent → deployment)
   - Access control (kdo může deploy/invoke)
   - Audit log (kdo, kdy, co změnil)

---

## Architektura

```
┌─────────────────────────────────────────────────┐
│  Agent Code (LangChain/LangGraph/OpenAI/Python) │
└───────────────────┬─────────────────────────────┘
                    │
        ┌───────────▼──────────┐
        │  MLflow 3 Wrapper    │
        │  - ChatAgent         │
        │  - predict()         │
        │  - Tracing enabled   │
        └───────────┬──────────┘
                    │
        ┌───────────▼──────────┐
        │  Unity Catalog       │
        │  Model Registry      │
        │  - Versioning        │
        │  - Lineage           │
        │  - ACLs              │
        └───────────┬──────────┘
                    │
        ┌───────────▼──────────┐
        │  Model Serving       │
        │  - REST API          │
        │  - Auto-scaling      │
        │  - Monitoring        │
        └───────────┬──────────┘
                    │
        ┌───────────▼──────────┐
        │  Inference Tables    │
        │  - Request/Response  │
        │  - Traces            │
        │  - Feedback          │
        └──────────────────────┘
```

---

## Persistence & State Management

### Rozdíl oproti LangGraph

**LangGraph:**
- Explicitní checkpointers (Postgres, Redis, custom)
- Thread-based conversation memory
- Cross-thread stores

**Mosaic AI:**
- **Stateless by default** (každý request je independent)
- State management je na tobě:
  - Můžeš použít LangGraph checkpointer UVNITŘ agent kódu
  - NEBO custom state storage (Delta table, Redis)

### Jak řešit persistence v Mosaic AI?

**Option 1: Stateless agent (recommended pro MCOP)**

Každý request obsahuje všechen kontext:
```python
from mlflow.models import ChatAgent, ChatAgentResponses

class MCOPAgent(ChatAgent):
    def predict(self, request):
        # Request obsahuje celý business request + předchozí kroky
        business_request = request["messages"][-1]["content"]

        # Run Tool 0-7 pipeline
        parsed = tool0_parse(business_request)
        ingested = tool1_ingest(parsed)
        mappings = tool2_structure(ingested)
        quality = tool3_quality(mappings)

        # Return final result
        return ChatAgentResponses(messages=[{
            "role": "assistant",
            "content": json.dumps(quality)
        }])

# Log to Unity Catalog
mlflow.pyfunc.log_model(
    artifact_path="agent",
    python_model=MCOPAgent(),
    registered_model_name="main.mcop.metadata_agent"
)
```

**Pro/Con:**
- ✅ Jednoduché, žádný external state store
- ✅ Scale-to-zero friendly (žádný warm state)
- ❌ Nemůžeš interrompovat pipeline (human-in-loop složitější)
- ❌ Každý request musí rekalkulovat všechno

---

**Option 2: State v Delta table**

Ukládáš mezivýsledky do Unity Catalog:
```python
class MCOPStatefulAgent(ChatAgent):
    def __init__(self):
        self.state_table = "main.mcop.agent_state"

    def predict(self, request):
        thread_id = request.get("thread_id", uuid4())

        # Load previous state
        state = self._load_state(thread_id)

        # Run next step
        if not state.get("parsed"):
            parsed = tool0_parse(request["messages"][-1]["content"])
            state["parsed"] = parsed
            self._save_state(thread_id, state)

        elif not state.get("ingested"):
            ingested = tool1_ingest(state["parsed"])
            state["ingested"] = ingested
            self._save_state(thread_id, state)

        # ... atd

        return ChatAgentResponses(messages=[{
            "role": "assistant",
            "content": f"Completed step: {state.get('current_step')}"
        }])

    def _save_state(self, thread_id, state):
        spark.createDataFrame([{
            "thread_id": thread_id,
            "state_json": json.dumps(state),
            "updated_at": datetime.now()
        }]).write.mode("append").saveAsTable(self.state_table)
```

**Pro/Con:**
- ✅ State je v Unity Catalog (governance)
- ✅ Můžeš resume pipeline
- ❌ Latence (SQL warehouse overhead)
- ❌ Musíš spravovat state lifecycle (TTL, cleanup)

---

## ⭐ **Option 3: Embedded LangGraph s DeltaLakeCheckpointer (DOPORUČENO pro MCOP)**

**Tohle je nejlepší řešení pro production MCOP agenta - 100% Unity Catalog native!**

Použiješ LangGraph UVNITŘ agent kódu s custom checkpointerem:
```python
from langgraph.graph import StateGraph
from custom_checkpointers import DeltaLakeCheckpointer  # Implementace v 01_langgraph_analysis.md

class MCOPLangGraphAgent(ChatAgent):
    def __init__(self):
        # Build LangGraph
        builder = StateGraph(MCOPState)
        # ... add nodes

        # Unity Catalog checkpointer - ŽÁDNÝ external Postgres!
        checkpointer = DeltaLakeCheckpointer(
            table_name="main.mcop.agent_checkpoints",
            catalog="main",
            schema="mcop"
        )
        self.graph = builder.compile(checkpointer=checkpointer)

    def predict(self, request):
        thread_id = request.get("thread_id", "default")
        config = {"configurable": {"thread_id": thread_id}}

        # Run graph (uses checkpointer internally)
        result = self.graph.invoke(
            {"business_request_md": request["messages"][-1]["content"]},
            config=config
        )

        return ChatAgentResponses(messages=[{
            "role": "assistant",
            "content": json.dumps(result)
        }])
```

**Pro/Con:**
- ✅✅✅ **Best of both worlds** (LangGraph flexibility + Mosaic AI deployment)
- ✅ **Všechny LangGraph features**: human-in-loop, time-travel, conditional edges, subgraphs
- ✅ **Všechny Mosaic AI benefits**: Unity Catalog governance, automatic monitoring, Review App
- ✅ **MLflow tracing**: Automaticky loguje všechny LangGraph node executions
- ✅ **Zero-config deployment**: Jeden příkaz `agents.deploy()`
- ✅ **100% Unity Catalog**: Checkpoints v Delta table, žádný external Postgres/Redis
- ✅ **SQL analytics**: `SELECT * FROM main.mcop.agent_checkpoints WHERE thread_id = '...'`
- ✅ **Lineage tracking**: Agent → checkpoints → business data (vše v UC)
- ⚠️ Custom checkpointer (~100 řádků kódu, ale reusable)

**Proč je tohle ideální pro MCOP:**
- Tool 3 quality check může conditional retry Tool 2 (LangGraph edges)
- Business analyst může approve každý step (interrupt_before)
- Mosaic AI zajistí governance, monitoring, cost tracking
- **DeltaLakeCheckpointer = vše v Unity Catalog (agent model, checkpoints, inference logs, business data)**
- **ŽÁDNÉ external dependencies** - Postgres ❌, Redis ❌, jen Databricks

**Unity Catalog integrace - všechno na jednom místě:**
```sql
-- Vše v catalog main.mcop
SHOW TABLES IN main.mcop;
-- metadata_agent (model - Mosaic AI)
-- agent_checkpoints (LangGraph state - DeltaLakeCheckpointer)
-- metadata_agent_inference_table (request/response logs - Mosaic AI)
-- collibra_mappings (business data - Tool 2 output)

-- Lineage query
SELECT
  'Agent: main.mcop.metadata_agent' as component,
  'Reads from: main.mcop.agent_checkpoints' as dependency
UNION ALL
SELECT
  'Agent: main.mcop.metadata_agent',
  'Writes to: main.mcop.metadata_agent_inference_table'
UNION ALL
SELECT
  'Agent: main.mcop.metadata_agent',
  'Writes to: main.mcop.collibra_mappings';
```

---

## 🚀 MCOP Hybrid Architecture - Kompletní příklad

**LangGraph workflow + Mosaic AI deployment = Production-ready MCOP agent**

### 1. Build LangGraph workflow

```python
from langgraph.graph import StateGraph, END
from custom_checkpointers import DeltaLakeCheckpointer  # Unity Catalog native
from typing import TypedDict, Annotated
import operator

# State schema
class MCOPState(TypedDict):
    business_request_md: str
    parsed: dict
    metadata: dict
    mappings: dict
    quality: dict
    retry_count: int
    needs_human_review: bool
    human_approved: bool

# Nodes (Tool 0-7)
def tool0_parse(state: MCOPState):
    parsed = parse_business_request(state["business_request_md"])
    return {"parsed": parsed}

def tool1_ingest(state: MCOPState):
    metadata = fetch_metadata(state["parsed"]["entities"])
    return {"metadata": metadata}

def tool2_structure(state: MCOPState):
    mappings = create_mappings(state["metadata"], state["parsed"])
    return {"mappings": mappings}

def tool3_quality(state: MCOPState):
    quality = validate_quality(state["mappings"])
    return {"quality": quality, "retry_count": state.get("retry_count", 0) + 1}

def human_review_node(state: MCOPState):
    # Interrupt here - čeká na human_approved flag
    return {"needs_human_review": True}

# Conditional edges
def should_retry(state: MCOPState):
    if state["quality"]["score"] < 0.7 and state["retry_count"] < 3:
        return "tool2_structure"  # Retry mapping
    elif state["quality"]["critical_issues"]:
        return "human_review"  # Human approval needed
    else:
        return END

def after_human_review(state: MCOPState):
    if state.get("human_approved"):
        return END
    else:
        return "tool2_structure"  # Human requested changes

# Build graph
builder = StateGraph(MCOPState)
builder.add_node("tool0_parse", tool0_parse)
builder.add_node("tool1_ingest", tool1_ingest)
builder.add_node("tool2_structure", tool2_structure)
builder.add_node("tool3_quality", tool3_quality)
builder.add_node("human_review", human_review_node)

builder.set_entry_point("tool0_parse")
builder.add_edge("tool0_parse", "tool1_ingest")
builder.add_edge("tool1_ingest", "tool2_structure")
builder.add_edge("tool2_structure", "tool3_quality")
builder.add_conditional_edges("tool3_quality", should_retry)
builder.add_conditional_edges("human_review", after_human_review)

# Compile with Unity Catalog checkpointer
checkpointer = DeltaLakeCheckpointer(
    table_name="main.mcop.agent_checkpoints",
    catalog="main",
    schema="mcop"
)

mcop_graph = builder.compile(
    checkpointer=checkpointer,
    interrupt_before=["human_review"]  # ✅ Human-in-loop
)
```

### 2. Wrap do MLflow model

```python
import mlflow
from mlflow.pyfunc import PythonModel

class MCOPLangGraphAgent(PythonModel):
    def load_context(self, context):
        # Load artifacts (graph už máš compiled)
        self.graph = mcop_graph

    def predict(self, context, model_input):
        thread_id = model_input.get("thread_id", str(uuid4()))
        config = {
            "configurable": {"thread_id": thread_id}
        }

        # Check if resuming interrupted workflow
        if model_input.get("human_approved") is not None:
            # Resume after human review
            state = self.graph.get_state(config)
            state.values["human_approved"] = model_input["human_approved"]
            self.graph.update_state(config, state.values)

        # Run graph (nebo resume)
        result = self.graph.invoke(
            {"business_request_md": model_input.get("business_request", "")},
            config=config
        )

        return {
            "thread_id": thread_id,
            "parsed": result.get("parsed"),
            "mappings": result.get("mappings"),
            "quality": result.get("quality"),
            "needs_human_review": result.get("needs_human_review", False)
        }
```

### 3. Log & deploy přes Mosaic AI

```python
import mlflow
from databricks import agents

mlflow.set_experiment("/Users/minarovic@metawizards.com/mcop-langgraph-hybrid")

# Enable automatic tracing
mlflow.langchain.autolog()  # ✅ Traces all LangGraph nodes

with mlflow.start_run():
    logged_model = mlflow.pyfunc.log_model(
        artifact_path="agent",
        python_model=MCOPLangGraphAgent(),
        registered_model_name="main.mcop.metadata_agent_langgraph",
        pip_requirements=[
            "langgraph>=0.2.0",
            "langchain>=0.3.0",
            "databricks-sdk>=0.73.0",
            # ŽÁDNÝ psycopg2 - používáme DeltaLakeCheckpointer!
        ],
        signature=mlflow.models.infer_signature(
            model_input={"business_request": "...", "thread_id": "..."},
            model_output={"parsed": {}, "mappings": {}, "quality": {}}
        )
    )

# Deploy to Model Serving → automaticky do Unity Catalog!
deployment = agents.deploy(
    model_name="main.mcop.metadata_agent_langgraph",  # UC: main.mcop.metadata_agent_langgraph
    model_version=logged_model.registered_model_version,
    scale_to_zero_enabled=True,
    environment_vars={
        # ŽÁDNÝ Postgres URI - DeltaLakeCheckpointer používá Databricks natively!
        "AZURE_OPENAI_ENDPOINT": "{{secrets/mcop/azure-endpoint}}",
        "AZURE_OPENAI_API_KEY": "{{secrets/mcop/azure-key}}"
    }
)

print(f"✅ Hybrid agent deployed: {deployment.endpoint_url}")
print(f"✅ Review App: {deployment.review_app_url}")
print(f"✅ Monitoring: Databricks ML > Serving > main-mcop-metadata_agent_langgraph")
print(f"✅ Unity Catalog model: main.mcop.metadata_agent_langgraph")
print(f"✅ Checkpoints table: main.mcop.agent_checkpoints")
```

### 4. Invoke s human-in-loop workflow

```python
import requests

# Initial request
response = requests.post(
    deployment.endpoint_url,
    headers={"Authorization": f"Bearer {os.getenv('DATABRICKS_TOKEN')}"},
    json={
        "business_request": open("data/sample_request.md").read(),
        "thread_id": "req-2025-11-08-001"
    }
)

result = response.json()

# Check if human review needed
if result["needs_human_review"]:
    print("⏸️  Workflow paused - human approval required")
    print(f"Thread ID: {result['thread_id']}")
    print(f"Quality issues: {result['quality']['critical_issues']}")

    # Business analyst reviews in Review App or via API
    # ...

    # Resume with approval
    resume_response = requests.post(
        deployment.endpoint_url,
        headers={"Authorization": f"Bearer {os.getenv('DATABRICKS_TOKEN')}"},
        json={
            "thread_id": "req-2025-11-08-001",
            "human_approved": True  # ✅ Approved
        }
    )

    final_result = resume_response.json()
    print("✅ Workflow completed after human approval")
else:
    print("✅ Workflow completed without human intervention")
```

### 5. Co získáš tímto přístupem?

**LangGraph benefits:**
- ✅ Conditional retry logic (Tool 3 → retry Tool 2)
- ✅ Human-in-loop breaks (interrupt_before)
- ✅ State persistence (PostgresSaver nebo DeltaLakeCheckpointer)
- ✅ Time-travel debugging (get_state, update_state)
- ✅ Multi-step workflows s branching

**Mosaic AI benefits:**
- ✅ Zero-config deployment (`agents.deploy()`)
- ✅ Unity Catalog governance (lineage, ACLs)
- ✅ Automatic monitoring dashboards
- ✅ Inference tables (request/response logging)
- ✅ Review App (stakeholder feedback)
- ✅ MLflow tracing (všechny LangGraph nodes viditelné)
- ✅ Cost tracking (token usage per request)

**Production monitoring:**
```sql
-- Analýza success rate v MLflow
SELECT
  DATE(timestamp) as date,
  COUNT(*) as total_requests,
  SUM(CASE WHEN json_extract(output, '$.needs_human_review') = 'true' THEN 1 ELSE 0 END) as human_review_needed,
  AVG(CAST(json_extract(output, '$.quality.score') AS DOUBLE)) as avg_quality_score,
  AVG(latency_ms) as avg_latency_ms
FROM main.mcop.metadata_agent_langgraph_inference_table
WHERE timestamp >= current_date() - INTERVAL 7 DAYS
GROUP BY date
ORDER BY date
```

---

## Silné stránky Mosaic AI

### 1. **Zero-config deployment**

Jedno volání `agents.deploy()`:
```python
from databricks import agents

deployment = agents.deploy(
    model_name="main.mcop.metadata_agent",
    model_version=1,
    scale_to_zero_enabled=True
)

# ✅ REST API endpoint ready
# ✅ Monitoring dashboards enabled
# ✅ Review App available
```

Oproti LangGraph (manual setup):
- MLflow model packaging
- Serving endpoint creation
- Authentication config
- Monitoring setup

---

### 2. **Built-in Review App**

Automatický chat UI pro stakeholder feedback:
```python
deployment = agents.deploy(..., enable_review_app=True)

# Stakeholders můžou chatovat s agentem
# Thumbs up/down feedback automaticky logován
# LLM judges vyhodnotí kvalitu odpovědí
```

**Use case pro MCOP:**
- Business analyst testuje parsed requests
- Data steward validuje entity mappings
- Feedback jde do MLflow → iterative improvement

---

### 3. **Agent Evaluation framework**

```python
import mlflow

# Evaluation set (ground truth)
eval_data = pd.DataFrame([
    {"request": "...", "expected_entities": ["Customer", "Order"]},
    # ...
])

# Run evaluation
with mlflow.start_run():
    results = mlflow.evaluate(
        model="main.mcop.metadata_agent",
        data=eval_data,
        model_type="question-answering",
        evaluators=["default"],  # Includes LLM-as-judge
    )

# Metrics logged to MLflow
# - Relevance score
# - Groundedness
# - Token usage
# - Latency
```

**Pro/Con:**
- ✅ Out-of-box metrics
- ✅ LLM judges (no manual labeling)
- ✅ Cost tracking (token usage)
- ❌ Méně flexibilní než custom evaluace

---

### 4. **Unity Catalog governance**

Každý agent model v UC má:
- **Lineage:** Které datasety/features použil
- **Access control:** Kdo může deploy/invoke
- **Audit log:** Historie změn (kdo, kdy, proč)

```python
# Model je v UC
model_fqn = "main.mcop.metadata_agent"

# Access control
spark.sql(f"GRANT USE SCHEMA main.mcop TO `data-analysts`")
spark.sql(f"GRANT EXECUTE ON FUNCTION {model_fqn} TO `business-users`")

# Lineage (automatic)
# Agent → Unity Catalog tables → Collibra API → SAP HANA
```

---

### 5. **MLflow Tracing (automatic)**

Každý krok agenta je automaticky tracován:
```python
import mlflow

mlflow.langchain.autolog()  # Pro LangChain/LangGraph
# NEBO
mlflow.openai.autolog()     # Pro OpenAI SDK

# Traces obsahují:
# - Input/output každého LLM call
# - Tool calls (function names + args)
# - Latency per step
# - Token usage per step
```

**Tracing UI v MLflow:**
- Vidíš celý execution tree
- Můžeš kliknout na každý span → vidíš prompt/response
- Filtruješ slow requests, high-cost requests

---

### 6. **Production monitoring (Inference Tables)**

Každý request/response automaticky logován do Delta table:
```python
# Databricks creates inference table automatically
# main.mcop.metadata_agent_inference_table

# Contains:
# - request_id, timestamp
# - input (user message)
# - output (agent response)
# - trace_id (link to MLflow trace)
# - latency, token_count
```

Můžeš analyzovat:
```sql
SELECT
  DATE(timestamp) as date,
  AVG(latency_ms) as avg_latency,
  SUM(token_count) as total_tokens,
  COUNT(*) as request_count
FROM main.mcop.metadata_agent_inference_table
GROUP BY date
ORDER BY date DESC
```

---

### 7. **AI Gateway integration**

Centralized LLM proxy s governance:
```python
from databricks.ai_gateway import AIGateway

# Všechny LLM calls jdou přes Gateway
gateway = AIGateway()

# Benefits:
# - Rate limiting
# - Cost tracking per user/department
# - PII redaction
# - Request logging
```

---

## Slabé stránky Mosaic AI

### 1. **Vendor lock-in**

- Tight coupled s Databricks (Model Serving, Unity Catalog)
- Migrace mimo Databricks = rewrite deployment layer

### 2. **Méně flexibilní orchestrace**

- Není nativní graph-based workflow
- Conditionals/loops musíš řešit v Python kódu (ne jako LangGraph edges)

### 3. **State management není built-in**

- Pokud potřebuješ stateful agent, musíš řešit persistence sám
- LangGraph má checkpointers out-of-box

### 4. **Human-in-the-loop složitější**

- Není nativní interrupt mechanismus jako LangGraph
- Musíš implementovat custom workflow:
  - Agent vrátí "needs_approval" status
  - Frontend pošle approval request
  - Agent pokračuje

### 5. **Omezený multi-agent support**

- Můžeš mít více agentů, ale orchestrace je manuální
- LangGraph má subgraphs, delegation patterns built-in

---

## Mosaic AI pro MCOP - Use case analýza

### Kdy použít Mosaic AI?

✅ **Ano, když:**

1. **Fast time-to-market je priorita**
   - Out-of-box deployment, monitoring, evaluation
   - Méně boilerplate než LangGraph

2. **Unity Catalog governance je must-have**
   - Lineage tracking (agent → data → Collibra)
   - Access control (kdo může invoke MCOP)
   - Audit log pro compliance

3. **Chceš built-in Review App**
   - Business analyst/data steward feedback collection
   - Thumbs up/down + comments → iterative improvement

4. **Cost/latency monitoring je kritické**
   - Automatic token counting
   - Latency per request v dashboards

5. **Tým nemá zkušenosti s complex orchestration**
   - Simple function-calling model (predict())
   - Není nutné myslet v grafech

6. **Databricks je long-term platforma**
   - Žádné plány na migraci mimo Azure Databricks

---

❌ **Ne, když:**

1. **Potřebuješ complex workflow s conditionals/loops**
   - Tool 3 quality check → retry Tool 2 s jiným promptem
   - LangGraph je lepší pro tyto scénáře

2. **Human-in-the-loop je mandatory**
   - Business analyst musí approve každý step
   - LangGraph má interrupt built-in

3. **Multi-agent orchestration je žádoucí**
   - Každý tool je samostatný specialist agent
   - Coordinator deleguje tasks

4. **Vendor neutralita je priorita**
   - Možnost běhu na AWS/GCP/on-prem
   - Mosaic AI je Databricks-only

5. **Potřebuješ custom evaluation logic**
   - Složitější než LLM-as-judge metrics
   - Custom eval pipeline mimo Databricks

---

## Příklad MCOP architektury s Mosaic AI

### Agent code (simple stateless)

```python
from mlflow.models import ChatAgent, ChatAgentResponses
from databricks.sdk import WorkspaceClient
import json

class MCOPAgent(ChatAgent):
    """Stateless MCOP agent - každý request je independent."""

    def __init__(self):
        self.w = WorkspaceClient()

    def predict(self, request):
        # Extract business request from message
        user_message = request["messages"][-1]["content"]

        # Tool 0: Parse business request
        parsed = self._tool0_parse(user_message)

        # Tool 1: Ingest metadata
        metadata = self._tool1_ingest(parsed["entities"])

        # Tool 2: Structure mappings
        mappings = self._tool2_structure(metadata, parsed)

        # Tool 3: Quality check
        quality = self._tool3_quality(mappings)

        # Return final result
        return ChatAgentResponses(messages=[{
            "role": "assistant",
            "content": json.dumps({
                "parsed_request": parsed,
                "entity_mappings": mappings,
                "quality_score": quality["score"],
                "quality_issues": quality["issues"]
            })
        }])

    def _tool0_parse(self, md_text):
        # Call Azure OpenAI to parse
        from openai import OpenAI
        client = OpenAI(base_url=os.getenv("AZURE_OPENAI_ENDPOINT"), ...)
        # ... parsing logic
        return parsed_dict

    def _tool1_ingest(self, entities):
        # Fetch from Collibra, Databricks UC, SAP
        collibra_assets = fetch_collibra(entities)
        uc_tables = self.w.tables.list(catalog_name="main", schema_name="prod")
        return {"collibra": collibra_assets, "databricks": list(uc_tables)}

    def _tool2_structure(self, metadata, parsed):
        # LLM-based mapping
        # ...
        return mappings

    def _tool3_quality(self, mappings):
        # Quality validation
        score = validate_completeness(mappings)
        issues = find_conflicts(mappings)
        return {"score": score, "issues": issues}
```

### Logging & deployment

```python
import mlflow
from databricks import agents

# Set experiment
mlflow.set_experiment("/Users/minarovic@metawizards.com/mcop-agent")

# Log model
with mlflow.start_run():
    # Enable tracing
    mlflow.openai.autolog()

    # Log agent
    logged_agent = mlflow.pyfunc.log_model(
        artifact_path="agent",
        python_model=MCOPAgent(),
        registered_model_name="main.mcop.metadata_agent",
        pip_requirements=[
            "databricks-sdk>=0.73.0",
            "openai>=1.0.0",
            "requests>=2.31.0"
        ]
    )

# Deploy to serving endpoint
deployment = agents.deploy(
    model_name="main.mcop.metadata_agent",
    model_version=logged_agent.registered_model_version,
    scale_to_zero_enabled=True,
    environment_vars={
        "AZURE_OPENAI_ENDPOINT": "{{secrets/mcop/azure-endpoint}}",
        "AZURE_OPENAI_API_KEY": "{{secrets/mcop/azure-key}}"
    }
)

print(f"Agent deployed: {deployment.endpoint_url}")
# https://<workspace>/serving-endpoints/main-mcop-metadata_agent-1/invocations
```

### Invoke via API

```python
import requests

response = requests.post(
    deployment.endpoint_url,
    headers={"Authorization": f"Bearer {os.getenv('DATABRICKS_TOKEN')}"},
    json={
        "messages": [
            {"role": "user", "content": open("data/sample_request.md").read()}
        ]
    }
)

result = response.json()
print(result["choices"][0]["message"]["content"])
```

---

### Stateful variant (s Delta state table)

```python
class MCOPStatefulAgent(ChatAgent):
    def __init__(self):
        self.state_table = "main.mcop.agent_state"
        self._init_state_table()

    def _init_state_table(self):
        spark = SparkSession.builder.getOrCreate()
        spark.sql(f"""
            CREATE TABLE IF NOT EXISTS {self.state_table} (
                thread_id STRING,
                step STRING,
                state_json STRING,
                updated_at TIMESTAMP
            ) USING DELTA
            PARTITIONED BY (thread_id)
        """)

    def predict(self, request):
        thread_id = request.get("thread_id", str(uuid4()))

        # Load current state
        state = self._load_state(thread_id)

        # Determine next step
        if not state.get("parsed"):
            parsed = self._tool0_parse(request["messages"][-1]["content"])
            state["parsed"] = parsed
            state["current_step"] = "tool0_completed"
            self._save_state(thread_id, state)

            return ChatAgentResponses(messages=[{
                "role": "assistant",
                "content": f"Step 1/4 completed: Business request parsed. Continue to ingest metadata."
            }])

        elif not state.get("ingested"):
            ingested = self._tool1_ingest(state["parsed"]["entities"])
            state["ingested"] = ingested
            state["current_step"] = "tool1_completed"
            self._save_state(thread_id, state)

            return ChatAgentResponses(messages=[{
                "role": "assistant",
                "content": f"Step 2/4 completed: Metadata ingested ({len(ingested['collibra'])} Collibra assets). Continue to structure."
            }])

        # ... tool2, tool3

        else:
            # All steps done
            return ChatAgentResponses(messages=[{
                "role": "assistant",
                "content": json.dumps(state["final_result"])
            }])

    def _load_state(self, thread_id):
        spark = SparkSession.builder.getOrCreate()
        result = spark.sql(f"""
            SELECT state_json FROM {self.state_table}
            WHERE thread_id = '{thread_id}'
            ORDER BY updated_at DESC LIMIT 1
        """).collect()

        return json.loads(result[0]["state_json"]) if result else {}

    def _save_state(self, thread_id, state):
        spark = SparkSession.builder.getOrCreate()
        spark.createDataFrame([{
            "thread_id": thread_id,
            "step": state.get("current_step", "unknown"),
            "state_json": json.dumps(state),
            "updated_at": datetime.now()
        }]).write.mode("append").saveAsTable(self.state_table)
```

**Použití:**
```python
# First request
response1 = invoke_agent({
    "thread_id": "req-2025-11-08-001",
    "messages": [{"role": "user", "content": "Parse business request..."}]
})
# → "Step 1/4 completed"

# Second request (same thread_id)
response2 = invoke_agent({
    "thread_id": "req-2025-11-08-001",
    "messages": [{"role": "user", "content": "Continue"}]
})
# → "Step 2/4 completed"
```

---

## Evaluation workflow

```python
import mlflow
import pandas as pd

# Evaluation dataset
eval_data = pd.DataFrame([
    {
        "request": "Create metadata for Customer entity from SAP CRM...",
        "expected_entities": ["Customer", "Address", "ContactInfo"],
        "expected_quality_score": 0.9
    },
    # ... more examples
])

# Run evaluation
with mlflow.start_run():
    results = mlflow.evaluate(
        model=f"models:/main.mcop.metadata_agent/1",
        data=eval_data,
        model_type="question-answering",
        evaluators=["default"],  # LLM-as-judge
        extra_metrics=[
            mlflow.metrics.latency(),
            mlflow.metrics.token_count(),
        ]
    )

# View results
print(results.metrics)
# {
#   "relevance/v1/mean": 0.85,
#   "groundedness/v1/mean": 0.92,
#   "latency/mean": 3.2,  # seconds
#   "token_count/mean": 1500
# }
```

---

## Monitoring & alerting

```python
# Inference table je auto-created
inference_table = "main.mcop.metadata_agent_inference_table"

# Analýza kvality v čase
spark.sql(f"""
SELECT
  DATE(timestamp) as date,
  AVG(CAST(json_extract(output, '$.quality_score') AS DOUBLE)) as avg_quality,
  COUNT(*) as request_count,
  AVG(latency_ms) as avg_latency_ms
FROM {inference_table}
WHERE timestamp >= current_date() - INTERVAL 7 DAYS
GROUP BY date
ORDER BY date
""").display()

# Alert na quality degradation
alert_query = f"""
SELECT * FROM {inference_table}
WHERE timestamp >= current_timestamp() - INTERVAL 1 HOUR
  AND CAST(json_extract(output, '$.quality_score') AS DOUBLE) < 0.7
"""

# Create Databricks SQL alert
# (via UI nebo API)
```

---

## Summary - Mosaic AI pro MCOP

| Aspekt                        | Hodnocení | Poznámka                                       |
| ----------------------------- | --------- | ---------------------------------------------- |
| **Workflow flexibilita**      | ⭐⭐⭐       | OK pro simple pipelines, limited conditionals  |
| **Persistence na Databricks** | ⭐⭐⭐⭐      | Delta table integration možná (custom code)    |
| **Developer experience**      | ⭐⭐⭐⭐⭐     | Minimal boilerplate, simple predict() model    |
| **Governance & lineage**      | ⭐⭐⭐⭐⭐     | Nativní Unity Catalog, automatic lineage       |
| **Monitoring & debugging**    | ⭐⭐⭐⭐⭐     | Built-in dashboards, inference tables, tracing |
| **Human-in-the-loop**         | ⭐⭐⭐       | Možné, ale není native (custom workflow)       |
| **Multi-agent support**       | ⭐⭐⭐       | Můžeš mít N agentů, ale orchestrace je manual  |
| **Time-to-market**            | ⭐⭐⭐⭐⭐     | Fastest - deploy(), monitoring, eval included  |
| **Vendor lock-in**            | ⭐⭐        | Databricks-only, migrace = rewrite             |

---

## 🎯 Finální doporučení pro MCOP

### ⭐ **Doporučený přístup: LangGraph + Mosaic AI Hybrid**

**Použij tento approach pokud:**

1. ✅ **Potřebuješ complex workflows**
   - Tool 3 quality check → conditional retry Tool 2 s jiným promptem
   - Human approval breaks (business analyst review)
   - Multi-step conditional logic

2. ✅ **Unity Catalog governance je must-have**
   - Lineage tracking (agent → Collibra → UC tables)
   - Access control (kdo může invoke/deploy)
   - Audit log pro compliance

3. ✅ **Chceš production-ready deployment rychle**
   - Zero-config deployment přes `agents.deploy()`
   - Out-of-box monitoring, Review App, inference tables
   - MLflow tracing všech LangGraph stepů

4. ✅ **Databricks je long-term platforma**
   - Žádné plány na migraci mimo Azure Databricks
   - Custom DeltaLakeCheckpointer = vše v Unity Catalog

**Implementace:**
- LangGraph pro workflow orchestration (StateGraph, conditional edges)
- PostgresSaver nebo custom DeltaLakeCheckpointer pro persistence
- MLflow wrapper (PythonModel)
- Mosaic AI deployment (`agents.deploy()`)

---

### Option B: Pure Mosaic AI (stateless)

**Použij pokud:**

1. **Tool 0-7 pipeline je čistě lineární**
   - Žádné conditional retries
   - Žádný human-in-loop
   - Simple sequential execution

2. **Fast MVP je priorita #1**
   - Chceš demo za týden
   - Minimal boilerplate code

3. **Tým nemá zkušenosti s LangGraph**
   - Simple predict() model je intuitivní
   - Není čas učit se grafy

**Omezení:**
- ❌ Nemůžeš interrupt pipeline (žádný human-in-loop)
- ❌ Nemůžeš conditional retry (Tool 3 → Tool 2)
- ❌ Každý request musí rekalkulovat všechno

---

### Option C: Pure LangGraph (mimo Databricks)

**Použij pokud:**

1. **Vendor neutrality je priorita**
   - Možnost běhu na AWS/GCP/on-prem
   - Databricks není long-term platforma

2. **Custom deployment pipeline existuje**
   - Vlastní Kubernetes cluster
   - Custom monitoring stack

**Nevýhody:**
- ❌ Musíš buildnout vlastní deployment (FastAPI, Docker, K8s)
- ❌ Žádná Unity Catalog governance
- ❌ Musíš implementovat vlastní monitoring/tracing

---

**Next:** Side-by-side srovnání a finální doporučení → `03_comparison_summary.md`
