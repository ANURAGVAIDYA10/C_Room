import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading, sessionReady } = useAuth();
  
  console.log('ProtectedRoute: currentUser=', currentUser);
  console.log('ProtectedRoute: loading=', loading);
  console.log('ProtectedRoute: sessionReady=', sessionReady);
  console.log('ProtectedRoute: currentUser exists=', !!currentUser);

  // If still loading or session not ready, show loading state
  if (loading || !sessionReady) {
    console.log('ProtectedRoute: Still loading or session not ready, showing loading state');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If user is not authenticated, redirect immediately
  if (!currentUser) {
    console.log('ProtectedRoute: No user, redirecting to signin');
    // Redirect to sign-in page if user is not authenticated
    return <Navigate to="/signin" replace />;
  }
  
  console.log('ProtectedRoute: User authenticated, rendering children');
  return children;
};