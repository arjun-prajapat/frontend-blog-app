import { create } from 'zustand';
import { api } from '../lib/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/login', credentials);
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      set({ token: access_token, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (data) => {
    set({ isLoading: true });
    try {
      await api.post('/auth/signup', data);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      set({ user: response.data, isAuthenticated: true });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
