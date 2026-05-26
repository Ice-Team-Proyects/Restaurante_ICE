import adminAxios from './axios';
import axios from 'axios';

// ══════════════════════════════════════════════════════════════════════════
// AUTH ENDPOINTS  (servidor .NET → VITE_AUTH_URL)
// ══════════════════════════════════════════════════════════════════════════
const authAxios = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
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

// ══════════════════════════════════════════════════════════════════════════
// RESTAURANT ENDPOINTS  (servidor Node → VITE_ADMIN_URL)
// ══════════════════════════════════════════════════════════════════════════
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

// ══════════════════════════════════════════════════════════════════════════
// PRODUCT ENDPOINTS
// ══════════════════════════════════════════════════════════════════════════
export const getProductsRequest = async () => {
  return await adminAxios.get('/product?limit=100');
};

// ══════════════════════════════════════════════════════════════════════════
// MENU ENDPOINTS
// ══════════════════════════════════════════════════════════════════════════
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