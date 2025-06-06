import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Simple inline translations to avoid import issues
const resources = {
  en: {
    translation: {
      'fta.status.connected': 'Connected',
      'fta.status.disconnected': 'Disconnected', 
      'fta.status.error': 'Error',
      'fta.integration.title': 'FTA Integration',
      'fta.lastSync': 'Last sync',
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.save': 'Save',
      'common.cancel': 'Cancel'
    }
  },
  ar: {
    translation: {
      'fta.status.connected': 'متصل',
      'fta.status.disconnected': 'غير متصل',
      'fta.status.error': 'خطأ', 
      'fta.integration.title': 'تكامل الهيئة الاتحادية للضرائب',
      'fta.lastSync': 'آخر مزامنة',
      'common.loading': 'جاري التحميل...',
      'common.error': 'خطأ',
      'common.save': 'حفظ',
      'common.cancel': 'إلغاء'
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

    // Handle missing translations
    parseMissingKeyHandler: (key: string) => {
      console.warn(`Missing translation key: ${key}`);
      return `🔍 Label missing: ${key}`;
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