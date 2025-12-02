import { useEffect, useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import { useWebSocket } from '../hooks/useWebSocket';
import { ChatPanel } from './ChatPanel';
import { Canvas } from './Canvas';
import { InitialView } from './InitialView';
import { Message } from '../types';

// Sample document for demo (hardcoded)
const SAMPLE_DOCUMENT = `# Business Request: Purchase Order Analysis

## Goal
Analyze the dm_bs_purchase schema to understand supplier relationships.

## Scope
- All FACT and DIM tables in gold layer
- Focus on purchase_order entity

## Expected Outputs
- ER diagram showing relationships
- Data quality assessment
- Business glossary mapping
`;

export function Layout() {
  const {
    sessionId,
    messages,
    isLoading,
    metrics,
    initSession,
    addMessage,
    updatePartialMessage,
    setDiagram,
    setMetrics,
    setConnected,
    setLoading,
  } = useChatStore();

  const hasMessages = messages.length > 0;

  // Initialize session on mount
  useEffect(() => {
    if (!sessionId) {
      initSession();
    }
  }, [sessionId, initSession]);

  // WebSocket handlers
  const handleMessage = useCallback((message: Message) => {
    if (message.type === 'agent_partial') {
      updatePartialMessage(message.content);
    } else if (message.type === 'user') {
      // Ignore user echo from WebSocket - we already added it locally
      return;
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

  const handleMetrics = useCallback((metrics: import('../types').PipelineMetrics) => {
    setMetrics(metrics);
  }, [setMetrics]);

  const handleConnected = useCallback((connected: boolean) => {
    setConnected(connected);
  }, [setConnected]);

  // WebSocket connection
  const { sendMessage: wsSendMessage } = useWebSocket({
    sessionId: sessionId || '',
    onMessage: handleMessage,
    onDiagram: handleDiagram,
    onMetrics: handleMetrics,
    onConnected: handleConnected,
  });

  // Unified send message handler
  const handleSend = useCallback((content: string) => {
    if (!content.trim()) return;

    // Add user message to store
    addMessage({
      id: crypto.randomUUID(),
      type: 'user',
      content,
      timestamp: new Date(),
    });

    // Set loading state
    setLoading(true);

    // Send via WebSocket
    wsSendMessage(content);
  }, [addMessage, setLoading, wsSendMessage]);

  // Handle load document from InitialView
  const handleLoadDocument = () => {
    // Store document in session storage
    sessionStorage.setItem('mcop_document', SAMPLE_DOCUMENT);

    // Send initial message
    handleSend('Document loaded. Analyze the dm_bs_purchase schema.');
  };

  // Show InitialView when no messages (FE-001)
  if (!hasMessages) {
    return (
      <InitialView
        onSubmit={handleSend}
        onLoadDocument={handleLoadDocument}
        isLoading={isLoading}
      />
    );
  }

  // Show split layout with Chat and Canvas
  return (
    <div className="h-screen flex bg-white">
      {/* Chat Panel - Left */}
      <div className="w-1/2 min-w-[400px] max-w-[600px] flex-shrink-0">
        <ChatPanel onSend={handleSend} />
      </div>

      {/* Canvas - Right */}
      <div className="flex-1 min-w-[400px]">
        <Canvas metrics={metrics} />
      </div>
    </div>
  );
}
