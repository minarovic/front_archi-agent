# MCOP UML Diagramy

Kompletná vizualizácia MCOP architektúry pomocou UML diagramov.

## Obsah

### Štruktúrne diagramy
1. [Component Diagram](01-component-diagram.md) ✅ - Komponenty a ich vzťahy
2. [Class Diagram](02-class-diagram.md) ✅ - Dátové modely a triedy
3. [Deployment Diagram](03-deployment-diagram.md) ✅ - Railway + Vercel infraštruktúra

### Behaviorálne diagramy
4. [Sequence Diagram](04-sequence-diagram.md) ✅ - WebSocket chat flow s streaming
5. [State Diagram](05-state-diagram.md) ✅ - Session, Canvas, Agent, Connection states
6. [Activity Diagram](06-activity-diagram.md) ✅ - Pipeline, Explorer, Tool 1/3 flows

## Quick Reference

### Komponenty MCOP

```
Frontend (Vercel)
├── ChatPanel (User input + message history)
├── Canvas (Mermaid diagram rendering)
└── WebSocket Client (Streaming connection)

Backend (Railway)
├── FastAPI (REST + WebSocket endpoints)
├── Explorer Agent (Pydantic AI + 5 tools)
├── MVP Orchestrator (Tool 0→1→2→3 pipeline)
└── Mock Collibra Client (JSON dump reader)

External Services
├── Azure OpenAI (gpt-5-mini LLM)
└── Collibra (Future: Real API integration)
```

### Key Flows

| User Action        | Flow Type        | Primary Diagram    |
| ------------------ | ---------------- | ------------------ |
| Ask question       | WebSocket Stream | Sequence Diagram   |
| Pipeline execution | Orchestration    | Activity Diagram   |
| Session management | State Machine    | State Diagram      |
| System deployment  | Infrastructure   | Deployment Diagram |

### Diagram Conventions

**Mermaid Syntax:**
- `[Component]` - System component
- `-->` - Synchronous call
- `-->>` - Asynchronous response
- `||--o{` - One-to-many relationship
- `[*]` - Initial/final state

**PlantUML Syntax:**
- `()` - Use case
- `[]` - Component
- `{}` - Class
- `|>` - Inheritance
- `o--` - Association

## Rendering

### Online Viewers
- **Mermaid:** https://mermaid.live/
- **PlantUML:** https://www.plantuml.com/plantuml/uml/

### VS Code Extensions
- Mermaid Preview (extension ID: `bierner.markdown-mermaid`)
- PlantUML (extension ID: `jebbs.plantuml`)

### Local Rendering
```bash
# Mermaid CLI
npm install -g @mermaid-js/mermaid-cli
mmdc -i diagram.mmd -o diagram.png

# PlantUML
java -jar plantuml.jar diagram.puml
```
