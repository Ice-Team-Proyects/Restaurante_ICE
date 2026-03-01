import { body } from 'express-validator';
import { validateJWT } from './validate-JWT.js';
import { checkValidators } from './check-validators.js';

export const validateCreateEvent = [
    validateJWT,
    body('name_event')
        .notEmpty()
        .withMessage('El Evento Debe Tener un Nombre')
        .isLength({ min: 2, max: 150 })
        .withMessage('El Nombre no Puede Superar los 150 Caracteres'),
    body('description')
        .notEmpty()
        .withMessage('El Evento Debe Tener una Descripción')
        .isLength({ min: 2, max: 500 })
        .withMessage('La Descripción no Puede Superar los 500 Caracteres'),
    body('date_event')
        .notEmpty()
        .withMessage('El Evento Debe Tener una Fecha')
        .isISO8601()
        .withMessage('Debe Ingresar una Fecha Válida')
        .toDate(),
    body('capacity')
        .notEmpty()
        .withMessage('El Evento Debe Tener una Capacidad Máxima')
        .isInt({ min: 1, max: 500 })
        .withMessage('La Capacidad Debe Estar Entre 1 y 500 Personas')
        .toInt(),
    body('location')
        .notEmpty()
        .withMessage('El Evento Debe Tener una Ubicación')
        .isLength({ min: 2, max: 200 })
        .withMessage('La Ubicación no Puede Superar los 200 Caracteres'),
    body('price')
        .notEmpty()
        .withMessage('El Evento Debe Tener un Precio')
        .isFloat({ min: 0 })
        .withMessage('El Precio no Puede ser Negativo')
        .toFloat(),
    checkValidators,
];
