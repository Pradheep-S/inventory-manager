/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import "./Products.css";
import Footer from "../components/Footer";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name");
  const [notifications, setNotifications] = useState({});
  const navigate = useNavigate();
  const { updateCartCount } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:5000/api/inventory");
      setProducts(res.data);
    } catch (err) {
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (e) => {
    setSortOption(e.target.value);
  };

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId, quantity: 1 },
        { headers: { "x-access-token": token } }
      );

      // Fetch updated cart count
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { "x-access-token": token },
      });
      const items = res.data.items || [];
      const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
      updateCartCount(totalCount);

      setNotifications((prev) => ({
        ...prev,
        [productId]: "Product added to cart!",
      }));
      setTimeout(() => {
        setNotifications((prev) => ({
          ...prev,
          [productId]: null,
        }));
      }, 3000);
    } catch (err) {
      setError("Failed to add product to cart. Please try again.");
    }
  };

  const handleBuyNow = (productId) => {
    setNotifications((prev) => ({
      ...prev,
      [productId]: `Proceeding to buy product ${productId}`,
    }));
    setTimeout(() => {
      setNotifications((prev) => ({
        ...prev,
        [productId]: null,
      }));
    }, 3000);
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortOption === "price") {
        return a.price - b.price;
      } else if (sortOption === "quantity") {
        return a.quantity - b.quantity;
      }
      return 0;
    });

  return (
    <div className="products-container">
      <h1>Our Products</h1>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div className="products-controls">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <select value={sortOption} onChange={handleSort}>
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="quantity">Sort by Quantity</option>
        </select>
      </div>

      <div className="products-grid">
        {loading && !products.length ? (
          <div className="loading-message">Loading products...</div>
        ) : !products.length ? (
          <div className="no-products-message">
            No products available at the moment.
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <h2>{product.name}</h2>
              <p className="product-price">{formatPrice(product.price)}</p>
              <p className="product-quantity">
                Available: {product.quantity} units
              </p>
              <p className="product-supplier">Supplier: {product.supplier}</p>
              {product.description && (
                <p className="product-description">{product.description}</p>
              )}
              <div className="product-actions">
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product._id)}
                >
                  Add to Cart
                </button>
                <button
                  className="buy-now-btn"
                  onClick={() => handleBuyNow(product._id)}
                >
                  Buy Now
                </button>
              </div>
              {notifications[product._id] && (
                <div className="product-notification">
                  {notifications[product._id]}
                  <button
                    onClick={() =>
                      setNotifications((prev) => ({
                        ...prev,
                        [product._id]: null,
                      }))
                    }
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Products;