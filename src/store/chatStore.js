import { create } from 'zustand';
import chatService from '../services/chatService';

export const useChatStore = create((set, get) => ({
  messages: [],
  loading: false,
  error: null,
  realtimeSubscription: null,

  // Send message
  sendMessage: async (messageData) => {
    try {
      await chatService.sendMessage(messageData);
      // Real-time will add the message
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Get messages
  getMessages: async (workspaceId) => {
    try {
      set({ loading: true, error: null });
      const response = await chatService.getMessages(workspaceId);
      // Reverse to show oldest first
      set({ messages: response.documents.reverse(), loading: false });
      return response.documents;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // Subscribe to messages
  subscribeToMessages: (workspaceId) => {
    const unsubscribe = get().realtimeSubscription;
    if (unsubscribe) unsubscribe();

    const subscription = chatService.subscribeToMessages(workspaceId, (response) => {
      if (response.events.includes('databases.*.collections.*.documents.*.create')) {
        set((state) => ({
          messages: [...state.messages, response.payload],
        }));
      }
    });

    set({ realtimeSubscription: () => subscription() });
  },

  // Unsubscribe from messages
  unsubscribeFromMessages: () => {
    const unsubscribe = get().realtimeSubscription;
    if (unsubscribe) {
      unsubscribe();
      set({ realtimeSubscription: null });
    }
  },

  // Clear messages
  clearMessages: () => set({ messages: [] }),

  // Clear error
  clearError: () => set({ error: null }),
}));
