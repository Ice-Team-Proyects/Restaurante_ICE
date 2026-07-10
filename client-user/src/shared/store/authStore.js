// c:/neww/Restaurante_ICE/client-user/src/shared/store/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setHasHydrated: (val) => set({ _hasHydrated: val }),

      setAccessToken: (token) => set({ token, isAuthenticated: !!token }),

      updateUser: (user) => set({ user }),

      login: async (accessToken, user, refreshToken) => {
        try {
          if (refreshToken) {
            await SecureStore.setItemAsync("refreshToken", refreshToken);
          }
          set({ token: accessToken, user, isAuthenticated: true });
        } catch (error) {
          console.error("Error al guardar token de refresco:", error);
          set({ token: accessToken, user, isAuthenticated: true });
        }
      },

      logout: async () => {
        try {
          await SecureStore.deleteItemAsync("refreshToken");
        } catch (error) {
          console.error("Error al eliminar token de refresco:", error);
        } finally {
          set({ token: null, user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "ice-auth-storage",
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);
