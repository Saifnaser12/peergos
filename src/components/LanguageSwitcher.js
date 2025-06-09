import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { LanguageIcon } from '@heroicons/react/24/outline';
const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en';
        i18n.changeLanguage(newLang);
        // Update document direction for RTL support
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = newLang;
    };
    return (_jsxs("button", { onClick: toggleLanguage, className: "flex items-center space-x-1 p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200", "aria-label": "Switch language", children: [_jsx(LanguageIcon, { className: "h-5 w-5" }), _jsx("span", { className: "text-sm font-medium", children: i18n.language === 'en' ? 'العربية' : 'English' })] }));
};
export default LanguageSwitcher;
