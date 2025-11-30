# Activity Diagrams - Business Process Flows

Zobrazuje workflow a rozhodovanie v procesoch.

## 1. MVP Pipeline Orchestration (Tool 0→1→2→3)

```mermaid
flowchart TD
    Start([User uploads document]) --> ValidateInput{Document valid?}
    ValidateInput -->|No| ErrorInvalidDoc[Error: Invalid format]
    ValidateInput -->|Yes| Tool0[Tool 0: Parse Business Request]

    Tool0 --> ParsedOK{Parsing successful?}
    ParsedOK -->|No| ErrorParsing[Error: Cannot parse document]
    ParsedOK -->|Yes| SaveParsed[Save ParsedRequest to state]

    SaveParsed --> Tool1[Tool 1: Map to Collibra Entities]

    Tool1 --> MapOK{Mapping successful?}
    MapOK -->|No| RetryCount{Retry < 3?}
    RetryCount -->|Yes| AddContext[Add error context]
    AddContext --> Tool1
    RetryCount -->|No| ErrorMapping[Error: Cannot map entities]
    MapOK -->|Yes| SaveMapping[Save MappingResult to state]

    SaveMapping --> Tool2[Tool 2: Structure as Tables]

    Tool2 --> StructureOK{Structuring successful?}
    StructureOK -->|No| ErrorStructure[Error: Cannot create tables]
    StructureOK -->|Yes| SaveStructure[Save StructureOutput to state]

    SaveStructure --> Tool3[Tool 3: Validate Quality]

    Tool3 --> ValidationOK{Validation passed?}
    ValidationOK -->|Warnings| LogWarnings[Log warnings to state]
    ValidationOK -->|Success| SaveValidation[Save ValidationReport to state]
    ValidationOK -->|Errors| LogErrors[Log errors to state]

    LogWarnings --> ReturnState[Return PipelineState]
    SaveValidation --> ReturnState
    LogErrors --> ReturnState

    ErrorInvalidDoc --> End([Pipeline failed])
    ErrorParsing --> End
    ErrorMapping --> End
    ErrorStructure --> End
    ReturnState --> Success([Pipeline completed])

    style Tool0 fill:#e1f5ff
    style Tool1 fill:#e1f5ff
    style Tool2 fill:#e1f5ff
    style Tool3 fill:#e1f5ff
    style ErrorInvalidDoc fill:#ffe1e1
    style ErrorParsing fill:#ffe1e1
    style ErrorMapping fill:#ffe1e1
    style ErrorStructure fill:#ffe1e1
```

## 2. Explorer Agent Query Processing

```mermaid
flowchart TD
    Start([User sends query]) --> EchoUser[Echo user message to WebSocket]
    EchoUser --> ClassifyIntent[LLM: Classify intent]

    ClassifyIntent --> CheckIntent{Intent type?}

    CheckIntent -->|list_tables| Tool1[Execute: list_tables]
    CheckIntent -->|get_table| Tool2[Execute: get_table_details]
    CheckIntent -->|find_rel| Tool3[Execute: find_relationships]
    CheckIntent -->|compare| Tool4[Execute: compare_tables]
    CheckIntent -->|generate| Tool5[Execute: generate_diagram]
    CheckIntent -->|general| NoTool[No tool needed]

    Tool1 --> ToolSuccess1{Success?}
    Tool2 --> ToolSuccess2{Success?}
    Tool3 --> ToolSuccess3{Success?}
    Tool4 --> ToolSuccess4{Success?}
    Tool5 --> ToolSuccess5{Success?}

    ToolSuccess1 -->|No| HandleError1[Return error message]
    ToolSuccess2 -->|No| HandleError2[Return error message]
    ToolSuccess3 -->|No| HandleError3[Return error message]
    ToolSuccess4 -->|No| HandleError4[Return error message]
    ToolSuccess5 -->|No| HandleError5[Return error message]

    ToolSuccess1 -->|Yes| GenerateResponse1[LLM: Generate response]
    ToolSuccess2 -->|Yes| GenerateResponse2[LLM: Generate response]
    ToolSuccess3 -->|Yes| GenerateResponse3[LLM: Generate response + diagram]
    ToolSuccess4 -->|Yes| GenerateResponse4[LLM: Generate response]
    ToolSuccess5 -->|Yes| GenerateResponse5[Return diagram only]
    NoTool --> GenerateResponse0[LLM: Generate response]

    GenerateResponse0 --> StreamResponse[Stream response to WebSocket]
    GenerateResponse1 --> StreamResponse
    GenerateResponse2 --> StreamResponse
    GenerateResponse3 --> StreamResponse
    GenerateResponse4 --> StreamResponse
    GenerateResponse5 --> StreamResponse

    HandleError1 --> StreamResponse
    HandleError2 --> StreamResponse
    HandleError3 --> StreamResponse
    HandleError4 --> StreamResponse
    HandleError5 --> StreamResponse

    StreamResponse --> CheckDiagram{Response has diagram?}
    CheckDiagram -->|Yes| UpdateCanvas[Update Canvas with diagram]
    CheckDiagram -->|No| UpdateChat[Update Chat only]

    UpdateCanvas --> End([Query complete])
    UpdateChat --> End

    style Tool1 fill:#fff4e6
    style Tool2 fill:#fff4e6
    style Tool3 fill:#fff4e6
    style Tool4 fill:#fff4e6
    style Tool5 fill:#fff4e6
    style HandleError1 fill:#ffe1e1
    style HandleError2 fill:#ffe1e1
    style HandleError3 fill:#ffe1e1
    style HandleError4 fill:#ffe1e1
    style HandleError5 fill:#ffe1e1
```

## 3. WebSocket Connection Management

```mermaid
flowchart TD
    Start([User opens app]) --> GenerateID[Generate session_id UUID]
    GenerateID --> InitWS[Initialize WebSocket connection]

    InitWS --> Connecting{Connection status?}
    Connecting -->|Success| OnOpen[onopen: Set connected=true]
    Connecting -->|Fail| OnError[onerror: Set error state]

    OnOpen --> Ready[Display Connected status]
    Ready --> WaitMessage[Wait for user action]

    WaitMessage --> UserAction{User action?}
    UserAction -->|Types message| SendMessage[send JSON via WebSocket]
    UserAction -->|Idle 5 min| IdleTimeout[Mark session as persisted]
    UserAction -->|Closes tab| UserClose[close WebSocket]

    SendMessage --> WaitResponse[Wait for server response]
    WaitResponse --> OnMessage[onmessage: Parse JSON]

    OnMessage --> MessageType{Message type?}
    MessageType -->|agent_partial| UpdatePartial[Update last message incrementally]
    MessageType -->|agent| UpdateFinal[Replace with final message]
    MessageType -->|tool| ShowTool[Show tool execution info]
    MessageType -->|error| ShowError[Show error toast]

    UpdatePartial --> WaitMessage
    UpdateFinal --> CheckDiagram{Has diagram?}
    ShowTool --> WaitMessage
    ShowError --> WaitMessage

    CheckDiagram -->|Yes| RenderDiagram[Render Mermaid in Canvas]
    CheckDiagram -->|No| WaitMessage
    RenderDiagram --> WaitMessage

    IdleTimeout --> PersistSession[Save session to store]
    PersistSession --> CloseConnection[Close WebSocket gracefully]

    OnError --> RetryLogic{Retry count < 5?}
    RetryLogic -->|Yes| WaitBackoff[Wait exponential backoff]
    WaitBackoff --> InitWS
    RetryLogic -->|No| ShowFailed[Display Connection failed]

    UserClose --> CloseConnection
    CloseConnection --> End([Session ended])
    ShowFailed --> End

    style OnOpen fill:#e1ffe1
    style Ready fill:#e1ffe1
    style OnError fill:#ffe1e1
    style ShowFailed fill:#ffe1e1
    style ShowError fill:#ffe1e1
```

## 4. Canvas View Switching

```mermaid
flowchart TD
    Start([Canvas initialized]) --> CheckContent{Has content?}
    CheckContent -->|No| EmptyState[Show No data message]
    CheckContent -->|Yes| DetermineView{Current view?}

    DetermineView -->|Table| ShowTableView[Render table list]
    DetermineView -->|Diagram| ShowDiagramView[Render Mermaid diagram]
    DetermineView -->|Map| ShowMapView[Render entity mappings]

    ShowTableView --> TableActions{User action?}
    TableActions -->|Click Show Diagram| SwitchToDiagram[setView diagram]
    TableActions -->|Click Show Mappings| SwitchToMap[setView map]
    TableActions -->|Sort/Filter| UpdateTable[Rerender table]

    SwitchToDiagram --> ShowDiagramView
    SwitchToMap --> ShowMapView
    UpdateTable --> ShowTableView

    ShowDiagramView --> DiagramActions{User action?}
    DiagramActions -->|Click Show Tables| SwitchToTable1[setView table]
    DiagramActions -->|Zoom/Pan| UpdateDiagram[Rerender diagram]
    DiagramActions -->|Export SVG| ExportDiagram[Download SVG file]

    SwitchToTable1 --> ShowTableView
    UpdateDiagram --> ShowDiagramView
    ExportDiagram --> ShowDiagramView

    ShowMapView --> MapActions{User action?}
    MapActions -->|Click Show Tables| SwitchToTable2[setView table]
    MapActions -->|Click Show Diagram| SwitchToDiagram2[setView diagram]
    MapActions -->|Search/Filter| UpdateMap[Rerender mappings]

    SwitchToTable2 --> ShowTableView
    SwitchToDiagram2 --> ShowDiagramView
    UpdateMap --> ShowMapView

    EmptyState --> WaitContent[Wait for agent response]
    WaitContent --> NewContent[New data arrives]
    NewContent --> CheckContent

    style ShowTableView fill:#e1f5ff
    style ShowDiagramView fill:#e1f5ff
    style ShowMapView fill:#e1f5ff
```

## 5. Tool 1 Entity Mapping (Detailed)

```mermaid
flowchart TD
    Start([Tool 1 invoked]) --> Input[Receive ParsedRequest]
    Input --> FetchCollibra[Fetch all entities from Mock Collibra]

    FetchCollibra --> CollibraOK{Fetch successful?}
    CollibraOK -->|No| ReturnError[Return error: Collibra unavailable]
    CollibraOK -->|Yes| ExtractBusiness[Extract business entities from request]

    ExtractBusiness --> BuildPrompt[Build mapping prompt with context]
    BuildPrompt --> LLMMap[LLM: Map business → Collibra entities]

    LLMMap --> ParseResponse{LLM response valid?}
    ParseResponse -->|No| RetryLLM{Retry < 3?}
    RetryLLM -->|Yes| AddErrorContext[Add error message to prompt]
    AddErrorContext --> LLMMap
    RetryLLM -->|No| ReturnError

    ParseResponse -->|Yes| CheckAmbiguity{Ambiguous mappings?}
    CheckAmbiguity -->|Yes| LLMResolve[LLM: Resolve ambiguities]
    CheckAmbiguity -->|No| ValidateMappings[Validate all mappings exist]

    LLMResolve --> ValidateMappings

    ValidateMappings --> ValidationOK{All valid?}
    ValidationOK -->|No| FlagUnmapped[Flag unmapped entities]
    ValidationOK -->|Yes| BuildResult[Build MappingResult]

    FlagUnmapped --> BuildResult
    BuildResult --> AddMetadata[Add confidence scores + metadata]
    AddMetadata --> ReturnSuccess[Return MappingResult]

    ReturnError --> End([Tool 1 failed])
    ReturnSuccess --> End2([Tool 1 succeeded])

    style LLMMap fill:#ffffcc
    style LLMResolve fill:#ffffcc
    style ReturnError fill:#ffe1e1
    style ReturnSuccess fill:#e1ffe1
```

## 6. Tool 3 Quality Validation (Detailed)

```mermaid
flowchart TD
    Start([Tool 3 invoked]) --> Input[Receive StructureOutput]
    Input --> InitReport[Initialize ValidationReport]

    InitReport --> CheckFacts{Has fact tables?}
    CheckFacts -->|No| ErrorNoFacts[Add error: No fact tables]
    CheckFacts -->|Yes| ValidateFacts[Validate each fact table]

    ValidateFacts --> FactLoop[For each fact table...]
    FactLoop --> CheckMeasures{Has measures?}
    CheckMeasures -->|No| WarnNoMeasures[Add warning: No measures]
    CheckMeasures -->|Yes| CheckGrain{Has grain defined?}

    CheckGrain -->|No| WarnNoGrain[Add warning: Missing grain]
    CheckGrain -->|Yes| CheckFKs{Has foreign keys?}

    CheckFKs -->|No| WarnNoFKs[Add warning: No FK relationships]
    CheckFKs -->|Yes| ValidateFKTargets[Validate FK targets exist]

    ValidateFKTargets --> FKTargetsOK{All FKs valid?}
    FKTargetsOK -->|No| ErrorInvalidFK[Add error: Invalid FK reference]
    FKTargetsOK -->|Yes| NextFact{More fact tables?}

    WarnNoMeasures --> NextFact
    WarnNoGrain --> NextFact
    WarnNoFKs --> NextFact
    NextFact -->|Yes| FactLoop
    NextFact -->|No| CheckDimensions{Has dimensions?}

    CheckDimensions -->|No| WarnNoDimensions[Add warning: No dimensions]
    CheckDimensions -->|Yes| ValidateDimensions[Validate each dimension]

    ValidateDimensions --> DimLoop[For each dimension...]
    DimLoop --> CheckPK{Has primary key?}
    CheckPK -->|No| ErrorNoPK[Add error: Missing PK]
    CheckPK -->|Yes| CheckAttributes{Has attributes?}

    CheckAttributes -->|No| WarnNoAttributes[Add warning: Empty dimension]
    CheckAttributes -->|Yes| CheckSCD{SCD Type defined?}

    CheckSCD -->|No| InfoNoSCD[Add info: No SCD]
    CheckSCD -->|Yes| ValidateSCD[Validate SCD consistency]

    ValidateSCD --> SCDValid{SCD valid?}
    SCDValid -->|No| ErrorInvalidSCD[Add error: Invalid SCD config]
    SCDValid -->|Yes| NextDim{More dimensions?}

    WarnNoAttributes --> NextDim
    InfoNoSCD --> NextDim
    NextDim -->|Yes| DimLoop
    NextDim -->|No| CalculateScore[Calculate quality score]

    ErrorNoFacts --> CalculateScore
    ErrorInvalidFK --> CalculateScore
    ErrorNoPK --> CalculateScore
    ErrorInvalidSCD --> CalculateScore
    WarnNoDimensions --> CalculateScore

    CalculateScore --> FinalScore{Score >= 0.7?}
    FinalScore -->|Yes| MarkPassed[Mark validation as PASSED]
    FinalScore -->|No| MarkFailed[Mark validation as FAILED]

    MarkPassed --> ReturnReport[Return ValidationReport]
    MarkFailed --> ReturnReport
    ReturnReport --> End([Tool 3 completed])

    style ErrorNoFacts fill:#ffe1e1
    style ErrorInvalidFK fill:#ffe1e1
    style ErrorNoPK fill:#ffe1e1
    style ErrorInvalidSCD fill:#ffe1e1
    style WarnNoMeasures fill:#fff4e6
    style WarnNoGrain fill:#fff4e6
    style WarnNoFKs fill:#fff4e6
    style WarnNoDimensions fill:#fff4e6
    style WarnNoAttributes fill:#fff4e6
    style MarkPassed fill:#e1ffe1
    style MarkFailed fill:#ffe1e1
```

## 7. PlantUML Activity Diagram (Pipeline)

```plantuml
@startuml Pipeline_Activity
!theme plain
|User|
start
:Upload business document;

|Orchestrator|
:Validate document format;
if (Valid?) then (no)
  :Return error;
  stop
endif

:Execute Tool 0: Parse;
if (Parsing OK?) then (no)
  :Return error;
  stop
endif

:Save ParsedRequest;

|Tool 1|
:Fetch Collibra entities;
:Map business → Collibra;
if (Mapping OK?) then (no)
  if (Retry < 3?) then (yes)
    :Add context;
    :Retry mapping;
  else (no)
    :Return error;
    stop
  endif
endif

:Save MappingResult;

|Tool 2|
:Structure as fact/dimension tables;
if (Structure OK?) then (no)
  :Return error;
  stop
endif

:Save StructureOutput;

|Tool 3|
:Validate quality;
:Calculate score;

if (Score >= 0.7?) then (yes)
  :Mark PASSED;
else (no)
  :Mark FAILED with warnings;
endif

:Save ValidationReport;

|Orchestrator|
:Return PipelineState;

|User|
:View results;
stop

@enduml
```

## 8. Swimlane Diagram (Multi-Actor)

```mermaid
graph TB
    subgraph User Lane
        U1[Upload document]
        U2[Review results]
    end

    subgraph Frontend Lane
        F1[Validate file]
        F2[Send to backend]
        F3[Display results]
    end

    subgraph Backend Lane
        B1[Receive request]
        B2[Run orchestrator]
        B3[Return response]
    end

    subgraph Orchestrator Lane
        O1[Tool 0: Parse]
        O2[Tool 1: Map]
        O3[Tool 2: Structure]
        O4[Tool 3: Validate]
    end

    subgraph Tools Lane
        T1[Parser LLM]
        T2[Mapper LLM]
        T3[Structurer LLM]
        T4[Validator logic]
    end

    U1 --> F1
    F1 --> F2
    F2 --> B1
    B1 --> B2
    B2 --> O1
    O1 --> T1
    T1 --> O2
    O2 --> T2
    T2 --> O3
    O3 --> T3
    T3 --> O4
    O4 --> T4
    T4 --> B3
    B3 --> F3
    F3 --> U2
```

## Activity Flow Summary

### Pipeline Execution Time

| Stage                   | Typical Duration | Max Duration    | Failure Impact         |
| ----------------------- | ---------------- | --------------- | ---------------------- |
| **Document validation** | <100ms           | 500ms           | Stop immediately       |
| **Tool 0: Parse**       | 2-5s             | 30s             | Stop immediately       |
| **Tool 1: Map**         | 3-8s             | 30s × 3 retries | Stop after 3 retries   |
| **Tool 2: Structure**   | 3-6s             | 30s             | Stop immediately       |
| **Tool 3: Validate**    | 1-2s             | 10s             | Continue with warnings |
| **Total pipeline**      | 10-20s           | ~2 min          | -                      |

### Decision Points

1. **Document validation:** Valid format? → Continue / Stop
2. **Tool 0 parsing:** Successful? → Continue / Stop
3. **Tool 1 mapping:** Successful? → Continue / Retry (max 3) / Stop
4. **Tool 2 structuring:** Successful? → Continue / Stop
5. **Tool 3 validation:** Score >= 0.7? → PASSED / FAILED (but continue)

### Parallel Activities

- None in MVP (sequential Tool 0→1→2→3)
- Future: Tool 4/5/6 could run parallel after Tool 3

## Notes

- **Pipeline:** Strict sequential order, fail-fast except Tool 3
- **Explorer Agent:** Branching based on LLM intent classification
- **WebSocket:** Includes reconnection logic with exponential backoff
- **Canvas:** Free switching between views (Table ↔ Diagram ↔ Map)
- **Tool 1:** Complex with LLM retry logic and ambiguity resolution
- **Tool 3:** Comprehensive validation with error/warning/info levels
