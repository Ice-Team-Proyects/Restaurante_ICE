import { create } from 'zustand';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
} from '../api/category.api.js';

export const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    try {
      set({ loading: true, error: null });
      const res = await getCategories();
      set({ categories: res.data.data || [], loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Error al obtener las categorías',
        loading: false,
      });
    }
  },

  addCategory: async (data) => {
    try {
      set({ loading: true, error: null });
      const res = await createCategory(data);
      set({ categories: [res.data.data, ...get().categories], loading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al crear la categoría';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  editCategory: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const res = await updateCategory(id, data);
      set({
        categories: get().categories.map((c) => (c._id === id ? res.data.data : c)),
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al actualizar la categoría';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  removeCategory: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteCategory(id);
      set({
        categories: get().categories.map((c) =>
          c._id === id ? { ...c, isActive: false } : c
        ),
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al eliminar la categoría';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  activateCategory: async (id) => {
    try {
      set({ loading: true, error: null });
      const res = await restoreCategory(id);
      set({
        categories: get().categories.map((c) => (c._id === id ? res.data.data : c)),
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al restaurar la categoría';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },
}));