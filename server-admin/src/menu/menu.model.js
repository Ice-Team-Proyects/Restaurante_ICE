'use strict';

import { Schema, model } from 'mongoose';

const menuSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre del menú es requerido'],
            trim: true,
            maxLength: [100, 'El nombre no puede superar 100 caracteres'],
        },
        description: {
            type: String,
            trim: true,
            maxLength: [500, 'La descripción no puede superar 500 caracteres'],
            default: '',
        },
        products: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true, versionKey: false }
);

menuSchema.index({ isActive: 1 });

export default model('Menu', menuSchema);