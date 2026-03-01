import {
    createEventRecord as createEventService,
    fetchEvents,
    deleteEvent as deleteEventService,
    restoreEvent as restoreEventService,
    createInscriptionRecord as createInscriptionService,
    fetchInscriptions,
    deleteInscription as deleteInscriptionService,
    restoreInscription as restoreInscriptionService,
    createPromotionRecord as createPromotionService,
    fetchPromotions,
    deletePromotion as deletePromotionService,
    restorePromotion as restorePromotionService,
} from './eventService.js';

// ─────────────────────────────────────────────
// EVENTOS
// ─────────────────────────────────────────────

export const createEventRecord = async (req, res) => {
    try {
        const event = await createEventService({
            eventData: req.body,
        });

        res.status(201).json({
            success: true,
            message: 'Evento Creado Exitosamente',
            data: event,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al Crear el Evento',
            error: err.message,
        });
    }
};

export const getEvents = async (req, res) => {
    try {
        const { page = 1, limit = 10, isActive = 'true' } = req.query;
        const active = isActive === 'true';

        const { events, pagination } = await fetchEvents({ page, limit, isActive: active });

        res.status(200).json({
            success: true,
            message: 'Eventos Listados Exitosamente',
            data: events,
            pagination,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al Listar los Eventos Registrados',
            error: err.message,
        });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await deleteEventService(id);

        if (!event) return res.status(404).json({ success: false, message: 'Evento no Encontrado' });

        res.json({ success: true, message: 'Evento Eliminado (Soft Delete)', data: event });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al Eliminar el Evento', error: err.message });
    }
};

export const restoreEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await restoreEventService(id);

        if (!event) return res.status(404).json({ success: false, message: 'Evento no Encontrado' });

        res.json({ success: true, message: 'Evento Restaurado Exitosamente', data: event });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al Restaurar el Evento', error: err.message });
    }
};

// ─────────────────────────────────────────────
// INSCRIPCIONES
// ─────────────────────────────────────────────

export const createInscriptionRecord = async (req, res) => {
    try {
        const inscription = await createInscriptionService({
            inscriptionData: req.body,
        });

        res.status(201).json({
            success: true,
            message: 'Inscripción Creada Exitosamente',
            data: inscription,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al Crear la Inscripción',
            error: err.message,
        });
    }
};

export const getInscriptions = async (req, res) => {
    try {
        const { page = 1, limit = 10, isActive = 'true' } = req.query;
        const active = isActive === 'true';

        const { inscriptions, pagination } = await fetchInscriptions({ page, limit, isActive: active });

        res.status(200).json({
            success: true,
            message: 'Inscripciones Listadas Exitosamente',
            data: inscriptions,
            pagination,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al Listar las Inscripciones Registradas',
            error: err.message,
        });
    }
};

export const deleteInscription = async (req, res) => {
    try {
        const { id } = req.params;
        const inscription = await deleteInscriptionService(id);

        if (!inscription) return res.status(404).json({ success: false, message: 'Inscripción no Encontrada' });

        res.json({ success: true, message: 'Inscripción Eliminada (Soft Delete)', data: inscription });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al Eliminar la Inscripción', error: err.message });
    }
};

export const restoreInscription = async (req, res) => {
    try {
        const { id } = req.params;
        const inscription = await restoreInscriptionService(id);

        if (!inscription) return res.status(404).json({ success: false, message: 'Inscripción no Encontrada' });

        res.json({ success: true, message: 'Inscripción Restaurada Exitosamente', data: inscription });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al Restaurar la Inscripción', error: err.message });
    }
};

// ─────────────────────────────────────────────
// PROMOCIONES
// ─────────────────────────────────────────────

export const createPromotionRecord = async (req, res) => {
    try {
        const promotion = await createPromotionService({
            promotionData: req.body,
        });

        res.status(201).json({
            success: true,
            message: 'Promoción Creada Exitosamente',
            data: promotion,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al Crear la Promoción',
            error: err.message,
        });
    }
};

export const getPromotions = async (req, res) => {
    try {
        const { page = 1, limit = 10, isActive = 'true' } = req.query;
        const active = isActive === 'true';

        const { promotions, pagination } = await fetchPromotions({ page, limit, isActive: active });

        res.status(200).json({
            success: true,
            message: 'Promociones Listadas Exitosamente',
            data: promotions,
            pagination,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al Listar las Promociones Registradas',
            error: err.message,
        });
    }
};

export const deletePromotion = async (req, res) => {
    try {
        const { id } = req.params;
        const promotion = await deletePromotionService(id);

        if (!promotion) return res.status(404).json({ success: false, message: 'Promoción no Encontrada' });

        res.json({ success: true, message: 'Promoción Eliminada (Soft Delete)', data: promotion });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al Eliminar la Promoción', error: err.message });
    }
};

export const restorePromotion = async (req, res) => {
    try {
        const { id } = req.params;
        const promotion = await restorePromotionService(id);

        if (!promotion) return res.status(404).json({ success: false, message: 'Promoción no Encontrada' });

        res.json({ success: true, message: 'Promoción Restaurada Exitosamente', data: promotion });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al Restaurar la Promoción', error: err.message });
    }
};
