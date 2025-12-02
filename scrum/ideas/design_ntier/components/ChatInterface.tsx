import React, { useState, useRef, useEffect } from 'react';
import { AlternativeEntity, DistanceResult, MapVisualization } from '@/src/types/api';
import AlternativesTable from './AlternativesTable';
import DistancesTable from './DistancesTable';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isFollowUp?: boolean; // MCOP-132: Flag for follow-up queries
  isAnalyzing?: boolean; // MCOP-123: Flag for loading state with spinner
  // MCOP-124: Store tool outputs for rendering
  toolOutputs?: {
    alternatives?: AlternativeEntity[];  // MCOP-124: Changed from SupplierDetail
    distances?: DistanceResult[];
    map_data?: MapVisualization;
  };
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onReturnHome?: () => void;
  isLoading: boolean;
}

export default function ChatInterface({ messages, onSendMessage, onReturnHome, isLoading }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden border border-gray-200">
      {/* Header with Home Button */}
      {onReturnHome && (
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0E3A2F]">Supply Chain Chat</h2>
          <button
            onClick={onReturnHome}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300"
            title="Return to welcome screen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span>Home</span>
          </button>
        </div>
      )}

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
            <p>Start a conversation about the supply chain...</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className="space-y-2" data-testid={`chat-message-${message.role}`}>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold uppercase tracking-wider ${
                message.role === 'user' ? 'text-[#4BA82E]' : 'text-gray-500'
              }`}>
                {message.role === 'user' ? 'You' : 'Assistant'}
              </span>
              {message.isFollowUp && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                  <span>⚡</span>
                  <span>Follow-up</span>
                </span>
              )}
            </div>
            <div className={`${
              message.role === 'assistant' ? 'pl-4 border-l-2 border-gray-300' : 'pl-0'
            }`}>
              <div className="whitespace-pre-wrap text-lg leading-relaxed text-gray-900">
                {message.isAnalyzing ? (
                  <div className="flex items-center space-x-2">
                    <span>{message.content}</span>
                    <div className="flex space-x-1 ml-2">
                      <div className="w-2 h-2 bg-[#4BA82E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-[#4BA82E] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-[#4BA82E] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                ) : (
                  message.content
                )}
              </div>

              {/* MCOP-124: Tool outputs (alternatives, distances, map) */}
              {message.toolOutputs && (
                <div className="mt-4 space-y-4">
                  {/* Alternatives table */}
                  {message.toolOutputs.alternatives && message.toolOutputs.alternatives.length > 0 && (
                    <AlternativesTable data={message.toolOutputs.alternatives} />
                  )}

                  {/* Distance calculations */}
                  {message.toolOutputs.distances && message.toolOutputs.distances.length > 0 && (
                    <DistancesTable data={message.toolOutputs.distances} />
                  )}

                  {/* Map placeholder - future enhancement */}
                  {message.toolOutputs.map_data && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50" data-testid="explorer-map-placeholder">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-lg">🗺️</span>
                        <span className="text-sm font-medium">
                          Map visualization available ({message.toolOutputs.map_data.markers.length} locations)
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Interactive map component coming soon
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Assistant
            </div>
            <div className="pl-4 border-l-2 border-gray-300">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#0E3A2F] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-[#0E3A2F] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-[#0E3A2F] animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <span className="text-lg text-gray-500 ml-2">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about suppliers, risks, or tiers..."
            disabled={isLoading}
            data-testid="chat-input"
            className="w-full p-3 border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0E3A2F] disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="w-full bg-[#0E3A2F] text-white px-6 py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-[#0E3A2F]"
          >
            <span>Send</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
