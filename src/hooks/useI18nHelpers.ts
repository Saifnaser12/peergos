
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export const useI18nHelpers = () => {
  const { t, i18n } = useTranslation();
  
  const isRTL = i18n.language === 'ar';
  const direction = isRTL ? 'rtl' : 'ltr';
  
  // Safe translation function that handles missing keys
  const safeT = (key: string, defaultValue?: string) => {
    try {
      const translation = t(key);
      
      // If translation is the same as key or starts with our missing indicator
      if (translation === key || translation.startsWith('🔍 Label missing')) {
        // Try to get a more meaningful fallback from the key structure
        const keyParts = key.split('.');
        const lastPart = keyParts[keyParts.length - 1];
        
        // Convert camelCase to readable text
        const readableText = lastPart
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .trim();
        
        return defaultValue || readableText;
      }
      
      return translation;
    } catch (error) {
      console.warn(`Translation error for key: ${key}`, error);
      return defaultValue || key;
    }
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
