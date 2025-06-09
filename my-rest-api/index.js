
// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');  // Load .env variables
const cors = require('cors');      // ✅ Import CORS

dotenv.config();

const authRoutes = require('./routes/auth'); // ✅ Import auth route
const { verifyToken, requireAdmin } = require('./middleware/auth'); // ✅ Import auth middleware

const app = express();

// ✅ Setup CORS middleware
app.use(cors({
  origin: ['https://glo-stock-canvas.lovable.app', 'http://localhost:3000', 'http://localhost:5173'],  // 🔗 Frontend URLs
  credentials: true
}));

// ✅ Middleware to parse JSON request bodies
app.use(express.json());

// ✅ Connect auth routes
app.use('/api/auth', authRoutes);

// ✅ MongoDB Connection using Mongoose
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ Connected to MongoDB Atlas");
})
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
});

// ✅ Define Mongoose schema and model
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  category: String,
  quantity: { type: Number, default: 0 },
  sku: String,
  barcode: String,
  image: String,
  minStockLevel: { type: Number, default: 5 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);

// ✅ CREATE item (Protected route)
app.post('/api/items', verifyToken, async (req, res) => {
  try {
    const newItem = new Item({
      ...req.body,
      createdBy: req.user._id
    });
    await newItem.save();
    res.status(201).json({ message: 'Item added successfully', item: newItem });
  } catch (err) {
    console.error('Create item error:', err);
    res.status(500).json({ message: "Failed to create item", error: err.message });
  }
});

// ✅ READ all items (Protected route)
app.get('/api/items', verifyToken, async (req, res) => {
  try {
    const items = await Item.find().populate('createdBy', 'email full_name');
    res.json(items);
  } catch (err) {
    console.error('Get items error:', err);
    res.status(500).json({ message: "Failed to fetch items", error: err.message });
  }
});

// ✅ READ one item (Protected route)
app.get('/api/items/:id', verifyToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('createdBy', 'email full_name');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    console.error('Get item error:', err);
    res.status(500).json({ message: "Error finding item", error: err.message });
  }
});

// ✅ UPDATE item (Protected route)
app.put('/api/items/:id', verifyToken, async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item updated successfully', item: updatedItem });
  } catch (err) {
    console.error('Update item error:', err);
    res.status(500).json({ message: "Failed to update item", error: err.message });
  }
});

// ✅ DELETE item (Protected route - Admin only)
app.delete('/api/items/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted successfully', item: deletedItem });
  } catch (err) {
    console.error('Delete item error:', err);
    res.status(500).json({ message: "Failed to delete item", error: err.message });
  }
});

// ✅ GET user profile (Protected route)
app.get('/api/users/:id', verifyToken, async (req, res) => {
  try {
    // Users can only access their own profile unless they're admin
    if (req.params.id !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const User = require('./models/User');
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
});

// ✅ Home route
app.get('/', (req, res) => {
  res.send('Welcome to Glo Stock Canvas API - MongoDB & RESTful API Ready!');
});

// ✅ Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// ✅ Start server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 Backend running at http://localhost:${port}`);
  console.log(`📧 Make sure to set EMAIL_USER and EMAIL_PASS environment variables for email verification`);
  console.log(`🔑 Make sure to set JWT_SECRET environment variable for authentication`);
});
