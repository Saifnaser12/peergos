import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
// Import translation files
import enTranslation from './locales/en/translation.json';
import arTranslation from './locales/ar/translation.json';
import enCommon from './locales/en/common.json';
import arCommon from './locales/ar/common.json';
import enTransferPricing from './locales/en/transferPricing.json';
import arTransferPricing from './locales/ar/transferPricing.json';
import enMain from './locales/en.json';
import arMain from './locales/ar.json';
const resources = {
    en: {
        translation: { ...enTranslation, ...enMain },
        common: enCommon,
        transferPricing: enTransferPricing
    },
    ar: {
        translation: { ...arTranslation, ...arMain },
        common: arCommon,
        transferPricing: arTransferPricing
    }
};
// Get saved language or default to English
const savedLanguage = localStorage.getItem('language') || 'en';
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    debug: false,
    ns: ['translation', 'common', 'transferPricing'],
    defaultNS: 'translation',
    interpolation: {
        escapeValue: false
    },
    react: {
        useSuspense: false
    },
    // Better handling of missing translations
    parseMissingKeyHandler: (key) => {
        console.warn(`Missing translation key: ${key}`);
        const keyParts = key.split('.');
        const lastPart = keyParts[keyParts.length - 1];
        return lastPart
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    },
    returnEmptyString: false,
    returnNull: false,
    keySeparator: '.',
    nsSeparator: false
});
// Set initial document direction
document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = savedLanguage;
// Listen for language changes
i18n.on('languageChanged', (lng) => {
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    localStorage.setItem('language', lng);
});
export default i18n;
