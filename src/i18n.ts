import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

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

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    ns: ['translation', 'common', 'transferPricing'],
    defaultNS: 'translation'
  });

export default i18n;