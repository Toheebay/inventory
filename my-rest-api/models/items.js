const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // must match the name used in Category model export
  },
  price: {
    type: Number,
    required: true,
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Item', itemSchema);
