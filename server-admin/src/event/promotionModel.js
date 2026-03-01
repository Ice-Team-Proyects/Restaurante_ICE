'use strict';

import { Schema, model } from 'mongoose';

const promotionSchema = new Schema(
    {
        name_promotion: {
            type: String,
            required: [true, 'La Promoción Debe Tener un Nombre'],
            trim: true,
            maxLength: [150, 'El Nombre es Demasiado Largo, no Puede Superar los 150 Caracteres']
        },
        description: {
            type: String,
            required: [true, 'La Promoción Debe Tener una Descripción'],
            trim: true,
            maxLength: [500, 'La Descripción no Puede Superar los 500 Caracteres']
        },
        discount_percentage: {
            type: Number,
            required: [true, 'La Promoción Debe Tener un Porcentaje de Descuento'],
            min: [1, 'El Descuento Mínimo es del 1%'],
            max: [100, 'El Descuento no Puede Superar el 100%']
        },
        date_start: {
            type: Date,
            required: [true, 'La Promoción Debe Tener una Fecha de Inicio']
        },
        date_end: {
            type: Date,
            required: [true, 'La Promoción Debe Tener una Fecha de Fin']
        },
        min_people: {
            type: Number,
            required: [true, 'La Promoción Debe Tener un Mínimo de Personas'],
            min: [1, 'El Mínimo de Personas debe ser al Menos 1']
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

promotionSchema.index({ isActive: 1 });
promotionSchema.index({ name_promotion: 1 });
promotionSchema.index({ date_start: 1, date_end: 1 });
promotionSchema.index({ isActive: 1, name_promotion: 1 });

export default model('Promotion', promotionSchema);
