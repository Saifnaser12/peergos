import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Container, Typography, Box } from '@mui/material';
const Home = () => {
    const { t } = useTranslation();
    return (_jsx(Container, { maxWidth: "lg", children: _jsxs(Box, { sx: { mt: 4, mb: 4 }, children: [_jsxs(Typography, { variant: "h3", component: "h1", gutterBottom: true, children: [t('welcome'), " to Peergos Tax System"] }), _jsx(Typography, { variant: "body1", children: "Your comprehensive tax management solution." })] }) }));
};
export default Home;
