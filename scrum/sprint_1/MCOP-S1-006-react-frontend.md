---
id: MCOP-S1-006
type: story
status: planned
priority: should-have
updated: 2025-11-30
sprint: sprint_1
effort: 10-14 hours
depends_on: [MCOP-S1-005]
blocks: []
---

# React Frontend s Chat a Canvas

## Brief
Vytvor React frontend aplikáciu s dvoma hlavnými komponentmi:
1. **Chat Panel** - Komunikácia s Explorer Agent cez WebSocket
2. **Canvas Panel** - Zobrazenie Mermaid ER diagramov

## Business Value
- Používateľský interface pre interakciu s MCOP
- Vizualizácia metadata relationships
- Real-time streaming odpovedí z agenta
- Základ pre production UI

## Acceptance Criteria

- [ ] `frontend/` adresár s React aplikáciou (Vite + TypeScript)
- [ ] Komponenty:
  - [ ] `ChatPanel` - WebSocket chat s agentom
  - [ ] `Canvas` - Mermaid diagram rendering
  - [ ] `Layout` - Split view (chat vlavo, canvas vpravo)
  - [ ] `MessageList` - História správ
  - [ ] `MessageInput` - Input field + send button
- [ ] WebSocket pripojenie k `/ws/{session_id}`
- [ ] Mermaid diagram sa renderuje automaticky po prijatí
- [ ] Streaming text sa zobrazuje postupne (typing effect)
- [ ] Loading states a error handling
- [ ] Responsive layout (desktop first)
- [ ] Test `npm test` prechádza
- [ ] Deployed na Vercel (staging)

## Technical Notes

### Project Setup
```bash
# Create Vite React TypeScript project
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install

# Install dependencies
npm install mermaid @types/mermaid
npm install zustand  # State management
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── ChatPanel.tsx
│   │   ├── Canvas.tsx
│   │   ├── Layout.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageInput.tsx
│   │   └── MermaidDiagram.tsx
│   ├── hooks/
│   │   ├── useWebSocket.ts
│   │   └── useSession.ts
│   ├── store/
│   │   └── chatStore.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

### Types
```typescript
// src/types/index.ts
export interface Message {
  id: string;
  type: 'user' | 'agent' | 'agent_partial' | 'tool' | 'error';
  content: string;
  timestamp: Date;
  toolName?: string;
}

export interface SessionState {
  sessionId: string | null;
  isConnected: boolean;
  messages: Message[];
  diagram: string | null;
  isLoading: boolean;
  error: string | null;
}
```

### WebSocket Hook
```typescript
// src/hooks/useWebSocket.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { Message } from '../types';

interface UseWebSocketOptions {
  sessionId: string;
  onMessage: (message: Message) => void;
  onDiagram?: (diagram: string) => void;
}

export function useWebSocket({ sessionId, onMessage, onDiagram }: UseWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:8000'}/ws/${sessionId}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Check for diagram in response
      if (data.diagram && onDiagram) {
        onDiagram(data.diagram);
      }

      const message: Message = {
        id: crypto.randomUUID(),
        type: data.type,
        content: data.content,
        timestamp: new Date(),
        toolName: data.tool_name,
      };

      onMessage(message);
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [sessionId, onMessage, onDiagram]);

  const sendMessage = useCallback((content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ content }));
    }
  }, []);

  return { isConnected, sendMessage };
}
```

### Zustand Store
```typescript
// src/store/chatStore.ts
import { create } from 'zustand';
import { Message, SessionState } from '../types';

interface ChatStore extends SessionState {
  initSession: () => void;
  addMessage: (message: Message) => void;
  updatePartialMessage: (content: string) => void;
  setDiagram: (diagram: string) => void;
  setConnected: (connected: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  sessionId: null,
  isConnected: false,
  messages: [],
  diagram: null,
  isLoading: false,
  error: null,

  initSession: () => {
    const sessionId = crypto.randomUUID();
    set({ sessionId, messages: [], diagram: null, error: null });
  },

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages.filter(m => m.type !== 'agent_partial'), message],
      isLoading: message.type === 'user',
    }));
  },

  updatePartialMessage: (content) => {
    set((state) => {
      const messages = [...state.messages];
      const partialIndex = messages.findIndex(m => m.type === 'agent_partial');

      if (partialIndex >= 0) {
        messages[partialIndex] = { ...messages[partialIndex], content };
      } else {
        messages.push({
          id: 'partial',
          type: 'agent_partial',
          content,
          timestamp: new Date(),
        });
      }

      return { messages };
    });
  },

  setDiagram: (diagram) => set({ diagram }),
  setConnected: (isConnected) => set({ isConnected }),
  setError: (error) => set({ error, isLoading: false }),
  clearMessages: () => set({ messages: [], diagram: null }),
}));
```

### Chat Panel Component
```tsx
// src/components/ChatPanel.tsx
import { useEffect, useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import { useWebSocket } from '../hooks/useWebSocket';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Message } from '../types';

export function ChatPanel() {
  const {
    sessionId,
    messages,
    isConnected,
    isLoading,
    initSession,
    addMessage,
    updatePartialMessage,
    setDiagram,
    setConnected
  } = useChatStore();

  useEffect(() => {
    if (!sessionId) {
      initSession();
    }
  }, [sessionId, initSession]);

  const handleMessage = useCallback((message: Message) => {
    if (message.type === 'agent_partial') {
      updatePartialMessage(message.content);
    } else {
      addMessage(message);
    }
  }, [addMessage, updatePartialMessage]);

  const handleDiagram = useCallback((diagram: string) => {
    setDiagram(diagram);
  }, [setDiagram]);

  const { sendMessage } = useWebSocket({
    sessionId: sessionId || '',
    onMessage: handleMessage,
    onDiagram: handleDiagram,
  });

  const handleSend = useCallback((content: string) => {
    if (!content.trim()) return;

    addMessage({
      id: crypto.randomUUID(),
      type: 'user',
      content,
      timestamp: new Date(),
    });

    sendMessage(content);
  }, [addMessage, sendMessage]);

  return (
    <div className="flex flex-col h-full bg-white border-r">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">MCOP Explorer</h2>
        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <MessageInput
          onSend={handleSend}
          disabled={!isConnected || isLoading}
          placeholder={isConnected ? "Ask about your metadata..." : "Connecting..."}
        />
      </div>
    </div>
  );
}
```

### Message List Component
```tsx
// src/components/MessageList.tsx
import { Message } from '../types';

interface Props {
  messages: Message[];
}

export function MessageList({ messages }: Props) {
  if (messages.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>👋 Hi! I'm the MCOP Explorer Agent.</p>
        <p className="text-sm mt-2">Ask me about tables, columns, or relationships.</p>
        <div className="mt-4 text-sm">
          <p className="font-medium">Try:</p>
          <ul className="list-disc list-inside text-left max-w-xs mx-auto mt-2">
            <li>"List all tables"</li>
            <li>"Show me columns in fact_bs_purchase_order"</li>
            <li>"What are the relationships of dimv_bs_supplier?"</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.type === 'user';
  const isPartial = message.type === 'agent_partial';
  const isError = message.type === 'error';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-blue-600 text-white'
            : isError
            ? 'bg-red-100 text-red-800 border border-red-200'
            : 'bg-gray-100 text-gray-800'
        } ${isPartial ? 'animate-pulse' : ''}`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.toolName && (
          <p className="text-xs mt-1 opacity-70">🔧 {message.toolName}</p>
        )}
      </div>
    </div>
  );
}
```

### Message Input Component
```tsx
// src/components/MessageInput.tsx
import { useState, KeyboardEvent } from 'react';

interface Props {
  onSend: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({ onSend, disabled, placeholder }: Props) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </div>
  );
}
```

### Mermaid Diagram Component
```tsx
// src/components/MermaidDiagram.tsx
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface Props {
  diagram: string | null;
}

// Initialize Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  er: {
    diagramPadding: 20,
    layoutDirection: 'TB',
    minEntityWidth: 100,
    minEntityHeight: 75,
    entityPadding: 15,
  },
});

export function MermaidDiagram({ diagram }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!diagram || !containerRef.current) return;

    const renderDiagram = async () => {
      try {
        // Clear previous diagram
        containerRef.current!.innerHTML = '';

        // Generate unique ID
        const id = `mermaid-${Date.now()}`;

        // Render
        const { svg } = await mermaid.render(id, diagram);
        containerRef.current!.innerHTML = svg;
      } catch (error) {
        console.error('Mermaid render error:', error);
        containerRef.current!.innerHTML = `
          <div class="text-red-500 p-4">
            <p class="font-medium">Failed to render diagram</p>
            <pre class="text-xs mt-2 bg-red-50 p-2 rounded">${diagram}</pre>
          </div>
        `;
      }
    };

    renderDiagram();
  }, [diagram]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center overflow-auto p-4"
    />
  );
}
```

### Canvas Component
```tsx
// src/components/Canvas.tsx
import { useChatStore } from '../store/chatStore';
import { MermaidDiagram } from './MermaidDiagram';

export function Canvas() {
  const { diagram } = useChatStore();

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-white flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">ER Diagram</h2>
        {diagram && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(diagram);
            }}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Copy Mermaid
          </button>
        )}
      </div>

      {/* Diagram Area */}
      <div className="flex-1 overflow-auto">
        {diagram ? (
          <MermaidDiagram diagram={diagram} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-4xl mb-2">📊</p>
              <p>Run the pipeline to generate an ER diagram</p>
              <p className="text-sm mt-1">Or ask about table relationships</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

### Layout Component
```tsx
// src/components/Layout.tsx
import { ChatPanel } from './ChatPanel';
import { Canvas } from './Canvas';

export function Layout() {
  return (
    <div className="h-screen flex">
      {/* Chat Panel - Left */}
      <div className="w-1/2 min-w-[400px] max-w-[600px]">
        <ChatPanel />
      </div>

      {/* Canvas - Right */}
      <div className="flex-1">
        <Canvas />
      </div>
    </div>
  );
}
```

### App Component
```tsx
// src/App.tsx
import { Layout } from './components/Layout';

function App() {
  return <Layout />;
}

export default App;
```

### Tailwind Config
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Vite Config
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:8000',
        ws: true,
      },
    },
  },
})
```

### Environment Variables
```bash
# frontend/.env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

## Testing

### Unit Tests
```typescript
// src/components/__tests__/MessageList.test.tsx
import { render, screen } from '@testing-library/react';
import { MessageList } from '../MessageList';

describe('MessageList', () => {
  it('shows welcome message when empty', () => {
    render(<MessageList messages={[]} />);
    expect(screen.getByText(/MCOP Explorer Agent/)).toBeInTheDocument();
  });

  it('renders user messages', () => {
    const messages = [{
      id: '1',
      type: 'user' as const,
      content: 'List all tables',
      timestamp: new Date(),
    }];

    render(<MessageList messages={messages} />);
    expect(screen.getByText('List all tables')).toBeInTheDocument();
  });
});
```

### Manual Testing
```bash
# Start backend first
cd /path/to/project
uvicorn src.api.main:app --reload --port 8000

# In another terminal, start frontend
cd frontend
npm run dev

# Open http://localhost:3000
```

## Deployment Notes

### Vercel
1. Connect GitHub repo
2. Set root directory to `frontend/`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variables:
   - `VITE_API_URL=https://your-railway-app.railway.app`
   - `VITE_WS_URL=wss://your-railway-app.railway.app`

### Build
```bash
cd frontend
npm run build
# Output in dist/
```

## Definition of Done
- [ ] Všetky AC splnené
- [ ] Chat funguje s WebSocket
- [ ] Mermaid diagram sa renderuje
- [ ] Streaming text funguje
- [ ] Responsive layout
- [ ] Unit testy prechádzajú
- [ ] Build funguje
- [ ] Deployed na Vercel (staging)
- [ ] Code review approved
