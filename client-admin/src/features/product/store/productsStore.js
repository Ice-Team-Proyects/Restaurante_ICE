import { create } from 'zustand';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
} from '../api/products.api.js';

export const useProductsStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const res = await getProducts();
      set({ products: res.data.data || [], loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Error al obtener los productos',
        loading: false,
      });
    }
  },

  addProduct: async (formData) => {
    try {
      set({ loading: true, error: null });
      const res = await createProduct(formData);
      set({ products: [res.data.data, ...get().products], loading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al crear el producto';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  editProduct: async (id, formData) => {
    try {
      set({ loading: true, error: null });
      const res = await updateProduct(id, formData);
      set({
        products: get().products.map((p) => (p._id === id ? res.data.data : p)),
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al actualizar el producto';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  removeProduct: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteProduct(id);
      set({
        products: get().products.map((p) =>
          p._id === id ? { ...p, isActive: false } : p
        ),
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al eliminar el producto';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  activateProduct: async (id) => {
    try {
      set({ loading: true, error: null });
      const res = await restoreProduct(id);
      set({
        products: get().products.map((p) => (p._id === id ? res.data.data : p)),
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al restaurar el producto';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },
}));