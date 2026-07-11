import axiosInstance from '../../../shared/api/axios.js';

export const getCategories = (params = {}) =>
  axiosInstance.get('/category', { params: { limit: 100, ...params } });

export const createCategory = (data) =>
  axiosInstance.post('/category', data);

export const updateCategory = (id, data) =>
  axiosInstance.put(`/category/${id}`, data);

export const deleteCategory = (id) =>
  axiosInstance.patch(`/category/delete/${id}`);

export const restoreCategory = (id) =>
  axiosInstance.patch(`/category/restore/${id}`);