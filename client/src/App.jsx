import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Inventory from "./admin/Inventory";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import Dashboard from "./admin/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import Auth from "./pages/Auth";
import Carts from "./pages/Carts"; // Import the new Carts component
import { CartProvider } from "./pages/CartContext.jsx"; // Updated path

function App() {
  return (
    <CartProvider> {/* Wrap the app with CartProvider */}
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth" element={<Auth />} />

          {/* Protected Routes */}
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <Products />
              </PrivateRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Carts />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/inventory"
            element={
              <PrivateRoute>
                <AdminRoute>
                  <Inventory />
                </AdminRoute>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;