import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Usage: <ProtectedRoute allowedTypes={["admin"]}><Admin /></ProtectedRoute>
// If allowedTypes is omitted, any logged-in user is allowed through.
const ProtectedRoute = ({ children, allowedTypes }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedTypes && !allowedTypes.includes(user.type)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

