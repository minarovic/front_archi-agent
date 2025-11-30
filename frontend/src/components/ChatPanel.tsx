import { useEffect, useCallback, useRef } from 'react';
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
    setConnected,
    setLoading,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session on mount
  useEffect(() => {
    if (!sessionId) {
      initSession();
    }
  }, [sessionId, initSession]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMessage = useCallback((message: Message) => {
    if (message.type === 'agent_partial') {
      updatePartialMessage(message.content);
    } else {
      addMessage(message);
      if (message.type === 'agent' || message.type === 'error') {
        setLoading(false);
      }
    }
  }, [addMessage, updatePartialMessage, setLoading]);

  const handleDiagram = useCallback((diagram: string) => {
    setDiagram(diagram);
  }, [setDiagram]);

  const handleConnected = useCallback((connected: boolean) => {
    setConnected(connected);
  }, [setConnected]);

  const { sendMessage } = useWebSocket({
    sessionId: sessionId || '',
    onMessage: handleMessage,
    onDiagram: handleDiagram,
    onConnected: handleConnected,
  });

  const handleSend = useCallback((content: string) => {
    if (!content.trim()) return;

    // Add user message
    addMessage({
      id: crypto.randomUUID(),
      type: 'user',
      content,
      timestamp: new Date(),
    });

    // Send via WebSocket
    sendMessage(content);
  }, [addMessage, sendMessage]);

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <div>
          <h2 className="font-semibold text-gray-800">MCOP Explorer</h2>
          <p className="text-xs text-gray-500">Metadata exploration agent</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
            title={isConnected ? 'Connected' : 'Disconnected'}
          />
          <span className="text-xs text-gray-500">
            {isConnected ? 'Connected' : 'Connecting...'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full" />
            <span>Thinking...</span>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <MessageInput
          onSend={handleSend}
          disabled={!isConnected || isLoading}
          placeholder={isConnected ? "Ask about your metadata..." : "Connecting..."}
        />
      </div>
    </div>
  );
}
