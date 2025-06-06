
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export const useI18nHelpers = () => {
  const { t, i18n } = useTranslation();
  
  const isRTL = i18n.language === 'ar';
  const direction = isRTL ? 'rtl' : 'ltr';
  
  // Safe translation function that handles missing keys
  const safeT = (key: string, defaultValue?: string) => {
    const translation = t(key);
    
    // If translation is the same as key or starts with our missing indicator
    if (translation === key || translation.startsWith('🔍 Label missing')) {
      return defaultValue || `🔍 Label missing: ${key}`;
    }
    
    return translation;
  };

  // Set document direction
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = i18n.language;
  }, [direction, i18n.language]);

  return {
    t: safeT,
    i18n,
    isRTL,
    direction,
    changeLanguage: i18n.changeLanguage,
  };
};

export default useI18nHelpers;
