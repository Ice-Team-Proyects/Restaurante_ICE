import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_ADMIN_URL,
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem("ice-customer-auth");
    if (stored) {
      const { state } = JSON.parse(stored);
      if (state?.token) config.headers.Authorization = `Bearer ${state.token}`;
    }
  } catch (_) {}
  return config;
});

export default instance;
