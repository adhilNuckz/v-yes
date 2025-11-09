import { create } from 'zustand';
import codeSessionService from '../services/codeSessionService';

export const useCodeSessionStore = create((set, get) => ({
  sessions: [],
  currentSession: null,
  loading: false,
  error: null,
  realtimeSubscriptions: {},

  // Create code session
  createCodeSession: async (sessionData) => {
    try {
      set({ loading: true, error: null });
      const session = await codeSessionService.createCodeSession(sessionData);
      set((state) => ({
        sessions: [session, ...state.sessions],
        currentSession: session,
        loading: false,
      }));
      
      // Subscribe to the new session
      get().subscribeToCodeSession(session.$id);
      
      return session;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // Get workspace code sessions
  getWorkspaceCodeSessions: async (workspaceId) => {
    try {
      set({ loading: true, error: null });
      const response = await codeSessionService.getWorkspaceCodeSessions(workspaceId);
      set({ sessions: response.documents, loading: false });
      return response.documents;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // Update code
  updateCode: async (sessionId, code) => {
    try {
      await codeSessionService.updateCode(sessionId, code);
      // Real-time will update the state
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Update cursor position
  updateCursorPosition: async (sessionId, userId, position) => {
    try {
      await codeSessionService.updateCursorPosition(sessionId, userId, position);
    } catch (error) {
      console.error('Error updating cursor:', error);
    }
  },

  // Update selection
  updateSelection: async (sessionId, userId, selection) => {
    try {
      await codeSessionService.updateSelection(sessionId, userId, selection);
    } catch (error) {
      console.error('Error updating selection:', error);
    }
  },

  // Subscribe to code session
  subscribeToCodeSession: (sessionId) => {
    const subscriptions = get().realtimeSubscriptions;
    
    // Unsubscribe if already subscribed
    if (subscriptions[sessionId]) {
      subscriptions[sessionId]();
    }

    const subscription = codeSessionService.subscribeToCodeSession(sessionId, (response) => {
      if (response.events.includes('databases.*.collections.*.documents.*.update')) {
        // Update the session in the store
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.$id === sessionId ? response.payload : s
          ),
          currentSession:
            state.currentSession?.$id === sessionId
              ? response.payload
              : state.currentSession,
        }));
      }
    });

    set((state) => ({
      realtimeSubscriptions: {
        ...state.realtimeSubscriptions,
        [sessionId]: () => subscription(),
      },
    }));
  },

  // Unsubscribe from code session
  unsubscribeFromCodeSession: (sessionId) => {
    const subscriptions = get().realtimeSubscriptions;
    if (subscriptions[sessionId]) {
      subscriptions[sessionId]();
      const { [sessionId]: removed, ...rest } = subscriptions;
      set({ realtimeSubscriptions: rest });
    }
  },

  // Set current session
  setCurrentSession: (session) => {
    set({ currentSession: session });
    if (session) {
      get().subscribeToCodeSession(session.$id);
    }
  },

  // Delete code session
  deleteCodeSession: async (sessionId) => {
    try {
      await codeSessionService.deleteCodeSession(sessionId);
      get().unsubscribeFromCodeSession(sessionId);
      set((state) => ({
        sessions: state.sessions.filter((s) => s.$id !== sessionId),
        currentSession:
          state.currentSession?.$id === sessionId ? null : state.currentSession,
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
