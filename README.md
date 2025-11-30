# Metadata Copilot - Frontend

React 19 + Vite frontend for the Metadata Copilot orchestration pipeline visualization.

**Repository:** https://github.com/minarovic/front_archi-agent
**Backend Repository:** https://github.com/minarovic/archi-agent
**Deployment:** Vercel (auto-deploy on main branch)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 22+
- npm 10+
- Backend API running (see [archi-agent](https://github.com/minarovic/archi-agent))

### Installation

```bash
# Clone repository
git clone git@github.com:minarovic/front_archi-agent.git
cd front_archi-agent/frontend

# Install dependencies
npm install
```

### Environment Setup

Create `frontend/.env`:

```bash
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

For production (Vercel):

```bash
VITE_API_URL=https://archi-agent.railway.app
VITE_WS_URL=wss://archi-agent.railway.app
```

### Run Development Server

```bash
cd frontend
npm run dev
```

Open http://localhost:5173

---

## 🏗️ Architecture

### Tech Stack
- **React 19** - UI framework with concurrent features
- **TypeScript 5.3** - Type safety
- **Vite 7.2.4** - Build tool with HMR
- **TailwindCSS 4.1.17** - Utility-first styling
- **Zustand** - Lightweight state management
- **Mermaid.js 10.6.1** - ER diagram rendering
- **Playwright 1.57.0** - E2E testing

### Features
- 💬 **Real-time Chat** - WebSocket communication with backend
- 📊 **ER Diagram Viewer** - Interactive Mermaid diagram rendering with pan/zoom
- 🔄 **Orchestration Progress** - Live pipeline status updates
- 📜 **Session History** - Restore previous orchestrations
- 🎨 **Split Layout** - Chat panel left, canvas right
- ⚡ **Streaming Responses** - Real-time agent responses

### Project Structure

```
front_archi-agent/
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── DiagramPage.tsx
│   │   │   └── HistoryPage.tsx
│   │   ├── store/           # Zustand state management
│   │   ├── hooks/           # Custom React hooks
│   │   └── types/           # TypeScript definitions
│   ├── tests/               # Playwright E2E tests
│   ├── public/              # Static assets
│   └── package.json
├── .github/
│   ├── workflows/           # CI/CD workflows
│   └── copilot-instructions.md
├── scrum/                   # Sprint planning & stories
├── AGENTS.md                # AI agent guidelines
└── README.md                # This file
```

---

## 📡 Backend Integration

**Backend Repository:** https://github.com/minarovic/archi-agent
**API Documentation:** See backend repo `/docs/API_CONTRACT.md`

### API Endpoints

The frontend consumes these backend endpoints:

- `POST /parse/business-request` - Tool 0: Parse business document
- `POST /ingest/collibra` - Tool 1: Ingest Collibra metadata
- `POST /structure/classify` - Tool 2: Classify entities
- `POST /quality/validate` - Tool 3: Validate metadata quality
- `POST /orchestrate` - Run full Tool 0→1→2→3 pipeline
- `WS /ws/orchestrate` - Real-time orchestration progress

### WebSocket Protocol

```typescript
// Connect to orchestration progress stream
const ws = new WebSocket(`${WS_URL}/ws/orchestrate`);

// Receive progress updates
ws.onmessage = (event) => {
  const progress = JSON.parse(event.data);
  // { step: "tool0", status: "running", progress: 0.25 }
};
```

---

## 🧪 Testing

### E2E Tests (Playwright)

```bash
cd frontend

# Run all tests (24 tests: 4 workflows × 3 browsers × 2 screen sizes)
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

---

## 🎨 Development

### Running with Backend

```bash
# Terminal 1: Start backend
cd ~/archi-agent
source .venv/bin/activate
uvicorn src.api.main:app --reload --port 8000

# Terminal 2: Start frontend
cd ~/front_archi-agent/frontend
npm run dev
```

### Code Style

```bash
cd frontend

# Format
npm run format

# Lint
npm run lint

# Type check
npm run type-check
```

### Component Development

All components use:
- **Functional components** (no class components)
- **TypeScript interfaces** for props
- **TailwindCSS** for styling (no CSS modules)
- **Zustand** for global state

Example component:

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
        className={`${bgColor} h-4 rounded-full transition-all`}
        style={{ width: `${progress * 100}%` }}
      >
        <span className="text-xs text-white px-2">{step}</span>
      </div>
    </div>
  );
}
```

---

## 🚢 Deployment

### Platform: Vercel

**Auto-Deploy:** Enabled on main branch push
**Region:** us-west1
**Build Command:** `cd frontend && npm run build`
**Output Directory:** `frontend/dist`

### Manual Deploy

```bash
cd frontend
npm install -g vercel
vercel --prod
```

### Environment Variables (Vercel Dashboard)

Set these in Vercel project settings:

```
VITE_API_URL=https://archi-agent.railway.app
VITE_WS_URL=wss://archi-agent.railway.app
```

---

## 🔧 Troubleshooting

### WebSocket Connection Failed
- ✅ Check backend is running on port 8000
- ✅ Verify `VITE_WS_URL` in `.env`
- ✅ Check browser console for errors
- ✅ Ensure CORS is configured on backend

### Diagram Not Rendering
- ✅ Verify Mermaid syntax is valid
- ✅ Check browser console for Mermaid errors
- ✅ Ensure diagram data is non-empty

### Build Errors
```bash
cd frontend
rm -rf node_modules dist
npm install
npm run build
```

### TypeScript Errors
```bash
cd frontend
npm run type-check
```

---

## 📚 Documentation

**Local:**
- `frontend/README.md` - Detailed frontend documentation
- `AGENTS.md` - AI agent guidelines
- `.github/copilot-instructions.md` - GitHub Copilot instructions
- `scrum/` - Sprint planning & stories

**External:**
- Backend Repo: https://github.com/minarovic/archi-agent
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev
- TailwindCSS: https://tailwindcss.com
- Mermaid: https://mermaid.js.org
- Playwright: https://playwright.dev
- Zustand: https://zustand-demo.pmnd.rs

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/diagram-export`
2. Make changes in `frontend/src/`
3. Write E2E test: `frontend/tests/diagram-export.spec.ts`
4. Run tests: `cd frontend && npm test`
5. Build: `npm run build`
6. Push and open PR
7. CI must pass (build + E2E tests)

---

## 📝 Sprint Status

**Current Sprint:** Sprint 2 - Production hardening, UI improvements

### Priority Tasks
- [ ] Add loading spinners for all async operations
- [ ] Implement error boundaries for graceful failures
- [ ] Add toast notifications (react-hot-toast)
- [ ] Diagram export buttons (PNG/SVG)
- [ ] Session delete/rename UI in HistoryPage

See `scrum/sprint_2/` for detailed stories.

---

## 📊 Performance

- **Initial Load:** ~200KB gzipped
- **WebSocket:** Minimal overhead
- **Mermaid:** Lazy loaded
- **React 19:** Concurrent rendering optimizations
- **Vite:** Sub-second HMR

---

## 🌐 Browser Support

- Chrome/Edge: ✅ Latest 2 versions
- Firefox: ✅ Latest 2 versions
- Safari: ✅ Latest 2 versions
- Mobile: ⚠️ Limited (desktop-first design)

---

## 📦 Repository Split History

This repository was split from the monorepo on **2025-11-30**.

**Frontend Repo (this):** https://github.com/minarovic/front_archi-agent
**Backend Repo:** https://github.com/minarovic/archi-agent

Backend code was removed via `cleanup-backend.sh` script (preserved for documentation).

---

## 📄 License

MIT License - See LICENSE file

---

## 🔗 Related Repositories

- **Backend:** https://github.com/minarovic/archi-agent
- **Infrastructure:** (planned)

---

**Maintainer:** @minarovic
**Last Updated:** 2025-11-30
