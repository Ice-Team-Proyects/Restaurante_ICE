'use strict';

import {Schema, model} from 'mongoose';

const reservationSchema = new Schema(
    {
        name_customer:{
            type: String,
            required: [true, 'La Reserva Debe Tener Nombre del Cliente'],
            trim: true,
            maxLength: [150, 'El Nombre es Demasiado Largo, no Puede Superar los 150 Caracteres']
        },
        number_people:{
            type: Number,
            required: [true, 'Debe Estableces para Cuantas Personas es la Reserva'],
            trim: true,
            min: [1, 'Debe haber al menos una persona'],
            max: [500, 'La Reserva Excede la Capacidad Del Local de 500 Personas']
        },
        time_reservation:{
            type: Date,
            required: [true, 'Debe Establecer Hora Para La Reserva']
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

productSchema.index({ isActive: 1 });
productSchema.index({ name_custumer: 1 });
productSchema.index({ isActive: 1, name_custumer: 1 });

export default model('Reservation', reservationSchema);