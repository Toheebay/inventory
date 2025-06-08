const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  costPrice: {
    type: Number,
    required: true
  },
  sellingPrice: {
    type: Number,
    required: true
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true // allow multiple nulls
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
