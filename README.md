# Glo Stock Canvas API: For system inventory Management App

A simple CRUD RESTful API built with **Node.js**, **Express**, and **MongoDB** for managing stock items. This is the backend service for the Glo Stock Canvas inventory system, ready to integrate with frontend tools like Lovable AI or React apps.

---

## Features

- Add new stock items (Create)
- View all or single items (Read)
- Update item details (Update)
- Delete stock items (Delete)
- Connected to MongoDB Atlas
- RESTful structure, ready for deployment

---

## 🔧 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB Atlas** with **Mongoose**
- **dotenv** for environment configuration

---

## 📦 Installation

<!-- 1. **Clone the repo** -->
<!-- ```bash -->

git clone https://github.com/your-username/glo-stock-canvas-api.git
cd glo-stock-canvas-api
Install dependencies

bash
Copy
Edit

npm install

# Create a .env file in the root directory

MONGO_URI=your_mongodb_connection_string_here

# Run the server

nodemon server.js

API Endpoints
Method Endpoint Description
GET /api/items Get all items
GET /api/items/:id Get one item by ID
POST /api/items Add a new item
PUT /api/items/:id Update item by ID
DELETE /api/items/:id Delete item by ID
