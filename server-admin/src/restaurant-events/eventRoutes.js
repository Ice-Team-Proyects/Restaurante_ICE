import { Router } from 'express';
import {
    createEventRecord,
    getEvents,
    deleteEvent,
    restoreEvent,
    createInscriptionRecord,
    getInscriptions,
    deleteInscription,
    restoreInscription,
    createPromotionRecord,
    getPromotions,
    deletePromotion,
    restorePromotion,
} from './event.controller.js';
import { validateCreateEvent } from '../../middleware/event-validator.js';
import { validateCreateInscription } from '../../middleware/inscription-validator.js';
import { validateCreatePromotion } from '../../middleware/promotion-validator.js';

const router = Router();

// ─────────────────────────────────────────────
// EVENTOS
// ─────────────────────────────────────────────
router.get('/events', getEvents);
router.post('/events', validateCreateEvent, createEventRecord);
router.patch('/events/delete/:id', deleteEvent);
router.patch('/events/restore/:id', restoreEvent);

// ─────────────────────────────────────────────
// INSCRIPCIONES
// ─────────────────────────────────────────────
router.get('/inscriptions', getInscriptions);
router.post('/inscriptions', validateCreateInscription, createInscriptionRecord);
router.patch('/inscriptions/delete/:id', deleteInscription);
router.patch('/inscriptions/restore/:id', restoreInscription);

// ─────────────────────────────────────────────
// PROMOCIONES
// ─────────────────────────────────────────────
router.get('/promotions', getPromotions);
router.post('/promotions', validateCreatePromotion, createPromotionRecord);
router.patch('/promotions/delete/:id', deletePromotion);
router.patch('/promotions/restore/:id', restorePromotion);

export default router;
