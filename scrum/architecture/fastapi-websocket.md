# FastAPI WebSocket Implementation

Tento dokument popisuje implementáciu WebSocket endpointu pre real-time chat s Explorer Agent-om.

## Základný vzor

### WebSocket Endpoint

```python
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import json

app = FastAPI()

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for real-time chat."""
    await websocket.accept()

    try:
        while True:
            # Receive message from client
            data = await websocket.receive_json()
            user_message = data.get("content", "")

            # Process and respond
            response = await process_message(session_id, user_message)
            await websocket.send_json(response)

    except WebSocketDisconnect:
        # Client disconnected
        cleanup_session(session_id)
```

## MCOP WebSocket Implementation

### Complete Handler

```python
# src/api/websocket.py
from fastapi import WebSocket, WebSocketDisconnect
from typing import Optional
import json

from src.explorer.agent import explorer_agent, ExplorerDeps
from src.explorer.mock_client import CollibraAPIMock

class ConnectionManager:
    """Manage WebSocket connections."""

    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, session_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[session_id] = websocket

    def disconnect(self, session_id: str):
        if session_id in self.active_connections:
            del self.active_connections[session_id]

    async def send_message(self, session_id: str, message: dict):
        if session_id in self.active_connections:
            await self.active_connections[session_id].send_json(message)

manager = ConnectionManager()
collibra_client = CollibraAPIMock()

async def handle_websocket(websocket: WebSocket, session_id: str):
    """Handle WebSocket chat session."""
    await manager.connect(session_id, websocket)

    deps = ExplorerDeps(collibra=collibra_client, session_id=session_id)

    try:
        while True:
            # Receive user message
            data = await websocket.receive_json()
            user_message = data.get("content", "")

            if not user_message:
                continue

            # Echo user message back
            await websocket.send_json({
                "type": "user",
                "content": user_message
            })

            # Run agent with streaming
            try:
                async with explorer_agent.run_stream(user_message, deps=deps) as stream:
                    # Stream partial responses
                    buffer = ""
                    async for chunk in stream.stream_text():
                        buffer += chunk
                        await websocket.send_json({
                            "type": "agent_partial",
                            "content": buffer
                        })

                    # Send final response
                    result = await stream.get_data()
                    await websocket.send_json({
                        "type": "agent",
                        "content": result
                    })

            except Exception as e:
                await websocket.send_json({
                    "type": "error",
                    "content": f"Agent error: {str(e)}"
                })

    except WebSocketDisconnect:
        manager.disconnect(session_id)
```

### Integration with FastAPI

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

## Message Protocol

### Client → Server

```json
{
  "content": "List all tables"
}
```

### Server → Client

#### User Echo
```json
{
  "type": "user",
  "content": "List all tables"
}
```

#### Partial Response (streaming)
```json
{
  "type": "agent_partial",
  "content": "Here are the available tables:\n\n1. "
}
```

#### Final Response
```json
{
  "type": "agent",
  "content": "Here are the available tables:\n\n1. fact_bs_purchase_order (FACT)\n2. dimv_bs_supplier (DIMENSION)\n..."
}
```

#### Tool Usage (optional)
```json
{
  "type": "tool",
  "content": "[{\"name\": \"fact_bs_purchase_order\", \"type\": \"FACT\"}]",
  "tool_name": "list_tables"
}
```

#### Error
```json
{
  "type": "error",
  "content": "Agent error: Connection timeout"
}
```

## Frontend Integration

### React Hook

```typescript
// src/hooks/useWebSocket.ts
import { useCallback, useEffect, useRef, useState } from 'react';

interface Message {
  type: 'user' | 'agent' | 'agent_partial' | 'tool' | 'error';
  content: string;
  tool_name?: string;
}

export function useWebSocket(sessionId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${sessionId}`);
    wsRef.current = ws;

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);

    ws.onmessage = (event) => {
      const data: Message = JSON.parse(event.data);

      if (data.type === 'agent_partial') {
        // Update last partial message
        setMessages(prev => {
          const newMessages = [...prev];
          const partialIdx = newMessages.findIndex(m => m.type === 'agent_partial');
          if (partialIdx >= 0) {
            newMessages[partialIdx] = data;
          } else {
            newMessages.push(data);
          }
          return newMessages;
        });
      } else {
        // Replace partial with final or add new message
        setMessages(prev => [
          ...prev.filter(m => m.type !== 'agent_partial'),
          data
        ]);
      }
    };

    return () => ws.close();
  }, [sessionId]);

  const sendMessage = useCallback((content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ content }));
    }
  }, []);

  return { isConnected, messages, sendMessage };
}
```

### Usage in Component

```tsx
function ChatComponent() {
  const { isConnected, messages, sendMessage } = useWebSocket('my-session');
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div>
      <div className="status">
        {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>

      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.type}`}>
            {msg.content}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
```

## Connection Handling

### Heartbeat / Keep-Alive

```python
import asyncio

async def heartbeat_handler(websocket: WebSocket, session_id: str):
    """Send periodic heartbeats to keep connection alive."""
    try:
        while True:
            await asyncio.sleep(30)  # Every 30 seconds
            await websocket.send_json({"type": "ping"})
    except Exception:
        pass  # Connection closed
```

### Reconnection (Client-side)

```typescript
class ReconnectingWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(url: string) {
    this.ws = new WebSocket(url);

    this.ws.onclose = () => {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect(url);
        }, delay);
      }
    };

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
    };
  }
}
```

## Testing

### Unit Test

```python
import pytest
from fastapi.testclient import TestClient
from src.api.main import app

def test_websocket_connection():
    """Test WebSocket can connect."""
    client = TestClient(app)

    with client.websocket_connect("/ws/test-session") as websocket:
        # Send message
        websocket.send_json({"content": "Hello"})

        # Should receive echo
        data = websocket.receive_json()
        assert data["type"] == "user"
        assert data["content"] == "Hello"
```

### Integration Test

```python
@pytest.mark.asyncio
async def test_agent_response():
    """Test agent responds to query."""
    import websockets

    async with websockets.connect("ws://localhost:8000/ws/test") as ws:
        await ws.send(json.dumps({"content": "List all tables"}))

        # Collect all responses
        responses = []
        while True:
            try:
                data = await asyncio.wait_for(ws.recv(), timeout=10)
                responses.append(json.loads(data))
                if responses[-1]["type"] == "agent":
                    break
            except asyncio.TimeoutError:
                break

        # Should have at least user echo and agent response
        assert len(responses) >= 2
        assert any(r["type"] == "agent" for r in responses)
```

## Error Handling

### Server-side

```python
from fastapi import WebSocketException

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    try:
        await websocket.accept()

        # Validate session
        if not is_valid_session(session_id):
            await websocket.close(code=4001, reason="Invalid session")
            return

        # Handle messages
        while True:
            try:
                data = await websocket.receive_json()
                # Process...
            except ValueError:
                await websocket.send_json({
                    "type": "error",
                    "content": "Invalid JSON format"
                })

    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.close(code=1011, reason=str(e))
```

### Client-side

```typescript
ws.onerror = (error) => {
  console.error('WebSocket error:', error);
  setError('Connection error. Please refresh the page.');
};

ws.onclose = (event) => {
  if (event.code === 4001) {
    setError('Invalid session. Please start a new chat.');
  } else if (!event.wasClean) {
    setError('Connection lost. Attempting to reconnect...');
  }
};
```

## Security Considerations

### CORS for WebSocket

```python
# WebSocket doesn't use CORS, but check Origin header
@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    origin = websocket.headers.get("origin", "")
    allowed_origins = ["http://localhost:3000", "https://your-app.vercel.app"]

    if origin not in allowed_origins:
        await websocket.close(code=4003, reason="Origin not allowed")
        return

    await websocket.accept()
    # ...
```

### Rate Limiting

```python
from collections import defaultdict
import time

rate_limits: dict[str, list[float]] = defaultdict(list)

async def check_rate_limit(session_id: str, max_messages: int = 20, window: int = 60):
    """Check if session is within rate limits."""
    now = time.time()
    timestamps = rate_limits[session_id]

    # Remove old timestamps
    rate_limits[session_id] = [t for t in timestamps if now - t < window]

    if len(rate_limits[session_id]) >= max_messages:
        return False

    rate_limits[session_id].append(now)
    return True
```

## Referencie

- [FastAPI WebSocket](https://fastapi.tiangolo.com/advanced/websockets/)
- [Starlette WebSocket](https://www.starlette.io/websockets/)
- [RFC 6455 - WebSocket Protocol](https://tools.ietf.org/html/rfc6455)
