import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    waterConditions: 'moderate',
    sunlight: 'full',
    growingSeason: '',
    stock: '',
    soilType: [],
    climate: []
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
      return;
    }
    fetchProducts();
    fetchOrders();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders/all');
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const arr = formData[name];
      if (e.target.checked) {
        setFormData({ ...formData, [name]: [...arr, value] });
      } else {
        setFormData({ ...formData, [name]: arr.filter(item => item !== value) });
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
    Object.keys(formData).forEach(key => {
      if (key === 'soilType' || key === 'climate') {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });
    if (image) {
      data.append('image', image);
    }

    try {
      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post('/api/products', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      fetchProducts();
      resetForm();
      alert('Product saved successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save product';
      alert(`Error: ${errorMessage}`);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      waterConditions: 'moderate',
      sunlight: 'full',
      growingSeason: '',
      stock: '',
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
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>
        <div className="admin-tabs">
          <button
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Manage Products</h2>
              <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                {showForm ? 'Cancel' : 'Add Product'}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="admin-form" encType="multipart/form-data">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
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
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Price</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
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
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Water Conditions</label>
                    <select
                      name="waterConditions"
                      value={formData.waterConditions}
                      onChange={handleChange}
                      required
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
                      required
                    >
                      <option value="full">Full</option>
                      <option value="partial">Partial</option>
                      <option value="shade">Shade</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Growing Season</label>
                    <input
                      type="text"
                      name="growingSeason"
                      value={formData.growingSeason}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Soil Type (Select multiple)</label>
                  <div className="checkbox-group">
                    {['clay', 'sandy', 'loamy', 'silt', 'chalky', 'peaty'].map(type => (
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
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Climate (Select multiple)</label>
                  <div className="checkbox-group">
                    {['tropical', 'temperate', 'arid', 'continental', 'polar'].map(climate => (
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
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!editingProduct}
                  />
                </div>
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </form>
            )}

            <div className="products-list">
              {products.map((product) => (
                <div key={product._id} className="admin-product-card">
                  <img src={product.image} alt={product.name} />
                  <div className="product-details">
                    <h3>{product.name}</h3>
                    <p>₹{product.price}</p>
                    <p>Stock: {product.stock}</p>
                  </div>
                  <div className="product-actions">
                    <button onClick={() => handleEdit(product)} className="btn-secondary">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="btn-danger">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="admin-section">
            <h2>All Orders</h2>
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div>
                      <strong>Order ID:</strong> {order._id}
                    </div>
                    <div>
                      <strong>Customer:</strong> {order.user?.name} ({order.user?.email})
                    </div>
                    <div>
                      <strong>Total:</strong> ₹{order.totalAmount}
                    </div>
                    <div>
                      <strong>Status:</strong>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                  <div className="order-items">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <span>{item.product.name}</span>
                        <span>Qty: {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-address">
                    <strong>Shipping Address:</strong>
                    <p>
                      {order.shippingAddress.name}<br />
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}<br />
                      Phone: {order.shippingAddress.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

