import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../api.js";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAdminLogin = () => {
    setFormData({
      email: "admin@example.com",
      password: ""
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // backend should return { user, token }
      const { data } = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password
      });

      // save both user and token via AuthContext login
      // login expects the full data object: { user, token }
      login(data);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Login</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>
        <p className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
        <p className="auth-link">
          Admin?{" "}
          <button
            type="button"
            onClick={handleAdminLogin}
            className="admin-link-btn"
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              textDecoration: "underline",
              cursor: "pointer",
              padding: 0,
              font: "inherit"
            }}
          >
            Click here to auto-fill admin email
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
