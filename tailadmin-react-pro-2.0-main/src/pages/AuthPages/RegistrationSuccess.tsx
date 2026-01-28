import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegistrationSuccess() {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect to sign in page after countdown
          navigate('/signin');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [navigate]);

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
          Your account has been created successfully. Thank you for registering!
        </p>
        <div className="mb-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            You will be automatically redirected to the sign-in page in {countdown} seconds.
          </p>
        </div>
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