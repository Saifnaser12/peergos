import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type Currency = 'AED' | 'USD';
type Language = 'en' | 'ar';

interface Settings {
  currency: Currency;
  language: Language;
}

interface SettingsContextType extends Settings {
  setCurrency: (currency: Currency) => void;
  setLanguage: (language: Language) => void;
  formatCurrency: (value: number) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultSettings: Settings = {
  currency: 'AED',
  language: 'en'
};

// Exchange rates (simplified - in production, use a real exchange rate API)
const exchangeRates = {
  AED: 1,
  USD: 0.27 // 1 AED = 0.27 USD
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
    
    // Update document direction based on language
    document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = settings.language;
    
    // Update i18next language
    i18n.changeLanguage(settings.language);
  }, [settings, i18n]);

  const setCurrency = (currency: Currency) => {
    setSettings(prev => ({ ...prev, currency }));
  };

  const setLanguage = (language: Language) => {
    setSettings(prev => ({ ...prev, language }));
  };

  const formatCurrency = (value: number) => {
    const convertedValue = value * exchangeRates[settings.currency];
    return new Intl.NumberFormat(settings.language === 'ar' ? 'ar-AE' : 'en-US', {
      style: 'currency',
      currency: settings.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(convertedValue);
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        setCurrency,
        setLanguage,
        formatCurrency
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}; 