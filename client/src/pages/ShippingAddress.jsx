import { useState, useEffect } from 'react';
import { useCheckout } from './CheckoutContext';

// eslint-disable-next-line react/prop-types
const ShippingAddress = ({ onNext }) => {
  const { checkoutData, updateCheckoutData } = useCheckout();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    addressType: 'home',
  });

  useEffect(() => {
    if (checkoutData.shippingAddress) {
      setFormData(checkoutData.shippingAddress);
    }
  }, [checkoutData.shippingAddress]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCheckoutData({ shippingAddress: formData });
    onNext();
  };

  return (
    <div className="shipping-address">
      <h2>Shipping Address</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            pattern="[0-9]{10}"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="pincode">Pincode</label>
          <input
            type="text"
            id="pincode"
            value={formData.pincode}
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            pattern="[0-9]{6}"
            required
          />
        </div>

        <div className="form-group">
          <label>Address Type</label>
          <div className="address-type">
            <label>
              <input
                type="radio"
                value="home"
                checked={formData.addressType === 'home'}
                onChange={(e) => setFormData({ ...formData, addressType: e.target.value })}
              />
              Home
            </label>
            <label>
              <input
                type="radio"
                value="work"
                checked={formData.addressType === 'work'}
                onChange={(e) => setFormData({ ...formData, addressType: e.target.value })}
              />
              Work
            </label>
          </div>
        </div>

        <button type="submit" className="btn-next">Continue to Payment</button>
      </form>
    </div>
  );
};

export default ShippingAddress;