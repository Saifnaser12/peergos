import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, TextField, MenuItem, Button, Typography, IconButton, Tooltip, Paper, CircularProgress, Alert, } from '@mui/material';
import { useTranslation } from 'react-i18next';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useTransferPricing } from '../../hooks/useTransferPricing';
const FileUpload = ({ label, tooltip, onChange, accept = '.pdf,.doc,.docx' }) => {
    const { t } = useTranslation();
    const [fileName, setFileName] = useState('');
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            onChange(file);
        }
    };
    return (_jsxs(Box, { sx: { mb: 2 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 1 }, children: [_jsx(Typography, { variant: "body2", children: label }), _jsx(Tooltip, { title: tooltip, children: _jsx(IconButton, { size: "small", children: _jsx(HelpOutlineIcon, { fontSize: "small" }) }) })] }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsxs(Button, { variant: "outlined", component: "label", children: [t('transferPricing.uploadFile'), _jsx("input", { type: "file", hidden: true, accept: accept, onChange: handleFileChange })] }), fileName && (_jsx(Typography, { variant: "body2", sx: { ml: 2 }, children: fileName }))] })] }));
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
    return (_jsxs(Paper, { sx: { p: 3 }, children: [error && (_jsx(Alert, { severity: "error", sx: { mb: 3 }, children: error.message })), _jsx("form", { onSubmit: handleSubmit, children: _jsxs(Box, { sx: { display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }, children: [_jsx(Box, { children: _jsx(TextField, { fullWidth: true, required: true, name: "relatedPartyName", label: t('transferPricing.relatedPartyName'), value: formData.relatedPartyName, onChange: handleInputChange, disabled: loading }) }), _jsx(Box, { children: _jsx(TextField, { fullWidth: true, required: true, name: "jurisdiction", label: t('transferPricing.jurisdiction'), value: formData.jurisdiction, onChange: handleInputChange, disabled: loading }) }), _jsx(Box, { children: _jsx(TextField, { fullWidth: true, required: true, select: true, name: "transactionType", label: t('transferPricing.transactionType'), value: formData.transactionType, onChange: handleInputChange, disabled: loading, children: Object.entries(TransactionType).map(([key, value]) => (_jsx(MenuItem, { value: value, children: t(`transferPricing.transactionTypes.${key}`) }, key))) }) }), _jsx(Box, { children: _jsx(TextField, { fullWidth: true, required: true, select: true, name: "pricingMethod", label: t('transferPricing.pricingMethod'), value: formData.pricingMethod, onChange: handleInputChange, disabled: loading, children: Object.entries(TransferPricingMethod).map(([key, value]) => (_jsx(MenuItem, { value: value, children: t(`transferPricing.pricingMethods.${key}`) }, key))) }) }), _jsx(Box, { children: _jsx(TextField, { fullWidth: true, required: true, type: "number", name: "transactionValue", label: t('transferPricing.transactionValue'), value: formData.transactionValue, onChange: handleInputChange, disabled: loading, InputProps: {
                                    startAdornment: _jsx(Typography, { variant: "body2", children: "AED" }),
                                } }) }), _jsx(Box, { sx: { gridColumn: '1 / -1' }, children: _jsx(TextField, { fullWidth: true, multiline: true, rows: 4, name: "notes", label: t('transferPricing.notes'), value: formData.notes, onChange: handleInputChange, disabled: loading }) }), _jsxs(Box, { sx: { gridColumn: '1 / -1' }, children: [_jsx(FileUpload, { label: t('transferPricing.masterFile'), tooltip: t('transferPricing.masterFileTooltip'), onChange: handleFileUpload('masterFile') }), _jsx(FileUpload, { label: t('transferPricing.localFile'), tooltip: t('transferPricing.localFileTooltip'), onChange: handleFileUpload('localFile') }), _jsx(FileUpload, { label: t('transferPricing.cbcReport'), tooltip: t('transferPricing.cbcReportTooltip'), onChange: handleFileUpload('cbcReport') })] }), _jsx(Box, { sx: { gridColumn: '1 / -1' }, children: _jsx(Button, { type: "submit", variant: "contained", color: "primary", disabled: loading, startIcon: loading && _jsx(CircularProgress, { size: 20 }), children: t('transferPricing.submit') }) })] }) })] }));
};
