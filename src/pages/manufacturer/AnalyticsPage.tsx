// src/pages/manufacturer/AnalyticsPage.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  ChartBarIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationCircleIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

const AnalyticsPage = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState({
    totalFeedback: 0,
    pendingFeedback: 0,
    acknowledgedFeedback: 0,
    respondedFeedback: 0,
    feedbackByType: {
      suggestion: 0,
      complaint: 0,
      praise: 0
    },
    feedbackByMonth: [] as {month: string, count: number}[],
    responseTimeAvg: 0,
    productFeedback: [] as {name: string, count: number}[]
  });
  const [exportingData, setExportingData] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        
        // Query all feedback for this manufacturer
        const feedbackQuery = query(
          collection(db, 'feedback'),
          where('manufacturerId', '==', currentUser.uid)
        );
        
        const feedbackSnapshot = await getDocs(feedbackQuery);
        interface FeedbackData {
          id: string;
          status: string;
          feedbackType: string;
          createdAt: Timestamp;
          product?: string;
        }
        
        const feedbackData = feedbackSnapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data()
                })) as FeedbackData[];
        
        // Calculate basic stats
        const total = feedbackData.length;
        const pending = feedbackData.filter(f => f.status === 'pending').length;
        const acknowledged = feedbackData.filter(f => f.status === 'acknowledged').length;
        const responded = feedbackData.filter(f => f.status === 'responded').length;
        
        // Calculate feedback by type
        const suggestion = feedbackData.filter(f => f.feedbackType === 'suggestion').length;
        const complaint = feedbackData.filter(f => f.feedbackType === 'complaint').length;
        const praise = feedbackData.filter(f => f.feedbackType === 'praise').length;
        
        // Process feedback by month
        const monthData: Record<string, number> = {};
        const now = new Date();
        for (let i = 0; i < 6; i++) {
          const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthKey = month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          monthData[monthKey] = 0;
        }
        
        feedbackData.forEach(feedback => {
          if (feedback.createdAt) {
            const date = feedback.createdAt instanceof Timestamp ? feedback.createdAt.toDate() : new Date();
            const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            if (monthData[monthKey] !== undefined) {
              monthData[monthKey]++;
            }
          }
        });
        
        const feedbackByMonth = Object.entries(monthData)
          .map(([month, count]) => ({ month, count }))
          .reverse();
        
        // Calculate product feedback
        const productCounts: Record<string, number> = {};
        feedbackData.forEach(feedback => {
          if (feedback.product) {
            productCounts[feedback.product] = (productCounts[feedback.product] || 0) + 1;
          }
        });
        
        const productFeedback = Object.entries(productCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        
        // Calculate average response time (if we had messages data)
        // This would require querying messages collection for first response times
        // For now we'll use a placeholder
        const responseTimeAvg = 4.2; // hours
        
        setAnalytics({
          totalFeedback: total,
          pendingFeedback: pending,
          acknowledgedFeedback: acknowledged,
          respondedFeedback: responded,
          feedbackByType: {
            suggestion,
            complaint,
            praise
          },
          feedbackByMonth,
          responseTimeAvg,
          productFeedback
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data');
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [currentUser]);

  const handleExportData = () => {
    setExportingData(true);
    
    setTimeout(() => {
      try {
        // Create CSV content
        const headers = ['Date', 'Consumer', 'Type', 'Product', 'Status', 'Message'];
        const csvRows = [headers];
        
        // Format data for CSV
        // In a real implementation, this would use actual feedback data
        const csvContent = csvRows.join('\n');
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `feedback_analytics_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setExportingData(false);
      } catch (err) {
        console.error('Error exporting data:', err);
        setExportingData(false);
      }
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md text-red-600 dark:text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        <button
          onClick={handleExportData}
          disabled={exportingData}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none disabled:bg-primary-400"
        >
          {exportingData ? (
            <>
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
              Exporting...
            </>
          ) : (
            <>
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Export Data
            </>
          )}
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <ChartBarIcon className="h-6 w-6" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Feedback</p>
              <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{analytics.totalFeedback}</p>
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
              <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{analytics.pendingFeedback}</p>
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
              <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{analytics.acknowledgedFeedback}</p>
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
              <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{analytics.respondedFeedback}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feedback by Month Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Feedback Trend</h2>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-end space-x-2">
              {analytics.feedbackByMonth.map((item, index) => {
                const maxCount = Math.max(...analytics.feedbackByMonth.map(i => i.count));
                const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-primary-100 dark:bg-primary-900/30 rounded-t relative" 
                      style={{ height: `${Math.max(height, 5)}%` }}
                    >
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-primary-500 dark:bg-primary-600 rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 whitespace-nowrap">
                      {item.month}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Feedback Type Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Feedback Type Distribution</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-primary-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Suggestions</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analytics.feedbackByType.suggestion}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ 
                      width: `${analytics.totalFeedback > 0 
                        ? (analytics.feedbackByType.suggestion / analytics.totalFeedback) * 100 
                        : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Complaints</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analytics.feedbackByType.complaint}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ 
                      width: `${analytics.totalFeedback > 0 
                        ? (analytics.feedbackByType.complaint / analytics.totalFeedback) * 100 
                        : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-amber-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Praise</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analytics.feedbackByType.praise}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ 
                      width: `${analytics.totalFeedback > 0 
                        ? (analytics.feedbackByType.praise / analytics.totalFeedback) * 100 
                        : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              {/* Combined view */}
              <div className="mt-4 h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                {analytics.totalFeedback > 0 && (
                  <div className="flex h-full">
                    <div 
                      className="bg-primary-500 h-full" 
                      style={{ 
                        width: `${(analytics.feedbackByType.suggestion / analytics.totalFeedback) * 100}%` 
                      }}
                    ></div>
                    <div 
                      className="bg-yellow-500 h-full" 
                      style={{ 
                        width: `${(analytics.feedbackByType.complaint / analytics.totalFeedback) * 100}%` 
                      }}
                    ></div>
                    <div 
                      className="bg-amber-500 h-full" 
                      style={{ 
                        width: `${(analytics.feedbackByType.praise / analytics.totalFeedback) * 100}%` 
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Feedback & Response Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products with Most Feedback */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Top Products by Feedback</h2>
          </div>
          <div className="p-6">
            {analytics.productFeedback.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No product data available
              </div>
            ) : (
              <div className="space-y-4">
                {analytics.productFeedback.map((product, index) => {
                  const maxCount = Math.max(...analytics.productFeedback.map(p => p.count));
                  const percentage = maxCount > 0 ? (product.count / maxCount) * 100 : 0;
                  
                  return (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{product.name}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.count}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        {/* Average Response Time */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Response Performance</h2>
          </div>
          <div className="p-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
                <ClockIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.responseTimeAvg} hours
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Average Response Time</p>
              
              <div className="mt-6 text-left">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Response Rate</h4>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ 
                      width: `${analytics.totalFeedback > 0 
                        ? (analytics.respondedFeedback / analytics.totalFeedback) * 100 
                        : 0}%` 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>0%</span>
                  <span>
                    {analytics.totalFeedback > 0 
                      ? Math.round((analytics.respondedFeedback / analytics.totalFeedback) * 100) 
                      : 0}%
                  </span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;