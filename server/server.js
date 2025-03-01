const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Define User Schema and Model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
});

const User = mongoose.model("User", UserSchema);

// Define Product Schema and Model
const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  quantity: Number,
  price: Number,
  supplier: String,
  timestamp: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", ProductSchema);

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) return res.status(403).send("A token is required for authentication");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

// Middleware to check admin role
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Access denied");
  }
  next();
};

// Register User
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email, and password are required" });
    }

    // Check if the email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "Email or username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    console.error("Registration error:", err); // Log the error for debugging
    res.status(500).json({ error: "Failed to register user", details: err.message });
  }
});

// Login User
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err); // Log the error for debugging
    res.status(500).json({ error: "Failed to login", details: err.message });
  }
});

// Add Product (Protected Route)
app.post("/api/inventory/add", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, description, quantity, price, supplier } = req.body;
    const newProduct = new Product({
      name,
      description,
      quantity,
      price,
      supplier,
      timestamp: new Date(),
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