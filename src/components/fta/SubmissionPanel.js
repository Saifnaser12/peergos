import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Paper, Typography, Button, Alert, CircularProgress, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip } from '@mui/material';
import { CloudUpload as CloudUploadIcon, CheckCircle as CheckCircleIcon, Warning as WarningIcon, Info as InfoIcon } from '@mui/icons-material';
const SubmissionPanel = ({ trn, companyName, submissionType, formData, calculations, onSubmit, disabled = false }) => {
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [submissionResult, setSubmissionResult] = useState(null);
    // Check if tax agent certificate and payment slip are uploaded
    const taxAgentUploaded = localStorage.getItem(`tax_agent_cert_${trn}`) !== null;
    const paymentSlipUploaded = localStorage.getItem(`payment_slip_${trn}`) !== null;
    const canSubmit = !disabled && trn && companyName && taxAgentUploaded && paymentSlipUploaded;
    const handleSubmit = async () => {
        if (!canSubmit)
            return;
        setIsSubmitting(true);
        try {
            await onSubmit();
            // Mock submission result
            const result = {
                referenceNumber: `FTA-${submissionType}-${Date.now()}`,
                filingPeriod: formData.taxPeriod || `${new Date().getFullYear()}-Q${Math.ceil((new Date().getMonth() + 1) / 3)}`,
                amount: submissionType === 'VAT' ? calculations.netVAT : calculations.citPayable,
                submissionDate: new Date().toISOString(),
                status: 'Submitted Successfully'
            };
            setSubmissionResult(result);
            setShowSuccessDialog(true);
        }
        catch (error) {
            console.error('Submission failed:', error);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: 'AED'
        }).format(amount);
    };
    return (_jsxs(_Fragment, { children: [_jsxs(Paper, { sx: { p: 3, mt: 3, border: '2px solid', borderColor: 'primary.main', borderRadius: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 2 }, children: [_jsx(CloudUploadIcon, { color: "primary", sx: { mr: 1 } }), _jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: t('fta.submission.title', `Submit ${submissionType} to FTA`) }), _jsx(Tooltip, { title: t('fta.simulation.tooltip', 'Simulation only – not connected to FTA'), children: _jsx(InfoIcon, { sx: { ml: 1, fontSize: 16, color: 'text.secondary' } }) })] }), _jsxs(Box, { sx: { mb: 3 }, children: [_jsx(Typography, { variant: "body2", sx: { mb: 2, fontWeight: 500 }, children: t('fta.submission.prerequisites', 'Prerequisites:') }), _jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', gap: 1 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [taxAgentUploaded ? (_jsx(CheckCircleIcon, { sx: { color: 'success.main', mr: 1, fontSize: 20 } })) : (_jsx(WarningIcon, { sx: { color: 'warning.main', mr: 1, fontSize: 20 } })), _jsx(Typography, { variant: "body2", children: t('fta.submission.taxAgentCert', 'Tax Agent Certificate') }), taxAgentUploaded && (_jsx(Chip, { label: t('common.uploaded', 'Uploaded'), size: "small", color: "success", sx: { ml: 1 } }))] }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [paymentSlipUploaded ? (_jsx(CheckCircleIcon, { sx: { color: 'success.main', mr: 1, fontSize: 20 } })) : (_jsx(WarningIcon, { sx: { color: 'warning.main', mr: 1, fontSize: 20 } })), _jsx(Typography, { variant: "body2", children: t('fta.submission.paymentSlip', 'Payment Slip / Bank Receipt') }), paymentSlipUploaded && (_jsx(Chip, { label: t('common.uploaded', 'Uploaded'), size: "small", color: "success", sx: { ml: 1 } }))] })] })] }), !canSubmit && (_jsx(Alert, { severity: "warning", sx: { mb: 2 }, children: !taxAgentUploaded || !paymentSlipUploaded
                            ? t('fta.submission.missingDocuments', 'Please upload both Tax Agent Certificate and Payment Slip before submitting.')
                            : t('fta.submission.missingInfo', 'Please complete all required information.') })), _jsxs(Box, { sx: { mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }, children: [_jsx(Typography, { variant: "body2", sx: { fontWeight: 500, mb: 1 }, children: t('fta.submission.summary', 'Submission Summary:') }), _jsxs(Typography, { variant: "body2", children: [_jsxs("strong", { children: [t('common.company'), ":"] }), " ", companyName] }), _jsxs(Typography, { variant: "body2", children: [_jsxs("strong", { children: [t('common.trn'), ":"] }), " ", trn] }), _jsxs(Typography, { variant: "body2", children: [_jsxs("strong", { children: [t('fta.submission.type'), ":"] }), " ", submissionType] }), submissionType === 'VAT' && (_jsxs(Typography, { variant: "body2", children: [_jsxs("strong", { children: [t('fta.submission.vatDue'), ":"] }), " ", formatCurrency(calculations?.netVAT || 0)] })), submissionType === 'CIT' && (_jsxs(Typography, { variant: "body2", children: [_jsxs("strong", { children: [t('fta.submission.citDue'), ":"] }), " ", formatCurrency(calculations?.citPayable || 0)] }))] }), _jsx(Button, { variant: "contained", size: "large", fullWidth: true, onClick: handleSubmit, disabled: !canSubmit || isSubmitting, startIcon: isSubmitting ? _jsx(CircularProgress, { size: 20 }) : _jsx(CloudUploadIcon, {}), sx: {
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                            }
                        }, children: isSubmitting
                            ? t('fta.submission.submitting', 'Submitting to FTA...')
                            : t('fta.submission.submit', `Submit ${submissionType} to FTA`) })] }), _jsxs(Dialog, { open: showSuccessDialog, onClose: () => setShowSuccessDialog(false), maxWidth: "sm", fullWidth: true, children: [_jsxs(DialogTitle, { sx: { textAlign: 'center', color: 'success.main' }, children: [_jsx(CheckCircleIcon, { sx: { fontSize: 48, mb: 1 } }), _jsx(Typography, { variant: "h5", sx: { fontWeight: 600 }, children: t('fta.submission.success.title', 'Submission Successful') })] }), _jsx(DialogContent, { children: submissionResult && (_jsxs(Box, { sx: { textAlign: 'center' }, children: [_jsx(Alert, { severity: "success", sx: { mb: 3 }, children: t('fta.submission.success.message', 'Your tax return has been successfully submitted to the Federal Tax Authority.') }), _jsxs(Box, { sx: { bgcolor: 'grey.50', p: 2, borderRadius: 2 }, children: [_jsxs(Typography, { variant: "body1", sx: { mb: 1 }, children: [_jsxs("strong", { children: [t('fta.submission.referenceNumber'), ":"] }), " ", submissionResult.referenceNumber] }), _jsxs(Typography, { variant: "body1", sx: { mb: 1 }, children: [_jsxs("strong", { children: [t('fta.submission.filingPeriod'), ":"] }), " ", submissionResult.filingPeriod] }), _jsxs(Typography, { variant: "body1", sx: { mb: 1 }, children: [_jsxs("strong", { children: [t('fta.submission.amount'), ":"] }), " ", formatCurrency(submissionResult.amount)] }), _jsxs(Typography, { variant: "body1", children: [_jsxs("strong", { children: [t('fta.submission.submissionDate'), ":"] }), " ", new Date(submissionResult.submissionDate).toLocaleDateString()] })] })] })) }), _jsx(DialogActions, { sx: { justifyContent: 'center', pb: 3 }, children: _jsx(Button, { onClick: () => setShowSuccessDialog(false), variant: "contained", size: "large", sx: { minWidth: 120 }, children: t('common.close', 'Close') }) })] })] }));
};
export default SubmissionPanel;
