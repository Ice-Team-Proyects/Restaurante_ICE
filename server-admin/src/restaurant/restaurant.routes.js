import { Router } from "express";
import { createRestaurant, getRestaurants, updateRestaurant, deleteRestaurant } from "./restaurant.controller.js";
import { validateCreateRestaurant } from '../../middleware/restaurant-validator.js';
import { uploadRestaurantImage } from "../../middleware/file-uploader.js";
import { cleanupUploadedFileOnFinish } from '../../middleware/delete-file-on-error.js';

const router = Router();

/**
 * @swagger
 * /restaurant:
 *   get:
 *     summary: Listar todos los restaurantes
 *     tags: [Restaurant]
 *     responses:
 *       200:
 *         description: Lista de restaurantes obtenida con éxito
 *       500:
 *         description: Error en el servidor
 */
router.get('/', getRestaurants);

/**
 * @swagger
 * /restaurant:
 *   post:
 *     summary: Crear un nuevo restaurante
 *     tags: [Restaurant]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Restaurante ICE"
 *               address:
 *                 type: string
 *                 example: "Zona 10, Ciudad de Guatemala"
 *               phone:
 *                 type: string
 *                 example: "5555-5555"
 *               description:
 *                 type: string
 *                 example: "Restaurante especializado en comida internacional"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Restaurante creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post(
  '/',
  uploadRestaurantImage.single('image'),
  cleanupUploadedFileOnFinish,
  validateCreateRestaurant,
  createRestaurant
);

/**
 * @swagger
 * /restaurant/{id}:
 *   put:
 *     summary: Actualizar un restaurante existente
 *     tags: [Restaurant]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del restaurante a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Restaurante ICE Actualizado"
 *               address:
 *                 type: string
 *                 example: "Zona 14, Ciudad de Guatemala"
 *               phone:
 *                 type: string
 *                 example: "4444-4444"
 *               description:
 *                 type: string
 *                 example: "Nueva descripción del restaurante"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Restaurante actualizado correctamente
 *       404:
 *         description: Restaurante no encontrado
 */
router.put(
  '/:id',
  uploadRestaurantImage.single('image'),
  cleanupUploadedFileOnFinish,
  updateRestaurant
);

/**
 * @swagger
 * /restaurant/{id}:
 *   delete:
 *     summary: Eliminar un restaurante (Soft Delete)
 *     tags: [Restaurant]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del restaurante a eliminar
 *     responses:
 *       200:
 *         description: Restaurante eliminado con éxito
 *       404:
 *         description: Restaurante no encontrado
 */
router.delete('/:id', deleteRestaurant);

export default router;