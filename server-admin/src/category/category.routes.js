import { Router } from "express";
import { 
    createCategoryRecord,
    getCategorys, 
    deleteCategory, 
    restoreCategory 
} from "./category.controller.js";
import { validateCreateCategory } from '../../middleware/category-validator.js'; 

const router = Router();

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Listar todas las categorías
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida con éxito
 *       500:
 *         description: Error en el servidor
 */
router.get('/', getCategorys);

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Bebidas"
 *               description:
 *                 type: string
 *                 example: "Categoría para bebidas frías y calientes"
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 */
router.post(
  '/',
  validateCreateCategory,
  createCategoryRecord
);

/**
 * @swagger
 * /category/delete/{id}:
 *   patch:
 *     summary: Desactivar una categoría (Soft Delete)
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría a eliminar
 *     responses:
 *       200:
 *         description: Categoría eliminada con éxito
 *       404:
 *         description: La categoría no existe
 */
router.patch('/delete/:id', deleteCategory);

/**
 * @swagger
 * /category/restore/{id}:
 *   patch:
 *     summary: Restaurar una categoría eliminada
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría a restaurar
 *     responses:
 *       200:
 *         description: Categoría restaurada correctamente
 *       404:
 *         description: No se pudo encontrar la categoría
 */
router.patch('/restore/:id', restoreCategory);

export default router;