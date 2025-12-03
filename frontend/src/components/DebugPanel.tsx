import { useChatStore } from '../store/chatStore';

export function DebugPanel() {
  const { canvasView } = useChatStore();

  // Hide in production (use Vite env var)
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 text-xs font-mono z-50 border-2 border-green-500">
      <div className="font-bold mb-2">🐛 Debug Info</div>
      <div>Canvas View: <span className="text-green-400">{canvasView}</span></div>
      <div className="text-gray-400 mt-2">Press T/D to switch</div>
    </div>
  );
}
