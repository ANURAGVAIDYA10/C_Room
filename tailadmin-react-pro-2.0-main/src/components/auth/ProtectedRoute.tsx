import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // You can return a loading spinner here if desired
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    // Redirect to sign-in page if user is not authenticated
    return <Navigate to="/signin" replace />;
  }

  return children;
};