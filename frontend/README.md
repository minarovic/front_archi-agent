# MCOP React Frontend

React + TypeScript frontend pre Metadata Copilot s real-time chat a ER diagram vizualizáciou.

## Features

- 💬 **Real-time Chat** - WebSocket komunikácia s Explorer Agent
- 📊 **ER Diagram Viewer** - Mermaid diagram rendering
- 🎨 **Split Layout** - Chat panel vľavo, canvas vpravo
- ⚡ **Streaming Responses** - Typing effect pre agent odpovede
- 🔄 **Session Management** - Persistent chat history

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (with backend proxy)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Frontend will be available at: http://localhost:3000

## Architecture

```
frontend/
├── src/
│   ├── components/
│   │   ├── ChatPanel.tsx       # Main chat interface
│   │   ├── Canvas.tsx          # Diagram display area
│   │   ├── Layout.tsx          # Split view layout
│   │   ├── MessageList.tsx     # Chat message history
│   │   ├── MessageInput.tsx    # User input field
│   │   └── MermaidDiagram.tsx  # Mermaid renderer
│   ├── hooks/
│   │   └── useWebSocket.ts     # WebSocket connection hook
│   ├── store/
│   │   └── chatStore.ts        # Zustand state management
│   ├── types/
│   │   └── index.ts            # TypeScript definitions
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

## Backend Connection

Frontend connects to backend via:
- **REST API**: `http://localhost:8000/api/*`
- **WebSocket**: `ws://localhost:8000/ws/{session_id}`

Vite proxy configuration handles routing in development.

## Environment Variables

Create `.env` file:

```bash
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

For production (Vercel):

```bash
VITE_API_URL=https://your-backend.railway.app
VITE_WS_URL=wss://your-backend.railway.app
```

## Usage

### Chat Interface

1. App automatically creates a session on load
2. Type questions in the input field:
   - "List all tables"
   - "Show columns in factv_purchase_order"
   - "What are the relationships?"
3. Agent responses stream in real-time
4. Connection status indicator in top-right

### ER Diagram

- Diagrams appear automatically when:
  - Pipeline generates them
  - Agent returns diagram data
- Click "Copy Mermaid" to copy diagram code
- Zoom and pan supported

## Development

### With Backend Running

```bash
# Terminal 1: Start backend
cd /path/to/project
uvicorn src.api.main:app --reload --port 8000

# Terminal 2: Start frontend
cd frontend
npm run dev
```

### Mock Mode (No Backend)

Update `useWebSocket.ts` to use mock data for offline development.

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## Build & Deploy

### Production Build

```bash
npm run build
# Output: dist/
```

### Vercel Deployment

1. Push to GitHub
2. Connect repo to Vercel
3. Set root directory: `frontend/`
4. Set environment variables
5. Deploy

Or use CLI:

```bash
npm install -g vercel
vercel --prod
```

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Zustand** - State management
- **Mermaid** - Diagram rendering
- **TailwindCSS** - Styling

## Troubleshooting

### WebSocket Connection Failed

- Check backend is running on port 8000
- Check VITE_WS_URL in .env
- Check browser console for errors

### Diagram Not Rendering

- Verify Mermaid syntax is valid
- Check browser console for Mermaid errors
- Ensure diagram data is non-empty

### TypeScript Errors

```bash
npm run type-check
```

### Build Errors

```bash
rm -rf node_modules dist
npm install
npm run build
```

## Performance

- Initial load: ~200KB gzipped
- WebSocket: Minimal overhead
- Mermaid: Lazy loaded
- No unnecessary re-renders (Zustand optimizations)

## Browser Support

- Chrome/Edge: ✅ Latest 2 versions
- Firefox: ✅ Latest 2 versions
- Safari: ✅ Latest 2 versions
- Mobile: ⚠️ Limited support (desktop-first design)

## Contributing

1. Create feature branch
2. Make changes
3. Run tests: `npm test`
4. Build: `npm run build`
5. Submit PR

## License

Same as parent project.
