import { createTheme as createMuiTheme } from '@mui/material/styles';
export const createTheme = (direction = 'ltr') => {
    const theme = {
        direction,
        palette: {
            mode: 'light',
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
    };
    return createMuiTheme(theme);
};
