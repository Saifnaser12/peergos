import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Container, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TransferPricingForm } from '../components/transferPricing/TransferPricingForm';
export const TransferPricing = () => {
    const { t } = useTranslation();
    return (_jsxs(Container, { maxWidth: "lg", sx: { py: 4 }, children: [_jsxs(Paper, { sx: { p: 3, mb: 3 }, children: [_jsx(Typography, { variant: "h4", gutterBottom: true, children: t('transferPricing.title') }), _jsx(Typography, { variant: "body1", color: "text.secondary", paragraph: true, children: t('transferPricing.description') })] }), _jsx(TransferPricingForm, {})] }));
};
export default TransferPricing;
