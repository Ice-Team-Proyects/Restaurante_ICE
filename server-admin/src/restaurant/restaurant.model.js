'use strict';

import { Schema, model } from 'mongoose';

const restaurantSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre del restaurante es requerido'],
            trim: true,
            maxLength: [100, 'El nombre no puede exceder 100 caracteres'],
        },
        address: {
            type: String,
            required: [true, 'La dirección detallada es requerida'],
            trim: true,
            maxLength: [500, 'La dirección no puede exceder 500 caracteres'],
        },
        phone: {
            type: String,
            required: [true, 'El número de teléfono es requerido'],
            trim: true,
            maxLength: [8, 'El teléfono no puede exceder 8 caracteres'],
        },
        openingHours: {
            type: String,
            required: [true, 'El horario de atención es requerido'],
            trim: true,
            maxLength: [100, 'El horario no puede exceder 100 caracteres'],
        },
        description: {
            type: String,
            trim: true,
            maxLength: [500, 'La descripción no puede exceder 500 caracteres'],
        },
        photo: {
            type: String,
            default: 'restaurants/default_restaurant_image',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Índices para optimizar búsquedas
restaurantSchema.index({ isActive: 1 });
restaurantSchema.index({ name: 1 });
restaurantSchema.index({ isActive: 1, name: 1 });

export default model('Restaurant', restaurantSchema);