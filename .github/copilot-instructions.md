# MCOP Frontend - Copilot Instructions

**Stack:** React 19, Vite 7.2.4, TypeScript 5.3, TailwindCSS 4.1.17, Zustand, Mermaid.js 10.6.1, Playwright 1.57.0
**Design:** Škoda Green (#4BA82E), flat design, border accents
**Backend:** https://github.com/minarovic/archi-agent
**Principle:** Frontend consumes `docs/openapi.json` from backend

## API Sync
`npm run sync-api` - Download openapi.json from backend
`npm run check-api` - Verify compatibility
See `docs/VERSION_MATRIX.md` for version rules

## Dev Setup
`npm install && npm run sync-api && npm run dev` → http://localhost:5173

**Env vars:** `VITE_API_URL=http://localhost:8000`, `VITE_WS_URL=ws://localhost:8000`

## Architecture
**Pages:** HomePage (editor), DiagramPage (Mermaid viewer), HistoryPage (sessions)
**Store:** Zustand - sessions, currentSession, orchestrationProgress
**API:** `client.ts` (fetch), `websocket.ts` (WS at `/ws/orchestrate`)

## Testing
`npm test` | `npx playwright test --debug` | `npx playwright test --ui`
**Tests:** Parse, Orchestrate, Diagram, History (4 workflows × 3 browsers × 2 sizes)

## Styling
**Colors:** primary-dark (#0E3A2F), primary (#4BA82E), primary-light (#78FAAE), primary-muted (#1a5a42)
**Design:** Flat (no rounded corners), border accents (no shadows), Geist font

## Deploy
**Vercel:** Auto-deploy on main push | `vercel --prod`
**Env:** `VITE_API_URL=https://archi-agent.railway.app`, `VITE_WS_URL=wss://archi-agent.railway.app`

## Backend Sync
**New version:** `npm run sync-api` → review diff → update types/API → test → commit/tag
**Breaking changes:** CHANGELOG → migration PR → update client/types → E2E tests → coordinate deploy

## Pitfalls
❌ Hardcoded URLs | ❌ No sync-api | ❌ `any` types | ❌ Inline styles | ❌ Skip tests | ❌ Inline SVGs

## Sprint 3.1 (Dec 2025)
**Completed:** InitialView, Canvas Trigger (0.6), View Toggle (T/D), Loading Dots, Metrics Header, Follow-up Badge
**Priority:** E2E tests, Error boundaries, Toast notifications, Diagram export, Session UI
**Build:** ✅ `npm run build` (3.69s)

## Code Quality
`npm run format && npm run lint && npm run type-check`

## Docs
**Local:** `docs/API_CONTRACT.md`, `docs/VERSION_MATRIX.md`, `e2e/`
**External:** Backend (github.com/minarovic/archi-agent), react.dev, vitejs.dev, tailwindcss.com, mermaid.js.org, playwright.dev
