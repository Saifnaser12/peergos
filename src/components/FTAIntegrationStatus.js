import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Chip, Typography, Card, CardContent, Tooltip } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Warning as WarningIcon, Info as InfoIcon } from '@mui/icons-material';
import { checkFTAIntegrationStatus } from '../utils/fta/utils';
const FTAIntegrationStatus = ({ trn = '100123456700003', showDetails = false, variant = 'badge' }) => {
    const { t } = useTranslation();
    const [status, setStatus] = useState({ isIntegrated: false, status: 'Pending Setup' });
    useEffect(() => {
        if (trn) {
            const integrationStatus = checkFTAIntegrationStatus(trn);
            setStatus(integrationStatus);
        }
    }, [trn]);
    const getStatusColor = () => {
        return status.isIntegrated ? 'success' : 'warning';
    };
    const getStatusIcon = () => {
        if (status.isIntegrated) {
            return _jsx(CheckCircleIcon, { sx: { fontSize: 16, mr: 0.5 } });
        }
        else {
            return _jsx(WarningIcon, { sx: { fontSize: 16, mr: 0.5 } });
        }
    };
    if (variant === 'badge') {
        return (_jsx(Tooltip, { title: t('fta.simulation.tooltip', 'Simulation only – not connected to FTA'), children: _jsx(Chip, { icon: getStatusIcon(), label: t(`fta.status.${status.status.toLowerCase().replace(' ', '_')}`, status.status), color: getStatusColor(), variant: "outlined", size: "small" }) }));
    }
    if (variant === 'card') {
        return (_jsx(Card, { sx: { border: 1, borderColor: status.isIntegrated ? 'success.main' : 'warning.main' }, children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }, children: [_jsx(Typography, { variant: "subtitle2", sx: { fontWeight: 600 }, children: t('fta.integration.title', 'FTA Connection') }), _jsx(Chip, { icon: getStatusIcon(), label: status.status, color: getStatusColor(), size: "small" })] }), showDetails && (_jsxs(Box, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 1 }, children: status.isIntegrated
                                    ? t('fta.integration.connected', 'Successfully connected to FTA systems')
                                    : t('fta.integration.pending', 'Setup required to connect to FTA') }), status.reason && (_jsx(Typography, { variant: "caption", color: "warning.main", children: status.reason })), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mt: 1 }, children: [_jsx(InfoIcon, { sx: { fontSize: 14, mr: 0.5, color: 'text.secondary' } }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: t('fta.simulation.note', 'Simulation Mode') })] })] }))] }) }));
    }
    return null;
};
export default FTAIntegrationStatus;
