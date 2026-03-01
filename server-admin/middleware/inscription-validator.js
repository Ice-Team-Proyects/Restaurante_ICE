import { body } from 'express-validator';
import { validateJWT } from './validate-JWT.js';
import { checkValidators } from './check-validators.js';

export const validateCreateInscription = [
    validateJWT,
    body('name_customer')
        .notEmpty()
        .withMessage('La Inscripción Debe Tener el Nombre del Cliente')
        .isLength({ min: 2, max: 150 })
        .withMessage('El Nombre no Puede Superar los 150 Caracteres'),
    body('email_customer')
        .notEmpty()
        .withMessage('La Inscripción Debe Tener el Email del Cliente')
        .isEmail()
        .withMessage('Debe Ingresar un Email Válido')
        .isLength({ max: 150 })
        .withMessage('El Email no Puede Superar los 150 Caracteres')
        .normalizeEmail(),
    body('phone_customer')
        .notEmpty()
        .withMessage('La Inscripción Debe Tener el Teléfono del Cliente')
        .isLength({ min: 7, max: 20 })
        .withMessage('El Teléfono Debe Tener Entre 7 y 20 Caracteres'),
    body('id_event')
        .notEmpty()
        .withMessage('La Inscripción Debe Estar Asociada a un Evento')
        .isMongoId()
        .withMessage('El ID del Evento no es Válido'),
    body('number_people')
        .notEmpty()
        .withMessage('Debe Establecer Cuántas Personas Asistirán')
        .isInt({ min: 1, max: 20 })
        .withMessage('El Número de Personas Debe Estar Entre 1 y 20')
        .toInt(),
    body('id_promotion')
        .optional({ nullable: true })
        .isMongoId()
        .withMessage('El ID de la Promoción no es Válido'),
    checkValidators,
];
