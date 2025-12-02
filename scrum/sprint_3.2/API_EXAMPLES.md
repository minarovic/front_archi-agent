# Backend API Examples for Frontend

**Backend:** https://practical-quietude-production.up.railway.app
**WebSocket:** `wss://practical-quietude-production.up.railway.app/ws/{session_id}`
**Last Updated:** 2025-12-02

---

## 🔌 WebSocket Connection

### JavaScript Example

```javascript
// Connect to WebSocket
const sessionId = crypto.randomUUID();
const ws = new WebSocket(`wss://practical-quietude-production.up.railway.app/ws/${sessionId}`);

ws.onopen = () => {
  console.log('✅ Connected to backend');

  // Send message
  ws.send(JSON.stringify({
    content: "Show ER diagram for the schema"
  }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('📨 Received:', message);

  // Handle different message types
  switch (message.type) {
    case 'user':
      // Echo of user's message
      break;
    case 'agent_partial':
      // Streaming response (update UI progressively)
      break;
    case 'agent':
      // Final response (with canvas_trigger, diagram, metrics)
      handleAgentResponse(message);
      break;
    case 'tool':
      // Tool execution log
      break;
    case 'error':
      console.error('Backend error:', message.content);
      break;
  }
};

ws.onerror = (error) => {
  console.error('❌ WebSocket error:', error);
};

ws.onclose = () => {
  console.log('🔌 Connection closed');
};
```

### TypeScript React Hook Example

```typescript
// src/hooks/useWebSocket.ts
import { useEffect, useState, useCallback } from 'react';
import type { WebSocketMessage } from '../types';

export function useWebSocket(sessionId: string) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const websocket = new WebSocket(
      `wss://practical-quietude-production.up.railway.app/ws/${sessionId}`
    );

    websocket.onopen = () => {
      console.log('✅ Connected');
      setIsConnected(true);
    };

    websocket.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);

      if (message.type === 'agent_partial') {
        // Update last message with streaming content
        setMessages(prev => {
          const newMessages = [...prev];
          const lastIdx = newMessages.findIndex(m => m.type === 'agent_partial');
          if (lastIdx >= 0) {
            newMessages[lastIdx] = message;
          } else {
            newMessages.push(message);
          }
          return newMessages;
        });
      } else {
        // Add new message, remove any partial
        setMessages(prev => [
          ...prev.filter(m => m.type !== 'agent_partial'),
          message
        ]);
      }
    };

    websocket.onclose = () => {
      console.log('🔌 Disconnected');
      setIsConnected(false);
    };

    setWs(websocket);

    return () => websocket.close();
  }, [sessionId]);

  const sendMessage = useCallback((content: string) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ content }));
    }
  }, [ws]);

  return { messages, sendMessage, isConnected };
}
```

---

## 📨 Message Types & Examples

### 1. User Message (Echo)

**What:** Backend echoes user's message back

```json
{
  "type": "user",
  "content": "Show ER diagram for the schema",
  "timestamp": "2025-12-02T15:30:00"
}
```

**Frontend Action:** Display in chat as user message

---

### 2. Agent Response (Final)

**What:** Complete agent response with enrichments

```json
{
  "type": "agent",
  "content": "Generated ER diagram for factv_purchase_order_item. The table has 10 columns including supplier_id FK to dimv_supplier.\n\n📊 **Diagram shows 1 relationship** between factv_purchase_order_item and dimv_supplier.",
  "timestamp": "2025-12-02T15:30:15",

  "canvas_trigger": {
    "action": "switch_view",
    "view_type": "er_diagram",
    "confidence": 0.95,
    "reason": "📊 Switching to ER diagram view"
  },

  "diagram": "erDiagram\n  factv_purchase_order_item ||--o{ dimv_supplier : \"references\"\n  factv_purchase_order_item {\n    int order_id PK\n    int item_id PK\n    int supplier_id FK\n    decimal quantity\n    decimal unit_price\n  }\n  dimv_supplier {\n    int supplier_id PK\n    string supplier_name\n    string country\n  }",

  "metrics": {
    "total_tables": 8,
    "total_columns": 44,
    "facts_count": 3,
    "dimensions_count": 2,
    "relationships_count": 1,
    "as_of": "2025-12-02T15:30:00"
  }
}
```

**Frontend Actions:**
1. Display `content` in chat
2. If `canvas_trigger.confidence >= 0.6` → switch Canvas view
3. Render `diagram` in Mermaid component
4. Update MetricsHeader with `metrics`

---

### 3. Agent Partial Response (Streaming)

**What:** Incremental response updates (ChatGPT-like streaming)

```json
{
  "type": "agent_partial",
  "content": "Generated ER diagram for factv_purchase_order_item. The table has"
}
```

```json
{
  "type": "agent_partial",
  "content": "Generated ER diagram for factv_purchase_order_item. The table has 10 columns including"
}
```

```json
{
  "type": "agent_partial",
  "content": "Generated ER diagram for factv_purchase_order_item. The table has 10 columns including supplier_id FK to dimv_supplier."
}
```

**Frontend Action:** Update last message progressively (typewriter effect)

---

### 4. Tool Execution Log

**What:** Backend tool calls (optional, for debugging)

```json
{
  "type": "tool",
  "content": "[{\"name\": \"factv_purchase_order_item\", \"type\": \"FACT\", \"columns\": 10}]",
  "tool_name": "list_tables",
  "timestamp": "2025-12-02T15:30:12"
}
```

**Frontend Action:** Optional - show in debug panel or skip

---

### 5. Error Response

**What:** Backend error (e.g., LLM timeout, validation error)

```json
{
  "type": "error",
  "content": "Agent error: Connection timeout after 30s",
  "timestamp": "2025-12-02T15:30:45"
}
```

**Frontend Action:** Display error message in chat with red styling

---

## 🎨 Canvas Trigger Scenarios

### Scenario 1: Diagram Request → Auto-switch to Diagram View

**User Query:** `"Show ER diagram"`

**Backend Response:**
```json
{
  "type": "agent",
  "content": "Generated ER diagram showing 5 tables and their relationships.",
  "canvas_trigger": {
    "action": "switch_view",
    "view_type": "er_diagram",
    "confidence": 0.95,
    "reason": "📊 Switching to ER diagram view"
  },
  "diagram": "erDiagram\n  ..."
}
```

**Frontend Logic:**
```typescript
if (message.canvas_trigger?.confidence >= 0.6) {
  // Auto-switch view
  setCurrentView(message.canvas_trigger.view_type);
}
```

---

### Scenario 2: Table List Request → Auto-switch to Table List View

**User Query:** `"List all tables"`

**Backend Response:**
```json
{
  "type": "agent",
  "content": "Found 8 tables: 3 FACT tables, 2 DIMENSION tables...",
  "canvas_trigger": {
    "action": "switch_view",
    "view_type": "table_list",
    "confidence": 0.90,
    "reason": "📋 Switching to table list view"
  }
}
```

**Frontend Action:** Switch Canvas to table list mode

---

### Scenario 3: General Question → No Canvas Switch

**User Query:** `"How many columns does factv_purchase_order have?"`

**Backend Response:**
```json
{
  "type": "agent",
  "content": "The factv_purchase_order table has 15 columns."
}
```

**Frontend Action:** Just display text, no canvas change

---

### Scenario 4: Low Confidence → Manual Override Only

**User Query:** `"Tell me about the data model"`

**Backend Response:**
```json
{
  "type": "agent",
  "content": "The data model consists of...",
  "canvas_trigger": {
    "action": "switch_view",
    "view_type": "er_diagram",
    "confidence": 0.45,
    "reason": "Low confidence - user may want general info"
  },
  "diagram": "erDiagram\n  ..."
}
```

**Frontend Logic:**
```typescript
// Don't auto-switch (confidence < 0.6)
// But user can manually click "Diagram" button to see it
if (message.canvas_trigger?.confidence >= 0.6) {
  setCurrentView(message.canvas_trigger.view_type);
} else {
  console.log('Low confidence, not auto-switching');
}
```

---

## 📊 Metrics Examples

### Full Metrics Response

```json
{
  "metrics": {
    "total_tables": 8,
    "total_columns": 44,
    "facts_count": 3,
    "dimensions_count": 2,
    "relationships_count": 1,
    "schema_name": "dm_bs_purchase",
    "as_of": "2025-12-02T15:30:00",
    "is_stale": false
  }
}
```

**Frontend Display:**
```
📊 8 Tables
📋 44 Columns
🔗 1 Relationships

Updated 3:30 PM
```

---

### Metrics with Null Values (Graceful Fallback)

```json
{
  "metrics": {
    "total_tables": 5,
    "total_columns": 30,
    "facts_count": 2,
    "dimensions_count": 1,
    "quality_score": null,
    "relationships_count": 0,
    "as_of": null
  }
}
```

**Frontend Display:**
```typescript
// Handle nulls gracefully
const qualityScore = metrics.quality_score ?? '—';
const timestamp = metrics.as_of ? formatTime(metrics.as_of) : '';
```

---

## 🔄 Mermaid Diagram Examples

### Example 1: Filtered Diagram (2 Tables)

**User Query:** `"Show relationships for factv_purchase_order_item"`

**Backend Returns:**
```
erDiagram
  factv_purchase_order_item ||--o{ dimv_supplier : "references"

  factv_purchase_order_item {
    int order_id PK
    int item_id PK
    int supplier_id FK
    decimal quantity
    decimal unit_price
  }

  dimv_supplier {
    int supplier_id PK
    string supplier_name
    string country
  }
```

---

### Example 2: Full Schema Diagram (5 Tables)

**User Query:** `"Show schema structure"`

**Backend Returns:**
```
erDiagram
  factv_purchase_order_item ||--o{ dimv_supplier : "references"

  factv_purchase_order {
    int order_id PK
    date order_date
    string status
  }

  factv_purchase_order_item {
    int order_id PK
    int item_id PK
    int supplier_id FK
    decimal quantity
  }

  dimv_supplier {
    int supplier_id PK
    string supplier_name
  }

  dimv_material {
    int material_id PK
    string material_name
  }

  v_purchase_summary {
    int order_id
    decimal total_amount
  }
```

---

## 🧪 Testing the API

### Quick Health Check

```bash
curl https://practical-quietude-production.up.railway.app/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-02T15:30:00"
}
```

---

### WebSocket Test (Node.js)

```javascript
// test-websocket.js
const WebSocket = require('ws');

const ws = new WebSocket('wss://practical-quietude-production.up.railway.app/ws/test-session');

ws.on('open', () => {
  console.log('✅ Connected');

  // Send test message
  ws.send(JSON.stringify({
    content: "Show ER diagram"
  }));
});

ws.on('message', (data) => {
  const message = JSON.parse(data);
  console.log('📨 Received:', message.type);

  if (message.type === 'agent') {
    console.log('✅ Canvas Trigger:', message.canvas_trigger);
    console.log('✅ Diagram:', message.diagram ? 'Present' : 'None');
    console.log('✅ Metrics:', message.metrics);
    ws.close();
  }
});

ws.on('error', (error) => {
  console.error('❌ Error:', error);
});
```

**Run:**
```bash
node test-websocket.js
```

---

### WebSocket Test (Browser Console)

```javascript
// Open browser console on any page and paste:
const ws = new WebSocket('wss://practical-quietude-production.up.railway.app/ws/test-123');

ws.onopen = () => {
  console.log('✅ Connected');
  ws.send(JSON.stringify({ content: "Show ER diagram" }));
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  console.log('📨 Type:', msg.type);

  if (msg.canvas_trigger) {
    console.log('🎨 Canvas Trigger:', msg.canvas_trigger);
  }

  if (msg.diagram) {
    console.log('📊 Diagram length:', msg.diagram.length);
  }

  if (msg.metrics) {
    console.log('📈 Metrics:', msg.metrics);
  }
};
```

---

## 🚨 Error Handling

### Connection Errors

```typescript
ws.onerror = (error) => {
  console.error('WebSocket error:', error);

  // Show user-friendly message
  showToast('Connection error. Please refresh the page.', 'error');
};

ws.onclose = (event) => {
  if (!event.wasClean) {
    console.error('Connection lost');

    // Attempt reconnection
    setTimeout(() => {
      reconnectWebSocket();
    }, 3000);
  }
};
```

---

### Backend Errors

```typescript
if (message.type === 'error') {
  // Display error in chat
  addMessage({
    type: 'error',
    content: message.content,
    timestamp: new Date().toISOString()
  });

  // Log for debugging
  console.error('Backend error:', message.content);
}
```

---

### Timeout Handling

```typescript
let responseTimeout: NodeJS.Timeout;

function sendMessage(content: string) {
  ws.send(JSON.stringify({ content }));

  // Set 30s timeout
  responseTimeout = setTimeout(() => {
    addMessage({
      type: 'error',
      content: 'Request timeout. Please try again.',
      timestamp: new Date().toISOString()
    });
  }, 30000);
}

// Clear timeout when response arrives
ws.onmessage = (event) => {
  clearTimeout(responseTimeout);
  // ... handle message
};
```

---

## 🔗 Backend Source Code References

| Feature                  | Backend File                                  |
| ------------------------ | --------------------------------------------- |
| WebSocket Handler        | `src/api/main.py` (line 550+)                 |
| Canvas Trigger Detection | `src/api/websocket_enrichment.py` (line 45+)  |
| Diagram Generation       | `src/api/websocket_enrichment.py` (line 200+) |
| Metrics Generation       | `src/api/websocket_enrichment.py` (line 150+) |
| Pydantic Models          | `src/api/websocket_enrichment.py` (line 10+)  |

---

## 📚 Additional Resources

- **Backend Repo:** https://github.com/minarovic/archi-agent
- **Backend Docs:** `/Users/marekminarovic/archi-agent/docs_pydantic/websocket-enrichment.md`
- **Architecture:** `/Users/marekminarovic/archi-agent/scrum/architecture/canvas-trigger-backend.md`
- **Tests:** `/Users/marekminarovic/archi-agent/tests/test_websocket_enrichment.py` (23 tests)

---

**Last Verified:** 2025-12-02
**Backend Version:** Sprint 2 (commits: 779e619, 5e82c99, bb66c9d, 514a365, daa0559)
