import React, { useState } from "react";
import api from "../api.js";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/contact", formData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", subject: "", message: "" });
      }, 3000);
    } catch (err) {
      console.error("Contact error:", err);
      alert("Failed to send message");
    }
  };

  return (
    <div className="page-container contact-page">
      <h1>Contact us</h1>
      <p>Have questions about our seeds or need gardening advice? We're here to help!</p>

      {submitted && <div className="success-message">Message sent successfully!</div>}

      <form onSubmit={handleSubmit} className="contact-form">
        <input
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
        />
        <textarea
          name="message"
          rows="4"
          placeholder="Your message"
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button type="submit">Send</button>
      </form>

      <div className="contact-info">
        <p>support@seedstore.com</p>
        <p>+1 (555) 123‑4567</p>
        <p>123 Garden Street, Green City, GC 12345</p>
      </div>
    </div>
  );
};

export default Contact;
