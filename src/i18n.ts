import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import enTransferPricing from './locales/en/transferPricing.json';
import arCommon from './locales/ar/common.json';
import arTransferPricing from './locales/ar/transferPricing.json';

const resources = {
  en: {
    common: enCommon,
    transferPricing: enTransferPricing,
  },
  ar: {
    common: arCommon,
    transferPricing: arTransferPricing,
  },
};

const savedLanguage = localStorage.getItem('language');
document.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage || 'en',
    fallbackLng: 'en',
    ns: ['common', 'transferPricing'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n; 