import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, TextField, Typography, FormControlLabel, Switch, Grid, InputAdornment, Tooltip, IconButton, Paper, alpha, useTheme } from '@mui/material';
// Removed MUI date picker imports - using native HTML date inputs
import { Info as InfoIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
export const CompanyInfoForm = ({ companyInfo, onUpdate }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const handleChange = (field) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        onUpdate({
            ...companyInfo,
            [field]: value
        });
    };
    const handleNumberChange = (field) => (event) => {
        const value = event.target.value ? parseFloat(event.target.value) : undefined;
        onUpdate({
            ...companyInfo,
            [field]: value
        });
    };
    const handleDateChange = (field) => (date) => {
        onUpdate({
            ...companyInfo,
            [field]: date ? date.toISOString().split('T')[0] : ''
        });
    };
    return (_jsxs(Box, { children: [_jsx(Typography, { variant: "h5", sx: { mb: 3, fontWeight: 600 }, children: t('transferPricing.companyInformation') }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, children: _jsxs(Paper, { elevation: 0, sx: {
                                p: 3,
                                borderRadius: 2,
                                backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                            }, children: [_jsx(Typography, { variant: "h6", sx: { mb: 2, color: 'primary.main' }, children: t('transferPricing.basicInformation') }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, required: true, label: t('transferPricing.legalName'), value: companyInfo.legalName, onChange: handleChange('legalName'), variant: "outlined", sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } } }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, required: true, label: t('transferPricing.trn'), value: companyInfo.trn, onChange: handleChange('trn'), variant: "outlined", placeholder: "100000000000003", sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } }, InputProps: {
                                                    endAdornment: (_jsx(InputAdornment, { position: "end", children: _jsx(Tooltip, { title: t('transferPricing.trnTooltip'), children: _jsx(IconButton, { size: "small", children: _jsx(InfoIcon, { fontSize: "small" }) }) }) })),
                                                } }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, type: "date", label: t('transferPricing.fiscalYearStart'), value: companyInfo.fiscalYearStart, onChange: handleChange('fiscalYearStart'), variant: "outlined", InputLabelProps: { shrink: true }, sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } } }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, type: "date", label: t('transferPricing.fiscalYearEnd'), value: companyInfo.fiscalYearEnd, onChange: handleChange('fiscalYearEnd'), variant: "outlined", InputLabelProps: { shrink: true }, sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } } }) })] })] }) }), _jsx(Grid, { item: true, xs: 12, children: _jsxs(Paper, { elevation: 0, sx: {
                                p: 3,
                                borderRadius: 2,
                                backgroundColor: alpha(theme.palette.secondary.main, 0.02),
                                border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`
                            }, children: [_jsx(Typography, { variant: "h6", sx: { mb: 2, color: 'secondary.main' }, children: t('transferPricing.groupStructure') }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(FormControlLabel, { control: _jsx(Switch, { checked: companyInfo.isPartOfTaxGroup, onChange: handleChange('isPartOfTaxGroup'), color: "secondary" }), label: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [t('transferPricing.isPartOfTaxGroup'), _jsx(Tooltip, { title: t('transferPricing.taxGroupTooltip'), children: _jsx(IconButton, { size: "small", children: _jsx(InfoIcon, { fontSize: "small" }) }) })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(FormControlLabel, { control: _jsx(Switch, { checked: companyInfo.isPartOfMultinationalGroup, onChange: handleChange('isPartOfMultinationalGroup'), color: "secondary" }), label: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [t('transferPricing.isPartOfMultinationalGroup'), _jsx(Tooltip, { title: t('transferPricing.multinationalGroupTooltip'), children: _jsx(IconButton, { size: "small", children: _jsx(InfoIcon, { fontSize: "small" }) }) })] }) }) }), companyInfo.isPartOfMultinationalGroup && (_jsxs(_Fragment, { children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, type: "number", label: t('transferPricing.consolidatedRevenue'), value: companyInfo.consolidatedRevenue || '', onChange: handleNumberChange('consolidatedRevenue'), variant: "outlined", sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } }, InputProps: {
                                                            startAdornment: _jsx(InputAdornment, { position: "start", children: "AED" }),
                                                            endAdornment: (_jsx(InputAdornment, { position: "end", children: _jsx(Tooltip, { title: t('transferPricing.consolidatedRevenueTooltip'), children: _jsx(IconButton, { size: "small", children: _jsx(InfoIcon, { fontSize: "small" }) }) }) })),
                                                        } }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, type: "number", label: t('transferPricing.consolidatedAssets'), value: companyInfo.consolidatedAssets || '', onChange: handleNumberChange('consolidatedAssets'), variant: "outlined", sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } }, InputProps: {
                                                            startAdornment: _jsx(InputAdornment, { position: "start", children: "AED" }),
                                                            endAdornment: (_jsx(InputAdornment, { position: "end", children: _jsx(Tooltip, { title: t('transferPricing.consolidatedAssetsTooltip'), children: _jsx(IconButton, { size: "small", children: _jsx(InfoIcon, { fontSize: "small" }) }) }) })),
                                                        } }) })] }))] })] }) })] })] }));
};
