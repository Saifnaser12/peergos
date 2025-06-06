
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

    // Handle missing translations gracefully
    parseMissingKeyHandler: (key: string) => {
      console.warn(`Missing translation key: ${key}`);
      return key; // Return the key itself instead of error message
    },

    // Return key itself if no translation found
    returnEmptyString: false,
    returnNull: false,
    
    // Additional options for better handling
    saveMissing: false,
    updateMissing: false,
  });

export default i18n;
export { useTranslation } from 'react-i18next';
