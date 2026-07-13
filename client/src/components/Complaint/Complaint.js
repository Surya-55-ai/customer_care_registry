import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import "./Complaint.css";

const Complaint = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : "",
    phone: "",
    email: user ? user.email : "",
    category: "",
    details: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(data);
      } catch (err) {
        // Categories are optional; fail silently if none exist yet
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { name, phone, email, details } = formData;
    if (!name || !phone || !email || !details) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/complaints", formData);
      setSuccess("Your complaint has been submitted successfully.");
      setTimeout(() => navigate("/my-complaints"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="complaint-page">
      <div className="complaint-image" aria-hidden="true">
        <svg viewBox="0 0 300 220" width="100%" height="auto">
          <rect x="0" y="0" width="300" height="220" rx="14" fill="#eaf2fd" />
          <rect x="60" y="60" width="180" height="120" rx="10" fill="#1e6fd9" />
          <rect x="80" y="90" width="140" height="14" rx="4" fill="#ffffff" />
          <rect x="80" y="116" width="100" height="14" rx="4" fill="#ffffff" />
        </svg>
      </div>

      <form className="complaint-form" onSubmit={handleSubmit}>
        <h2>Write Your Complaint</h2>

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="complaint-success">{success}</p>}

        <label htmlFor="name">Name</label>
        <input id="name" name="name" placeholder="Enter name" value={formData.name} onChange={handleChange} />

        <label htmlFor="phone">Phone</label>
        <input id="phone" name="phone" placeholder="Enter phone" value={formData.phone} onChange={handleChange} />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
        />

        {categories.length > 0 && (
          <>
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={formData.category} onChange={handleChange}>
              <option value="">Select a category (optional)</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </>
        )}

        <label htmlFor="details">Complaint Details</label>
        <textarea
          id="details"
          name="details"
          rows={4}
          placeholder="Describe your complaint here..."
          value={formData.details}
          onChange={handleChange}
        />

        <button type="submit" className="btn-primary submit-btn" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Complaint;

