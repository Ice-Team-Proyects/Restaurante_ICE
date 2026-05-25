import { create } from 'zustand';
import { getTablesRequest } from '../api/tableApi';

export const useTableStore = create((set) => ({
    tables: [],
    loading: false,
    error: null,

    fetchTables: async () => {
        set({ loading: true, error: null });
        try {
            const res = await getTablesRequest();
            set({
                tables: res.data.data || res.data,
                loading: false,
            });
        } catch (err) {
            set({
                error: err.response?.data?.message || 'Error fetching tables',
                loading: false,
            });
        }
    },

    getTableById: (id) => {
        const table = (state) => state.tables.find((t) => t._id === id);
        return table;
    },

    clearError: () => set({ error: null }),
}));
