import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Typography, Paper, Grid, Button, Card, CardContent, Alert, Snackbar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ArrowUpTrayIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useSettings } from '../context/SettingsContext';
import { processExcelFile, processPDFFile, exportToPDF, exportToZIP, validateFile } from '../utils/fileUtils';
const VAT = () => {
    const { t } = useTranslation();
    const { formatCurrency } = useSettings();
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [returns, setReturns] = useState([
        {
            period: '2024-Q1',
            status: 'draft',
            taxableSales: 1000000,
            taxablePurchases: 800000,
            vatPayable: 10000
        }
    ]);
    const handleFileUpload = async (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (!validateFile(file, ['xlsx', 'xls', 'pdf'])) {
                setError(t('vat.upload.error.invalidType', 'Invalid file type. Please upload Excel or PDF files.'));
                return;
            }
            setSelectedFile(file);
            try {
                const fileType = file.name.split('.').pop()?.toLowerCase();
                const result = fileType === 'pdf'
                    ? await processPDFFile(file)
                    : await processExcelFile(file);
                if (result.success) {
                    setSuccess(t('vat.upload.success', 'File processed successfully'));
                    // TODO: Update returns with processed data
                }
                else {
                    setError(t('vat.upload.error.processing', 'Error processing file'));
                }
            }
            catch (err) {
                setError(t('vat.upload.error.general', 'Error uploading file'));
            }
        }
    };
    const handleExport = async () => {
        try {
            // Export individual PDFs
            const pdfPromises = returns.map(return_ => exportToPDF(return_, `vat-return-${return_.period}`));
            await Promise.all(pdfPromises);
            // Create ZIP with all PDFs
            const files = returns.map(return_ => ({
                name: `vat-return-${return_.period}.pdf`,
                content: JSON.stringify(return_)
            }));
            await exportToZIP(files);
            setSuccess(t('vat.export.success', 'Returns exported successfully'));
        }
        catch (err) {
            setError(t('vat.export.error', 'Error exporting returns'));
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'text-green-600 dark:text-green-400';
            case 'rejected': return 'text-red-600 dark:text-red-400';
            case 'submitted': return 'text-blue-600 dark:text-blue-400';
            default: return 'text-gray-600 dark:text-gray-400';
        }
    };
    return (_jsxs(Box, { children: [_jsxs(Paper, { elevation: 0, className: "p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm", children: [_jsx(Typography, { variant: "h4", gutterBottom: true, className: "text-gray-900 dark:text-white", children: t('vat.title') }), _jsx(Typography, { variant: "subtitle1", className: "text-gray-600 dark:text-gray-400 mb-6", children: t('vat.subtitle') }), _jsx(Card, { className: "mb-6 bg-gray-50 dark:bg-gray-700", children: _jsx(CardContent, { children: _jsxs(Grid, { container: true, spacing: 3, alignItems: "center", children: [_jsxs(Grid, { item: true, xs: 12, md: 6, children: [_jsx(Typography, { variant: "h6", className: "text-gray-900 dark:text-white mb-2", children: t('vat.upload.title') }), _jsx(Typography, { variant: "body2", className: "text-gray-600 dark:text-gray-400 mb-4", children: t('vat.upload.subtitle') }), _jsxs(Button, { variant: "contained", component: "label", startIcon: _jsx(ArrowUpTrayIcon, { className: "h-5 w-5" }), className: "bg-indigo-600 hover:bg-indigo-700", children: [t('vat.upload.button'), _jsx("input", { type: "file", hidden: true, accept: ".xlsx,.xls,.pdf", onChange: handleFileUpload })] }), selectedFile && (_jsx(Typography, { variant: "body2", className: "mt-2 text-gray-600 dark:text-gray-400", children: selectedFile.name }))] }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Button, { variant: "outlined", startIcon: _jsx(ArrowDownTrayIcon, { className: "h-5 w-5" }), onClick: handleExport, className: "border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-900/50", children: t('vat.export.button') }) })] }) }) }), _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", className: "text-gray-900 dark:text-white mb-4", children: t('vat.returns.title') }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t('vat.returns.period') }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t('vat.returns.status') }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t('vat.returns.sales') }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t('vat.returns.purchases') }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t('vat.returns.payable') })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200 dark:divide-gray-700", children: returns.map((return_, index) => (_jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-700/50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white", children: return_.period }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm", children: _jsx("span", { className: `${getStatusColor(return_.status)}`, children: t(`vat.returns.status.${return_.status}`) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white", children: formatCurrency(return_.taxableSales) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white", children: formatCurrency(return_.taxablePurchases) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white", children: formatCurrency(return_.vatPayable) })] }, index))) })] }) })] }) })] }), _jsx(Snackbar, { open: !!error, autoHideDuration: 6000, onClose: () => setError(null), anchorOrigin: { vertical: 'bottom', horizontal: 'right' }, children: _jsx(Alert, { severity: "error", onClose: () => setError(null), children: error }) }), _jsx(Snackbar, { open: !!success, autoHideDuration: 6000, onClose: () => setSuccess(null), anchorOrigin: { vertical: 'bottom', horizontal: 'right' }, children: _jsx(Alert, { severity: "success", onClose: () => setSuccess(null), children: success }) })] }));
};
export default VAT;
