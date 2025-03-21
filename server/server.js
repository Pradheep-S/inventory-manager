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

// User Schema (Regular Users)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user"], default: "user" },
});

const User = mongoose.model("User", UserSchema);

// Admin Schema
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
});

const Admin = mongoose.model("Admin", AdminSchema);

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  quantity: Number,
  price: Number,
  supplier: String,
  timestamp: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", ProductSchema);

// Cart Schema
const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

const Cart = mongoose.model("Cart", CartSchema);

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
    return res.status(403).send("Access denied: Admin privileges required");
  }
  next();
};

// Register User
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email, and password are required" });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "Email or username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Failed to register user", details: err.message });
  }
});

// Login User
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Failed to login", details: err.message });
  }
});

// Admin Login
app.post("/api/auth/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const admin = await Admin.findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(400).json({ error: "Invalid admin credentials" });
    }
    const token = jwt.sign({ userId: admin._id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, user: { id: admin._id, username: admin.username, role: admin.role } });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: "Failed to login as admin", details: err.message });
  }
});

// Add Product (Admin Only)
app.post("/api/inventory/add", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, description, quantity, price, supplier } = req.body;
    const newProduct = new Product({ name, description, quantity, price, supplier });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Products (Public)
app.get("/api/inventory", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Product (Admin Only)
app.put("/api/inventory/update/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, timestamp: new Date() },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Product (Admin Only)
app.delete("/api/inventory/delete/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add to Cart (User Only)
app.post("/api/cart/add", verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;

    if (req.user.role === "admin") {
      return res.status(403).json({ error: "Admins cannot add items to cart" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({ productId, quantity: quantity || 1 });
    }

    cart.updatedAt = new Date();
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Cart (User Only)
app.get("/api/cart", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove from Cart (User Only)
app.delete("/api/cart/remove/:productId", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    cart.updatedAt = new Date();
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Initialize Default Admin
const initializeDefaultAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ username: "admin2" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("mithun", 10);
      const defaultAdmin = new Admin({
        username: "admin2",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin",
      });
      await defaultAdmin.save();
      console.log("Default admin created: admin2/mithun");
    } else {
      console.log("Default admin already exists");
    }
  } catch (err) {
    console.error("Error creating default admin:", err);
  }
};

mongoose.connection.once("open", () => {
  initializeDefaultAdmin();
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));