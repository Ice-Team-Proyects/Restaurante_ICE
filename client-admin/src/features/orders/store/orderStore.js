import { create } from 'zustand';
import { getOrdersRequest, createOrderRequest, updateOrderRequest, deleteOrderRequest } from '../api/orderApi';

export const useOrderStore = create((set) => ({
  orders: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10,
  },

  // Fetch orders
  fetchOrders: async (page = 1, limit = 10, status = null) => {
    set({ loading: true, error: null });
    try {
      const res = await getOrdersRequest(page, limit, status);
      set({
        orders: res.data.data,
        pagination: res.data.pagination,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Error fetching orders',
        loading: false,
      });
    }
  },

  // Create order
  createOrder: async (orderData) => {
    set({ loading: true, error: null });
    try {
      const res = await createOrderRequest(orderData);
      set((state) => ({
        orders: [res.data.data, ...state.orders],
        loading: false,
      }));
      return res.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error creating order';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Update order
  updateOrder: async (id, orderData) => {
    set({ loading: true, error: null });
    try {
      const res = await updateOrderRequest(id, orderData);
      set((state) => ({
        orders: state.orders.map((order) => (order._id === id ? res.data.data : order)),
        loading: false,
      }));
      return res.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error updating order';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Delete order (soft delete)
  deleteOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteOrderRequest(id);
      set((state) => ({
        orders: state.orders.filter((order) => order._id !== id),
        loading: false,
      }));
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error deleting order';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
