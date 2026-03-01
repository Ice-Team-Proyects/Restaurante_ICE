'use strict';

import { Schema, model } from 'mongoose';

const eventSchema = new Schema(
    {
        name_event: {
            type: String,
            required: [true, 'El Evento Debe Tener un Nombre'],
            trim: true,
            maxLength: [150, 'El Nombre es Demasiado Largo, no Puede Superar los 150 Caracteres']
        },
        description: {
            type: String,
            required: [true, 'El Evento Debe Tener una Descripción'],
            trim: true,
            maxLength: [500, 'La Descripción no Puede Superar los 500 Caracteres']
        },
        date_event: {
            type: Date,
            required: [true, 'El Evento Debe Tener una Fecha']
        },
        capacity: {
            type: Number,
            required: [true, 'El Evento Debe Tener una Capacidad Máxima'],
            min: [1, 'La Capacidad Mínima es de 1 Persona'],
            max: [500, 'La Capacidad no Puede Superar las 500 Personas']
        },
        location: {
            type: String,
            required: [true, 'El Evento Debe Tener una Ubicación'],
            trim: true,
            maxLength: [200, 'La Ubicación no Puede Superar los 200 Caracteres']
        },
        price: {
            type: Number,
            required: [true, 'El Evento Debe Tener un Precio'],
            min: [0, 'El Precio no Puede ser Negativo']
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

eventSchema.index({ isActive: 1 });
eventSchema.index({ name_event: 1 });
eventSchema.index({ date_event: 1 });
eventSchema.index({ isActive: 1, name_event: 1 });

export default model('Event', eventSchema);
