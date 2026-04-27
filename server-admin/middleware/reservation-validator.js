import { body, param } from 'express-validator';
import { validateJWT } from './validate-JWT.js';
import { checkValidators } from './check-validators.js';

export const validateCreateReservation = [
    validateJWT,
    body('name_customer')
        .notEmpty()
        .withMessage('La Reserva Debe Tener Nombre del Cliente')
        .isLength({ min: 2, max: 150 })
        .withMessage('El Nombre es Demasiado Largo, no Puede Superar los 150 Caracteres'),
    body('number_people')
        .notEmpty()
        .withMessage('Debe Estableces para Cuantas Personas es la Reserva')
        .isInt({min: 1, max: 500 })
        .withMessage('La Reserva Excede la Capacidad Del Local de 500 Personas')
        .toInt(),
    body('time_reservation')
        .notEmpty()
        .withMessage('Debe Establecer Hora Para La Reserva')
        .isISO8601()
        .withMessage('Debe ingresar una fecha válida')
        .toDate(),
    body('table')
        .notEmpty()
        .withMessage('La reservación debe tener una mesa asignada')
        .isMongoId()
        .withMessage('El ID de la mesa no es válido'),
    checkValidators,
];