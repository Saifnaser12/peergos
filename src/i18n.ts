
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Simple fallback resources
const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      loading: "Loading..."
    }
  },
  ar: {
    translation: {
      welcome: "مرحبا",
      loading: "جاري التحميل..."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
