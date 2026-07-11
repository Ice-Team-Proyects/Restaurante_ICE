import { create } from 'zustand';
import {
  getAnalytics,
  createAnalytics,
  updateAnalytics,
  deleteAnalytics,
  restoreAnalytics,
} from '../api/analytics.api.js';

export const useAnalyticsStore = create((set, get) => ({
  analytics: [],
  loading: false,
  error: null,

  fetchAnalytics: async () => {
    try {
      set({ loading: true, error: null });
      const res = await getAnalytics();
      set({ analytics: res.data.data || [], loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Error al obtener los análisis',
        loading: false,
      });
    }
  },

  addAnalytics: async (data) => {
    try {
      set({ loading: true, error: null });
      const res = await createAnalytics(data);
      set({ analytics: [res.data.data, ...get().analytics], loading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al crear el análisis';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  editAnalytics: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const res = await updateAnalytics(id, data);
      set({
        analytics: get().analytics.map((a) => (a._id === id ? res.data.data : a)),
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al actualizar el análisis';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  removeAnalytics: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteAnalytics(id);
      set({
        analytics: get().analytics.map((a) => (a._id === id ? { ...a, isActive: false } : a)),
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al eliminar el análisis';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  activateAnalytics: async (id) => {
    try {
      set({ loading: true, error: null });
      const res = await restoreAnalytics(id);
      set({
        analytics: get().analytics.map((a) => (a._id === id ? res.data.data : a)),
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al restaurar el análisis';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },
}));
