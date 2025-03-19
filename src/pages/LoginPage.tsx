/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/LoginPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'consumer' | 'manufacturer'>('consumer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      
      // The user role is now handled by the AuthContext
      // Navigation will be handled automatically by ProtectedRoute
      if (userType === 'consumer') {
        navigate('/consumer/dashboard');
      } else {
        navigate('/manufacturer/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to log in');
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center px-6">
        {/* Left side - Brand information */}
        <div className="w-full lg:w-1/2 lg:pr-16 mb-10 lg:mb-0">
          <Link to="/" className="flex items-center mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-black dark:text-white font-bold text-3xl ml-3">C2M</div>
            {/* <span className="ml-3 text-2xl font-bold text-gray-800 dark:text-white"></span> */}
          </Link>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome Back!
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
            Log in to continue your journey of meaningful conversations between consumers and manufacturers.
          </p>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Secure & Private Communication</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your feedback and conversations are encrypted and kept private between you and the manufacturers.
            </p>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
        
        {/* Right side - Login form */}
        <div className="w-full lg:w-1/2 lg:pl-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md mx-auto border border-gray-200 dark:border-gray-700">
            {/* Tab selection for user type */}
            <div className="flex mb-8 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setUserType('consumer')}
                className={`flex-1 py-2 rounded-lg text-center text-sm font-medium transition-colors duration-200 ${
                  userType === 'consumer'
                    ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Consumer
              </button>
              <button
                onClick={() => setUserType('manufacturer')}
                className={`flex-1 py-2 rounded-lg text-center text-sm font-medium transition-colors duration-200 ${
                  userType === 'manufacturer'
                    ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Manufacturer
              </button>
            </div>
            
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
              {userType === 'consumer' ? 'Consumer Login' : 'Manufacturer Login'}
            </h2>
            
            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Your email"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <a href="#" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Your password"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>
              
              <div className='text-black dark:text-white'>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center px-4 py-3 bg-primary-600 hover:bg-primary-700 text-black dark:text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-primary-600 dark:text-primary-400 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;