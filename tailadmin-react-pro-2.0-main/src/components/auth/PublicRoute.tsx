import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface PublicRouteProps {
  children: React.ReactElement;
}

/**
 * PublicRoute component that allows access to public pages
 * but redirects authenticated users away from login pages
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { currentUser, loading, sessionReady } = useAuth();
  
  console.log('PublicRoute: currentUser=', currentUser);
  console.log('PublicRoute: loading=', loading);
  console.log('PublicRoute: sessionReady=', sessionReady);
  console.log('PublicRoute: currentUser exists=', !!currentUser);

  if (loading || !sessionReady) {
    // Show loading state while checking authentication
    console.log('PublicRoute: Still loading or session not ready, showing loading state');
    return <div>Loading...</div>;
  }

  // If user is authenticated and trying to access a page that should redirect them away when logged in
  if (currentUser && (window.location.pathname === '/signin' || window.location.pathname === '/')) {
    console.log('PublicRoute: User is authenticated, redirecting from public route to dashboard');
    return <Navigate to="/ecommerce/dashboard" replace />;
  }

  console.log('PublicRoute: Rendering children');
  return children;
};