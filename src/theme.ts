import { createTheme } from '@mui/material/styles';
import { arEG, enUS } from '@mui/material/locale';

const getDirection = () => {
  const language = localStorage.getItem('language') || 'en';
  return language === 'ar' ? 'rtl' : 'ltr';
};

export const theme = createTheme(
  {
    direction: getDirection(),
    palette: {
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
    typography: {
      fontFamily: getDirection() === 'rtl'
        ? '"Cairo", "Roboto", "Helvetica", "Arial", sans-serif'
        : '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            direction: getDirection(),
          },
        },
      },
    },
  },
  getDirection() === 'rtl' ? arEG : enUS
); 