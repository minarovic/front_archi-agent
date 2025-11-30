# Sequence Diagram - WebSocket Chat Flow

Zobrazuje časovú postupnosť interakcií pri WebSocket komunikácii.

## Complete WebSocket Flow (Mermaid)

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant React as React Frontend
    participant WS as WebSocket Connection
    participant FastAPI as FastAPI Backend
    participant SM as SessionManager
    participant EA as Explorer Agent
    participant LLM as Azure OpenAI
    participant Mock as Mock Collibra
    participant Canvas as Canvas State

    Note over User,Canvas: Initial Connection
    User->>React: Opens MCOP app
    React->>React: Generate session_id
    React->>WS: new WebSocket(ws://.../{session_id})
    WS->>FastAPI: WS CONNECT /ws/{session_id}
    FastAPI->>SM: get_or_create(session_id)
    SM-->>FastAPI: SessionState
    FastAPI->>WS: Accept connection
    WS-->>React: onopen event
    React-->>User: ✅ Connected status

    Note over User,Canvas: User Query Processing
    User->>React: Types "Show me all tables"
    React->>WS: send({"content": "Show me all tables"})

    WS->>FastAPI: Message received
    FastAPI->>SM: add_message("user", content)

    Note over FastAPI,LLM: Agent Execution with Streaming
    FastAPI->>EA: run_stream(query, deps)
    EA->>LLM: Classify intent + generate response

    LLM-->>EA: Token stream starts
    EA-->>FastAPI: stream.stream_text() chunk 1: "Here"
    FastAPI-->>WS: {"type": "agent_partial", "content": "Here"}
    WS-->>React: onmessage
    React-->>User: Display "Here"

    LLM-->>EA: Token stream chunk 2: " are"
    EA-->>FastAPI: stream.stream_text() chunk 2
    FastAPI-->>WS: {"type": "agent_partial", "content": "Here are"}
    WS-->>React: onmessage
    React-->>User: Update to "Here are"

    LLM-->>EA: Token stream chunk 3: " the tables:"
    EA-->>FastAPI: stream.stream_text() chunk 3
    FastAPI-->>WS: {"type": "agent_partial", "content": "Here are the tables:"}
    WS-->>React: onmessage
    React-->>User: Update to "Here are the tables:"

    Note over EA,Mock: Tool Execution
    EA->>EA: LLM selects list_tables tool
    EA->>Mock: list_tables()
    Mock-->>EA: [{"name": "fact_bs_purchase", ...}, ...]

    EA->>LLM: Tool result + continue generation
    LLM-->>EA: Final response tokens
    EA-->>FastAPI: stream.get_data() -> complete response

    FastAPI->>SM: add_message("assistant", response)
    FastAPI->>Canvas: update_canvas(tables)
    FastAPI-->>WS: {"type": "agent", "content": "Complete response..."}
    WS-->>React: onmessage
    React->>React: Replace partial with final message
    React-->>User: Show complete answer

    Note over User,Canvas: User Requests Diagram
    User->>React: Types "Show relationships"
    React->>WS: send({"content": "Show relationships"})
    WS->>FastAPI: Message received

    FastAPI->>EA: run_stream(query, deps)
    EA->>LLM: Intent classification
    EA->>EA: LLM selects find_relationships tool
    EA->>Mock: find_relationships("fact_bs_purchase")
    Mock-->>EA: FK relationships data

    EA->>EA: Generate Mermaid diagram
    EA-->>FastAPI: Response with diagram field
    FastAPI-->>WS: {"type": "agent", "content": "...", "diagram": "erDiagram..."}
    WS-->>React: onmessage
    React->>React: Extract diagram field
    React->>Canvas: setDiagram(diagram_code)
    Canvas-->>User: Render ER diagram

    Note over User,Canvas: Disconnect
    User->>React: Closes tab/browser
    React->>WS: close()
    WS->>FastAPI: WS DISCONNECT
    FastAPI->>SM: Session cleanup (optional)
    FastAPI-->>WS: Connection closed
```

## Simplified Flow (PlantUML)

```plantuml
@startuml WebSocket_Sequence_Simple
!theme plain
autonumber

actor User
participant "React\nFrontend" as React
participant "WebSocket" as WS
participant "FastAPI\nBackend" as API
participant "Explorer\nAgent" as Agent
participant "Azure\nOpenAI" as LLM

User -> React: Type message
React -> WS: send(message)
WS -> API: WebSocket message
API -> Agent: run_stream(query)

loop Streaming Response
    Agent -> LLM: Generate tokens
    LLM --> Agent: Token chunk
    Agent --> API: stream_text() chunk
    API --> WS: JSON message
    WS --> React: onmessage
    React --> User: Update UI
end

Agent -> Agent: Tool execution
Agent --> API: Final response
API --> WS: Complete message
WS --> React: onmessage
React --> User: Show final answer

@enduml
```

## Error Handling Flow

```mermaid
sequenceDiagram
    participant User
    participant React
    participant WS as WebSocket
    participant FastAPI
    participant EA as Explorer Agent

    User->>React: Send invalid query
    React->>WS: send({"content": ""})
    WS->>FastAPI: Empty message

    alt Empty Message
        FastAPI-->>WS: {"type": "error", "content": "Empty message"}
        WS-->>React: onmessage
        React-->>User: Show error toast
    end

    User->>React: Send valid query
    React->>WS: send({"content": "Get table ABC"})
    WS->>FastAPI: Valid message
    FastAPI->>EA: run_stream(query)

    alt Agent Tool Fails
        EA->>EA: Tool execution error
        EA-->>FastAPI: Exception raised
        FastAPI-->>WS: {"type": "error", "content": "Tool failed: ..."}
        WS-->>React: onmessage
        React-->>User: Show error message
    else LLM Timeout
        EA->>EA: LLM request timeout (30s)
        EA-->>FastAPI: TimeoutError
        FastAPI-->>WS: {"type": "error", "content": "Request timeout"}
        WS-->>React: onmessage
        React-->>User: Show timeout error
    end

    Note over User,EA: Connection Loss
    WS->>WS: Connection dropped
    WS-->>React: onclose event
    React->>React: Start reconnection timer
    React-->>User: "Reconnecting..." status

    loop Reconnect Attempts (max 5)
        React->>WS: new WebSocket(url)
        alt Success
            WS-->>React: onopen
            React-->>User: "✅ Reconnected"
        else Fail
            WS-->>React: onerror
            React->>React: Exponential backoff
        end
    end
```

## WebSocket Lifecycle States

```mermaid
stateDiagram-v2
    [*] --> Disconnected: Page load

    Disconnected --> Connecting: new WebSocket()
    Connecting --> Connected: onopen event
    Connecting --> Error: onerror event

    Connected --> Streaming: User sends message
    Streaming --> Connected: Response complete
    Streaming --> Error: Network issue

    Error --> Reconnecting: Auto-retry
    Reconnecting --> Connected: Retry success
    Reconnecting --> Disconnected: Max retries exceeded

    Connected --> Disconnected: User closes tab
    Error --> Disconnected: User closes tab

    state Connected {
        [*] --> Idle
        Idle --> WaitingForResponse: Message sent
        WaitingForResponse --> ReceivingStream: First chunk
        ReceivingStream --> Idle: Final message

        WaitingForResponse --> Idle: Error
        ReceivingStream --> Idle: Error
    }
```

## Message Protocol Detail

### Client → Server

```json
{
  "content": "Show me all tables"
}
```

### Server → Client (Streaming)

**1. User Echo**
```json
{
  "type": "user",
  "content": "Show me all tables"
}
```

**2. Partial Responses (multiple)**
```json
{
  "type": "agent_partial",
  "content": "Here are the available tables:\n\n1. "
}
```

**3. Tool Execution (optional)**
```json
{
  "type": "tool",
  "content": "[{\"name\": \"fact_bs_purchase\", \"type\": \"FACT\"}]",
  "tool_name": "list_tables"
}
```

**4. Final Response**
```json
{
  "type": "agent",
  "content": "Here are the available tables:\n\n1. fact_bs_purchase_order (FACT)\n2. dimv_bs_supplier (DIMENSION)\n...",
  "diagram": "erDiagram\n  fact_bs_purchase ||--o{ dimv_bs_supplier : has\n..."
}
```

**5. Error Response**
```json
{
  "type": "error",
  "content": "Agent error: Connection timeout"
}
```

## Timing Diagram

```mermaid
gantt
    title WebSocket Message Timing (Typical Query)
    dateFormat  X
    axisFormat %L ms

    section Connection
    WebSocket handshake     :0, 100ms
    Session init            :100ms, 50ms

    section Query Processing
    User types message      :150ms, 500ms
    Send to server          :650ms, 10ms

    section Agent Execution
    LLM intent classification :660ms, 800ms
    Tool execution (list_tables) :1460ms, 200ms
    Generate response       :1660ms, 1200ms

    section Streaming Response
    First chunk arrives     :1660ms, 100ms
    Streaming chunks (x10)  :1760ms, 1100ms
    Final message           :2860ms, 100ms

    section User Experience
    User sees first text    :1760ms, 0ms
    User sees typing effect :1760ms, 1100ms
    Complete answer visible :2960ms, 0ms
```

**Total time:** ~3 seconds from query to complete answer

## Performance Metrics

### Latency Breakdown

| Stage             | Target  | Notes                      |
| ----------------- | ------- | -------------------------- |
| WebSocket connect | < 100ms | Includes TLS handshake     |
| Message send      | < 10ms  | Network RTT                |
| LLM first token   | < 1s    | Azure OpenAI latency       |
| Tool execution    | < 200ms | Mock client fast           |
| Streaming chunk   | < 100ms | Per token batch            |
| Full response     | < 5s    | Depends on response length |

### Throughput

- Concurrent users: 10-50 (MVP)
- Messages/sec: ~10 per instance
- WebSocket connections: ~100 per instance
- Max message size: 1 MB

## Sequence Variations

### Query with Multiple Tools

```mermaid
sequenceDiagram
    User->>Agent: "Compare fact_bs_purchase with dimv_bs_supplier"
    Agent->>LLM: Intent classification
    LLM-->>Agent: Use get_table_details twice

    Agent->>Mock: get_table("fact_bs_purchase")
    Mock-->>Agent: Table 1 data

    Agent->>Mock: get_table("dimv_bs_supplier")
    Mock-->>Agent: Table 2 data

    Agent->>LLM: Generate comparison
    LLM-->>Agent: Streaming response
    Agent-->>User: Comparison text + diagram
```

### Pipeline Execution via WebSocket

```mermaid
sequenceDiagram
    User->>Agent: "Run full pipeline on this document"
    Agent->>Orchestrator: run_pipeline(document)

    loop Tool 0 → 1 → 2 → 3
        Orchestrator->>Tool: Execute
        Tool-->>Orchestrator: Result
        Orchestrator-->>Agent: Progress update
        Agent-->>User: "✓ Tool N completed..."
    end

    Orchestrator-->>Agent: Final PipelineState
    Agent->>DiagramGen: generate_diagram(structure)
    DiagramGen-->>Agent: Mermaid code
    Agent-->>User: Pipeline results + diagram
```

## Notes

- WebSocket keeps connection open for entire session
- Streaming provides real-time feedback (ChatGPT-like UX)
- Agent can send diagram in any response via `diagram` field
- Frontend automatically renders Mermaid when present
- Reconnection logic handles network interruptions
- Each message includes type for proper UI handling
