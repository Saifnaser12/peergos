import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Button, Alert, Snackbar, Select, MenuItem, FormControl, InputLabel, IconButton, Tooltip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ArrowDownTrayIcon, DocumentPlusIcon, ChartBarIcon, DocumentTextIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useSettings } from '../context/SettingsContext';
import { exportToZIP } from '../utils/fileUtils';
const TransferPricing = () => {
    const { t } = useTranslation();
    const { formatCurrency } = useSettings();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [selectedYear, setSelectedYear] = useState('2024');
    // Sample data - replace with actual data from API
    const [documents] = useState([
        {
            id: '1',
            name: 'Master File 2024',
            type: 'masterfile',
            status: 'draft',
            dueDate: '2024-12-31',
            lastUpdated: '2024-03-15',
        },
        {
            id: '2',
            name: 'Local File 2024',
            type: 'localfile',
            status: 'submitted',
            dueDate: '2024-12-31',
            lastUpdated: '2024-03-10',
        },
        {
            id: '3',
            name: 'CbCR 2024',
            type: 'cbcr',
            status: 'approved',
            dueDate: '2024-12-31',
            lastUpdated: '2024-02-28',
        },
    ]);
    const [transactions] = useState([
        {
            id: '1',
            relatedParty: 'Parent Company Ltd',
            transactionType: 'Management Services',
            amount: 500000,
            method: 'Cost Plus',
            status: 'compliant',
        },
        {
            id: '2',
            relatedParty: 'Subsidiary A',
            transactionType: 'Intra-group Sales',
            amount: 2000000,
            method: 'Resale Price',
            status: 'compliant',
        },
        {
            id: '3',
            relatedParty: 'Subsidiary B',
            transactionType: 'Royalty Payments',
            amount: 300000,
            method: 'Profit Split',
            status: 'pending',
        },
    ]);
    const handleExport = async () => {
        try {
            // Export documentation
            const files = documents.map(doc => ({
                name: `${doc.name}.pdf`,
                content: JSON.stringify(doc)
            }));
            await exportToZIP(files);
            setSuccess(t('transferPricing.export.success', 'Transfer pricing documentation exported successfully'));
        }
        catch (err) {
            setError(t('transferPricing.export.error', 'Error exporting transfer pricing documentation'));
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'draft':
                return 'text-gray-600 dark:text-gray-400';
            case 'submitted':
                return 'text-blue-600 dark:text-blue-400';
            case 'approved':
                return 'text-green-600 dark:text-green-400';
            case 'rejected':
                return 'text-red-600 dark:text-red-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };
    const getTransactionStatusColor = (status) => {
        switch (status) {
            case 'compliant':
                return 'text-green-600 dark:text-green-400';
            case 'non-compliant':
                return 'text-red-600 dark:text-red-400';
            case 'pending':
                return 'text-yellow-600 dark:text-yellow-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };
    return (_jsxs(Box, { children: [_jsxs(Paper, { elevation: 0, className: "p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm", children: [_jsxs(Box, { className: "flex justify-between items-center mb-6", children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "h4", className: "text-gray-900 dark:text-white mb-2", children: t('transferPricing.title') }), _jsx(Typography, { variant: "body1", className: "text-gray-600 dark:text-gray-400", children: t('transferPricing.subtitle') })] }), _jsxs(Box, { className: "flex gap-4", children: [_jsxs(FormControl, { size: "small", children: [_jsx(InputLabel, { children: t('transferPricing.year', 'Year') }), _jsxs(Select, { value: selectedYear, onChange: (e) => setSelectedYear(e.target.value), label: t('transferPricing.year', 'Year'), className: "min-w-[120px]", children: [_jsx(MenuItem, { value: "2024", children: "2024" }), _jsx(MenuItem, { value: "2023", children: "2023" }), _jsx(MenuItem, { value: "2022", children: "2022" })] })] }), _jsx(Button, { variant: "outlined", startIcon: _jsx(ArrowDownTrayIcon, { className: "h-5 w-5" }), onClick: handleExport, className: "border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-900/50", children: t('transferPricing.export.button', 'Export Documentation') })] })] }), _jsxs(Grid, { container: true, spacing: 3, className: "mb-6", children: [_jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { className: "bg-gray-50 dark:bg-gray-700", children: _jsxs(CardContent, { children: [_jsxs(Box, { className: "flex justify-between items-start", children: [_jsx(Typography, { variant: "h6", className: "text-gray-900 dark:text-white mb-2", children: t('transferPricing.documentation.masterFile', 'Master File') }), _jsx(Tooltip, { title: t('transferPricing.documentation.masterFileTooltip', 'Global documentation of transfer pricing policies'), children: _jsx(IconButton, { size: "small", children: _jsx(InformationCircleIcon, { className: "h-4 w-4 text-gray-500" }) }) })] }), _jsx(Typography, { variant: "h4", className: getStatusColor(documents[0].status), children: t(`transferPricing.status.${documents[0].status}`) }), _jsxs(Typography, { variant: "body2", className: "text-gray-600 dark:text-gray-400 mt-2", children: [t('transferPricing.documentation.dueDate', 'Due Date'), ": ", documents[0].dueDate] })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { className: "bg-gray-50 dark:bg-gray-700", children: _jsxs(CardContent, { children: [_jsxs(Box, { className: "flex justify-between items-start", children: [_jsx(Typography, { variant: "h6", className: "text-gray-900 dark:text-white mb-2", children: t('transferPricing.documentation.localFile', 'Local File') }), _jsx(Tooltip, { title: t('transferPricing.documentation.localFileTooltip', 'Country-specific transfer pricing documentation'), children: _jsx(IconButton, { size: "small", children: _jsx(InformationCircleIcon, { className: "h-4 w-4 text-gray-500" }) }) })] }), _jsx(Typography, { variant: "h4", className: getStatusColor(documents[1].status), children: t(`transferPricing.status.${documents[1].status}`) }), _jsxs(Typography, { variant: "body2", className: "text-gray-600 dark:text-gray-400 mt-2", children: [t('transferPricing.documentation.dueDate', 'Due Date'), ": ", documents[1].dueDate] })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { className: "bg-gray-50 dark:bg-gray-700", children: _jsxs(CardContent, { children: [_jsxs(Box, { className: "flex justify-between items-start", children: [_jsx(Typography, { variant: "h6", className: "text-gray-900 dark:text-white mb-2", children: t('transferPricing.documentation.cbcr', 'CbCR') }), _jsx(Tooltip, { title: t('transferPricing.documentation.cbcrTooltip', 'Country-by-Country Reporting'), children: _jsx(IconButton, { size: "small", children: _jsx(InformationCircleIcon, { className: "h-4 w-4 text-gray-500" }) }) })] }), _jsx(Typography, { variant: "h4", className: getStatusColor(documents[2].status), children: t(`transferPricing.status.${documents[2].status}`) }), _jsxs(Typography, { variant: "body2", className: "text-gray-600 dark:text-gray-400 mt-2", children: [t('transferPricing.documentation.dueDate', 'Due Date'), ": ", documents[2].dueDate] })] }) }) })] }), _jsxs(Box, { className: "mb-6", children: [_jsx(Typography, { variant: "h5", className: "text-gray-900 dark:text-white mb-4", children: t('transferPricing.transactions.title', 'Related Party Transactions') }), _jsx(TableContainer, { component: Paper, className: "bg-white dark:bg-gray-800", children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: t('transferPricing.transactions.relatedParty', 'Related Party') }), _jsx(TableCell, { children: t('transferPricing.transactions.type', 'Transaction Type') }), _jsx(TableCell, { align: "right", children: t('transferPricing.transactions.amount', 'Amount') }), _jsx(TableCell, { children: t('transferPricing.transactions.method', 'Transfer Pricing Method') }), _jsx(TableCell, { children: t('transferPricing.transactions.status', 'Status') })] }) }), _jsx(TableBody, { children: transactions.map((transaction) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: transaction.relatedParty }), _jsx(TableCell, { children: transaction.transactionType }), _jsx(TableCell, { align: "right", children: formatCurrency(transaction.amount) }), _jsx(TableCell, { children: transaction.method }), _jsx(TableCell, { children: _jsx(Typography, { className: getTransactionStatusColor(transaction.status), children: t(`transferPricing.transactions.status.${transaction.status}`) }) })] }, transaction.id))) })] }) })] }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { children: _jsx(CardContent, { children: _jsxs(Box, { className: "flex items-center gap-4", children: [_jsx(DocumentPlusIcon, { className: "h-8 w-8 text-indigo-600 dark:text-indigo-400" }), _jsxs(Box, { children: [_jsx(Typography, { variant: "h6", className: "text-gray-900 dark:text-white", children: t('transferPricing.actions.upload', 'Upload Documentation') }), _jsx(Typography, { variant: "body2", className: "text-gray-600 dark:text-gray-400", children: t('transferPricing.actions.uploadDesc', 'Upload transfer pricing documentation') })] })] }) }) }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { children: _jsx(CardContent, { children: _jsxs(Box, { className: "flex items-center gap-4", children: [_jsx(ChartBarIcon, { className: "h-8 w-8 text-indigo-600 dark:text-indigo-400" }), _jsxs(Box, { children: [_jsx(Typography, { variant: "h6", className: "text-gray-900 dark:text-white", children: t('transferPricing.actions.analyze', 'Analyze Transactions') }), _jsx(Typography, { variant: "body2", className: "text-gray-600 dark:text-gray-400", children: t('transferPricing.actions.analyzeDesc', 'Analyze related party transactions') })] })] }) }) }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { children: _jsx(CardContent, { children: _jsxs(Box, { className: "flex items-center gap-4", children: [_jsx(DocumentTextIcon, { className: "h-8 w-8 text-indigo-600 dark:text-indigo-400" }), _jsxs(Box, { children: [_jsx(Typography, { variant: "h6", className: "text-gray-900 dark:text-white", children: t('transferPricing.actions.report', 'Generate Reports') }), _jsx(Typography, { variant: "body2", className: "text-gray-600 dark:text-gray-400", children: t('transferPricing.actions.reportDesc', 'Generate transfer pricing reports') })] })] }) }) }) })] })] }), _jsx(Snackbar, { open: !!error, autoHideDuration: 6000, onClose: () => setError(null), anchorOrigin: { vertical: 'bottom', horizontal: 'right' }, children: _jsx(Alert, { severity: "error", onClose: () => setError(null), children: error }) }), _jsx(Snackbar, { open: !!success, autoHideDuration: 6000, onClose: () => setSuccess(null), anchorOrigin: { vertical: 'bottom', horizontal: 'right' }, children: _jsx(Alert, { severity: "success", onClose: () => setSuccess(null), children: success }) })] }));
};
export default TransferPricing;
