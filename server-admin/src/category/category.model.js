'use strict';

import { Schema, model } from 'mongoose';

const categorySchema = new Schema(
    {
        categoryName:{
            type: String,
            required: [true, 'Debe Darle Nombre a la Categoria'],
            trim: true,
            maxLength: [100, 'El Nombre es Demasiado Largo, no Puede Superar los 100 Caracteres']
        },
        type:{
            type: String,
            required: [true, 'El tipo de campo es requerido'],
            enum: {
                values: ['Bebidas Frias', 'Paltillos', 'Bebidas Calientes', 'Sopas'],
                message: 'Categoria De Alimento no Válida',
            },
        },
        description:{
            type: String,
            required: [true, 'Debe Ingresar Una Descripcion Del Platillo'],
            trim: true,
            maxLength: [500, 'La Descripcion es Demasiado largo, no puede superar los 500 caracteres']
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    }
);

categorySchema.index({ isActive: 1 });
categorySchema.index({ categoryName: 1 });
categorySchema.index({ isActive: 1, categoryName: 1 });

export default model('Category', categorySchema);