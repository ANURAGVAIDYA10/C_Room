// src/components/auth/ProtectedRoleRoute.tsx
import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";

interface ProtectedRoleRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Array of roles that are allowed to access this route
  redirectTo?: string; // Where to redirect if user doesn't have required role
}

export default function ProtectedRoleRoute({ 
  children, 
  allowedRoles = ['ADMIN', 'SUPER_ADMIN'], // Default to admin and super admin only
  redirectTo = "/signin" 
}: ProtectedRoleRouteProps) {
  console.log('ProtectedRoleRoute: Component mounted');
  const { currentUser, loading, sessionReady, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('ProtectedRoleRoute: useEffect called - loading=', loading, 'currentUser=', currentUser, 'userRole=', userRole, 'sessionReady=', sessionReady);
    
    // Check if user is not authenticated - redirect immediately regardless of session state
    if (currentUser === null && !loading) {
      console.log('ProtectedRoleRoute: No user, redirecting to signin immediately');
      navigate("/signin");
      return;
    }
    
    // Only check role permissions after session is ready and user role is loaded
    if (!loading && sessionReady && userRole !== null && currentUser) {
      console.log('ProtectedRoleRoute: Finished loading, session ready and user role available, checking role permissions');
      
      // Check if user has required role
      const hasRequiredRole = allowedRoles.includes(userRole);
      
      console.log('ProtectedRoleRoute: Required roles=', allowedRoles, 'User role=', userRole, 'User has required role=', hasRequiredRole);

      // If user doesn't have required role, redirect
      if (!hasRequiredRole) {
        console.log('ProtectedRoleRoute: User lacks required role, redirecting to', redirectTo);
        navigate(redirectTo);
      }
    }
  }, [currentUser, loading, sessionReady, userRole, allowedRoles, redirectTo, navigate]);

  // Show loading state while checking auth status
  if (loading || !sessionReady) {
    // Don't show the layout while loading auth state
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If user is not authenticated, don't render anything (should be redirected by useEffect)
  if (!currentUser) {
    return null;
  }

  // Check role again before rendering
  if (userRole && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate page if user doesn't have required role
    setTimeout(() => navigate(redirectTo), 0);
    return null;
  }

  // If user is authenticated and has required role, render children
  return <>{children}</>;
}