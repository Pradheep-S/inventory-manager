import { useEffect, useState } from "react";
import axios from "axios";
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/inventory");
    setProducts(res.data);
  };

  const addProduct = async (e) => {
    e.preventDefault();
    if (editingProduct) {
      await axios.put(
        `http://localhost:5000/api/inventory/update/${editingProduct._id}`,
        newProduct
      );
      setEditingProduct(null);
    } else {
      await axios.post("http://localhost:5000/api/inventory/add", newProduct);
    }
    fetchProducts();
    setNewProduct({ name: "", description: "", quantity: "", price: "", supplier: "" });
    setIsModalOpen(false);
  };

  const editProduct = (product) => {
    setNewProduct(product);
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const deleteProduct = async (id) => {
    await axios.delete(`http://localhost:5000/api/inventory/delete/${id}`);
    fetchProducts();
  };

  return (
    <div className="inventory-body">
      <div className="inventory-container">
        <h2>Inventory Management</h2>
        <button className="open-form-btn" onClick={() => setIsModalOpen(true)}>
          Add Product
        </button>

        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}></div>
        )}

        <div className={`modal ${isModalOpen ? "open" : ""}`}>
          <div className="modal-header">
            <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
              ×
            </button>
          </div>

          <form onSubmit={addProduct} className="inventory-form">
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newProduct.quantity}
              onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Supplier"
              value={newProduct.supplier}
              onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value })}
              required
            />
            <button type="submit">{editingProduct ? "Update Product" : "Add Product"}</button>
          </form>
        </div>

        <div className="product-list">
          <div className="product-list-header">
            <span>Name</span>
            <span>Quantity</span>
            <span>Price</span>
            <span>Supplier</span>
            <span>Actions</span>
          </div>
          {products.map((product) => (
            <div key={product._id} className="product-item">
              <div className="product-details">
                <span>{product.name}</span>
                <span>{product.quantity}</span>
                <span>${product.price}</span>
                <span>{product.supplier}</span>
                <div className="actions">
                  <button onClick={() => editProduct(product)}>Edit</button>
                  <button onClick={() => deleteProduct(product._id)}>Delete</button>
                </div>
              </div>
              <div className="product-description">
                <p>{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inventory;