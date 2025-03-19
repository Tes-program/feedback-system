/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/ProfilePage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserCircleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db } from '../firebase/config';

const ProfilePage = () => {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    industry: '',
    phone: '',
    bio: ''
  });
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserProfile(data);
          setFormData({
            name: data.name || '',
            email: data.email || '',
            companyName: data.companyName || '',
            industry: data.industry || '',
            phone: data.phone || '',
            bio: data.bio || ''
          });
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile information');
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [currentUser, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = async () => {
    if (!currentUser) return;
    
    setSaving(true);
    setError('');
    
    try {
      // Update profile in Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        ...(userRole === 'manufacturer' ? {
          companyName: formData.companyName,
          industry: formData.industry
        } : {})
      });
      
      // Update displayName in Firebase Auth
      await updateProfile(currentUser, {
        displayName: formData.name
      });
      
      // Update local state
      setUserProfile((prev: any) => ({
        ...prev,
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        ...(userRole === 'manufacturer' ? {
          companyName: formData.companyName,
          industry: formData.industry
        } : {})
      }));
      
      setEditMode(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile information');
    } finally {
      setSaving(false);
    }
  };
  
  const cancelEdit = () => {
    // Reset form data to original values
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        companyName: userProfile.companyName || '',
        industry: userProfile.industry || '',
        phone: userProfile.phone || '',
        bio: userProfile.bio || ''
      });
    }
    setEditMode(false);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h1 className="text-xl font-medium text-gray-900 dark:text-white">Your Profile</h1>
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={cancelEdit}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <XMarkIcon className="h-4 w-4 mr-1" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400"
              >
                {saving ? (
                  <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <CheckIcon className="h-4 w-4 mr-1" />
                )}
                Save Changes
              </button>
            </div>
          )}
        </div>
        
        {error && (
          <div className="px-6 py-3 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start mb-6">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <div className="bg-primary-100 dark:bg-primary-900/50 rounded-full h-24 w-24 flex items-center justify-center">
                <UserCircleIcon className="h-16 w-16 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {userProfile?.name || 'User'}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 capitalize">
                {userRole}
              </p>
              {userRole === 'manufacturer' && userProfile?.companyName && (
                <p className="mt-1 text-gray-700 dark:text-gray-300">
                  {userProfile.companyName}
                  {userProfile.industry && <span> • {userProfile.industry}</span>}
                </p>
              )}
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {userProfile?.bio || 'No bio available'}
              </p>
            </div>
          </div>
          
          {editMode ? (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Email cannot be changed
                  </p>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                
                {userRole === 'manufacturer' && (
                  <>
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Company Name
                      </label>
                      <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
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
                        value={formData.industry}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                  </>
                )}
                
                <div className="md:col-span-2">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio (Optional)
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us a little about yourself"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
                  ></textarea>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Full Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {userProfile?.name || 'Not provided'}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email Address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {userProfile?.email || 'Not provided'}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Phone Number
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {userProfile?.phone || 'Not provided'}
                  </dd>
                </div>
                
                {userRole === 'manufacturer' && (
                  <>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Company Name
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {userProfile?.companyName || 'Not provided'}
                      </dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Industry
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {userProfile?.industry || 'Not provided'}
                      </dd>
                    </div>
                  </>
                )}
                
                <div className="md:col-span-2">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Bio
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {userProfile?.bio || 'No bio available'}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;