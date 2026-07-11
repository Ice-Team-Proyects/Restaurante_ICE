import { create } from 'zustand';
import { getProductsRequest } from '../api/productApi';

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  // Fetch products
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getProductsRequest(1, 200);
      // Handle different response structures from the API
      const productsList = res.data.data || res.data.products || res.data;
      set({
        products: Array.isArray(productsList) ? productsList : [],
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Error fetching products',
        loading: false,
      });
    }
  },

  // Get product by ID
  getProductById: (id) => {
    const state = useProductStore.getState();
    return state.products.find((p) => p._id === id);
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
