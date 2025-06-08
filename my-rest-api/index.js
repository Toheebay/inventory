// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');  // Load .env variables
const cors = require('cors');      // ✅ Import CORS

dotenv.config();

const authRoutes = require('./routes/auth'); // ✅ Import auth route

const app = express();

// ✅ Setup CORS middleware
app.use(cors({
  origin: 'https://glo-stock-canvas.lovable.app',  // 🔗 Frontend URL
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
  name: String,
  price: Number
});
const Item = mongoose.model('Item', itemSchema);

// ✅ CREATE item
app.post('/api/items', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json({ message: 'Item added', item: newItem });
  } catch (err) {
    res.status(500).json({ message: "Create failed", error: err });
  }
});

// ✅ READ all items
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Read failed", error: err });
  }
});

// ✅ READ one item
app.get('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Error finding item", error: err });
  }
});

// ✅ UPDATE item
app.put('/api/items/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item updated', item: updatedItem });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err });
  }
});

// ✅ DELETE item
app.delete('/api/items/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted', item: deletedItem });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err });
  }
});

// ✅ Home route
app.get('/', (req, res) => {
  res.send('Welcome to Glo Stock Canvas API (CRUD ready)');
});

// ✅ Start server
const port = 8080;
app.listen(port, () => {
  console.log(`🚀 Backend running at http://localhost:${port}`);
});
