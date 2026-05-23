import { create } from 'zustand';
import {
  getReservations,
  createReservation,
  deleteReservation,
  restoreReservation,
} from '../api/reservations.api.js';

export const useReservationStore = create((set, get) => ({
  reservations: [],
  selectedReservation: null,
  loading: false,
  isModalOpen: false,

  fetchReservations: async () => {
    set({ loading: true });
    try {
      const res = await getReservations();
      const data = res.data?.data || [];
      set({ reservations: data, loading: false });
    } catch (error) {
      console.error('Error al listar reservaciones:', error);
      set({ reservations: [], loading: false });
    }
  },

  createReservation: async (reservationData) => {
    set({ loading: true });
    try {
      await createReservation(reservationData);
      await get().fetchReservations();
      set({ loading: false });
      return true;
    } catch (error) {
      console.error('Error al crear reservación:', error);
      set({ loading: false });
      return false;
    }
  },

  deleteReservation: async (id) => {
    try {
      await deleteReservation(id);
      set((state) => ({
        reservations: state.reservations.filter((r) => r._id !== id),
      }));
    } catch (error) {
      console.error('Error al eliminar reservación:', error);
    }
  },

  restoreReservation: async (id) => {
    try {
      await restoreReservation(id);
      await get().fetchReservations();
    } catch (error) {
      console.error('Error al restaurar reservación:', error);
    }
  },

  setSelectedReservation: (reservation) => set({ selectedReservation: reservation }),
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
}));