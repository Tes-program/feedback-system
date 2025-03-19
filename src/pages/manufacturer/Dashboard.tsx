/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/manufacturer/Dashboard.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChatBubbleLeftRightIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationCircleIcon,
  UserCircleIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useFeedback } from '../../hooks/useFeedback';

const ManufacturerDashboard = () => {
  const { currentUser } = useAuth();
  const { feedbackItems, loading: loadingFeedback } = useFeedback();
  const [exportLoading, setExportLoading] = useState(false);

  // Calculate statistics
  const stats = {
    total: feedbackItems.length,
    pending: feedbackItems.filter(item => item.status === 'pending').length,
    acknowledged: feedbackItems.filter(item => item.status === 'acknowledged').length,
    responded: feedbackItems.filter(item => item.status === 'responded').length
  };

  // Calculate feedback trend (mock data for now)
  const feedbackTrend = {
    thisWeek: Math.max(stats.total, 0),
    lastWeek: Math.max(stats.total - Math.floor(Math.random() * 5), 0),
    get percentChange() {
      if (this.lastWeek === 0) return 100;
      return Math.round(((this.thisWeek - this.lastWeek) / this.lastWeek) * 100);
    }
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

  const handleExportFeedback = () => {
    setExportLoading(true);
    
    // Mock export functionality
    setTimeout(() => {
      // Create CSV content
      const csvContent = [
        ['Feedback ID', 'Consumer', 'Date', 'Type', 'Status', 'Product', 'Message'],
        ...feedbackItems.map(item => [
          item.id,
          item.consumerName,
          item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleString() : '',
          item.feedbackType,
          item.status,
          item.product || '',
          item.message
        ])
      ].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
      
      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `feedback_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      
      setExportLoading(false);
    }, 1500);
  };

  if (loadingFeedback) {
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {currentUser?.displayName}!</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Monitor and respond to customer feedback to improve your products and services.
            </p>
            <div className="mt-6 flex space-x-4">
              <button 
                onClick={handleExportFeedback}
                disabled={exportLoading || feedbackItems.length === 0}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black dark:text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed"
              >
                {exportLoading ? (
                  <>
                    <ArrowPathIcon className="animate-spin mr-2 h-4 w-4" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <DocumentTextIcon className="mr-2 h-4 w-4" />
                    Export Feedback
                  </>
                )}
              </button>
              <Link 
                to="/manufacturer/analytics" 
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <ChartBarIcon className="mr-2 h-4 w-4" />
                View Analytics
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      
      {/* Feedback Trend and Pending Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feedback Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden lg:col-span-1">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Feedback Trend</h2>
            <div className="mt-6 flex items-center">
              <div className="flex-1">
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{feedbackTrend.thisWeek}</p>
                  <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">this week</p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">vs {feedbackTrend.lastWeek} last week</p>
              </div>
              <div className={`p-2 rounded-full ${feedbackTrend.percentChange >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                <span className={`text-sm font-medium ${feedbackTrend.percentChange >= 0 ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'}`}>
                  {feedbackTrend.percentChange >= 0 ? '+' : ''}{feedbackTrend.percentChange}%
                </span>
              </div>
            </div>
            
            {/* Simple bar chart visualization */}
            <div className="mt-6 flex items-end space-x-2 h-32">
              <div className="w-1/7 bg-primary-100 dark:bg-primary-900/30 rounded-t relative" style={{ height: '40%' }}>
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-primary-500 dark:bg-primary-600 rounded-t"></div>
              </div>
              <div className="w-1/7 bg-primary-100 dark:bg-primary-900/30 rounded-t relative" style={{ height: '60%' }}>
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-primary-500 dark:bg-primary-600 rounded-t"></div>
              </div>
              <div className="w-1/7 bg-primary-100 dark:bg-primary-900/30 rounded-t relative" style={{ height: '30%' }}>
                <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-primary-500 dark:bg-primary-600 rounded-t"></div>
              </div>
              <div className="w-1/7 bg-primary-100 dark:bg-primary-900/30 rounded-t relative" style={{ height: '80%' }}>
                <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-primary-500 dark:bg-primary-600 rounded-t"></div>
              </div>
              <div className="w-1/7 bg-primary-100 dark:bg-primary-900/30 rounded-t relative" style={{ height: '50%' }}>
                <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-primary-500 dark:bg-primary-600 rounded-t"></div>
              </div>
              <div className="w-1/7 bg-primary-100 dark:bg-primary-900/30 rounded-t relative" style={{ height: '70%' }}>
                <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-primary-500 dark:bg-primary-600 rounded-t"></div>
              </div>
              <div className="w-1/7 bg-primary-100 dark:bg-primary-900/30 rounded-t relative" style={{ height: '100%' }}>
                <div className="absolute bottom-0 left-0 right-0 h-3/5 bg-primary-500 dark:bg-primary-600 rounded-t"></div>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-7 text-xs text-gray-500 dark:text-gray-400">
              <div className="text-center">Mon</div>
              <div className="text-center">Tue</div>
              <div className="text-center">Wed</div>
              <div className="text-center">Thu</div>
              <div className="text-center">Fri</div>
              <div className="text-center">Sat</div>
              <div className="text-center">Sun</div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">Last Week</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">This Week</span>
            </div>
          </div>
        </div>
        
        {/* Pending Feedback */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden lg:col-span-2">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Pending Feedback</h2>
            <Link to="/manufacturer/all-feedback" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
              View all
            </Link>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-80 overflow-y-auto">
            {feedbackItems.filter(item => item.status === 'pending').map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <UserCircleIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{item.consumerName}</h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {item.message}
                      </p>
                      <div className="mt-1 flex items-center text-xs">
                        <span className="text-gray-500 dark:text-gray-400">
                          {getTimeAgo(item.createdAt)}
                        </span>
                        {item.product && (
                          <span className="ml-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                            {item.product}
                          </span>
                        )}
                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs capitalize 
                          ${item.feedbackType === 'suggestion' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300' : 
                            item.feedbackType === 'complaint' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                            'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'}"
                        >
                          {item.feedbackType}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Link 
                      to={`/manufacturer/chat/${item.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-black dark:text-white bg-primary-600 hover:bg-primary-700 shadow-sm"
                    >
                      Respond
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            
            {feedbackItems.filter(item => item.status === 'pending').length === 0 && (
              <div className="text-center py-8">
                <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">All caught up!</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  No pending feedback to respond to.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
        </div>
        
        {feedbackItems.length === 0 ? (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No feedback yet</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              You haven't received any feedback from consumers yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {feedbackItems.slice(0, 5).map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <UserCircleIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{item.consumerName}</h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getTimeAgo(item.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {item.message}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(item.status)}
                        {item.product && (
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-300">
                            {item.product}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-xs capitalize 
                          ${item.feedbackType === 'suggestion' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300' : 
                            item.feedbackType === 'complaint' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                            'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'}"
                        >
                          {item.feedbackType}
                        </span>
                      </div>
                      <Link 
                        to={`/manufacturer/chat/${item.id}`}
                        className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium"
                      >
                        View Chat
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback Type Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Feedback Type Distribution</h2>
        </div>
        
        <div className="p-6">
          {feedbackItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No data available yet.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-primary-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Suggestions</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {feedbackItems.filter(item => item.feedbackType === 'suggestion').length}
                </span>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Complaints</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {feedbackItems.filter(item => item.feedbackType === 'complaint').length}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-amber-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Praise</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {feedbackItems.filter(item => item.feedbackType === 'praise').length}
                </span>
              </div>
              
              <div className="mt-6 h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                {feedbackItems.length > 0 && (
                  <div className="flex h-full">
                    <div 
                      className="bg-primary-500 h-full" 
                      style={{ 
                        width: `${(feedbackItems.filter(item => item.feedbackType === 'suggestion').length / feedbackItems.length) * 100}%` 
                      }}
                    ></div>
                    <div 
                      className="bg-yellow-500 h-full" 
                      style={{ 
                        width: `${(feedbackItems.filter(item => item.feedbackType === 'complaint').length / feedbackItems.length) * 100}%` 
                      }}
                    ></div>
                    <div 
                      className="bg-amber-500 h-full" 
                      style={{ 
                        width: `${(feedbackItems.filter(item => item.feedbackType === 'praise').length / feedbackItems.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManufacturerDashboard;