import { body, param } from 'express-validator';
import { checkValidators } from './check-validators.js';

export const validateCreateAnalytics = [
    body('metricName')
        .notEmpty().withMessage('El nombre de la métrica o reporte es requerido')
        .isString().withMessage('El nombre debe ser una cadena de texto')
        .isLength({ max: 150 }).withMessage('El nombre no puede exceder 150 caracteres'),
    
    body('value')
        .notEmpty().withMessage('El valor de la métrica es requerido')
        .isNumeric().withMessage('El valor debe ser un número'),
    
    body('type')
        .optional() // Es opcional porque el modelo tiene un valor por defecto ('ESTADISTICA')
        .isIn(['DASHBOARD', 'REPORTE', 'ESTADISTICA']).withMessage('Tipo de registro no válido, debe ser DASHBOARD, REPORTE o ESTADISTICA'),
    
    body('description')
        .optional()
        .isString().withMessage('La descripción debe ser texto')
        .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),
    
    checkValidators 
];

export const validateIdParam = [
    param('id')
        .isMongoId().withMessage('No es un ID válido de MongoDB'),
    checkValidators
];