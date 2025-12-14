import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../api.js";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    waterConditions: "moderate",
    sunlight: "full",
    growingSeason: "",
    stock: "",
    soilType: [],
    climate: []
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/");
      return;
    }
    fetchProducts();
    fetchOrders();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/all");
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      const arr = formData[name];
      if (checked) {
        setFormData({ ...formData, [name]: [...arr, value] });
      } else {
        setFormData({ ...formData, [name]: arr.filter((item) => item !== value) });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "soilType" || key === "climate") {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });

    if (image) {
      data.append("image", image);
    }

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await api.post("/products", data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }
      fetchProducts();
      resetForm();
      alert("Product saved successfully!");
    } catch (error) {
      console.error("Error saving product:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to save product";
      alert(`Error: ${errorMessage}`);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      waterConditions: "moderate",
      sunlight: "full",
      growingSeason: "",
      stock: "",
      soilType: [],
      climate: []
    });
    setImage(null);
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      waterConditions: product.waterConditions,
      sunlight: product.sunlight,
      growingSeason: product.growingSeason,
      stock: product.stock,
      soilType: product.soilType || [],
      climate: product.climate || []
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <div className="page-container admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="admin-tabs">
        <button
          className={activeTab === "products" ? "active" : ""}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
      </div>

      {activeTab === "products" && (
        <div className="admin-products">
          <div className="admin-products-header">
            <h2>Manage Products</h2>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              Add Product
            </button>
          </div>

          {showForm && (
            <form className="admin-product-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <input
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Water conditions</label>
                  <select
                    name="waterConditions"
                    value={formData.waterConditions}
                    onChange={handleChange}
                  >
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Sunlight</label>
                  <select
                    name="sunlight"
                    value={formData.sunlight}
                    onChange={handleChange}
                  >
                    <option value="full">Full</option>
                    <option value="partial">Partial</option>
                    <option value="shade">Shade</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Growing season</label>
                  <input
                    name="growingSeason"
                    value={formData.growingSeason}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Soil type</label>
                <div className="checkbox-group">
                  {["clay", "sandy", "loamy", "silt", "chalky", "peaty"].map(
                    (type) => (
                      <label key={type}>
                        <input
                          type="checkbox"
                          name="soilType"
                          value={type}
                          checked={formData.soilType.includes(type)}
                          onChange={handleChange}
                        />
                        {type}
                      </label>
                    )
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Climate</label>
                <div className="checkbox-group">
                  {["tropical", "temperate", "arid", "continental", "polar"].map(
                    (climate) => (
                      <label key={climate}>
                        <input
                          type="checkbox"
                          name="climate"
                          value={climate}
                          checked={formData.climate.includes(climate)}
                          onChange={handleChange}
                        />
                        {climate}
                      </label>
                    )
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Image</label>
                <input type="file" onChange={handleImageChange} />
              </div>

              <div className="form-actions">
                <button type="submit">
                  {editingProduct ? "Update" : "Create"} product
                </button>
                <button type="button" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="admin-products-list">
            {products.map((product) => (
              <div key={product._id} className="admin-product-card">
                <img src={product.imageUrl} alt={product.name} />
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p>₹{product.price}</p>
                  <p>Stock: {product.stock}</p>
                  <button onClick={() => handleEdit(product)}>Edit</button>
                  <button onClick={() => handleDelete(product._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="admin-orders">
          <h2>All Orders</h2>
          {orders.map((order) => (
            <div key={order._id} className="admin-order-card">
              <h3>Order #{order._id}</h3>
              <p>
                <strong>User:</strong> {order.user?.name} ({order.user?.email})
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Total:</strong> ₹{order.totalAmount}
              </p>

              <h4>Items</h4>
              <ul>
                {order.items.map((item) => (
                  <li key={item._id}>
                    {item.product?.name} x {item.quantity} – ₹{item.price}
                  </li>
                ))}
              </ul>

              <h4>Shipping address</h4>
              <p>{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                {order.shippingAddress.zipCode}
              </p>
              <p>Phone: {order.shippingAddress.phone}</p>

              <div className="order-status-actions">
                <label>Update status:</label>
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateOrderStatus(order._id, e.target.value)
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
