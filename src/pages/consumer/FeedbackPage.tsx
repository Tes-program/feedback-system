/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/consumer/FeedbackPage.tsx
import { useState, useEffect, useRef, JSX } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronDownIcon, 
  PaperAirplaneIcon, 
  PaperClipIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  StarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useManufacturers } from '../../hooks/useManufacturers';
import { createFeedback } from '../../firebase/services/feedbackService';

// interface Manufacturer {
//   uid: string;
//   name: string;
//   industry: string;
//   companyName?: string;
// }

interface FeedbackType {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
}

const FeedbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { manufacturers, loading: loadingManufacturers } = useManufacturers();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [manufacturerSearchQuery, setManufacturerSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'suggestion' | 'complaint' | 'praise'>('suggestion');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [manufacturerDropdownOpen, setManufacturerDropdownOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  // Check for manufacturerId in URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const manufacturerId = params.get('manufacturerId');
    if (manufacturerId) {
      setSelectedManufacturer(manufacturerId);
    }
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedManufacturer) {
      setError('Please select a manufacturer');
      return;
    }
    
    if (!message.trim()) {
      setError('Please enter your feedback message');
      return;
    }

    if (!currentUser) {
      setError('You must be logged in to submit feedback');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      // Get manufacturer information
      const manufacturer = manufacturers.find(m => m.uid === selectedManufacturer);
      if (!manufacturer) {
        throw new Error('Selected manufacturer not found');
      }
      
      // Create feedback
      const feedbackData = {
        consumerId: currentUser.uid,
        consumerName: currentUser.displayName || 'Anonymous',
        manufacturerId: selectedManufacturer,
        manufacturerName: manufacturer.companyName || manufacturer.name,
        message,
        feedbackType,
        // product: selectedProduct || undefined,
        status: 'pending' as const,
      };
      
      const feedbackId = await createFeedback(feedbackData, attachments);
      
      // Navigate to chat with the manufacturer
      navigate(`/consumer/chat/${feedbackId}`);
    } catch (err: any) {
      console.error('Feedback submission error:', err);
      setError(err.message || 'Failed to submit feedback. Please try again.');
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setAttachments(fileArray);
    }
  };
  
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const filteredManufacturers = manufacturerSearchQuery
    ? manufacturers.filter(m => 
        m.name.toLowerCase().includes(manufacturerSearchQuery.toLowerCase()) ||
        (m.industry && m.industry.toLowerCase().includes(manufacturerSearchQuery.toLowerCase()))
      )
    : manufacturers;

  const selectedManufacturerDetails = manufacturers.find(m => m.uid === selectedManufacturer);

  const feedbackTypes: FeedbackType[] = [
    {
      id: 'suggestion',
      name: 'Suggestion',
      description: 'Ideas to improve products or services',
      icon: <LightBulbIcon className="h-5 w-5 text-primary-600" />,
    },
    {
      id: 'complaint',
      name: 'Complaint',
      description: 'Report an issue with a product or service',
      icon: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />,
    },
    {
      id: 'praise',
      name: 'Praise',
      description: 'Share positive experiences',
      icon: <StarIcon className="h-5 w-5 text-amber-600" />,
    },
  ];

  if (loadingManufacturers) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-medium text-gray-900 dark:text-white">Submit Feedback</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Share your thoughts directly with manufacturers through our private feedback channel
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Manufacturer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Manufacturer
            </label>
            <div className="relative mt-1">
              <button
                type="button"
                className="relative w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm pl-3 pr-10 py-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                onClick={() => setManufacturerDropdownOpen(!manufacturerDropdownOpen)}
              >
                {selectedManufacturerDetails ? (
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium">
                      {selectedManufacturerDetails.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <span className="block truncate text-gray-900 dark:text-white">{selectedManufacturerDetails.name}</span>
                      <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{selectedManufacturerDetails.industry}</span>
                    </div>
                  </div>
                ) : (
                  <span className="block truncate text-gray-500 dark:text-gray-400">Select a manufacturer</span>
                )}
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </button>

              {manufacturerDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  <div className="sticky top-0 z-10 bg-white dark:bg-gray-700 px-2 py-2">
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
                      placeholder="Search manufacturers..."
                      value={manufacturerSearchQuery}
                      onChange={(e) => setManufacturerSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {filteredManufacturers.length === 0 ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-300">
                      No manufacturers found
                    </div>
                  ) : (
                    filteredManufacturers.map((manufacturer) => (
                      <div
                        key={manufacturer.uid}
                        className={`relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-600 ${
                          selectedManufacturer === manufacturer.uid ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-900 dark:text-primary-100' : 'text-gray-900 dark:text-white'
                        }`}
                        onClick={() => {
                          setSelectedManufacturer(manufacturer.uid);
                          setManufacturerDropdownOpen(false);
                        }}
                      >
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium">
                            {manufacturer.name.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <span className="block font-medium">{manufacturer.companyName}</span>
                            <span className="block text-xs text-gray-500 dark:text-gray-400">{manufacturer.industry}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Product Selection (conditional on manufacturer selection) */}
          {selectedManufacturer && (
            <div>
              <label htmlFor="product" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product (Optional)
              </label>
              <select
                id="product"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-3 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select a product (optional)</option>
                {/* This would be dynamically populated based on selected manufacturer */}
                {selectedManufacturerDetails?.industry === 'Technology' && (
                  <>
                    <option value="smartphone">Smartphone X Pro</option>
                    <option value="laptop">UltraBook 5000</option>
                    <option value="tablet">TabPro 10</option>
                    <option value="smartwatch">SmartWatch 3</option>
                  </>
                )}
                {selectedManufacturerDetails?.industry === 'Food & Beverage' && (
                  <>
                    <option value="chocolate">Premium Chocolate Collection</option>
                    <option value="snacks">Gourmet Snack Box</option>
                    <option value="beverages">Artisan Beverages</option>
                    <option value="readymeals">Ready-to-Eat Meals</option>
                  </>
                )}
                {selectedManufacturerDetails?.industry === 'Apparel' && (
                  <>
                    <option value="tshirts">Premium T-Shirt Collection</option>
                    <option value="jeans">Designer Jeans</option>
                    <option value="dresses">Summer Dresses</option>
                    <option value="accessories">Fashion Accessories</option>
                  </>
                )}
                {selectedManufacturerDetails?.industry === 'Home Goods' && (
                  <>
                    <option value="furniture">Living Room Furniture</option>
                    <option value="bedding">Bedding Collection</option>
                    <option value="kitchenware">Kitchen Essentials</option>
                    <option value="decor">Home Décor Items</option>
                  </>
                )}
                {selectedManufacturerDetails?.industry === 'Sporting Goods' && (
                  <>
                    <option value="camping">Camping Gear</option>
                    <option value="hiking">Hiking Equipment</option>
                    <option value="fitness">Fitness Accessories</option>
                    <option value="sportswear">Athletic Apparel</option>
                  </>
                )}
              </select>
            </div>
          )}
          
          {/* Feedback Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Feedback Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {feedbackTypes.map((type) => (
                <div 
                  key={type.id}
                  className={`relative rounded-lg border ${
                    feedbackType === type.id 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500' 
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  } p-4 cursor-pointer`}
                  onClick={() => setFeedbackType(type.id as 'suggestion' | 'complaint' | 'praise')}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {type.icon}
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{type.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{type.description}</p>
                    </div>
                    {feedbackType === type.id && (
                      <div className="h-5 w-5 bg-primary-500 rounded-full flex items-center justify-center text-white">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M3.707 5.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L5 6.586 3.707 5.293z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your Feedback
            </label>
            <div className="mt-1 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm overflow-hidden focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500">
              <textarea
                id="message"
                rows={8}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="block w-full border-0 resize-none focus:ring-0 dark:bg-gray-700 dark:text-white p-4"
                placeholder="Describe your feedback, concern, or suggestion in detail..."
                required
              ></textarea>
              
              {/* Attachments list */}
              {attachments.length > 0 && (
                <div className="p-2 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                  <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Attachments:</h4>
                  <ul className="space-y-1">
                    {attachments.map((file, index) => (
                      <li key={index} className="flex items-center justify-between text-xs bg-white dark:bg-gray-700 p-2 rounded">
                        <div className="flex items-center">
                          <PaperClipIcon className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-800 dark:text-gray-200 truncate max-w-xs">{file.name}</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeAttachment(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="p-2 bg-white dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <PaperClipIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    multiple
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your feedback will be kept confidential
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/consumer/dashboard')}
              className="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedManufacturer || !message.trim()}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 disabled:cursor-not-allowed flex items-center"
            >
              {submitting ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <PaperAirplaneIcon className="mr-2 h-4 w-4" />
              )}
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;