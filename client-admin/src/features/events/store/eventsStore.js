import { create } from 'zustand';
import {
  getEvents,
  createEvent,
  deleteEvent,
  restoreEvent,
  getInscriptions,
  createInscription,
  deleteInscription,
  restoreInscription,
  getPromotions,
  createPromotion,
  deletePromotion,
  restorePromotion,
} from '../api/events.api.js';

export const useEventsStore = create((set, get) => ({
  // EVENTOS
  events: [],
  loadingEvents: false,
  errorEvents: null,

  fetchEvents: async () => {
    try {
      set({ loadingEvents: true, errorEvents: null });
      const res = await getEvents();
      set({ events: res.data.data || [], loadingEvents: false });
    } catch (err) {
      set({
        errorEvents: err.response?.data?.message || 'Error al obtener los eventos',
        loadingEvents: false,
      });
    }
  },

  addEvent: async (data) => {
    try {
      set({ loadingEvents: true, errorEvents: null });
      const res = await createEvent(data);
      set({ events: [res.data.data, ...get().events], loadingEvents: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al crear el evento';
      set({ errorEvents: message, loadingEvents: false });
      return { success: false, error: message };
    }
  },

  removeEvent: async (id) => {
    try {
      set({ loadingEvents: true, errorEvents: null });
      await deleteEvent(id);
      set({
        events: get().events.map((e) => (e._id === id ? { ...e, isActive: false } : e)),
        loadingEvents: false,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al eliminar el evento';
      set({ errorEvents: message, loadingEvents: false });
      return { success: false, error: message };
    }
  },

  activateEvent: async (id) => {
    try {
      set({ loadingEvents: true, errorEvents: null });
      const res = await restoreEvent(id);
      set({
        events: get().events.map((e) => (e._id === id ? res.data.data : e)),
        loadingEvents: false,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al restaurar el evento';
      set({ errorEvents: message, loadingEvents: false });
      return { success: false, error: message };
    }
  },

  // INSCRIPCIONES
  inscriptions: [],
  loadingInscriptions: false,
  errorInscriptions: null,

  fetchInscriptions: async () => {
    try {
      set({ loadingInscriptions: true, errorInscriptions: null });
      const res = await getInscriptions();
      set({ inscriptions: res.data.data || [], loadingInscriptions: false });
    } catch (err) {
      set({
        errorInscriptions: err.response?.data?.message || 'Error al obtener las inscripciones',
        loadingInscriptions: false,
      });
    }
  },

  addInscription: async (data) => {
    try {
      set({ loadingInscriptions: true, errorInscriptions: null });
      const res = await createInscription(data);
      set({ inscriptions: [res.data.data, ...get().inscriptions], loadingInscriptions: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al crear la inscripción';
      set({ errorInscriptions: message, loadingInscriptions: false });
      return { success: false, error: message };
    }
  },

  removeInscription: async (id) => {
    try {
      set({ loadingInscriptions: true, errorInscriptions: null });
      await deleteInscription(id);
      set({
        inscriptions: get().inscriptions.map((i) => (i._id === id ? { ...i, isActive: false } : i)),
        loadingInscriptions: false,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al eliminar la inscripción';
      set({ errorInscriptions: message, loadingInscriptions: false });
      return { success: false, error: message };
    }
  },

  activateInscription: async (id) => {
    try {
      set({ loadingInscriptions: true, errorInscriptions: null });
      const res = await restoreInscription(id);
      set({
        inscriptions: get().inscriptions.map((i) => (i._id === id ? res.data.data : i)),
        loadingInscriptions: false,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al restaurar la inscripción';
      set({ errorInscriptions: message, loadingInscriptions: false });
      return { success: false, error: message };
    }
  },

  // PROMOCIONES
  promotions: [],
  loadingPromotions: false,
  errorPromotions: null,

  fetchPromotions: async () => {
    try {
      set({ loadingPromotions: true, errorPromotions: null });
      const res = await getPromotions();
      set({ promotions: res.data.data || [], loadingPromotions: false });
    } catch (err) {
      set({
        errorPromotions: err.response?.data?.message || 'Error al obtener las promociones',
        loadingPromotions: false,
      });
    }
  },

  addPromotion: async (data) => {
    try {
      set({ loadingPromotions: true, errorPromotions: null });
      const res = await createPromotion(data);
      set({ promotions: [res.data.data, ...get().promotions], loadingPromotions: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al crear la promoción';
      set({ errorPromotions: message, loadingPromotions: false });
      return { success: false, error: message };
    }
  },

  removePromotion: async (id) => {
    try {
      set({ loadingPromotions: true, errorPromotions: null });
      await deletePromotion(id);
      set({
        promotions: get().promotions.map((p) => (p._id === id ? { ...p, isActive: false } : p)),
        loadingPromotions: false,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al eliminar la promoción';
      set({ errorPromotions: message, loadingPromotions: false });
      return { success: false, error: message };
    }
  },

  activatePromotion: async (id) => {
    try {
      set({ loadingPromotions: true, errorPromotions: null });
      const res = await restorePromotion(id);
      set({
        promotions: get().promotions.map((p) => (p._id === id ? res.data.data : p)),
        loadingPromotions: false,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al restaurar la promoción';
      set({ errorPromotions: message, loadingPromotions: false });
      return { success: false, error: message };
    }
  },
}));
