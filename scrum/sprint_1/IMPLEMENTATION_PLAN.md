# Sprint 1 Implementation Plan - Gap Analysis & Roadmap

**Created:** 2025-11-30
**Updated:** 2025-11-30 04:15
**Status:** 🟢 Phase 2 Complete - Explorer Agent implemented
**Priority:** P0 - Must fix before Sprint 1 can proceed

## Executive Summary

~~Codex analysis odhalil kritické medzery medzi dokumentáciou (stories, diagramy) a reálnou implementáciou.~~

**✅ Phase 1 DONE:** Tool 1, 2, 3 a MVP Orchestrator sú implementované s 87 testami.

**✅ Phase 2 DONE:** Explorer Agent s Mock Collibra klientom - 31 testov.

**⏳ Phase 3 TODO:** FastAPI Backend, React Frontend.

### Test Summary

| Component           | Tests   | Status |
| ------------------- | ------- | ------ |
| Tool 1 (Ingest)     | 20      | ✅      |
| Tool 2 (Classifier) | 31      | ✅      |
| Tool 3 (Validator)  | 20      | ✅      |
| Orchestrator        | 16      | ✅      |
| Explorer Agent      | 31      | ✅      |
| **TOTAL**           | **118** | ✅      |

### Impact

| Blocked Story                 | Reason                         | Impact                    |
| ----------------------------- | ------------------------------ | ------------------------- |
| MCOP-S1-002 (Orchestrator)    | Tool 1-3 moduly neexistujú     | Cannot implement pipeline |
| MCOP-S1-003 (ER Diagram)      | Žiadny structure.json output   | No data to visualize      |
| MCOP-S1-004 (Explorer Agent)  | Mock Collibra client nemá data | No metadata to explore    |
| MCOP-S1-005 (FastAPI Backend) | Dependencies chýbajú           | Cannot build REST API     |
| MCOP-S1-006 (React Frontend)  | No backend to connect          | End-to-end nefunguje      |

**Záver:** Celý Sprint 1 je blokovaný. Treba fix `MCOP-S1-001` ako prvý krok.

---

## Gap Analysis Detail

### 1. Tool 1-3 Refactor (MCOP-S1-001) ❌

**Expected:**
```
src/
├── tool1/
│   ├── __init__.py
│   ├── ingest.py          # filter_metadata(json_path, scope)
│   └── README.md
├── tool2/
│   ├── __init__.py
│   ├── classifier.py      # classify_structure(filtered_data)
│   └── README.md
└── tool3/
    ├── __init__.py
    ├── validator.py       # validate_quality(structure)
    └── README.md
```

**Reality:**
```
src/
└── tool0/                 # ✅ ONLY this exists
    ├── __init__.py
    ├── parser.py
    └── schemas.py
```

**Evidence:**
- Notebooks exist: `tool1_ingest_databricks.ipynb`, `tool2_structure_databricks.ipynb`, `tool3_quality_databricks.ipynb`
- Output folders exist: `data/tool1/`, `data/tool2/`, `data/tool3/`
- But NO Python modules in `src/`

**Consequence:** Orchestrator cannot call Tool 1-3 as Python functions.

---

### 2. MVP Orchestrator (MCOP-S1-002) ❌

**Expected:**
```
src/orchestrator/
├── __init__.py
├── pipeline.py           # run_pipeline(document, scope)
├── run.py               # CLI entry point
└── state.py             # PipelineState model
```

**Reality:**
```
(NOTHING - folder doesn't exist)
```

**Story references:**
- Input: `ParsedRequest` from Tool 0
- Expected flow: Tool 0 → 1 → 2 → 3 → return `PipelineState`
- Default path: `metadata_path="data/analysis/ba_bs_datamarts_summary.json"`

**Blocker:** Broken path reference! Actual file:
```
data/analysis/ba_bs_datamarts_summary_2025-10-30T23-10-10.json
```

**Consequence:** Pipeline will fail immediately with `FileNotFoundError`.

---

### 3. Tests (MCOP-S1-001, S1-002) ❌

**Expected:**
```
tests/
├── __init__.py
├── test_tool1.py         # test_filter_bs_scope()
├── test_tool2.py         # test_classify_fact_dimension()
├── test_tool3.py         # test_articulation_score_extraction()
├── test_orchestrator.py  # test_pipeline_end_to_end()
└── conftest.py           # pytest fixtures
```

**Reality:**
```
(tests/ folder doesn't exist at all)
```

**Consequence:** No way to validate implementations, TDD impossible.

---

### 4. Dependencies (requirements.txt) ⚠️

**Current state:**
```python
# Only basics for Pydantic AI
pydantic-ai[graph]>=0.0.49
pydantic>=2.0.0
python-dotenv>=1.0.0
PyYAML>=6.0.0
openai>=1.0.0
databricks-sdk>=0.73.0
```

**Missing for Sprint 1:**

#### S1-005 (FastAPI Backend)
- `fastapi>=0.104.0`
- `uvicorn[standard]>=0.24.0`
- `websockets>=12.0`
- `httpx>=0.25.0` (for async HTTP clients)

#### S1-006 (React Frontend)
- No Python deps, but needs `npm install` in separate folder

#### Future (S1-004 improvements)
- `redis>=5.0.0` (session store - mentioned in diagrams)
- `pytest>=7.4.0` (for tests)
- `pytest-asyncio>=0.21.0` (for async tests)

**Consequence:** Cannot implement REST/WebSocket endpoints, no async client testing.

---

### 5. Explorer/REST/WebSocket (S1-004/005/006) ⚠️

**Documentation exists:**
- ✅ `scrum/diagramy/04-sequence-diagram.md` (WebSocket flow)
- ✅ `scrum/diagramy/05-state-diagram.md` (Session states)
- ✅ `scrum/architecture/fastapi-websocket.md` (DEPRECATED)
- ✅ `docs_pydantic/websocket-streaming.md` (NEW)
- ✅ `scrum/sprint_1/MCOP-S1-004-explorer-agent.md` (5 tools)
- ✅ `scrum/sprint_1/MCOP-S1-005-fastapi-backend.md` (REST + WS)
- ✅ `scrum/sprint_1/MCOP-S1-006-react-frontend.md` (Chat + Canvas)

**Code exists:**
- ❌ No `src/explorer/` module
- ❌ No `src/api/` module
- ❌ No `frontend/` folder

**Mock Collibra:**
- Expected: `src/explorer/mock_client.py` with `CollibraAPIMock`
- Reality: Only JSON dumps in `data/analysis/`

**Consequence:** Stories are fully designed but 0% implemented.

---

## Critical Path to Unblock Sprint 1

### Phase 1: Foundation (Week 1) - MCOP-S1-001 ✅ COMPLETE

#### Day 1-2: Tool 1-3 Core Modules ✅
```bash
# All implemented:
✅ src/tool1/ingest.py       # filter_metadata() - 20 tests passing
✅ src/tool2/classifier.py   # classify_structure() - 31 tests passing
✅ src/tool3/validator.py    # validate_quality() - 20 tests passing
```

**Completed Tasks:**
- [x] Extract logic from notebooks → Python modules
- [x] Create `__init__.py` for each module
- [x] Add docstrings with type hints
- [x] **FIXED:** Created symlink `data/analysis/ba_bs_datamarts_summary.json`

#### Day 3: Tests ✅
```bash
✅ tests/conftest.py      # Shared fixtures
✅ tests/test_tool1.py    # 20 tests
✅ tests/test_tool2.py    # 31 tests
✅ tests/test_tool3.py    # 20 tests
✅ tests/test_orchestrator.py # 16 tests
```

#### Day 4-5: Orchestrator (MCOP-S1-002) ✅
```bash
✅ src/orchestrator/__init__.py
✅ src/orchestrator/state.py    # PipelineState model
✅ src/orchestrator/pipeline.py # run_pipeline_sync()
```

**CLI working:**
```bash
python3 -m src.orchestrator.pipeline data/analysis/ba_bs_datamarts_summary.json bs
```

**87 total tests passing!**

### Phase 2: Backend (Week 2) - S1-004/005

#### Day 6-7: Explorer Agent (MCOP-S1-004)
```bash
mkdir src/explorer
touch src/explorer/{__init__.py,agent.py,mock_client.py,tools.py}
```

**Tasks:**
- [ ] `src/explorer/mock_client.py` - `CollibraAPIMock` reading from JSON
- [ ] `src/explorer/tools.py` - 5 tool functions (list_tables, get_table, etc.)
- [ ] `src/explorer/agent.py` - `explorer_agent = Agent(...)` with tools
- [ ] `tests/test_explorer.py` - Test each tool individually

#### Day 8-9: FastAPI Backend (MCOP-S1-005)
```bash
mkdir src/api
touch src/api/{__init__.py,main.py,websocket.py,routes.py}
```

**Tasks:**
- [ ] Update `requirements.txt` with FastAPI/uvicorn/websockets
- [ ] `src/api/main.py` - FastAPI app setup
- [ ] `src/api/routes.py` - REST endpoints: `/health`, `/api/pipeline`
- [ ] `src/api/websocket.py` - WebSocket handler for Explorer Agent
- [ ] Test with `curl` and `wscat`

### Phase 3: Frontend (Week 3) - S1-006

#### Day 10-12: React Frontend
```bash
# Create separate frontend/ folder
npx create-next-app@latest frontend --typescript --tailwind --app
cd frontend && npm install zustand mermaid
```

**Tasks:**
- [ ] Setup Next.js with TypeScript + Tailwind
- [ ] `src/hooks/useWebSocket.ts` - Custom hook for WS connection
- [ ] `src/components/Chat.tsx` - Chat panel with message history
- [ ] `src/components/Canvas.tsx` - Mermaid diagram renderer
- [ ] `src/stores/sessionStore.ts` - Zustand state management
- [ ] Test locally: Backend on `:8000`, Frontend on `:3000`

---

## Immediate Actions (Today)

### 1. Fix Path Issue ⚠️ CRITICAL
```bash
cd data/analysis
ln -s ba_bs_datamarts_summary_2025-10-30T23-10-10.json ba_bs_datamarts_summary.json
```

### 2. Create Skeleton Structure
```bash
# Tool modules
mkdir -p src/{tool1,tool2,tool3,orchestrator,explorer,api}
touch src/tool1/{__init__.py,ingest.py,README.md}
touch src/tool2/{__init__.py,classifier.py,README.md}
touch src/tool3/{__init__.py,validator.py,README.md}

# Tests
mkdir tests
touch tests/{__init__.py,conftest.py,test_tool1.py,test_tool2.py,test_tool3.py}
```

### 3. Update Requirements
```bash
# Add to requirements.txt
echo "fastapi>=0.104.0" >> requirements.txt
echo "uvicorn[standard]>=0.24.0" >> requirements.txt
echo "websockets>=12.0" >> requirements.txt
echo "httpx>=0.25.0" >> requirements.txt
echo "pytest>=7.4.0" >> requirements.txt
echo "pytest-asyncio>=0.21.0" >> requirements.txt

# Install
pip install -r requirements.txt
```

---

## Success Metrics

### Week 1 Goals (MCOP-S1-001 + S1-002)
- [ ] `pytest tests/test_tool*.py` - ALL GREEN
- [ ] `python -m src.orchestrator.run --scope bs` - Runs end-to-end
- [ ] Output files: `data/tool1/filtered.json`, `data/tool2/structure.json`, `data/tool3/quality.json`

### Week 2 Goals (MCOP-S1-004 + S1-005)
- [ ] `curl http://localhost:8000/health` - Returns `{"status": "ok"}`
- [ ] `wscat -c ws://localhost:8000/ws/test-session` - Connects successfully
- [ ] Explorer agent responds to "List all tables" query

### Week 3 Goals (MCOP-S1-006)
- [ ] Frontend connects to backend WebSocket
- [ ] User can send messages and see streaming responses
- [ ] Canvas renders Mermaid diagram from agent response

---

## Risks & Mitigations

### Risk 1: Notebook → Module Extraction Complex
**Likelihood:** High
**Impact:** Medium
**Mitigation:** Start with simplest tool (Tool 1), test incrementally

### Risk 2: Async/WebSocket Testing Difficult
**Likelihood:** Medium
**Impact:** High
**Mitigation:** Use `pytest-asyncio` + `httpx.AsyncClient` for tests

### Risk 3: Mock Collibra Data Quality
**Likelihood:** Medium
**Impact:** Medium
**Mitigation:** Validate JSON schema early, add data quality checks

### Risk 4: Frontend/Backend Integration
**Likelihood:** Low
**Impact:** High
**Mitigation:** Use CORS properly, test WS connection before UI

---

## Recommendations

### For Immediate Fix (Next 24h)
1. **Create symlink** for datamart JSON (1 min)
2. **Scaffold all folders** per struktura above (5 min)
3. **Extract Tool 1** from notebook → module (2-3h)
4. **Write test_tool1.py** with sample data (1h)
5. **Run pytest** - get first GREEN test (10 min)

### For Week 1 Success
- **Focus on Tool 1-3 + Orchestrator ONLY**
- Ignore Explorer/REST/WebSocket for now
- Get end-to-end pipeline working: `document.md` → `quality_report.json`
- All tests must pass before Week 2

### For Long-Term Quality
- Add GitHub Actions CI/CD (run tests on every push)
- Add pre-commit hooks (black, mypy, pylint)
- Document each module with examples in README.md
- Keep notebooks as "reference implementation" but NOT source of truth

---

## Next Steps

**DECISION NEEDED:** Chceš aby som:

**Option A:** Začnem implementovať Tool 1 (`src/tool1/ingest.py`) s testami?
**Option B:** Vytvorím len skeleton (prázdne súbory) a ty implementuješ?
**Option C:** Najprv fix symlink + requirements, potom sa rozhodneme?

**Recommended:** Option A (implementujem Tool 1 kompletne = odblokujem celý pipeline)
