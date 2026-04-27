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
} from './eventController.js';
import { validateCreateEvent } from '../../middleware/event-validator.js';
import { validateCreateInscription } from '../../middleware/inscription-validator.js';
import { validateCreatePromotion } from '../../middleware/promotion-validator.js';

const router = Router();

/**
 * @swagger
 * /event/events:
 *   get:
 *     summary: Listar todos los eventos
 *     tags: [Event]
 *     responses:
 *       200:
 *         description: Lista de eventos obtenida con éxito
 *       500:
 *         description: Error en el servidor
 */
router.get('/events', getEvents);

/**
 * @swagger
 * /event/events:
 *   post:
 *     summary: Crear un nuevo evento
 *     tags: [Event]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Festival Gastronómico"
 *               date:
 *                 type: string
 *                 example: "2026-05-10"
 *               description:
 *                 type: string
 *                 example: "Evento especial con platillos internacionales"
 *     responses:
 *       201:
 *         description: Evento creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/events', validateCreateEvent, createEventRecord);

/**
 * @swagger
 * /event/events/delete/{id}:
 *   patch:
 *     summary: Desactivar un evento (Soft Delete)
 *     tags: [Event]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento a eliminar
 *     responses:
 *       200:
 *         description: Evento eliminado con éxito
 *       404:
 *         description: Evento no encontrado
 */
router.patch('/events/delete/:id', deleteEvent);

/**
 * @swagger
 * /event/events/restore/{id}:
 *   patch:
 *     summary: Restaurar un evento eliminado
 *     tags: [Event]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento a restaurar
 *     responses:
 *       200:
 *         description: Evento restaurado correctamente
 *       404:
 *         description: Evento no encontrado
 */
router.patch('/events/restore/:id', restoreEvent);


// ─────────────────────────────
// INSCRIPCIONES
// ─────────────────────────────

/**
 * @swagger
 * /event/inscriptions:
 *   get:
 *     summary: Listar todas las inscripciones
 *     tags: [Inscription]
 *     responses:
 *       200:
 *         description: Lista de inscripciones obtenida con éxito
 *       500:
 *         description: Error en el servidor
 */
router.get('/inscriptions', getInscriptions);

/**
 * @swagger
 * /event/inscriptions:
 *   post:
 *     summary: Crear una nueva inscripción
 *     tags: [Inscription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 example: "usuario123"
 *               event:
 *                 type: string
 *                 example: "eventId123"
 *     responses:
 *       201:
 *         description: Inscripción creada exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/inscriptions', validateCreateInscription, createInscriptionRecord);

/**
 * @swagger
 * /event/inscriptions/delete/{id}:
 *   patch:
 *     summary: Desactivar una inscripción
 *     tags: [Inscription]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la inscripción
 *     responses:
 *       200:
 *         description: Inscripción eliminada
 *       404:
 *         description: Inscripción no encontrada
 */
router.patch('/inscriptions/delete/:id', deleteInscription);

/**
 * @swagger
 * /event/inscriptions/restore/{id}:
 *   patch:
 *     summary: Restaurar una inscripción eliminada
 *     tags: [Inscription]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la inscripción
 *     responses:
 *       200:
 *         description: Inscripción restaurada
 *       404:
 *         description: Inscripción no encontrada
 */
router.patch('/inscriptions/restore/:id', restoreInscription);


// ─────────────────────────────
// PROMOCIONES
// ─────────────────────────────

/**
 * @swagger
 * /event/promotions:
 *   get:
 *     summary: Listar todas las promociones
 *     tags: [Promotion]
 *     responses:
 *       200:
 *         description: Lista de promociones obtenida con éxito
 *       500:
 *         description: Error en el servidor
 */
router.get('/promotions', getPromotions);

/**
 * @swagger
 * /event/promotions:
 *   post:
 *     summary: Crear una nueva promoción
 *     tags: [Promotion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "2x1 en bebidas"
 *               discount:
 *                 type: number
 *                 example: 50
 *               description:
 *                 type: string
 *                 example: "Promoción válida fines de semana"
 *     responses:
 *       201:
 *         description: Promoción creada exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/promotions', validateCreatePromotion, createPromotionRecord);

/**
 * @swagger
 * /event/promotions/delete/{id}:
 *   patch:
 *     summary: Desactivar una promoción
 *     tags: [Promotion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la promoción
 *     responses:
 *       200:
 *         description: Promoción eliminada
 *       404:
 *         description: Promoción no encontrada
 */
router.patch('/promotions/delete/:id', deletePromotion);

/**
 * @swagger
 * /event/promotions/restore/{id}:
 *   patch:
 *     summary: Restaurar una promoción eliminada
 *     tags: [Promotion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la promoción
 *     responses:
 *       200:
 *         description: Promoción restaurada
 *       404:
 *         description: Promoción no encontrada
 */
router.patch('/promotions/restore/:id', restorePromotion);

export default router;
