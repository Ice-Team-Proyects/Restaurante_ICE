import { Router } from "express";
import {
    createProductRecord,
    getProducts,
    deleteProduct,
    restoreProduct
} from "./product.controller.js";
import { validateCreateProduct } from '../../middleware/product-validator.js'; 
import { uploadMenuImage } from "../../middleware/file-uploader.js"; 
import { cleanupUploadedFileOnFinish } from '../../middleware/delete-file-on-error.js';

const router = Router();


/**
 * @swagger
 * /product:
 *   get:
 *     summary: Listar todos los productos
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Lista de productos obtenida con éxito
 *       500:
 *         description: Error en el servidor
 */
router.get('/', getProducts);

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Hamburguesa Clásica"
 *               price:
 *                 type: number
 *                 example: 45.50
 *               category:
 *                 type: string
 *                 example: "Bebidas"
 *               description:
 *                 type: string
 *                 example: "Deliciosa hamburguesa con ingredientes frescos"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post(
  '/',
  uploadMenuImage.single('image'),
  cleanupUploadedFileOnFinish,
  validateCreateProduct,
  createProductRecord
);

/**
 * @swagger
 * /product/delete/{id}:
 *   patch:
 *     summary: Desactivar un producto (Soft Delete)
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado con éxito
 *       404:
 *         description: Producto no encontrado
 */
router.patch('/delete/:id', deleteProduct);

/**
 * @swagger
 * /product/restore/{id}:
 *   patch:
 *     summary: Restaurar un producto eliminado
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a restaurar
 *     responses:
 *       200:
 *         description: Producto restaurado correctamente
 *       404:
 *         description: Producto no encontrado
 */
router.patch('/restore/:id', restoreProduct);

export default router;