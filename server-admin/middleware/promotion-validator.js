import { body } from 'express-validator';
import { validateJWT } from './validate-JWT.js';
import { checkValidators } from './check-validators.js';

export const validateCreatePromotion = [
    validateJWT,
    body('name_promotion')
        .notEmpty()
        .withMessage('La Promoción Debe Tener un Nombre')
        .isLength({ min: 2, max: 150 })
        .withMessage('El Nombre no Puede Superar los 150 Caracteres'),
    body('description')
        .notEmpty()
        .withMessage('La Promoción Debe Tener una Descripción')
        .isLength({ min: 2, max: 500 })
        .withMessage('La Descripción no Puede Superar los 500 Caracteres'),
    body('discount_percentage')
        .notEmpty()
        .withMessage('La Promoción Debe Tener un Porcentaje de Descuento')
        .isInt({ min: 1, max: 100 })
        .withMessage('El Descuento Debe Estar Entre 1% y 100%')
        .toInt(),
    body('date_start')
        .notEmpty()
        .withMessage('La Promoción Debe Tener una Fecha de Inicio')
        .isISO8601()
        .withMessage('Debe Ingresar una Fecha de Inicio Válida')
        .toDate(),
    body('date_end')
        .notEmpty()
        .withMessage('La Promoción Debe Tener una Fecha de Fin')
        .isISO8601()
        .withMessage('Debe Ingresar una Fecha de Fin Válida')
        .toDate(),
    body('min_people')
        .notEmpty()
        .withMessage('La Promoción Debe Tener un Mínimo de Personas')
        .isInt({ min: 1 })
        .withMessage('El Mínimo de Personas debe ser al Menos 1')
        .toInt(),
    checkValidators,
];
