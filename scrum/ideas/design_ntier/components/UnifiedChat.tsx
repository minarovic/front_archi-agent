/**
 * UnifiedChat - Chat interface using unified endpoint (Sprint 130)
 *
 * Single API call handles all query types - LLM decides which analysis to run.
 * Replaces complex routing logic with simple unified query.
 *
 * Features:
 * - Natural language queries for all analysis types
 * - LLM determines analysis type automatically
 * - Canvas trigger detection and navigation
 * - Tool call visibility
 * - Analysis data rendering with NarrativeCard
 */

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UnifiedAPI, UnifiedResponse } from '@/src/lib/api-client';
import { NarrativeCard } from './NarrativeCard';
import AlternativesTable from './AlternativesTable';
import DistancesTable from './DistancesTable';
import { AlternativeEntity, DistanceResult, MapVisualization, CanvasTrigger } from '@/src/types/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  analysisType?: string;
  toolsCalled?: string[];
  // MCOP-130: Full response data for rendering
  responseData?: UnifiedResponse;
}

interface UnifiedChatProps {
  /** Callback when analysis data is received */
  onAnalysisData?: (data: UnifiedResponse) => void;
  /** Callback when canvas trigger is detected */
  onCanvasTrigger?: (trigger: CanvasTrigger) => void;
  /** Enable canvas navigation on trigger (default: true) */
  enableCanvasNavigation?: boolean;
}

export default function UnifiedChat({
  onAnalysisData,
  onCanvasTrigger,
  enableCanvasNavigation = true
}: UnifiedChatProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [canvasTriggerPending, setCanvasTriggerPending] = useState<CanvasTrigger | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const query = inputValue.trim();
    if (!query || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Add loading message
    const loadingId = `loading-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: loadingId,
      role: 'assistant',
      content: '🔍 Analyzing...',
      timestamp: new Date(),
      isLoading: true,
    }]);

    try {
      // Call unified endpoint
      const response = await UnifiedAPI.query(query);

      // Replace loading with response
      setMessages(prev => prev.map(m =>
        m.id === loadingId ? {
          ...m,
          content: response.answer,
          isLoading: false,
          analysisType: response.analysis_type,
          toolsCalled: response.tools_called,
          responseData: response,
        } : m
      ));

      // Notify parent about analysis data
      if (onAnalysisData) {
        onAnalysisData(response);
      }

      // MCOP-125: Handle canvas trigger
      if (response.canvas_trigger && response.canvas_trigger.action !== 'none') {
        console.log('[UnifiedChat] Canvas trigger detected:', response.canvas_trigger);

        if (onCanvasTrigger) {
          onCanvasTrigger(response.canvas_trigger);
        }

        // Show confirmation toast
        setCanvasTriggerPending(response.canvas_trigger);

        // Auto-navigate after delay if enabled
        if (enableCanvasNavigation && response.canvas_trigger.query) {
          setTimeout(() => {
            const encodedQuery = encodeURIComponent(response.canvas_trigger!.query!);
            router.push(`/canvas?query=${encodedQuery}`);
          }, 1500);
        }
      }

    } catch (error) {
      // Replace loading with error
      setMessages(prev => prev.map(m =>
        m.id === loadingId ? {
          ...m,
          content: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          isLoading: false,
        } : m
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <h2 className="text-lg font-bold text-emerald-900">
          🤖 Unified Supply Chain Chat
        </h2>
        <p className="text-xs text-gray-500">Sprint 130 - Single endpoint for all queries</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <p>Try these queries:</p>
            <ul className="mt-2 text-sm space-y-1">
              <li>"Continental tier 2 suppliers"</li>
              <li>"Compare Continental and Bosch"</li>
              <li>"Who owns Bosch?"</li>
              <li>"Continental financial risk"</li>
            </ul>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] rounded-lg px-4 py-2 ${
              msg.role === 'user'
                ? 'bg-emerald-600 text-white'
                : msg.isLoading
                  ? 'bg-gray-200 text-gray-600 animate-pulse'
                  : 'bg-white border border-gray-200 text-gray-800'
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>

              {/* MCOP-130: Tool outputs from unified response */}
              {msg.responseData && !msg.isLoading && (
                <div className="mt-3 space-y-3">
                  {/* Alternatives table */}
                  {msg.responseData.alternatives && msg.responseData.alternatives.length > 0 && (
                    <AlternativesTable data={msg.responseData.alternatives as AlternativeEntity[]} />
                  )}

                  {/* Distance calculations */}
                  {msg.responseData.distances && msg.responseData.distances.length > 0 && (
                    <DistancesTable data={msg.responseData.distances as DistanceResult[]} />
                  )}

                  {/* Map data indicator */}
                  {msg.responseData.map_data && (
                    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-lg">🗺️</span>
                        <span className="text-sm font-medium">
                          Map visualization available
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        View in canvas for full map
                      </p>
                    </div>
                  )}
                </div>
              )}

              {msg.analysisType && (
                <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    {msg.analysisType}
                  </span>
                  {msg.toolsCalled && msg.toolsCalled.length > 0 && (
                    <span className="ml-2">
                      Tools: {msg.toolsCalled.join(', ')}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* MCOP-125: Canvas trigger toast */}
        {canvasTriggerPending && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
            <div className="flex items-center gap-3">
              <span className="text-lg">🔄</span>
              <span>{canvasTriggerPending.reason || 'Switching to canvas view...'}</span>
              <button
                onClick={() => setCanvasTriggerPending(null)}
                className="ml-2 text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-white p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about supply chain..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
