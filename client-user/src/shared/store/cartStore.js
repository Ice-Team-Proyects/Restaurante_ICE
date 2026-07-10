// c:/neww/Restaurante_ICE/client-user/src/shared/store/cartStore.js
import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  items: [], // elements format: { product: { _id, saucer, price, ... }, quantity }

  addItem: (product, quantity = 1) => {
    const currentItems = get().items;
    const existing = currentItems.find((item) => item.product._id === product._id);

    if (existing) {
      set({
        items: currentItems.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      });
    } else {
      set({ items: [...currentItems, { product, quantity }] });
    }
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set({
      items: get().items.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      ),
    });
  },

  removeItem: (productId) => {
    set({
      items: get().items.filter((item) => item.product._id !== productId),
    });
  },

  clearCart: () => set({ items: [] }),

  getTotalAmount: () => {
    return get().items.reduce(
      (sum, item) => sum + (item.product.price || 0) * item.quantity,
      0
    );
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
