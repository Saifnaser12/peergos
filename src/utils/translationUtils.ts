
import i18n from '../i18n';

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
  
  return fallback || `🔍 Label missing: ${key}`;
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

// Common translation patterns
export const TRANSLATION_PATTERNS = {
  nav: (page: string) => `nav.${page}`,
  common: (action: string) => `common.${action}`,
  error: (type: string) => `errors.${type}`,
  form: (module: string, field: string) => `${module}.form.${field}`,
  title: (module: string) => `${module}.title`,
  subtitle: (module: string) => `${module}.subtitle`,
};

export default {
  getAllTranslationKeys,
  hasTranslation,
  getTranslationWithFallback,
  verifyComponentTranslations,
  TRANSLATION_PATTERNS,
};
