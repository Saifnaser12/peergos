
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enCommon from './locales/en/common.json';
import enTranslation from './locales/en/translation.json';
import arCommon from './locales/ar/common.json';
import arTranslation from './locales/ar/translation.json';

const resources = {
  en: {
    translation: {
      ...enCommon,
      ...enTranslation
    }
  },
  ar: {
    translation: {
      ...arCommon,
      ...arTranslation
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    debug: false,

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

export default i18n;
export { useTranslation } from 'react-i18next';
