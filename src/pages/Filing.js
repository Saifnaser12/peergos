import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Box, Typography, Paper } from '@mui/material';
const Filing = () => {
    const { t } = useTranslation();
    return (_jsxs(Box, { children: [_jsx(Typography, { variant: "h4", gutterBottom: true, children: t('nav.filing') }), _jsx(Paper, { sx: { p: 3 }, children: _jsx(Typography, { variant: "body1", children: "Tax filing functionality coming soon." }) })] }));
};
export default Filing;
