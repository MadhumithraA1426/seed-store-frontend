import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders/my-orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="my-orders-page">
      <div className="container">
        <h1>My Orders</h1>
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <strong>Order ID:</strong> {order._id}
                  </div>
                  <div>
                    <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Status:</strong> 
                    <span className={`status-badge status-${order.status}`}>
                      {order.status}
                    </span>
                  </div>
                  <div>
                    <strong>Total:</strong> ₹{order.totalAmount}
                  </div>
                </div>
                <div className="order-items">
                  <h3>Items:</h3>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <img src={item.product.image} alt={item.product.name} />
                      <div className="item-details">
                        <h4>{item.product.name}</h4>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ₹{item.price}</p>
                      </div>
                      <div className="item-total">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="order-address">
                  <h3>Shipping Address:</h3>
                  <p>
                    {order.shippingAddress.name}<br />
                    {order.shippingAddress.address}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}<br />
                    Phone: {order.shippingAddress.phone}
                  </p>
                  {order.deliveryDate && (
                    <p className="delivery-date">
                      <strong>Expected Delivery:</strong> {new Date(order.deliveryDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;

