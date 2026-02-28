import { body } from 'express-validator';
import { checkValidators } from './check-validators.js'; // <-- Importamos tu función real

export const validateCreateOrder = [
    // Validar que venga el ID de la mesa
    body('tableId', 'El identificador de la mesa es obligatorio').notEmpty(),

    // Validar que items sea un arreglo y tenga al menos un producto
    body('items', 'El pedido debe contener al menos un producto (arreglo de items)').isArray({ min: 1 }),

    // Validar cada objeto dentro del arreglo de items
    body('items.*.productId', 'El ID del producto es obligatorio en cada item').notEmpty(),
    body('items.*.quantity', 'La cantidad debe ser un número entero mayor a 0').optional().isInt({ min: 1 }),
    body('items.*.price', 'El precio del producto es obligatorio y debe ser un número').isNumeric(),

    // Llamamos a tu middleware que maneja los errores
    checkValidators 
];