import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../api.js";

const Cart = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      await api.put(`/cart/update/${itemId}`, { quantity });
      fetchCart();
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/remove/${itemId}`);
      fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading cart...</p>
      </div>
    );
  }

  if (!cart || !cart.items.length) {
    return (
      <div className="page-container">
        <h1>Your cart is empty</h1>
        <Link to="/products" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container cart-page">
      <h1>Your Cart</h1>
      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item._id} className="cart-item">
            <div className="cart-item-info">
              <img src={item.product.imageUrl} alt={item.product.name} />
              <div>
                <h2>{item.product.name}</h2>
                <p>₹{item.product.price}</p>
              </div>
            </div>
            <div className="cart-item-actions">
              <button
                onClick={() =>
                  updateQuantity(item._id, Math.max(1, item.quantity - 1))
                }
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
              >
                +
              </button>
              <button onClick={() => removeItem(item._id)}>Remove</button>
              <p>₹{item.product.price * item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h2>Total: ₹{cart.total}</h2>
        <Link to="/payment" className="btn-primary">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default Cart;
