import { Router } from "express";
import {
  createReservationRecord,
  getReservations,
  deleteReservation,
  restoreReservation
} from "./reservation.controller.js";
import { validateCreateReservation } from '../../middleware/reservation-validator.js';

const router = Router();

/**
 * @swagger
 * /reservation:
 *   get:
 *     summary: Listar todas las reservaciones
 *     tags: [Reservation]
 *     responses:
 *       200:
 *         description: Lista de reservaciones obtenida con éxito
 *       500:
 *         description: Error en el servidor
 */
router.get('/', getReservations);

/**
 * @swagger
 * /reservation:
 *   post:
 *     summary: Crear una nueva reservación
 *     tags: [Reservation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerName:
 *                 type: string
 *                 example: "Juan Pérez"
 *               date:
 *                 type: string
 *                 example: "2026-06-15"
 *               time:
 *                 type: string
 *                 example: "19:00"
 *               people:
 *                 type: number
 *                 example: 4
 *               table:
 *                 type: string
 *                 example: "Mesa 5"
 *     responses:
 *       201:
 *         description: Reservación creada exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post(
  '/',
  validateCreateReservation,
  createReservationRecord
);

/**
 * @swagger
 * /reservation/delete/{id}:
 *   patch:
 *     summary: Desactivar una reservación (Soft Delete)
 *     tags: [Reservation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reservación a eliminar
 *     responses:
 *       200:
 *         description: Reservación eliminada con éxito
 *       404:
 *         description: Reservación no encontrada
 */
router.patch('/delete/:id', deleteReservation);

/**
 * @swagger
 * /reservation/restore/{id}:
 *   patch:
 *     summary: Restaurar una reservación eliminada
 *     tags: [Reservation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reservación a restaurar
 *     responses:
 *       200:
 *         description: Reservación restaurada correctamente
 *       404:
 *         description: Reservación no encontrada
 */
router.patch('/restore/:id', restoreReservation);

export default router;