import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface PublicRouteProps {
  children: React.ReactElement;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Listen for storage events to handle cross-tab authentication changes
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === null || event.key === '__SIGNOUT__' || event.key === '__SIGNIN__') {
        // Trigger a re-render to check auth state again
        setShouldRedirect(true);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (loading || shouldRedirect) {
    // Check authentication state again
    if (currentUser) {
      return <Navigate to="/ecommerce/dashboard" replace />;
    }
    
    // Show loading state while checking authentication
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (currentUser) {
    // Redirect to dashboard if user is already authenticated
    return <Navigate to="/ecommerce/dashboard" replace />;
  }

  return children;
};