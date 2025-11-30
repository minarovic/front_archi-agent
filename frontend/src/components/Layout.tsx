import { ChatPanel } from './ChatPanel';
import { Canvas } from './Canvas';

export function Layout() {
  return (
    <div className="h-screen flex bg-white">
      {/* Chat Panel - Left */}
      <div className="w-1/2 min-w-[400px] max-w-[600px] flex-shrink-0">
        <ChatPanel />
      </div>

      {/* Canvas - Right */}
      <div className="flex-1 min-w-[400px]">
        <Canvas />
      </div>
    </div>
  );
}
