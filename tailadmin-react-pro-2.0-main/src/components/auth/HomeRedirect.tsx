import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Component that handles redirecting users from the home page
 * to either dashboard (if authenticated) or sign-in (if not authenticated)
 */
export const HomeRedirect = () => {
  const { currentUser, loading, sessionReady } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && sessionReady) {
      if (currentUser) {
        console.log('HomeRedirect: User is authenticated, redirecting to dashboard');
        navigate('/ecommerce/dashboard', { replace: true });
      } else {
        console.log('HomeRedirect: User is not authenticated, redirecting to sign in');
        navigate('/signin', { replace: true });
      }
    }
  }, [loading, sessionReady, currentUser, navigate]);

  return <div>Loading...</div>; // Show loading while determining redirect
};