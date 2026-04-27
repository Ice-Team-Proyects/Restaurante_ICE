import { Router } from "express";
import { createTable, getTables, getTableById, updateTable, deleteTable, restoreDeletedTable } from "./table.controller.js";
import { validateCreateTable, validateUpdateTable, validateIdParam } from '../../middleware/table-validator.js';

const router = Router();

/**
 * @swagger
 * /table:
 *   get:
 *     summary: Listar todas las mesas
 *     tags: [Table]
 *     responses:
 *       200:
 *         description: Lista de mesas obtenida con éxito
 *       500:
 *         description: Error en el servidor
 */
router.get('/', getTables);

/**
 * @swagger
 * /table/{id}:
 *   get:
 *     summary: Obtener una mesa por ID
 *     tags: [Table]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mesa
 *     responses:
 *       200:
 *         description: Mesa obtenida correctamente
 *       404:
 *         description: Mesa no encontrada
 */
router.get('/:id', validateIdParam, getTableById);

/**
 * @swagger
 * /table:
 *   post:
 *     summary: Crear una nueva mesa
 *     tags: [Table]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: number
 *                 example: 10
 *               capacity:
 *                 type: number
 *                 example: 4
 *               status:
 *                 type: string
 *                 example: "DISPONIBLE"
 *     responses:
 *       201:
 *         description: Mesa creada exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post(
  '/',
  validateCreateTable,
  createTable
);

/**
 * @swagger
 * /table/{id}:
 *   put:
 *     summary: Actualizar una mesa existente
 *     tags: [Table]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mesa a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: number
 *                 example: 12
 *               capacity:
 *                 type: number
 *                 example: 6
 *               status:
 *                 type: string
 *                 example: "OCUPADA"
 *     responses:
 *       200:
 *         description: Mesa actualizada correctamente
 *       404:
 *         description: Mesa no encontrada
 */
router.put(
  '/:id',
  validateIdParam,
  validateUpdateTable,
  updateTable
);

/**
 * @swagger
 * /table/delete/{id}:
 *   delete:
 *     summary: Eliminar una mesa (Soft Delete)
 *     tags: [Table]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mesa a eliminar
 *     responses:
 *       200:
 *         description: Mesa eliminada con éxito
 *       404:
 *         description: Mesa no encontrada
 */
router.delete('/delete/:id', validateIdParam, deleteTable);

/**
 * @swagger
 * /table/restore/{id}:
 *   patch:
 *     summary: Restaurar una mesa eliminada
 *     tags: [Table]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mesa a restaurar
 *     responses:
 *       200:
 *         description: Mesa restaurada correctamente
 *       404:
 *         description: Mesa no encontrada
 */
router.patch('/restore/:id', validateIdParam, restoreDeletedTable);

export default router;