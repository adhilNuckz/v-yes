import { create } from 'zustand';
import authService from '../services/authService';

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  // Initialize auth state
  initAuth: async () => {
    try {
      set({ loading: true });
      const user = await authService.getCurrentUser();
      set({ user, loading: false, error: null });
    } catch (error) {
      set({ user: null, loading: false, error: error.message });
    }
  },

  // Login
  login: async (credentials) => {
    try {
      set({ loading: true, error: null });
      await authService.login(credentials);
      const user = await authService.getCurrentUser();
      set({ user, loading: false });
      return user;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // Sign up
  signup: async (userData) => {
    try {
      set({ loading: true, error: null });
      await authService.createAccount(userData);
      const user = await authService.getCurrentUser();
      set({ user, loading: false });
      return user;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // Login with GitHub
  loginWithGithub: async () => {
    try {
      set({ loading: true, error: null });
      await authService.loginWithGithub();
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await authService.logout();
      set({ user: null, error: null });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
