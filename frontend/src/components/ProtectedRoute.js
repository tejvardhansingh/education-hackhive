// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // check if token exists
  if (!token) {
    return <Navigate to="/login" />; // redirect to login if no token
  }
  return children;
};

export default ProtectedRoute;
