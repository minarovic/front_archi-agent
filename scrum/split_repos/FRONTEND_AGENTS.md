# Metadata Copilot Frontend - AI Agent Guidelines

This document provides guidance for AI agents (Claude, GitHub Copilot, etc.) working on the **MCOP Frontend** project.

## Repository Context
**This is the FRONTEND repository** after monorepo split (2025-11-30).
**Backend repository:** https://github.com/minarovic/archi-agent

## Project Mission
Build a React 19 + Vite frontend for visualizing metadata orchestration pipeline results, including ER diagrams, quality reports, and real-time progress tracking.

## Tech Stack

- **React 19** - UI framework with concurrent features
- **TypeScript 5.3** - Type safety
- **Vite 7.2.4** - Build tool with HMR
- **TailwindCSS 4.1.17** - Utility-first styling
- **Zustand** - Lightweight state management
- **Mermaid.js 10.6.1** - ER diagram rendering
- **Playwright 1.57.0** - E2E testing

## Core Principles

### 1. Backend API as Single Source of Truth
- Backend generates `src/api/openapi.json`
- Frontend syncs via `npm run sync-api`
- **ALWAYS sync schema after backend releases**

### 2. Component-First Architecture
- Pages = top-level routes (HomePage, DiagramPage, HistoryPage)
- Components = reusable UI elements (Button, Card, ProgressBar)
- Store = Zustand for global state
- API = Backend client functions

### 3. Type Safety First
- Define TypeScript interfaces for all data
- No `any` types (use `unknown` if needed)
- Validate API responses against types

## Project Structure
```
archi-agent-frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ProgressBar.tsx
│   │   └── Diagram.tsx
│   ├── pages/               # Route components
│   │   ├── HomePage.tsx     # Business request editor
│   │   ├── DiagramPage.tsx  # ER diagram viewer
│   │   └── HistoryPage.tsx  # Session history
│   ├── store/               # Zustand state management
│   │   └── useStore.ts
│   ├── api/                 # Backend client
│   │   ├── client.ts        # HTTP functions
│   │   └── websocket.ts     # WebSocket client
│   ├── types/               # TypeScript types
│   │   ├── api.ts           # API request/response types
│   │   └── state.ts         # Store types
│   └── utils/               # Helper functions
├── e2e/                     # Playwright E2E tests
├── docs/
│   ├── openapi.json         # Backend API schema (synced)
│   ├── API_CONTRACT.md      # Human-readable API docs
│   └── VERSION_MATRIX.md    # Compatibility matrix
├── public/                  # Static assets
└── package.json
```

## Component Guidelines

### Creating New Components
1. **Functional components only** (no class components)
2. **TypeScript interfaces for props**
3. **TailwindCSS for styling** (no CSS modules)
4. **Export default + named exports**

Example:
```typescript
// src/components/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
  step: string;
  progress: number; // 0-1
  status: 'running' | 'success' | 'error';
}

export function ProgressBar({ step, progress, status }: ProgressBarProps) {
  const bgColor = {
    running: 'bg-blue-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
  }[status];

  return (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div
        className={`${bgColor} h-4 rounded-full transition-all duration-300`}
        style={{ width: `${progress * 100}%` }}
      >
        <span className="text-xs text-white px-2">{step}</span>
      </div>
    </div>
  );
}

export default ProgressBar;
```

### Page Components
```typescript
// src/pages/HomePage.tsx
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { parseBusinessRequest, runOrchestration } from '../api/client';

export function HomePage() {
  const [document, setDocument] = useState('');
  const { addSession, updateProgress } = useStore();

  const handleOrchestration = async () => {
    const result = await runOrchestration(document, 'https://collibra.example.com');
    addSession(result.session);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Business Request</h1>
      <textarea
        value={document}
        onChange={(e) => setDocument(e.target.value)}
        className="w-full h-64 border rounded p-2"
        placeholder="# Project: ..."
      />
      <button
        onClick={handleOrchestration}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Run Orchestration
      </button>
    </div>
  );
}

export default HomePage;
```

## State Management (Zustand)

### Store Definition
```typescript
// src/store/useStore.ts
import create from 'zustand';
import { Session, OrchestrationProgress } from '../types/state';

interface MCOPState {
  sessions: Session[];
  currentSession: Session | null;
  orchestrationProgress: OrchestrationProgress | null;

  // Actions
  addSession: (session: Session) => void;
  setCurrentSession: (session: Session | null) => void;
  updateProgress: (progress: OrchestrationProgress) => void;
  clearProgress: () => void;
}

export const useStore = create<MCOPState>((set) => ({
  sessions: [],
  currentSession: null,
  orchestrationProgress: null,

  addSession: (session) =>
    set((state) => ({ sessions: [...state.sessions, session] })),

  setCurrentSession: (session) =>
    set({ currentSession: session }),

  updateProgress: (progress) =>
    set({ orchestrationProgress: progress }),

  clearProgress: () =>
    set({ orchestrationProgress: null }),
}));
```

### Usage in Components
```typescript
import { useStore } from '../store/useStore';

function MyComponent() {
  const sessions = useStore((state) => state.sessions);
  const addSession = useStore((state) => state.addSession);

  // Use sessions and addSession
}
```

## API Integration

### HTTP Client
```typescript
// src/api/client.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function parseBusinessRequest(document: string) {
  const response = await fetch(`${API_URL}/parse/business-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

export async function runOrchestration(document: string, collibra_url: string) {
  const response = await fetch(`${API_URL}/orchestrate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document, collibra_url }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  return response.json();
}
```

### WebSocket Client
```typescript
// src/api/websocket.ts
import { useStore } from '../store/useStore';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

let ws: WebSocket | null = null;

export function connectWebSocket() {
  ws = new WebSocket(`${WS_URL}/ws/orchestrate`);

  ws.onopen = () => {
    console.log('WebSocket connected');
  };

  ws.onmessage = (event) => {
    const progress = JSON.parse(event.data);
    useStore.getState().updateProgress(progress);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected');
  };
}

export function disconnectWebSocket() {
  if (ws) {
    ws.close();
    ws = null;
  }
}
```

## Testing (Playwright)

### E2E Test Structure
```typescript
// e2e/orchestration.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Orchestration Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should parse business request', async ({ page }) => {
    // Enter document
    await page.fill('textarea', '# Project: Test\n## Goal\nTest goal');

    // Click parse
    await page.click('button:text("Parse Request")');

    // Verify result
    await expect(page.locator('.parsed-result')).toBeVisible();
    await expect(page.locator('.parsed-result')).toContainText('Test');
  });

  test('should run full orchestration', async ({ page }) => {
    // Enter document
    await page.fill('textarea', '# Project: Test\n...');

    // Run orchestration
    await page.click('button:text("Run Orchestration")');

    // Wait for progress
    await expect(page.locator('.progress-bar')).toBeVisible();

    // Wait for completion
    await expect(page.locator('.progress-bar')).toHaveAttribute('data-status', 'success', { timeout: 30000 });

    // Navigate to diagram
    await page.click('a[href="/diagram"]');
    await expect(page.locator('.mermaid')).toBeVisible();
  });
});
```

### Running Tests
```bash
# All tests
npm test

# Specific browser
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug

# UI mode
npx playwright test --ui
```

## Styling (TailwindCSS)

### Configuration
```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'mcop-primary': '#3b82f6',
        'mcop-secondary': '#10b981',
        'mcop-danger': '#ef4444',
      },
    },
  },
  plugins: [],
};
```

### Common Patterns
```typescript
// Button variants
<button className="bg-mcop-primary hover:bg-blue-600 text-white px-4 py-2 rounded">
  Primary Button
</button>

<button className="bg-mcop-secondary hover:bg-green-600 text-white px-4 py-2 rounded">
  Secondary Button
</button>

// Card
<div className="bg-white shadow rounded-lg p-4">
  <h2 className="text-xl font-bold mb-2">Card Title</h2>
  <p className="text-gray-600">Card content</p>
</div>

// Grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

## Common Mistakes to Avoid

1. ❌ Hardcoding API URLs (use `import.meta.env.VITE_API_URL`)
2. ❌ Not syncing API schema after backend changes (`npm run sync-api`)
3. ❌ Using `any` type in TypeScript
4. ❌ Inline styles instead of TailwindCSS classes
5. ❌ Not handling loading/error states
6. ❌ Forgetting to clean up WebSocket connections

## Pre-Commit Checklist

```bash
# 1. Sync API schema (if backend updated)
npm run sync-api

# 2. Check compatibility
npm run check-api

# 3. Type check
npm run type-check

# 4. Lint
npm run lint

# 5. Run tests
npm test

# 6. Build
npm run build
```

## Cross-Repo Workflow

### Backend Releases New API Version
1. Backend tags release: `v0.2.0`
2. Frontend runs: `npm run sync-api`
3. Review: `git diff docs/openapi.json`
4. Update types in `src/types/api.ts` if needed
5. Update API client calls in `src/api/client.ts`
6. Run tests: `npm test`
7. Commit: `git add docs/openapi.json src/`
8. Tag compatible version: `git tag v0.2.0`

### Handling Breaking Changes
If backend bumps major version (e.g., `v1.0.0`):
1. Review backend `CHANGELOG.md`
2. Create migration branch
3. Update API client for changed endpoints
4. Update types for changed schemas
5. Run E2E tests to catch regressions
6. Coordinate deployment with backend team

## Sprint 2 Focus (Current)

### Stories
1. **UI Polish** - Loading states, error boundaries, toast notifications
2. **Diagram Export** - PNG/SVG export, copy to clipboard
3. **Session Management** - Delete sessions, rename, export JSON
4. **Performance** - Virtualization for large diagrams

### Priority Tasks
- [ ] Add loading spinners for all async operations
- [ ] Implement error boundaries for graceful failures
- [ ] Add toast notifications (react-hot-toast or similar)
- [ ] Diagram export buttons (PNG/SVG)
- [ ] Session delete/rename UI in HistoryPage

## Documentation References

**Local:**
- `docs/API_CONTRACT.md` - Backend API documentation
- `docs/VERSION_MATRIX.md` - Compatibility matrix
- `e2e/` - E2E test examples

**External:**
- Backend Repo: https://github.com/minarovic/archi-agent
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev
- TailwindCSS Docs: https://tailwindcss.com
- Mermaid Docs: https://mermaid.js.org
- Playwright Docs: https://playwright.dev
- Zustand Docs: https://zustand-demo.pmnd.rs

---

**Remember:** Frontend **consumes** backend API via `docs/openapi.json`. Always sync schema after backend releases.
