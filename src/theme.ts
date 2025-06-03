import { createTheme, Direction } from '@mui/material/styles';
import { arEG, enUS } from '@mui/material/locale';

const getDirection = (): Direction => {
  return (document.dir || 'ltr') as Direction;
};

const direction = getDirection();

export const theme = createTheme({
  direction,
  palette: {
    primary: {
      main: '#4F46E5', // Indigo 600
      light: '#818CF8', // Indigo 400
      dark: '#3730A3', // Indigo 800
    },
    secondary: {
      main: '#10B981', // Emerald 500
      light: '#34D399', // Emerald 400
      dark: '#059669', // Emerald 600
    },
    error: {
      main: '#EF4444', // Red 500
      light: '#F87171', // Red 400
      dark: '#DC2626', // Red 600
    },
    warning: {
      main: '#F59E0B', // Amber 500
      light: '#FBBF24', // Amber 400
      dark: '#D97706', // Amber 600
    },
    info: {
      main: '#3B82F6', // Blue 500
      light: '#60A5FA', // Blue 400
      dark: '#2563EB', // Blue 600
    },
    success: {
      main: '#10B981', // Emerald 500
      light: '#34D399', // Emerald 400
      dark: '#059669', // Emerald 600
    },
    background: {
      default: '#F9FAFB', // Gray 50
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: direction === 'rtl'
      ? '"Cairo", "Roboto", "Helvetica", "Arial", sans-serif'
      : '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          direction,
        },
      },
    },
  },
}, direction === 'rtl' ? arEG : enUS); 