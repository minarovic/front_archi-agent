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
    <div className="chat-container" data-testid="chat-panel">
      {/* Header */}
      <div className="chat-header">
        <h2 className="chat-header-title">MCOP Explorer</h2>
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-skoda-green' : 'bg-red-500'}`}
            title={isConnected ? 'Connected' : 'Disconnected'}
          />
          <span className="text-sm font-medium text-gray-600">
            {isConnected ? 'Connected' : 'Connecting...'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="message-list">
        <MessageList messages={messages} />

        {/* FE-004: Loading indicator with animated dots */}
        {isLoading && (
          <div className="flex items-start gap-4 py-4">
            <div className="w-10 h-10 flex items-center justify-center text-xl bg-skoda-dark text-white">
              🤖
            </div>
            <div className="bg-white border border-gray-200 px-5 py-3 shadow-md">
              <LoadingDots text="Thinking..." />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <MessageInput
          onSend={onSend}
          disabled={!isConnected || isLoading}
          placeholder={isConnected ? "Ask about your metadata..." : "Connecting..."}
        />
      </div>
    </div>
  );
}
