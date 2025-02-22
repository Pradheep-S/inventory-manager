const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Define Product Schema and Model
const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  quantity: Number,
  price: Number,
  supplier: String,
  timestamp: { type: Date, default: Date.now }, // Add timestamp field
});

const Product = mongoose.model("Product", ProductSchema);

// Add Product
app.post("/api/inventory/add", async (req, res) => {
  try {
    const { name, description, quantity, price, supplier } = req.body;
    const newProduct = new Product({
      name,
      description,
      quantity,
      price,
      supplier,
      timestamp: new Date(), // Explicitly set the timestamp
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Products
app.get("/api/inventory", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Product
app.put("/api/inventory/update/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, timestamp: new Date() }, // Update the timestamp
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Product
app.delete("/api/inventory/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Low Stock Products
app.get("/api/inventory/low-stock", async (req, res) => {
  try {
    const lowStockProducts = await Product.find({ quantity: { $lt: 10 } });
    res.json(lowStockProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Recent Activities
app.get("/api/inventory/recent-activities", async (req, res) => {
  try {
    const recentActivities = await Product.find()
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order
      .limit(5); // Limit to 5 most recent activities
    res.json(recentActivities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));