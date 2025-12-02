'use client';

import { useState, useEffect } from 'react';
import { SupplyChainAPI } from '@/src/lib/api-client';
import { useCanvasTrigger } from '@/src/hooks/useCanvasTrigger';
import InitialChatView from '@/src/components/InitialChatView';
import ChatInterface, { Message } from '@/src/components/ChatInterface';
import SupplierTable from '@/src/components/SupplierTable';
import ComparisonView from '@/src/components/ComparisonView';
import RiskDashboard from '@/src/components/RiskDashboard';
import OwnershipGraph from '@/src/components/OwnershipGraph';
import SupplyChainGraph from '@/src/components/SupplyChainGraph';
import MapView from '@/src/components/MapView';
import {
  type ApiResult,
  isSupplyChainResponse,
  isComparisonResponse,
  isOwnershipResponse,
  isRiskResponse,
  isMapViewResponse
} from '@/src/types/api';

export default function Home() {
  const [isInitialState, setIsInitialState] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
  const [activeCanvasData, setActiveCanvasData] = useState<ApiResult | null>(null);
  const [showDetails, setShowDetails] = useState(true); // Show table by default
  const [viewMode, setViewMode] = useState<'table' | 'graph'>('table');

  // MCOP-125: Canvas trigger - inline handler (no navigation, just switch activeCanvasData)
  const [isTriggering, setIsTriggering] = useState(false);

  const handleCanvasTrigger = async (trigger: any) => {
    console.log('[MCOP-125] Canvas trigger detected:', trigger.reason);

    if (trigger.action === 'none' || !trigger.query) {
      console.warn('[MCOP-125] Invalid canvas trigger:', trigger);
      return;
    }

    setIsTriggering(true);
    setLoading(true);

    try {
      // Fetch new analysis for canvas
      console.log('[MCOP-125] Fetching canvas analysis:', trigger.query);
      const canvasResponse = await SupplyChainAPI.query(trigger.query, false);

      if (canvasResponse.success) {
        setActiveCanvasData(canvasResponse);
        console.log('[MCOP-125] Canvas switched to:', canvasResponse.analysis_type);
      } else {
        throw new Error(canvasResponse.error?.message || 'Canvas trigger failed');
      }
    } catch (err) {
      console.error('[MCOP-125] Canvas trigger error:', err);
      // Show error message in chat
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Failed to switch canvas: ${err instanceof Error ? err.message : 'Unknown error'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTriggering(false);
      setLoading(false);
    }
  };

  // Load query from URL parameter on mount (e.g., ?query=Continental+tier+2+suppliers)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    if (query && query.trim()) {
      console.log('[URL] Auto-submitting query from URL:', query);
      handleSendMessage(query.trim());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Restore state from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat_messages');
    const savedLayoutState = localStorage.getItem('layout_state');

    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (e) {
        console.error('Failed to restore messages:', e);
      }
    }

    if (savedLayoutState === 'split') {
      setIsInitialState(false);
    }
  }, []);

  // Transition to split layout after first message
  useEffect(() => {
    if (messages.length > 0 && isInitialState) {
      setIsInitialState(false);
      localStorage.setItem('layout_state', 'split');
    }

    // Return to initial state if messages cleared
    if (messages.length === 0 && !isInitialState) {
      setIsInitialState(true);
      localStorage.removeItem('layout_state');
    }

    // Persist messages
    if (messages.length > 0) {
      localStorage.setItem('chat_messages', JSON.stringify(messages));
    } else {
      localStorage.removeItem('chat_messages');
    }
  }, [messages.length, isInitialState]);

  const handleReturnHome = () => {
    setMessages([]);
    setActiveCanvasData(null);
    setIsInitialState(true);
    localStorage.removeItem('chat_messages');
    localStorage.removeItem('layout_state');
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // MCOP-132 + MCOP-125.1: Detect follow-up vs new query
    // Follow-up: short question + existing canvas data = fast path
    // New query: complex/long question OR no canvas = full orchestrator (8-10s)
    //
    // EXCEPTIONS (always use new query path):
    // 1. MapView in canvas → Explorer Agent doesn't support MapView follow-up
    // 2. Query contains "map" keyword → Direct map query, not follow-up
    const hasMapKeyword = /\bmap\b/i.test(text);
    const isMapViewActive = activeCanvasData?.analysis_type === 'map_view';

    const isFollowUpQuery =
      activeCanvasData !== null &&
      text.trim().length < 100 &&
      !isMapViewActive &&  // MapView doesn't support Explorer Agent follow-up
      !hasMapKeyword;      // "map" queries → new query path (Orchestrator)

    // Debug logging
    console.log('[ROUTING] Query analysis:', {
      query: text,
      length: text.trim().length,
      hasMapKeyword,
      isMapViewActive,
      activeCanvasType: activeCanvasData?.analysis_type,
      isFollowUpQuery,
      path: isFollowUpQuery ? 'FOLLOW-UP → Explorer Agent' : 'NEW → Orchestrator'
    });

    try {
      if (isFollowUpQuery) {
        // FOLLOW-UP PATH: Answer from existing data (7-10s LLM processing)
        console.log('[MCOP-132] FOLLOW-UP DETECTED - calling API.followUp');
        setIsFollowUpLoading(true);
        const followUpResult = await SupplyChainAPI.followUp(activeCanvasData, text.trim());
        console.log('[MCOP-132] Follow-up response:', followUpResult);

        // MCOP-125: Check for canvas trigger BEFORE adding message
        if (followUpResult.canvas_trigger && followUpResult.canvas_trigger.action !== 'none') {
          console.log('[MCOP-125] Canvas trigger detected:', followUpResult.canvas_trigger);

          // Add assistant message with trigger reason
          const triggerMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: followUpResult.canvas_trigger.reason,
            timestamp: new Date(),
            isFollowUp: true,
          };
          setMessages((prev) => [...prev, triggerMsg]);

          // Trigger canvas navigation
          await handleCanvasTrigger(followUpResult.canvas_trigger);

          // Stop here - don't show alternatives/distances/map
          setIsFollowUpLoading(false);
          setLoading(false);
          return;
        }



        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: followUpResult.answer,
          timestamp: new Date(),
          isFollowUp: true,
          // MCOP-124: Store tool outputs for rendering in ChatInterface
          toolOutputs: {
            alternatives: followUpResult.alternatives,
            distances: followUpResult.distances,
            map_data: followUpResult.map_data,
          },
        };
        setMessages((prev) => [...prev, assistantMsg]);
        console.log('[MCOP-124] Added follow-up message with tool outputs:', {
          hasAlternatives: !!followUpResult.alternatives?.length,
          hasDistances: !!followUpResult.distances?.length,
          hasMap: !!followUpResult.map_data,
        });
        // Keep activeCanvasData and canvas visualization intact

      } else {
        // NEW QUERY PATH: MCOP-123 Two-phase loading
        // Phase 1: Fast data fetch (skip_narrative=true, <500ms)
        // Phase 2: Slow narrative fetch (skip_narrative=false, ~30s)
        console.log('[MCOP-123] New query path with two-phase loading:', text.trim());
        setActiveCanvasData(null);

        // Phase 1: Get data immediately
        console.log('[MCOP-123] Phase 1: Fetching data (skip_narrative=true)');
        const fastData = await SupplyChainAPI.query(text.trim(), true);
        console.log('[MCOP-123] Phase 1 complete:', { success: fastData.success, type: fastData.analysis_type });

      // Check for error response
      if (!fastData.success) {
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Analysis failed: ${fastData.error?.message || 'Unknown error'}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
        setLoading(false);
        return;
      }

        // Show data immediately in canvas (no narrative yet)
        setActiveCanvasData(fastData);

        // Initial assistant message (without narrative)
        let initialMessage = "Analysis complete. See details in the canvas.";
        if (isSupplyChainResponse(fastData)) {
          initialMessage = `Supply chain data loaded for ${fastData.data.focal_entity.name}. Analyzing...`;
        } else if (isComparisonResponse(fastData)) {
          initialMessage = `Comparison analysis complete. Generating insights...`;
        } else if (isOwnershipResponse(fastData)) {
          initialMessage = `Ownership structure loaded for ${fastData.data.focal_entity.name}. Analyzing...`;
        } else if (isRiskResponse(fastData)) {
          initialMessage = `Risk analysis complete for ${fastData.data.entity_name}. Generating recommendations...`;
        }

        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: initialMessage,
          timestamp: new Date(),
          isAnalyzing: initialMessage.includes('Analyzing') || initialMessage.includes('Generating'),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setLoading(false);

        // Phase 2: Fetch narrative in background (for all analysis types)
        console.log('[MCOP-123] Phase 2: Fetching narrative (skip_narrative=false)');
        try {
          const fullData = await SupplyChainAPI.query(text.trim(), false);
          if (fullData.success) {
            // Extract narrative based on analysis type
            let narrativeText = '';

            if (isSupplyChainResponse(fullData)) {
              narrativeText = fullData.data.narrative || '';
            } else if (isComparisonResponse(fullData)) {
              narrativeText = fullData.data.narrative || '';
            } else if (isOwnershipResponse(fullData)) {
              narrativeText = fullData.data.insights || '';
            } else if (isRiskResponse(fullData)) {
              narrativeText = fullData.data.recommendations || '';
            }

            // Add narrative as new chat message (if exists)
            if (narrativeText && narrativeText.trim()) {
              // Remove isAnalyzing flag from previous message
              setMessages((prev) => prev.map((msg, idx) =>
                idx === prev.length - 1 && msg.isAnalyzing
                  ? { ...msg, isAnalyzing: false }
                  : msg
              ));

              const narrativeMsg: Message = {
                id: (Date.now() + 2).toString(),
                role: 'assistant',
                content: narrativeText,
                timestamp: new Date(),
              };
              setMessages((prev) => [...prev, narrativeMsg]);
              console.log('[MCOP-123] Phase 2 complete: Narrative added to chat');
            }
          }
        } catch (narrativeErr) {
          console.error('[MCOP-123] Phase 2 failed (narrative fetch):', narrativeErr);
          // Non-critical error - data is already displayed
        }
      }

    } catch (err) {
      console.error('[MCOP-132] Error in handleSendMessage:', err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `System Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setIsFollowUpLoading(false);
    }
  };

  // Render initial full-screen view
  if (isInitialState) {
    return <InitialChatView onSendMessage={handleSendMessage} isLoading={loading || isTriggering} />;
  }

  // Render split layout (after first message)
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden">
      {/* Left Panel: Chat Interface - Responsive width with transition */}
      <div className="w-full md:w-[600px] flex-shrink-0 border-r border-gray-200 bg-white h-full transition-all duration-500 ease-in-out">
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          onReturnHome={handleReturnHome}
          isLoading={loading || isFollowUpLoading || isTriggering}
        />
      </div>

      {/* Right Panel: Canvas / Visualization Area - Fade in transition */}
      <main className="flex-1 h-full overflow-y-auto bg-gray-50 p-4 md:p-8 transition-opacity duration-500 ease-in-out opacity-100 relative">

        {/* Follow-up Loading Overlay */}
        {isFollowUpLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl border-2 border-[#4BA82E] max-w-md">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-[#4BA82E] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-3 h-3 bg-[#4BA82E] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-3 h-3 bg-[#4BA82E] animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <span className="text-xl font-semibold text-[#0E3A2F]">Thinking...</span>
              </div>
              <p className="text-gray-600 text-sm">
                🤔 LLM is generating an answer from the supply chain data...
              </p>
              <p className="text-gray-400 text-xs mt-2">
                This usually takes 7-10 seconds
              </p>
            </div>
          </div>
        )}

        {!activeCanvasData && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-xl font-semibold">Ready to analyze</p>
            <p className="text-sm">Visualization will appear here</p>
          </div>
        )}

        {loading && !activeCanvasData && (
           <div className="flex flex-col items-center justify-center h-full">
             <div className="animate-spin h-12 w-12 border-4 border-[#4BA82E] border-t-transparent mb-4"></div>
             <p className="text-gray-600 font-medium">Analyzing supply chain data...</p>
           </div>
        )}

        {/* Render Active Canvas Content */}
        {activeCanvasData && (
          <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">

            {/* Map View */}
            {isMapViewResponse(activeCanvasData) && (
              <MapView data={activeCanvasData.data} />
            )}

            {/* Risk Dashboard */}
            {isRiskResponse(activeCanvasData) && (
              <RiskDashboard data={activeCanvasData.data} />
            )}

            {/* Ownership Graph */}
            {isOwnershipResponse(activeCanvasData) && (
              <OwnershipGraph response={activeCanvasData} />
            )}

            {/* Comparison View */}
            {isComparisonResponse(activeCanvasData) && (
              <ComparisonView data={activeCanvasData.data} />
            )}

            {/* Standard Supply Chain View */}
            {isSupplyChainResponse(activeCanvasData) && (
              <>
                {/* Unified Supply Chain Header */}
                <div className="bg-white overflow-hidden border-t-2 border-[#4BA82E] border border-gray-200">
                  {/* Header Section with Company Info */}
                  <div className="bg-[#0E3A2F] px-8 py-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold text-white mb-2">
                          {activeCanvasData.data.focal_entity.name}
                        </h2>
                        <p className="text-[#78FAAE] text-base font-medium">
                          {activeCanvasData.data.focal_entity.country} • Supply Chain Overview
                        </p>
                      </div>
                      {/* Placeholder for Key Metrics Badge */}
                      <div className="bg-[#1a5a42] px-6 py-3 border border-[#78FAAE]">
                        <p className="text-[#78FAAE] text-xs uppercase tracking-wide mb-1">Total Partners</p>
                        <p className="text-white text-2xl font-bold">
                          {activeCanvasData.data.tier2_count + (activeCanvasData.metadata.tier3_coverage || 0)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Main Metrics Grid */}
                  <div className="grid grid-cols-4 divide-x divide-gray-200 border-b border-gray-200">
                    <div className="p-6 text-center bg-gradient-to-br from-white to-gray-50">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Tier 2 Suppliers</p>
                      <p className="text-4xl font-bold text-[#4BA82E] mb-1">{activeCanvasData.data.tier2_count}</p>
                      <div className="flex items-center justify-center gap-1 text-xs text-green-600">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                        </svg>
                        <span>Active</span>
                      </div>
                    </div>
                    <div className="p-6 text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Tier 3 Coverage</p>
                      <p className="text-4xl font-bold text-[#4BA82E]">{activeCanvasData.metadata.tier3_coverage || 0}</p>
                      <p className="text-xs text-gray-400 mt-1">Extended Network</p>
                    </div>
                    <div className="p-6 text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Countries</p>
                      <p className="text-4xl font-bold text-[#4BA82E]">{activeCanvasData.data.countries.length}</p>
                      <p className="text-xs text-gray-400 mt-1">Global Reach</p>
                    </div>
                    <div className="p-6 text-center bg-gradient-to-br from-white to-gray-50">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Risk Score</p>
                      <p className="text-4xl font-bold text-orange-500">--</p>
                      <p className="text-xs text-gray-400 mt-1">Under Review</p>
                    </div>
                  </div>

                  {/* Bottom Section with Geographic Info */}
                  <div className="grid grid-cols-2 divide-x divide-gray-200">
                    <div className="px-6 py-5 bg-gray-50">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-3 font-semibold">Geographic Presence</p>
                      <div className="flex flex-wrap gap-2">
                        {activeCanvasData.data.countries.map((country: string, idx: number) => (
                          <span key={idx} className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium">
                            {country}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="px-6 py-5 bg-gray-50">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-3 font-semibold">Key Indicators</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Supply Chain Diversity</span>
                          <span className="font-semibold text-[#4BA82E]">High</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Compliance Status</span>
                          <span className="font-semibold text-green-600">Verified</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Last Updated</span>
                          <span className="font-semibold text-gray-700">{new Date().toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="bg-white p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Supply Chain Visualization</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewMode('table')}
                        className={`px-4 py-2 text-sm font-semibold ${
                          viewMode === 'table'
                            ? 'bg-[#4BA82E] text-white border border-[#4BA82E]'
                            : 'bg-white text-gray-700 border border-gray-300'
                        }`}
                      >
                        📊 Table View
                      </button>
                      <button
                        onClick={() => setViewMode('graph')}
                        className={`px-4 py-2 text-sm font-semibold ${
                          viewMode === 'graph'
                            ? 'bg-[#4BA82E] text-white border border-[#4BA82E]'
                            : 'bg-white text-gray-700 border border-gray-300'
                        }`}
                      >
                        🔗 Graph View
                      </button>
                    </div>
                  </div>

                  {/* Table View */}
                  {viewMode === 'table' && activeCanvasData.data.tier2_suppliers && activeCanvasData.data.tier2_suppliers.length > 0 && (
                    <div>
                      <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="mb-4 px-4 py-2 bg-white text-gray-700 border border-gray-300 text-sm font-semibold"
                      >
                        {showDetails ? 'Hide Details' : 'Show Details'}
                      </button>
                      {showDetails && (
                        <SupplierTable suppliers={activeCanvasData.data.tier2_suppliers} />
                      )}
                    </div>
                  )}

                  {/* Graph View */}
                  {viewMode === 'graph' && (
                    <SupplyChainGraph data={{...activeCanvasData.data, metadata: activeCanvasData.metadata} as any} />
                  )}
                </div>

                {/* Performance Metrics */}
                <div className="bg-white p-5 border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Performance Metrics</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Latency</p>
                      <p className="font-semibold text-gray-900">{activeCanvasData.metadata.total_latency_ms}ms</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tokens</p>
                      <p className="font-semibold text-gray-900">{activeCanvasData.metadata.total_tokens}</p>
                    </div>
                    {activeCanvasData.metadata.llm_requests && (
                      <div>
                        <p className="text-gray-500">LLM Requests</p>
                        <p className="font-semibold text-gray-900">{activeCanvasData.metadata.llm_requests}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
