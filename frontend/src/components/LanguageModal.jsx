import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

const LanguageModal = ({ isOpen, onClose }) => {
  const { language, setLanguage, region, setRegion } = useLanguage();
  const t = translations[language].language;

  if (!isOpen) return null;

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'mr', name: 'मराठी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' }
  ];

  const regions = [
    { code: 'IN-MH', name: 'Maharashtra', currency: 'INR' },
    { code: 'IN-TN', name: 'Tamil Nadu', currency: 'INR' },
    { code: 'IN-KA', name: 'Karnataka', currency: 'INR' },
    { code: 'US', name: 'United States', currency: 'USD' },
    { code: 'ES', name: 'España', currency: 'EUR' },
    { code: 'FR', name: 'France', currency: 'EUR' },
    { code: 'MX', name: 'México', currency: 'MXN' },
    { code: 'CA', name: 'Canada', currency: 'CAD' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">{t.title}</h2>
        
        {/* Language Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">{t.language}</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Region Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">{t.region}</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {regions.map((reg) => (
              <option key={reg.code} value={reg.code}>
                {reg.name} ({reg.currency})
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            {t.cancel}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageModal; 