import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, OAuthProvider, auth, createUserWithEmailAndPassword } from '../../firebase';
import { invitationApi, authApi } from '../../services/api';

export default function CompleteInvitation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'verify' | 'details' | 'complete'>('verify');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [invitationData, setInvitationData] = useState<{role: string, departmentId: number | null, organizationId: number | null, status?: string} | null>(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    verifyInvitationLink();
  }, []);

  const verifyInvitationLink = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get parameters from URL
      const token = searchParams.get('token');
      const emailParam = searchParams.get('email');
      // Note: We're NOT automatically processing oobCode here
      // That should happen only when user explicitly chooses signup method

      if (!token || !emailParam) {
        setError('Invalid invitation link. Missing required parameters.');
        return;
      }

      setEmail(emailParam);

      // Verify the invitation with the backend
      const response = await invitationApi.verifyInvitation(token, emailParam);
      
      if (response.valid) {
        setInvitationData(response);
        // Check if invitation is already accepted
        if (response.status === 'ACCEPTED') {
          setStep('complete'); // Show completion message
        } else {
          setStep('details'); // Show signup form
        }
      } else {
        setError(response.error || 'Invalid or expired invitation link.');
      }
    } catch (err: any) {
      console.error('Error verifying invitation:', err);
      setError(err.message || 'Failed to verify invitation link.');
    } finally {
      setLoading(false);
    };
  };

  const handleOAuthSignUp = async (provider: 'google' | 'microsoft') => {
    try {
      setLoading(true);
      setError(null);

      const token = searchParams.get('token');
      
      // Sign in with OAuth provider FIRST
      let authProvider;
      if (provider === 'google') {
        authProvider = new GoogleAuthProvider();
      } else {
        authProvider = new OAuthProvider('microsoft.com');
      }

      const result = await signInWithPopup(auth, authProvider);
      const user = result.user;
      
      console.log('Firebase authentication successful:', user.uid);

      // NOW complete the invitation with Firebase UID
      await invitationApi.completeInvitation({
        token: token || '',
        email: user.email || email,
        fullName: user.displayName || '',
        password: 'oauth-user-no-password', // Placeholder for OAuth users
        firebaseUid: user.uid // Send Firebase UID to backend
      });

      setStep('complete');
      
      // Manually authenticate the user after invitation completion
      try {
        console.log('Manually authenticating user after invitation completion...');
        const firebaseToken = await user.getIdToken();
        const authResponse = await authApi.exchangeFirebaseToken(firebaseToken);
        
        if (authResponse && authResponse.user) {
          console.log('Manual authentication successful, redirecting to dashboard');
          // Small delay to ensure state is updated
          setTimeout(() => {
            navigate('/ecommerce/dashboard');
          }, 1000);
        } else {
          console.log('Manual authentication failed, redirecting to sign-in');
          setTimeout(() => {
            navigate('/signin');
          }, 3000);
        }
      } catch (authError) {
        console.error('Manual authentication error:', authError);
        // Redirect to sign-in on auth failure
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
      }
    } catch (err: any) {
      console.error(`Error with ${provider} sign-up:`, err);
      setError(err.message || `Failed to sign up with ${provider}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomEmailSignUp = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = searchParams.get('token');
      
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }

      if (!password || password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      // First, create Firebase user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      console.log('Firebase user created:', firebaseUser.uid);
      
      // NOW complete the invitation with Firebase UID
      await invitationApi.completeInvitation({
        token: token || '',
        email,
        fullName,
        password,
        firebaseUid: firebaseUser.uid // Send Firebase UID to backend
      });

      setStep('complete');
      
      // Manually authenticate the user after invitation completion
      try {
        console.log('Manually authenticating user after invitation completion...');
        const firebaseToken = await firebaseUser.getIdToken();
        const authResponse = await authApi.exchangeFirebaseToken(firebaseToken);
        
        if (authResponse && authResponse.user) {
          console.log('Manual authentication successful, redirecting to dashboard');
          // Small delay to ensure state is updated
          setTimeout(() => {
            navigate('/ecommerce/dashboard');
          }, 1000);
        } else {
          console.log('Manual authentication failed, redirecting to sign-in');
          setTimeout(() => {
            navigate('/signin');
          }, 3000);
        }
      } catch (authError) {
        console.error('Manual authentication error:', authError);
        // Redirect to sign-in on auth failure
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
      }
    } catch (err: any) {
      console.error('Error completing invitation:', err);
      setError(err.message || 'Failed to complete registration.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && step === 'verify') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-700 dark:text-gray-300">Verifying invitation link...</p>
        </div>
      </div>
    );
  }

  if (error && step === 'verify') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <div className="mb-4 text-center">
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 dark:text-white">Invalid Invitation</h2>
          <p className="mb-6 text-center text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={() => navigate('/signin')}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <div className="mb-4 text-center">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 dark:text-white">Registration Successful!</h2>
          <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
            {invitationData?.status === 'ACCEPTED' 
              ? 'This invitation has already been used. Your account is ready to use.'
              : 'Your account has been created successfully. Thank you for registering!'
            }
          </p>
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/signin')}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Continue to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Complete Your Registration
        </h2>

        <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Email:</strong> {email}
          </p>
          <p className="mt-2 text-sm text-blue-800 dark:text-blue-200">
            <strong>Role:</strong> {invitationData?.role}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* OAuth Sign-up Buttons */}
        <div className="mb-6 space-y-3">
          <button
            type="button"
            onClick={() => handleOAuthSignUp('google')}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Signing up...' : 'Sign up with Google'}
          </button>

          <button
            type="button"
            onClick={() => handleOAuthSignUp('microsoft')}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <svg className="h-5 w-5" viewBox="0 0 23 23">
              <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
              <path fill="#f35325" d="M1 1h10v10H1z"/>
              <path fill="#81bc06" d="M12 1h10v10H12z"/>
              <path fill="#05a6f0" d="M1 12h10v10H1z"/>
              <path fill="#ffba08" d="M12 12h10v10H12z"/>
            </svg>
            {loading ? 'Signing up...' : 'Sign up with Microsoft'}
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500 dark:bg-gray-800 dark:text-gray-400">Or sign up with email</span>
          </div>
        </div>

        {/* Custom Sign-up Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleCustomEmailSignUp(); }} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password <span className="text-red-600">*</span>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Enter password (min 6 characters)"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password <span className="text-red-600">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <a href="/signin" className="text-blue-600 hover:underline dark:text-blue-400">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
