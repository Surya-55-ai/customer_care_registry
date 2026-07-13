import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <h1 style={{ fontSize: "3rem", marginBottom: 8 }}>404</h1>
      <p style={{ color: "#7c8697", marginBottom: 24 }}>
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" style={{ color: "#1e6fd9" }}>
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;

