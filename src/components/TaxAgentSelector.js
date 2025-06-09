import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, Paper, Chip, Alert, Link, Card, CardContent, CardHeader, IconButton, Tooltip, Rating, Divider } from '@mui/material';
import { Upload as UploadIcon, CheckCircle as CheckCircleIcon, Info as InfoIcon, Person as PersonIcon, Security as CertificateIcon, Clear as ClearIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useTaxAgent, mockTaxAgents } from '../context/TaxAgentContext';
const TaxAgentSelector = ({ showTitle = true, variant = 'full' }) => {
    const { t } = useTranslation();
    const { selectedAgent, uploadedCertificate, certificateUrl, selectAgent, uploadCertificate, clearAgent } = useTaxAgent();
    const [showCertificatePreview, setShowCertificatePreview] = useState(false);
    const handleAgentSelect = (agentId) => {
        const agent = mockTaxAgents.find(a => a.id === agentId);
        if (agent) {
            selectAgent(agent);
        }
    };
    const handleFileUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                alert(t('taxAgent.upload.invalidFileType', 'Please upload a PDF or image file'));
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert(t('taxAgent.upload.fileTooLarge', 'File size must be less than 5MB'));
                return;
            }
            uploadCertificate(file);
        }
    };
    const isCompleteSelection = selectedAgent && uploadedCertificate;
    if (variant === 'compact' && isCompleteSelection) {
        return (_jsx(Alert, { severity: "success", icon: _jsx(CheckCircleIcon, {}), action: _jsx(IconButton, { size: "small", onClick: clearAgent, children: _jsx(ClearIcon, {}) }), children: _jsxs(Typography, { variant: "body2", fontWeight: "medium", children: [t('taxAgent.selected', 'FTA Approved Agent Selected'), ": ", selectedAgent.name] }) }));
    }
    return (_jsxs(Card, { sx: { mt: variant === 'full' ? 3 : 0 }, children: [showTitle && (_jsx(CardHeader, { title: t('taxAgent.title', 'Tax Agent Selection'), subheader: t('taxAgent.subtitle', 'Select an FTA-approved tax agent to assist with your submissions'), avatar: _jsx(PersonIcon, { color: "primary" }) })), _jsxs(CardContent, { children: [_jsxs(FormControl, { fullWidth: true, sx: { mb: 3 }, children: [_jsx(InputLabel, { children: t('taxAgent.selectAgent', 'Select Tax Agent') }), _jsxs(Select, { value: selectedAgent?.id || '', onChange: (e) => handleAgentSelect(e.target.value), label: t('taxAgent.selectAgent', 'Select Tax Agent'), children: [_jsx(MenuItem, { value: "", children: _jsx("em", { children: t('taxAgent.noAgent', 'No agent selected') }) }), mockTaxAgents.map((agent) => (_jsx(MenuItem, { value: agent.id, children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', width: '100%' }, children: [_jsxs(Box, { sx: { flexGrow: 1 }, children: [_jsx(Typography, { variant: "body1", fontWeight: "medium", children: agent.name }), _jsxs(Typography, { variant: "caption", color: "text.secondary", children: ["ID: ", agent.certificateId] })] }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(Rating, { size: "small", value: agent.rating, readOnly: true, precision: 0.1 }), _jsx(Typography, { variant: "caption", children: agent.rating })] })] }) }, agent.id)))] })] }), selectedAgent && (_jsxs(Paper, { sx: { p: 2, mb: 3, bgcolor: 'primary.50' }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }, children: [_jsxs(Box, { sx: { flexGrow: 1 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: selectedAgent.name }), _jsxs(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: ["Certificate ID: ", selectedAgent.certificateId] }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1, mb: 1 }, children: [_jsx(Rating, { size: "small", value: selectedAgent.rating, readOnly: true, precision: 0.1 }), _jsxs(Typography, { variant: "body2", children: [selectedAgent.rating, " / 5.0"] })] })] }), _jsx(Chip, { label: t('taxAgent.ftaApproved', 'FTA Approved'), color: "success", size: "small", icon: _jsx(CheckCircleIcon, {}) })] }), _jsxs(Box, { sx: { mb: 2 }, children: [_jsxs(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: [t('taxAgent.specializations', 'Specializations'), ":"] }), _jsx(Box, { sx: { display: 'flex', gap: 0.5, flexWrap: 'wrap' }, children: selectedAgent.specialization.map((spec, index) => (_jsx(Chip, { label: spec, size: "small", variant: "outlined" }, index))) })] }), _jsxs(Link, { href: selectedAgent.ftaProfileUrl, target: "_blank", rel: "noopener noreferrer", sx: { fontSize: '0.875rem' }, children: [t('taxAgent.viewProfile', 'View FTA Profile'), " \u2192"] })] })), selectedAgent && (_jsxs(_Fragment, { children: [_jsx(Divider, { sx: { my: 2 } }), _jsxs(Typography, { variant: "subtitle1", gutterBottom: true, sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(CertificateIcon, {}), t('taxAgent.uploadCertificate', 'Upload Tax Agent Certificate')] }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 2 }, children: t('taxAgent.uploadDescription', 'Upload the official certificate or authorization document') }), _jsx("input", { accept: ".pdf,.jpg,.jpeg,.png", style: { display: 'none' }, id: "certificate-upload", type: "file", onChange: handleFileUpload }), _jsx("label", { htmlFor: "certificate-upload", children: _jsx(Button, { variant: "outlined", component: "span", startIcon: _jsx(UploadIcon, {}), fullWidth: true, sx: { mb: 2 }, children: uploadedCertificate
                                        ? t('taxAgent.replaceCertificate', 'Replace Certificate')
                                        : t('taxAgent.uploadCertificate', 'Upload Certificate') }) }), uploadedCertificate && (_jsx(Paper, { sx: { p: 2, bgcolor: 'success.50' }, children: _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "body2", fontWeight: "medium", children: uploadedCertificate.name }), _jsxs(Typography, { variant: "caption", color: "text.secondary", children: [(uploadedCertificate.size / 1024).toFixed(1), " KB"] })] }), _jsx(Box, { children: _jsx(Tooltip, { title: t('taxAgent.viewCertificate', 'View Certificate'), children: _jsx(IconButton, { size: "small", onClick: () => setShowCertificatePreview(true), children: _jsx(VisibilityIcon, {}) }) }) })] }) }))] })), isCompleteSelection && (_jsxs(Alert, { severity: "success", sx: { mt: 3 }, icon: _jsx(CheckCircleIcon, {}), children: [_jsx(Typography, { variant: "body2", fontWeight: "medium", children: t('taxAgent.selectionComplete', 'Tax agent selection completed successfully!') }), _jsx(Typography, { variant: "caption", children: t('taxAgent.selectionCompleteDesc', 'Your selected agent can now assist with tax submissions and compliance.') })] })), _jsx(Alert, { severity: "info", sx: { mt: 2 }, icon: _jsx(InfoIcon, {}), children: _jsx(Typography, { variant: "body2", children: t('taxAgent.info', 'All listed agents are pre-approved by the FTA and authorized to represent taxpayers in the UAE.') }) }), showCertificatePreview && certificateUrl && (_jsx(Box, { sx: {
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: 'rgba(0,0,0,0.8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 9999
                        }, onClick: () => setShowCertificatePreview(false), children: _jsx(Box, { sx: { maxWidth: '90%', maxHeight: '90%', bgcolor: 'white', p: 2, borderRadius: 1 }, children: uploadedCertificate?.type.startsWith('image/') ? (_jsx("img", { src: certificateUrl, alt: "Certificate Preview", style: { maxWidth: '100%', maxHeight: '100%' } })) : (_jsx("iframe", { src: certificateUrl, style: { width: '800px', height: '600px' }, title: "Certificate Preview" })) }) }))] })] }));
};
export default TaxAgentSelector;
