import axios from "axios";

const authAxios = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
});

authAxios.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem("ice-customer-auth");
    if (stored) {
      const { state } = JSON.parse(stored);
      if (state?.token) config.headers.Authorization = `Bearer ${state.token}`;
    }
  } catch (_) {}
  return config;
});

export const loginRequest = async (emailOrUsername, password) => {
  return await authAxios.post("/auth/login", { emailOrUsername, password });
};

export const registerRequest = async (formData) => {
  return await authAxios.post("/auth/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const verifyEmailRequest = async (token) => {
  return await authAxios.post("/auth/verify-email", { token });
};

export const getProfileRequest = async () => {
  return await authAxios.get("/users/me");
};

export const changePasswordRequest = async (passwordData) => {
  return await authAxios.post("/users/change-password", passwordData);
};

export const deleteAccountRequest = async () => {
  return await authAxios.delete("/users/delete-account");
};
