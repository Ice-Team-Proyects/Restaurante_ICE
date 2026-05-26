import axiosInstance from '../../../shared/api/axios.js';

// EVENTOS

export const getEvents = (params = {}) =>
  axiosInstance.get('/event/events', { params: { limit: 100, ...params } });

export const createEvent = (data) => axiosInstance.post('/event/events', data);

export const deleteEvent = (id) => axiosInstance.patch(`/event/events/delete/${id}`);

export const restoreEvent = (id) => axiosInstance.patch(`/event/events/restore/${id}`);

// INSCRIPCIONES
export const getInscriptions = (params = {}) =>
  axiosInstance.get('/event/inscriptions', { params: { limit: 100, ...params } });

export const createInscription = (data) => axiosInstance.post('/event/inscriptions', data);

export const deleteInscription = (id) => axiosInstance.patch(`/event/inscriptions/delete/${id}`);

export const restoreInscription = (id) => axiosInstance.patch(`/event/inscriptions/restore/${id}`);

// PROMOCIONES
export const getPromotions = (params = {}) =>
  axiosInstance.get('/event/promotions', { params: { limit: 100, ...params } });

export const createPromotion = (data) => axiosInstance.post('/event/promotions', data);

export const deletePromotion = (id) => axiosInstance.patch(`/event/promotions/delete/${id}`);

export const restorePromotion = (id) => axiosInstance.patch(`/event/promotions/restore/${id}`);
