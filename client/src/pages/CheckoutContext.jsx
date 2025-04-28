import { createContext, useContext, useState } from 'react';

const CheckoutContext = createContext();

// eslint-disable-next-line react/prop-types
export const CheckoutProvider = ({ children }) => {
  const [checkoutData, setCheckoutData] = useState({
    shippingAddress: null,
    paymentMethod: null,
    orderSummary: null,
  });

  const updateCheckoutData = (data) => {
    setCheckoutData(prev => ({ ...prev, ...data }));
  };

  return (
    <CheckoutContext.Provider value={{ checkoutData, updateCheckoutData }}>
      {children}
    </CheckoutContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCheckout = () => useContext(CheckoutContext);