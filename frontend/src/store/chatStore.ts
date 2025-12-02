import { create } from 'zustand';
import { Message, PipelineMetrics, ViewMode } from '../types';

interface ChatStore {
  sessionId: string | null;
  isConnected: boolean;
  messages: Message[];
  diagram: string | null;
  metrics: PipelineMetrics | null;
  canvasView: ViewMode;
  isLoading: boolean;
  error: string | null;

  initSession: () => void;
  addMessage: (message: Message) => void;
  updatePartialMessage: (content: string) => void;
  setDiagram: (diagram: string) => void;
  setMetrics: (metrics: PipelineMetrics) => void;
  setCanvasView: (view: ViewMode) => void;
  setConnected: (connected: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  sessionId: null,
  isConnected: false,
  messages: [],
  diagram: null,
  metrics: null,
  canvasView: 'diagram',
  isLoading: false,
  error: null,

  initSession: () => {
    const sessionId = crypto.randomUUID();
    set({ sessionId, messages: [], diagram: null, error: null });
  },

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages.filter(m => m.type !== 'agent_partial'), message],
      isLoading: message.type === 'user',
    }));
  },

  updatePartialMessage: (content) => {
    set((state) => {
      const messages = [...state.messages];
      const partialIndex = messages.findIndex(m => m.type === 'agent_partial');

      if (partialIndex >= 0) {
        messages[partialIndex] = { ...messages[partialIndex], content };
      } else {
        messages.push({
          id: 'partial',
          type: 'agent_partial',
          content,
          timestamp: new Date(),
        });
      }

      return { messages, isLoading: true };
    });
  },

  setDiagram: (diagram) => set({ diagram }),
  setMetrics: (metrics) => set({ metrics }),
  setCanvasView: (canvasView) => set({ canvasView }),
  setConnected: (isConnected) => set({ isConnected }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  clearMessages: () => set({ messages: [], diagram: null, metrics: null }),
}));
