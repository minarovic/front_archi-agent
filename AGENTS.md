# MCOP Frontend - AI Agent Guidelines

**Frontend:** React 19 + Vite | **Backend:** https://github.com/minarovic/archi-agent

## Tech Stack
React 19, TypeScript 5.3, Vite 7.2.4, TailwindCSS 4.1.17, Zustand, Mermaid.js 10.6.1, Playwright 1.57.0

## Core Principles
1. **API Contract:** Backend `docs/openapi.json` → Frontend syncs via `npm run sync-api`
2. **Architecture:** Pages (routes) → Components (UI) → Store (Zustand) → API (client)
3. **Type Safety:** TypeScript interfaces for all data, no `any` types

## Project Structure
- **src/components/** - Reusable UI (Button, Card, ProgressBar, Diagram)
- **src/pages/** - Routes (HomePage, DiagramPage, HistoryPage)
- **src/store/** - Zustand state (useStore.ts)
- **src/api/** - Backend client (client.ts, websocket.ts)
- **src/types/** - TypeScript interfaces (api.ts, state.ts)
- **e2e/** - Playwright tests
- **docs/** - openapi.json (synced), API_CONTRACT.md, VERSION_MATRIX.md

## Component Guidelines
**Rules:**
1. Functional components only (no classes)
2. TypeScript interfaces for props
3. TailwindCSS for styling (no CSS modules)
4. Export default + named exports

## State Management (Zustand)
**Store:** `useStore` in `src/store/useStore.ts`
- State: sessions, currentSession, orchestrationProgress
- Actions: addSession(), setCurrentSession(), updateProgress(), clearProgress()
- Usage: `const sessions = useStore((state) => state.sessions);`

## API Integration
**HTTP:** `src/api/client.ts` - Use `import.meta.env.VITE_API_URL`, native fetch, throw errors on !response.ok
**WebSocket:** `src/api/websocket.ts` - Connect to `/ws/orchestrate`, update store on message
**Endpoints:** `/parse/business-request`, `/orchestrate`

## Testing (Playwright)
**E2E Tests:** `e2e/` - Test workflows (parse, orchestrate, diagram, history)
**Run:** `npm test` | `npx playwright test --debug` | `npx playwright test --ui`
**Coverage:** 4 workflows × 3 browsers × 2 screen sizes = 24 tests

## Styling (TailwindCSS)
**Config:** `tailwind.config.js` - Extend colors in theme.extend.colors
**Patterns:** Utility classes for buttons, cards, grids (no CSS modules)

## Common Mistakes
❌ Hardcoding API URLs | ❌ Not syncing openapi.json | ❌ Using `any` type | ❌ Inline styles | ❌ No error handling | ❌ WebSocket leaks | ❌ Running npm from wrong directory

## NPM Command Safety
**CRITICAL:** This is a monorepo structure. Frontend code is in `frontend/` subdirectory.

**ALWAYS run npm commands from `/frontend` directory:**
```bash
cd /Users/marekminarovic/front_archi-agent/frontend && npm run dev
cd frontend && npm test
cd frontend && npm run build
```

**NEVER run from root:**
```bash
# ❌ WRONG - will fail with ENOENT package.json
npm run dev

# ✅ CORRECT
cd frontend && npm run dev
```

**Root directory has no package.json** - only workspace structure files (AGENTS.md, README.md, vercel.json)

## Pre-Commit
`npm run sync-api && npm run check-api && npm run type-check && npm run lint && npm test && npm run build`

## Cross-Repo Workflow
**New Backend Version:** `npm run sync-api` → review diff → update types/client → test → commit → tag
**Breaking Changes (major bump):** Review CHANGELOG.md → migrate branch → update endpoints/types → E2E tests → coordinate deploy

## Sprint 3.1 (Dec 2025)
**Škoda Brand:** Primary #4BA82E (green), Dark #0E3A2F, Light #78FAAE, Muted #1a5a42. Flat design, border accents, Geist font.

**Completed:** InitialView, Canvas Trigger (0.6 confidence), View Toggle (T/D), Loading Dots, Metrics Header, Follow-up Badge

**Priority:** E2E tests update, Error boundaries, Toast notifications, Diagram export, Session UI

## References
**Docs:** `docs/API_CONTRACT.md`, `docs/VERSION_MATRIX.md`, `e2e/`
**External:** https://github.com/minarovic/archi-agent (backend), react.dev, vitejs.dev, tailwindcss.com, mermaid.js.org, playwright.dev
