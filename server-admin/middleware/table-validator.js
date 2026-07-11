import  { body, param } from 'express-validator';
import { checkValidators } from './check-validators.js';

export const validateCreateTable = [
    body('number')
        .notEmpty().withMessage('El número de mesa es obligatorio')
        .isInt({ min: 1 }).withMessage('El número de mesa debe ser un entero positivo'),
    body('capacity')
        .notEmpty().withMessage('La capacidad de la mesa es obligatoria')
        .isInt({ min: 1 }).withMessage('La capacidad debe ser un entero positivo'), 
    body('status')
        .optional()
        .isIn(["disponible", "ocupada", "reservada"]).withMessage('El estado debe ser "disponible", "ocupada" o "reservada"'),  
    body('restaurant')
        .optional()
        .isMongoId().withMessage('El ID de la sucursal no es válido'),
    checkValidators
];

export const validateUpdateTable = [
    body('number')
        .optional()
        .isInt({ min: 1 }).withMessage('El número de mesa debe ser un entero positivo'),
    body('capacity')
        .optional()
        .isInt({ min: 1 }).withMessage('La capacidad debe ser un entero positivo'), 
    body('status')
        .optional()
        .isIn(["disponible", "ocupada", "reservada"]).withMessage('El estado debe ser "disponible", "ocupada" o "reservada"'),
    body('restaurant')
        .optional()
        .isMongoId().withMessage('El ID de la sucursal no es válido'),
    checkValidators
];

export const validateIdParam = [
    // check the `id` parameter in the route
    param('id')
        .isMongoId().withMessage('El id proporcionado no es válido'),
    checkValidators
];