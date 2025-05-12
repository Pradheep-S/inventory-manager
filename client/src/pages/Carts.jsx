/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import "./Carts.css";
import Footer from "../components/Footer";
import axios from "axios";

const Carts = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const navigate = useNavigate();
  const { updateCartCount } = useCart();

  const RAZORPAY_KEY_ID = "rzp_test_qrB3kyGhLYMsvr";
  const RAZORPAY_THEME_COLOR = "#3399cc";

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://inventory-manager-wz40.onrender.com/api/cart", {
          headers: { "x-access-token": token },
        });
        setCartItems(response.data.items || []);
      } catch (err) {
        setError("Failed to load cart items. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const handleRemoveFromCart = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    try {
      await axios.delete(`https://inventory-manager-wz40.onrender.com/api/cart/remove/${productId}`, {
        headers: { "x-access-token": token },
      });

      // Update local state
      const updatedItems = cartItems.filter(
        (item) => item.productId._id !== productId
      );
      setCartItems(updatedItems);

      // Update cart count in context
      const count = updatedItems.reduce((acc, item) => acc + item.quantity, 0);
      updateCartCount(count);

      const itemName = cartItems.find(
        (item) => item.productId._id === productId
      )?.productId.name || "Item";
      setNotification(`${itemName} removed`);
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setError("Failed to remove item from cart. Please try again.");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );
  };

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    // Store cart items in localStorage for checkout process
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    navigate("/checkout");
  };

  return (
    <div className="carts-container">
      <h1>Your Cart</h1>

      {notification && (
        <div className="cart-notification">
          {notification}
          <button onClick={() => setNotification(null)}>×</button>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div className="carts-grid">
        {loading ? (
          <div className="loading-message">Loading cart...</div>
        ) : !cartItems.length ? (
          <div className="no-items-message">Your cart is empty.</div>
        ) : (
          cartItems.map((item) => (
            <div key={item.productId._id} className="cart-card">
              <h2>{item.productId.name}</h2>
              <p className="cart-price">
                {formatPrice(item.productId.price)} x {item.quantity}
              </p>
              <p className="cart-total">
                Total: {formatPrice(item.productId.price * item.quantity)}
              </p>
              <button
                className="remove-btn"
                onClick={() => handleRemoveFromCart(item.productId._id)}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="cart-summary">
          <h3>Total Amount: {formatPrice(calculateTotal())}</h3>
          <button
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={processingPayment}
          >
            {processingPayment ? "Processing..." : "Proceed to Checkout"}
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Carts;