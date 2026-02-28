'use strict';

import { Schema, model } from 'mongoose';

const analyticsSchema = new Schema(
    {
        metricName: {
            type: String,
            required: [true, 'El nombre de la métrica o reporte es requerido'],
            trim: true,
            maxLength: [150, 'El nombre no puede exceder 150 caracteres'],
        },
        value: {
            type: Number,
            required: [true, 'El valor de la métrica es requerido'],
            default: 0
        },
        type: {
            type: String,
            required: [true, 'El tipo de registro es requerido'],
            enum: ['DASHBOARD', 'REPORTE', 'ESTADISTICA'],
            default: 'ESTADISTICA'
        },
        description: {
            type: String,
            trim: true,
            maxLength: [500, 'La descripción no puede exceder 500 caracteres'],
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

analyticsSchema.index({ isActive: 1 });
analyticsSchema.index({ type: 1 });
analyticsSchema.index({ isActive: 1, type: 1 });

export default model('Analytics', analyticsSchema);