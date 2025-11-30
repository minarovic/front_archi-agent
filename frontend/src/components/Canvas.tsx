import { useChatStore } from '../store/chatStore';
import { MermaidDiagram } from './MermaidDiagram';

export function Canvas() {
  const { diagram } = useChatStore();

  const handleCopy = () => {
    if (diagram) {
      navigator.clipboard.writeText(diagram);
    }
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-800">ER Diagram</h2>
          <p className="text-xs text-gray-500">Entity relationships visualization</p>
        </div>
        {diagram && (
          <button
            onClick={handleCopy}
            className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
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
              <p className="text-5xl mb-4">📊</p>
              <p className="font-medium">No diagram yet</p>
              <p className="text-sm mt-2 max-w-xs">
                Run the pipeline or ask about table relationships to generate an ER diagram
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
