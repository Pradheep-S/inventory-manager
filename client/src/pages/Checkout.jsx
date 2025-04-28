import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from './CheckoutContext';
import ShippingAddress from './ShippingAddress';
import PaymentMethod from './PaymentMethod';
import OrderSummary from './OrderSummary';
import './Checkout.css';

const Checkout = () => {
  const [step, setStep] = useState(1);
  useCheckout();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if cart is empty
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [navigate]);

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  return (
    <div className="checkout-container">
      <div className="checkout-progress">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <span>Shipping</span>
        </div>
        <div className={`progress-line ${step >= 2 ? 'active' : ''}`} />
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <span>Payment</span>
        </div>
        <div className={`progress-line ${step >= 3 ? 'active' : ''}`} />
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <span>Review</span>
        </div>
      </div>

      <div className="checkout-content">
        {step === 1 && <ShippingAddress onNext={nextStep} />}
        {step === 2 && <PaymentMethod onNext={nextStep} onBack={prevStep} />}
        {step === 3 && <OrderSummary onBack={prevStep} />}
      </div>
    </div>
  );
};

export default Checkout;