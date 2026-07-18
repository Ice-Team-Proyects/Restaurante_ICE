import adminAxios from './axios';
import axios from 'axios';

const authAxios = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

authAxios.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('ice-auth');
    if (stored) {
      const { state } = JSON.parse(stored);
      if (state?.token) config.headers.Authorization = `Bearer ${state.token}`;
    }
  } catch (_) {}
  return config;
});

export const loginRequest = async (emailOrUsername, password) => {
  return await authAxios.post('/auth/login', { emailOrUsername, password });
};

export const registerRequest = async (formData) => {
  return await authAxios.post('/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const verifyEmailRequest = async (token) => {
  return await authAxios.post('/auth/verify-email', { token });
};

export const resendVerificationRequest = async (email) => {
  return await authAxios.post('/auth/resend-verification', { email });
};

export const getRestaurantsRequest = async () => {
  return await adminAxios.get('/restaurant');
};

export const createRestaurantRequest = async (restaurantData) => {
  return await adminAxios.post('/restaurant', restaurantData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteRestaurantRequest = async (id) => {
  return await adminAxios.patch(`/restaurant/delete/${id}`);
};

export const restoreRestaurantRequest = async (id) => {
  return await adminAxios.patch(`/restaurant/restore/${id}`);
};

export const updateRestaurantRequest = async (id, restaurantData) => {
  return await adminAxios.put(`/restaurant/${id}`, restaurantData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getProductsRequest = async () => {
  return await adminAxios.get('/product?limit=100');
};

export const getMenusRequest = async () => {
  return await adminAxios.get('/menu');
};

export const createMenuRequest = async (menuData) => {
  return await adminAxios.post('/menu', menuData);
};

export const updateMenuRequest = async (id, menuData) => {
  return await adminAxios.put(`/menu/${id}`, menuData);
};

export const deleteMenuRequest = async (id) => {
  return await adminAxios.patch(`/menu/delete/${id}`);
};

export const restoreMenuRequest = async (id) => {
  return await adminAxios.patch(`/menu/restore/${id}`);
};

// --- USER & PROFILE ENDPOINTS ---
export const getProfileRequest = async () => {
  return await authAxios.get('/users/me');
};

export const getAllUsersRequest = async () => {
  return await authAxios.get('/users');
};

export const createUserRequest = async (userData) => {
  return await authAxios.post('/users', userData);
};

export const updateUserRequest = async (id, userData) => {
  return await authAxios.put(`/users/${id}`, userData);
};

export const deleteUserRequest = async (id) => {
  return await authAxios.delete(`/users/${id}`);
};

export const changePasswordRequest = async (passwordData) => {
  return await authAxios.post('/users/change-password', passwordData);
};

export const deleteAccountRequest = async () => {
  return await authAxios.delete('/users/delete-account');
};
