const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// GET all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('item');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate('item');
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new transaction
router.post('/', async (req, res) => {
