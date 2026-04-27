import { Router } from "express";
import { 
    createOrder, 
    getOrders, 
    updateOrder, 
    deleteOrder 
} from "./order.controller.js";
import { validateCreateOrder } from '../../middleware/order-validator.js';

const router = Router();

/**
 * @swagger
 * /order:
 *   get:
 *     summary: Listar todas las órdenes
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: Lista de órdenes obtenida con éxito
 *       500:
 *         description: Error en el servidor
 */
router.get('/', getOrders);

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Crear una nueva orden
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer:
 *                 type: string
 *                 example: "cliente123"
 *               total:
 *                 type: number
 *                 example: 250.75
 *               status:
 *                 type: string
 *                 example: "PENDIENTE"
 *               description:
 *                 type: string
 *                 example: "Orden de comida rápida"
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', validateCreateOrder, createOrder);

/**
 * @swagger
 * /order/{id}:
 *   put:
 *     summary: Actualizar una orden existente
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer:
 *                 type: string
 *                 example: "clienteActualizado"
 *               total:
 *                 type: number
 *                 example: 300.00
 *               status:
 *                 type: string
 *                 example: "COMPLETADA"
 *               description:
 *                 type: string
 *                 example: "Orden actualizada"
 *     responses:
 *       200:
 *         description: Orden actualizada correctamente
 *       404:
 *         description: Orden no encontrada
 */
router.put('/:id', updateOrder);

/**
 * @swagger
 * /order/{id}:
 *   delete:
 *     summary: Eliminar una orden
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden a eliminar
 *     responses:
 *       200:
 *         description: Orden eliminada con éxito
 *       404:
 *         description: Orden no encontrada
 */
router.delete('/:id', deleteOrder);

export default router;