import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from './LanguageToggle';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();

  const menuItems = [
    {
      path: '/transfer-pricing',
      label: t('app.navigation.transferPricing'),
      icon: <DescriptionIcon />,
    },
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {t('app.title')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {menuItems.map((item) => (
            <IconButton
              key={item.path}
              component={Link}
              to={item.path}
              color="inherit"
              title={item.label}
            >
              {item.icon}
            </IconButton>
          ))}
          <LanguageToggle />
        </Box>
      </Toolbar>
    </AppBar>
  );
}; 