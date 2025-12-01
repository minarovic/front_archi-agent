import { useEffect, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { LoadingDots } from './LoadingDots';

interface ChatPanelProps {
  onSend: (content: string) => void;
}

export function ChatPanel({ onSend }: ChatPanelProps) {
  const {
    messages,
    isConnected,
    isLoading,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200" data-testid="chat-panel">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-primary-dark">
        <div>
          <h2 className="font-semibold text-white">MCOP Explorer</h2>
          <p className="text-xs text-primary-light">Metadata exploration agent</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${isConnected ? 'bg-primary-light' : 'bg-red-500'}`}
            title={isConnected ? 'Connected' : 'Disconnected'}
          />
          <span className="text-xs text-primary-light">
            {isConnected ? 'Connected' : 'Connecting...'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />

        {/* FE-004: Loading indicator with animated dots */}
        {isLoading && (
          <div className="flex items-start gap-3 py-4">
            <div className="w-8 h-8 rounded-full bg-primary-dark flex items-center justify-center text-white text-sm">
              🤖
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-3">
              <LoadingDots text="Thinking..." />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <MessageInput
          onSend={onSend}
          disabled={!isConnected || isLoading}
          placeholder={isConnected ? "Ask about your metadata..." : "Connecting..."}
        />
      </div>
    </div>
  );
}
