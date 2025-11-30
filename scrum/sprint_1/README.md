# Sprint 1: MCOP MVP

**Sprint Duration:** 2025-12-02 → 2025-12-20 (3 týždne)
**Goal:** End-to-end MCOP pipeline s Explorer Agentom a základným frontendom

---

## 📋 Stories v Sprinte

| #   | Story ID    | Názov                                          | Effort  | Priorita | Závislosť      |
| --- | ----------- | ---------------------------------------------- | ------- | -------- | -------------- |
| 1   | MCOP-S1-001 | Tool 1-3 Refactor (Notebooks → Python modules) | 3-5 dní | 🔴 MUST   | -              |
| 2   | MCOP-S1-002 | MVP Orchestrator (Tool 0→1→2→3 pipeline)       | 2-3 dni | 🔴 MUST   | S1-001         |
| 3   | MCOP-S1-003 | Tool 5 - ER Diagram Generator (Mermaid)        | 4-6 h   | 🟡 SHOULD | S1-001         |
| 4   | MCOP-S1-004 | Explorer Agent (Mock Collibra client)          | 2-3 dni | 🟡 SHOULD | -              |
| 5   | MCOP-S1-005 | FastAPI Backend (REST + WebSocket)             | 2-3 dni | 🔴 MUST   | S1-002, S1-004 |
| 6   | MCOP-S1-006 | React Frontend (Chat + Canvas)                 | 3-5 dní | 🔴 MUST   | S1-005         |

---

## 🚀 Implementačné poradie

```
Week 1 (2.-6. Dec):
├── [S1-001] Tool 1-3 Refactor ────────────────────────────┐
│   ├── Day 1-2: Tool 1 (ingest) → src/tool1/ingest.py     │
│   ├── Day 2-3: Tool 2 (structure) → src/tool2/classifier.py
│   └── Day 3-4: Tool 3 (quality) → src/tool3/validator.py │
└───────────────────────────────────────────────────────────┘

Week 2 (9.-13. Dec):
├── [S1-002] MVP Orchestrator ─────────────────────────────┐
│   ├── Day 1: src/orchestrator/pipeline.py                │
│   └── Day 2: tests/test_orchestrator.py                  │
├── [S1-003] Tool 5 - ER Diagram ──────────────────────────┤
│   └── 4-6h: src/tool5/diagram_generator.py               │
├── [S1-004] Explorer Agent (Mock) ────────────────────────┤
│   ├── Day 1: src/integrations/collibra_mock.py           │
│   ├── Day 2: src/explorer/agent.py                       │
│   └── Day 3: tests/test_explorer.py                      │
└───────────────────────────────────────────────────────────┘

Week 3 (16.-20. Dec):
├── [S1-005] FastAPI Backend ──────────────────────────────┐
│   ├── Day 1: src/api/main.py (REST endpoints)            │
│   ├── Day 2: WebSocket support                           │
│   └── Day 3: Deploy to Railway                           │
├── [S1-006] React Frontend ───────────────────────────────┤
│   ├── Day 1-2: Chat panel + Canvas layout                │
│   ├── Day 3-4: Mermaid diagram rendering                 │
│   └── Day 5: Deploy to Vercel                            │
└───────────────────────────────────────────────────────────┘
```

---

## 🧪 Testovanie

### MCOP-S1-001: Tool 1-3 Refactor
```bash
# Test Tool 1
python -m pytest tests/test_tool1.py -v
python src/tool1/ingest.py --input data/analysis/ba_bs_datamarts_summary.json

# Test Tool 2
python -m pytest tests/test_tool2.py -v
python src/tool2/classifier.py --input data/tool1/filtered_dataset.json

# Test Tool 3
python -m pytest tests/test_tool3.py -v
python src/tool3/validator.py --input data/tool2/structure.json
```

### MCOP-S1-002: MVP Orchestrator
```bash
# Unit tests
python -m pytest tests/test_orchestrator.py -v

# E2E test
python src/orchestrator/run.py --request data/sample_business_request.md
# Expected output: data/output/structure.json, quality_report.json
```

### MCOP-S1-003: Tool 5 - ER Diagram
```bash
# Generate diagram
python src/tool5/diagram_generator.py --input data/tool2/structure.json

# Verify output
cat data/tool5/diagram.md | head -20
# Expected: ```mermaid\nerDiagram\n...
```

### MCOP-S1-004: Explorer Agent (Mock)
```bash
# Unit tests
python -m pytest tests/test_explorer.py -v

# Interactive test
python src/explorer/cli.py
> query_assets("bs_purchase")
> update_asset_description("dm_bs_purchase", "Test description")
```

### MCOP-S1-005: FastAPI Backend
```bash
# Start server
uvicorn src.api.main:app --reload --port 8000

# Test endpoints
curl http://localhost:8000/api/health
curl -X POST http://localhost:8000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Show me all BS assets"}'

# WebSocket test
websocat ws://localhost:8000/ws/test-session
```

### MCOP-S1-006: React Frontend
```bash
cd frontend
npm install
npm run dev

# Open http://localhost:3000
# Test:
# 1. Send message in chat
# 2. Verify canvas updates
# 3. Request "show diagram" → verify Mermaid rendering
```

---

## 🏗️ Deployment

### Backend (Railway)
```bash
# railway.json in project root
railway login
railway init
railway up

# Environment variables (Railway dashboard):
# - AZURE_OPENAI_ENDPOINT
# - AZURE_OPENAI_API_KEY
# - AZURE_OPENAI_DEPLOYMENT_NAME
```

### Frontend (Vercel)
```bash
cd frontend
vercel login
vercel --prod

# Environment variables (Vercel dashboard):
# - NEXT_PUBLIC_API_URL=https://your-app.railway.app
```

---

## 📊 Definition of Done

- [ ] Všetky testy prechádzajú (`pytest tests/ -v`)
- [ ] Code review approved
- [ ] Dokumentácia aktualizovaná
- [ ] Deployed na staging (Railway/Vercel)
- [ ] Demo pripravené

---

## 🔗 Technická dokumentácia

| Dokument                                                     | Popis                                  |
| ------------------------------------------------------------ | -------------------------------------- |
| [pydantic-ai-tools.md](../architecture/pydantic-ai-tools.md) | Pydantic AI agent a tools pattern      |
| [fastapi-websocket.md](../architecture/fastapi-websocket.md) | FastAPI REST + WebSocket implementácia |
| [mermaid-diagrams.md](../architecture/mermaid-diagrams.md)   | Mermaid ER diagram generovanie         |
| [deployment.md](../architecture/deployment.md)               | Railway + Vercel deployment guide      |

---

## 📝 Notes

- **Collibra API:** Používame mock client (`CollibraAPIMock`) s JSON dumpom
- **Session:** In-memory dict (bez Redis pre MVP)
- **Frontend:** React + Mermaid.js pre diagram rendering
- **LLM:** Azure OpenAI gpt-5-mini (Sweden Central)
