import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from './CheckoutContext';
import { useCart } from './CartContext';

// eslint-disable-next-line react/prop-types
const OrderSummary = ({ onBack }) => {
  const { checkoutData } = useCheckout();
  const { updateCartCount } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => 
      total + item.productId.price * item.quantity, 0
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

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

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    if (checkoutData.paymentMethod === 'cod') {
      // Handle COD order
      try {
        // Simulate API call to create order (replace with actual API call)
        // await axios.post('http://localhost:5000/api/orders', { ...orderData }, { headers });
        localStorage.removeItem('cartItems');
        updateCartCount(0);
        navigate('/order-success');
      } catch (error) {
        console.error('Order creation failed:', error);
        setError('Failed to create order. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      // Handle Razorpay payment
      try {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
        }

        const options = {
          key: "rzp_test_qrB3kyGhLYMsvr",
          amount: Math.round(calculateTotal() * 100),
          currency: "INR",
          name: "Mithun Electricals",
          description: "Order Payment",
          handler: function () {
            // Handle successful payment
            localStorage.removeItem('cartItems');
            updateCartCount(0);
            navigate('/order-success');
          },
          prefill: {
            name: checkoutData.shippingAddress.fullName,
            contact: checkoutData.shippingAddress.phone,
          },
          theme: {
            color: "#3399cc",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.on("payment.failed", function (response) {
          setError(`Payment failed: ${response.error.description}`);
        });
        razorpay.open();
      } catch (error) {
        setError(error.message || "Failed to initiate payment. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="order-summary">
      <h2>Order Summary</h2>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div className="summary-section">
        <h3>Shipping Address</h3>
        <div className="address-details">
          <p>{checkoutData.shippingAddress.fullName}</p>
          <p>{checkoutData.shippingAddress.address}</p>
          <p>{checkoutData.shippingAddress.city}, {checkoutData.shippingAddress.state}</p>
          <p>PIN: {checkoutData.shippingAddress.pincode}</p>
          <p>Phone: {checkoutData.shippingAddress.phone}</p>
        </div>
      </div>

      <div className="summary-section">
        <h3>Payment Method</h3>
        <p>{checkoutData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
      </div>

      <div className="summary-section">
        <h3>Order Items</h3>
        <div className="order-items">
          {cartItems.map(item => (
            <div key={item.productId._id} className="order-item">
              <div className="item-details">
                <h4>{item.productId.name}</h4>
                <p>Quantity: {item.quantity}</p>
              </div>
              <div className="item-price">
                {formatPrice(item.productId.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="price-summary">
        <div className="price-row">
          <span>Subtotal</span>
          <span>{formatPrice(calculateTotal())}</span>
        </div>
        <div className="price-row">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="price-row total">
          <span>Total</span>
          <span>{formatPrice(calculateTotal())}</span>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-back" onClick={onBack}>
          Back to Payment
        </button>
        <button 
          type="button" 
          className="btn-place-order"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;