'use strict';

import { Schema, model } from 'mongoose';

// Subesquema para los items del pedido y mantenerlo ordenado
const orderItemSchema = new Schema({
    productId: {
        type: String,
        required: [true, 'El ID del producto es requerido']
    },
    quantity: {
        type: Number,
        required: [true, 'La cantidad es requerida'],
        min: [1, 'La cantidad mínima es 1'],
        default: 1
    },
    price: {
        type: Number,
        required: [true, 'El precio es requerido'],
        min: [0, 'El precio no puede ser negativo']
    }
}, { _id: false }); // _id: false para que Mongoose no le asigne un ID propio a cada item

const orderSchema = new Schema(
    {
        tableId: {
            type: String,
            required: [true, 'El identificador de la mesa es requerido'],
            trim: true
        },
        items: {
            type: [orderItemSchema],
            required: [true, 'El pedido debe contener al menos un producto']
        },
        totalAmount: {
            type: Number,
            default: 0,
            min: [0, 'El total no puede ser negativo']
        },
        status: {
            type: String,
            enum: ['PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'],
            default: 'PENDING'
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Índices para optimizar búsquedas (muy útil para buscar pedidos por mesa o estado)
orderSchema.index({ isActive: 1 });
orderSchema.index({ tableId: 1 });
orderSchema.index({ status: 1 });

export default model('Order', orderSchema);