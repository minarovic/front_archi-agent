# MCOP Frontend Project Context
**Last Updated:** 2025-12-02

## 🎯 Project Overview
**Mission:** React 19 + Vite frontend for metadata orchestration pipeline visualization (ER diagrams, quality reports, real-time progress)

**Repositories:**
- Frontend: https://github.com/minarovic/front_archi-agent
- Backend: https://github.com/minarovic/archi-agent (Python FastAPI)

---

## 🚀 Current Status: Sprint 3.1 - Professional Design

### Škoda Brand Design System
**Colors:**
```
Primary Dark:  #0E3A2F (headers, dark backgrounds)
Primary:       #4BA82E (accents, CTAs, success)
Primary Light: #78FAAE (hover, highlights)
Primary Muted: #1a5a42 (secondary backgrounds)
```

**Design Principles:**
- Flat design (border-radius: 0)
- Border accents instead of shadows
- Geist font family
- Škoda green color palette

### Latest Implementation (Dec 2, 2025)
✅ InitialView with example prompts
✅ Canvas Trigger with confidence threshold (0.6)
✅ View Mode Toggle (Table/Diagram, keyboard T/D)
✅ Loading Dots (staggered bounce animation)
✅ Metrics Header (dark header with stats grid)
✅ Follow-up Badge (⚡ indicator)

**Build Status:** ✅ `npm run build` passes (3.69s)

---

## 📦 Tech Stack
- **React 19** + **TypeScript 5.3**
- **Vite 7.2.4** (HMR, build)
- **TailwindCSS 4.1.17** (utility-first)
- **Zustand** (state management)
- **Mermaid.js 10.6.1** (ER diagrams)
- **Playwright 1.57.0** (E2E testing)

---

## 🏗️ Architecture

### Component Structure
```
frontend/src/
├── components/
│   ├── Layout.tsx           # Dual-panel layout
│   ├── ChatPanel.tsx        # Chat UI with WebSocket
│   ├── MessageList.tsx      # Message rendering
│   ├── MessageInput.tsx     # Input with send button
│   ├── Canvas.tsx           # Right panel (diagram/table)
│   ├── MermaidDiagram.tsx   # Mermaid renderer
│   ├── InitialView.tsx      # Welcome screen + prompts
│   ├── LoadingDots.tsx      # Bounce animation
│   ├── MetricsHeader.tsx    # Stats dashboard
│   ├── ViewModeToggle.tsx   # Table/Diagram switch
│   └── FollowUpBadge.tsx    # Context indicator
├── hooks/
│   ├── useWebSocket.ts      # WS connection + reconnect
│   └── useCanvasTrigger.ts  # Canvas state management
├── store/
│   └── chatStore.ts         # Zustand store
└── types/
    └── index.ts             # TypeScript interfaces
```

### State Management (Zustand)
```typescript
interface ChatStore {
  sessionId: string | null;
  messages: Message[];
  diagram: string | null;
  isConnected: boolean;
  isLoading: boolean;

  initSession: () => void;
  addMessage: (message: Message) => void;
  setDiagram: (diagram: string) => void;
}
```

---

## 🔌 API Integration

### Environment Variables
```bash
VITE_API_URL=https://practical-quietude-production.up.railway.app
VITE_WS_URL=wss://practical-quietude-production.up.railway.app
```

### WebSocket Protocol
- **Connect:** `/ws/{session_id}`
- **Message Types:** `user`, `agent`, `agent_partial`, `error`
- **Diagram:** Received in `data.diagram` field

### Backend Endpoints
- `GET /health` - Health check
- `GET /openapi.json` - API schema
- `POST /api/pipeline/run` - Start pipeline
- `GET /api/diagram/{session_id}` - Get diagram

---

## 🎨 Design Patterns

### Responsive Layout
```tsx
<div className="flex flex-col md:flex-row h-screen">
  {/* Chat: Fixed 600px on desktop, full on mobile */}
  <div className="w-full md:w-[600px] border-r">
    <ChatPanel />
  </div>

  {/* Canvas: Flexible width */}
  <main className="flex-1 overflow-y-auto p-8">
    <Canvas />
  </main>
</div>
```

### Loading States
```tsx
// Animated dots
<LoadingDots variant="dark" />

// Follow-up overlay
{isFollowUpLoading && (
  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm">
    <LoadingDots />
    <p>LLM is generating answer...</p>
  </div>
)}
```

---

## 🔧 Development Workflow

### Commands
```bash
npm install              # Install dependencies
npm run dev             # Start dev server (localhost:5173)
npm run build           # Build for production
npm run preview         # Preview production build
npm test                # Run Playwright E2E tests
npm run type-check      # TypeScript validation
```

### Git Workflow
1. Work on feature branch
2. `npm run build` to verify
3. `npm test` for E2E validation
4. Commit and push
5. Vercel auto-deploys on main branch

---

## 📝 Key Documents

**Design System:**
- `scrum/sprint_3.1/DESIGN_SYSTEM.md` - Complete brand guidelines
- `scrum/sprint_3.1/DESIGN_TOKENS.ts` - TypeScript constants
- `scrum/ideas/design_ntier.md` - N-tier migration guide

**Planning:**
- `scrum/ideas/design_ntier_implementation.md` - MoSCoW prioritization
- `AGENTS.md` - AI agent guidelines
- `.github/copilot-instructions.md` - Copilot rules

---

## ⚠️ Common Pitfalls

1. ❌ Hardcoding API URLs (use `import.meta.env.VITE_API_URL`)
2. ❌ Not syncing API schema after backend changes
3. ❌ Using `any` type in TypeScript
4. ❌ Inline styles instead of TailwindCSS classes
5. ❌ Forgetting WebSocket cleanup on unmount
6. ❌ Not handling loading/error states

---

## 🎯 Next Steps

### Sprint 3.1 Remaining
- [ ] E2E Playwright tests update
- [ ] Error boundaries
- [ ] Toast notifications
- [ ] Diagram export (PNG/SVG)

### Future Sprints
- [ ] Session management (delete, rename, export)
- [ ] Performance optimization (virtualization)
- [ ] Backend Canvas Trigger integration
- [ ] Follow-up endpoint

---

## 🔗 Links

**Docs:**
- React: https://react.dev
- Vite: https://vitejs.dev
- TailwindCSS: https://tailwindcss.com
- Mermaid: https://mermaid.js.org
- Playwright: https://playwright.dev
- Zustand: https://zustand-demo.pmnd.rs

**Deployment:**
- Vercel: https://vercel.com/minarovic/front-archi-agent
- Railway Backend: https://practical-quietude-production.up.railway.app
