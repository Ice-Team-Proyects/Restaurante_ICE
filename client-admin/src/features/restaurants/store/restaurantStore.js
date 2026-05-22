import { create } from 'zustand';
import axios from 'axios';
import { deleteRestaurantRequest } from '../../../shared/api/api';

const BACKEND_URL = 'http://localhost:3021/RestauranteICE/v1/restaurant';

export const useRestaurantStore = create((set, get) => ({
  restaurants: [],
  selectedRestaurant: null,
  loading: false,
  isModalOpen: false,

  fetchRestaurants: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(BACKEND_URL);
      
      const incomingData = response.data?.data || response.data?.restaurants || response.data;
      const validatedRestaurants = Array.isArray(incomingData) ? incomingData : [];
      
      set({ restaurants: validatedRestaurants, loading: false });
    } catch (error) {
      console.error("Error al listar restaurantes desde el puerto 3021:", error);
      set({ restaurants: [], loading: false });
    }
  },

  createRestaurant: async (restaurantData) => {
    set({ loading: true });
    try {
      await axios.post(BACKEND_URL, restaurantData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await get().fetchRestaurants();
      set({ loading: false, isModalOpen: false });
      return true;
    } catch (error) {
      console.error("Error al crear restaurante con la ruta de Postman:", error);
      set({ loading: false });
      return false;
    }
  },

  deleteRestaurant: async (id) => {
    try {
      await deleteRestaurantRequest(id);
      set((state) => ({
        restaurants: Array.isArray(state.restaurants) 
          ? state.restaurants.filter((restaurant) => restaurant._id !== id)
          : []
      }));
    } catch (error) {
      console.error(error);
    }
  },

  setRestaurants: (restaurants) => set({ restaurants: Array.isArray(restaurants) ? restaurants : [] }),
  setSelectedRestaurant: (restaurant) => set({ selectedRestaurant: restaurant }),
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
}));