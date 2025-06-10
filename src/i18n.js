import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// Import main translation files
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';
// Import additional namespace files
import enCommon from './locales/en/common.json';
import enTranslation from './locales/en/translation.json';
import enTransferPricing from './locales/en/transferPricing.json';
import arCommon from './locales/ar/common.json';
import arTranslation from './locales/ar/translation.json';
import arTransferPricing from './locales/ar/transferPricing.json';
const resources = {
    en: {
        translation: enTranslations,
        common: enCommon,
        specific: enTranslation,
        transferPricing: enTransferPricing
    },
    ar: {
        translation: arTranslations,
        common: arCommon,
        specific: arTranslation,
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
    // Use 'translation' as default namespace
    defaultNS: 'translation',
    ns: ['translation', 'common', 'specific', 'transferPricing'],
    interpolation: {
        escapeValue: false,
    },
    react: {
        useSuspense: false,
    },
    // Better handling of missing translations
    parseMissingKeyHandler: (key) => {
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
