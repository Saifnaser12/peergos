
import { createTheme } from '@mui/material/styles';
import { arEG, enUS } from '@mui/x-date-pickers/locales';

const theme = (direction: 'ltr' | 'rtl' = 'ltr') => createTheme({
  direction,
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
}, direction === 'rtl' ? arEG : enUS);

export default theme;
