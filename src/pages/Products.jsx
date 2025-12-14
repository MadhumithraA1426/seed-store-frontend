import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../api.js";

const Products = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    setAddingToCart((prev) => ({ ...prev, [productId]: true }));
    try {
      await api.post("/cart/add", { productId, quantity: 1 });
      alert("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart");
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <h1>Our Seeds</h1>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img src={product.imageUrl} alt={product.name} />
            <h2>{product.name}</h2>
            <p className="product-description">{product.description}</p>
            <p className="product-price">₹{product.price}</p>
            <button
              onClick={() => addToCart(product._id)}
              disabled={addingToCart[product._id]}
            >
              {addingToCart[product._id] ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
