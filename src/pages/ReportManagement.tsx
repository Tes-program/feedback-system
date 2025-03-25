// src/pages/ReportsManagement.tsx
import { useState, useEffect } from 'react';
import { 
  ShieldExclamationIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { 
  collection, 
  query, 
  getDocs, 
  doc, 
  updateDoc, 
  Timestamp, 
  where
} from 'firebase/firestore';
import { db } from '../firebase/config';

interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedUserId: string;
  reportedUserName: string;
  reportedUserRole: 'consumer' | 'manufacturer';
  reason: string;
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const ReportsManagement = () => {
//   const { currentUser } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        let reportsQuery = query(collection(db, 'reports'));
        
        if (filter !== 'all') {
          reportsQuery = query(collection(db, 'reports'), where('status', '==', filter));
        }
        
        const reportsSnapshot = await getDocs(reportsQuery);
        
        const reportsList = reportsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Report[];
        
        // Sort by created date, newest first
        reportsList.sort((a, b) => {
          return b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime();
        });
        
        setReports(reportsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setLoading(false);
      }
    };
    
    fetchReports();
  }, [filter]);

  const handleResolveReport = async (reportId: string) => {
    try {
      setProcessing(true);
      await updateDoc(doc(db, 'reports', reportId), {
        status: 'resolved',
        updatedAt: Timestamp.now()
      });
      
      // Update local state
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId 
            ? {...report, status: 'resolved', updatedAt: Timestamp.now()} 
            : report
        )
      );
      
      setProcessing(false);
      setShowModal(false);
    } catch (error) {
      console.error('Error resolving report:', error);
      setProcessing(false);
    }
  };

  const handleDismissReport = async (reportId: string) => {
    try {
      setProcessing(true);
      await updateDoc(doc(db, 'reports', reportId), {
        status: 'dismissed',
        updatedAt: Timestamp.now()
      });
      
      // Update local state
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId 
            ? {...report, status: 'dismissed', updatedAt: Timestamp.now()} 
            : report
        )
      );
      
      setProcessing(false);
      setShowModal(false);
    } catch (error) {
      console.error('Error dismissing report:', error);
      setProcessing(false);
    }
  };

  const handleSuspendUser = async (userId: string, reportId: string) => {
    try {
      setProcessing(true);
      
      // Update user document to set suspended status
      await updateDoc(doc(db, 'users', userId), {
        suspended: true,
        suspendedAt: Timestamp.now(),
        suspendedReason: 'Violation of platform guidelines'
      });
      
      // Resolve the report
      await updateDoc(doc(db, 'reports', reportId), {
        status: 'resolved',
        updatedAt: Timestamp.now(),
        resolution: 'user_suspended'
      });
      
      // Update local state
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId 
            ? {...report, status: 'resolved', updatedAt: Timestamp.now()} 
            : report
        )
      );
      
      setProcessing(false);
      setShowModal(false);
    } catch (error) {
      console.error('Error suspending user:', error);
      setProcessing(false);
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <ShieldExclamationIcon className="mr-1 h-3 w-3" />
            Pending
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircleIcon className="mr-1 h-3 w-3" />
            Resolved
          </span>
        );
      case 'dismissed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
            <XCircleIcon className="mr-1 h-3 w-3" />
            Dismissed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Report Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Review and handle user reports. Take appropriate actions to maintain platform integrity.
          </p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 flex flex-wrap items-center gap-4">
          <div className="font-medium text-sm text-gray-700 dark:text-gray-300">Filter by status:</div>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'all' 
                ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'pending' 
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'resolved' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Resolved
          </button>
          <button
            onClick={() => setFilter('dismissed')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'dismissed' 
                ? 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Dismissed
          </button>
        </div>
      </div>
      
      {/* Reports Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <ShieldExclamationIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No reports found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {filter === 'all' 
                ? 'There are no reports in the system.' 
                : `There are no ${filter} reports at this time.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Reported User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Reason
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Reported By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium rounded-full">
                          {report.reportedUserName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {report.reportedUserName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                            {report.reportedUserRole}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{report.reason}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{report.reporterName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(report.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setShowModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 mr-4"
                      >
                        View
                      </button>
                      {report.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleResolveReport(report.id)}
                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 mr-4"
                          >
                            Resolve
                          </button>
                          <button
                            onClick={() => handleDismissReport(report.id)}
                            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            Dismiss
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Report Detail Modal */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                    <ShieldExclamationIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Report Details
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Reported User</h4>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {selectedReport.reportedUserName} ({selectedReport.reportedUserRole})
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Reported By</h4>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {selectedReport.reporterName}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Report Reason</h4>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {selectedReport.reason}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Details</h4>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                          {selectedReport.details}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Date Reported</h4>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {formatDate(selectedReport.createdAt)}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h4>
                        <div className="mt-1">
                          {getStatusBadge(selectedReport.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedReport.status === 'pending' && (
                  <>
                    <button
                      type="button"
                      disabled={processing}
                      onClick={() => handleSuspendUser(selectedReport.reportedUserId, selectedReport.id)}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {processing ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <InformationCircleIcon className="mr-2 h-4 w-4" />
                          Suspend User
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={processing}
                      onClick={() => handleResolveReport(selectedReport.id)}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {processing ? 'Processing...' : 'Resolve'}
                    </button>
                    <button
                      type="button"
                      disabled={processing}
                      onClick={() => handleDismissReport(selectedReport.id)}
                      className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      Dismiss
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsManagement;