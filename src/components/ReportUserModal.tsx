// src/components/ReportUserModal.tsx
import { useState } from 'react';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

interface ReportUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportedUser: {
    id: string;
    name: string;
    role: 'consumer' | 'manufacturer';
  };
}

const ReportUserModal = ({ isOpen, onClose, reportedUser }: ReportUserModalProps) => {
  const { currentUser } = useAuth();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const reasons = [
    'Inappropriate behavior',
    'Harassment',
    'Spam',
    'Inappropriate content',
    'Fake account',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to submit a report.');
      return;
    }
    
    if (!reason) {
      setError('Please select a reason for the report.');
      return;
    }
    
    if (!details.trim()) {
      setError('Please provide details about the issue.');
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      await addDoc(collection(db, 'reports'), {
        reporterId: currentUser.uid,
        reporterName: currentUser.displayName || 'Anonymous',
        reportedUserId: reportedUser.id,
        reportedUserName: reportedUser.name,
        reportedUserRole: reportedUser.role,
        reason,
        details,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      setSubmitted(true);
      setSubmitting(false);
    } catch (err) {
      console.error('Error submitting report:', err);
      setError('An error occurred while submitting your report. Please try again.');
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setReason('');
    setDetails('');
    setError('');
    setSubmitted(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {submitted ? (
            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 sm:mx-0 sm:h-10 sm:w-10">
                  <ShieldExclamationIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Report Submitted
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Thank you for your report. Our moderation team will review it shortly and take appropriate action if needed.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    resetForm();
                    onClose();
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                    <ShieldExclamationIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Report User
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        You are reporting {reportedUser.name} ({reportedUser.role}). Please provide details about the issue.
                      </p>
                    </div>
                  </div>
                </div>
                
                {error && (
                  <div className="mt-3 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4">
                    <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                  </div>
                )}
                <div className="mt-4">
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reason for Report
                  </label>
                  <select
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select a reason</option>
                    {reasons.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mt-4">
                  <label htmlFor="details" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Details
                  </label>
                  <textarea
                    id="details"
                    rows={4}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Please provide specific details about the issue..."
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  ></textarea>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-red-400 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportUserModal;
