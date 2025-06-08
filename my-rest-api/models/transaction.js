const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['in', 'out'], // "in" for stock-in, "out" for stock-out
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  notes: String,
});

module.exports = mongoose.model('Transaction', transactionSchema);
