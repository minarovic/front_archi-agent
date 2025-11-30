# Metadata Copilot Frontend - GitHub Copilot Instructions

## Project Overview
**Name:** Metadata Copilot (MCOP) Frontend
**Purpose:** React 19 + Vite frontend for metadata orchestration pipeline visualization
**Current Phase:** Sprint 2 - Production hardening, UI improvements
**Tech Stack:** React 19, Vite 7.2.4, TailwindCSS 4.1.17, Zustand, Mermaid.js, Playwright

## Repository Context
**This is the FRONTEND repository** after monorepo split (2025-11-30).
**Backend repository:** https://github.com/minarovic/archi-agent

**Key Principle:** Frontend **consumes** API contract from backend via `docs/openapi.json`.

## Project Structure
```
archi-agent-frontend/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   │   ├── HomePage.tsx
│   │   ├── DiagramPage.tsx
│   │   └── HistoryPage.tsx
│   ├── store/          # Zustand state management
│   ├── api/            # Backend API client
│   └── types/          # TypeScript types
├── e2e/                # Playwright E2E tests
├── docs/
│   ├── openapi.json    # Backend API schema (synced)
│   ├── API_CONTRACT.md # Human-readable API docs
│   └── VERSION_MATRIX.md # Compatibility matrix
├── public/             # Static assets
├── package.json
├── vite.config.ts
└── README.md
```

## Tech Stack

### Core
- **React 19** - UI framework with concurrent features
- **TypeScript 5.3** - Type safety
- **Vite 7.2.4** - Build tool with HMR

### Styling
- **TailwindCSS 4.1.17** - Utility-first CSS
- **PostCSS** - CSS transformations

### State Management
- **Zustand** - Lightweight state management
```typescript
interface MCOPState {
  sessions: Session[];
  currentSession: Session | null;
  orchestrationProgress: OrchestrationProgress;
  addSession: (session: Session) => void;
  updateProgress: (progress: OrchestrationProgress) => void;
}
```

### Visualization
- **Mermaid.js 10.6.1** - ER diagram rendering
- Pan/zoom support via custom hooks
- Export to PNG/SVG

### Testing
- **Playwright 1.57.0** - E2E testing
- **@playwright/test** - Test runner
- 24 tests: 4 workflows × 3 browsers × 2 screen sizes

### API Integration
- **Native fetch** - HTTP client
- **WebSocket** - Real-time orchestration progress

## API Contract Management

### Sync API Schema from Backend
**Run after backend releases new version:**
```bash
npm run sync-api
```

This downloads latest `openapi.json` from backend repo.

### Check Compatibility
```bash
npm run check-api
```

Runs `scripts/check-api-compatibility.js` to verify backend-frontend version compatibility.

### Version Matrix
See `docs/VERSION_MATRIX.md` for compatibility rules:
- Major version must match (0.x.x → 1.x.x = breaking)
- Minor version can lag (0.1.x can use 0.2.x backend with degraded features)
- Patch version always compatible within minor

## Development Workflow

### Local Setup
```bash
# Install dependencies
npm install

# Sync API schema
npm run sync-api

# Start dev server
npm run dev
```

Open http://localhost:5173

### Environment Variables
Create `.env`:
```
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

### Hot Module Replacement
Vite provides instant HMR. Changes reflect in browser without full reload.

## Component Architecture

### Pages
- **HomePage** - Business request editor + orchestration trigger
  - Textarea for Markdown input
  - "Parse Request" button (Tool 0)
  - "Run Orchestration" button (Tool 0→1→2→3)
  - Real-time progress indicator (WebSocket)

- **DiagramPage** - ER diagram viewer
  - Mermaid.js rendering
  - Pan/zoom controls
  - Export buttons (PNG/SVG)
  - Entity filtering

- **HistoryPage** - Session list
  - Past orchestrations
  - Session details
  - Restore capability

### State Management (Zustand)
```typescript
// store/useStore.ts
import create from 'zustand';

const useStore = create<MCOPState>((set) => ({
  sessions: [],
  currentSession: null,
  orchestrationProgress: null,

  addSession: (session) =>
    set((state) => ({ sessions: [...state.sessions, session] })),

  updateProgress: (progress) =>
    set({ orchestrationProgress: progress }),
}));
```

### WebSocket Integration
```typescript
// api/websocket.ts
const ws = new WebSocket(`${VITE_WS_URL}/ws/orchestrate`);

ws.onmessage = (event) => {
  const progress: OrchestrationProgress = JSON.parse(event.data);
  useStore.getState().updateProgress(progress);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};
```

### API Client
```typescript
// api/client.ts
export async function parseBusinessRequest(document: string) {
  const response = await fetch(`${VITE_API_URL}/parse/business-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document }),
  });
  return response.json();
}

export async function runOrchestration(document: string, collibra_url: string) {
  const response = await fetch(`${VITE_API_URL}/orchestrate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document, collibra_url }),
  });
  return response.json();
}
```

## Testing

### E2E Tests (Playwright)
```bash
# Run all tests
npm test

# Run specific browser
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug

# UI mode (interactive)
npx playwright test --ui
```

### Test Scenarios
- ✅ Business request parsing workflow
- ✅ Full orchestration (Tool 0→1→2→3)
- ✅ Diagram interaction (pan/zoom/filter)
- ✅ Session history + restore

### Writing E2E Tests
```typescript
// e2e/orchestration.spec.ts
import { test, expect } from '@playwright/test';

test('full orchestration workflow', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Enter business request
  await page.fill('textarea', '# Project: Test\n...');

  // Trigger orchestration
  await page.click('button:text("Run Orchestration")');

  // Wait for progress updates
  await expect(page.locator('.progress-bar')).toBeVisible();
  await expect(page.locator('.progress-bar')).toHaveAttribute('data-step', 'tool3');

  // Verify diagram rendered
  await page.click('a[href="/diagram"]');
  await expect(page.locator('.mermaid')).toBeVisible();
});
```

## Styling with TailwindCSS

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
      },
    },
  },
  plugins: [],
};
```

### Usage
```typescript
// HomePage.tsx
<button className="bg-mcop-primary hover:bg-blue-600 text-white px-4 py-2 rounded">
  Run Orchestration
</button>
```

## Deployment

**Platform:** Vercel
**Region:** us-west1
**Auto-Deploy:** On main branch push

**Manual Deploy:**
```bash
vercel --prod
```

### Environment Variables (Vercel)
Set in Vercel dashboard:
- `VITE_API_URL` = `https://archi-agent.railway.app`
- `VITE_WS_URL` = `wss://archi-agent.railway.app`

## Cross-Repo Workflow

### Backend Releases New API Version
1. Backend tags release: `v0.2.0`
2. Frontend runs: `npm run sync-api`
3. Review: `git diff docs/openapi.json`
4. Update components if needed:
   - Check for new endpoints
   - Update types in `src/types/`
   - Adjust API client calls
5. Test: `npm test` (verify E2E tests pass)
6. Commit: `git add docs/openapi.json src/`
7. Tag compatible version: `git tag v0.2.0`
8. Push and deploy

### Handling Breaking Changes
If backend bumps major version (e.g., `v1.0.0`):
1. Review `CHANGELOG.md` in backend repo
2. Create migration PR in frontend
3. Update API client for changed endpoints
4. Update types for changed schemas
5. Run E2E tests to catch regressions
6. Coordinate deployment timing with backend team

## Common Pitfalls to Avoid

1. ❌ Don't hardcode API URLs (use `VITE_API_URL` env var)
2. ❌ Don't forget to sync API schema after backend changes
3. ❌ Don't commit `docs/openapi.json` without running `npm run check-api`
4. ❌ Don't use `any` type - define proper TypeScript interfaces
5. ❌ Don't skip E2E tests for new features
6. ❌ Don't inline large SVGs - use Mermaid.js for diagrams

## Sprint 2 Focus (Current)

### Stories
1. **UI Polish** - Loading states, error boundaries, toast notifications
2. **Diagram Export** - PNG/SVG export, copy to clipboard
3. **Session Management** - Delete sessions, rename, export JSON
4. **Performance** - Virtualization for large diagrams, lazy loading

### Priority Tasks
- [ ] Add loading spinners for API calls
- [ ] Implement error boundaries for graceful failures
- [ ] Add toast notifications (success/error messages)
- [ ] Diagram export to PNG/SVG
- [ ] Session delete/rename UI

## Code Style

### Formatting
```bash
npm run format
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

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

## Contact

**Repository:** https://github.com/minarovic/archi-agent-frontend
**Backend:** https://github.com/minarovic/archi-agent
**Owner:** @minarovic
