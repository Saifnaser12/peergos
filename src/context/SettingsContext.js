import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
const SettingsContext = createContext(undefined);
const defaultSettings = {
    currency: 'AED',
    language: 'en'
};
// Exchange rates (simplified - in production, use a real exchange rate API)
const exchangeRates = {
    AED: 1,
    USD: 0.27 // 1 AED = 0.27 USD
};
export const SettingsProvider = ({ children }) => {
    const { i18n } = useTranslation();
    const [settings, setSettings] = useState(() => {
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
    const setCurrency = (currency) => {
        setSettings(prev => ({ ...prev, currency }));
    };
    const setLanguage = (language) => {
        setSettings(prev => ({ ...prev, language }));
    };
    const formatCurrency = (value) => {
        const convertedValue = value * exchangeRates[settings.currency];
        return new Intl.NumberFormat(settings.language === 'ar' ? 'ar-AE' : 'en-US', {
            style: 'currency',
            currency: settings.currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(convertedValue);
    };
    return (_jsx(SettingsContext.Provider, { value: {
            ...settings,
            setCurrency,
            setLanguage,
            formatCurrency
        }, children: children }));
};
export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
