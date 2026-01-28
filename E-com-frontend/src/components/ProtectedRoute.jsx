import React from "react";
import { Navigate } from "react-router-dom";

/*
  Usage:
  <ProtectedRoute>                → user + admin
  <ProtectedRoute adminOnly />    → admin only
  <ProtectedRoute userOnly />     → user only
*/

export default function ProtectedRoute({ children, adminOnly = false, userOnly = false }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // 'admin' | 'user'

  // 🔒 Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 Admin-only page
  if (adminOnly && role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // 👤 User-only page
  if (userOnly && role !== "user") {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Authorized
  return children;
}
