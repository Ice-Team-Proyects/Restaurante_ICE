import { body, param } from 'express-validator';
import { validateJWT } from './validate-JWT.js';
import { checkValidators } from './check-validators.js';

export const validateCreateProduct = [
    validateJWT,
    body('saucer')
        .notEmpty()
        .withMessage('El Nombre del Platillo es Necesario')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('description')
        .notEmpty()
        .withMessage('Debe Ingresar Una Descripcion Del Platillo')
        .trim()
        .isLength({ max: 500 })
        .withMessage('La descripción no puede exceder 500 caracteres'),
    body('price')
        .notEmpty()
        .withMessage('La capacidad es requerida')
        .isLength({ max: 10 })
        .withMessage('El Precio es Demasiado Alto, No Puede Superar las 10 Sifras'),
    checkValidators,
];