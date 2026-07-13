import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Registration.css";

const Registration = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    type: "user",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { firstName, lastName, userName, email, password } = formData;
    if (!firstName || !lastName || !userName || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const result = await register(formData);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

        {error && <p className="auth-error">{error}</p>}

        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          name="firstName"
          placeholder="Enter first name"
          value={formData.firstName}
          onChange={handleChange}
        />

        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          name="lastName"
          placeholder="Enter last name"
          value={formData.lastName}
          onChange={handleChange}
        />

        <label htmlFor="userName">User Name</label>
        <input
          id="userName"
          name="userName"
          placeholder="Enter user name"
          value={formData.userName}
          onChange={handleChange}
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
        />

        <label htmlFor="type">Type (admin, user, agent)</label>
        <select id="type" name="type" value={formData.type} onChange={handleChange}>
          <option value="user">user</option>
          <option value="agent">agent</option>
          <option value="admin">admin</option>
        </select>

        <button type="submit" className="btn-primary full-width" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </form>
    </div>
  );
};

export default Registration;
