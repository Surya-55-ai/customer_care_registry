import React, { useState } from "react";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";

const User = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    userName: user?.userName || "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await api.put(`/users/${user.id}`, formData);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>My Profile</h2>

        {error && <p className="auth-error">{error}</p>}
        {message && <p className="complaint-success">{message}</p>}

        <label>First Name</label>
        <input name="firstName" value={formData.firstName} onChange={handleChange} />

        <label>Last Name</label>
        <input name="lastName" value={formData.lastName} onChange={handleChange} />

        <label>User Name</label>
        <input name="userName" value={formData.userName} onChange={handleChange} />

        <label>Email</label>
        <input value={user?.email || ""} disabled />

        <button type="submit" className="btn-primary full-width">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default User;

