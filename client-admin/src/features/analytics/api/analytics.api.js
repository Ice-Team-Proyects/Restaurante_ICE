import axiosInstance from '../../../shared/api/axios.js';

export const getAnalytics = (params = {}) =>
  axiosInstance.get('/analytics', { params: { limit: 100, ...params } });

export const createAnalytics = (data) =>
  axiosInstance.post('/analytics', data);

export const updateAnalytics = (id, data) =>
  axiosInstance.put(`/analytics/${id}`, data);

export const deleteAnalytics = (id) =>
  axiosInstance.patch(`/analytics/delete/${id}`);

export const restoreAnalytics = (id) =>
  axiosInstance.patch(`/analytics/restore/${id}`);