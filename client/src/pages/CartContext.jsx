import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

// eslint-disable-next-line react/prop-types
export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        fetchCartCount(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const fetchCartCount = async (currentUser) => {
    const token = localStorage.getItem("token");
    if (!token || !currentUser || currentUser.role === "admin") {
      setCartCount(0);
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { "x-access-token": token },
      });
      const items = res.data.items || [];
      const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalCount);
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
    }
  };

  const updateCartCount = (newCount) => {
    setCartCount(newCount);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    fetchCartCount(userData);
  };

  return (
    <CartContext.Provider 
      value={{ cartCount, updateCartCount, user, updateUser, fetchCartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);