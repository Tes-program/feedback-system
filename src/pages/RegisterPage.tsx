/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/RegisterPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'consumer',
    companyName: '',
    industry: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      // Extra data for manufacturer
      const extraData = formData.userType === 'manufacturer' ? {
        companyName: formData.companyName,
        industry: formData.industry
      } : {};
      
      await register(
        formData.email, 
        formData.password, 
        formData.name, 
        formData.userType as 'consumer' | 'manufacturer',
        extraData
      );
      
      // Navigate based on user type
      if (formData.userType === 'consumer') {
        navigate('/consumer/dashboard');
      } else {
        navigate('/manufacturer/dashboard');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register');
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left side - Brand information */}
            <div className="p-12 bg-primary-600 text-white relative hidden lg:block">
              <div className="absolute inset-0 bg-black opacity-10 pattern-dots"></div>
              <div className="relative z-10">
                <Link to="/" className="flex items-center mb-12">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-primary-600 font-bold text-3xl ml-3">C2M</div>
                  <span className="ml-3 text-2xl font-bold text-white"></span>
                </Link>
                
                <h1 className="text-3xl font-bold mb-6">Create your account</h1>
                
                <p className="text-primary-100 mb-8 text-lg">
                  Join our platform to connect with brands directly or receive valuable feedback from your customers.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-6 w-6 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold">Confidential Feedback</h3>
                      <p className="text-primary-200 text-sm">Your conversations remain private between you and the brands.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-6 w-6 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold">Real-time Responses</h3>
                      <p className="text-primary-200 text-sm">Get quick acknowledgment and responses from manufacturers.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-6 w-6 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold">Multi-brand Support</h3>
                      <p className="text-primary-200 text-sm">Connect with multiple brands through a single platform.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12">
                  <p className="text-primary-200">
                    Already have an account?{' '}
                    <Link to="/login" className="text-white font-medium hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right side - Registration form */}
            <div className="p-12">
              <div className="mb-8 lg:hidden">
                <Link to="/" className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">C2M</div>
                  <span className="ml-3 text-2xl font-bold text-gray-800 dark:text-white"></span>
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Join our platform and start sharing valuable feedback.
                </p>
              </div>
              
              {/* Tab selection for user type */}
              <div className="flex mb-8 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, userType: 'consumer' }))}
                  className={`flex-1 py-2 rounded-lg text-center text-sm font-medium transition-colors duration-200 ${
                    formData.userType === 'consumer'
                      ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Consumer
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, userType: 'manufacturer' }))}
                  className={`flex-1 py-2 rounded-lg text-center text-sm font-medium transition-colors duration-200 ${
                    formData.userType === 'manufacturer'
                      ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Manufacturer
                </button>
              </div>
              
              {/* Error message */}
              {error && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4">
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}
              
              {/* Registration form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {formData.userType === 'consumer' ? 'Full Name' : 'Contact Person Name'}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder={formData.userType === 'consumer' ? 'Your full name' : 'Contact person name'}
                  />
                </div>
                
                {formData.userType === 'manufacturer' && (
                  <>
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Company Name
                      </label>
                      <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Your company name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Industry
                      </label>
                      <input
                        id="industry"
                        name="industry"
                        type="text"
                        required
                        value={formData.industry}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., Technology, Retail, Food"
                      />
                    </div>
                  </>
                )}
                
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
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Your email address"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Create a password"
                      minLength={6}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Confirm your password"
                      minLength={6}
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    I agree to the{' '}
                    <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </form>
              
              <div className="mt-8 text-center lg:hidden">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-primary-600 dark:text-primary-400 hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;