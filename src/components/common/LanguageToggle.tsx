import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import { useTranslation } from 'react-i18next';

export const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    // Document direction will be handled by i18n language change listener
  };

  return (
    <Tooltip title={i18n.language === 'ar' ? 'English' : 'العربية'}>
      <IconButton color="inherit" onClick={toggleLanguage}>
        <TranslateIcon />
      </IconButton>
    </Tooltip>
  );
}; 