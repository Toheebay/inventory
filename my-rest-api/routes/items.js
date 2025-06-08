const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { verifyToken, checkRole } = require('./middleware/auth');
const Product = require('./models/Product');

dotenv.config();
const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Storage setup for images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Dummy users
const users = [
  { id: 1, username: 'admin', password: 'toheeb1', role: 'admin' },
  { id: 2, username: 'staff', password: 'warehouse123', role: 'staff' }
];

// Login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });
  res.json({ token });
});

// Create product (admin only)
app.post('/api/products', verifyToken, checkRole(['admin']), upload.array('images', 3), async (req, res) => {
  try {
    const { name, price, bonusPrice } = req.body;
    const imagePaths = req.files.map(file => file.path);

    const product = new Product({
      name,
      price,
      bonusPrice,
      images: imagePaths
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error saving product' });
  }
});

// Get products (admin or staff)
app.get('/api/products', verifyToken, checkRole(['admin', 'staff']), async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
