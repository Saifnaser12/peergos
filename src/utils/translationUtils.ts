
import i18n from '../i18n';

// Safe translation function that never throws
export const safeTranslate = (key: string, options?: any): string => {
  try {
    const translation = i18n.t(key, options);
    
    // If translation equals the key, it means it wasn't found
    if (translation === key) {
      console.warn(`Missing translation for key: ${key}`);
      // Return a readable version of the key
      const keyParts = key.split('.');
      const lastPart = keyParts[keyParts.length - 1];
      return lastPart
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
    }
    
    return translation;
  } catch (error) {
    console.error(`Translation error for key: ${key}`, error);
    // Return a readable version of the key as fallback
    const keyParts = key.split('.');
    const lastPart = keyParts[keyParts.length - 1];
    return lastPart
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }
};

// Get all translation keys from the translation objects
export const getAllTranslationKeys = (obj: any, prefix = ''): string[] => {
  let keys: string[] = [];
  
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getAllTranslationKeys(obj[key], `${prefix}${key}.`));
    } else {
      keys.push(`${prefix}${key}`);
    }
  }
  
  return keys;
};

// Check if a translation key exists
export const hasTranslation = (key: string, language?: string): boolean => {
  const lng = language || i18n.language;
  return i18n.exists(key, { lng });
};

// Get translation with fallback
export const getTranslationWithFallback = (key: string, fallback?: string): string => {
  if (hasTranslation(key)) {
    return i18n.t(key);
  }
  
  // Create a readable fallback from the key
  const keyParts = key.split('.');
  const lastPart = keyParts[keyParts.length - 1];
  const readableText = lastPart
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
  
  return fallback || readableText;
};

// Verify if all keys in a component are translated
export const verifyComponentTranslations = (keys: string[]): { missing: string[]; existing: string[] } => {
  const missing: string[] = [];
  const existing: string[] = [];
  
  keys.forEach(key => {
    if (hasTranslation(key)) {
      existing.push(key);
    } else {
      missing.push(key);
    }
  });
  
  return { missing, existing };
};

// Validate translation structure
export const validateTranslationStructure = (translations: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  const validateObject = (obj: any, path = '') => {
    for (const key in obj) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (obj[key] === null || obj[key] === undefined) {
        errors.push(`Missing value for key: ${currentPath}`);
      } else if (typeof obj[key] === 'object') {
        validateObject(obj[key], currentPath);
      } else if (typeof obj[key] === 'string' && obj[key].trim() === '') {
        errors.push(`Empty string for key: ${currentPath}`);
      }
    }
  };
  
  validateObject(translations);
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
