import React, { useState, useEffect, useCallback } from 'react';
import FrontNavbar from "../components/FrontNavbar";
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import LanguageModal from '../components/LanguageModal';
import { translations } from '../translations';

const Profile = () => {
  const { user, updateUser } = useUser();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  
  const t = translations[language].profile;
  
  // Redirect to login if not logged in
  useEffect(() => {
    if (!user || !user.isLoggedIn) {
      setIsLoading(false);
      navigate('/login');
      return;
    }

    // Initialize editedUser when user data is available
    setEditedUser({ ...user });
    setIsLoading(false);
  }, [user, navigate]);

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSaveChanges = useCallback(async () => {
    try {
      setError(null);
      // If KYC is being submitted
      if (editedUser.kyc?.idType && editedUser.kyc?.idNumber && editedUser.kyc?.idDocument) {
        editedUser.kyc.status = 'pending';
        editedUser.kyc.submissionDate = new Date().toISOString();
      }
      
      await updateUser(editedUser);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save changes. Please try again.');
      console.error('Error saving changes:', err);
    }
  }, [editedUser, updateUser]);

  const handleCancelEdit = useCallback(() => {
    setEditedUser({ ...user });
    setIsEditing(false);
    setError(null);
  }, [user]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleKYCChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      kyc: {
        ...prev.kyc,
        [name]: value
      }
    }));
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedUser(prev => ({
        ...prev,
        kyc: {
          ...prev.kyc,
          idDocument: file
        }
      }));
    }
  }, []);

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  // If there's an error, show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <FrontNavbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">{t.profile}</h1>
            {!isEditing && (
              <button
                onClick={handleEditClick}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {t.editProfile}
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t.name}
                </label>
                <input
                  type="text"
                  name="name"
                  value={editedUser.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t.username}
                </label>
                <input
                  type="text"
                  name="username"
                  value={editedUser.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t.email}
                </label>
                <input
                  type="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t.bio}
                </label>
                <textarea
                  name="bio"
                  value={editedUser.bio}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {t.saveChanges}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-300">{t.name}</h2>
                <p className="text-white">{user.name}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-300">{t.username}</h2>
                <p className="text-white">{user.username}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-300">{t.email}</h2>
                <p className="text-white">{user.email}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-300">{t.bio}</h2>
                <p className="text-white">{user.bio || t.noBio}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-300">{t.memberSince}</h2>
                <p className="text-white">{user.memberSince}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-300">{t.role}</h2>
                <p className="text-white">{user.role}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-300">{t.walletAddress}</h2>
                <p className="text-white">{user.walletAddress || t.noWallet}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 