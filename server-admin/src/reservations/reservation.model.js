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
        table: {
        type: Schema.Types.ObjectId,
        ref: 'Table',
        required: [true, 'Una reservación debe tener una mesa asignada']
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

reservationSchema.index({ isActive: 1 });
reservationSchema.index({ name_customer: 1 });
reservationSchema.index({ isActive: 1, name_customer: 1 });

export default model('Reservation', reservationSchema);