import { useState, useEffect } from 'react';
import { useCheckout } from './CheckoutContext';

// eslint-disable-next-line react/prop-types
const PaymentMethod = ({ onNext, onBack }) => {
  const { checkoutData, updateCheckoutData } = useCheckout();
  const [paymentMethod, setPaymentMethod] = useState('online');

  useEffect(() => {
    if (checkoutData.paymentMethod) {
      setPaymentMethod(checkoutData.paymentMethod);
    }
  }, [checkoutData.paymentMethod]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCheckoutData({ paymentMethod });
    onNext();
  };

  return (
    <div className="payment-method">
      <h2>Payment Method</h2>
      <form onSubmit={handleSubmit}>
        <div className="payment-options">
          <label className="payment-option">
            <input
              type="radio"
              value="online"
              checked={paymentMethod === 'online'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <div className="option-content">
              <span className="option-title">Online Payment</span>
              <span className="option-desc">Pay securely with Razorpay</span>
            </div>
          </label>

          <label className="payment-option">
            <input
              type="radio"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <div className="option-content">
              <span className="option-title">Cash on Delivery</span>
              <span className="option-desc">Pay when you receive your order</span>
            </div>
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-back" onClick={onBack}>
            Back to Shipping
          </button>
          <button type="submit" className="btn-next">
            Continue to Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentMethod;