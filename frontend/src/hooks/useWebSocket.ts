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

  useEffect(() => {
    if (!sessionId) return;

    const connect = () => {
      const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:8000'}/ws/${sessionId}`;
      console.log('Connecting to WebSocket:', wsUrl);

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        onConnected?.(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message:', data);

          // Check for diagram in response
          if (data.diagram && onDiagram) {
            onDiagram(data.diagram);
          }

          const message: Message = {
            id: crypto.randomUUID(),
            type: data.type,
            content: data.content,
            timestamp: new Date(),
            toolName: data.tool_name,
          };

          onMessage(message);
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        onConnected?.(false);

        // Attempt reconnect after 3 seconds
        reconnectTimeoutRef.current = window.setTimeout(() => {
          console.log('Attempting reconnect...');
          connect();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      wsRef.current?.close();
    };
  }, [sessionId, onMessage, onDiagram, onConnected]);

  const sendMessage = useCallback((content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ content }));
      return true;
    }
    console.warn('WebSocket not connected');
    return false;
  }, []);

  return { isConnected, sendMessage };
}
