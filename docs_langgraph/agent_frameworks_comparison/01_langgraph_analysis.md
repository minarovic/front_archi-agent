# LangGraph - Podrobná analýza

**Datum:** 2025-11-08
**Kontext:** Srovnání LangGraph vs Mosaic AI Agent Framework pro MCOP projekt

---

## Co je LangGraph?

**LangGraph** je open-source knihovna od LangChain pro tvorbu **stavových, multi-agent aplikací** s LLM. Umožňuje modelovat agenta jako **graf** se samostatnými kroky (nodes) a podmíněnými větvemi (edges).

### Klíčové vlastnosti

1. **Explicitní řízení toku**
   - Definuješ každý krok jako node (funkce)
   - Edges určují přechody mezi kroky
   - Podmíněné větve (conditional edges)
   - Loop mechanismy (self-edges)

2. **Typovaný State**
   - Centrální `State` objekt (TypedDict/Pydantic)
   - Všechny nodes čtou/modifikují state
   - Immutable pattern (každý node vrací nový state)

3. **Persistence & Memory**
   - **Checkpointers** - automatic state snapshots
   - **Threads** - izolované konverzace
   - **Long-term memory** - cross-thread storage

4. **Human-in-the-loop**
   - Přerušení grafu pro lidský vstup
   - Schvalování před kritickými kroky
   - Time-travel (zpětné přehrání stavů)

---

## Persistence na Databricks

### Dostupné checkpointer implementace

LangGraph nabízí několik persistence vrstev:

| Checkpointer    | Use Case                 | Databricks Support          |
| --------------- | ------------------------ | --------------------------- |
| `InMemorySaver` | Lokální vývoj, testování | ✅ Ano (ephemeral)           |
| `SqliteSaver`   | Single-node experimenty  | ✅ Ano (local filesystem)    |
| `PostgresSaver` | Production               | ⚠️ Vyžaduje externí Postgres |
| `RedisSaver`    | Production (low-latency) | ⚠️ Vyžaduje externí Redis    |

### Persistence na Azure Databricks - Řešení

**Problém:**
LangGraph nemá **nativní checkpointer pro Unity Catalog** nebo Delta Lake.

**Řešení 1: PostgresSaver s Azure Database for PostgreSQL**
```python
from langgraph.checkpoint.postgres import PostgresSaver

# Azure Postgres Flexible Server
DB_URI = "postgresql://user:pass@myserver.postgres.database.azure.com/checkpoints"
checkpointer = PostgresSaver.from_conn_string(DB_URI)

graph = builder.compile(checkpointer=checkpointer)
```

**Pros:**
- Standardní LangGraph pattern
- Nativní podpora v LangSmith
- ACID transakce

**Cons:**
- Další služba mimo Databricks
- Extra náklady (Azure Postgres)
- Network latency

---

**Řešení 2: Custom Checkpointer s Delta Lake** (advanced)
```python
from langgraph.checkpoint.base import BaseCheckpointSaver
from databricks.sdk import WorkspaceClient
import json

class DeltaLakeCheckpointer(BaseCheckpointSaver):
    """Custom checkpointer storing state to Unity Catalog Delta table."""

    def __init__(self, catalog: str, schema: str, table: str):
        self.fqn = f"{catalog}.{schema}.{table}"
        self.w = WorkspaceClient()

    def put(self, config, checkpoint, metadata):
        # Serialize checkpoint to JSON
        row = {
            "thread_id": config["configurable"]["thread_id"],
            "checkpoint_id": checkpoint["id"],
            "state": json.dumps(checkpoint),
            "timestamp": datetime.now()
        }
        # INSERT into Delta table via SQL warehouse
        spark.table(self.fqn).write.mode("append").save(row)

    def get(self, config):
        # SELECT latest checkpoint for thread_id
        query = f"""
        SELECT state FROM {self.fqn}
        WHERE thread_id = '{config["configurable"]["thread_id"]}'
        ORDER BY timestamp DESC LIMIT 1
        """
        result = spark.sql(query).collect()
        return json.loads(result[0]["state"]) if result else None
```

**Pros:**
- Vše v Unity Catalog (governance)
- Žádné extra služby
- Lze použít Delta sharing

**Cons:**
- Musíš sám implementovat `BaseCheckpointSaver`
- Latence SQL warehouse může být vyšší než Redis
- Nutná údržba custom kódu

---

**Řešení 3: Hybrid - LangGraph v Databricks + LangSmith persistence**

Když deployuješ LangGraph agent přes **LangSmith Cloud**, persistence je automatická:
```python
# Agent běží na Databricks Model Serving
# Checkpoints se ukládají do LangSmith managed Postgres
graph = builder.compile()  # Žádný checkpointer explicitně
```

**Pros:**
- Zero-config persistence
- Managed by LangSmith
- AI tracing & debugging UI included

**Cons:**
- Data jsou v LangSmith cloudu (ne Unity Catalog)
- Vendor lock-in
- Extra náklady za LangSmith

---

## Silné stránky LangGraph

### 1. **Flexibilita grafu**
- Můžeš modelovat **libovolně složité workflow**
- Conditionals, loops, subgraphs
- Paralelní execution (fan-out/fan-in)

**Příklad:**
```python
# MCOP Tool 0-7 pipeline jako graph
builder = StateGraph(MCOPState)

builder.add_node("tool0_parse", parse_business_request)
builder.add_node("tool1_ingest", ingest_metadata)
builder.add_node("tool2_structure", structure_mapping)
builder.add_node("tool3_quality", quality_check)

# Conditional: pokud quality fails, retry tool2
builder.add_conditional_edges(
    "tool3_quality",
    lambda state: "tool2_structure" if state.quality_score < 0.8 else END
)
```

### 2. **Human-in-the-loop**
- Přerušení grafu pro schválení
- Editace state před pokračováním
- Vhodné pro MCOP: metadata validace před commitem do Collibra

### 3. **Multi-agent orchestrace**
- Každý tool (0-7) může být samostatný subgraph
- Umožňuje delegování úkolů mezi agenty

### 4. **Debugging & Time-travel**
- Replay libovolného checkpointu
- Vidíš přesný state v každém kroku
- MLflow tracing integration

### 5. **Open-source & vendor-neutral**
- Můžeš běžet kdekoliv (AWS, GCP, Azure, on-prem)
- Žádný lock-in do Databricks ekosystému

---

## Slabé stránky LangGraph

### 1. **Persistence není nativně Databricks**
- Potřebuješ externí Postgres/Redis NEBO custom checkpointer
- Není tight integration s Unity Catalog

### 2. **Méně "out-of-box" monitoring**
- MLflow tracing vyžaduje explicitní setup
- Není automatický Review App (musíš použít LangSmith Cloud)

### 3. **Evaluace není vestavěná**
- Musíš použít separátní nástroje (MLflow, LangSmith, custom)
- Není Agent Evaluation z Mosaic AI

### 4. **Deploy vyžaduje boilerplate**
- Musíš wrappovat graf do MLflow Model
- Databricks specific handling (auth, secrets) je manuální

### 5. **Governance**
- Není automatické sledování použitých tools (Unity Catalog Functions)
- Tracking závislostí je manuální

---

## LangGraph pro MCOP - Use case analýza

### Kdy použít LangGraph?

✅ **Ano, když:**

1. **Potřebuješ komplexní workflow orchestraci**
   - Tool 0-7 pipeline má conditional branche
   - Příklad: Tool3 (quality) může failnout → retry Tool2 (structure) s jiným promptem

2. **Chceš human-in-the-loop validaci**
   - Business analyst schvaluje parsed request před ingestion
   - Data steward validuje mappings před commitem do Collibra

3. **Multi-agent systém**
   - Každý tool je samostatný specialist agent
   - Coordinator agent rozhoduje o routing

4. **Potřebuješ full control nad state management**
   - Custom business logic pro merge/conflict resolution
   - Složité rollback scénáře

5. **Vendor neutralita je priorita**
   - Chceš možnost migrovat mimo Databricks
   - Open-source first approach

---

❌ **Ne, když:**

1. **Chceš "out-of-box" Databricks governance**
   - Unity Catalog tracking, lineage
   - Automatic monitoring dashboards

2. **Rychlý time-to-market je kritický**
   - Mosaic AI má méně boilerplate
   - Review App, evaluation included

3. **Persistence MUSÍ být v Unity Catalog**
   - Nechceš spravovat external Postgres/Redis
   - Custom checkpointer je příliš velká investice

4. **Tým nemá zkušenosti s grafy**
   - LangGraph vyžaduje thinking v nodes/edges
   - Mosaic AI je bližší "function calling" mental modelu

---

## Příklad MCOP architektury s LangGraph

### State definice
```python
from typing import TypedDict, List
from pydantic import BaseModel

class Entity(BaseModel):
    name: str
    type: str
    source_system: str

class MCOPState(TypedDict):
    # Input
    business_request_md: str

    # Tool 0 output
    parsed_request: dict

    # Tool 1 output
    collibra_assets: List[dict]
    databricks_tables: List[dict]

    # Tool 2 output
    entity_mappings: List[Entity]

    # Tool 3 output
    quality_score: float
    quality_issues: List[str]

    # Control
    retry_count: int
    approved_by_human: bool
```

### Graph definice
```python
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.postgres import PostgresSaver

# Nodes
def tool0_parse(state: MCOPState) -> MCOPState:
    # Call Azure OpenAI to parse business request
    parsed = parse_business_request(state["business_request_md"])
    return {"parsed_request": parsed}

def tool1_ingest(state: MCOPState) -> MCOPState:
    # Fetch metadata from Collibra, Databricks UC, SAP
    assets = fetch_collibra_metadata(state["parsed_request"]["entities"])
    tables = fetch_databricks_tables(state["parsed_request"]["scope_in"])
    return {"collibra_assets": assets, "databricks_tables": tables}

def tool2_structure(state: MCOPState) -> MCOPState:
    # LLM-based mapping
    mappings = create_entity_mappings(
        state["collibra_assets"],
        state["databricks_tables"],
        state["parsed_request"]
    )
    return {"entity_mappings": mappings}

def tool3_quality(state: MCOPState) -> MCOPState:
    # Quality checks
    score, issues = validate_mappings(state["entity_mappings"])
    return {"quality_score": score, "quality_issues": issues}

def human_review(state: MCOPState) -> MCOPState:
    # Interrupt: wait for approval
    # User can edit mappings via Review UI
    return {"approved_by_human": True}

# Conditional routing
def should_retry(state: MCOPState) -> str:
    if state["quality_score"] < 0.8 and state["retry_count"] < 3:
        return "tool2_structure"
    elif state["quality_score"] >= 0.8:
        return "human_review"
    else:
        return END

# Build graph
builder = StateGraph(MCOPState)

builder.add_node("tool0", tool0_parse)
builder.add_node("tool1", tool1_ingest)
builder.add_node("tool2", tool2_structure)
builder.add_node("tool3", tool3_quality)
builder.add_node("review", human_review)

builder.add_edge("tool0", "tool1")
builder.add_edge("tool1", "tool2")
builder.add_edge("tool2", "tool3")
builder.add_conditional_edges("tool3", should_retry)
builder.add_edge("review", END)

# Compile with Postgres checkpointer
checkpointer = PostgresSaver.from_conn_string(os.getenv("POSTGRES_URI"))
graph = builder.compile(checkpointer=checkpointer)
```

### Spuštění
```python
# Run graph
config = {"configurable": {"thread_id": "request-2025-11-08-001"}}
result = graph.invoke(
    {"business_request_md": open("data/sample_request.md").read()},
    config=config
)

# Resume po human review
graph.invoke(None, config=config)  # Pokračuje z "review" node
```

---

## Persistence v praxi - Databricks specifika

### Option A: Externí Postgres (doporučené pro production)

**Setup:**
1. Azure Database for PostgreSQL Flexible Server
2. Privátní endpoint do Databricks VNet
3. Secret v Unity Catalog

```python
# V notebooku
import os
from databricks.sdk import WorkspaceClient

w = WorkspaceClient()
db_password = w.secrets.get_secret(scope="mcop", key="postgres-password").value

os.environ["POSTGRES_URI"] = f"postgresql://mcop_user:{db_password}@mcop-db.postgres.database.azure.com/checkpoints"
```

**Pro/Con:**
- ✅ Standard LangGraph pattern
- ✅ High-performance (low latency)
- ✅ ACID guarantees
- ❌ Extra cost (~$50-200/měsíc)
- ❌ Další service k údržbě

---

### Option B: Custom Delta Lake Checkpointer

**Implementace:**
```python
from langgraph.checkpoint.base import BaseCheckpointSaver, Checkpoint
from pyspark.sql import SparkSession
import json
from datetime import datetime

class UnityCheckpointer(BaseCheckpointSaver):
    def __init__(self, catalog="main", schema="mcop", table="langgraph_checkpoints"):
        self.table_fqn = f"{catalog}.{schema}.{table}"
        self._init_table()

    def _init_table(self):
        spark = SparkSession.builder.getOrCreate()
        spark.sql(f"""
            CREATE TABLE IF NOT EXISTS {self.table_fqn} (
                thread_id STRING,
                checkpoint_ns STRING,
                checkpoint_id STRING,
                parent_checkpoint_id STRING,
                checkpoint_data STRING,
                metadata_data STRING,
                created_at TIMESTAMP
            ) USING DELTA
            PARTITIONED BY (thread_id)
        """)

    def put(self, config, checkpoint, metadata):
        thread_id = config["configurable"]["thread_id"]
        spark = SparkSession.builder.getOrCreate()

        row = spark.createDataFrame([{
            "thread_id": thread_id,
            "checkpoint_ns": checkpoint.get("ns", ""),
            "checkpoint_id": checkpoint["id"],
            "parent_checkpoint_id": checkpoint.get("parent_id"),
            "checkpoint_data": json.dumps(checkpoint),
            "metadata_data": json.dumps(metadata),
            "created_at": datetime.now()
        }])

        row.write.mode("append").saveAsTable(self.table_fqn)

    def get_tuple(self, config):
        thread_id = config["configurable"]["thread_id"]
        spark = SparkSession.builder.getOrCreate()

        result = spark.sql(f"""
            SELECT checkpoint_data, metadata_data
            FROM {self.table_fqn}
            WHERE thread_id = '{thread_id}'
            ORDER BY created_at DESC
            LIMIT 1
        """).collect()

        if not result:
            return None

        checkpoint = json.loads(result[0]["checkpoint_data"])
        metadata = json.loads(result[0]["metadata_data"])
        return (config, checkpoint, metadata)

    def list(self, config, before=None, limit=None):
        # Implementace pro listing checkpoints
        pass
```

**Použití:**
```python
checkpointer = UnityCheckpointer(catalog="main", schema="mcop")
graph = builder.compile(checkpointer=checkpointer)
```

**Pro/Con:**
- ✅ Vše v Unity Catalog (governance, lineage)
- ✅ Žádné extra služby
- ✅ Delta Lake optimizace (Z-ordering, partitioning)
- ❌ Custom kód k údržbě
- ❌ Vyšší latence než Postgres/Redis (SQL warehouse overhead)
- ❌ Musíš implementovat všechny metody `BaseCheckpointSaver`

---

## Long-term memory (cross-thread)

LangGraph **Store** API pro ukládání memories napříč threads:

```python
from langgraph.store.redis import RedisStore

# Redis jako cross-thread memory
store = RedisStore.from_conn_string("redis://localhost:6379")

def call_model_with_memory(state, config, *, store):
    user_id = config["configurable"]["user_id"]
    namespace = ("user_preferences", user_id)

    # Retrieve past preferences
    memories = store.search(namespace, query=state["current_request"])
    context = "\n".join([m.value["data"] for m in memories])

    # Store new preference
    if "remember" in state["current_request"]:
        store.put(namespace, uuid4(), {"data": "User prefers Czech metadata labels"})

    return call_llm(context + state["current_request"])
```

**Databricks alternative:**
- Použij **Unity Catalog table** místo Redis
- Custom Store implementation podobně jako checkpointer

---

## Summary - LangGraph pro MCOP

| Aspekt                        | Hodnocení | Poznámka                                              |
| ----------------------------- | --------- | ----------------------------------------------------- |
| **Workflow flexibilita**      | ⭐⭐⭐⭐⭐     | Nejlepší pro complex orchestration                    |
| **Persistence na Databricks** | ⭐⭐⭐       | Možné, ale vyžaduje external service nebo custom code |
| **Developer experience**      | ⭐⭐⭐⭐      | Steeper learning curve (graf mental model)            |
| **Governance & lineage**      | ⭐⭐⭐       | Manuální tracking, není nativní UC integration        |
| **Monitoring & debugging**    | ⭐⭐⭐⭐      | MLflow tracing OK, ale vyžaduje setup                 |
| **Human-in-the-loop**         | ⭐⭐⭐⭐⭐     | Nativní podpora, built-in interrupt                   |
| **Multi-agent support**       | ⭐⭐⭐⭐⭐     | Subgraphs, delegation patterns                        |
| **Time-to-market**            | ⭐⭐⭐       | Víc boilerplate než Mosaic AI                         |
| **Vendor lock-in**            | ⭐⭐⭐⭐⭐     | Open-source, portable                                 |

---

## Doporučení pro MCOP

**Použij LangGraph pokud:**

1. Tool 0-7 pipeline má **komplexní conditionals/loops**
   - Např. Quality check může vyžadovat re-run Structure s jiným promptem

2. **Human approval** je mandatory
   - Business analyst musí validovat parsed request
   - Data steward schvaluje mappings před Collibra commitem

3. **Multi-agent pattern** je žádoucí
   - Každý tool je specialist agent
   - Coordinator deleguje tasks

4. **Long-term evolution** směřuje mimo Databricks
   - Možnost deployu na AWS/GCP/on-prem

**Nepoužívej LangGraph pokud:**

1. **Chceš fast prototype** s minimal boilerplate
2. **Unity Catalog governance** je must-have (lineage, tracking)
3. **Review App** a evaluation musí být out-of-box
4. **Tým preferuje simple function-calling model** nad grafovou orchestraci

---

**Next:** Srovnání s Mosaic AI Agent Framework → `02_mosaic_ai_analysis.md`
