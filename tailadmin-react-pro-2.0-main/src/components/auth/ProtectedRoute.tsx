import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  console.log('ProtectedRoute: currentUser=', currentUser);
  console.log('ProtectedRoute: loading=', loading);
  console.log('ProtectedRoute: currentUser exists=', !!currentUser);

  if (loading) {
    // You can return a loading spinner here if desired
    console.log('ProtectedRoute: Still loading, showing loading state');
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    console.log('ProtectedRoute: No user, redirecting to signin');
    // Redirect to sign-in page if user is not authenticated
    return <Navigate to="/signin" replace />;
  }
  
  console.log('ProtectedRoute: User authenticated, rendering children');
  return children;
};