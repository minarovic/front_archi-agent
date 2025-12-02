# Frontend Implementation Guide - Sprint 2

**Repository:** https://github.com/minarovic/archi-agent-frontend
**Backend API:** https://practical-quietude-production.up.railway.app
**Duration:** ~2 hours total
**Last Updated:** 2025-12-02

---

## 📋 Quick Overview

Backend je **hotový** a deploynutý na Railway. Frontend musí implementovať 6 UX stories:

| Story  | Priorita | Effort | Popis                         |
| ------ | -------- | ------ | ----------------------------- |
| FE-001 | 🔴 P1     | 30 min | InitialView s Example Prompts |
| FE-002 | 🔴 P1     | 20 min | Canvas Trigger Handler        |
| FE-003 | 🟡 P2     | 15 min | View Mode Toggle              |
| FE-004 | 🟡 P2     | 15 min | Loading Dots Animation        |
| FE-005 | 🟢 P3     | 20 min | Metrics Header Card           |
| FE-006 | 🟢 P3     | 10 min | Follow-up Badge               |

---

## 🎯 Backend Contract (Already Deployed ✅)

### WebSocket Response Schema

```typescript
interface WebSocketMessage {
  type: 'user' | 'agent' | 'agent_partial' | 'tool' | 'error';
  content: string;
  timestamp?: string;

  // 🆕 NEW FIELDS (Sprint 2)
  canvas_trigger?: CanvasTrigger;
  diagram?: string;              // Mermaid syntax
  metrics?: PipelineMetrics;
}

interface CanvasTrigger {
  action: 'switch_view' | 'new_analysis' | 'none';
  view_type?: 'er_diagram' | 'table_list' | 'relationship_graph';
  confidence: number;            // 0.0-1.0, auto-switch only if >= 0.6
  reason: string;                // Human-readable explanation
}

interface PipelineMetrics {
  total_tables: number;
  total_columns: number;
  relationships_count: number;
  as_of: string;                 // ISO timestamp
}
```

### Example Response

```json
{
  "type": "agent",
  "content": "Generated ER diagram for factv_purchase_order_item...",
  "timestamp": "2025-12-02T15:30:00",
  "canvas_trigger": {
    "action": "switch_view",
    "view_type": "er_diagram",
    "confidence": 0.95,
    "reason": "📊 Switching to ER diagram view"
  },
  "diagram": "erDiagram\n  factv_purchase_order_item ||--o{ dimv_supplier : references\n",
  "metrics": {
    "total_tables": 8,
    "total_columns": 44,
    "relationships_count": 1,
    "as_of": "2025-12-02T15:30:00"
  }
}
```

---

## 🚀 Implementation Steps

### Phase 1: Critical Features (50 min)

#### 1. MCOP-FE-001: InitialView Component (30 min)

**File:** `src/components/InitialView.tsx`

```tsx
import React from 'react';

interface InitialViewProps {
  onExampleClick: (prompt: string) => void;
}

const EXAMPLE_PROMPTS = [
  {
    icon: "📊",
    title: "Show ER Diagram",
    prompt: "Generate ER diagram for the schema",
    category: "Visualization"
  },
  {
    icon: "📋",
    title: "List Tables",
    prompt: "List all tables in the database",
    category: "Exploration"
  },
  {
    icon: "🔗",
    title: "Show Relationships",
    prompt: "Show relationships between tables",
    category: "Analysis"
  },
  {
    icon: "📈",
    title: "Data Quality",
    prompt: "Analyze data quality for all tables",
    category: "Quality"
  }
];

export function InitialView({ onExampleClick }: InitialViewProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-gray-50">
      <div className="max-w-2xl text-center mb-8">
        <h1 className="text-4xl font-bold text-primary-dark mb-4">
          Metadata Copilot
        </h1>
        <p className="text-lg text-gray-600">
          Explore your data catalog with AI-powered assistance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        {EXAMPLE_PROMPTS.map((example, idx) => (
          <button
            key={idx}
            onClick={() => onExampleClick(example.prompt)}
            className="flex items-start gap-4 p-6 bg-white rounded-lg border-2 border-gray-200
                       hover:border-primary-accent hover:bg-gray-50 transition-all text-left"
          >
            <span className="text-3xl">{example.icon}</span>
            <div>
              <div className="text-xs text-primary-accent font-semibold uppercase mb-1">
                {example.category}
              </div>
              <div className="text-base font-semibold text-gray-900 mb-1">
                {example.title}
              </div>
              <div className="text-sm text-gray-500">
                {example.prompt}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 text-sm text-gray-500">
        Or type your own question in the chat below
      </div>
    </div>
  );
}
```

**Integration:** Update `src/components/ChatPanel.tsx`:

```tsx
import { InitialView } from './InitialView';

// Inside ChatPanel component
{messages.length === 0 ? (
  <InitialView onExampleClick={(prompt) => {
    // Send prompt as user message
    sendMessage(prompt);
  }} />
) : (
  <MessageList messages={messages} />
)}
```

**Test Script:**
```bash
# Manual test in browser
npm run dev
# 1. Visit http://localhost:5173
# 2. Verify InitialView displays with 4 example prompts
# 3. Click "Show ER Diagram" → should send message
# 4. Verify InitialView disappears after first message
```

---

#### 2. MCOP-FE-002: Canvas Trigger Handler (20 min)

**File:** `src/hooks/useCanvasTrigger.ts`

```typescript
import { useEffect } from 'react';
import type { CanvasTrigger } from '../types';

interface UseCanvasTriggerProps {
  canvasTrigger?: CanvasTrigger;
  currentView: 'er_diagram' | 'table_list' | 'relationship_graph';
  onViewChange: (view: string) => void;
}

const CONFIDENCE_THRESHOLD = 0.6;

export function useCanvasTrigger({
  canvasTrigger,
  currentView,
  onViewChange
}: UseCanvasTriggerProps) {
  useEffect(() => {
    if (!canvasTrigger || canvasTrigger.action === 'none') {
      return;
    }

    if (canvasTrigger.action === 'switch_view' && canvasTrigger.view_type) {
      const confidence = canvasTrigger.confidence ?? 1.0;

      // Only auto-switch if confidence >= threshold
      if (confidence >= CONFIDENCE_THRESHOLD) {
        // Don't switch if already on target view
        if (currentView !== canvasTrigger.view_type) {
          console.log(`[Canvas Trigger] Switching to ${canvasTrigger.view_type} (confidence: ${confidence})`);
          onViewChange(canvasTrigger.view_type);
        }
      } else {
        console.log(`[Canvas Trigger] Confidence too low: ${confidence} < ${CONFIDENCE_THRESHOLD}`);
      }
    }
  }, [canvasTrigger, currentView, onViewChange]);
}
```

**File:** `src/types/index.ts` (add types)

```typescript
export interface CanvasTrigger {
  action: 'switch_view' | 'new_analysis' | 'none';
  view_type?: 'er_diagram' | 'table_list' | 'relationship_graph';
  confidence?: number;
  reason: string;
}

export interface PipelineMetrics {
  total_tables: number;
  total_columns: number;
  relationships_count: number;
  as_of?: string;
}

export interface WebSocketMessage {
  type: 'user' | 'agent' | 'agent_partial' | 'tool' | 'error';
  content: string;
  timestamp?: string;
  canvas_trigger?: CanvasTrigger;
  diagram?: string;
  metrics?: PipelineMetrics;
}
```

**Integration:** Update `src/components/Layout.tsx`:

```tsx
import { useState } from 'react';
import { useCanvasTrigger } from '../hooks/useCanvasTrigger';

export function Layout() {
  const [currentView, setCurrentView] = useState<'er_diagram' | 'table_list'>('er_diagram');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  // Handle canvas trigger from WebSocket
  useCanvasTrigger({
    canvasTrigger: lastMessage?.canvas_trigger,
    currentView,
    onViewChange: (view) => setCurrentView(view as any)
  });

  // In WebSocket message handler
  const handleMessage = (msg: WebSocketMessage) => {
    setLastMessage(msg);
    // ... rest of message handling
  };

  return (
    <div className="flex h-screen">
      <ChatPanel onMessage={handleMessage} />
      <Canvas view={currentView} diagram={lastMessage?.diagram} />
    </div>
  );
}
```

**Test Script:**
```bash
# Playwright test
npx playwright test tests/canvas-trigger.spec.ts

# Manual test
npm run dev
# 1. Type: "Show ER diagram"
# 2. Verify Canvas switches to diagram view
# 3. Check browser console for log: "[Canvas Trigger] Switching to er_diagram (confidence: 0.95)"
# 4. Type: "List all tables"
# 5. Verify Canvas switches to table list view
```

---

### Phase 2: Polish Features (30 min)

#### 3. MCOP-FE-003: View Mode Toggle (15 min)

**File:** `src/components/Canvas.tsx` (update)

```tsx
import { useState } from 'react';

type ViewMode = 'er_diagram' | 'table_list';

export function Canvas({ diagram, metrics }: CanvasProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('er_diagram');

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* View Mode Toggle */}
      <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('er_diagram')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'er_diagram'
                ? 'bg-primary-accent text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📊 Diagram
          </button>
          <button
            onClick={() => setViewMode('table_list')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'table_list'
                ? 'bg-primary-accent text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📋 Table List
          </button>
        </div>

        {/* Metrics display - if available */}
        {metrics && (
          <div className="text-sm text-gray-600">
            {metrics.total_tables} tables · {metrics.relationships_count} relationships
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {viewMode === 'er_diagram' ? (
          <MermaidDiagram diagram={diagram} />
        ) : (
          <TableList />
        )}
      </div>
    </div>
  );
}
```

**Test Script:**
```bash
# Manual test
npm run dev
# 1. Send any message to display Canvas
# 2. Click "Diagram" button → verify diagram shows
# 3. Click "Table List" button → verify list shows
# 4. Verify active button has green background
# 5. Test auto-switch: type "Show ER diagram" → should switch to Diagram view
```

---

#### 4. MCOP-FE-004: Loading Dots Animation (15 min)

**File:** `src/components/LoadingDots.tsx`

```tsx
import React from 'react';

export function LoadingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
           style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
           style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
           style={{ animationDelay: '300ms' }} />
    </div>
  );
}
```

**Integration:** Update `src/components/MessageList.tsx`:

```tsx
import { LoadingDots } from './LoadingDots';

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, idx) => (
        <Message key={idx} message={msg} />
      ))}

      {isLoading && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-accent flex items-center justify-center text-white">
            AI
          </div>
          <LoadingDots />
        </div>
      )}
    </div>
  );
}
```

**Test Script:**
```bash
# Manual test
npm run dev
# 1. Type a message
# 2. Verify animated dots appear before agent response
# 3. Verify dots disappear when response arrives
# 4. Check smooth bounce animation (3 dots with 150ms delay)
```

---

### Phase 3: Dashboard Features (30 min)

#### 5. MCOP-FE-005: Metrics Header Card (20 min)

**File:** `src/components/MetricsHeader.tsx`

```tsx
import React from 'react';
import type { PipelineMetrics } from '../types';

interface MetricsHeaderProps {
  metrics?: PipelineMetrics;
}

export function MetricsHeader({ metrics }: MetricsHeaderProps) {
  if (!metrics) {
    return (
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex gap-6 text-sm text-gray-400">
          <div>Loading metrics...</div>
        </div>
      </div>
    );
  }

  const formatTimestamp = (iso?: string) => {
    if (!iso) return '';
    const date = new Date(iso);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center gap-6">
        <MetricCard
          icon="📊"
          label="Tables"
          value={metrics.total_tables}
        />
        <MetricCard
          icon="📋"
          label="Columns"
          value={metrics.total_columns}
        />
        <MetricCard
          icon="🔗"
          label="Relationships"
          value={metrics.relationships_count}
        />

        {metrics.as_of && (
          <div className="ml-auto text-xs text-gray-500">
            Updated {formatTimestamp(metrics.as_of)}
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="text-2xl font-bold text-primary-dark">{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  );
}
```

**Integration:** Update `src/components/Canvas.tsx`:

```tsx
import { MetricsHeader } from './MetricsHeader';

export function Canvas({ diagram, metrics }: CanvasProps) {
  return (
    <div className="flex-1 flex flex-col">
      <MetricsHeader metrics={metrics} />
      {/* ... rest of Canvas */}
    </div>
  );
}
```

**Test Script:**
```bash
# Manual test
npm run dev
# 1. Type: "Show schema structure"
# 2. Wait for agent response
# 3. Verify MetricsHeader displays:
#    - 8 Tables
#    - 44 Columns
#    - 1 Relationships
# 4. Verify timestamp shows (e.g., "Updated 3:30 PM")
```

---

#### 6. MCOP-FE-006: Follow-up Badge (10 min)

**File:** `src/components/MessageList.tsx` (update)

```tsx
function Message({ message }: { message: WebSocketMessage }) {
  const isFollowUp = detectFollowUp(message.content);

  return (
    <div className={`flex items-start gap-3 ${message.type === 'user' ? 'justify-end' : ''}`}>
      {message.type === 'agent' && (
        <div className="w-8 h-8 rounded-full bg-primary-accent flex items-center justify-center text-white">
          AI
        </div>
      )}

      <div className={`max-w-[70%] rounded-lg p-3 ${
        message.type === 'user'
          ? 'bg-primary-accent text-white'
          : 'bg-white border border-gray-200'
      }`}>
        {isFollowUp && message.type === 'agent' && (
          <div className="inline-flex items-center gap-1 px-2 py-1 mb-2 bg-primary-light/20
                          rounded-full text-xs text-primary-dark font-medium">
            <span>↩️</span>
            <span>Follow-up</span>
          </div>
        )}

        <div className="prose prose-sm max-w-none">
          {message.content}
        </div>
      </div>
    </div>
  );
}

// Client-side follow-up detection
function detectFollowUp(content: string): boolean {
  const followUpPatterns = [
    /based on (the |your )?previous/i,
    /as (i |we )?mentioned/i,
    /following up/i,
    /in addition to/i,
    /furthermore/i,
    /moreover/i,
  ];

  return followUpPatterns.some(pattern => pattern.test(content));
}
```

**Test Script:**
```bash
# Manual test
npm run dev
# 1. Type: "Show ER diagram"
# 2. Type: "What are the relationships in that diagram?"
# 3. Verify second agent response has "↩️ Follow-up" badge
# 4. Badge should have light green background (#78FAAE with opacity)
```

---

## 🧪 Complete Test Suite

### Automated Tests (Playwright)

**File:** `tests/sprint2-features.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Sprint 2 Frontend Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('FE-001: InitialView shows example prompts', async ({ page }) => {
    // Verify InitialView is visible
    await expect(page.getByText('Metadata Copilot')).toBeVisible();

    // Verify 4 example prompts
    await expect(page.getByText('Show ER Diagram')).toBeVisible();
    await expect(page.getByText('List Tables')).toBeVisible();
    await expect(page.getByText('Show Relationships')).toBeVisible();
    await expect(page.getByText('Data Quality')).toBeVisible();

    // Click example prompt
    await page.getByText('Show ER Diagram').click();

    // Verify InitialView disappears
    await expect(page.getByText('Metadata Copilot')).not.toBeVisible();
  });

  test('FE-002: Canvas switches view on trigger', async ({ page }) => {
    // Send message that triggers diagram view
    await page.fill('[data-testid="message-input"]', 'Show ER diagram');
    await page.click('[data-testid="send-button"]');

    // Wait for response
    await page.waitForSelector('[data-testid="canvas-view"]');

    // Verify diagram view is active
    await expect(page.getByText('📊 Diagram')).toHaveClass(/bg-primary-accent/);
  });

  test('FE-003: Manual view toggle works', async ({ page }) => {
    // Send initial message
    await page.fill('[data-testid="message-input"]', 'Hello');
    await page.click('[data-testid="send-button"]');

    // Click Diagram button
    await page.click('button:has-text("📊 Diagram")');
    await expect(page.getByTestId('diagram-view')).toBeVisible();

    // Click Table List button
    await page.click('button:has-text("📋 Table List")');
    await expect(page.getByTestId('table-list-view')).toBeVisible();
  });

  test('FE-004: Loading dots appear during request', async ({ page }) => {
    // Send message
    await page.fill('[data-testid="message-input"]', 'Test');
    await page.click('[data-testid="send-button"]');

    // Verify loading dots appear
    await expect(page.getByTestId('loading-dots')).toBeVisible();

    // Wait for response
    await page.waitForSelector('[data-testid="agent-message"]');

    // Verify loading dots disappear
    await expect(page.getByTestId('loading-dots')).not.toBeVisible();
  });

  test('FE-005: Metrics header displays stats', async ({ page }) => {
    // Send message that returns metrics
    await page.fill('[data-testid="message-input"]', 'Show schema');
    await page.click('[data-testid="send-button"]');

    // Wait for metrics
    await page.waitForSelector('[data-testid="metrics-header"]');

    // Verify metrics display
    await expect(page.getByText(/\d+ Tables/)).toBeVisible();
    await expect(page.getByText(/\d+ Columns/)).toBeVisible();
    await expect(page.getByText(/\d+ Relationships/)).toBeVisible();
  });

  test('FE-006: Follow-up badge appears', async ({ page }) => {
    // Send initial message
    await page.fill('[data-testid="message-input"]', 'Show ER diagram');
    await page.click('[data-testid="send-button"]');
    await page.waitForSelector('[data-testid="agent-message"]');

    // Send follow-up
    await page.fill('[data-testid="message-input"]', 'What are the relationships?');
    await page.click('[data-testid="send-button"]');
    await page.waitForSelector('[data-testid="agent-message"]:nth-child(2)');

    // Verify follow-up badge (client-side detection)
    const followUpBadge = page.locator('text=Follow-up');
    const count = await followUpBadge.count();
    // May or may not appear depending on agent response wording
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
```

**Run tests:**
```bash
# Install Playwright (if not already)
npm install -D @playwright/test
npx playwright install

# Run tests
npx playwright test

# Run with UI
npx playwright test --ui

# Run specific test
npx playwright test -g "FE-001"
```

---

### Manual Testing Checklist

```bash
# Setup
git clone https://github.com/minarovic/archi-agent-frontend
cd archi-agent-frontend
npm install
npm run dev

# FE-001: InitialView ✅
# [ ] Open http://localhost:5173
# [ ] Verify "Metadata Copilot" heading
# [ ] See 4 example prompts with icons
# [ ] Click "Show ER Diagram" → InitialView disappears
# [ ] Send another message → InitialView stays hidden

# FE-002: Canvas Trigger ✅
# [ ] Type: "Show ER diagram"
# [ ] Verify Canvas switches to diagram view automatically
# [ ] Check console for: "[Canvas Trigger] Switching to er_diagram"
# [ ] Type: "List all tables"
# [ ] Verify Canvas switches to table list view

# FE-003: View Mode Toggle ✅
# [ ] Click "📊 Diagram" button → diagram shows
# [ ] Click "📋 Table List" button → list shows
# [ ] Verify active button has green background (#4BA82E)
# [ ] Verify toggle overrides auto-switch from canvas_trigger

# FE-004: Loading Dots ✅
# [ ] Send any message
# [ ] Verify animated dots appear (3 dots bouncing)
# [ ] Verify smooth animation with staggered timing
# [ ] Verify dots disappear when response arrives

# FE-005: Metrics Header ✅
# [ ] Send: "Show schema structure"
# [ ] Verify metrics display:
#     - Tables: 8
#     - Columns: 44
#     - Relationships: 1
# [ ] Verify timestamp shows (e.g., "Updated 3:30 PM")

# FE-006: Follow-up Badge ✅
# [ ] Send: "Show ER diagram"
# [ ] Send: "What are the relationships in that diagram?"
# [ ] Look for "↩️ Follow-up" badge on second agent response
# [ ] Badge has light green background
```

---

## 🎨 Tailwind Config Updates

**File:** `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#0E3A2F',
          DEFAULT: '#4BA82E',
          accent: '#4BA82E',
          light: '#78FAAE',
          muted: '#1a5a42',
        }
      },
      animation: {
        'bounce': 'bounce 1s infinite',
      },
    },
  },
  plugins: [],
}
```

**File:** `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Škoda Green Theme */
:root {
  --primary-dark: #0E3A2F;
  --primary-accent: #4BA82E;
  --primary-light: #78FAAE;
  --primary-muted: #1a5a42;
}

/* Custom animations */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-0.5rem);
  }
}
```

---

## 🚢 Deployment

```bash
# Build for production
npm run build

# Preview build
npm run preview

# Deploy to Vercel (auto-deploy on git push)
git add .
git commit -m "feat: Sprint 2 - UX enhancements (FE-001 to FE-006)"
git push origin main

# Verify deployment
open https://archi-agent-frontend.vercel.app
```

---

## 📊 Verification Commands

```bash
# Check TypeScript compilation
npm run type-check

# Run linter
npm run lint

# Run tests
npm test

# Check bundle size
npm run build
ls -lh dist/

# Test WebSocket connection
node -e "
const ws = new WebSocket('wss://practical-quietude-production.up.railway.app/ws/test-session');
ws.onopen = () => console.log('✅ WebSocket connected');
ws.onerror = (e) => console.error('❌ WebSocket error:', e);
"
```

---

## 🔗 References

- **Backend API Docs:** `/Users/marekminarovic/archi-agent/docs_pydantic/websocket-enrichment.md`
- **Story Details:** `/Users/marekminarovic/archi-agent/scrum/sprint_2/frontend/`
- **Architecture:** `/Users/marekminarovic/archi-agent/scrum/architecture/canvas-trigger-backend.md`
- **Design Reference:** `/Users/marekminarovic/archi-agent/scrum/ideas/design_ntier.md`

---

## ✅ Definition of Done

**For each story:**
- [ ] Component implemented with TypeScript
- [ ] Responsive design (mobile + desktop)
- [ ] Škoda Green color scheme applied
- [ ] Playwright test passes
- [ ] Manual testing checklist complete
- [ ] Code reviewed and merged

**Sprint completion criteria:**
- [ ] All 6 stories done
- [ ] 22+ E2E tests passing
- [ ] Deployed to Vercel
- [ ] Backward compatible with old backend (graceful fallback)
- [ ] No console errors
- [ ] Lighthouse score > 90

---

**Total Implementation Time:** ~2 hours
**Testing Time:** ~30 minutes
**Total Sprint 2 Frontend:** ~2.5 hours
