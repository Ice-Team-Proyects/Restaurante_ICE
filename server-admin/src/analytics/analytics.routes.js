import { Router } from "express";
import { 
    createAnalytics, 
    getAnalytics, 
    updateAnalytics, 
    deleteAnalytics, 
    restoreAnalytics 
} from "./analytics.controller.js";
import { validateCreateAnalytics } from '../../middleware/analytics-validator.js';

const router = Router();

/**
 * @swagger
 * /analytics:
 *   get:
 *     summary: Listar todos los registros analíticos
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Lista de analíticas obtenida con éxito
 *       500:
 *         description: Error en el servidor
 */
router.get('/', getAnalytics);

/**
 * @swagger
 * /analytics:
 *   post:
 *     summary: Crear un nuevo registro analítico
 *     tags: [Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               metricName:
 *                 type: string
 *                 example: "Ventas Mensuales"
 *               value:
 *                 type: number
 *                 example: 15420.5
 *               type:
 *                 type: string
 *                 example: "REPORTE"
 *               description:
 *                 type: string
 *                 example: "Ventas del mes de octubre"
 *     responses:
 *       201:
 *         description: Registro creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 */
router.post(
  '/',
  validateCreateAnalytics,
  createAnalytics
);

/**
 * @swagger
 * /analytics/{id}:
 *   put:
 *     summary: Actualizar un registro analítico existente
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del registro analítico
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *                 example: 48000
 *               description:
 *                 type: string
 *                 example: "Reporte actualizado con datos de fin de semana"
 *     responses:
 *       200:
 *         description: Registro actualizado correctamente
 *       404:
 *         description: Registro no encontrado
 */
router.put('/:id', updateAnalytics);

/**
 * @swagger
 * /analytics/delete/{id}:
 *   patch:
 *     summary: Desactivar un registro analítico (Soft Delete)
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del registro a eliminar
 *     responses:
 *       200:
 *         description: Registro eliminado con éxito
 *       404:
 *         description: El registro no existe
 */
router.patch('/delete/:id', deleteAnalytics);

/**
 * @swagger
 * /analytics/restore/{id}:
 *   patch:
 *     summary: Restaurar un registro analítico eliminado
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del registro a restaurar
 *     responses:
 *       200:
 *         description: Registro restaurado correctamente
 *       404:
 *         description: El registro no se pudo encontrar
 */
router.patch('/restore/:id', restoreAnalytics);

export default router;