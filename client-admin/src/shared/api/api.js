import axios from './axios';

// ══════════════════════════════════════════════════════════════════════════
// AUTH ENDPOINTS
// ══════════════════════════════════════════════════════════════════════════

// Crear instancia de axios para autenticación (sin token en Authorization header)
const authAxios = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

export const loginRequest = async (emailOrUsername, password) => {
  return await authAxios.post('/auth/login', {
    emailOrUsername,
    password,
  });
};

export const registerRequest = async (formData) => {
  return await authAxios.post('/auth/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const verifyEmailRequest = async (token) => {
  return await authAxios.post('/auth/verify-email', {
    token,
  });
};

export const resendVerificationRequest = async (email) => {
  return await authAxios.post('/auth/resend-verification', {
    email,
  });
};

// ══════════════════════════════════════════════════════════════════════════
// RESTAURANT ENDPOINTS
// ══════════════════════════════════════════════════════════════════════════

export const getRestaurantsRequest = async () => {
  return await axios.get('/restaurant'); 
};

export const createRestaurantRequest = async (restaurantData) => {
  return await axios.post('/restaurant', restaurantData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteRestaurantRequest = async (id) => {
  return await axios.patch(`/restaurant/delete/${id}`);
};

export const restoreRestaurantRequest = async (id) => {
  return await axios.patch(`/restaurant/restore/${id}`);
};

export const updateRestaurantRequest = async (id, restaurantData) => {
  return await axios.put(`/restaurant/${id}`, restaurantData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};



// ── Productos ─────────────────────────────────────────────────────────────────
export const getProductsRequest = async () => {
    return await axios.get('/product?limit=100');
};

// ── Menús ─────────────────────────────────────────────────────────────────────
export const getMenusRequest = async () => {
    return await axios.get('/menu');
};
export const createMenuRequest = async (menuData) => {
    return await axios.post('/menu', menuData);
};
export const updateMenuRequest = async (id, menuData) => {
    return await axios.put(`/menu/${id}`, menuData);
};
export const deleteMenuRequest = async (id) => {
    return await axios.patch(`/menu/delete/${id}`);
};
export const restoreMenuRequest = async (id) => {
    return await axios.patch(`/menu/restore/${id}`);
};