import Event from '../models/eventModel.js';
import Inscription from '../models/inscriptionModel.js';
import Promotion from '../models/promotionModel.js';

// ─────────────────────────────────────────────
// EVENTOS
// ─────────────────────────────────────────────

export const createEventRecord = async ({ eventData }) => {
    const data = { ...eventData };

    const event = new Event(data);
    await event.save();
    return event;
};

export const fetchEvents = async ({
    page = 1,
    limit = 10,
    isActive = true,
}) => {
    const filter = { isActive };
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const events = await Event.find(filter)
        .limit(limitNumber * 1)
        .skip((pageNumber - 1) * limitNumber)
        .sort({ createdAt: -1 });

    const total = await Event.countDocuments(filter);

    return {
        events,
        pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            totalRecords: total,
            limit: limitNumber,
        },
    };
};

export const deleteEvent = async (id) => {
    const event = await Event.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
    );
    return event;
};

export const restoreEvent = async (id) => {
    const event = await Event.findByIdAndUpdate(
        id,
        { isActive: true },
        { new: true }
    );
    return event;
};

// ─────────────────────────────────────────────
// INSCRIPCIONES
// ─────────────────────────────────────────────

export const createInscriptionRecord = async ({ inscriptionData }) => {
    const data = { ...inscriptionData };

    // Verificar que el evento existe y está activo
    const event = await Event.findById(data.id_event);
    if (!event || !event.isActive) {
        throw new Error('El Evento no Existe o no Está Disponible');
    }

    // Verificar capacidad disponible
    const totalInscribed = await Inscription.aggregate([
        { $match: { id_event: event._id, isActive: true, status: { $ne: 'cancelada' } } },
        { $group: { _id: null, total: { $sum: '$number_people' } } },
    ]);
    const occupiedSpots = totalInscribed[0]?.total || 0;
    if (occupiedSpots + data.number_people > event.capacity) {
        throw new Error('No Hay Suficiente Capacidad en el Evento para esta Inscripción');
    }

    // Calcular precio total aplicando promoción si existe
    let total_price = event.price * data.number_people;
    if (data.id_promotion) {
        const promotion = await Promotion.findById(data.id_promotion);
        if (!promotion || !promotion.isActive) {
            throw new Error('La Promoción no Existe o no Está Disponible');
        }
        const now = new Date();
        if (now < promotion.date_start || now > promotion.date_end) {
            throw new Error('La Promoción no Está Vigente');
        }
        if (data.number_people < promotion.min_people) {
            throw new Error(`La Promoción Requiere un Mínimo de ${promotion.min_people} Personas`);
        }
        total_price = total_price - (total_price * promotion.discount_percentage) / 100;
    }

    const inscription = new Inscription({ ...data, total_price });
    await inscription.save();
    return inscription;
};

export const fetchInscriptions = async ({
    page = 1,
    limit = 10,
    isActive = true,
}) => {
    const filter = { isActive };
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const inscriptions = await Inscription.find(filter)
        .populate('id_event', 'name_event date_event location')
        .populate('id_promotion', 'name_promotion discount_percentage')
        .limit(limitNumber * 1)
        .skip((pageNumber - 1) * limitNumber)
        .sort({ createdAt: -1 });

    const total = await Inscription.countDocuments(filter);

    return {
        inscriptions,
        pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            totalRecords: total,
            limit: limitNumber,
        },
    };
};

export const deleteInscription = async (id) => {
    const inscription = await Inscription.findByIdAndUpdate(
        id,
        { isActive: false, status: 'cancelada' },
        { new: true }
    );
    return inscription;
};

export const restoreInscription = async (id) => {
    const inscription = await Inscription.findByIdAndUpdate(
        id,
        { isActive: true, status: 'pendiente' },
        { new: true }
    );
    return inscription;
};

// ─────────────────────────────────────────────
// PROMOCIONES
// ─────────────────────────────────────────────

export const createPromotionRecord = async ({ promotionData }) => {
    const data = { ...promotionData };

    if (new Date(data.date_start) >= new Date(data.date_end)) {
        throw new Error('La Fecha de Inicio Debe ser Anterior a la Fecha de Fin');
    }

    const promotion = new Promotion(data);
    await promotion.save();
    return promotion;
};

export const fetchPromotions = async ({
    page = 1,
    limit = 10,
    isActive = true,
}) => {
    const filter = { isActive };
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const promotions = await Promotion.find(filter)
        .limit(limitNumber * 1)
        .skip((pageNumber - 1) * limitNumber)
        .sort({ createdAt: -1 });

    const total = await Promotion.countDocuments(filter);

    return {
        promotions,
        pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            totalRecords: total,
            limit: limitNumber,
        },
    };
};

export const deletePromotion = async (id) => {
    const promotion = await Promotion.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
    );
    return promotion;
};

export const restorePromotion = async (id) => {
    const promotion = await Promotion.findByIdAndUpdate(
        id,
        { isActive: true },
        { new: true }
    );
    return promotion;
};
