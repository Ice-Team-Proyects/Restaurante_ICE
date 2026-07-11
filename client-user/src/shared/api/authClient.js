// c:/neww/Restaurante_ICE/client-user/src/shared/api/authClient.js
import axios from "axios";
import { ENDPOINTS } from "../constants/endpoints.js";
import { useAuthStore } from "../store/authStore.js";
import * as SecureStore from "expo-secure-store";

export const authClient = axios.create({
  baseURL: ENDPOINTS.AUTH,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor de Petición: Inyectar Token Bearer
authClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Respuesta: Manejo de 401 y Refresco de Token
authClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Excluir endpoints públicos de la renovación de token
    const publicEndpoints = [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
      "/verify-email",
      "/resend-verification",
    ];

    const isPublic = publicEndpoints.some((endpoint) =>
      originalRequest.url?.includes(endpoint)
    );

    if (error.response?.status === 401 && !originalRequest._retry && !isPublic) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return authClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token stored");
        }

        // Llamada POST a ENDPOINTS.AUTH + "/refresh"
        const refreshResponse = await axios.post(`${ENDPOINTS.AUTH}/refresh`, {
          refreshToken,
        });

        const { accessToken, token, refreshToken: newRefreshToken } = refreshResponse.data;
        const newToken = accessToken || token;

        if (!newToken) {
          throw new Error("Refresh token request did not return a new access token");
        }

        // Actualizar store y secure store
        useAuthStore.getState().setAccessToken(newToken);
        if (newRefreshToken) {
          await SecureStore.setItemAsync("refreshToken", newRefreshToken);
        }

        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return authClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
