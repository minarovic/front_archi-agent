import { useCallback, useEffect, useRef, useState } from 'react';
import { Message } from '../types';

interface UseWebSocketOptions {
  sessionId: string;
  onMessage: (message: Message) => void;
  onDiagram?: (diagram: string) => void;
  onConnected?: (connected: boolean) => void;
}

export function useWebSocket({
  sessionId,
  onMessage,
  onDiagram,
  onConnected
}: UseWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  // Store callbacks in refs to avoid reconnection on callback changes
  const onMessageRef = useRef(onMessage);
  const onDiagramRef = useRef(onDiagram);
  const onConnectedRef = useRef(onConnected);

  // Update refs when callbacks change
  useEffect(() => {
    onMessageRef.current = onMessage;
    onDiagramRef.current = onDiagram;
    onConnectedRef.current = onConnected;
  }, [onMessage, onDiagram, onConnected]);

  useEffect(() => {
    if (!sessionId) return;

    const connect = () => {
      const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:8000'}/ws/${sessionId}`;
      console.log('🔌 Connecting to WebSocket:', wsUrl);

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        onConnectedRef.current?.(true);
      };

      ws.onmessage = (event) => {
        try {
          console.log('📨 WebSocket RAW:', event.data);
          const data = JSON.parse(event.data);
          console.log('📨 WebSocket PARSED:', data.type, data.content?.substring(0, 80));

          // Check for diagram in response
          if (data.diagram && onDiagramRef.current) {
            console.log('📊 Diagram received');
            onDiagramRef.current(data.diagram);
          }

          const message: Message = {
            id: crypto.randomUUID(),
            type: data.type,
            content: data.content,
            timestamp: new Date(),
            toolName: data.tool_name,
          };

          // Log when we get final agent message
          if (data.type === 'agent') {
            console.log('✅ GOT FINAL AGENT MESSAGE - should clear Thinking state');
          }

          onMessageRef.current(message);
        } catch (err) {
          console.error('❌ Failed to parse WebSocket message:', err, event.data);
        }
      };

      ws.onclose = (event) => {
        console.log('🔌 WebSocket disconnected, code:', event.code, 'reason:', event.reason);
        setIsConnected(false);
        onConnectedRef.current?.(false);

        // Attempt reconnect after 3 seconds
        reconnectTimeoutRef.current = window.setTimeout(() => {
          console.log('🔄 Attempting reconnect...');
          connect();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
      };
    };

    connect();

    return () => {
      console.log('🧹 Cleaning up WebSocket connection');
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      wsRef.current?.close();
    };
  }, [sessionId]); // Only reconnect when sessionId changes!

  const sendMessage = useCallback((content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('📤 Sending message:', content.substring(0, 50));
      wsRef.current.send(JSON.stringify({ content }));
      return true;
    }
    console.warn('⚠️ WebSocket not connected, cannot send');
    return false;
  }, []);

  return { isConnected, sendMessage };
}
