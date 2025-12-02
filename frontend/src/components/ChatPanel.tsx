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
    clearMessages,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleGoHome = () => {
    clearMessages();
  };

  return (
    <div className="chat-container" data-testid="chat-panel">
      {/* Header */}
      <div className="chat-header">
        <h2 className="chat-header-title">MCOP Explorer</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handleGoHome}
            className="btn-secondary flex items-center gap-2"
            title="Go to home"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Home
          </button>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-skoda-green' : 'bg-red-500'}`}
              title={isConnected ? 'Connected' : 'Disconnected'}
            />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="message-list">
        <MessageList messages={messages} />

        {/* FE-004: Loading indicator with animated dots */}
        {isLoading && (
          <div className="flex items-start gap-4 py-4">
            <div className="w-10 h-10 flex items-center justify-center text-sm font-bold bg-skoda-dark text-white">
              AI
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
