# Sprint 2: Frontend Stories

**Sprint Duration:** 2025-12-02 → 2025-12-20
**Goal:** Implementovať design a UX vylepšenia z N-tier projektu
**Last Updated:** 2025-12-08

---

## 🎯 Navrhované poradie implementácie

### Fáza 1: Základ UX (Day 1) - 45 min
| Poradie | Story  | Popis                         | Effort |
| ------- | ------ | ----------------------------- | ------ |
| **1**   | FE-001 | InitialView s Example Prompts | 30 min |
| **2**   | FE-004 | Loading Dots Animation        | 15 min |

### Fáza 2: Canvas vylepšenia (Day 1-2) - 35 min
| Poradie | Story  | Popis                  | Effort |
| ------- | ------ | ---------------------- | ------ |
| **3**   | FE-003 | View Mode Toggle       | 15 min |
| **4**   | FE-002 | Canvas Trigger Handler | 20 min |

### Fáza 3: Dashboard polish (Day 2) - 30 min
| Poradie | Story  | Popis                         | Effort |
| ------- | ------ | ----------------------------- | ------ |
| **5**   | FE-005 | Metrics Header Card           | 20 min |
| **6**   | FE-006 | Follow-up Badge (client-side) | 10 min |

**Celkový effort:** ~2 hodiny

---

## 📋 Prehľad Stories

| ID          | Story                         | Priorita | Effort | Status  |
| ----------- | ----------------------------- | -------- | ------ | ------- |
| MCOP-FE-001 | InitialView s Example Prompts | 🔴 P1     | 30 min | planned |
| MCOP-FE-002 | Canvas Trigger Handler        | 🔴 P1     | 20 min | planned |
| MCOP-FE-003 | View Mode Toggle              | 🟡 P2     | 15 min | planned |
| MCOP-FE-004 | Loading Dots Animation        | 🟡 P2     | 15 min | planned |
| MCOP-FE-005 | Metrics Header Card           | 🟢 P3     | 20 min | planned |
| MCOP-FE-006 | Follow-up Badge               | 🟢 P3     | 10 min | planned |

**Celkový effort:** ~2 hodiny

---

## ⚠️ Backend Dependencies & Compatibility

### Compatibility Contract

**CRITICAL:** Frontend MUSÍ fungovať aj bez backend rozšírení. Pravidlá:

| Field            | Missing Behavior | Frontend Action                                |
| ---------------- | ---------------- | ---------------------------------------------- |
| `canvas_trigger` | undefined/null   | Treat as `{action: 'none'}`, keep current view |
| `metrics`        | undefined/null   | Show skeleton or "Metrics unavailable"         |
| `is_follow_up`   | undefined        | Use client-side heuristic detection            |
| `confidence`     | undefined        | Default to 1.0 (trust backend)                 |

### Story Dependencies

| Story       | Backend Requirement               | Status     | Fallback               |
| ----------- | --------------------------------- | ---------- | ---------------------- |
| MCOP-FE-001 | None                              | ✅ Ready    | N/A                    |
| MCOP-FE-002 | `canvas_trigger` in WS            | 🟡 Optional | Ignore missing field   |
| MCOP-FE-003 | None                              | ✅ Ready    | N/A                    |
| MCOP-FE-004 | None                              | ✅ Ready    | N/A                    |
| MCOP-FE-005 | `/api/stats` or `pipeline_result` | 🟡 Optional | Skeleton UI            |
| MCOP-FE-006 | `is_follow_up` flag               | 🔴 Blocked  | Client-side regex only |

### API Versioning

```typescript
// Check for backend feature support
const BACKEND_FEATURES = {
  canvas_trigger: false,  // Set true when backend deployed
  metrics_in_ws: false,
  follow_up_flag: false,
};
```

---

## 🎨 Farebná Schéma

### Decision: Škoda Green (FINAL)

Používame **Škoda Green** tému podľa N-tier design reference (`scrum/ideas/design_ntier.md`):

```css
/* Primary Colors - Škoda Green */
--primary-dark: #0E3A2F;      /* Header, CTA buttons */
--primary-accent: #4BA82E;    /* Accent, success states */
--primary-light: #78FAAE;     /* Hover, secondary info */
--primary-muted: #1a5a42;     /* Cards on dark background */

/* Gray Scale */
--bg-light: #f9fafb;          /* gray-50 - Canvas background */
--bg-white: #ffffff;          /* Cards, chat panel */
--border: #e5e7eb;            /* gray-200 - Borders */
--text-primary: #111827;      /* gray-900 - Main text */
--text-secondary: #6b7280;    /* gray-500 - Secondary text */
--text-muted: #9ca3af;        /* gray-400 - Muted text */
```

**Tailwind Config:**
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#0E3A2F',
          DEFAULT: '#4BA82E',
          light: '#78FAAE',
          muted: '#1a5a42',
        }
      }
    }
  }
}
```

---

## 🏗️ Architektúra Komponentov

```
src/
├── components/
│   ├── InitialView.tsx       # 🆕 MCOP-FE-001
│   ├── ChatPanel.tsx         # ✏️ Upraviť (Loading Dots)
│   ├── Canvas.tsx            # ✏️ Upraviť (View Mode Toggle)
│   ├── Layout.tsx            # ✏️ Upraviť (Responsive)
│   ├── MessageList.tsx       # ✏️ Upraviť (Follow-up Badge)
│   ├── MetricsHeader.tsx     # 🆕 MCOP-FE-005
│   └── LoadingDots.tsx       # 🆕 MCOP-FE-004
├── hooks/
│   └── useCanvasTrigger.ts   # 🆕 MCOP-FE-002
├── types/
│   └── index.ts              # ✏️ Rozšíriť (CanvasTrigger)
└── styles/
    └── index.css             # ✏️ Upraviť (Color scheme)
```

---

## 📁 Story Files

Každá story má vlastný markdown súbor s:
- User Story a Acceptance Criteria
- Technický Background (API contract)
- Implementačný návod
- Príklady kódu
- Playwright test scenáre

| Story       | File                                                                 |
| ----------- | -------------------------------------------------------------------- |
| MCOP-FE-001 | [MCOP-FE-001-initial-view.md](./MCOP-FE-001-initial-view.md)         |
| MCOP-FE-002 | [MCOP-FE-002-canvas-trigger.md](./MCOP-FE-002-canvas-trigger.md)     |
| MCOP-FE-003 | [MCOP-FE-003-view-mode-toggle.md](./MCOP-FE-003-view-mode-toggle.md) |
| MCOP-FE-004 | [MCOP-FE-004-loading-dots.md](./MCOP-FE-004-loading-dots.md)         |
| MCOP-FE-005 | [MCOP-FE-005-metrics-header.md](./MCOP-FE-005-metrics-header.md)     |
| MCOP-FE-006 | [MCOP-FE-006-followup-badge.md](./MCOP-FE-006-followup-badge.md)     |

---

## 🔌 API Technický Background

### WebSocket Response Schema (rozšírený)

```typescript
// Backend teraz vracia canvas_trigger (Sprint 2)
interface WebSocketMessage {
  type: 'user' | 'agent' | 'agent_partial' | 'tool' | 'error';
  content: string;
  timestamp?: string;

  // 🆕 Canvas Trigger (MCOP-FE-002)
  canvas_trigger?: CanvasTrigger;

  // 🆕 Metrics (MCOP-FE-005)
  metrics?: PipelineMetrics;

  // 🆕 Follow-up indicator (MCOP-FE-006)
  is_follow_up?: boolean;
}

interface CanvasTrigger {
  action: 'switch_view' | 'new_analysis' | 'none';
  view_type?: 'er_diagram' | 'table_list' | 'relationship_graph';
  entity_name?: string;
  query?: string;
  reason: string;

  // 🆕 Extended fields (v2)
  confidence?: number;        // 0.0-1.0, default 1.0. FE auto-switches only if >= 0.6
  trace_id?: string;          // For debugging/logging
  latency_ms?: number;        // Backend processing time
}

interface PipelineMetrics {
  total_tables: number;
  total_columns: number;
  facts_count: number;
  dimensions_count: number;
  quality_score?: number;     // 0-100, nullable
  relationships_count?: number;
  schema_name?: string;

  // 🆕 Freshness fields
  as_of?: string;             // ISO timestamp of data snapshot
  is_stale?: boolean;         // true if data older than 1 hour
}
```

### Nullability & Default Rules

| Field                       | Type     | Default     | Notes                          |
| --------------------------- | -------- | ----------- | ------------------------------ |
| `canvas_trigger`            | optional | `undefined` | FE treats as `{action:'none'}` |
| `canvas_trigger.confidence` | optional | `1.0`       | FE uses 0.6 threshold          |
| `metrics.quality_score`     | optional | `null`      | Show "—" in UI                 |
| `metrics.as_of`             | optional | `null`      | Hide freshness indicator       |
| `is_follow_up`              | optional | `false`     | Use client regex fallback      |
```

### REST Endpoints (existujúce)

| Endpoint                    | Method    | Účel                         |
| --------------------------- | --------- | ---------------------------- |
| `/health`                   | GET       | Health check                 |
| `/api/stats`                | GET       | Štatistiky (tables, columns) |
| `/api/pipeline/run`         | POST      | Spustiť pipeline             |
| `/api/pipeline/{id}/status` | GET       | Stav pipeline                |
| `/api/pipeline/{id}/result` | GET       | Výsledok pipeline            |
| `/api/diagram/{id}`         | GET       | Mermaid diagram              |
| `/api/tables`               | GET       | Zoznam tabuliek              |
| `/ws/{session_id}`          | WebSocket | Real-time chat               |

---

## 🧪 Playwright Test Plan

### Test Suites

| Suite                    | Tests | Story Coverage |
| ------------------------ | ----- | -------------- |
| `initial-view.spec.ts`   | 6     | MCOP-FE-001    |
| `canvas-trigger.spec.ts` | 4     | MCOP-FE-002    |
| `view-toggle.spec.ts`    | 3     | MCOP-FE-003    |
| `loading-states.spec.ts` | 4     | MCOP-FE-004    |
| `metrics-header.spec.ts` | 3     | MCOP-FE-005    |
| `message-badges.spec.ts` | 2     | MCOP-FE-006    |

**Celkovo:** 22 nových E2E testov

---

## 📋 Implementačný Plán

### Deň 1: P1 Stories (50 min)
```
09:00-09:30  MCOP-FE-001: InitialView
09:30-09:50  MCOP-FE-002: Canvas Trigger Handler
09:50-10:00  Integrácia do App.tsx
```

### Deň 2: P2 Stories (30 min)
```
09:00-09:15  MCOP-FE-003: View Mode Toggle
09:15-09:30  MCOP-FE-004: Loading Dots
```

### Deň 3: P3 Stories + Testy (40 min)
```
09:00-09:20  MCOP-FE-005: Metrics Header
09:20-09:30  MCOP-FE-006: Follow-up Badge
09:30-10:00  Playwright testy
```

---

## ✅ Definition of Done

Pre každú story:
- [ ] Komponent implementovaný
- [ ] TypeScript typy kompletné
- [ ] Responsive (mobile + desktop)
- [ ] Playwright test prechádza
- [ ] Code review hotové
- [ ] Merged do main branch

---

## 🔗 Referencie

- [N-tier Design Migrácia](../../ideas/design_ntier.md)
- [Implementačný Plán](../../ideas/design_ntier_implementation.md)
- [Backend API Models](../../../src/api/models.py)
- [WebSocket Handler](../../../src/api/main.py)
