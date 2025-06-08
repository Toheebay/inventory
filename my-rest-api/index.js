// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');  // Load .env variables
dotenv.config();

const app = express();
app.use(express.json());

// ✅ MongoDB Connection (using Mongoose, not MongoClient from mongodb)
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

// ✅ Define Schema and Model
const itemSchema = new mongoose.Schema({
  name: String,
  price: Number
});
const Item = mongoose.model('Item', itemSchema);

// ✅ CREATE
app.post('/api/items', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json({ message: 'Item added', item: newItem });
  } catch (err) {
    res.status(500).json({ message: "Create failed", error: err });
  }
});

// ✅ READ all
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Read failed", error: err });
  }
});

// ✅ READ one
app.get('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Error finding item", error: err });
  }
});

// ✅ UPDATE
app.put('/api/items/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item updated', item: updatedItem });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err });
  }
});

// ✅ DELETE
app.delete('/api/items/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted', item: deletedItem });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err });
  }
});

// ✅ Homepage
app.get('/', (req, res) => {
  res.send('Welcome to Glo Stock Canvas API (CRUD ready)');
});

// ✅ Start server
const port = 8080;
app.listen(port, () => {
  console.log(`🚀 Backend running at http://localhost:${port}`);
});
