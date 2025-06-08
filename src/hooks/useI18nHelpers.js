import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
export const useI18nHelpers = () => {
    const { t, i18n } = useTranslation();
    const safeT = useMemo(() => {
        return (key, options) => {
            try {
                const translation = t(key, options);
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
            }
            catch (error) {
                console.error(`Translation error for key: ${key}`, error);
                return key;
            }
        };
    }, [t]);
    const isRTL = i18n.language === 'ar';
    const formatNumber = (num) => {
        return new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-AE' : 'en-AE', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(num);
    };
    const formatCurrency = (amount, currency = 'AED') => {
        return new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-AE' : 'en-AE', {
            style: 'currency',
            currency,
        }).format(amount);
    };
    const formatDate = (date) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return new Intl.DateTimeFormat(i18n.language === 'ar' ? 'ar-AE' : 'en-AE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(dateObj);
    };
    return {
        t: safeT,
        i18n,
        isRTL,
        formatNumber,
        formatCurrency,
        formatDate,
        currentLanguage: i18n.language,
        changeLanguage: i18n.changeLanguage,
    };
};
export default useI18nHelpers;
