# Proactive Monitoring - Diagrams


**Date:** October 9, 2025

---

## 1. ETL Pipeline



```mermaid
flowchart LR
    %% Main ETL pipeline
    A1[Extract] --> A2[Load]
    A2 --> A3[Transform]
    A3 --> A4[Load]
    A4 --> A5[Aggregate]
    A5 --> A6[Serve]

    %% Supporting layers under each block
    %% EXTRACT
    subgraph ExtractLayer [" "]
        D1[Sayari API]
        D2[DnB API]
        D3[SAP source]
        D4[Data collection]
        D1 --> D4
        D2 --> D4
        D3 --> D4
    end
    D4 -.-> A1

    %% LOAD 1
    subgraph Load1Layer [" "]
        L1[Databricks upload service]
        L2[DB Upload service]
        L1 --> L2
    end
    L2 -.-> A2

    %% TRANSFORM
    subgraph TransformLayer [" "]
        T1[Databricks Python Env]
        T2[Correlation analysis and dataset]
        T1 --> T2
    end
    T2 -.-> A3

    %% LOAD 2
    subgraph Load2Layer [" "]
        W1[Databricks Workflow]
    end
    W1 -.-> A4

    %% AGGREGATE
    subgraph AggregateLayer [" "]
        C1[Consumer View Data Preparation]
    end
    C1 -.-> A5
```

**Key Phases:**
1. **Extract:** Sayari + DnB + SAP source → Data collection
2. **Load:** Databricks upload → Bronze layer
3. **Transform:** Python correlation analysis → Silver layer
4. **Load:** Databricks Workflow → Gold layer
5. **Aggregate:** Consumer view preparation → Feature Store
6. **Serve:** API + Power BI + N-Tier runtime

---

## 2. Monitoring Pipeline Architecture

```mermaid
graph TB
    subgraph "TierIndex (Static)"
        Gold[Gold Layer<br/>ti_supplier_metrics]
    end

    subgraph "Feature Store (Time-Series)"
        FS[supplier_monitoring_snapshots<br/>Hourly snapshots]
        Gold --> FS
    end

    subgraph "Monitoring Pipeline"
        MP[Monitoring Job<br/>Databricks Workflow]
        FS --> MP

        MP --> Detection{Anomaly<br/>Detected?}
    end

    subgraph "Rule-Based"
        Rules[Business Rules<br/>CUSUM + Thresholds]
        Detection --> Rules
    end

    subgraph "ML-Enhanced"
        ML[ML Models<br/>LightGBM + IF]
        MLflow[(MLflow<br/>Model Registry)]
        MLflow --> ML
        Detection --> ML
    end

    subgraph "Alert Engine"
        Rules --> AE[Alert<br/>Formatter]
        ML --> AE

        AE --> Severity{Severity?}
    end

    subgraph "Notification Delivery"
        Severity -->|HIGH| Teams[Teams Webhook]
        Severity -->|HIGH| Email[Email<br/>SendGrid]
        Severity -->|MEDIUM| EmailDigest[Email<br/>Daily Digest]
        Severity -->|LOW| Dashboard[Power BI<br/>Dashboard]
    end

    subgraph "Audit & Logging"
        AE --> Log[(Alert History<br/>Gold Layer)]
        Teams --> Log
        Email --> Log
    end

    style Gold fill:#90EE90
    style FS fill:#87CEEB
    style ML fill:#FFD700
    style Rules fill:#FFD700
```

---

## 3. SCR-06: Deterioration Prediction Flow (ML-Enhanced)

```mermaid
sequenceDiagram
    participant FS as Feature Store
    participant Monitor as Monitoring Pipeline
    participant ML as LightGBM Model
    participant Alert as Alert Engine
    participant Teams
    participant Email
    participant Log as Alert History

    Note over FS: Hourly snapshots<br/>with rolling windows

    FS->>Monitor: Latest snapshots (Tier 1)

    loop For each supplier
        Monitor->>ML: Extract features (12 dimensions)

        Note over ML: LightGBM inference<br/>+ SHAP explanations

        ML-->>Monitor: Probability + top factors

        alt Probability > 80%
            Monitor->>Alert: High-risk alert

            Note over Alert: Format message<br/>with evidence

            par Notification Delivery
                Alert->>Teams: Webhook POST
                Alert->>Email: SendGrid API
            end

            Alert->>Log: Insert alert record

            Teams-->>Alert: Delivery confirmed
            Email-->>Alert: Delivery confirmed
        else Probability < 80%
            Monitor->>Monitor: Continue monitoring
        end
    end

    Note over Log: Audit trail<br/>for compliance
```

---

## 4. SCR-07: Crisis Impact Analysis Flow

```mermaid
graph TD
    Start[Crisis Detected:<br/>SUPPLIER_X Bankrupt] --> Input[Input Agent]

    Input --> Graph[Graph Traversal Agent]

    Graph --> Upstream[Upstream Analysis]
    Graph --> Downstream[Downstream Analysis]

    Upstream --> U1[Direct Customers<br/>Tier-1]
    Upstream --> U2[Indirect<br/>Tier-2]

    Downstream --> D1[Sub-Suppliers<br/>Tier-3]

    U1 --> Project[Project Mapping Agent]
    U2 --> Project

    Project --> P1[Critical Projects<br/>No buffer]
    Project --> P2[Medium Risk<br/>1-2 months buffer]
    Project --> P3[Low Risk<br/>3+ months buffer]

    Graph --> Alt[Alternative Matching Agent]

    Alt --> Semantic[Semantic Search<br/>Capability embeddings]
    Alt --> Filter[Filter by capacity<br/>+ lead time]

    Semantic --> Rank[Rank alternatives<br/>Combined score]
    Filter --> Rank

    P1 --> Impact[Impact Quantification]
    P2 --> Impact
    P3 --> Impact
    Rank --> Impact

    Impact --> Report[LLM Report Generator]

    Report --> Output[Crisis Impact Report<br/>4 minutes total]

    style Start fill:#FF6B6B
    style P1 fill:#FF6B6B
    style Output fill:#51CF66
```

---

## 6. Alert Delivery Workflow

```mermaid
stateDiagram-v2
    [*] --> Detected: Anomaly Detected

    Detected --> Enriched: Enrich with<br/>supplier details

    Enriched --> Severity: Evaluate severity

    Severity --> High: severity = HIGH
    Severity --> Medium: severity = MEDIUM
    Severity --> Low: severity = LOW

    High --> TeamsEmail: Send Teams + Email<br/><5 min SLA
    Medium --> EmailDigest: Add to daily digest<br/><24h SLA
    Low --> Dashboard: Update dashboard only

    TeamsEmail --> Logged: Log delivery
    EmailDigest --> Logged
    Dashboard --> Logged

    Logged --> Active: Alert active

    Active --> Resolved: User resolves
    Active --> AutoDismiss: 7 days auto-dismiss

    Resolved --> Archived: Move to archive
    AutoDismiss --> Archived

    Archived --> [*]

    note right of High
        Recipients:
        - Procurement Manager
        - Category Manager
    end note

    note right of Medium
        Recipients:
        - Buyer
        - Risk Manager
    end note
```

---

## 6. Feature Engineering Pipeline

```mermaid
flowchart TD
    subgraph "Inputs"
        Gold[TierIndex Gold Layer<br/>ti_supplier_metrics]
        Historical[Historical Snapshots<br/>90 days lookback]
    end

    Gold --> Current[Current Values]
    Historical --> Windows

    subgraph "Feature Engineering"
        Current --> Join

        Windows[Rolling Windows] --> W7[7-day averages]
        Windows --> W30[30-day averages<br/>+ trends]
        Windows --> W90[90-day volatility]

        W7 --> Join
        W30 --> Join
        W90 --> Join

        Join[Join on supplier_id] --> Derived

        Derived[Derived Features] --> Trend[Revenue trend slope]
        Derived --> Benchmark[Industry benchmark<br/>z-score]
        Derived --> UBO[UBO change detection]
    end

    Trend --> Output[Feature Store]
    Benchmark --> Output
    UBO --> Output

    Output --> Partition[Partition by date<br/>Z-order by supplier_id]

    Partition --> FS[(supplier_monitoring_snapshots)]

    style Gold fill:#90EE90
    style FS fill:#87CEEB
```

---
