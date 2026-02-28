import { createReservationRecord as createReservationService, fetchReservation } from './reservation.service.js';

export const createReservationRecord = async (req, res) => {
    try {
        const reservation = await createReservationService({
            reservationData: req.body,
        });
        
        res.status(201).json({
            success: true,
            message: 'Reservacion Creada Exitosamente',
            data: reservation
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al Crear la Reservacion',
            error: err.message
        });
    }
};

export const getReservations = async (req, res) => {
    try {
        const { page = 1, limit = 10, isActive = true } = req.query;
        const active = isActive === 'true';
        
        const { reservations, pagination } = await fetchReservation({ page, limit, isActive: active });

        res.status(200).json({
            success: true,
            message: 'Reservaciones Listadas Exitosamente',
            data: reservations,
            pagination
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al Listar las Reservaciones Registradas',
            error: err.message
        });
    }
};

export const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await deleteReservationService(id);

        if (!reservation) return res.status(404).json({ message: 'Reservación no encontrada' });

        res.json({ success: true, message: 'Reservación eliminada (soft delete)', data: reservation });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al eliminar la reservación', error: err.message });
    }
};

export const restoreReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await restoreReservationService(id);

        if (!reservation) return res.status(404).json({ message: 'Reservación no encontrada' });

        res.json({ success: true, message: 'Reservación restaurada', data: reservation });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al restaurar la reservación', error: err.message });
    }
};