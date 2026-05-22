import { create } from 'zustand';
import { getRestaurantsRequest, createRestaurantRequest, deleteRestaurantRequest, updateRestaurantRequest, restoreRestaurantRequest } from '../../../shared/api/api';

export const useRestaurantStore = create((set, get) => ({
  restaurants: [],
  selectedRestaurant: null,
  loading: false,
  isModalOpen: false,

  fetchRestaurants: async () => {
    set({ loading: true });
    try {
      const response = await getRestaurantsRequest();
      const rawData = response?.data?.data ?? response?.data;
      const restaurants = Array.isArray(rawData)
        ? rawData
        : Array.isArray(response?.data?.restaurants)
          ? response.data.restaurants
          : [];

      if (!Array.isArray(rawData) && !Array.isArray(response?.data?.restaurants)) {
        console.warn('[RestaurantStore] fetchRestaurants returned unexpected data shape:', response?.data);
      }

      set({ restaurants, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },

  createRestaurant: async (restaurantData) => {
    set({ loading: true });
    try {
      await createRestaurantRequest(restaurantData);
      await get().fetchRestaurants();
      set({ loading: false, isModalOpen: false });
      return true;
    } catch (error) {
      console.error(error);
      set({ loading: false });
      return false;
    }
  },

  updateRestaurant: async (id, restaurantData) => {
    set({ loading: true });
    try {
      await updateRestaurantRequest(id, restaurantData);
      await get().fetchRestaurants();
      set({ loading: false, isModalOpen: false, selectedRestaurant: null });
      return true;
    } catch (error) {
      console.error(error);
      set({ loading: false });
      return false;
    }
  },

  deleteRestaurant: async (id) => {
    try {
      const res = await deleteRestaurantRequest(id);
      set((state) => ({
        restaurants: state.restaurants.map((r) => r._id === id ? res.data.data : r)
      }));
    } catch (error) {
      console.error(error);
    }
  },

  restoreRestaurant: async (id) => {
    try {
      const res = await restoreRestaurantRequest(id);
      set((state) => ({
        restaurants: state.restaurants.map((r) => r._id === id ? res.data.data : r)
      }));
    } catch (error) {
      console.error(error);
    }
  },

  setRestaurants: (restaurants) => set({ restaurants }),
  setSelectedRestaurant: (restaurant) => set({ selectedRestaurant: restaurant }),
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
}));