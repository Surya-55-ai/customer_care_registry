import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="app-header">
      <Link to="/" className="brand">
        Care
      </Link>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/complaints">Complaints</Link>
        <Link to="/users">Customers</Link>
        <Link to="/agents">Agents</Link>

        {user && user.type === "user" && (
          <>
            <Link to="/chat">ChatWithAgent</Link>
            <Link to="/my-complaints">MyComplaints</Link>
          </>
        )}

        {user && user.type === "agent" && <Link to="/agent">Dashboard</Link>}

        {user ? (
          <button className="link-button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </>
        )}

        {user && (
          <div className="dropdown">
            <button className="link-button" onClick={() => setShowDropdown((s) => !s)}>
              Dropdown ▾
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/profile" onClick={() => setShowDropdown(false)}>
                  My Profile
                </Link>
                <Link to="/about" onClick={() => setShowDropdown(false)}>
                  About
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;


