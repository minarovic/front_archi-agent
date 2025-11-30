# Deployment Diagram - MCOP Infrastructure

Zobrazuje fyzické nasadenie komponentov na infraštruktúru.

## High-Level Deployment (Mermaid)

```mermaid
graph TB
    subgraph "User Device"
        Browser[Web Browser<br/>Chrome/Firefox/Safari]
    end

    subgraph "Vercel Edge Network"
        CDN[CDN Edge Nodes<br/>Global Distribution]
        FE[React Frontend<br/>Static Bundle]
        CDN --> FE
    end

subgraph RailwayCloud["Railway Cloud - Europe"]
        subgraph ContainerInstance["Container Instance"]
            BE[FastAPI App<br/>Python 3.13]
            Explorer[Explorer Agent<br/>Pydantic AI]
            Pipeline[Pipeline Orchestrator]
            MockClient[Mock Collibra Client]
        end

        subgraph PersistentStorage["Persistent Storage"]
            DataVolume[/data/ Volume<br/>JSON Dumps]
        end

        BE --> Explorer
        BE --> Pipeline
        Explorer --> MockClient
        Pipeline --> MockClient
        MockClient --> DataVolume
    end

    subgraph AzureCloud["Azure Cloud - Sweden Central"]
        OpenAI[Azure OpenAI<br/>gpt-5-mini<br/>test-gpt-5-mini]
    end

    subgraph "Future Integration"
        Collibra[Collibra SaaS<br/>REST API]
        Redis[(Redis Cloud<br/>Session Store)]
    end

    Browser -->|HTTPS| CDN
    Browser -->|WebSocket/HTTPS| BE
    Explorer -->|REST API| OpenAI
    Pipeline -->|REST API| OpenAI

    BE -.->|future| Redis
    Explorer -.->|future| Collibra

    style Browser fill:#e5e7eb,color:#000
    style FE fill:#0070f3,color:#fff
    style BE fill:#0b0d0f,color:#fff
    style OpenAI fill:#0078d4,color:#fff
    style Collibra fill:#f59e0b,color:#000
    style Redis fill:#dc2626,color:#fff
```

## Detailed Deployment View (PlantUML)

```plantuml
@startuml MCOP_Deployment_Diagram
!theme plain
skinparam nodeStyle rectangle

node "User Device" {
    artifact "Web Browser" as Browser
}

cloud "Vercel Platform" {
    node "Edge Network" {
        artifact "CDN" as CDN
        node "Static Hosting" {
            artifact "index.html" as HTML
            artifact "bundle.js" as JS
            artifact "bundle.css" as CSS
        }
    }
}

cloud "Railway Platform - Europe" {
    node "Container Instance" <<Docker>> {
        component "FastAPI App" as API {
            portin "HTTP :8000"
            portin "WS :8000"
        }

        component "Explorer Agent" as Explorer
        component "Pipeline Orchestrator" as Pipeline
        component "Mock Collibra" as Mock

        API --> Explorer
        API --> Pipeline
        Explorer --> Mock
        Pipeline --> Mock
    }

    storage "Persistent Volume" as Volume {
        folder "/data/analysis" {
            file "ba_bs_datamarts_summary.json" as JSON
        }
    }

    Mock --> JSON
}

cloud "Azure Cloud - Sweden Central" {
    node "Cognitive Services" {
        component "OpenAI Service" as OpenAI {
            portin "HTTPS :443"
        }
        database "Model Cache" as Cache
        OpenAI --> Cache
    }
}

cloud "Future Integration" {
    node "Collibra SaaS" {
        component "REST API" as CollibraAPI {
            portin "HTTPS :443"
        }
    }

    node "Redis Cloud" {
        database "Session Store" as Redis {
            portin "Redis :6379"
        }
    }
}

Browser -down-> CDN : HTTPS
Browser -down-> API : WebSocket\nHTTPS

Explorer -right-> OpenAI : REST API\nOpenAI SDK
Pipeline -right-> OpenAI : REST API\nOpenAI SDK

API ..> Redis : future
Explorer ..> CollibraAPI : future

@enduml
```

## Network Architecture

```mermaid
graph LR
    subgraph "Public Internet"
        User([User<br/>:443 HTTPS])
    end

    subgraph "Vercel Edge"
        Edge[Edge Node<br/>:443 TLS]
    end

    subgraph "Railway Private Network"
        LB[Load Balancer<br/>:8000]
        App1[App Instance 1<br/>:8000]
        App2[App Instance 2<br/>:8000]

        LB --> App1
        LB --> App2
    end

    subgraph "Azure Network"
        APIM[API Management<br/>:443]
        OpenAI_Svc[OpenAI Service<br/>Internal]

        APIM --> OpenAI_Svc
    end

    User -->|TLS 1.3| Edge
    User -->|WSS/HTTPS| LB
    App1 -->|HTTPS| APIM
    App2 -->|HTTPS| APIM

    style User fill:#e5e7eb,color:#000
    style Edge fill:#0070f3,color:#fff
    style LB fill:#0b0d0f,color:#fff
    style APIM fill:#0078d4,color:#fff
```

## Container Architecture (Railway)

```mermaid
graph TB
    subgraph "Railway Container"
        subgraph "Application Layer"
            Uvicorn[Uvicorn Server<br/>ASGI]
            FastAPI_App[FastAPI Application]
            Middleware[CORS Middleware<br/>Error Handler]

            Uvicorn --> FastAPI_App
            FastAPI_App --> Middleware
        end

        subgraph "Business Logic Layer"
            Routes[REST Routes<br/>WebSocket Handlers]
            SessionMgr[Session Manager<br/>In-Memory Dict]
            ExplorerAgent[Explorer Agent<br/>Pydantic AI]
            PipelineOrch[Pipeline Orchestrator<br/>Pydantic AI]

            Middleware --> Routes
            Routes --> SessionMgr
            Routes --> ExplorerAgent
            Routes --> PipelineOrch
        end

        subgraph "Data Access Layer"
            MockCollibra[Mock Collibra Client]
            FileSystem[File System Access]

            ExplorerAgent --> MockCollibra
            PipelineOrch --> MockCollibra
            MockCollibra --> FileSystem
        end

        subgraph "External Clients"
            OpenAI_Client[OpenAI Client<br/>httpx]

            ExplorerAgent --> OpenAI_Client
            PipelineOrch --> OpenAI_Client
        end
    end

    subgraph "Volume Mount"
        DataDir[/app/data/<br/>Read-Only]
    end

    FileSystem --> DataDir

    subgraph "Environment"
        EnvVars[Environment Variables<br/>OPENAI_API_KEY, etc.]
    end

    OpenAI_Client -.-> EnvVars
```

## Resource Allocation

### Railway Container Specs (MVP)

| Resource | Allocation | Limit    |
| -------- | ---------- | -------- |
| CPU      | 0.5 vCPU   | 2 vCPU   |
| Memory   | 512 MB     | 2 GB     |
| Storage  | 1 GB       | 10 GB    |
| Network  | Shared     | 100 Mbps |

### Vercel Deployment Specs

| Resource          | Free Tier | Pro Tier |
| ----------------- | --------- | -------- |
| Build Time        | 45s       | 60s      |
| Serverless Memory | 1 GB      | 3 GB     |
| Edge Functions    | 1 KB      | 500 KB   |
| Bandwidth         | 100 GB/mo | 1 TB/mo  |

### Azure OpenAI Quotas

| Metric       | Value           |
| ------------ | --------------- |
| Model        | gpt-5-mini      |
| Deployment   | test-gpt-5-mini |
| Tokens/min   | 150,000         |
| Requests/min | 1,000           |
| Region       | Sweden Central  |

## Deployment Process

### Railway Deployment Flow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Git as GitHub
    participant Railway as Railway Platform
    participant Container as Docker Container
    participant Azure as Azure OpenAI

    Dev->>Git: git push origin main
    Git->>Railway: Webhook trigger
    Railway->>Railway: Build Dockerfile
    Railway->>Railway: Run tests (optional)
    Railway->>Container: Deploy new version
    Railway->>Container: Health check /health
    Container-->>Railway: HTTP 200 OK
    Railway->>Railway: Update routing
    Container->>Azure: Test API connection
    Azure-->>Container: API OK
    Railway-->>Dev: Deployment success ✅
```

### Vercel Deployment Flow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Git as GitHub
    participant Vercel as Vercel Platform
    participant CDN as Edge Network

    Dev->>Git: git push origin main
    Git->>Vercel: Webhook trigger
    Vercel->>Vercel: npm install
    Vercel->>Vercel: npm run build
    Vercel->>Vercel: Optimize assets
    Vercel->>CDN: Deploy to edge nodes
    CDN-->>Vercel: Deployment complete
    Vercel->>Vercel: Run lighthouse checks
    Vercel-->>Dev: Deployment URL + preview ✅
```

## Environment Variables

### Railway Backend

```bash
# Azure OpenAI
OPENAI_API_BASE=https://minar-mhi2wuzy-swedencentral.cognitiveservices.azure.com/openai/v1/
OPENAI_API_KEY=sk-*********************
OPENAI_API_VERSION=2024-10-21

# Application
CORS_ORIGINS=https://mcop.vercel.app,http://localhost:3000
LOG_LEVEL=INFO
PORT=8000  # Set by Railway

# Future
# REDIS_URL=redis://default:***@redis-cloud.com:6379
# COLLIBRA_API_KEY=***
# COLLIBRA_BASE_URL=https://company.collibra.com/api
```

### Vercel Frontend

```bash
# Backend API
VITE_API_URL=https://mcop-api.railway.app
VITE_WS_URL=wss://mcop-api.railway.app

# Analytics (optional)
VITE_VERCEL_ANALYTICS_ID=***
```

## Security Architecture

```mermaid
graph TB
    subgraph "Security Layers"
        WAF[Vercel WAF<br/>DDoS Protection]
        TLS[TLS 1.3<br/>HTTPS Everywhere]
        CORS[CORS Policy<br/>Origin Validation]
        Secrets[Secrets Manager<br/>Encrypted Env Vars]

        WAF --> TLS
        TLS --> CORS
        CORS --> Secrets
    end

    subgraph "Authentication (Future)"
        AAD[Azure AD<br/>OAuth 2.0]
        JWT[JWT Tokens<br/>Session Auth]

        AAD --> JWT
    end

    subgraph "Data Protection"
        Encryption[Data at Rest<br/>Encrypted Volumes]
        Transit[Data in Transit<br/>TLS/WSS]

        Encryption -.->|combined| Transit
    end

    User([User]) --> WAF
    Secrets --> Backend[Backend App]
    JWT -.-> Backend
    Backend --> Encryption
    Backend --> Transit
```

## Monitoring & Observability

### Railway Monitoring

```mermaid
graph LR
    App[FastAPI App] -->|logs| RailwayLogs[Railway Logs]
    App -->|metrics| RailwayMetrics[Railway Metrics]

    RailwayLogs --> LogAggregator[Log Viewer]
    RailwayMetrics --> Dashboard[Railway Dashboard]

    Dashboard -->|alerts| Slack[Slack Notifications]
    Dashboard -->|alerts| Email[Email Alerts]
```

### Health Checks

| Endpoint  | Check           | Interval | Timeout |
| --------- | --------------- | -------- | ------- |
| `/health` | HTTP 200        | 30s      | 10s     |
| `/health` | Response body   | 30s      | 10s     |
| WebSocket | Connection test | 60s      | 15s     |

### Application Logs

```python
# Structured logging
logger.info("session_created", extra={
    "session_id": session_id,
    "user_ip": request.client.host,
    "timestamp": datetime.now().isoformat()
})

logger.error("llm_timeout", extra={
    "model": "gpt-5-mini",
    "timeout": 30,
    "retry_attempt": 2
})
```

## Scaling Strategy

### Horizontal Scaling (Future)

```mermaid
graph TB
    subgraph "Railway - Multi-Instance"
        LB[Load Balancer]
        App1[Instance 1<br/>EU West]
        App2[Instance 2<br/>EU West]
        App3[Instance 3<br/>US East]

        LB --> App1
        LB --> App2
        LB --> App3
    end

    subgraph "Shared State"
        Redis[(Redis Cluster<br/>Session Store)]

        App1 --> Redis
        App2 --> Redis
        App3 --> Redis
    end

    User([User]) --> LB
```

### Cost Estimates (Monthly)

| Service       | Tier          | Usage          | Cost       |
| ------------- | ------------- | -------------- | ---------- |
| Railway       | Hobby         | 100h runtime   | $5         |
| Vercel        | Hobby         | Static hosting | $0         |
| Azure OpenAI  | Pay-as-you-go | ~1M tokens     | $10-30     |
| **Total MVP** |               |                | **$15-35** |

## Disaster Recovery

### Backup Strategy

```mermaid
graph LR
    App[Application] -->|daily| GitBackup[Git Repository]
    App -->|on-change| DataBackup[data Volume S3 Backup]
    App -->|never| Sessions[In-Memory Sessions Not backed up]

    GitBackup --> Restore[Quick Restore under 5 min]
    DataBackup --> Restore

    style Sessions fill:#dc2626,color:#fff
```

### RTO/RPO Targets

| Component | RTO    | RPO      | Strategy             |
| --------- | ------ | -------- | -------------------- |
| Frontend  | 5 min  | 0        | Vercel auto-rollback |
| Backend   | 10 min | 0        | Railway redeploy     |
| Sessions  | N/A    | N/A      | No persistence (MVP) |
| Data      | 1 hour | 24 hours | S3 backup restore    |

## Notes

- **MVP:** Single Railway instance, no Redis, mock Collibra
- **Production:** Multi-region, Redis cluster, real Collibra API
- **Security:** Add Azure AD auth, API rate limiting
- **Monitoring:** Integrate Application Insights, Sentry
