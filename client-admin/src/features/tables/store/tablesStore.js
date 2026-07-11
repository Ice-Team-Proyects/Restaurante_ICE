import { create } from 'zustand';
import {
  getTables,
  createTable,
  updateTable,
  deleteTable,
  restoreTable,
} from '../api/tables.api.js';

export const useTablesStore = create((set, get) => ({
  tables: [],
  loading: false,
  error: null,

  fetchTables: async (params = {}) => {
    try {
      set({ loading: true, error: null });
      const res = await getTables(params);
      set({ tables: res.data.data || [], loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Error al obtener las mesas',
        loading: false,
      });
    }
  },

  addTable: async (data) => {
    try {
      set({ loading: true, error: null });
      const res = await createTable(data);
      set({ tables: [res.data.data, ...get().tables], loading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al crear la mesa';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  editTable: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const res = await updateTable(id, data);
      set({
        tables: get().tables.map((t) => (t._id === id ? res.data.data : t)),
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al actualizar la mesa';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  removeTable: async (id) => {
    try {
      set({ loading: true, error: null });
      const res = await deleteTable(id);
      set({
        tables: get().tables.map((t) =>
          t._id === id ? res.data.data : t
        ),
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al eliminar la mesa';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  activateTable: async (id) => {
    try {
      set({ loading: true, error: null });
      const res = await restoreTable(id);
      set({
        tables: get().tables.map((t) => (t._id === id ? res.data.data : t)),
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al restaurar la mesa';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Optimistic local status update (for quick UI feedback)
  setTableStatus: (id, status) => {
    set({
      tables: get().tables.map((t) =>
        t._id === id ? { ...t, status } : t
      ),
    });
  },
}));
