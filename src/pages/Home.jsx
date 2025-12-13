import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [recommendations, setRecommendations] = useState([]);
  const [preferences, setPreferences] = useState({
    soilType: '',
    climate: '',
    waterConditions: ''
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
      const res = await axios.get('/api/recommendations', { params });
      setRecommendations(res.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
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
          <h1>Welcome to Seed Store</h1>
          <p>Your trusted source for premium plant seeds</p>
          <Link to="/products" className="btn-primary">Shop Now</Link>
        </div>
      </section>

      {showForm && (
        <section className="recommendation-form-section">
          <div className="container">
            <h2>Get Personalized Seed Recommendations</h2>
            <form onSubmit={handleSubmit} className="recommendation-form">
              <div className="form-group">
                <label>Soil Type</label>
                <select
                  value={preferences.soilType}
                  onChange={(e) => setPreferences({...preferences, soilType: e.target.value})}
                  required
                >
                  <option value="">Select Soil Type</option>
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
                  value={preferences.climate}
                  onChange={(e) => setPreferences({...preferences, climate: e.target.value})}
                  required
                >
                  <option value="">Select Climate</option>
                  <option value="tropical">Tropical</option>
                  <option value="temperate">Temperate</option>
                  <option value="arid">Arid</option>
                  <option value="continental">Continental</option>
                  <option value="polar">Polar</option>
                </select>
              </div>
              <div className="form-group">
                <label>Water Conditions</label>
                <select
                  value={preferences.waterConditions}
                  onChange={(e) => setPreferences({...preferences, waterConditions: e.target.value})}
                  required
                >
                  <option value="">Select Water Conditions</option>
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>
              <button type="submit" className="btn-primary">Get Recommendations</button>
            </form>
          </div>
        </section>
      )}

      {recommendations.length > 0 && (
        <section className="recommendations-section">
          <div className="container">
            <h2>Recommended Seeds for You</h2>
            <div className="products-grid">
              {recommendations.map((product) => (
                <div key={product._id} className="product-card">
                  <img src={product.image} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p className="price">₹{product.price}</p>
                  <Link to="/products" className="btn-secondary">View All Products</Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="features-section">
        <div className="container">
          <h2>Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌿</div>
              <h3>Quality Seeds</h3>
              <p>Premium quality seeds with high germination rates</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Quick and secure delivery to your doorstep</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💚</div>
              <h3>Expert Advice</h3>
              <p>Personalized recommendations based on your conditions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Best Prices</h3>
              <p>Competitive prices for all your gardening needs</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

