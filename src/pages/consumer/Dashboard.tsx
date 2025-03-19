/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/consumer/Dashboard.tsx
import { Link } from 'react-router-dom';
import { 
  ChatBubbleLeftRightIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useFeedback } from '../../hooks/useFeedback';
import { useManufacturers } from '../../hooks/useManufacturers';

const ConsumerDashboard = () => {
  const { currentUser } = useAuth();
  const { manufacturers, loading: loadingManufacturers } = useManufacturers();
  const { feedbackItems, loading: loadingFeedback } = useFeedback();

  // Calculate statistics
  const stats = {
    total: feedbackItems.length,
    pending: feedbackItems.filter(item => item.status === 'pending').length,
    acknowledged: feedbackItems.filter(item => item.status === 'acknowledged').length,
    responded: feedbackItems.filter(item => item.status === 'responded').length
  };

  const getStatusBadge = (status: 'pending' | 'acknowledged' | 'responded') => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <ClockIcon className="mr-1 h-3 w-3" />
            Pending
          </span>
        );
      case 'acknowledged':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <ExclamationCircleIcon className="mr-1 h-3 w-3" />
            Acknowledged
          </span>
        );
      case 'responded':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircleIcon className="mr-1 h-3 w-3" />
            Responded
          </span>
        );
    }
  };

  const getTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  };

  if (loadingManufacturers || loadingFeedback) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="md:flex">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {currentUser?.displayName}!</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Connect with manufacturers and share your feedback to help improve the products you love.
            </p>
            <div className="mt-6">
              <Link 
                to="/consumer/feedback" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Submit New Feedback
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="hidden md:block md:flex-shrink-0 bg-gradient-to-br from-primary-500 to-primary-600 p-8">
            <div className="h-full w-32 flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="h-16 w-16 text-white opacity-75" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <ChatBubbleLeftRightIcon className="h-6 w-6" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Feedback</p>
              <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
              <ClockIcon className="h-6 w-6" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
              <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{stats.pending}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <ExclamationCircleIcon className="h-6 w-6" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Acknowledged</p>
              <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{stats.acknowledged}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <CheckCircleIcon className="h-6 w-6" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Responded</p>
              <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{stats.responded}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Feedback */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Feedback</h2>
          {feedbackItems.length > 0 && (
            <Link to="/consumer/feedback-history" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
              View all
            </Link>
          )}
        </div>
        
        {feedbackItems.length === 0 ? (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No feedback yet</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by sending feedback to manufacturers.
            </p>
            <div className="mt-6">
              <Link
                to="/consumer/feedback"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Submit Feedback
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {feedbackItems.slice(0, 3).map((feedback) => (
              <div key={feedback.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium rounded-full">
                        {feedback.manufacturerName.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{feedback.manufacturerName}</h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {feedback.message}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {getTimeAgo(feedback.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge(feedback.status)}
                    <Link 
                      to={`/consumer/chat/${feedback.id}`}
                      className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium"
                    >
                      View Chat
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Manufacturers */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Available Manufacturers</h2>
          <Link to="/consumer/manufacturers" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
            View all
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {manufacturers.slice(0, 4).map((manufacturer) => (
            <div key={manufacturer.uid} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="h-2 bg-gradient-to-r from-primary-500 to-primary-600"></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-xl">
                    {manufacturer.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">{manufacturer.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{manufacturer.industry}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                  {manufacturer.companyName ? `${manufacturer.companyName} - ` : ''}
                  {manufacturer.industry || 'Manufacturer'}
                </p>
                <div className="flex justify-end">
                  <Link 
                    to={`/consumer/feedback?manufacturerId=${manufacturer.uid}`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30"
                  >
                    Send Feedback
                    <ArrowRightIcon className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConsumerDashboard;