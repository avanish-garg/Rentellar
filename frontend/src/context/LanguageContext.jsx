import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });

  const [region, setRegion] = useState(() => {
    const savedRegion = localStorage.getItem('region');
    return savedRegion || 'US';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    localStorage.setItem('region', region);
  }, [language, region]);

  const value = {
    language,
    setLanguage,
    region,
    setRegion,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 