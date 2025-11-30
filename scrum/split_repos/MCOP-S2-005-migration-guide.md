---
id: MCOP-S2-005
title: Repo Split Migration Guide
type: task
status: planned
priority: should-have
effort: 5-6 hours
sprint: 2
created: 2025-11-30
updated: 2025-11-30
---

# MCOP-S2-005: Repo Split Migration Guide

## Decision Context

**Rationale:** Split monorepo into separate `archi-agent` (backend) and `archi-agent-frontend` repos based on user's practical experience: *"osvedcilo sa mi rozdelenie na 2 repo u podovbnej velkosti, pretoze su v kazdom informacie o danej technologii a moze sa hromadit knowledge base"*

**Backend as Source of Truth:** Backend repository will generate and version the OpenAPI schema, which frontend consumes via automated sync scripts.

## Migration Phases

### Phase 1: Backend Cleanup (2 hours)

**Goal:** Remove frontend code, generate OpenAPI schema, update documentation

#### 1.1 Remove Frontend Directory
```bash
cd /Users/marekminarovic/archi-agent
git checkout -b repo-split
rm -rf frontend/
git add frontend/
git commit -m "feat: Remove frontend code (moved to archi-agent-frontend repo)"
```

#### 1.2 Generate OpenAPI Schema
Create `src/api/generate_openapi.py`:
```python
"""Generate OpenAPI schema for frontend consumption."""
import json
from pathlib import Path
from src.api.main import app


def generate_schema():
    """Generate OpenAPI schema and save to src/api/openapi.json."""
    schema = app.openapi()
    output = Path(__file__).parent / "openapi.json"
    output.write_text(json.dumps(schema, indent=2))
    print(f"✅ OpenAPI schema generated: {output}")
    print(f"   Version: {schema['info']['version']}")
    print(f"   Endpoints: {len(schema['paths'])}")


if __name__ == "__main__":
    generate_schema()
```

Run generation:
```bash
python3 src/api/generate_openapi.py
git add src/api/openapi.json src/api/generate_openapi.py
git commit -m "feat: Add OpenAPI schema generation"
```

#### 1.3 Update Backend README
Replace `README.md` with backend-focused version:
```bash
cp scrum/split_repos/BACKEND_README_TEMPLATE.md README.md
git add README.md
git commit -m "docs: Update README for backend-only repo"
```

#### 1.4 Update CI/CD Workflow
Rename and simplify `.github/workflows/ci.yml` → `backend-ci.yml`:
```yaml
name: Backend CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python 3.13
        uses: actions/setup-python@v5
        with:
          python-version: '3.13'

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Run tests
        run: pytest tests/ -v --tb=short

      - name: Generate OpenAPI schema
        run: python3 src/api/generate_openapi.py

      - name: Commit schema changes
        if: github.ref == 'refs/heads/main'
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add src/api/openapi.json
          git diff --staged --quiet || git commit -m "chore: Update OpenAPI schema [skip ci]"
          git push

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Railway
        run: echo "Railway auto-deploys on main push"
```

Commit changes:
```bash
git add .github/workflows/backend-ci.yml
git rm .github/workflows/ci.yml
git commit -m "ci: Update workflow for backend-only repo"
```

#### 1.5 Tag Backend v0.1.0
```bash
git tag -a v0.1.0 -m "Backend v0.1.0 - Repo split baseline"
git push origin repo-split
git push origin v0.1.0
```

---

### Phase 2: Frontend Repo Creation (2 hours)

**Goal:** Create new `archi-agent-frontend` repo with frontend code + docs

#### 2.1 Create New Repository
```bash
cd ~/projects
mkdir archi-agent-frontend
cd archi-agent-frontend
git init
```

#### 2.2 Copy Frontend Files
```bash
# From monorepo (before Phase 1 deletion)
cd /Users/marekminarovic/archi-agent
git checkout main  # Get original frontend code

# Copy frontend directory
cp -r frontend/* ~/projects/archi-agent-frontend/
cd ~/projects/archi-agent-frontend

# Create docs directory
mkdir -p docs/
```

#### 2.3 Create Frontend Structure
```
archi-agent-frontend/
├── .github/
│   └── workflows/
│       └── frontend-ci.yml
├── docs/
│   ├── openapi.json          # Synced from backend
│   ├── API_CONTRACT.md       # Human-readable API docs
│   └── VERSION_MATRIX.md     # Backend-frontend compatibility
├── e2e/                      # Playwright tests
├── public/                   # Static assets
├── src/                      # React components
├── .gitignore
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.ts
```

#### 2.4 Update package.json
Add sync script:
```json
{
  "name": "archi-agent-frontend",
  "version": "0.1.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "playwright test",
    "sync-api": "curl -f https://raw.githubusercontent.com/minarovic/archi-agent/main/src/api/openapi.json -o docs/openapi.json && echo '✅ API schema synced'",
    "check-api": "node scripts/check-api-compatibility.js"
  }
}
```

#### 2.5 Create Frontend README
```bash
cp ~/archi-agent/scrum/split_repos/FRONTEND_README_TEMPLATE.md README.md
```

#### 2.6 Initial Commit
```bash
git add .
git commit -m "feat: Initial frontend repo after monorepo split"
git tag -a v0.1.0 -m "Frontend v0.1.0 - Repo split baseline"
```

#### 2.7 Create GitHub Repository
```bash
# On GitHub: Create repo "archi-agent-frontend"
git remote add origin git@github.com:minarovic/archi-agent-frontend.git
git push -u origin main
git push origin v0.1.0
```

---

### Phase 3: API Contract Strategy (1 hour)

**Goal:** Establish OpenAPI schema as single source of truth

#### 3.1 Backend: OpenAPI Generation
Already created in Phase 1.2. Ensure it runs on every backend change:
```bash
cd /Users/marekminarovic/archi-agent
python3 src/api/generate_openapi.py
```

#### 3.2 Frontend: API Sync Script
Create `scripts/check-api-compatibility.js`:
```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../docs/openapi.json');

if (!fs.existsSync(schemaPath)) {
  console.error('❌ OpenAPI schema not found. Run: npm run sync-api');
  process.exit(1);
}

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const backendVersion = schema.info.version;
const frontendVersion = require('../package.json').version;

console.log(`Backend API: v${backendVersion}`);
console.log(`Frontend:    v${frontendVersion}`);

// Version compatibility matrix
const compatible = {
  '0.1.0': ['0.1.0', '0.1.1'],
  '0.2.0': ['0.2.0', '0.2.1'],
};

if (compatible[backendVersion]?.includes(frontendVersion)) {
  console.log('✅ Versions compatible');
} else {
  console.warn('⚠️  Version mismatch - review docs/VERSION_MATRIX.md');
}
```

Make executable:
```bash
chmod +x scripts/check-api-compatibility.js
```

#### 3.3 API Contract Documentation
Create `docs/API_CONTRACT.md`:
```markdown
# API Contract

## Backend API Specification
**Source:** https://github.com/minarovic/archi-agent/blob/main/src/api/openapi.json
**Current Version:** v0.1.0
**Last Synced:** 2025-11-30

## Sync Process
1. Backend updates endpoint → runs `generate_openapi.py` → commits `openapi.json`
2. Frontend runs: `npm run sync-api` → downloads latest schema
3. Frontend verifies: `npm run check-api` → checks compatibility

## Endpoints

### POST /parse/business-request
**Purpose:** Parse business document (Tool 0)
**Input:** `{ "document": string }`
**Output:** `ParsedRequest` (project_metadata, goal, entities[], metrics[], etc.)

### POST /ingest/collibra
**Purpose:** Ingest Collibra metadata (Tool 1)
**Input:** `{ "parsed": ParsedRequest, "collibra_url": string }`
**Output:** `CollibraIngestion` (assets[], relationships[])

### POST /structure/classify
**Purpose:** Classify entities (Tool 2)
**Input:** `{ "collibra": CollibraIngestion }`
**Output:** `Taxonomy` (data_sources[], staging[], integration[], gold[])

### POST /quality/validate
**Purpose:** Validate metadata quality (Tool 3)
**Input:** `{ "taxonomy": Taxonomy }`
**Output:** `QualityReport` (score, issues[], recommendations[])

### POST /orchestrate
**Purpose:** Run full Tool 0→1→2→3 pipeline
**Input:** `{ "document": string, "collibra_url": string }`
**Output:** `OrchestrationResult` (parsed, ingested, classified, validated)

### WebSocket /ws/orchestrate
**Purpose:** Real-time orchestration progress
**Protocol:** WebSocket
**Messages:** `{"step": "tool0", "status": "running", "progress": 0.25}`

## Breaking Changes
See `docs/VERSION_MATRIX.md` for compatibility rules.

## Change Notifications
1. Backend opens PR with OpenAPI changes
2. Tag backend release (e.g., `v0.2.0`)
3. Frontend reviews schema diff
4. Frontend updates components if needed
5. Tag frontend release with compatible backend version
```

#### 3.4 Version Compatibility Matrix
Create `docs/VERSION_MATRIX.md`:
```markdown
# Backend-Frontend Version Compatibility

| Backend | Frontend | Status       | Notes                       |
| ------- | -------- | ------------ | --------------------------- |
| v0.1.0  | v0.1.0   | ✅ Compatible | Initial split baseline      |
| v0.1.0  | v0.1.1   | ✅ Compatible | Frontend bugfixes only      |
| v0.2.0  | v0.1.x   | ⚠️  Degraded  | New endpoints not available |
| v0.2.0  | v0.2.0   | ✅ Compatible | Tool 4 Security added       |

## Breaking Change Policy
- **Major version bump** (0.x.0 → 1.0.0): Breaking API changes
- **Minor version bump** (0.1.0 → 0.2.0): New endpoints, backward-compatible
- **Patch version bump** (0.1.0 → 0.1.1): Bugfixes, no API changes

## Compatibility Rules
1. Frontend must be on same or higher major version as backend
2. Frontend can lag behind minor versions (degraded functionality)
3. Patch versions are always compatible within same minor version

## Upgrade Path
When backend releases v0.2.0:
1. Frontend runs: `npm run sync-api`
2. Review: `git diff docs/openapi.json`
3. Update components using new endpoints
4. Bump frontend to v0.2.0
5. Tag: `git tag v0.2.0`
```

---

### Phase 4: CI/CD Setup (1 hour)

**Goal:** Automated testing and deployment for both repos

#### 4.1 Backend CI (.github/workflows/backend-ci.yml)
Already created in Phase 1.4. Verify it includes:
- ✅ Run pytest on `tests/`
- ✅ Generate OpenAPI schema
- ✅ Commit schema changes to main
- ✅ Deploy to Railway on main push

#### 4.2 Frontend CI (.github/workflows/frontend-ci.yml)
Create in `archi-agent-frontend/.github/workflows/frontend-ci.yml`:
```yaml
name: Frontend CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Sync API schema
        run: npm run sync-api

      - name: Check API compatibility
        run: npm run check-api

      - name: Build
        run: npm run build

      - name: Install Playwright
        run: npx playwright install --with-deps chromium

      - name: Run E2E tests
        run: npm test
        env:
          VITE_API_URL: http://localhost:8000

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

Commit:
```bash
cd ~/projects/archi-agent-frontend
git add .github/workflows/frontend-ci.yml
git commit -m "ci: Add frontend CI workflow"
git push
```

#### 4.3 Dependency Setup
Backend `requirements.txt` (already exists):
```txt
fastapi>=0.104.0
uvicorn[standard]>=0.24.0
pydantic>=2.5.0
pydantic-ai>=0.0.13
python-dotenv>=1.0.0
pytest>=7.4.0
httpx>=0.25.0
```

Frontend `package.json` (already exists):
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "zustand": "^4.4.7",
    "mermaid": "^10.6.1"
  },
  "devDependencies": {
    "@playwright/test": "^1.57.0",
    "vite": "^7.2.4",
    "typescript": "^5.3.3"
  }
}
```

---

## Execution Checklist

### Pre-Migration
- [ ] All tests passing in monorepo (265 tests ✅)
- [ ] Create `scrum/split_repos/` directory
- [ ] Backup current state: `git tag monorepo-backup`
- [ ] Notify team of upcoming split

### Phase 1: Backend (2h)
- [ ] Create `repo-split` branch
- [ ] Remove `frontend/` directory
- [ ] Create `src/api/generate_openapi.py`
- [ ] Run schema generation
- [ ] Update `README.md` to backend template
- [ ] Update `.github/workflows/backend-ci.yml`
- [ ] Commit and tag `v0.1.0`
- [ ] Push branch and tag
- [ ] Verify Railway deployment still works

### Phase 2: Frontend (2h)
- [ ] Create `archi-agent-frontend` local directory
- [ ] Copy frontend code from monorepo main
- [ ] Create `docs/` directory structure
- [ ] Update `package.json` with sync scripts
- [ ] Create `scripts/check-api-compatibility.js`
- [ ] Update `README.md` to frontend template
- [ ] Initial commit and tag `v0.1.0`
- [ ] Create GitHub repository
- [ ] Push code and tag
- [ ] Verify Vercel deployment

### Phase 3: API Contract (1h)
- [ ] Backend: Verify `openapi.json` generation
- [ ] Frontend: Test `npm run sync-api`
- [ ] Create `docs/API_CONTRACT.md`
- [ ] Create `docs/VERSION_MATRIX.md`
- [ ] Test compatibility checker: `npm run check-api`
- [ ] Document cross-repo workflow

### Phase 4: CI/CD (1h)
- [ ] Backend: Verify CI runs on push
- [ ] Backend: Verify schema auto-commits
- [ ] Frontend: Verify CI runs on push
- [ ] Frontend: Verify E2E tests pass
- [ ] Test full workflow: Backend change → Frontend sync
- [ ] Update team documentation

### Post-Migration
- [ ] Merge `repo-split` branch to main (backend)
- [ ] Archive monorepo with clear redirect README
- [ ] Update deployment URLs in documentation
- [ ] Notify team of new repo structure
- [ ] Schedule first cross-repo sync test

---

## README Templates

### Backend README Template

```markdown
# Metadata Copilot - Backend

Metadata orchestration pipeline connecting business requirements with technical metadata from Collibra, Databricks Unity Catalog, and SAP.

## 🚀 Quick Start

### Prerequisites
- Python 3.13+
- Poetry or pip
- Collibra API access

### Installation
```bash
# Clone repository
git clone git@github.com:minarovic/archi-agent.git
cd archi-agent

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Environment Setup
Create `.env`:
```bash
AZURE_OPENAI_ENDPOINT=https://your-endpoint.cognitiveservices.azure.com/openai/v1/
AZURE_OPENAI_API_KEY=your-key
AZURE_OPENAI_DEPLOYMENT_NAME=test-gpt-5-mini
COLLIBRA_API_URL=https://your-instance.collibra.com
COLLIBRA_API_KEY=your-collibra-key
```

### Run Backend
```bash
uvicorn src.api.main:app --reload --port 8000
```

API available at: http://localhost:8000
OpenAPI docs: http://localhost:8000/docs

## 📦 Architecture

### Tools (Pipeline Stages)
- **Tool 0:** Business Request Parser (structured JSON extraction)
- **Tool 1:** Collibra Ingestion (metadata fetching + validation)
- **Tool 2:** Taxonomy Classifier (data source → staging → integration → gold)
- **Tool 3:** Quality Validator (completeness, uniqueness, validity checks)
- **Tool 5:** ER Diagram Generator (Mermaid.js visualization)

### Orchestrator
Coordinates Tool 0→1→2→3 pipeline with:
- Error recovery
- WebSocket progress streaming
- Session management (in-memory MVP, Redis planned)

## 🧪 Testing

```bash
# Run all tests
pytest tests/ -v

# Run specific tool tests
pytest tests/test_tool0.py -v
pytest tests/test_tool1.py -v

# Run with coverage
pytest tests/ --cov=src --cov-report=html
```

**Test Status:** 265 passing (71 Tool tests, 16 Orchestrator, 118 Explorer, 36 API, 24 E2E)

## 📡 API Contract

**OpenAPI Schema:** `src/api/openapi.json` (auto-generated)
**Frontend Repository:** https://github.com/minarovic/archi-agent-frontend
**Version:** v0.1.0

### Generating Schema
```bash
python3 src/api/generate_openapi.py
```

Schema is automatically committed by CI on main branch pushes.

### Endpoints
- `POST /parse/business-request` - Tool 0 parsing
- `POST /ingest/collibra` - Tool 1 ingestion
- `POST /structure/classify` - Tool 2 classification
- `POST /quality/validate` - Tool 3 validation
- `POST /diagram/generate` - Tool 5 ER diagram
- `POST /orchestrate` - Full pipeline
- `WS /ws/orchestrate` - Real-time progress

## 🚢 Deployment

**Platform:** Railway
**Region:** us-west1
**Auto-Deploy:** On main branch push

```bash
# Manual deploy
railway up
```

## 🔧 Development

### Project Structure
```
archi-agent/
├── src/
│   ├── tool0/           # Business parser
│   ├── tool1/           # Collibra ingestion
│   ├── tool2/           # Taxonomy classifier
│   ├── tool3/           # Quality validator
│   ├── tool5/           # ER diagram
│   ├── orchestrator/    # Pipeline coordinator
│   └── api/
│       ├── main.py      # FastAPI app
│       └── openapi.json # API schema
├── tests/
├── docs/
├── requirements.txt
└── README.md
```

### Code Style
```bash
# Format
black src/ tests/

# Lint
ruff check src/ tests/

# Type check
mypy src/
```

## 📚 Documentation

- **Architecture:** `docs/architecture/`
- **API Reference:** http://localhost:8000/docs
- **Frontend Repo:** https://github.com/minarovic/archi-agent-frontend
- **Scrum Board:** `scrum/sprint_2/README.md`

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/tool6-sap-analyzer`
2. Write tests: `pytest tests/test_tool6.py`
3. Generate schema: `python3 src/api/generate_openapi.py`
4. Push and open PR
5. CI must pass (tests + schema generation)

## 📝 License

MIT License - See LICENSE file

## 🔗 Related Repositories

- **Frontend:** https://github.com/minarovic/archi-agent-frontend
- **Infrastructure:** https://github.com/minarovic/archi-agent-infra (planned)
```

### Frontend README Template

```markdown
# Metadata Copilot - Frontend

React 19 + Vite frontend for the Metadata Copilot orchestration pipeline.

## 🚀 Quick Start

### Prerequisites
- Node.js 22+
- npm 10+
- Backend API running (see [archi-agent](https://github.com/minarovic/archi-agent))

### Installation
```bash
# Clone repository
git clone git@github.com:minarovic/archi-agent-frontend.git
cd archi-agent-frontend

# Install dependencies
npm install

# Sync API schema from backend
npm run sync-api
```

### Environment Setup
Create `.env`:
```bash
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

### Run Development Server
```bash
npm run dev
```

Open http://localhost:5173

## 🏗️ Architecture

### Tech Stack
- **React 19** - UI framework
- **Vite 7.2.4** - Build tool
- **TailwindCSS 4.1.17** - Styling
- **Zustand** - State management
- **Mermaid.js** - Diagram rendering
- **Playwright 1.57.0** - E2E testing

### Features
- 📝 Business request editor with live parsing
- 🔄 Real-time orchestration progress (WebSocket)
- 📊 Interactive ER diagram viewer (Mermaid)
- 🎯 Quality report dashboard
- 📜 Session history with state restoration

## 📡 API Integration

**Backend Repository:** https://github.com/minarovic/archi-agent
**API Schema:** `docs/openapi.json`
**Current Version:** v0.1.0

### Syncing API Schema
```bash
# Download latest schema from backend
npm run sync-api

# Verify compatibility
npm run check-api
```

### Version Compatibility
See `docs/VERSION_MATRIX.md` for backend-frontend compatibility matrix.

## 🧪 Testing

### E2E Tests (Playwright)
```bash
# Run all tests
npm test

# Run specific browser
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug

# UI mode
npx playwright test --ui
```

**Test Status:** 24 passing (4 workflows × 3 browsers × 2 screen sizes)

### Test Scenarios
- ✅ Business request parsing
- ✅ Full orchestration workflow
- ✅ Diagram interaction
- ✅ Session restoration

## 🎨 Components

### Pages
- **HomePage** - Business request editor + orchestration trigger
- **DiagramPage** - ER diagram viewer with pan/zoom
- **HistoryPage** - Session list with restore capability

### State Management (Zustand)
```typescript
interface MCOPState {
  sessions: Session[];
  currentSession: Session | null;
  orchestrationProgress: OrchestrationProgress;
  addSession: (session: Session) => void;
  updateProgress: (progress: OrchestrationProgress) => void;
}
```

### WebSocket Integration
```typescript
const ws = new WebSocket(`${WS_URL}/ws/orchestrate`);
ws.onmessage = (event) => {
  const progress = JSON.parse(event.data);
  updateProgress(progress); // Update Zustand store
};
```

## 🚢 Deployment

**Platform:** Vercel
**Region:** us-west1
**Auto-Deploy:** On main branch push

```bash
# Manual deploy
vercel --prod
```

## 🔧 Development

### Project Structure
```
archi-agent-frontend/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── store/          # Zustand state
│   ├── api/            # Backend API client
│   └── types/          # TypeScript types
├── e2e/                # Playwright tests
├── docs/
│   ├── openapi.json    # Backend API schema
│   ├── API_CONTRACT.md # Human-readable docs
│   └── VERSION_MATRIX.md
├── public/
├── package.json
└── README.md
```

### Code Style
```bash
# Format
npm run format

# Lint
npm run lint

# Type check
npm run type-check
```

## 📚 Documentation

- **API Contract:** `docs/API_CONTRACT.md`
- **Version Matrix:** `docs/VERSION_MATRIX.md`
- **Backend Repo:** https://github.com/minarovic/archi-agent
- **Storybook:** (planned)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/diagram-export`
2. Sync API schema: `npm run sync-api`
3. Write E2E test: `e2e/diagram-export.spec.ts`
4. Push and open PR
5. CI must pass (build + E2E tests)

## 🔄 Cross-Repo Workflow

When backend API changes:
1. Backend releases new version (e.g., `v0.2.0`)
2. Run: `npm run sync-api`
3. Review: `git diff docs/openapi.json`
4. Update components if needed
5. Run: `npm test` (verify E2E tests pass)
6. Tag frontend: `git tag v0.2.0`

## 📝 License

MIT License - See LICENSE file

## 🔗 Related Repositories

- **Backend:** https://github.com/minarovic/archi-agent
- **Infrastructure:** https://github.com/minarovic/archi-agent-infra (planned)
```

---

## Post-Split Workflow

### Backend Developer Workflow
1. Make API change in `src/api/main.py`
2. Update endpoint documentation
3. Run: `python3 src/api/generate_openapi.py`
4. Commit both code and `src/api/openapi.json`
5. Open PR with API changes highlighted
6. Tag release: `git tag v0.2.0`
7. Notify frontend team

### Frontend Developer Workflow
1. Backend notifies of new release
2. Run: `npm run sync-api`
3. Review: `git diff docs/openapi.json`
4. Update components using new endpoints
5. Run: `npm test` (verify E2E tests pass)
6. Commit changes
7. Tag compatible version: `git tag v0.2.0`
8. Deploy to Vercel

### Breaking Change Protocol
1. Backend opens "Breaking API Change" issue
2. Bump major version (e.g., `v1.0.0`)
3. Document migration path in `CHANGELOG.md`
4. Frontend creates migration PR
5. Coordinate deployment timing
6. Update `VERSION_MATRIX.md`

---

## Rollback Plan

If split causes issues:

### Option A: Revert to Monorepo
```bash
# Backend
cd /Users/marekminarovic/archi-agent
git checkout monorepo-backup
git push -f origin main

# Frontend (archive)
cd ~/projects/archi-agent-frontend
git tag archived-split
git push origin archived-split
```

### Option B: Keep Split, Fix Issues
```bash
# Identify problem (schema sync? deployment? tests?)
# Fix in respective repo
# Re-run CI
# Verify cross-repo workflow
```

---

## Success Metrics

**Completed Migration When:**
- ✅ Backend repo: Tests pass, Railway deploys, schema auto-generates
- ✅ Frontend repo: Tests pass, Vercel deploys, API sync works
- ✅ CI/CD: Both repos have working GitHub Actions
- ✅ Documentation: Both READMEs updated, API contract documented
- ✅ Versioning: Both repos tagged `v0.1.0`
- ✅ Team: All developers can clone and run both repos independently

**Operational Success (Week 1):**
- ✅ Backend pushes trigger schema updates
- ✅ Frontend syncs schema without manual intervention
- ✅ No cross-repo merge conflicts
- ✅ Deployment pipelines work independently

---

## Estimated Timeline

| Phase                    | Duration      | Dependencies     |
| ------------------------ | ------------- | ---------------- |
| Phase 1: Backend Cleanup | 2 hours       | None             |
| Phase 2: Frontend Repo   | 2 hours       | Phase 1 tag      |
| Phase 3: API Contract    | 1 hour        | Phase 2 complete |
| Phase 4: CI/CD Setup     | 1 hour        | Phase 3 docs     |
| **Total**                | **5-6 hours** | Sequential       |

**Parallel Work Possible:**
- Phase 3 & 4 can overlap if two developers available

---

## Risk Mitigation

| Risk                    | Impact | Mitigation                             |
| ----------------------- | ------ | -------------------------------------- |
| Schema sync breaks      | High   | Version matrix + compatibility checker |
| CI/CD misconfiguration  | Medium | Test in separate branch first          |
| Deployment coordination | Medium | Staggered deploys (backend first)      |
| Team confusion          | Low    | Clear READMEs + Slack notification     |
| Merge conflicts         | Low    | Freeze PRs during split window         |

---

## Approval Required

- [ ] **User Approval:** Confirm migration plan structure
- [ ] **Timeline Approval:** 5-6 hours acceptable?
- [ ] **CI/CD Review:** Backend auto-commit acceptable?
- [ ] **Deployment Review:** Railway + Vercel configuration correct?

---

## Next Steps

After approval:
1. Execute Phase 1 (Backend cleanup)
2. Verify backend tests pass
3. Execute Phase 2 (Frontend repo)
4. Verify frontend tests pass
5. Execute Phase 3 (API contract)
6. Execute Phase 4 (CI/CD)
7. Mark MCOP-S2-005 as "done"
8. Update `/memories/mcop-implementation-status.md`

---

**Document Status:** Ready for review
**Last Updated:** 2025-11-30
**Owner:** @minarovic
**Reviewers:** Backend team, Frontend team, DevOps
