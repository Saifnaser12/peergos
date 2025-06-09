import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, TextField, Button, Card, CardContent, Typography, Alert, Chip, CircularProgress, InputAdornment, Divider, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Search as SearchIcon, Business as BusinessIcon, LocationOn as LocationOnIcon, CalendarToday as CalendarIcon, Assessment as AssessmentIcon, CheckCircle as CheckCircleIcon, Warning as WarningIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { ftaService } from '../services/ftaService';
const TRNLookup = ({ onTRNFound, autoFill = false, variant = 'standalone' }) => {
    const { t } = useTranslation();
    const [trn, setTrn] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const handleTRNChange = useCallback((event) => {
        const value = event.target.value.replace(/\D/g, ''); // Only digits
        if (value.length <= 15) {
            setTrn(value);
            setError(null);
            if (result)
                setResult(null); // Clear previous result
        }
    }, [result]);
    const handleLookup = async () => {
        if (!trn || trn.length !== 15) {
            setError(t('trn.lookup.invalidFormat'));
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const lookupResult = await ftaService.lookupTRN(trn);
            if (lookupResult) {
                setResult(lookupResult);
                if (onTRNFound) {
                    onTRNFound(lookupResult);
                }
            }
            else {
                setError(t('trn.lookup.notFound'));
                setResult(null);
            }
        }
        catch (err) {
            setError(err.message || t('trn.lookup.error'));
            setResult(null);
        }
        finally {
            setLoading(false);
        }
    };
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleLookup();
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'success';
            case 'suspended': return 'warning';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return _jsx(CheckCircleIcon, {});
            case 'suspended': return _jsx(WarningIcon, {});
            case 'cancelled': return _jsx(CancelIcon, {});
            default: return _jsx(AssessmentIcon, {});
        }
    };
    const getComplianceColor = (compliance) => {
        switch (compliance) {
            case 'compliant': return 'success';
            case 'under-review': return 'warning';
            case 'non-compliant': return 'error';
            default: return 'default';
        }
    };
    const formatTRN = (trnValue) => {
        // Format as XXX-XXXX-XXXX-XXXX for display
        if (trnValue.length <= 3)
            return trnValue;
        if (trnValue.length <= 7)
            return `${trnValue.slice(0, 3)}-${trnValue.slice(3)}`;
        if (trnValue.length <= 11)
            return `${trnValue.slice(0, 3)}-${trnValue.slice(3, 7)}-${trnValue.slice(7)}`;
        return `${trnValue.slice(0, 3)}-${trnValue.slice(3, 7)}-${trnValue.slice(7, 11)}-${trnValue.slice(11)}`;
    };
    const LookupForm = (_jsxs(Box, { children: [_jsx(TextField, { fullWidth: true, label: t('trn.lookup.label'), placeholder: "100123456700003", value: formatTRN(trn), onChange: handleTRNChange, onKeyPress: handleKeyPress, error: !!error, helperText: error || t('trn.lookup.helperText'), InputProps: {
                    startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(BusinessIcon, { color: "action" }) })),
                    endAdornment: loading && (_jsx(InputAdornment, { position: "end", children: _jsx(CircularProgress, { size: 20 }) }))
                }, sx: { mb: 2 } }), _jsx(Button, { variant: "contained", fullWidth: true, onClick: handleLookup, disabled: loading || trn.length !== 15, startIcon: _jsx(SearchIcon, {}), sx: { mb: 2 }, children: loading ? t('trn.lookup.searching') : t('trn.lookup.search') })] }));
    const ResultDisplay = result && (_jsx(Card, { sx: { mt: 2 }, children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }, children: [_jsx(Typography, { variant: "h6", children: result.companyName }), _jsx(Chip, { label: result.status.toUpperCase(), color: getStatusColor(result.status), size: "small", icon: getStatusIcon(result.status) })] }), _jsxs(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: ["TRN: ", formatTRN(result.trn)] }), _jsx(Divider, { sx: { my: 2 } }), _jsxs(List, { dense: true, children: [_jsxs(ListItem, { disableGutters: true, children: [_jsx(ListItemIcon, { children: _jsx(BusinessIcon, { fontSize: "small" }) }), _jsx(ListItemText, { primary: t('trn.lookup.businessType'), secondary: result.businessType })] }), _jsxs(ListItem, { disableGutters: true, children: [_jsx(ListItemIcon, { children: _jsx(LocationOnIcon, { fontSize: "small" }) }), _jsx(ListItemText, { primary: t('trn.lookup.emirate'), secondary: result.emirate })] }), _jsxs(ListItem, { disableGutters: true, children: [_jsx(ListItemIcon, { children: _jsx(CalendarIcon, { fontSize: "small" }) }), _jsx(ListItemText, { primary: t('trn.lookup.registrationDate'), secondary: new Date(result.registrationDate).toLocaleDateString() })] }), result.lastFilingDate && (_jsxs(ListItem, { disableGutters: true, children: [_jsx(ListItemIcon, { children: _jsx(AssessmentIcon, { fontSize: "small" }) }), _jsx(ListItemText, { primary: t('trn.lookup.lastFiling'), secondary: new Date(result.lastFilingDate).toLocaleDateString() })] }))] }), _jsxs(Box, { sx: { mt: 2 }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: t('trn.lookup.complianceStatus') }), _jsx(Chip, { label: result.complianceStatus.replace('-', ' ').toUpperCase(), color: getComplianceColor(result.complianceStatus), size: "small" })] }), result.complianceStatus === 'non-compliant' && (_jsx(Alert, { severity: "warning", sx: { mt: 2 }, children: t('trn.lookup.nonCompliantWarning') })), result.status === 'suspended' && (_jsx(Alert, { severity: "error", sx: { mt: 2 }, children: t('trn.lookup.suspendedWarning') }))] }) }));
    if (variant === 'embedded') {
        return (_jsxs(Box, { children: [LookupForm, ResultDisplay] }));
    }
    return (_jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: t('trn.lookup.title') }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 3 }, children: variant === 'page' ? t('trn.lookup.description') : t('trn.lookup.subtitle') }), LookupForm, ResultDisplay] }) }));
};
export default TRNLookup;
