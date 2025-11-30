# Component Diagram - MCOP Architecture

Zobrazuje hlavné komponenty systému a ich vzťahy.

## High-Level Component View (Mermaid C4)

```mermaid
C4Context
    title MCOP System Context - Component View

    Person(user, "Data Steward", "Spravuje metadata")

    System_Boundary(mcop, "MCOP System") {
        Container(frontend, "React Frontend", "Vercel", "Chat + Canvas UI")
        Container(backend, "FastAPI Backend", "Railway", "REST + WebSocket API")
        Container(explorer, "Explorer Agent", "Pydantic AI", "Interactive metadata mgmt")
        Container(pipeline, "Pipeline Orchestrator", "Pydantic AI", "Tool 0→1→2→3")
    }

    System_Ext(azure, "Azure OpenAI", "gpt-5-mini LLM")
    System_Ext(collibra, "Collibra API", "Metadata catalog (future)")

    Rel(user, frontend, "Uses", "HTTPS/WebSocket")
    Rel(frontend, backend, "API calls", "REST/WebSocket")
    Rel(backend, explorer, "Delegates queries")
    Rel(backend, pipeline, "Runs pipeline")
    Rel(explorer, azure, "LLM inference")
    Rel(pipeline, azure, "LLM inference")
    Rel(explorer, collibra, "Read/Write metadata", "Future")
```

## Detailed Component Diagram (Mermaid)

```mermaid
graph TB
    subgraph "Frontend Layer (Vercel)"
        ChatPanel[ChatPanel Component]
        Canvas[Canvas Component]
        MermaidDiagram[MermaidDiagram Component]
        WSHook[useWebSocket Hook]
        Store[Zustand Store]

        ChatPanel -->|state| Store
        Canvas -->|state| Store
        Canvas --> MermaidDiagram
        ChatPanel --> WSHook
    end

    subgraph "API Layer (Railway)"
        FastAPI[FastAPI App]
        WSHandler[WebSocket Handler]
        RESTEndpoints[REST Endpoints]
        SessionMgr[SessionManager]

        FastAPI --> WSHandler
        FastAPI --> RESTEndpoints
        WSHandler --> SessionMgr
        RESTEndpoints --> SessionMgr
    end

    subgraph "Business Logic (Railway)"
        Explorer[Explorer Agent]
        Orchestrator[Pipeline Orchestrator]

        subgraph "Explorer Tools"
            ListTables[list_tables]
            GetTable[get_table_details]
            FindRel[find_relationships]
            SearchCol[search_columns]
            GetLineage[get_lineage]
        end

        subgraph "Pipeline Tools"
            Tool0[Tool 0: Parser]
            Tool1[Tool 1: Mapper]
            Tool2[Tool 2: Classifier]
            Tool3[Tool 3: Validator]
            Tool5[Tool 5: Diagram Gen]
        end

        Explorer --> ListTables
        Explorer --> GetTable
        Explorer --> FindRel
        Explorer --> SearchCol
        Explorer --> GetLineage

        Orchestrator --> Tool0
        Tool0 --> Tool1
        Tool1 --> Tool2
        Tool2 --> Tool3
        Tool3 --> Tool5
    end

    subgraph "Data Layer"
        MockCollibra[Mock Collibra Client]
        JSONDump[(JSON Dump File)]
        Sessions[(In-Memory Sessions)]

        MockCollibra --> JSONDump
        SessionMgr --> Sessions
    end

    subgraph "External Services"
        AzureOpenAI[Azure OpenAI API]
        CollibraReal[Collibra API<br/>Future]
    end

    %% Connections
    WSHook -->|WebSocket| WSHandler
    RESTEndpoints -->|HTTP| RESTEndpoints

    WSHandler --> Explorer
    RESTEndpoints --> Orchestrator

    ListTables --> MockCollibra
    GetTable --> MockCollibra
    FindRel --> MockCollibra
    SearchCol --> MockCollibra
    GetLineage --> MockCollibra

    Explorer -->|LLM calls| AzureOpenAI
    Orchestrator -->|LLM calls| AzureOpenAI

    MockCollibra -.->|future| CollibraReal

    style ChatPanel fill:#4f46e5,color:#fff
    style Canvas fill:#4f46e5,color:#fff
    style Explorer fill:#10b981,color:#fff
    style Orchestrator fill:#10b981,color:#fff
    style MockCollibra fill:#f59e0b,color:#000
    style AzureOpenAI fill:#06b6d4,color:#fff
```

## Component Responsibilities

### Frontend Components

| Component          | Responsibility                                 | Tech Stack      |
| ------------------ | ---------------------------------------------- | --------------- |
| **ChatPanel**      | User input, message history, streaming display | React + Zustand |
| **Canvas**         | Mermaid diagram container, view switching      | React           |
| **MermaidDiagram** | Renders ER diagrams from Mermaid code          | mermaid.js      |
| **useWebSocket**   | WebSocket connection management, reconnection  | WebSocket API   |
| **Zustand Store**  | Global state (messages, diagram, session)      | Zustand         |

### Backend Components

| Component             | Responsibility                        | Tech Stack          |
| --------------------- | ------------------------------------- | ------------------- |
| **FastAPI App**       | HTTP server, routing, middleware      | FastAPI             |
| **WebSocket Handler** | Real-time bidirectional communication | Starlette WebSocket |
| **REST Endpoints**    | Pipeline execution, status checks     | FastAPI routes      |
| **SessionManager**    | Session CRUD, in-memory storage       | Python dict (MVP)   |

### Business Logic Components

| Component                 | Responsibility                    | Dependencies                |
| ------------------------- | --------------------------------- | --------------------------- |
| **Explorer Agent**        | NL query → tool calls → response  | Pydantic AI, Azure OpenAI   |
| **Pipeline Orchestrator** | Sequential Tool 0→1→2→3 execution | Pydantic AI, existing tools |
| **Explorer Tools**        | Collibra API wrapper functions    | Mock Collibra Client        |
| **Pipeline Tools**        | Refactored tools from notebooks   | Existing implementations    |

### Data Layer Components

| Component                | Responsibility                    | Storage                |
| ------------------------ | --------------------------------- | ---------------------- |
| **Mock Collibra Client** | Simulates Collibra REST API       | JSON file              |
| **In-Memory Sessions**   | Temporary session state (MVP)     | Python dict            |
| **JSON Dump**            | Static Collibra metadata snapshot | `data/analysis/*.json` |

## Component Interface Contracts

### Explorer Agent → Mock Collibra

```python
class CollibraAPIMock:
    def list_tables() -> list[dict]
    def get_table(name: str) -> dict
    def get_relationships(table: str) -> list[dict]
    def search_columns(pattern: str) -> list[dict]
    def get_lineage(table: str) -> dict
```

### Frontend ↔ Backend (WebSocket)

```typescript
// Client → Server
{
  "content": string  // User message
}

// Server → Client
{
  "type": "user" | "agent_partial" | "agent" | "tool" | "error",
  "content": string,
  "tool_name"?: string,
  "diagram"?: string  // Mermaid code
}
```

### Frontend ↔ Backend (REST)

```python
# POST /api/pipeline/run
Request: { "document": str }
Response: { "session_id": str, "status": str }

# GET /api/pipeline/{session_id}/status
Response: { "status": str, "has_result": bool, "has_diagram": bool }

# GET /api/diagram/{session_id}
Response: { "diagram": str, "format": "mermaid" }
```

## PlantUML Alternative (Detailed)

```plantuml
@startuml MCOP_Component_Diagram
!theme plain
skinparam componentStyle rectangle

package "Frontend (Vercel)" {
    [ChatPanel] as Chat
    [Canvas] as Canvas
    [MermaidDiagram] as Mermaid
    [useWebSocket Hook] as WSHook
    [Zustand Store] as Store

    Chat -down-> Store
    Canvas -down-> Store
    Canvas --> Mermaid
    Chat --> WSHook
}

package "Backend (Railway)" {
    [FastAPI App] as API
    [WebSocket Handler] as WS
    [REST Endpoints] as REST
    [SessionManager] as SM

    API --> WS
    API --> REST
    WS --> SM
    REST --> SM
}

package "Business Logic" {
    [Explorer Agent] as Explorer
    [Pipeline Orchestrator] as Pipeline

    package "Explorer Tools" {
        [list_tables()] as T1
        [get_table_details()] as T2
        [find_relationships()] as T3
        [search_columns()] as T4
        [get_lineage()] as T5
    }

    package "Pipeline Tools" {
        [Tool 0: Parser] as P0
        [Tool 1: Mapper] as P1
        [Tool 2: Classifier] as P2
        [Tool 3: Validator] as P3
        [Tool 5: Diagram] as P5
    }

    Explorer --> T1
    Explorer --> T2
    Explorer --> T3
    Explorer --> T4
    Explorer --> T5

    Pipeline --> P0
    P0 --> P1
    P1 --> P2
    P2 --> P3
    P3 --> P5
}

package "Data Layer" {
    [Mock Collibra Client] as Mock
    database "JSON Dump" as JSON
    database "In-Memory\nSessions" as Mem

    Mock --> JSON
    SM --> Mem
}

cloud "External Services" {
    [Azure OpenAI] as Azure
    [Collibra API\n(Future)] as Collibra
}

' Connections
WSHook --> WS : WebSocket
REST ..> REST : HTTP

WS --> Explorer
REST --> Pipeline

T1 --> Mock
T2 --> Mock
T3 --> Mock
T4 --> Mock
T5 --> Mock

Explorer --> Azure : LLM
Pipeline --> Azure : LLM

Mock ..> Collibra : future

@enduml
```

## Deployment View

```mermaid
graph LR
    subgraph "Vercel Edge Network"
        FE[Frontend Static Assets]
    end

    subgraph "Railway Cloud"
        BE[Backend Container]
        BE_Data[/data/ Volume]
    end

    subgraph "Azure Cloud"
        OpenAI[OpenAI Service]
    end

    User([User Browser])

    User -->|HTTPS| FE
    User -->|WebSocket| BE
    FE -->|API calls| BE
    BE --> BE_Data
    BE -->|REST| OpenAI

    style FE fill:#0070f3,color:#fff
    style BE fill:#0b0d0f,color:#fff
    style OpenAI fill:#0078d4,color:#fff
```

## Notes

- **MVP Scope:** Mock Collibra client, in-memory sessions
- **Production:** Replace with real Collibra API, Redis sessions
- **Scaling:** Railway horizontal scaling requires Redis
- **Security:** WebSocket origin validation, API key rotation
