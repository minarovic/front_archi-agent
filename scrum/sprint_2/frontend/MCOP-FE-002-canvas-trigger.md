# MCOP-FE-002: Canvas Trigger Handler

**Priorita:** 🔴 P1 (Must Have)
**Effort:** 20 minút
**Status:** 🟡 Ready (backend optional)
**Závislosť:** Backend `canvas_trigger` je OPTIONAL - FE funguje aj bez neho

---

## ⚠️ Compatibility Contract

**CRITICAL:** Tento handler MUSÍ fungovať aj bez backend podpory!

```typescript
// If backend doesn't send canvas_trigger, treat as:
const DEFAULT_TRIGGER: CanvasTrigger = { action: 'none', reason: '' };

// FE checks:
if (!response.canvas_trigger) {
  // Do nothing - keep current view
  return;
}
```

---

## 📋 User Story

> Ako používateľ chcem, aby sa Canvas automaticky prepol na správny view (diagram/tabuľka), keď sa v chate spomínajú kľúčové slová ako "diagram", "ukáž tabuľky" alebo "vzťahy".

---

## ✅ Acceptance Criteria

- [ ] AC1: Frontend hook `useCanvasTrigger` spracováva `canvas_trigger` z WebSocket response
- [ ] AC2: Ak `action === 'switch_view'`, Canvas prepne na príslušný view
- [ ] AC3: Ak `action === 'new_analysis'`, spustí sa nový API call
- [ ] AC4: `reason` sa zobrazí v chate ako systémová správa
- [ ] AC5: View types: `er_diagram`, `table_list`, `relationship_graph`
- [ ] AC6: **Graceful fallback** ak backend nevráti `canvas_trigger` (MUST)
- [ ] AC7: **Manual override rule**: User toggle > backend trigger (MUST)
- [ ] AC8: **Confidence threshold**: Auto-switch only if `confidence >= 0.6`

---

## 🔧 API Contract (Backend → Frontend)

### WebSocket Response Schema

```typescript
// Aktuálna štruktúra (Sprint 1)
interface WebSocketMessage {
  type: 'user' | 'agent' | 'agent_partial' | 'tool' | 'error';
  content: string;
  timestamp?: string;
}

// Rozšírená štruktúra (Sprint 2) - BACKEND ZMENA
interface WebSocketMessage {
  type: 'user' | 'agent' | 'agent_partial' | 'tool' | 'error';
  content: string;
  timestamp?: string;

  // 🆕 Canvas Trigger
  canvas_trigger?: CanvasTrigger;
}

interface CanvasTrigger {
  action: 'switch_view' | 'new_analysis' | 'none';
  view_type?: 'er_diagram' | 'table_list' | 'relationship_graph';
  entity_name?: string;   // napr. "factv_purchase_order"
  query?: string;         // Query pre nový API call
  reason: string;         // Dôvod prepnutia (zobrazí sa v chate)

  // 🆕 Extended fields (v2)
  confidence?: number;    // 0.0-1.0, FE auto-switches only if >= 0.6
  trace_id?: string;      // For debugging/logging
  latency_ms?: number;    // Backend processing time
}
```

### Manual Override Rule

**User toggle ALWAYS wins over backend trigger:**

```typescript
// State
const [isViewPinned, setIsViewPinned] = useState(false);

// When user manually clicks toggle
const handleManualToggle = (viewType: ViewType) => {
  setCurrentView(viewType);
  setIsViewPinned(true);  // Pin the view
};

// When backend trigger arrives
const handleCanvasTrigger = (trigger: CanvasTrigger) => {
  if (isViewPinned) {
    // Show confirm chip instead of hard switch
    showConfirmChip({
      message: trigger.reason,
      action: () => {
        setCurrentView(trigger.view_type);
        setIsViewPinned(false);
      }
    });
    return;
  }

  // Auto-switch only if confidence >= 0.6
  const confidence = trigger.confidence ?? 1.0;
  if (confidence < 0.6) {
    showConfirmChip({ message: trigger.reason, ... });
    return;
  }

  // Auto-switch
  setCurrentView(trigger.view_type);
};
```

### Confidence-Based Switching

| Confidence | Behavior                        |
| ---------- | ------------------------------- |
| >= 0.6     | Auto-switch view                |
| < 0.6      | Show confirm chip, user decides |
| undefined  | Treat as 1.0 (legacy backend)   |
```

### Príklady Backend Response

**1. Prepnutie na ER diagram:**
```json
{
  "type": "agent",
  "content": "Generujem ER diagram pre tabuľku factv_purchase_order...",
  "timestamp": "2025-12-01T10:30:00Z",
  "canvas_trigger": {
    "action": "switch_view",
    "view_type": "er_diagram",
    "entity_name": "factv_purchase_order",
    "reason": "Prepínam na ER diagram view"
  }
}
```

**2. Nová analýza:**
```json
{
  "type": "agent",
  "content": "Analyzujem vzťahy medzi tabuľkami...",
  "canvas_trigger": {
    "action": "new_analysis",
    "view_type": "relationship_graph",
    "query": "/api/tables/factv_purchase_order/relationships",
    "reason": "Načítavam vzťahy pre relationship graph"
  }
}
```

**3. Žiadna akcia:**
```json
{
  "type": "agent",
  "content": "Tabuľka má 15 stĺpcov...",
  "canvas_trigger": {
    "action": "none",
    "reason": ""
  }
}
```

---

## 🔧 Technická Implementácia

### Nový súbor: `src/hooks/useCanvasTrigger.ts`

```typescript
import { useState, useCallback } from 'react';

export type ViewType = 'er_diagram' | 'table_list' | 'relationship_graph';

export interface CanvasTrigger {
  action: 'switch_view' | 'new_analysis' | 'none';
  view_type?: ViewType;
  entity_name?: string;
  query?: string;
  reason: string;
}

interface UseCanvasTriggerOptions {
  onViewChange?: (viewType: ViewType, entityName?: string) => void;
  onNewAnalysis?: (query: string) => Promise<void>;
  onMessage?: (message: string) => void;
}

export function useCanvasTrigger(options: UseCanvasTriggerOptions = {}) {
  const [currentView, setCurrentView] = useState<ViewType>('er_diagram');
  const [currentEntity, setCurrentEntity] = useState<string | null>(null);
  const [isTriggering, setIsTriggering] = useState(false);
  const [isViewPinned, setIsViewPinned] = useState(false);  // 🆕 Manual override

  // 🆕 Confidence threshold
  const CONFIDENCE_THRESHOLD = 0.6;

  const handleCanvasTrigger = useCallback(
    async (trigger: CanvasTrigger | undefined) => {
      // 🆕 Graceful fallback - ak trigger nie je alebo chýba view_type, nerob nič
      if (!trigger || trigger.action === 'none' || !trigger.view_type) {
        return;
      }

      // 🆕 Manual override check
      if (isViewPinned) {
        console.log('[Canvas Trigger] View pinned, showing confirm chip');
        options.onConfirmRequired?.({
          message: trigger.reason,
          viewType: trigger.view_type,
        });
        return;
      }

      // 🆕 Confidence check
      const confidence = trigger.confidence ?? 1.0;
      if (confidence < CONFIDENCE_THRESHOLD) {
        console.log('[Canvas Trigger] Low confidence:', confidence);
        options.onConfirmRequired?.({
          message: `${trigger.reason} (confidence: ${Math.round(confidence * 100)}%)`,
          viewType: trigger.view_type,
        });
        return;
      }

      setIsTriggering(true);

      try {
        // Zobraz reason ako správu (ak existuje callback)
        if (trigger.reason && options.onMessage) {
          options.onMessage(trigger.reason);
        }

        switch (trigger.action) {
          case 'switch_view':
            if (trigger.view_type) {
              setCurrentView(trigger.view_type);
              setCurrentEntity(trigger.entity_name || null);
              options.onViewChange?.(trigger.view_type, trigger.entity_name);
              console.log('[Canvas Trigger] Switched to:', trigger.view_type);
            }
            break;

          case 'new_analysis':
            if (trigger.query && options.onNewAnalysis) {
              await options.onNewAnalysis(trigger.query);
              if (trigger.view_type) {
                setCurrentView(trigger.view_type);
              }
              console.log('[Canvas Trigger] New analysis:', trigger.query);
            }
            break;
        }
      } catch (error) {
        console.error('[Canvas Trigger] Error:', error);
      } finally {
        setIsTriggering(false);
      }
    },
    [options]
  );

  return {
    currentView,
    currentEntity,
    isTriggering,
    isViewPinned,
    handleCanvasTrigger,
    setCurrentView,
    // 🆕 Manual override controls
    pinView: () => setIsViewPinned(true),
    unpinView: () => setIsViewPinned(false),
    manualSetView: (view: ViewType) => {
      setCurrentView(view);
      setIsViewPinned(true);
    },
  };
}
```

### Rozšírenie types: `src/types/index.ts`

```typescript
// Pridať k existujúcim typom

export type ViewType = 'er_diagram' | 'table_list' | 'relationship_graph';

export interface CanvasTrigger {
  action: 'switch_view' | 'new_analysis' | 'none';
  view_type?: ViewType;
  entity_name?: string;
  query?: string;
  reason: string;
}

// Rozšírená WebSocket správa
export interface WebSocketMessage {
  type: 'user' | 'agent' | 'agent_partial' | 'tool' | 'error';
  content: string;
  timestamp?: string;
  tool_name?: string;
  canvas_trigger?: CanvasTrigger;
}
```

### Integrácia do ChatPanel.tsx

```typescript
// ChatPanel.tsx
import { useCanvasTrigger, CanvasTrigger } from '../hooks/useCanvasTrigger';

export function ChatPanel() {
  const { messages, addMessage } = useChatStore();
  const { handleCanvasTrigger, currentView } = useCanvasTrigger({
    onViewChange: (viewType, entityName) => {
      console.log(`Switching canvas to ${viewType} for ${entityName}`);
      // Tu by sa prepol Canvas komponent
    },
    onMessage: (reason) => {
      // Pridať systémovú správu do chatu
      addMessage({
        type: 'system',
        content: reason,
        timestamp: new Date().toISOString(),
      });
    },
  });

  // V WebSocket message handler
  const handleWebSocketMessage = (data: WebSocketMessage) => {
    // Existujúca logika...
    addMessage({
      type: data.type,
      content: data.content,
      timestamp: data.timestamp,
    });

    // 🆕 Spracovať canvas trigger
    if (data.canvas_trigger) {
      handleCanvasTrigger(data.canvas_trigger);
    }
  };

  // ...
}
```

### Integrácia do Canvas.tsx

```typescript
// Canvas.tsx
interface CanvasProps {
  viewType: ViewType;
  entityName?: string;
  diagram?: string;
  tableList?: TableSummary[];
}

export function Canvas({ viewType, entityName, diagram, tableList }: CanvasProps) {
  const renderContent = () => {
    switch (viewType) {
      case 'er_diagram':
        return <MermaidDiagram code={diagram} />;

      case 'table_list':
        return <TableListView tables={tableList} />;

      case 'relationship_graph':
        return <RelationshipGraph entityName={entityName} />;

      default:
        return <EmptyState />;
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-4 md:p-8 overflow-y-auto">
      {renderContent()}
    </div>
  );
}
```

---

## ⚠️ Backend Požiadavky

**Toto vyžaduje zmenu na backende!** Viď [scrum/architecture/canvas-trigger-backend.md](../../architecture/canvas-trigger-backend.md)

### Backend TODO:
1. LLM musí detegovať kľúčové slová v user query
2. Backend pridá `canvas_trigger` do WebSocket response
3. Keyword mapping:
   - "diagram", "ER", "vizualizuj" → `view_type: 'er_diagram'`
   - "zoznam", "list", "tabuľky" → `view_type: 'table_list'`
   - "vzťahy", "relationships" → `view_type: 'relationship_graph'`

---

## 🧪 Playwright Test Scenáre

### Test Suite: `tests/e2e/canvas-trigger.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Canvas Trigger Handler', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Odoslať prvú správu aby sa zobrazil chat
    await page.fill('input[placeholder*="Ask anything"]', 'Hello');
    await page.click('button:has-text("Analyze")');
    await page.waitForSelector('[data-testid="chat-panel"]');
  });

  test('should switch to ER diagram when backend triggers', async ({ page }) => {
    // Mock WebSocket response with canvas_trigger
    // (Playwright WebSocket mocking)
    await page.fill('input[data-testid="chat-input"]', 'Show ER diagram for factv_purchase_order');
    await page.click('button[data-testid="send-button"]');

    // Wait for canvas to switch
    await expect(page.locator('[data-testid="canvas-view-er_diagram"]')).toBeVisible({ timeout: 10000 });
  });

  test('should display trigger reason as system message', async ({ page }) => {
    await page.fill('input[data-testid="chat-input"]', 'Generate diagram');
    await page.click('button[data-testid="send-button"]');

    // Reason should appear in chat
    await expect(page.getByText(/Prepínam na|Switching to/i)).toBeVisible({ timeout: 10000 });
  });

  test('should handle missing canvas_trigger gracefully', async ({ page }) => {
    // Send query that won't trigger canvas change
    await page.fill('input[data-testid="chat-input"]', 'What is the table count?');
    await page.click('button[data-testid="send-button"]');

    // Canvas should remain unchanged (no error)
    await expect(page.locator('[data-testid="canvas"]')).toBeVisible();
  });

  test('view should persist after trigger', async ({ page }) => {
    // Trigger view change
    await page.fill('input[data-testid="chat-input"]', 'Show table list');
    await page.click('button[data-testid="send-button"]');

    // Wait for view change
    await expect(page.locator('[data-testid="canvas-view-table_list"]')).toBeVisible({ timeout: 10000 });

    // Send another message (not a trigger)
    await page.fill('input[data-testid="chat-input"]', 'How many columns?');
    await page.click('button[data-testid="send-button"]');

    // View should remain table_list
    await expect(page.locator('[data-testid="canvas-view-table_list"]')).toBeVisible();
  });

});
```

---

## 📦 Deliverables

| Súbor                              | Akcia                    |
| ---------------------------------- | ------------------------ |
| `src/hooks/useCanvasTrigger.ts`    | **Vytvoriť**             |
| `src/types/index.ts`               | Rozšíriť o CanvasTrigger |
| `src/components/ChatPanel.tsx`     | Integrovať hook          |
| `src/components/Canvas.tsx`        | Pridať viewType prop     |
| `tests/e2e/canvas-trigger.spec.ts` | **Vytvoriť**             |

---

## 🔗 Súvisiace

- **Backend Story:** [canvas-trigger-backend.md](../../architecture/canvas-trigger-backend.md)
- **Design Reference:** [design_ntier.md](../../ideas/design_ntier.md#4-canvas-trigger-logika)

---

## ✅ Definition of Done

- [ ] Hook `useCanvasTrigger` implementovaný
- [ ] TypeScript typy pre CanvasTrigger
- [ ] Integrácia do ChatPanel a Canvas
- [ ] Graceful fallback ak trigger chýba
- [ ] 4 Playwright testy prechádzajú
- [ ] Dokumentácia pre backend tím
