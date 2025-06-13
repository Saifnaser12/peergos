import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, TextField, MenuItem, Button, Typography, IconButton, Tooltip, Paper, CircularProgress, Alert, LinearProgress, Chip, } from '@mui/material';
import { Delete as DeleteIcon, CloudUpload as UploadIcon, CheckCircle as CheckIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useTransferPricing } from '../../hooks/useTransferPricing';
const UAE_JURISDICTIONS = [
    'United Arab Emirates',
    'Saudi Arabia',
    'Qatar',
    'Kuwait',
    'Bahrain',
    'Oman',
    'United States',
    'United Kingdom',
    'Germany',
    'France',
    'Netherlands',
    'Singapore',
    'Hong Kong',
    'India',
    'China',
    'Other'
];
const PRICING_METHODS = [
    { value: 'COMPARABLE_UNCONTROLLED_PRICE', label: 'Comparable Uncontrolled Price (CUP)' },
    { value: 'RESALE_PRICE', label: 'Resale Price Method' },
    { value: 'COST_PLUS', label: 'Cost Plus Method' },
    { value: 'TRANSACTIONAL_NET_MARGIN', label: 'Transactional Net Margin Method (TNMM)' },
    { value: 'PROFIT_SPLIT', label: 'Profit Split Method' },
    { value: 'OTHER', label: 'Other Method' }
];
const FileUpload = ({ label, tooltip, onChange, accept = '.pdf', required = false }) => {
    const { t } = useTranslation();
    const [fileName, setFileName] = useState('');
    const [fileSize, setFileSize] = useState('');
    const [error, setError] = useState('');
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        setError('');
        if (file) {
            // Check file type (PDF only)
            if (!file.type.includes('pdf')) {
                setError('Only PDF files are allowed');
                return;
            }
            // Check file size (max 20MB)
            const maxSize = 20 * 1024 * 1024; // 20MB in bytes
            if (file.size > maxSize) {
                setError('File size must be less than 20MB');
                return;
            }
            setFileName(file.name);
            setFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');
            onChange(file);
        }
    };
    const handleRemove = () => {
        setFileName('');
        setFileSize('');
        onChange(undefined);
    };
    return (_jsxs(Box, { sx: { mb: 2 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 1 }, children: [_jsxs(Typography, { variant: "body2", sx: { fontWeight: required ? 'bold' : 'normal' }, children: [label, " ", required && _jsx("span", { style: { color: 'red' }, children: "*" })] }), _jsx(Tooltip, { title: tooltip, children: _jsx(IconButton, { size: "small", children: _jsx(HelpOutlineIcon, { fontSize: "small" }) }) })] }), !fileName ? (_jsxs(Button, { variant: "outlined", component: "label", startIcon: _jsx(UploadIcon, {}), sx: { mb: 1 }, children: ["Upload PDF (Max 20MB)", _jsx("input", { type: "file", hidden: true, accept: accept, onChange: handleFileChange })] })) : (_jsxs(Box, { sx: {
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    backgroundColor: '#f5f5f5',
                    mb: 1
                }, children: [_jsx(CheckIcon, { color: "success", sx: { mr: 1 } }), _jsxs(Box, { sx: { flexGrow: 1 }, children: [_jsx(Typography, { variant: "body2", sx: { fontWeight: 'bold' }, children: fileName }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: fileSize })] }), _jsx(IconButton, { size: "small", onClick: handleRemove, color: "error", children: _jsx(DeleteIcon, {}) })] })), error && (_jsx(Alert, { severity: "error", sx: { mt: 1 }, children: error })), _jsx(Typography, { variant: "caption", color: "text.secondary", children: "PDF format only, maximum 20MB" })] }));
};
const ProgressTracker = ({ relatedPartiesCount, filesUploaded }) => {
    const totalFiles = Object.values(filesUploaded).filter(Boolean).length;
    const progress = relatedPartiesCount > 0 ?
        ((relatedPartiesCount > 0 ? 50 : 0) + (totalFiles * 16.67)) : 0; // 50% for having parties, ~17% per file
    return (_jsxs(Paper, { sx: { p: 3, mb: 3, backgroundColor: '#f8f9fa' }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "\uD83E\uDDFE Transfer Pricing Readiness" }), _jsx(Box, { sx: { width: '100%', mb: 2 }, children: _jsx(LinearProgress, { variant: "determinate", value: Math.min(progress, 100), sx: { height: 8, borderRadius: 4 } }) }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs(Typography, { variant: "body2", children: [totalFiles === 3 ? '✅' : '📋', " ", totalFiles, " of 3 documents uploaded \u2022 ", Math.round(progress), "% Complete"] }), _jsx(Chip, { label: progress === 100 ? 'Complete' : 'In Progress', color: progress === 100 ? 'success' : 'warning', size: "small" })] })] }));
};
export const TransferPricingForm = () => {
    const { t } = useTranslation();
    const { loading, error, createDisclosure, uploadFile, } = useTransferPricing();
    const [formData, setFormData] = useState({
        relatedPartyName: '',
        jurisdiction: '',
        transactionType: '',
        pricingMethod: '',
        transactionValue: '',
        notes: '',
    });
    const [files, setFiles] = useState({});
    const [relatedParties, setRelatedParties] = useState([]);
    const filesUploaded = {
        masterFile: !!files.masterFile,
        localFile: !!files.localFile,
        cbcReport: !!files.cbcReport
    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleFileUpload = (field) => (file) => {
        setFiles((prev) => ({
            ...prev,
            [field]: file,
        }));
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Create the disclosure first
            const transaction = {
                relatedPartyName: formData.relatedPartyName,
                jurisdiction: formData.jurisdiction,
                transactionType: formData.transactionType,
                pricingMethod: formData.pricingMethod,
                transactionValue: Number(formData.transactionValue),
                notes: formData.notes,
            };
            const disclosure = await createDisclosure({
                taxYear: new Date().getFullYear(),
                transactions: [transaction],
            });
            // Upload files if they exist
            if (files.masterFile) {
                await uploadFile(disclosure.id, 'masterFile', files.masterFile);
            }
            if (files.localFile) {
                await uploadFile(disclosure.id, 'localFile', files.localFile);
            }
            if (files.cbcReport) {
                await uploadFile(disclosure.id, 'cbcReport', files.cbcReport);
            }
            // Reset form
            setFormData({
                relatedPartyName: '',
                jurisdiction: '',
                transactionType: '',
                pricingMethod: '',
                transactionValue: '',
                notes: '',
            });
            setFiles({});
        }
        catch (error) {
            console.error('Error submitting form:', error);
        }
    };
    return (_jsxs(Box, { children: [_jsx(ProgressTracker, { relatedPartiesCount: relatedParties.length, filesUploaded: filesUploaded }), _jsxs(Paper, { sx: { p: 3 }, children: [error && (_jsx(Alert, { severity: "error", sx: { mb: 3 }, children: error.message })), _jsx("form", { onSubmit: handleSubmit, children: _jsxs(Box, { sx: { display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }, children: [_jsx(Box, { children: _jsx(TextField, { fullWidth: true, required: true, name: "relatedPartyName", label: t('transferPricing.relatedPartyName'), value: formData.relatedPartyName, onChange: handleInputChange, disabled: loading }) }), _jsx(Box, { children: _jsx(TextField, { fullWidth: true, required: true, select: true, name: "jurisdiction", label: "Jurisdiction", value: formData.jurisdiction, onChange: handleInputChange, disabled: loading, children: UAE_JURISDICTIONS.map((jurisdiction) => (_jsx(MenuItem, { value: jurisdiction, children: jurisdiction }, jurisdiction))) }) }), _jsx(Box, { children: _jsxs(TextField, { fullWidth: true, required: true, select: true, name: "transactionType", label: "Transaction Type", value: formData.transactionType, onChange: handleInputChange, disabled: loading, children: [_jsx(MenuItem, { value: "SALE_OF_GOODS", children: "Sale of Goods" }), _jsx(MenuItem, { value: "PROVISION_OF_SERVICES", children: "Provision of Services" }), _jsx(MenuItem, { value: "FINANCING_LOANS", children: "Financing/Loans" }), _jsx(MenuItem, { value: "IP_LICENSING", children: "IP Licensing" }), _jsx(MenuItem, { value: "COST_SHARING", children: "Cost Sharing" }), _jsx(MenuItem, { value: "MANAGEMENT_FEES", children: "Management Fees" }), _jsx(MenuItem, { value: "ROYALTIES", children: "Royalties" }), _jsx(MenuItem, { value: "OTHER", children: "Other" })] }) }), _jsx(Box, { children: _jsx(TextField, { fullWidth: true, required: true, select: true, name: "pricingMethod", label: "Transfer Pricing Method", value: formData.pricingMethod, onChange: handleInputChange, disabled: loading, children: PRICING_METHODS.map((method) => (_jsx(MenuItem, { value: method.value, children: method.label }, method.value))) }) }), _jsx(Box, { children: _jsx(TextField, { fullWidth: true, required: true, type: "number", name: "transactionValue", label: t('transferPricing.transactionValue'), value: formData.transactionValue, onChange: handleInputChange, disabled: loading, InputProps: {
                                            startAdornment: _jsx(Typography, { variant: "body2", children: "AED" }),
                                        } }) }), _jsx(Box, { sx: { gridColumn: '1 / -1' }, children: _jsx(TextField, { fullWidth: true, multiline: true, rows: 4, name: "notes", label: t('transferPricing.notes'), value: formData.notes, onChange: handleInputChange, disabled: loading }) }), _jsxs(Box, { sx: { gridColumn: '1 / -1' }, children: [_jsx(Typography, { variant: "h6", sx: { mb: 2, mt: 3 }, children: "\uD83D\uDCCE Supporting Documents" }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 3 }, children: "Upload required transfer pricing documentation as per UAE FTA guidelines" }), _jsx(FileUpload, { label: "\uD83D\uDCC4 Master File", tooltip: "Group structure documentation for multinational enterprises", onChange: handleFileUpload('masterFile'), required: true }), _jsx(FileUpload, { label: "\uD83D\uDCC4 Local File", tooltip: "UAE-specific transfer pricing information and local entity details", onChange: handleFileUpload('localFile'), required: true }), _jsx(FileUpload, { label: "\uD83D\uDCC4 CbC Report", tooltip: "Country-by-Country Reporting (required for groups with consolidated revenue > AED 3.15B)", onChange: handleFileUpload('cbcReport'), required: false })] }), _jsx(Box, { sx: { gridColumn: '1 / -1' }, children: _jsx(Button, { type: "submit", variant: "contained", color: "primary", disabled: loading, startIcon: loading && _jsx(CircularProgress, { size: 20 }), children: t('transferPricing.submit') }) })] }) })] }), _jsxs(Paper, { sx: { p: 3, mt: 3, backgroundColor: '#f8f9fa' }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "\uD83D\uDCAC UAE Transfer Pricing Guidelines" }), _jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', gap: 2 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'start', gap: 2 }, children: [_jsx(Typography, { variant: "body2", sx: { fontWeight: 'bold', color: 'primary.main' }, children: "\u2139\uFE0F Master File:" }), _jsx(Typography, { variant: "body2", children: "Required for UAE entities that are part of multinational groups. Must include organizational structure, business description, and financial activities." })] }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'start', gap: 2 }, children: [_jsx(Typography, { variant: "body2", sx: { fontWeight: 'bold', color: 'primary.main' }, children: "\u2139\uFE0F Local File:" }), _jsx(Typography, { variant: "body2", children: "UAE-specific documentation covering local entity information, controlled transactions, and financial data." })] }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'start', gap: 2 }, children: [_jsx(Typography, { variant: "body2", sx: { fontWeight: 'bold', color: 'primary.main' }, children: "\u2139\uFE0F CbC Report:" }), _jsx(Typography, { variant: "body2", children: "Required for ultimate parent entities of multinational groups with consolidated group revenue exceeding AED 3.15 billion." })] }), _jsx(Alert, { severity: "info", sx: { mt: 2 }, children: _jsxs(Typography, { variant: "body2", children: [_jsx("strong", { children: "FTA Reminder:" }), " All transfer pricing documentation must demonstrate arm's length pricing for related party transactions and comply with OECD guidelines."] }) })] })] })] }));
};
