'use strict';

import { Schema, model } from 'mongoose';

const tableSchema = new Schema({
  number: {
    type: Number,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  status: {
    type: String,
    enum: ["disponible", "ocupada", "reservada"],
    default: "disponible"
  },
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: false
  }
}, {
  timestamps: true
});

// index is set on field via schema option above; removed stale name indexes

export default model('Table', tableSchema);
