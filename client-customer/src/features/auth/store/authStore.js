import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  loginRequest,
  registerRequest,
  verifyEmailRequest,
} from "../../../shared/api/api";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      checkAuth: () => {
        const token = get().token;
        set({ isAuthenticated: Boolean(token) });
      },

      login: async ({ email, password }) => {
        if (!email || !password) {
          return {
            success: false,
            error: "Correo y contraseña son requeridos.",
          };
        }
        try {
          const response = await loginRequest(email, password);
          const { success, message, token, userDetails } = response.data;
          if (success && token) {
            set({
              user: {
                id: userDetails?.id,
                username: userDetails?.username,
                role: userDetails?.role,
                email: email,
              },
              token: token,
              isAuthenticated: true,
            });
            return { success: true, message };
          } else {
            return {
              success: false,
              error: message || "Error al iniciar sesión",
            };
          }
        } catch (error) {
          const errorMsg =
            error.response?.data?.message ||
            error.message ||
            "Error de conexión";
          return { success: false, error: errorMsg };
        }
      },

      register: async ({ name, surname, username, email, password, phone }) => {
        try {
          const formData = new FormData();
          formData.append("Name", name);
          formData.append("Surname", surname || "");
          formData.append("Username", username);
          formData.append("Email", email);
          formData.append("Password", password);
          formData.append("Phone", phone || "");
          const response = await registerRequest(formData);
          const { success, message } = response.data;
          if (success) {
            return {
              success: true,
              message: message || "Registrado. Verifica tu email.",
              requiresVerification: true,
              email,
            };
          } else {
            return { success: false, error: message || "Error al registrarse" };
          }
        } catch (error) {
          const errorMsg =
            error.response?.data?.message ||
            error.message ||
            "Error de conexión";
          return { success: false, error: errorMsg };
        }
      },

      verifyEmail: async (token) => {
        try {
          const response = await verifyEmailRequest(token);
          const { success, message } = response.data;
          return success
            ? { success: true, message: message || "Email verificado" }
            : { success: false, error: message || "Token inválido" };
        } catch (error) {
          return {
            success: false,
            error: error.response?.data?.message || "Error de conexión",
          };
        }
      },

      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: "ice-customer-auth" },
  ),
);
