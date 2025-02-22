import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, X, Edit2, Trash2, Package, ChevronDown, ChevronUp } from "lucide-react";
import Navbara from "./Navbara"; // Import the Navbara component
import "./Inventory.css";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    quantity: "",
    price: "",
    supplier: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (isModalOpen || isDeleteModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, isDeleteModalOpen]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:5000/api/inventory");
      setProducts(res.data);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = (e) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
      setEditingProduct(null);
      setNewProduct({ name: "", description: "", quantity: "", price: "", supplier: "" });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setNewProduct({ name: "", description: "", quantity: "", price: "", supplier: "" });
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      if (editingProduct) {
        await axios.put(
          `http://localhost:5000/api/inventory/update/${editingProduct._id}`,
          newProduct
        );
      } else {
        await axios.post("http://localhost:5000/api/inventory/add", newProduct);
      }
      
      await fetchProducts();
      closeModal();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError(editingProduct ? "Failed to update product" : "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const editProduct = (product) => {
    setNewProduct(product);
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const deleteProduct = async () => {
    if (productToDelete) {
      try {
        setLoading(true);
        setError(null);
        await axios.delete(`http://localhost:5000/api/inventory/delete/${productToDelete._id}`);
        await fetchProducts();
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Failed to delete product");
      } finally {
        setLoading(false);
        closeDeleteModal();
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const toggleDescription = (productId) => {
    setExpandedProductId(expandedProductId === productId ? null : productId);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`inventory-body ${isModalOpen || isDeleteModalOpen ? 'modal-open' : ''}`}>
      <Navbara /> {/* Include the Navbara component */}
      <div className="inventory-container">
        <h2>
          <Package className="inline-icon" size={32} />
          Inventory Management
        </h2>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}><X size={16} /></button>
          </div>
        )}

        <div className="inventory-controls">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <button 
            className="open-form-btn" 
            onClick={() => setIsModalOpen(true)}
            disabled={loading}
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {isModalOpen && (
          <div className="modal-overlay" onClick={handleModalClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>
                <button className="close-btn" onClick={closeModal}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={addProduct} className="inventory-form">
                <div className="form-group">
                  <label htmlFor="name">Product Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter product name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    placeholder="Enter product description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                      id="quantity"
                      type="number"
                      placeholder="Enter quantity"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({ ...newProduct, quantity: Math.max(0, e.target.value) })}
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input
                      id="price"
                      type="number"
                      placeholder="Enter price"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Math.max(0, e.target.value) })}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="supplier">Supplier</label>
                  <input
                    id="supplier"
                    type="text"
                    placeholder="Enter supplier name"
                    value={newProduct.supplier}
                    onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" disabled={loading}>
                  {loading ? (
                    <span className="loading-spinner" />
                  ) : editingProduct ? (
                    "Update Product"
                  ) : (
                    "Add Product"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="modal-overlay" onClick={closeDeleteModal}>
            <div className="modal delete-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Confirm Deletion</h2>
                <button className="close-btn" onClick={closeDeleteModal}>
                  <X size={20} />
                </button>
              </div>

              <div className="delete-modal-content">
                <p>Are you sure you want to delete &quot;{productToDelete?.name}&quot;?</p>
                <div className="delete-modal-actions">
                  <button className="cancel-btn" onClick={closeDeleteModal}>
                    Cancel
                  </button>
                  <button className="delete-btn" onClick={deleteProduct} disabled={loading}>
                    {loading ? <span className="loading-spinner" /> : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="product-list">
          <div className="product-list-header">
            <span>Name</span>
            <span>Quantity</span>
            <span>Price</span>
            <span>Supplier</span>
            <span>Actions</span>
          </div>
          
          {loading && !products.length ? (
            <div className="loading-container">
              <span className="loading-spinner" />
              <p>Loading products...</p>
            </div>
          ) : !products.length ? (
            <div className="empty-state">
              <Package size={48} />
              <p>No products found. Add your first product to get started!</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product._id} className="product-item">
                <div className="product-details" onClick={() => toggleDescription(product._id)}>
                  <span className="product-name">
                    {product.name}
                    {product.description && (
                      <button className="expand-btn">
                        {expandedProductId === product._id ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    )}
                  </span>
                  <span className="product-quantity">{product.quantity}</span>
                  <span className="product-price">{formatPrice(product.price)}</span>
                  <span className="product-supplier">{product.supplier}</span>
                  <div className="actions" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => editProduct(product)}
                      disabled={loading}
                      className="edit-btn"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button 
                      onClick={() => confirmDelete(product)}
                      disabled={loading}
                      className="delete-btn"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
                {expandedProductId === product._id && product.description && (
                  <div className="product-description">
                    <p>{product.description}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;