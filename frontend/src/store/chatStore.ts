import { create } from 'zustand';
import { Message } from '../types';

interface ChatStore {
  sessionId: string | null;
  isConnected: boolean;
  messages: Message[];
  diagram: string | null;
  isLoading: boolean;
  error: string | null;

  initSession: () => void;
  addMessage: (message: Message) => void;
  updatePartialMessage: (content: string) => void;
  setDiagram: (diagram: string) => void;
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
  setConnected: (isConnected) => set({ isConnected }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  clearMessages: () => set({ messages: [], diagram: null }),
}));
