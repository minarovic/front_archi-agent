# WebSocket Streaming Implementation

Tento dokument popisuje WebSocket real-time komunikáciu medzi Pydantic AI agentom a React frontendom, vrátane streaming odpovedí.

## Čo je WebSocket?

**HTTP (klasický request/response):**
- Klient pošle request → Server odpovie → Koniec spojenia
- Pre každú správu treba nové spojenie
- Unidirectional (jednosmerný): len klient iniciuje komunikáciu

**WebSocket (persistent bidirectional connection):**
- Klient vytvorí spojenie → Spojenie zostane otvorené
- Obe strany môžu kedykoľvek posielať správy
- Bidirectional (obojsmerný): server aj klient môžu iniciovať
- Ideálne pre real-time chat, streaming responses

## Kompletný tok komunikácie

### Vizualizácia toku

Pre detailný sequence diagram s časovou postupnosťou, pozri [04-sequence-diagram.md](../diagramy/04-sequence-diagram.md).

### Scenár: "Show me all tables"

```
1. User → React: Types "Show me all tables"
   ↓
2. React → WebSocket: send({"content": "Show me all tables"})
   ↓
3. WebSocket → FastAPI: Message received
   ↓
4. FastAPI → Explorer Agent: run_stream(query, deps)
   ↓
5. Explorer Agent → Azure OpenAI: LLM request
   ↓
6. Azure OpenAI → Explorer Agent: Token stream starts
   ↓
7. Explorer Agent → FastAPI: stream.stream_text() chunk 1: "Here"
   ↓
8. FastAPI → WebSocket: {"type": "agent_partial", "content": "Here"}
   ↓
9. WebSocket → React: onmessage event
   ↓
10. React → User: Display "Here" (partial message)
    ↓
11. [Repeat steps 7-10 for each token chunk]
    ↓
12. Explorer Agent → Mock Collibra: list_tables() tool call
    ↓
13. Mock Collibra → Explorer Agent: [table data]
    ↓
14. Explorer Agent → FastAPI: Final response with complete text
    ↓
15. FastAPI → WebSocket: {"type": "agent", "content": "Complete answer..."}
    ↓
16. WebSocket → React: onmessage event
    ↓
17. React → User: Replace partial with final complete message
```

## Backend Implementation (FastAPI + Pydantic AI)

### WebSocket Handler s Streaming

```python
# src/api/websocket.py
from fastapi import WebSocket, WebSocketDisconnect
from src.explorer.agent import explorer_agent, ExplorerDeps
from src.explorer.mock_client import CollibraAPIMock

class ConnectionManager:
    """Manage active WebSocket connections."""

    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, session_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[session_id] = websocket

    async def send_message(self, session_id: str, message: dict):
        if session_id in self.active_connections:
            await self.active_connections[session_id].send_json(message)

manager = ConnectionManager()
collibra_client = CollibraAPIMock()

async def handle_websocket(websocket: WebSocket, session_id: str):
    """Handle WebSocket chat with streaming responses."""
    await manager.connect(session_id, websocket)

    deps = ExplorerDeps(collibra=collibra_client, session_id=session_id)

    try:
        while True:
            # 1. Receive user message
            data = await websocket.receive_json()
            user_message = data.get("content", "")

            if not user_message:
                await websocket.send_json({
                    "type": "error",
                    "content": "Empty message"
                })
                continue

            # 2. Echo user message back to UI
            await websocket.send_json({
                "type": "user",
                "content": user_message
            })

            # 3. Run agent with streaming
            try:
                async with explorer_agent.run_stream(user_message, deps=deps) as stream:
                    # 4. Stream partial responses (ChatGPT-like effect)
                    buffer = ""
                    async for chunk in stream.stream_text():
                        buffer += chunk
                        await websocket.send_json({
                            "type": "agent_partial",
                            "content": buffer
                        })

                    # 5. Send final complete response
                    result = await stream.get_data()
                    await websocket.send_json({
                        "type": "agent",
                        "content": result.response  # Pydantic AI response model
                    })

            except Exception as e:
                await websocket.send_json({
                    "type": "error",
                    "content": f"Agent error: {str(e)}"
                })

    except WebSocketDisconnect:
        manager.disconnect(session_id)
```

### FastAPI Endpoint

```python
# src/api/main.py
from fastapi import FastAPI, WebSocket
from .websocket import handle_websocket

app = FastAPI()

@app.websocket("/ws/{session_id}")
async def websocket_chat(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for Explorer Agent chat."""
    await handle_websocket(websocket, session_id)
```

### Pydantic AI Agent s run_stream()

```python
# src/explorer/agent.py
from pydantic_ai import Agent, RunContext
from dataclasses import dataclass

@dataclass
class ExplorerDeps:
    collibra: CollibraAPIMock
    session_id: str

explorer_agent = Agent(
    "gpt-5-mini",
    deps_type=ExplorerDeps,
    system_prompt="You are a metadata explorer assistant."
)

@explorer_agent.tool
async def list_tables(ctx: RunContext[ExplorerDeps]) -> list[dict]:
    """List all available tables."""
    return await ctx.deps.collibra.list_tables()

# Agent má automaticky run_stream() metódu:
# - async with agent.run_stream(query, deps=deps) as stream
# - stream.stream_text() → AsyncIterator[str] (token po tokene)
# - stream.get_data() → Result object s kompletnou odpoveďou
```

## Frontend Implementation (React + WebSocket)

### Custom Hook s Progressive Update

```typescript
// src/hooks/useWebSocket.ts
import { useEffect, useRef, useState } from 'react';

interface Message {
  type: 'user' | 'agent' | 'agent_partial' | 'tool' | 'error';
  content: string;
  diagram?: string;  // Optional Mermaid diagram
  tool_name?: string;
}

export function useWebSocket(sessionId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${sessionId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    ws.onmessage = (event) => {
      const data: Message = JSON.parse(event.data);

      if (data.type === 'agent_partial') {
        // Update partial message incrementally (ChatGPT typing effect)
        setMessages(prev => {
          const newMessages = [...prev];
          const partialIdx = newMessages.findIndex(m => m.type === 'agent_partial');

          if (partialIdx >= 0) {
            // Replace existing partial
            newMessages[partialIdx] = data;
          } else {
            // Add new partial
            newMessages.push(data);
          }

          return newMessages;
        });
      } else if (data.type === 'agent') {
        // Replace partial with final complete message
        setMessages(prev => [
          ...prev.filter(m => m.type !== 'agent_partial'),
          data
        ]);

        // If response has diagram, update Canvas
        if (data.diagram) {
          // Trigger Canvas update (handled by parent component)
        }
      } else {
        // Add other message types (user, tool, error)
        setMessages(prev => [...prev, data]);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => ws.close();
  }, [sessionId]);

  const sendMessage = (content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ content }));
    }
  };

  return { isConnected, messages, sendMessage };
}
```

### Chat Component s Typing Effect

```tsx
// src/components/Chat.tsx
import { useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

export function Chat() {
  const sessionId = 'user-session-123';  // Generate UUID on mount
  const { isConnected, messages, sendMessage } = useWebSocket(sessionId);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      {/* Connection Status */}
      <div className="status-bar">
        {isConnected ? (
          <span>🟢 Connected</span>
        ) : (
          <span>🔴 Disconnected</span>
        )}
      </div>

      {/* Messages */}
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.type}`}>
            {msg.type === 'user' && (
              <div className="user-message">{msg.content}</div>
            )}

            {msg.type === 'agent_partial' && (
              <div className="agent-message typing">
                {msg.content}
                <span className="cursor">▊</span>
              </div>
            )}

            {msg.type === 'agent' && (
              <div className="agent-message">{msg.content}</div>
            )}

            {msg.type === 'tool' && (
              <div className="tool-message">
                🔧 {msg.tool_name}: {msg.content}
              </div>
            )}

            {msg.type === 'error' && (
              <div className="error-message">❌ {msg.content}</div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="input-container">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about metadata..."
          disabled={!isConnected}
        />
        <button onClick={handleSend} disabled={!isConnected}>
          Send
        </button>
      </div>
    </div>
  );
}
```

### Canvas Component s Automatic Diagram Update

```tsx
// src/components/Canvas.tsx
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface CanvasProps {
  diagram: string | null;  // Mermaid diagram code
}

export function Canvas({ diagram }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (diagram && containerRef.current) {
      // Render Mermaid diagram
      mermaid.render('canvas-diagram', diagram).then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      });
    }
  }, [diagram]);

  if (!diagram) {
    return (
      <div className="canvas-empty">
        <p>No diagram to display. Ask agent to show relationships!</p>
      </div>
    );
  }

  return (
    <div className="canvas-container">
      <div ref={containerRef} className="mermaid-diagram" />
    </div>
  );
}
```

### Main App Component

```tsx
// src/App.tsx
import { useState } from 'react';
import { Chat } from './components/Chat';
import { Canvas } from './components/Canvas';

export function App() {
  const [currentDiagram, setCurrentDiagram] = useState<string | null>(null);

  // Listen to messages from Chat and extract diagram
  const handleDiagramUpdate = (diagram: string) => {
    setCurrentDiagram(diagram);
  };

  return (
    <div className="app-layout">
      <div className="chat-panel">
        <Chat onDiagramUpdate={handleDiagramUpdate} />
      </div>
      <div className="canvas-panel">
        <Canvas diagram={currentDiagram} />
      </div>
    </div>
  );
}
```

## Message Protocol Detail

### Client → Server (User Query)

```json
{
  "content": "Show me all tables"
}
```

### Server → Client (Response Types)

#### 1. User Echo

```json
{
  "type": "user",
  "content": "Show me all tables"
}
```

#### 2. Partial Response (Multiple, Streaming)

```json
{
  "type": "agent_partial",
  "content": "Here"
}
```

```json
{
  "type": "agent_partial",
  "content": "Here are"
}
```

```json
{
  "type": "agent_partial",
  "content": "Here are the available tables:\n\n1. "
}
```

#### 3. Tool Execution (Optional)

```json
{
  "type": "tool",
  "content": "[{\"name\": \"fact_bs_purchase\", \"type\": \"FACT\"}]",
  "tool_name": "list_tables"
}
```

#### 4. Final Response

```json
{
  "type": "agent",
  "content": "Here are the available tables:\n\n1. fact_bs_purchase_order (FACT)\n2. dimv_bs_supplier (DIMENSION)\n...",
  "diagram": null
}
```

#### 5. Response with Diagram

```json
{
  "type": "agent",
  "content": "Here is the ER diagram showing relationships...",
  "diagram": "erDiagram\n  fact_bs_purchase ||--o{ dimv_bs_supplier : has\n..."
}
```

#### 6. Error

```json
{
  "type": "error",
  "content": "Agent error: Connection timeout"
}
```

## Prečo WebSocket a nie HTTP?

### HTTP Polling (zlý prístup)

```typescript
// ❌ BAD: Client musí stále pýtať "je už odpoveď?"
setInterval(() => {
  fetch('/api/check-response')
    .then(res => res.json())
    .then(data => {
      if (data.ready) {
        // Finally got response after 5 seconds!
      }
    });
}, 1000);  // Check every second
```

**Problémy:**
- Zbytočné requesty každú sekundu
- Latencia (response je ready, ale client zistí až o 1s)
- Neefektívne (10 requestov kým príde 1 odpoveď)

### WebSocket (správny prístup)

```typescript
// ✅ GOOD: Server pošle hneď ako má token
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  displayMessage(data.content);  // Instant update!
};
```

**Výhody:**
- Okamžité doručenie (no polling delay)
- Bidirectional (server aj client môžu posielať)
- Efektívne (jedno spojenie pre všetky správy)
- Streaming (postupné zobrazovanie odpovede ako ChatGPT)

## Async a Streaming

### Je komunikácia async ako ChatGPT?

**ÁNO!** Presne rovnaký mechanizmus:

1. **User odošle query** → WebSocket.send()
2. **Server začne spracovávať** → Agent calls LLM
3. **LLM generuje token po tokene** → "Here", "are", "the", "tables"
4. **Server streamuje každý token hneď** → WebSocket partial messages
5. **React zobrazuje progressívne** → User vidí text ako sa píše
6. **Finálna správa** → Complete response replaces partial

### Príklad časovej osi

```
| Time | Backend                         | Frontend Display      |
| ---- | ------------------------------- | --------------------- |
| 0s   | User sends "Show tables"        | "Show tables" ⏎       |
| 0.1s | Agent starts LLM request        | ...                   |
| 0.5s | LLM token 1: "Here"             | "Here"                |
| 0.6s | LLM token 2: " are"             | "Here are"            |
| 0.7s | LLM token 3: " the"             | "Here are the"        |
| 0.8s | LLM token 4: " tables"          | "Here are the tables" |
| 1.0s | Tool call: list_tables()        | "Here are the tables" |
| 1.2s | Tool returns data               | "Here are the tables" |
| 1.5s | LLM tokens 5-10: ":\n\n1. fact" | "... :\n\n1. fact"    |
| 2.0s | Final response                  | Complete answer       |
```

### Code Flow Detail

**Backend (Pydantic AI):**
```python
async with explorer_agent.run_stream(user_message, deps=deps) as stream:
    # stream.stream_text() je AsyncIterator[str]
    async for chunk in stream.stream_text():
        # chunk = "Here", "are", "the", atď.
        await websocket.send_json({
            "type": "agent_partial",
            "content": accumulated_text + chunk
        })
```

**Frontend (React):**
```typescript
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === 'agent_partial') {
    // Update display progressively
    setMessages(prev => {
      const newMessages = [...prev];
      const lastIndex = newMessages.findIndex(m => m.type === 'agent_partial');

      if (lastIndex >= 0) {
        newMessages[lastIndex].content = data.content;  // Update
      } else {
        newMessages.push(data);  // Add new
      }

      return newMessages;
    });
  }
};
```

## Canvas Integration

### Kedy sa Canvas updatuje?

**Agent môže poslať diagram v hociktorej odpovedi:**

```json
{
  "type": "agent",
  "content": "Here is the ER diagram...",
  "diagram": "erDiagram\n  fact ||--o{ dim : has"
}
```

**Frontend automaticky zobrazí:**
```typescript
if (data.type === 'agent' && data.diagram) {
  setCurrentDiagram(data.diagram);  // Canvas rerender
}
```

### Workflow: User → Diagram

1. User: "Show relationships between fact_bs_purchase and suppliers"
2. Agent: Rozpozná intent → Tool call `find_relationships()`
3. Tool: Vráti FK data z Mock Collibra
4. Agent: Vygeneruje Mermaid ER diagram
5. Backend: Pošle `{"type": "agent", "diagram": "erDiagram..."}`
6. React: Extrahuje `diagram` field → `<Canvas diagram={...} />`
7. Mermaid: `mermaid.render()` → SVG graf
8. User: Vidí vizualizáciu v Canvas paneli

## Error Handling & Reconnection

### Connection Lost Handling

```typescript
// Frontend reconnection logic
const MAX_RETRIES = 5;
let retryCount = 0;

ws.onclose = () => {
  setIsConnected(false);

  if (retryCount < MAX_RETRIES) {
    const delay = Math.min(1000 * 2 ** retryCount, 30000);  // Exponential backoff
    console.log(`Reconnecting in ${delay}ms...`);

    setTimeout(() => {
      retryCount++;
      connectWebSocket();  // Retry
    }, delay);
  } else {
    setError('Connection failed after 5 retries. Please refresh the page.');
  }
};

ws.onopen = () => {
  retryCount = 0;  // Reset on success
  setIsConnected(true);
};
```

### Agent Timeout Handling

```python
# Backend timeout protection
import asyncio

try:
    async with asyncio.timeout(30):  # 30 second timeout
        async with explorer_agent.run_stream(query, deps=deps) as stream:
            async for chunk in stream.stream_text():
                await websocket.send_json({
                    "type": "agent_partial",
                    "content": chunk
                })
except asyncio.TimeoutError:
    await websocket.send_json({
        "type": "error",
        "content": "Request timeout (30s). Please try a simpler query."
    })
```

## Testing

### Backend WebSocket Test

```python
import pytest
from fastapi.testclient import TestClient

def test_websocket_streaming():
    """Test agent streams partial responses."""
    client = TestClient(app)

    with client.websocket_connect("/ws/test-session") as ws:
        # Send query
        ws.send_json({"content": "List tables"})

        # Collect all responses
        responses = []
        while True:
            data = ws.receive_json()
            responses.append(data)

            if data["type"] == "agent":
                break  # Final response

        # Should have: user echo + N partials + final
        assert any(r["type"] == "user" for r in responses)
        assert any(r["type"] == "agent_partial" for r in responses)
        assert responses[-1]["type"] == "agent"
```

### Frontend Hook Test

```typescript
import { renderHook, act } from '@testing-library/react';
import { useWebSocket } from './useWebSocket';

test('should accumulate partial messages', () => {
  const { result } = renderHook(() => useWebSocket('test-session'));

  // Simulate partial messages
  act(() => {
    mockWebSocket.trigger('message', {
      data: JSON.stringify({ type: 'agent_partial', content: 'Here' })
    });
  });

  expect(result.current.messages).toHaveLength(1);
  expect(result.current.messages[0].content).toBe('Here');

  act(() => {
    mockWebSocket.trigger('message', {
      data: JSON.stringify({ type: 'agent_partial', content: 'Here are' })
    });
  });

  expect(result.current.messages).toHaveLength(1);  // Still 1 message
  expect(result.current.messages[0].content).toBe('Here are');  // Updated
});
```

## Deployment Considerations

### Production WebSocket URL

```typescript
const WS_URL = process.env.NODE_ENV === 'production'
  ? 'wss://mcop-backend.railway.app/ws'
  : 'ws://localhost:8000/ws';
```

### CORS (Not needed for WebSocket, but check Origin)

```python
@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    origin = websocket.headers.get("origin", "")
    allowed = ["http://localhost:3000", "https://mcop.vercel.app"]

    if origin not in allowed:
        await websocket.close(code=4003, reason="Origin not allowed")
        return

    await websocket.accept()
```

### Railway WebSocket Support

Railway automatically supports WebSocket connections:
- No extra configuration needed
- Uses same domain as HTTP
- Supports wss:// (WebSocket Secure)

## Referencie

- **Diagram:** [04-sequence-diagram.md](../diagramy/04-sequence-diagram.md) - Detailná vizualizácia WebSocket toku
- **State Machines:** [05-state-diagram.md](../diagramy/05-state-diagram.md) - Connection states
- [FastAPI WebSocket](https://fastapi.tiangolo.com/advanced/websockets/)
- [Pydantic AI Streaming](https://ai.pydantic.dev/streaming/)
- [MDN WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
