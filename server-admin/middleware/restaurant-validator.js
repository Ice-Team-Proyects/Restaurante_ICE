import { body } from 'express-validator';
//import { validateFields } from './validate-fields.js';
import { checkValidators } from './check-validators.js';

export const validateCreateRestaurant = [
    body('name')
        .notEmpty().withMessage('El nombre del restaurante es obligatorio')
        .isString().withMessage('El nombre debe ser una cadena de texto')
        .isLength({ max: 100 }).withMessage('El nombre no puede exceder los 100 caracteres'),
        
    body('address')
        .notEmpty().withMessage('La dirección es obligatoria')
        .isString().withMessage('La dirección debe ser una cadena de texto')
        .isLength({ max: 500 }).withMessage('La dirección no puede exceder los 500 caracteres'),
        
    body('phone')
        .notEmpty().withMessage('El número de teléfono es obligatorio')
        .isString().withMessage('El teléfono debe ser texto')
        .isLength({ max: 8 }).withMessage('El teléfono no puede exceder los 8 caracteres'),
        
    body('openingHours')
        .notEmpty().withMessage('El horario de atención es obligatorio')
        .isString().withMessage('El horario debe ser texto')
        .isLength({ max: 100 }).withMessage('El horario no puede exceder los 100 caracteres'),
        
    body('description')
        .optional()
        .isString().withMessage('La descripción debe ser texto')
        .isLength({ max: 500 }).withMessage('La descripción no puede exceder los 500 caracteres'),

    // Este middleware final es el que recolecta todos los errores de arriba 
    // y detiene la petición si algo falló.
    checkValidators 
];