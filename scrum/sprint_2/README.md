# Sprint 2: Post-MVP Enhancements

**Sprint Duration:** 2025-01-06 → 2025-01-24 (3 týždne)
**Goal:** Dokončiť Tool 5, pridať production features a deployment improvements

---

## 📋 Stories v Sprinte

| #   | Story ID    | Názov                                      | Effort  | Priorita | Závislosť | Status  |
| --- | ----------- | ------------------------------------------ | ------- | -------- | --------- | ------- |
| 1   | MCOP-S2-001 | Tool 5 - ER Diagram Generator (Mermaid)    | 4-6 h   | 🟡 SHOULD | S1-001    | planned |
| 2   | MCOP-S2-002 | Production Hardening (Auth, Redis, Sentry) | 2-3 dni | 🔴 MUST   | S1-005    | planned |
| 3   | MCOP-S2-003 | Real Collibra API Integration              | 3-5 dni | 🟡 SHOULD | S1-004    | planned |
| 4   | MCOP-S2-004 | Tool 4 - Security Analyzer (PII/GDPR)      | 2-3 dni | 🔵 COULD  | S1-003    | planned |

---

## 🎯 Sprint Goals

### Primary Goal
Dokončiť Tool 5 z Sprint 1 (carry-over story) a pripraviť aplikáciu na production.

### Secondary Goals
- Production monitoring a error tracking
- Real Collibra API integration (ak je dostupný test environment)
- Security analysis features (Tool 4)

---

## 🚀 Implementačné poradie

```
Week 1 (6.-10. Jan):
├── [S2-001] Tool 5 - ER Diagram Generator ────────────────┐
│   ├── Day 1 (4h): Create src/tool5/ module               │
│   │   ├── diagram_generator.py (~200 lines)              │
│   │   ├── __main__.py (CLI)                              │
│   │   └── __init__.py                                    │
│   ├── Day 1 (2h): Write tests                            │
│   │   └── tests/test_tool5.py (8+ tests)                 │
│   └── Day 2 (1h): Migrate API & documentation            │
│       ├── Update src/api/main.py                         │
│       └── README.md                                      │
└───────────────────────────────────────────────────────────┘

Week 2 (13.-17. Jan):
├── [S2-002] Production Hardening ─────────────────────────┐
│   ├── Day 1: Authentication (JWT tokens)                 │
│   ├── Day 2: Redis session storage                       │
│   ├── Day 3: Sentry error tracking                       │
│   └── Day 4: Rate limiting & monitoring                  │
└───────────────────────────────────────────────────────────┘

Week 3 (20.-24. Jan):
├── [S2-003] Real Collibra API ────────────────────────────┤
│   ├── Day 1-2: CollibraAPIClient implementation          │
│   ├── Day 3: Replace mock with real client               │
│   └── Day 4: Integration tests                           │
├── [S2-004] Tool 4 - Security Analyzer ───────────────────┤
│   ├── Day 1: PII column detection                        │
│   ├── Day 2: GDPR compliance checks                      │
│   └── Day 3: Security report generation                  │
└───────────────────────────────────────────────────────────┘
```

---

## 📊 Story Details

### MCOP-S2-001: Tool 5 - ER Diagram Generator ⭐

**Carry-over from Sprint 1**

**What:** Vytvor standalone modul pre generovanie Mermaid ER diagramov

**Why:**
- Aktuálne máme inline implementáciu v `src/api/main.py`
- Potrebujeme testovaný, reusable modul
- CLI interface pre standalone použitie

**Acceptance Criteria:**
- [ ] Module `src/tool5/` s testami
- [ ] CLI: `python -m src.tool5 --input data/tool2/structure.json`
- [ ] 8+ unit testov prechádza
- [ ] Backend migrovaný z inline funkcie
- [ ] README.md dokumentácia

**Effort:** 5-6 hours

**Files to create:**
```
src/tool5/
├── __init__.py
├── diagram_generator.py
├── __main__.py
└── README.md

tests/test_tool5.py
scrum/architecture/tool5-er-diagram.md
```

---

### MCOP-S2-002: Production Hardening

**What:** Pridať production-ready features do backend API

**Why:** Aktuálne MVP používa in-memory sessions, žiadnu autentifikáciu, žiadny monitoring

**Features:**
1. **Authentication**
   - JWT token-based auth
   - User roles (viewer, editor, admin)
   - Protected endpoints

2. **Redis Session Storage**
   - Replace in-memory dict
   - Persistent sessions across restarts
   - Distributed session support

3. **Sentry Error Tracking**
   - Automatic exception capture
   - Performance monitoring
   - User context tracking

4. **Rate Limiting**
   - Per-user limits
   - API endpoint protection
   - DDoS prevention

**Effort:** 2-3 days

---

### MCOP-S2-003: Real Collibra API Integration

**What:** Replace mock Collibra client with real API calls

**Why:** MVP používa JSON dump - production potrebuje live data

**Prerequisites:**
- [ ] Collibra test environment access
- [ ] API credentials
- [ ] Network connectivity from deployment

**Implementation:**
```python
# src/integrations/collibra_client.py
class CollibraAPIClient:
    def __init__(self, base_url: str, api_key: str):
        self.client = httpx.AsyncClient(base_url=base_url)
        self.api_key = api_key

    async def list_tables(self, scope: str) -> list[dict]:
        response = await self.client.get(
            "/rest/2.0/assets",
            params={"domainId": scope, "assetType": "Table"}
        )
        return response.json()
```

**Effort:** 3-5 days

---

### MCOP-S2-004: Tool 4 - Security Analyzer

**What:** Analyzuj columns pre PII data a GDPR compliance

**Why:** Data governance requirement - identifikovať sensitive data

**Features:**
1. **PII Detection**
   - Email, phone, SSN patterns
   - Name columns
   - Address fields

2. **GDPR Checks**
   - Data retention policies
   - Consent tracking
   - Right to deletion support

3. **Security Report**
   - High/medium/low risk columns
   - Compliance recommendations
   - Remediation steps

**Effort:** 2-3 days

---

## 🧪 Testing

### MCOP-S2-001: Tool 5
```bash
# Unit tests
pytest tests/test_tool5.py -v

# CLI test
python -m src.tool5 --input data/tool2/structure.json
cat data/tool5/diagram.md | pbcopy

# Integration test
python -m src.orchestrator.pipeline data/sample_business_request.md
# Verify: data/tool5/diagram.md created
```

### MCOP-S2-002: Production Hardening
```bash
# Auth test
curl -X POST http://localhost:8000/api/auth/login \
  -d '{"username": "test", "password": "test123"}'

# Redis test
redis-cli KEYS "mcop:session:*"

# Sentry test (trigger error)
curl http://localhost:8000/api/trigger-error
# Check Sentry dashboard for event
```

### MCOP-S2-003: Real Collibra API
```bash
# Health check
python -c "from src.integrations.collibra_client import CollibraAPIClient; \
  client = CollibraAPIClient('https://collibra-test.com', 'key'); \
  print(await client.health_check())"

# Integration test
pytest tests/test_collibra_integration.py -v
```

---

## 🏗️ Architecture Updates

### New Components

```
src/
├── tool5/                    # ⭐ NEW - ER Diagram module
│   ├── __init__.py
│   ├── diagram_generator.py
│   └── __main__.py
├── integrations/
│   ├── collibra_mock.py      # ✅ Existing (Sprint 1)
│   └── collibra_client.py    # ⭐ NEW - Real API client
├── auth/                     # ⭐ NEW - Authentication
│   ├── __init__.py
│   ├── jwt_handler.py
│   └── permissions.py
└── monitoring/               # ⭐ NEW - Sentry integration
    ├── __init__.py
    └── sentry_config.py
```

### Technology Stack Additions

| Technology | Purpose           | Sprint 1         | Sprint 2         |
| ---------- | ----------------- | ---------------- | ---------------- |
| **Redis**  | Session storage   | ❌ In-memory dict | ✅ Redis          |
| **Sentry** | Error tracking    | ❌ No monitoring  | ✅ Sentry         |
| **JWT**    | Authentication    | ❌ No auth        | ✅ JWT tokens     |
| **httpx**  | Async HTTP client | ❌ Mock only      | ✅ Real API calls |

---

## 📦 Deployment

### Environment Variables (Updated)

```bash
# Existing (Sprint 1)
AZURE_OPENAI_ENDPOINT=...
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_DEPLOYMENT_NAME=...

# New (Sprint 2)
REDIS_URL=redis://localhost:6379
SENTRY_DSN=https://...@sentry.io/...
JWT_SECRET=random-secret-key
COLLIBRA_API_URL=https://collibra-prod.com
COLLIBRA_API_KEY=...
```

### Railway Configuration

```toml
# railway.toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 300

[[services]]
name = "redis"
image = "redis:7-alpine"
```

---

## 📊 Definition of Done

### Sprint-Level
- [ ] All planned stories completed or moved to Sprint 3
- [ ] Production deployment successful
- [ ] No P0/P1 bugs
- [ ] Documentation updated
- [ ] Demo delivered

### Story-Level
- [ ] All AC met
- [ ] Tests passing (>80% coverage)
- [ ] Code reviewed
- [ ] Deployed to staging
- [ ] User acceptance testing passed

---

## 🔗 Documentation

| Document                                                           | Purpose              |
| ------------------------------------------------------------------ | -------------------- |
| [tool5-er-diagram.md](../architecture/tool5-er-diagram.md)         | Tool 5 architecture  |
| [production-hardening.md](../architecture/production-hardening.md) | Auth, Redis, Sentry  |
| [collibra-integration.md](../architecture/collibra-integration.md) | Real API integration |

---

## 📝 Risks & Mitigation

| Risk                            | Impact | Mitigation                   |
| ------------------------------- | ------ | ---------------------------- |
| Collibra test env not available | HIGH   | Keep mock client as fallback |
| Redis configuration issues      | MEDIUM | Use Railway add-on           |
| Sentry costs                    | LOW    | Start with free tier         |
| Tool 5 takes longer than 6h     | LOW    | Has working inline version   |

---

## 🎯 Success Metrics

- [ ] Tool 5 module completed and tested
- [ ] Backend has authentication and monitoring
- [ ] Real Collibra API working (or documented blocker)
- [ ] Zero unhandled exceptions in production
- [ ] Response time < 2s for 95% of requests

---

**Sprint Planning Date:** 2025-01-03
**Sprint Review Date:** 2025-01-27
**Sprint Retrospective:** 2025-01-27
