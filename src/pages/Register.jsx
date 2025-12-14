import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../api.js";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    soilType: "",
    climate: "",
    waterConditions: ""
  });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext); // use login to save user after register
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/register", formData);
      // backend should return created user + token
      login(data); // store in context/localStorage
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Register</h1>
        {error && <div className="error-message">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
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
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Soil type</label>
            <select
              name="soilType"
              value={formData.soilType}
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
              value={formData.climate}
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
              value={formData.waterConditions}
              onChange={handleChange}
            >
              <option value="">Select water availability</option>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </div>

          <button type="submit" className="btn-primary">
            Register
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
