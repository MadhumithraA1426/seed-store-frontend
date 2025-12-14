import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../api.js";

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/my-orders");
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="page-container">
        <h1>My Orders</h1>
        <p>You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>My Orders</h1>
      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <h2>Order #{order._id}</h2>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Expected Delivery:</strong>{" "}
            {new Date(order.deliveryDate).toLocaleDateString()}
          </p>

          <h3>Items</h3>
          <ul>
            {order.items.map((item) => (
              <li key={item._id}>
                {item.product?.name || "Seed"} – Quantity: {item.quantity} – Price:
                ₹{item.price}
              </li>
            ))}
          </ul>

          <h3>Shipping Address</h3>
          <p>{order.shippingAddress.name}</p>
          <p>{order.shippingAddress.address}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state} –{" "}
            {order.shippingAddress.zipCode}
          </p>
          <p>Phone: {order.shippingAddress.phone}</p>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
