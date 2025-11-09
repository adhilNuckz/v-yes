import { create } from 'zustand';
import workspaceService from '../services/workspaceService';

export const useWorkspaceStore = create((set, get) => ({
  currentWorkspace: null,
  workspaces: [],
  loading: false,
  error: null,
  realtimeSubscription: null,

  // Create workspace
  createWorkspace: async (workspaceData) => {
    try {
      set({ loading: true, error: null });
      const workspace = await workspaceService.createWorkspace(workspaceData);
      set((state) => ({
        workspaces: [workspace, ...state.workspaces],
        currentWorkspace: workspace,
        loading: false,
      }));
      return workspace;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // Get workspace
  getWorkspace: async (workspaceId) => {
    try {
      set({ loading: true, error: null });
      const workspace = await workspaceService.getWorkspace(workspaceId);
      set({ currentWorkspace: workspace, loading: false });
      return workspace;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // Get user workspaces
  getUserWorkspaces: async (userId) => {
    try {
      set({ loading: true, error: null });
      const response = await workspaceService.getUserWorkspaces(userId);
      set({ workspaces: response.documents, loading: false });
      return response.documents;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // Join workspace
  joinWorkspace: async (workspaceId, userId, userName) => {
    try {
      set({ loading: true, error: null });
      const workspace = await workspaceService.joinWorkspace(workspaceId, userId, userName);
      set({ currentWorkspace: workspace, loading: false });
      return workspace;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // Leave workspace
  leaveWorkspace: async (workspaceId, userId) => {
    try {
      await workspaceService.leaveWorkspace(workspaceId, userId);
      set({ currentWorkspace: null });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Delete workspace (owner only)
  deleteWorkspace: async (workspaceId) => {
    try {
      set({ loading: true, error: null });
      await workspaceService.deleteWorkspace(workspaceId);
      set((state) => ({
        workspaces: state.workspaces.filter(w => w.$id !== workspaceId),
        currentWorkspace: null,
        loading: false,
      }));
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // Update workspace settings
  updateWorkspaceSettings: async (workspaceId, settings) => {
    try {
      const workspace = await workspaceService.updateWorkspaceSettings(workspaceId, settings);
      set({ currentWorkspace: workspace });
      return workspace;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Subscribe to workspace updates
  subscribeToWorkspace: (workspaceId) => {
    const unsubscribe = get().realtimeSubscription;
    if (unsubscribe) unsubscribe();

    const subscription = workspaceService.subscribeToWorkspace(workspaceId, (response) => {
      if (response.events.includes('databases.*.collections.*.documents.*.update')) {
        set({ currentWorkspace: response.payload });
      }
    });

    set({ realtimeSubscription: () => subscription() });
  },

  // Unsubscribe from workspace updates
  unsubscribeFromWorkspace: () => {
    const unsubscribe = get().realtimeSubscription;
    if (unsubscribe) {
      unsubscribe();
      set({ realtimeSubscription: null });
    }
  },

  // Set current workspace
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),

  // Clear error
  clearError: () => set({ error: null }),
}));
