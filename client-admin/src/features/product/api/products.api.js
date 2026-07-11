import axiosInstance from '../../../shared/api/axios.js';

export const getProducts = (params = {}) =>
  axiosInstance.get('/product', { params: { limit: 100, ...params } });

export const getProductById = (id) =>
  axiosInstance.get(`/product/${id}`);

export const createProduct = (data) =>
  axiosInstance.post('/product', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateProduct = (id, data) =>
  axiosInstance.put(`/product/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteProduct = (id) =>
  axiosInstance.patch(`/product/delete/${id}`);

export const restoreProduct = (id) =>
  axiosInstance.patch(`/product/restore/${id}`);