# State Diagrams - System State Machines

Zobrazuje lifecycle a prechody medzi stavmi v systéme.

## 1. Session Lifecycle (Primary State Machine)

```mermaid
stateDiagram-v2
    [*] --> NoSession: User opens app

    NoSession --> Active: WebSocket connect
    Active --> Active: User sends messages
    Active --> Persisted: 5 min inactivity
    Active --> Disconnected: User closes tab

    Persisted --> Active: User reconnects
    Persisted --> Expired: 24h timeout

    Disconnected --> NoSession: Session cleanup
    Expired --> NoSession: Garbage collection

    NoSession --> [*]

    state Active {
        [*] --> Idle
        Idle --> Processing: Message received
        Processing --> ToolExecution: Agent uses tool
        ToolExecution --> Streaming: Tool complete
        Streaming --> Idle: Response sent

        Processing --> Idle: Error
        ToolExecution --> Idle: Timeout
    }
```

### Session States Detail

| State             | Description                       | Timeout | Transitions                                |
| ----------------- | --------------------------------- | ------- | ------------------------------------------ |
| **NoSession**     | Initial state, no session exists  | -       | → Active (on connect)                      |
| **Active**        | User connected, can send messages | 5 min   | → Persisted (idle), → Disconnected (close) |
| **Processing**    | Agent processing user query       | 30s     | → ToolExecution, → Idle (done/error)       |
| **ToolExecution** | Tool being executed               | 10s     | → Streaming                                |
| **Streaming**     | LLM streaming response            | 60s     | → Idle                                     |
| **Persisted**     | Session saved, user disconnected  | 24h     | → Active (reconnect), → Expired            |
| **Disconnected**  | Connection lost, cleanup pending  | 1 min   | → NoSession                                |
| **Expired**       | Session too old, will be deleted  | -       | → NoSession                                |

## 2. Canvas State Machine

```mermaid
stateDiagram-v2
    [*] --> Empty: Initial load

    Empty --> TableView: Agent returns table list
    Empty --> DiagramView: Agent returns diagram

    TableView --> TableView: Update table data
    TableView --> DiagramView: Show ER diagram
    TableView --> MapView: Show entity mappings

    DiagramView --> DiagramView: Update diagram
    DiagramView --> TableView: Show raw data
    DiagramView --> MapView: Show mappings

    MapView --> MapView: Update mappings
    MapView --> TableView: Show tables
    MapView --> DiagramView: Show diagram

    TableView --> Empty: Clear canvas
    DiagramView --> Empty: Clear canvas
    MapView --> Empty: Clear canvas

    Empty --> [*]

    state DiagramView {
        [*] --> Rendering
        Rendering --> Rendered: Mermaid.render() complete
        Rendered --> Rendering: Update diagram
        Rendering --> Error: Syntax error
        Error --> Rendering: Fix diagram
    }
```

### Canvas States Detail

| State           | Content                      | Actions Available          |
| --------------- | ---------------------------- | -------------------------- |
| **Empty**       | No data                      | Wait for agent response    |
| **TableView**   | List of tables with metadata | Sort, filter, show diagram |
| **DiagramView** | Mermaid ER diagram rendered  | Zoom, pan, export SVG      |
| **MapView**     | Entity-attribute mappings    | Filter, search, show table |
| **Error**       | Diagram syntax error         | Show error message, retry  |

## 3. Agent Processing States

```mermaid
stateDiagram-v2
    [*] --> Idle: Agent initialized

    Idle --> ClassifyingIntent: User query received

    ClassifyingIntent --> SelectingTool: LLM chooses tool
    ClassifyingIntent --> GeneratingResponse: No tool needed

    SelectingTool --> ExecutingTool: Call tool function
    ExecutingTool --> ToolSuccess: Tool returns data
    ExecutingTool --> ToolFailure: Tool raises exception

    ToolSuccess --> GeneratingResponse: LLM processes tool result
    ToolFailure --> ErrorRecovery: Handle error

    ErrorRecovery --> SelectingTool: Retry with different tool
    ErrorRecovery --> GeneratingResponse: Return error message
    ErrorRecovery --> Idle: Unrecoverable error

    GeneratingResponse --> StreamingTokens: First token received
    StreamingTokens --> ResponseComplete: All tokens sent

    ResponseComplete --> Idle: Ready for next query

    state ExecutingTool {
        [*] --> ValidatingInput
        ValidatingInput --> CallingAPI: Input valid
        ValidatingInput --> [*]: Input invalid (error)
        CallingAPI --> ProcessingResult: API response
        ProcessingResult --> [*]: Result ready
    }
```

### Agent States Detail

| State                  | Duration | Can Cancel? | Next States                             |
| ---------------------- | -------- | ----------- | --------------------------------------- |
| **Idle**               | ∞        | -           | ClassifyingIntent                       |
| **ClassifyingIntent**  | 1-3s     | Yes         | SelectingTool, GeneratingResponse       |
| **SelectingTool**      | <100ms   | Yes         | ExecutingTool                           |
| **ExecutingTool**      | 0.1-2s   | No          | ToolSuccess, ToolFailure                |
| **GeneratingResponse** | 2-10s    | Yes         | StreamingTokens                         |
| **StreamingTokens**    | 5-30s    | Yes         | ResponseComplete                        |
| **ErrorRecovery**      | 1-5s     | No          | SelectingTool, GeneratingResponse, Idle |

## 4. WebSocket Connection States

```mermaid
stateDiagram-v2
    [*] --> Disconnected: Page load

    Disconnected --> Connecting: new WebSocket()
    Connecting --> Open: onopen event
    Connecting --> Failed: onerror (no retry)

    Open --> Closing: close() called
    Open --> Closed: Server disconnect
    Open --> Error: Network issue

    Error --> Reconnecting: Auto-retry (attempt 1)
    Reconnecting --> Open: Reconnect success
    Reconnecting --> Reconnecting: Retry failed (attempt 2-5)
    Reconnecting --> Failed: Max retries (5) exceeded

    Closing --> Closed: onclose event
    Closed --> Disconnected: Cleanup complete
    Failed --> Disconnected: User notified

    Disconnected --> [*]

    state Open {
        [*] --> Ready
        Ready --> Sending: send() called
        Sending --> Ready: Message queued
        Ready --> Receiving: onmessage event
        Receiving --> Ready: Message processed
    }
```

### Connection States Detail

| State            | Buffering? | Can Send? | Reconnect?   |
| ---------------- | ---------- | --------- | ------------ |
| **Disconnected** | No         | No        | Yes (manual) |
| **Connecting**   | Yes        | No        | No (wait)    |
| **Open**         | No         | Yes       | -            |
| **Sending**      | No         | Yes       | -            |
| **Receiving**    | No         | Yes       | -            |
| **Error**        | Yes        | No        | Yes (auto)   |
| **Reconnecting** | Yes        | No        | Yes (auto)   |
| **Closing**      | Yes        | No        | No           |
| **Closed**       | No         | No        | Yes (manual) |
| **Failed**       | No         | No        | No           |

### Reconnection Policy

```typescript
const RECONNECT_CONFIG = {
  maxRetries: 5,
  initialDelay: 1000,      // 1s
  maxDelay: 30000,         // 30s
  backoffMultiplier: 2,    // Exponential
  jitter: 0.1              // ±10% random
}

// Retry delays: 1s, 2s, 4s, 8s, 16s (then fail)
```

## 5. Message Processing States

```mermaid
stateDiagram-v2
    [*] --> Received: WebSocket onmessage

    Received --> Validating: Parse JSON
    Validating --> ValidMessage: Schema valid
    Validating --> InvalidMessage: Schema invalid

    InvalidMessage --> [*]: Log error, ignore

    ValidMessage --> RouteByType: Check message.type

    RouteByType --> HandleUser: type = "user"
    RouteByType --> HandleAgentPartial: type = "agent_partial"
    RouteByType --> HandleAgent: type = "agent"
    RouteByType --> HandleTool: type = "tool"
    RouteByType --> HandleError: type = "error"

    HandleUser --> UpdateUI: Add to messages
    HandleAgentPartial --> UpdateUI: Update last message
    HandleAgent --> UpdateUI: Replace partial with final
    HandleTool --> UpdateUI: Show tool execution
    HandleError --> UpdateUI: Show error toast

    UpdateUI --> CheckDiagram: message.diagram exists?
    CheckDiagram --> RenderDiagram: Yes
    CheckDiagram --> [*]: No

    RenderDiagram --> [*]: Canvas updated

    state HandleAgent {
        [*] --> ExtractContent
        ExtractContent --> ExtractDiagram: Has diagram?
        ExtractContent --> Done: No diagram
        ExtractDiagram --> ValidateMermaid: Syntax check
        ValidateMermaid --> Done: Valid
        ValidateMermaid --> ShowError: Invalid syntax
        ShowError --> Done
        Done --> [*]
    }
```

## 6. Pipeline Orchestration States

```mermaid
stateDiagram-v2
    [*] --> Initialized: User uploads document

    Initialized --> RunningTool0: Parse business request
    RunningTool0 --> Tool0Complete: ParsedRequest ready
    RunningTool0 --> Tool0Failed: Parsing error

    Tool0Failed --> ErrorState: Cannot continue

    Tool0Complete --> RunningTool1: Map to Collibra entities
    RunningTool1 --> Tool1Complete: MappingResult ready
    RunningTool1 --> Tool1Failed: Mapping error

    Tool1Failed --> Tool1Retry: Retry with context
    Tool1Retry --> Tool1Complete: Success
    Tool1Retry --> ErrorState: Max retries

    Tool1Complete --> RunningTool2: Structure tables
    RunningTool2 --> Tool2Complete: StructureOutput ready
    RunningTool2 --> Tool2Failed: Structure error

    Tool2Failed --> ErrorState: Cannot continue

    Tool2Complete --> RunningTool3: Validate quality
    RunningTool3 --> Tool3Complete: ValidationReport ready
    RunningTool3 --> Tool3Warning: Non-critical issues

    Tool3Warning --> Completed: Pipeline done with warnings
    Tool3Complete --> Completed: Pipeline done successfully

    Completed --> [*]: Return PipelineState
    ErrorState --> [*]: Return error details

    state RunningTool1 {
        [*] --> FetchEntities
        FetchEntities --> MapAttributes: Collibra data loaded
        MapAttributes --> ResolveAmbiguities: LLM mapping
        ResolveAmbiguities --> [*]: Mapping complete
    }
```

### Pipeline States Detail

| State            | Tool       | Input           | Output           | Error Handling |
| ---------------- | ---------- | --------------- | ---------------- | -------------- |
| **Initialized**  | -          | Document        | -                | -              |
| **RunningTool0** | Parser     | Document        | ParsedRequest    | Fail pipeline  |
| **RunningTool1** | Mapper     | ParsedRequest   | MappingResult    | Retry 3x       |
| **RunningTool2** | Structurer | MappingResult   | StructureOutput  | Fail pipeline  |
| **RunningTool3** | Validator  | StructureOutput | ValidationReport | Warn only      |
| **Completed**    | -          | -               | PipelineState    | -              |
| **ErrorState**   | -          | -               | Error details    | -              |

## 7. Composite State (Full System View)

```mermaid
stateDiagram-v2
    state "MCOP System" as System {
        state "Frontend" as FE {
            [*] --> AppInitializing
            AppInitializing --> SessionActive
            SessionActive --> [*]
        }

        state "WebSocket" as WS {
            [*] --> WSDisconnected
            WSDisconnected --> WSOpen
            WSOpen --> [*]
        }

        state "Backend" as BE {
            [*] --> ServerIdle
            ServerIdle --> ProcessingRequest
            ProcessingRequest --> ServerIdle
            ServerIdle --> [*]
        }

        state "Agent" as AG {
            [*] --> AgentIdle
            AgentIdle --> AgentExecuting
            AgentExecuting --> AgentIdle
            AgentIdle --> [*]
        }
    }
```

## State Transition Matrix

### Session State Transitions

|                   | NoSession | Active         | Persisted | Expired     | Disconnected |
| ----------------- | --------- | -------------- | --------- | ----------- | ------------ |
| **User connects** | → Active  | -              | → Active  | -           | -            |
| **5 min idle**    | -         | → Persisted    | -         | -           | -            |
| **24h timeout**   | -         | -              | → Expired | -           | -            |
| **User closes**   | -         | → Disconnected | -         | -           | → NoSession  |
| **Cleanup**       | -         | -              | -         | → NoSession | → NoSession  |

### Agent State Transitions

|                    | Idle          | Classifying      | Tool Execution   | Streaming | Error Recovery   |
| ------------------ | ------------- | ---------------- | ---------------- | --------- | ---------------- |
| **Query received** | → Classifying | -                | -                | -         | -                |
| **Tool selected**  | -             | → Tool Execution | -                | -         | -                |
| **Tool success**   | -             | -                | → Streaming      | -         | -                |
| **Tool failure**   | -             | -                | → Error Recovery | -         | → Tool Execution |
| **Response done**  | -             | -                | -                | → Idle    | → Idle           |

## PlantUML Alternative

```plantuml
@startuml Session_State_Machine
!theme plain

[*] --> NoSession : User opens app

NoSession --> Active : WebSocket connect
Active --> Persisted : 5 min inactivity
Active --> Disconnected : User closes tab
Persisted --> Active : User reconnects
Persisted --> Expired : 24h timeout
Disconnected --> NoSession : Cleanup
Expired --> NoSession : Garbage collection

state Active {
  [*] --> Idle
  Idle --> Processing : Message received
  Processing --> ToolExecution : Tool selected
  ToolExecution --> Streaming : Tool complete
  Streaming --> Idle : Response sent

  Processing --> Idle : Error
  ToolExecution --> Idle : Timeout
}

NoSession --> [*]

@enduml
```

## Notes

- **Session lifecycle:** Focus on user experience and reconnection
- **Canvas states:** Allow flexible view switching (Table ↔ Diagram ↔ Map)
- **Agent states:** Include error recovery paths
- **WebSocket states:** Handle network issues gracefully
- **Pipeline states:** Linear with retry logic on Tool 1 only
- **Composite view:** Shows all subsystems running concurrently
