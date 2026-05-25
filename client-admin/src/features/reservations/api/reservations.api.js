import axiosInstance from '../../../shared/api/axios.js';

export const getReservations = (params = {}) =>
  axiosInstance.get('/reservation', { params: { limit: 100, ...params } });

export const createReservation = (data) =>
  axiosInstance.post('/reservation', data);

export const deleteReservation = (id) =>
  axiosInstance.patch(`/reservation/delete/${id}`);

export const restoreReservation = (id) =>
  axiosInstance.patch(`/reservation/restore/${id}`);