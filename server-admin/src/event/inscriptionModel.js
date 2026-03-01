'use strict';

import { Schema, model } from 'mongoose';

const inscriptionSchema = new Schema(
    {
        name_customer: {
            type: String,
            required: [true, 'La Inscripción Debe Tener el Nombre del Cliente'],
            trim: true,
            maxLength: [150, 'El Nombre es Demasiado Largo, no Puede Superar los 150 Caracteres']
        },
        email_customer: {
            type: String,
            required: [true, 'La Inscripción Debe Tener el Email del Cliente'],
            trim: true,
            lowercase: true,
            maxLength: [150, 'El Email no Puede Superar los 150 Caracteres']
        },
        phone_customer: {
            type: String,
            required: [true, 'La Inscripción Debe Tener el Teléfono del Cliente'],
            trim: true,
            maxLength: [20, 'El Teléfono no Puede Superar los 20 Caracteres']
        },
        id_event: {
            type: Schema.Types.ObjectId,
            ref: 'Event',
            required: [true, 'La Inscripción Debe Estar Asociada a un Evento']
        },
        number_people: {
            type: Number,
            required: [true, 'Debe Establecer Cuántas Personas Asistirán'],
            min: [1, 'Debe Haber al Menos una Persona'],
            max: [20, 'No se Pueden Inscribir más de 20 Personas por Solicitud']
        },
        id_promotion: {
            type: Schema.Types.ObjectId,
            ref: 'Promotion',
            default: null
        },
        total_price: {
            type: Number,
            required: [true, 'La Inscripción Debe Tener un Precio Total'],
            min: [0, 'El Precio Total no Puede ser Negativo']
        },
        status: {
            type: String,
            enum: {
                values: ['pendiente', 'confirmada', 'cancelada'],
                message: 'El Estado debe ser: pendiente, confirmada o cancelada'
            },
            default: 'pendiente'
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

inscriptionSchema.index({ isActive: 1 });
inscriptionSchema.index({ name_customer: 1 });
inscriptionSchema.index({ id_event: 1 });
inscriptionSchema.index({ status: 1 });
inscriptionSchema.index({ isActive: 1, id_event: 1 });

export default model('Inscription', inscriptionSchema);
