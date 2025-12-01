# Frontend Migration Brief

**Date:** 2025-11-30
**Backend URL:** https://practical-quietude-production.up.railway.app
**Backend Repo:** https://github.com/minarovic/archi-agent
**Frontend Repo:** https://github.com/minarovic/archi-agent-frontend

## Mission

Migrate reusable layout and components from previous frontend project to new `archi-agent-frontend` repo, then integrate with Railway backend API.

## Backend Status ✅

- **Railway deployment:** Live at `https://practical-quietude-production.up.railway.app`
- **Health check:** `GET /health` - working
- **OpenAPI schema:** `GET /openapi.json` - available
- **Environment variables:** Azure OpenAI configured (no Collibra yet)
- **API version:** 0.1.0

## Key API Endpoints

### Pipeline
- `POST /api/pipeline/run` - Start pipeline execution
  - Request: `{ document, scope, skip_tool0 }`
  - Response: `{ session_id, status, message }`
- `GET /api/pipeline/{session_id}/status` - Check status
- `GET /api/pipeline/{session_id}/result` - Get full result
- `GET /api/diagram/{session_id}` - Get Mermaid ER diagram

### Metadata
- `GET /api/tables` - List all tables (optional `?schema=`)
- `GET /api/tables/{table_name}` - Get table details
- `GET /api/schemas` - List all schemas

### Chat
- `POST /api/chat` - REST chat endpoint
- WebSocket `/ws/chat` - Streaming chat (preferred)

### Health
- `GET /health` - Health check
- `GET /api/stats` - API statistics

## Previous Frontend Components to Migrate

**Prioritize reusing:**

1. **Layout Components:**
   - Header/navigation bar
   - Sidebar (if exists)
   - Main content area structure
   - Footer

2. **Chat Components:**
   - Message list with scrolling
   - Message input with send button
   - Message bubbles (user vs agent)
   - Typing indicator

3. **Diagram Components:**
   - Mermaid.js integration
   - Zoom/pan controls
   - Export buttons

4. **Common UI:**
   - Loading spinners
   - Error messages
   - Toast notifications
   - Modal dialogs

5. **Styling:**
   - TailwindCSS configuration
   - Color scheme
   - Typography
   - Responsive breakpoints

## Migration Steps

### 1. Setup (5 min)
```bash
# Clone frontend repo (if not done)
git clone https://github.com/minarovic/archi-agent-frontend.git
cd archi-agent-frontend

# Install dependencies
npm install

# Create .env.local
echo "VITE_API_URL=https://practical-quietude-production.up.railway.app" > .env.local
echo "VITE_WS_URL=wss://practical-quietude-production.up.railway.app" >> .env.local
```

### 2. Sync API Schema (2 min)
```bash
# Download latest OpenAPI schema from backend
npm run sync-api
# This creates: docs/openapi.json
```

### 3. Component Migration (30-45 min)

**From previous project → new repo:**

```bash
# Example structure to migrate
src/
├── components/
│   ├── Layout.tsx          # ✅ Reuse layout structure
│   ├── ChatPanel.tsx       # ✅ Adapt for new API
│   ├── MessageList.tsx     # ✅ Reuse message rendering
│   ├── MessageInput.tsx    # ✅ Reuse input logic
│   ├── MermaidDiagram.tsx  # ✅ Reuse diagram rendering
│   └── Canvas.tsx          # ⚠️ Review if needed
├── hooks/
│   └── useWebSocket.ts     # ✅ Adapt for /ws/chat endpoint
├── store/
│   └── chatStore.ts        # ✅ Adapt for new message types
└── types/
    └── index.ts            # ⚠️ Update based on openapi.json
```

**Key changes needed:**

- Update API base URL to Railway endpoint
- Adjust WebSocket connection to `/ws/chat`
- Update TypeScript types from `openapi.json`
- Keep TailwindCSS styling (should work as-is)
- Keep Mermaid.js integration (should work as-is)

### 4. API Integration (15-20 min)

**HTTP Client:**
```typescript
// src/api/client.ts
const API_URL = import.meta.env.VITE_API_URL;

export async function runPipeline(document: string, scope: string) {
  const response = await fetch(`${API_URL}/api/pipeline/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document, scope, skip_tool0: false })
  });
  return response.json();
}

export async function getPipelineStatus(sessionId: string) {
  const response = await fetch(`${API_URL}/api/pipeline/${sessionId}/status`);
  return response.json();
}

export async function getDiagram(sessionId: string) {
  const response = await fetch(`${API_URL}/api/diagram/${sessionId}`);
  return response.json();
}
```

**WebSocket Client:**
```typescript
// src/hooks/useWebSocket.ts (adapt existing)
const WS_URL = import.meta.env.VITE_WS_URL;

export function useWebSocket(sessionId?: string) {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = sessionId
      ? `${WS_URL}/ws/chat?session_id=${sessionId}`
      : `${WS_URL}/ws/chat`;

    const websocket = new WebSocket(wsUrl);

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      // Handle message based on type: agent_message, status_update, etc.
    };

    setWs(websocket);
    return () => websocket.close();
  }, [sessionId]);

  return { ws };
}
```

### 5. Vercel Deployment (10 min)

**Environment Variables in Vercel Dashboard:**
```
VITE_API_URL=https://practical-quietude-production.up.railway.app
VITE_WS_URL=wss://practical-quietude-production.up.railway.app
```

**Deploy:**
```bash
# Vercel CLI (if not using GitHub integration)
vercel --prod

# Or via GitHub (push triggers auto-deploy)
git add .
git commit -m "feat: Migrate components from previous project"
git push origin main
```

## Testing Checklist

After migration, verify:

- [ ] Health check: Frontend can reach `GET /health`
- [ ] Pipeline flow:
  1. User enters business request
  2. Frontend calls `POST /api/pipeline/run`
  3. Frontend polls `GET /api/pipeline/{id}/status`
  4. When completed, fetch diagram from `GET /api/diagram/{id}`
- [ ] Chat via WebSocket:
  1. Connect to `/ws/chat`
  2. Send message: `{"type": "user_message", "content": "..."}`
  3. Receive response: `{"type": "agent_message", "content": "..."}`
- [ ] Mermaid diagram renders correctly
- [ ] Responsive layout works (mobile/desktop)
- [ ] Error handling (network errors, API errors)

## Known Backend Limitations

1. **Tool 1 Mock Data:** Currently returns empty `columns` array, causing generic diagram entity names (`dm_bs_purchase_fact_1` instead of real table names)
2. **No Collibra Integration:** Environment variables not set yet
3. **Session Expiry:** Sessions don't persist after server restart (in-memory only)

These are **backend issues**, not blocking frontend migration.

## Decision Points for Frontend Agent

1. **Which components to migrate?**
   - Analyze previous project structure
   - Identify reusable vs. project-specific code
   - Prioritize Layout, ChatPanel, MermaidDiagram

2. **State management?**
   - Keep Zustand (if previous project used it)
   - Or switch to React Context/Redux (if simpler)

3. **Styling approach?**
   - Keep TailwindCSS config as-is
   - Or merge with new design system

4. **Testing?**
   - Keep Playwright E2E tests structure
   - Update test URLs to point to Vercel + Railway

## Success Criteria

✅ Frontend deployed to Vercel
✅ Can call Railway backend API
✅ Pipeline execution works end-to-end
✅ Mermaid diagram displays
✅ WebSocket chat functional
✅ Responsive layout from previous project

## Next Steps After Migration

1. **MCOP-S2-002:** Production hardening (JWT auth, rate limiting)
2. **MCOP-S2-003:** Real Collibra API integration
3. **MCOP-S2-001:** Tool 5 implementation (better ER diagrams)

## Questions to Ask Frontend Agent

When you open frontend repo with Copilot/Claude:

> "I have a previous frontend project with similar layout and components (chat, diagrams, layout).
> Backend is deployed to Railway: https://practical-quietude-production.up.railway.app
>
> 1. Help me identify which components from the old project can be reused
> 2. Migrate Layout, ChatPanel, MessageList, MermaidDiagram components
> 3. Update API integration to use new Railway backend endpoints
> 4. Set up Vercel deployment with correct env variables
>
> Start by analyzing the old project structure and showing me what we can reuse."

---

**Backend Contact:** This repo (`archi-agent`) - Backend agent
**Frontend Contact:** `archi-agent-frontend` repo - Frontend agent
**Coordination:** API contract via `openapi.json` (backend auto-generates, frontend consumes)
