import React from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) return null;

  // If already logged in → go to dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
};

export default PublicRoute;

