'use strict';

import { Schema, model } from 'mongoose';

const productSchema = new Schema(
    {
        saucer:{
            type: String,
            required: [true, 'El Nombre del Producto es Necesario'],
            trim: true,
            maxLength: [100, 'El Nombre es Demasiado Largo, no Puede Superar los 100 Caracteres']
        },
        description:{
            type: String,
            required: [true, 'Debe Ingresar Una Descripcion Del Producto'],
            trim: true,
            maxLength: [500, 'La Descripcion es Demasiado largo, no puede superar los 500 caracteres']
        },
        price:{
            type: Number,
            required: [true, 'Debe Darle Un Precio Al Producto'],
            trim: true,
            maxLength: [10, 'El Precio es Demasiado Alto, No Puede Superar las 10 Sifras' ]
        },
        photo: {
            type: String,
            default: 'Menus/default_menu_image',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    }
);

productSchema.index({ isActive: 1 });
productSchema.index({ saucer: 1 });
productSchema.index({ isActive: 1, saucer: 1 });

export default model('Product', productSchema);