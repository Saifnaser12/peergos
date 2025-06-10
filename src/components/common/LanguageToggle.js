import { jsx as _jsx } from "react/jsx-runtime";
import { IconButton, Tooltip } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import { useTranslation } from 'react-i18next';
export const LanguageToggle = () => {
    const { i18n } = useTranslation();
    const toggleLanguage = () => {
        const newLang = i18n.language === 'ar' ? 'en' : 'ar';
        i18n.changeLanguage(newLang);
        document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
        localStorage.setItem('language', newLang);
    };
    return (_jsx(Tooltip, { title: i18n.language === 'ar' ? 'English' : 'العربية', children: _jsx(IconButton, { color: "inherit", onClick: toggleLanguage, children: _jsx(TranslateIcon, {}) }) }));
};
