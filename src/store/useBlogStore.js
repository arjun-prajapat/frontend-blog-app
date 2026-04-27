import { create } from 'zustand';
import { api } from '../lib/api';

export const useBlogStore = create((set) => ({
  blogs: [],
  isLoading: false,

  fetchBlogs: async (search = '', categorySlug = '') => {
    set({ isLoading: true });
    try {
      const response = await api.get('/blogs', {
        params: { search, categorySlug }
      });
      set({ blogs: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error(error);
    }
  },

  createBlog: async (data) => {
    try {
      const response = await api.post('/blogs', data);
      set((state) => ({ blogs: [response.data, ...state.blogs] }));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateBlog: async (id, data) => {
    try {
      const response = await api.patch(`/blogs/${id}`, data);
      set((state) => ({
        blogs: state.blogs.map((blog) => (blog.id === id ? response.data : blog)),
      }));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteBlog: async (id) => {
    try {
      await api.delete(`/blogs/${id}`);
      set((state) => ({
        blogs: state.blogs.filter((blog) => blog.id !== id),
      }));
    } catch (error) {
      throw error;
    }
  },
}));
