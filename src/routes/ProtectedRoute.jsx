import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
export default function ProtectedRoute({ children }) {
  const user = useSelector(state => state.user.data);
  if (!user) return <Navigate to="/signin" />;
  return children;
} 