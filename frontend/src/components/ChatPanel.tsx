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
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden border border-gray-200" data-testid="chat-panel">
      {/* Header */}
      <div className="bg-[#0E3A2F] border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">MCOP Explorer</h2>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#4BA82E]' : 'bg-red-400'}`}
            title={isConnected ? 'Connected' : 'Disconnected'}
          />
          <span className="text-sm font-medium text-white">
            {isConnected ? 'Connected' : 'Connecting...'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <MessageList messages={messages} />

        {/* FE-004: Loading indicator with animated dots */}
        {isLoading && (
          <div className="flex items-start gap-4 py-4">
            <div className="w-10 h-10 flex items-center justify-center text-xl bg-[#0E3A2F] text-white">
              🤖
            </div>
            <div className="bg-white border border-gray-200 px-5 py-3">
              <LoadingDots text="Thinking..." />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <MessageInput
          onSend={onSend}
          disabled={!isConnected || isLoading}
          placeholder={isConnected ? "Ask about your metadata..." : "Connecting..."}
        />
      </div>
    </div>
  );
}
