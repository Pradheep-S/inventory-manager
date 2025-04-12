/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext.jsx";
import "./Carts.css";
import Footer from "../components/Footer.jsx";

const Carts = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const navigate = useNavigate();
  const { updateCartCount } = useCart();

  // Razorpay configuration
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

  // Mock cart data - in a real app, you would fetch this from your backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    setLoading(true);
    // Simulate loading cart items
    const timer = setTimeout(() => {
      // Mock cart items data
      const mockCartItems = [
        {
          productId: {
            _id: "1",
            name: "Sample Product 1",
            price: 499,
          },
          quantity: 2
        },
        {
          productId: {
            _id: "2",
            name: "Sample Product 2",
            price: 1299,
          },
          quantity: 1
        }
      ];
      setCartItems(mockCartItems);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const handleRemoveFromCart = (productId) => {
    const updatedItems = cartItems.filter((item) => item.productId._id !== productId);
    setCartItems(updatedItems);
    const itemName = cartItems.find(item => item.productId._id === productId)?.productId.name || "Item";
    setNotification(`${itemName} removed`);
    setTimeout(() => setNotification(null), 3000);
    updateCartCount(updatedItems.reduce((acc, item) => acc + item.quantity, 0));
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    setProcessingPayment(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Razorpay SDK failed to load. Are you online?");
      }

      // In a real app, you would create an order on your backend
      // For demo purposes, we'll simulate this client-side
      const amount = Math.round(calculateTotal() * 100); // Convert to paise
      // const receipt = `order_${Date.now()}`;

      // Razorpay options - using test mode directly
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: amount,
        currency: "INR",
        name: "Mithun Electricals",
        description: "Test Payment",
        order_id: undefined, // Not using actual orders in this demo
        handler: function (response) {
          // In a real app, you would verify the payment on your backend
          setNotification("Payment successful! This is a demo transaction.");
          setCartItems([]);
          updateCartCount(0);
        },
        prefill: {
          name: "Test User",
          email: "test.user@example.com",
          contact: "9876543210",
        },
        notes: {
          address: "Test Address",
        },
        theme: {
          color: RAZORPAY_THEME_COLOR,
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      
      razorpayInstance.on("payment.failed", function (response) {
        setError(`Payment failed: ${response.error.description}`);
      });

      razorpayInstance.open();
    } catch (error) {
      setError(error.message || "Failed to initiate payment. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
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
          <div className="test-mode-info">
            
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Carts;