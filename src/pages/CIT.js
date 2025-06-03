import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Typography, Paper, Grid, Button, Card, CardContent, Alert, Snackbar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ArrowUpTrayIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useSettings } from '../context/SettingsContext';
import { processExcelFile, processPDFFile, exportToPDF, exportToZIP, validateFile } from '../utils/fileUtils';
const CIT = () => {
    const { t } = useTranslation();
    const { formatCurrency } = useSettings();
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [returns, setReturns] = useState([
        {
            period: '2024',
            status: 'draft',
            taxableIncome: 2000000,
            taxPayable: 90000,
            taxPaid: 45000,
            balanceDue: 45000
        }
    ]);
    const handleFileUpload = async (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (!validateFile(file, ['xlsx', 'xls', 'pdf'])) {
                setError(t('cit.upload.error.invalidType', 'Invalid file type. Please upload Excel or PDF files.'));
                return;
            }
            setSelectedFile(file);
            try {
                const fileType = file.name.split('.').pop()?.toLowerCase();
                const result = fileType === 'pdf'
                    ? await processPDFFile(file)
                    : await processExcelFile(file);
                if (result.success) {
                    setSuccess(t('cit.upload.success', 'File processed successfully'));
                    // TODO: Update returns with processed data
                }
                else {
                    setError(t('cit.upload.error.processing', 'Error processing file'));
                }
            }
            catch (err) {
                setError(t('cit.upload.error.general', 'Error uploading file'));
            }
        }
    };
    const handleExport = async () => {
        try {
            // Export individual PDFs
            const pdfPromises = returns.map(return_ => exportToPDF(return_, `cit-return-${return_.period}`));
            await Promise.all(pdfPromises);
            // Create ZIP with all PDFs
            const files = returns.map(return_ => ({
                name: `cit-return-${return_.period}.pdf`,
                content: JSON.stringify(return_)
            }));
            await exportToZIP(files);
            setSuccess(t('cit.export.success', 'Returns exported successfully'));
        }
        catch (err) {
            setError(t('cit.export.error', 'Error exporting returns'));
        }
    };
    const getStatusColor = (status) => {
        const colors = {
            draft: 'text-gray-600 dark:text-gray-400',
            submitted: 'text-blue-600 dark:text-blue-400',
            approved: 'text-green-600 dark:text-green-400',
            rejected: 'text-red-600 dark:text-red-400'
        };
        return colors[status];
    };
    return (_jsxs(Box, { children: [_jsxs(Paper, { elevation: 0, className: "p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm", children: [_jsx(Typography, { variant: "h4", className: "text-gray-900 dark:text-white mb-2", children: t('cit.title') }), _jsx(Typography, { variant: "body1", className: "text-gray-600 dark:text-gray-400 mb-6", children: t('cit.subtitle') }), _jsx(Card, { className: "mb-6 bg-gray-50 dark:bg-gray-700", children: _jsx(CardContent, { children: _jsxs(Grid, { container: true, spacing: 3, alignItems: "center", children: [_jsxs(Grid, { item: true, xs: 12, md: 6, children: [_jsx(Typography, { variant: "h6", className: "text-gray-900 dark:text-white mb-2", children: t('cit.upload.title') }), _jsx(Typography, { variant: "body2", className: "text-gray-600 dark:text-gray-400 mb-4", children: t('cit.upload.subtitle') }), _jsxs(Button, { variant: "contained", component: "label", startIcon: _jsx(ArrowUpTrayIcon, { className: "h-5 w-5" }), className: "bg-indigo-600 hover:bg-indigo-700", children: [t('cit.upload.button'), _jsx("input", { type: "file", hidden: true, accept: ".xlsx,.xls,.pdf", onChange: handleFileUpload })] }), selectedFile && (_jsx(Typography, { variant: "body2", className: "mt-2 text-gray-600 dark:text-gray-400", children: selectedFile.name }))] }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Button, { variant: "outlined", startIcon: _jsx(ArrowDownTrayIcon, { className: "h-5 w-5" }), onClick: handleExport, className: "border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-900/50", children: t('cit.export.button') }) })] }) }) }), _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", className: "text-gray-900 dark:text-white mb-4", children: t('cit.returns.title') }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t('cit.returns.period') }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t('cit.returns.status') }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t('cit.returns.income') }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t('cit.returns.payable') }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t('cit.returns.paid') }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t('cit.returns.balance') })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200 dark:divide-gray-700", children: returns.map((return_, index) => (_jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-700/50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white", children: return_.period }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm", children: _jsx("span", { className: `${getStatusColor(return_.status)}`, children: t(`cit.returns.status.${return_.status}`) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white", children: formatCurrency(return_.taxableIncome) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white", children: formatCurrency(return_.taxPayable) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white", children: formatCurrency(return_.taxPaid) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white", children: formatCurrency(return_.balanceDue) })] }, index))) })] }) })] }) })] }), _jsx(Snackbar, { open: !!error, autoHideDuration: 6000, onClose: () => setError(null), anchorOrigin: { vertical: 'bottom', horizontal: 'right' }, children: _jsx(Alert, { severity: "error", onClose: () => setError(null), children: error }) }), _jsx(Snackbar, { open: !!success, autoHideDuration: 6000, onClose: () => setSuccess(null), anchorOrigin: { vertical: 'bottom', horizontal: 'right' }, children: _jsx(Alert, { severity: "success", onClose: () => setSuccess(null), children: success }) })] }));
};
export default CIT;
