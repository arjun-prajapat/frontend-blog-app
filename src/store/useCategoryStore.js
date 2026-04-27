import { create } from 'zustand';
import { api } from '../lib/api';

export const useCategoryStore = create((set) => ({
  categories: [],
  isLoading: false,

  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/categories');
      set({ categories: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error(error);
    }
  },

  createCategory: async (data) => {
    try {
      const response = await api.post('/categories', data);
      set((state) => ({ categories: [...state.categories, response.data] }));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCategory: async (id, data) => {
    try {
      const response = await api.patch(`/categories/${id}`, data);
      set((state) => ({
        categories: state.categories.map((cat) => (cat.id === id ? response.data : cat)),
      }));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== id),
      }));
    } catch (error) {
      throw error;
    }
  },
}));
