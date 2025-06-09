import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';

const resources = {
  en: {
    translation: enTranslations
  },
  ar: {
    translation: arTranslations
  }
};

// Get saved language or default to English
const savedLanguage = localStorage.getItem('language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    debug: false,

    // Use 'translation' as default namespace
    defaultNS: 'translation',
    ns: ['translation'],

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },

    // Better handling of missing translations
    parseMissingKeyHandler: (key: string) => {
      console.warn(`Missing translation key: ${key}`);
      // Return a more readable version of the key
      const keyParts = key.split('.');
      const lastPart = keyParts[keyParts.length - 1];
      return lastPart
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
    },

    // Always return something readable
    returnEmptyString: false,
    returnNull: false,
    returnObjects: false,

    // Additional options for better handling
    saveMissing: false,
    updateMissing: false,

    // Enable key separator
    keySeparator: '.',
    nsSeparator: false,
  });

// Set initial document direction
document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = savedLanguage;

// Listen for language changes to update document direction
i18n.on('languageChanged', (lng: string) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
  localStorage.setItem('language', lng);
});

export default i18n;
export { useTranslation } from 'react-i18next';