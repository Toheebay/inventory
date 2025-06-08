// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const {
  authRoutes,
  categoryRoutes,
  transactionRoutes,
  productRoutes,
  barcodeRoutes,
} = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Glo Stock Canvas API!');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/products', productRoutes);
app.use('/api/barcodes', barcodeRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
});
