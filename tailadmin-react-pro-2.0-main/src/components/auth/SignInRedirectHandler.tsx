import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { onSyncMessage, SyncMessageType } from '../../utils/crossTabSync';

/**
 * Component that handles redirecting users away from the sign-in page
 * if they are already authenticated, with cross-tab synchronization support.
 */
export const SignInRedirectHandler = () => {
  const { currentUser, loading, sessionReady } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for login events from other tabs
    const cleanup = onSyncMessage((message) => {
      if (message.type === SyncMessageType.LOGIN) {
        console.log('SignInRedirectHandler: Login detected from another tab, checking auth state...');
        // Give a small delay to allow auth state to update
        setTimeout(() => {
          // Re-check auth state after receiving login message
          if (currentUser) {
            console.log('SignInRedirectHandler: User is authenticated after cross-tab login, redirecting to dashboard');
            navigate('/ecommerce/dashboard', { replace: true });
          }
        }, 100);
      }
    });

    return cleanup;
  }, [currentUser, navigate]);

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (!loading && sessionReady && currentUser) {
      console.log('SignInRedirectHandler: User is already authenticated, redirecting to dashboard');
      navigate('/ecommerce/dashboard', { replace: true });
    }
  }, [loading, sessionReady, currentUser, navigate]);

  return null; // This component doesn't render anything
};