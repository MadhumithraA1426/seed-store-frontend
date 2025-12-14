import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../api.js";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [recommendations, setRecommendations] = useState([]);
  const [preferences, setPreferences] = useState({
    soilType: "",
    climate: "",
    waterConditions: ""
  });
  const [showForm, setShowForm] = useState(!user);

  useEffect(() => {
    if (user && (user.soilType || user.climate || user.waterConditions)) {
      fetchRecommendations();
    }
  }, [user]);

  const fetchRecommendations = async () => {
    try {
      const params = {
        soilType: preferences.soilType || user?.soilType,
        climate: preferences.climate || user?.climate,
        waterConditions: preferences.waterConditions || user?.waterConditions
      };
      const res = await api.get("/recommendations", { params });
      setRecommendations(res.data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const handleChange = (e) => {
    setPreferences((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRecommendations();
    setShowForm(false);
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Your trusted source for premium plant seeds</h1>
          <p>
            Find the perfect seeds for your garden based on your soil, climate,
            and water conditions.
          </p>
          <Link to="/products" className="btn-primary">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Seed Store?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Premium quality</h3>
            <p>Premium quality seeds with high germination rates.</p>
          </div>
          <div className="feature-card">
            <h3>Fast delivery</h3>
            <p>Quick and secure delivery to your doorstep.</p>
          </div>
          <div className="feature-card">
            <h3>Smart recommendations</h3>
            <p>Personalized recommendations based on your conditions.</p>
          </div>
          <div className="feature-card">
            <h3>Best prices</h3>
            <p>Competitive prices for all your gardening needs.</p>
          </div>
        </div>
      </section>

      <section className="recommendations-section">
        <h2>Get personalized seed recommendations</h2>
        {showForm && (
          <form className="recommendation-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Soil type</label>
              <select
                name="soilType"
                value={preferences.soilType}
                onChange={handleChange}
              >
                <option value="">Select soil type</option>
                <option value="clay">Clay</option>
                <option value="sandy">Sandy</option>
                <option value="loamy">Loamy</option>
                <option value="silt">Silt</option>
                <option value="chalky">Chalky</option>
                <option value="peaty">Peaty</option>
              </select>
            </div>

            <div className="form-group">
              <label>Climate</label>
              <select
                name="climate"
                value={preferences.climate}
                onChange={handleChange}
              >
                <option value="">Select climate</option>
                <option value="tropical">Tropical</option>
                <option value="temperate">Temperate</option>
                <option value="arid">Arid</option>
                <option value="continental">Continental</option>
                <option value="polar">Polar</option>
              </select>
            </div>

            <div className="form-group">
              <label>Water availability</label>
              <select
                name="waterConditions"
                value={preferences.waterConditions}
                onChange={handleChange}
              >
                <option value="">Select water availability</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </div>

            <button type="submit" className="btn-primary">
              Get recommendations
            </button>
          </form>
        )}

        {!showForm && !recommendations.length && (
          <p>
            Fill in your preferences to get personalized seed recommendations.
          </p>
        )}

        {recommendations.length > 0 && (
          <div className="recommendations-grid">
            {recommendations.map((product) => (
              <div key={product._id} className="product-card">
                <img src={product.imageUrl} alt={product.name} />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className="product-price">₹{product.price}</p>
                <Link to="/products" className="btn-secondary">
                  View All Products
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
