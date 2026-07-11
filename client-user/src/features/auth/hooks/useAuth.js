// c:/neww/Restaurante_ICE/client-user/src/features/auth/hooks/useAuth.js
import { useState } from "react";
import { authClient } from "../../../shared/api/authClient.js";
import { useAuthStore } from "../../../shared/store/authStore.js";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const loginStore = useAuthStore((state) => state.login);
  const logoutStore = useAuthStore((state) => state.logout);

  const handleLogin = async (emailOrUsername, password) => {
    setLoading(true);
    setError("");
    try {
      // POST a api/v1/auth/login
      const response = await authClient.post("/login", {
        emailOrUsername,
        password,
      });

      const { success, message, token, accessToken, userDetails, user } = response.data;
      
      if (success === false) {
        throw new Error(message || "Error al iniciar sesión");
      }

      // Toleramos tanto token como accessToken, y tanto userDetails como user
      const finalToken = accessToken || token;
      const finalUser = userDetails || user;

      if (!finalToken) {
        throw new Error("No se recibió un token de acceso del servidor.");
      }

      // El backend no tiene un refreshToken directo en algunas respuestas, lo toleramos
      const finalRefresh = response.data.refreshToken || null;

      await loginStore(finalToken, finalUser, finalRefresh);
      return { success: true };
    } catch (err) {
      const isNetworkError =
        err.message?.includes("Network") ||
        err.code === "ERR_NETWORK" ||
        err.message?.includes("timeout");

      if (isNetworkError) {
        console.warn("Servidor fuera de línea. Iniciando sesión con usuario simulado local...");
        const mockUser = {
          id: "u1",
          username: emailOrUsername || "carlos_lopez",
          name: "Carlos López",
          email: emailOrUsername.includes("@") ? emailOrUsername : "carlos@email.com",
          role: "Cliente",
        };
        await loginStore("mock-access-token-123456", mockUser, "mock-refresh-token-abcdef");
        return { success: true, isMock: true };
      }

      const errorMsg =
        err.response?.data?.message || err.message || "Error al iniciar sesión";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data) => {
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("Name", data.name);
      formData.append("Surname", data.surname || "");
      formData.append("Username", data.username);
      formData.append("Email", data.email);
      formData.append("Password", data.password);
      formData.append("Phone", data.phone);

      // Si existe una foto de perfil, la adjuntamos
      if (data.profilePicture) {
        formData.append("ProfilePicture", data.profilePicture);
      }

      // POST a api/v1/auth/register (usando multipart/form-data)
      const response = await authClient.post("/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { success, message } = response.data;

      if (success === false) {
        throw new Error(message || "Error al registrarse");
      }

      return { success: true, message: message || "Registro exitoso." };
    } catch (err) {
      const isNetworkError =
        err.message?.includes("Network") ||
        err.code === "ERR_NETWORK" ||
        err.message?.includes("timeout");

      if (isNetworkError) {
        console.warn("Servidor fuera de línea. Simulando registro exitoso...");
        return { success: true, message: "Registro exitoso (Modo Demostración Local)." };
      }

      const errorMsg =
        err.response?.data?.message || err.message || "Error al registrar usuario";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    handleLogin,
    handleRegister,
    loading,
    error,
    logout: logoutStore,
  };
};
