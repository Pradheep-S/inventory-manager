import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext.jsx";
import "./Carts.css";
import Footer from "../components/Footer.jsx";

const Carts = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const { updateCartCount } = useCart();

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { "x-access-token": token },
      });
      setCartItems(res.data.items || []);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to fetch cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [navigate]); // `navigate` is a dependency because it’s used inside fetchCart

  useEffect(() => {
    fetchCart();
  }, [fetchCart]); // Include fetchCart in the dependency array

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const handleRemoveFromCart = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      const itemToRemove = cartItems.find((item) => item.productId._id === productId);
      const itemName = itemToRemove ? itemToRemove.productId.name : "Item";

      await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
        headers: { "x-access-token": token },
      });

      const updatedItems = cartItems.filter((item) => item.productId._id !== productId);
      setCartItems(updatedItems);

      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { "x-access-token": token },
      });
      const items = res.data.items || [];
      const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
      updateCartCount(totalCount);

      setNotification(`${itemName} removed`);
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to remove product from cart. Please try again.");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );
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
          <button className="checkout-btn">Proceed to Checkout</button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Carts;