import { body, param } from 'express-validator';
import { validateJWT } from './validate-JWT.js';
import { checkValidators } from './check-validators.js';

export const validateCreateCategory = [
    validateJWT,
    body('categoryName')
        .notEmpty()
        .withMessage('Debe Darle Nombre a la Categoria')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('type')
        .notEmpty()
        .withMessage('El tipo de campo es requerido')
        .isIn(['Bebidas Frias', 'Paltillos', 'Bebidas Calientes', 'Sopas'])
        .withMessage('Categoria De Alimento no Válida'),
    body('description')
        .notEmpty()
        .withMessage('Debe Ingresar Una Descripcion Del Platillo')
        .isLength({ max: 500 })
        .withMessage('La Descripcion es Demasiado largo, no puede superar los 500 caracteres'),
    checkValidators,
];