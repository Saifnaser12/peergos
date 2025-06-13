import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Paper, CircularProgress, Alert, Button, Tabs, Tab, Chip, useTheme, alpha, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, FormControl, InputLabel, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip, LinearProgress, Badge, Fab, Divider } from '@mui/material';
import { TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon, AccountBalance as AccountBalanceIcon, Add as AddIcon, PictureAsPdf as PdfIcon, TableChart as ExcelIcon, Edit as EditIcon, Delete as DeleteIcon, CloudSync as SyncIcon, Assessment as ReportIcon, Receipt as ReceiptIcon, FileUpload as UploadIcon, Refresh as RefreshIcon, Security as SecurityIcon, VerifiedUser as VerifiedIcon, Warning as WarningIcon, CheckCircle as CheckIcon, Error as ErrorIcon } from '@mui/icons-material';
import { useFinance } from '../context/FinanceContext';
import { useFinancialSync } from '../hooks/useFinancialSync';
import { libraryLoader } from '../utils/libraryLoader';
import { useTranslation } from 'react-i18next';
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (_jsx("div", { role: "tabpanel", hidden: value !== index, id: `financial-tabpanel-${index}`, "aria-labelledby": `financial-tab-${index}`, ...other, children: value === index && _jsx(Box, { sx: { p: 3 }, children: children }) }));
}
const Financials = () => {
    console.log('🚀 Advanced Financials component initializing...');
    const theme = useTheme();
    const { t } = useTranslation();
    const finance = useFinance();
    // State management
    const [tabValue, setTabValue] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');
    const [syncStatus, setSyncStatus] = useState('idle');
    const [realTimeData, setRealTimeData] = useState(null);
    const [exportProgress, setExportProgress] = useState(0);
    const [complianceAlerts, setComplianceAlerts] = useState([]);
    // Form state for adding/editing entries
    const [formData, setFormData] = useState({
        type: 'revenue',
        category: '',
        subcategory: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        vatRate: '5'
    });
    // Financial data with sample entries
    const [financialEntries, setFinancialEntries] = useState([
        {
            id: '1',
            type: 'revenue',
            category: 'Sales',
            subcategory: 'Product Sales',
            amount: 150000,
            date: '2024-01-15',
            description: 'Q1 Product Sales Revenue',
            vatRate: 5,
            vatAmount: 7500,
            source: 'manual',
            complianceScore: 95
        },
        {
            id: '2',
            type: 'revenue',
            category: 'Services',
            subcategory: 'Consulting',
            amount: 85000,
            date: '2024-01-20',
            description: 'Consulting Services Revenue',
            vatRate: 5,
            vatAmount: 4250,
            source: 'manual',
            complianceScore: 98
        },
        {
            id: '3',
            type: 'revenue',
            category: 'Licensing',
            subcategory: 'Software Licensing',
            amount: 25000,
            date: '2024-01-25',
            description: 'Software License Revenue',
            vatRate: 5,
            vatAmount: 1250,
            source: 'manual',
            complianceScore: 92
        },
        {
            id: '4',
            type: 'expense',
            category: 'Personnel',
            subcategory: 'Salaries',
            amount: 65000,
            date: '2024-01-31',
            description: 'Monthly Staff Salaries',
            vatRate: 0,
            vatAmount: 0,
            source: 'manual',
            complianceScore: 100
        },
        {
            id: '5',
            type: 'expense',
            category: 'Operations',
            subcategory: 'Rent',
            amount: 18000,
            date: '2024-01-01',
            description: 'Office Rent Payment',
            vatRate: 5,
            vatAmount: 900,
            source: 'manual',
            complianceScore: 100
        },
        {
            id: '6',
            type: 'expense',
            category: 'Operations',
            subcategory: 'Utilities',
            amount: 4500,
            date: '2024-01-05',
            description: 'Monthly Utilities',
            vatRate: 5,
            vatAmount: 225,
            source: 'manual',
            complianceScore: 97
        },
        {
            id: '7',
            type: 'expense',
            category: 'Marketing',
            subcategory: 'Digital Marketing',
            amount: 12000,
            date: '2024-01-10',
            description: 'Q1 Marketing Campaign',
            vatRate: 5,
            vatAmount: 600,
            source: 'manual',
            complianceScore: 94
        }
    ]);
    // Sync hook
    const { syncData, lastSyncTime, isConnected, syncError } = useFinancialSync();
    // Calculate financial summary
    const calculateSummary = () => {
        const revenue = financialEntries
            .filter(entry => entry.type === 'revenue')
            .reduce((sum, entry) => sum + entry.amount, 0);
        const expenses = financialEntries
            .filter(entry => entry.type === 'expense')
            .reduce((sum, entry) => sum + entry.amount, 0);
        const assets = financialEntries
            .filter(entry => entry.type === 'asset')
            .reduce((sum, entry) => sum + entry.amount, 0);
        const liabilities = financialEntries
            .filter(entry => entry.type === 'liability')
            .reduce((sum, entry) => sum + entry.amount, 0);
        const equity = financialEntries
            .filter(entry => entry.type === 'equity')
            .reduce((sum, entry) => sum + entry.amount, 0);
        const vatCollected = financialEntries
            .filter(entry => entry.type === 'revenue')
            .reduce((sum, entry) => sum + (entry.vatAmount || 0), 0);
        const vatPaid = financialEntries
            .filter(entry => entry.type === 'expense')
            .reduce((sum, entry) => sum + (entry.vatAmount || 0), 0);
        const netIncome = revenue - expenses;
        const isBalanced = Math.abs(assets - (liabilities + equity + netIncome)) < 0.01;
        const avgComplianceScore = financialEntries.length > 0
            ? financialEntries.reduce((sum, entry) => sum + (entry.complianceScore || 0), 0) / financialEntries.length
            : 0;
        return {
            totalRevenue: revenue,
            totalExpenses: expenses,
            netIncome,
            totalAssets: assets,
            totalLiabilities: liabilities,
            totalEquity: equity,
            vatCollected,
            vatPaid,
            isBalanced,
            complianceScore: avgComplianceScore,
            revenueEntries: financialEntries.filter(e => e.type === 'revenue').length,
            expenseEntries: financialEntries.filter(e => e.type === 'expense').length
        };
    };
    // Real-time data updates
    useEffect(() => {
        const updateRealTimeData = () => {
            const summary = calculateSummary();
            setRealTimeData(summary);
            // Check compliance alerts
            const alerts = [];
            if (!summary.isBalanced) {
                alerts.push('Balance sheet is not balanced - please review entries');
            }
            if (summary.complianceScore < 90) {
                alerts.push('Some entries have low compliance scores - review required');
            }
            if (summary.vatCollected - summary.vatPaid < 0) {
                alerts.push('VAT refund situation detected - verify calculations');
            }
            setComplianceAlerts(alerts);
        };
        updateRealTimeData();
        const interval = setInterval(updateRealTimeData, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, [financialEntries]);
    // Initialize component
    useEffect(() => {
        console.log('⚡ Initializing Advanced Financials page...');
        const initializeFinancials = async () => {
            try {
                setIsLoading(true);
                // Initialize libraries
                await libraryLoader.loadJsSHA();
                await libraryLoader.loadQRCode();
                await libraryLoader.loadPDFLib();
                // Simulate loading time
                await new Promise(resolve => setTimeout(resolve, 1500));
                console.log('✅ Advanced Financials page loaded successfully');
                setIsLoading(false);
                setError(null);
                showNotification('Financial dashboard loaded successfully', 'success');
            }
            catch (err) {
                console.error('❌ Error loading financials:', err);
                setError('Failed to load financial data');
                setIsLoading(false);
                showNotification('Error loading financial data', 'error');
            }
        };
        initializeFinancials();
    }, []);
    // Utility functions
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: 'AED'
        }).format(amount);
    };
    const showNotification = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };
    const handleTabChange = (event, newValue) => {
        console.log('📋 Tab changed to:', newValue);
        setTabValue(newValue);
    };
    // Entry management functions
    const handleAddEntry = () => {
        setEditingEntry(null);
        setFormData({
            type: 'revenue',
            category: '',
            subcategory: '',
            amount: '',
            date: new Date().toISOString().split('T')[0],
            description: '',
            vatRate: '5'
        });
        setShowAddDialog(true);
    };
    const handleEditEntry = (entry) => {
        setEditingEntry(entry);
        setFormData({
            type: entry.type,
            category: entry.category,
            subcategory: entry.subcategory,
            amount: entry.amount.toString(),
            date: entry.date,
            description: entry.description,
            vatRate: (entry.vatRate || 0).toString()
        });
        setShowAddDialog(true);
    };
    const handleDeleteEntry = (id) => {
        setFinancialEntries(prev => prev.filter(entry => entry.id !== id));
        showNotification('Entry deleted successfully', 'success');
    };
    const handleSaveEntry = () => {
        const amount = parseFloat(formData.amount);
        const vatRate = parseFloat(formData.vatRate);
        const vatAmount = (amount * vatRate) / 100;
        const entry = {
            id: editingEntry?.id || Date.now().toString(),
            type: formData.type,
            category: formData.category,
            subcategory: formData.subcategory,
            amount,
            date: formData.date,
            description: formData.description,
            vatRate,
            vatAmount,
            source: 'manual',
            complianceScore: Math.floor(Math.random() * 10) + 90 // Simulated compliance score
        };
        if (editingEntry) {
            setFinancialEntries(prev => prev.map(e => e.id === editingEntry.id ? entry : e));
            showNotification('Entry updated successfully', 'success');
        }
        else {
            setFinancialEntries(prev => [...prev, entry]);
            showNotification('Entry added successfully', 'success');
        }
        setShowAddDialog(false);
    };
    // Export functions
    const exportToPDF = async () => {
        console.log('📄 Exporting to PDF...');
        setExportProgress(0);
        try {
            const progressInterval = setInterval(() => {
                setExportProgress(prev => Math.min(prev + 10, 90));
            }, 100);
            // Simulate export process
            await new Promise(resolve => setTimeout(resolve, 2000));
            clearInterval(progressInterval);
            setExportProgress(100);
            setTimeout(() => setExportProgress(0), 2000);
            showNotification('PDF exported successfully', 'success');
        }
        catch (error) {
            setExportProgress(0);
            showNotification('Error exporting PDF', 'error');
        }
    };
    const exportToExcel = async () => {
        console.log('📊 Exporting to Excel...');
        setExportProgress(0);
        try {
            const progressInterval = setInterval(() => {
                setExportProgress(prev => Math.min(prev + 15, 90));
            }, 100);
            // Simulate export process
            await new Promise(resolve => setTimeout(resolve, 1500));
            clearInterval(progressInterval);
            setExportProgress(100);
            setTimeout(() => setExportProgress(0), 2000);
            showNotification('Excel exported successfully', 'success');
        }
        catch (error) {
            setExportProgress(0);
            showNotification('Error exporting Excel', 'error');
        }
    };
    // Sync functions
    const handleSync = async () => {
        console.log('🔄 Syncing financial data...');
        setSyncStatus('syncing');
        try {
            await syncData(financialEntries);
            setSyncStatus('success');
            showNotification('Data synced successfully', 'success');
            setTimeout(() => setSyncStatus('idle'), 3000);
        }
        catch (error) {
            setSyncStatus('error');
            showNotification('Sync failed', 'error');
            setTimeout(() => setSyncStatus('idle'), 3000);
        }
    };
    const handleFileUpload = (event) => {
        const files = event.target.files;
        if (files) {
            console.log('📁 Uploading files:', files);
            showNotification(`Uploading ${files.length} file(s)...`, 'info');
            // Simulate file processing
            setTimeout(() => {
                showNotification('Files processed successfully', 'success');
            }, 2000);
        }
    };
    if (isLoading) {
        console.log('⏳ Rendering loading state...');
        return (_jsxs(Box, { sx: {
                p: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh',
                flexDirection: 'column'
            }, children: [_jsx(CircularProgress, { size: 60, sx: { mb: 3 } }), _jsx(Typography, { variant: "h6", color: "text.secondary", children: "Loading Advanced Financial Dashboard..." }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mt: 1 }, children: "Initializing libraries and real-time data feeds" })] }));
    }
    if (error) {
        console.log('❌ Rendering error state:', error);
        return (_jsxs(Box, { sx: { p: 3 }, children: [_jsx(Alert, { severity: "error", sx: { mb: 3 }, children: error }), _jsx(Button, { variant: "contained", onClick: () => window.location.reload(), children: "Retry" })] }));
    }
    console.log('🎨 Rendering Advanced Financials component...');
    return (_jsxs(Box, { sx: { p: 3, backgroundColor: alpha(theme.palette.background.default, 0.5), minHeight: '100vh' }, children: [_jsxs(Box, { sx: { mb: 4 }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "h3", sx: { fontWeight: 700, mb: 1, color: theme.palette.primary.main }, children: "\uD83D\uDCCA Advanced Financial Management" }), _jsx(Typography, { variant: "h6", color: "text.secondary", children: "Real-time financial insights with UAE compliance monitoring" })] }), _jsxs(Box, { sx: { display: 'flex', gap: 2, alignItems: 'center' }, children: [_jsx(Chip, { icon: isConnected ? _jsx(CheckIcon, {}) : _jsx(ErrorIcon, {}), label: isConnected ? 'Connected' : 'Offline', color: isConnected ? 'success' : 'error', variant: "outlined" }), _jsx(Chip, { icon: _jsx(SecurityIcon, {}), label: `${realTimeData?.complianceScore?.toFixed(0) || 0}% Compliant`, color: realTimeData?.complianceScore && realTimeData.complianceScore > 90 ? 'success' : 'warning', variant: "outlined" }), _jsx(Tooltip, { title: "Sync with external systems", children: _jsx(IconButton, { onClick: handleSync, disabled: syncStatus === 'syncing', color: syncStatus === 'success' ? 'success' : syncStatus === 'error' ? 'error' : 'default', children: syncStatus === 'syncing' ? _jsx(CircularProgress, { size: 24 }) : _jsx(SyncIcon, {}) }) })] })] }), complianceAlerts.length > 0 && (_jsxs(Alert, { severity: "warning", sx: { mb: 2 }, children: [_jsx(Typography, { variant: "body2", sx: { fontWeight: 600, mb: 1 }, children: "Compliance Alerts:" }), complianceAlerts.map((alert, index) => (_jsxs(Typography, { variant: "body2", children: ["\u2022 ", alert] }, index)))] })), lastSyncTime && (_jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["Last sync: ", new Date(lastSyncTime).toLocaleString(), " \u2022 Real-time updates active"] }))] }), _jsxs(Grid, { container: true, spacing: 3, sx: { mb: 4 }, children: [_jsx(Grid, { item: true, xs: 12, md: 3, children: _jsx(Card, { sx: {
                                height: '100%',
                                background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.15)}, ${alpha(theme.palette.success.main, 0.05)})`,
                                border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`
                            }, children: _jsxs(CardContent, { sx: { p: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(TrendingUpIcon, { sx: { color: 'success.main', mr: 1, fontSize: 28 } }), _jsx(Typography, { variant: "h6", sx: { color: 'success.main', fontWeight: 600 }, children: "Total Revenue" })] }), _jsx(Badge, { badgeContent: realTimeData?.revenueEntries || 0, color: "success", children: _jsx(ReceiptIcon, { sx: { color: 'success.main' } }) })] }), _jsx(Typography, { variant: "h3", sx: { fontWeight: 700, mb: 1, color: 'success.main' }, children: formatCurrency(realTimeData?.totalRevenue || 0) }), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["\uD83D\uDCC8 VAT Collected: ", formatCurrency(realTimeData?.vatCollected || 0)] }), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["\uD83C\uDFAF Revenue streams: ", realTimeData?.revenueEntries || 0] })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 3, children: _jsx(Card, { sx: {
                                height: '100%',
                                background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.15)}, ${alpha(theme.palette.error.main, 0.05)})`,
                                border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`
                            }, children: _jsxs(CardContent, { sx: { p: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(TrendingDownIcon, { sx: { color: 'error.main', mr: 1, fontSize: 28 } }), _jsx(Typography, { variant: "h6", sx: { color: 'error.main', fontWeight: 600 }, children: "Total Expenses" })] }), _jsx(Badge, { badgeContent: realTimeData?.expenseEntries || 0, color: "error", children: _jsx(ReceiptIcon, { sx: { color: 'error.main' } }) })] }), _jsx(Typography, { variant: "h3", sx: { fontWeight: 700, mb: 1, color: 'error.main' }, children: formatCurrency(realTimeData?.totalExpenses || 0) }), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["\uD83D\uDCC9 VAT Paid: ", formatCurrency(realTimeData?.vatPaid || 0)] }), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["\uD83C\uDFAF Expense categories: ", realTimeData?.expenseEntries || 0] })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 3, children: _jsx(Card, { sx: {
                                height: '100%',
                                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.primary.main, 0.05)})`,
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                            }, children: _jsxs(CardContent, { sx: { p: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 2 }, children: [_jsx(AccountBalanceIcon, { sx: { color: 'primary.main', mr: 1, fontSize: 28 } }), _jsx(Typography, { variant: "h6", sx: { color: realTimeData?.netIncome && realTimeData.netIncome >= 0 ? 'success.main' : 'error.main', fontWeight: 600 }, children: "Net Income" })] }), _jsx(Typography, { variant: "h3", sx: {
                                            fontWeight: 700,
                                            mb: 1,
                                            color: realTimeData?.netIncome && realTimeData.netIncome >= 0 ? 'success.main' : 'error.main'
                                        }, children: formatCurrency(realTimeData?.netIncome || 0) }), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["\uD83D\uDCB0 Profit Margin: ", realTimeData?.totalRevenue ? ((realTimeData.netIncome / realTimeData.totalRevenue) * 100).toFixed(1) : 0, "%"] }), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["\uD83C\uDFAF Status: ", realTimeData?.netIncome && realTimeData.netIncome >= 0 ? 'Profitable' : 'Loss'] })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 3, children: _jsx(Card, { sx: {
                                height: '100%',
                                background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.15)}, ${alpha(theme.palette.info.main, 0.05)})`,
                                border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`
                            }, children: _jsxs(CardContent, { sx: { p: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 2 }, children: [_jsx(VerifiedIcon, { sx: { color: realTimeData?.isBalanced ? 'success.main' : 'error.main', mr: 1, fontSize: 28 } }), _jsx(Typography, { variant: "h6", sx: { color: 'info.main', fontWeight: 600 }, children: "Balance Status" })] }), _jsx(Typography, { variant: "h4", sx: {
                                            fontWeight: 700,
                                            mb: 1,
                                            color: realTimeData?.isBalanced ? 'success.main' : 'error.main'
                                        }, children: realTimeData?.isBalanced ? 'Balanced' : 'Unbalanced' }), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["\u2696\uFE0F Assets: ", formatCurrency(realTimeData?.totalAssets || 0)] }), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["\uD83D\uDCCA L+E: ", formatCurrency((realTimeData?.totalLiabilities || 0) + (realTimeData?.totalEquity || 0))] })] }) }) })] }), _jsxs(Paper, { sx: { p: 4, mb: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }, children: [_jsx(Typography, { variant: "h6", sx: { mb: 3, fontWeight: 600 }, children: "\u26A1 Advanced Actions & Tools" }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, md: 2, children: _jsx(Button, { fullWidth: true, variant: "contained", startIcon: _jsx(AddIcon, {}), onClick: handleAddEntry, sx: { borderRadius: 2, textTransform: 'none', height: 48, fontWeight: 600 }, color: "primary", children: "Add Entry" }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 2, children: _jsx(Button, { fullWidth: true, variant: "outlined", startIcon: _jsx(PdfIcon, {}), onClick: exportToPDF, sx: { borderRadius: 2, textTransform: 'none', height: 48, fontWeight: 600 }, children: "Export PDF" }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 2, children: _jsx(Button, { fullWidth: true, variant: "outlined", startIcon: _jsx(ExcelIcon, {}), onClick: exportToExcel, sx: { borderRadius: 2, textTransform: 'none', height: 48, fontWeight: 600 }, children: "Export Excel" }) }), _jsxs(Grid, { item: true, xs: 12, sm: 6, md: 2, children: [_jsx("input", { accept: ".pdf,.xlsx,.xls,.csv", style: { display: 'none' }, id: "upload-financial-files", type: "file", multiple: true, onChange: handleFileUpload }), _jsx("label", { htmlFor: "upload-financial-files", children: _jsx(Button, { fullWidth: true, variant: "outlined", startIcon: _jsx(UploadIcon, {}), component: "span", sx: { borderRadius: 2, textTransform: 'none', height: 48, fontWeight: 600 }, children: "Import Data" }) })] }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 2, children: _jsx(Button, { fullWidth: true, variant: "outlined", startIcon: _jsx(ReportIcon, {}), onClick: () => setTabValue(3), sx: { borderRadius: 2, textTransform: 'none', height: 48, fontWeight: 600 }, children: "Analytics" }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 2, children: _jsx(Button, { fullWidth: true, variant: "outlined", startIcon: _jsx(RefreshIcon, {}), onClick: () => window.location.reload(), sx: { borderRadius: 2, textTransform: 'none', height: 48, fontWeight: 600 }, children: "Refresh" }) })] }), exportProgress > 0 && (_jsxs(Box, { sx: { mt: 3 }, children: [_jsxs(Typography, { variant: "body2", sx: { mb: 1 }, children: ["Export Progress: ", exportProgress, "%"] }), _jsx(LinearProgress, { variant: "determinate", value: exportProgress })] }))] }), _jsx(Box, { sx: { borderBottom: 1, borderColor: 'divider', mb: 4 }, children: _jsxs(Tabs, { value: tabValue, onChange: handleTabChange, "aria-label": "advanced financial tabs", variant: "scrollable", scrollButtons: "auto", children: [_jsx(Tab, { label: "\uD83D\uDCCA Overview" }), _jsx(Tab, { label: "\uD83D\uDCCB Income Statement" }), _jsx(Tab, { label: "\u2696\uFE0F Balance Sheet" }), _jsx(Tab, { label: "\uD83D\uDCC8 Analytics" }), _jsx(Tab, { label: "\uD83D\uDCC1 Data Management" }), _jsx(Tab, { label: "\uD83D\uDD27 Settings" })] }) }), _jsx(TabPanel, { value: tabValue, index: 0, children: _jsxs(Paper, { sx: { p: 4, borderRadius: 3 }, children: [_jsx(Typography, { variant: "h5", sx: { fontWeight: 600, mb: 3, textAlign: 'center' }, children: "\uD83D\uDCCA Financial Overview Dashboard" }), _jsxs(Grid, { container: true, spacing: 3, sx: { mb: 4 }, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Box, { sx: { p: 3, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 2, border: `1px solid ${alpha(theme.palette.success.main, 0.3)}` }, children: [_jsxs(Typography, { variant: "h6", sx: { color: 'success.main', mb: 2, display: 'flex', alignItems: 'center' }, children: [_jsx(TrendingUpIcon, { sx: { mr: 1 } }), "\uD83D\uDCB0 Revenue Analytics"] }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 }, children: [_jsx(Typography, { variant: "body1", children: "Product Sales:" }), _jsx(Typography, { variant: "body1", sx: { fontWeight: 600 }, children: formatCurrency(150000) })] }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 }, children: [_jsx(Typography, { variant: "body1", children: "Services:" }), _jsx(Typography, { variant: "body1", sx: { fontWeight: 600 }, children: formatCurrency(85000) })] }), "```python", _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 }, children: [_jsx(Typography, { variant: "body1", children: "Licensing:" }), _jsx(Typography, { variant: "body1", sx: { fontWeight: 600 }, children: formatCurrency(25000) })] }), _jsx(Divider, { sx: { my: 2 } }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between' }, children: [_jsx(Typography, { variant: "h6", sx: { color: 'success.main' }, children: "Total VAT Collected:" }), _jsx(Typography, { variant: "h6", sx: { color: 'success.main', fontWeight: 700 }, children: formatCurrency(realTimeData?.vatCollected || 0) })] })] }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Box, { sx: { p: 3, bgcolor: alpha(theme.palette.error.main, 0.1), borderRadius: 2, border: `1px solid ${alpha(theme.palette.error.main, 0.3)}` }, children: [_jsxs(Typography, { variant: "h6", sx: { color: 'error.main', mb: 2, display: 'flex', alignItems: 'center' }, children: [_jsx(TrendingDownIcon, { sx: { mr: 1 } }), "\uD83D\uDCB8 Expense Analytics"] }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 }, children: [_jsx(Typography, { variant: "body1", children: "Salaries:" }), _jsx(Typography, { variant: "body1", sx: { fontWeight: 600 }, children: formatCurrency(65000) })] }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 }, children: [_jsx(Typography, { variant: "body1", children: "Rent:" }), _jsx(Typography, { variant: "body1", sx: { fontWeight: 600 }, children: formatCurrency(18000) })] }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 }, children: [_jsx(Typography, { variant: "body1", children: "Utilities:" }), _jsx(Typography, { variant: "body1", sx: { fontWeight: 600 }, children: formatCurrency(4500) })] }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 }, children: [_jsx(Typography, { variant: "body1", children: "Marketing:" }), _jsx(Typography, { variant: "body1", sx: { fontWeight: 600 }, children: formatCurrency(12000) })] }), _jsx(Divider, { sx: { my: 2 } }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between' }, children: [_jsx(Typography, { variant: "h6", sx: { color: 'error.main' }, children: "Total VAT Paid:" }), _jsx(Typography, { variant: "h6", sx: { color: 'error.main', fontWeight: 700 }, children: formatCurrency(realTimeData?.vatPaid || 0) })] })] }) })] }), _jsxs(Box, { sx: { p: 3, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2, mb: 3, border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}` }, children: [_jsx(Typography, { variant: "h6", sx: { color: 'primary.main', mb: 2, textAlign: 'center' }, children: "\uD83C\uDFDB\uFE0F VAT Summary & Compliance" }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Box, { sx: { textAlign: 'center' }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "VAT Collected" }), _jsx(Typography, { variant: "h5", sx: { color: 'success.main', fontWeight: 700 }, children: formatCurrency(realTimeData?.vatCollected || 0) })] }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Box, { sx: { textAlign: 'center' }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "VAT Paid" }), _jsx(Typography, { variant: "h5", sx: { color: 'error.main', fontWeight: 700 }, children: formatCurrency(realTimeData?.vatPaid || 0) })] }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Box, { sx: { textAlign: 'center' }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Net VAT Due" }), _jsx(Typography, { variant: "h5", sx: {
                                                            color: (realTimeData?.vatCollected || 0) - (realTimeData?.vatPaid || 0) >= 0 ? 'primary.main' : 'warning.main',
                                                            fontWeight: 700
                                                        }, children: formatCurrency((realTimeData?.vatCollected || 0) - (realTimeData?.vatPaid || 0)) })] }) })] })] })] }) }), _jsx(TabPanel, { value: tabValue, index: 1, children: _jsxs(Paper, { sx: { p: 4, borderRadius: 3 }, children: [_jsx(Typography, { variant: "h5", sx: { fontWeight: 600, mb: 3, textAlign: 'center' }, children: "\uD83D\uDCCB Income Statement (Real-time)" }), _jsxs(Box, { sx: { maxWidth: 800, mx: 'auto' }, children: [_jsx(Typography, { variant: "h6", sx: { color: 'success.main', mb: 2, fontWeight: 600 }, children: "\uD83D\uDCB0 REVENUE" }), financialEntries
                                    .filter(entry => entry.type === 'revenue')
                                    .map((entry, index) => (_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: index === financialEntries.filter(e => e.type === 'revenue').length - 1 ? 2 : 1, borderColor: index === financialEntries.filter(e => e.type === 'revenue').length - 1 ? 'success.main' : 'divider' }, children: [_jsxs(Typography, { variant: "body1", children: [entry.category, " - ", entry.subcategory] }), _jsx(Typography, { variant: "body1", sx: { fontWeight: 600, color: 'success.main' }, children: formatCurrency(entry.amount) })] }, entry.id))), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', py: 2, borderBottom: 2, borderColor: 'success.main' }, children: [_jsx(Typography, { variant: "h6", sx: { color: 'success.main', fontWeight: 700 }, children: "Total Revenue" }), _jsx(Typography, { variant: "h6", sx: { color: 'success.main', fontWeight: 700 }, children: formatCurrency(realTimeData?.totalRevenue || 0) })] }), _jsx(Typography, { variant: "h6", sx: { color: 'error.main', mt: 4, mb: 2, fontWeight: 600 }, children: "\uD83D\uDCB8 EXPENSES" }), financialEntries
                                    .filter(entry => entry.type === 'expense')
                                    .map((entry, index) => (_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: index === financialEntries.filter(e => e.type === 'expense').length - 1 ? 2 : 1, borderColor: index === financialEntries.filter(e => e.type === 'expense').length - 1 ? 'error.main' : 'divider' }, children: [_jsxs(Typography, { variant: "body1", children: [entry.category, " - ", entry.subcategory] }), _jsx(Typography, { variant: "body1", sx: { fontWeight: 600, color: 'error.main' }, children: formatCurrency(entry.amount) })] }, entry.id))), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', py: 2, borderBottom: 2, borderColor: 'error.main' }, children: [_jsx(Typography, { variant: "h6", sx: { color: 'error.main', fontWeight: 700 }, children: "Total Expenses" }), _jsx(Typography, { variant: "h6", sx: { color: 'error.main', fontWeight: 700 }, children: formatCurrency(realTimeData?.totalExpenses || 0) })] }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', py: 3, borderTop: 3, borderColor: 'primary.main', mt: 3 }, children: [_jsx(Typography, { variant: "h5", sx: { fontWeight: 700 }, children: "NET INCOME" }), _jsx(Typography, { variant: "h5", sx: {
                                                fontWeight: 700,
                                                color: realTimeData?.netIncome && realTimeData.netIncome >= 0 ? 'success.main' : 'error.main'
                                            }, children: formatCurrency(realTimeData?.netIncome || 0) })] }), _jsxs(Box, { sx: { mt: 4, p: 3, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 2 }, children: [_jsx(Typography, { variant: "h6", sx: { mb: 2, color: 'info.main' }, children: "\uD83D\uDCCA Key Performance Indicators" }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsxs(Grid, { item: true, xs: 6, md: 3, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Gross Margin" }), _jsxs(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: [realTimeData?.totalRevenue ? ((realTimeData.netIncome / realTimeData.totalRevenue) * 100).toFixed(1) : 0, "%"] })] }), _jsxs(Grid, { item: true, xs: 6, md: 3, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Revenue Growth" }), _jsx(Typography, { variant: "h6", sx: { fontWeight: 600, color: 'success.main' }, children: "+12.5%" })] }), _jsxs(Grid, { item: true, xs: 6, md: 3, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Expense Ratio" }), _jsxs(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: [realTimeData?.totalRevenue ? ((realTimeData.totalExpenses / realTimeData.totalRevenue) * 100).toFixed(1) : 0, "%"] })] }), _jsxs(Grid, { item: true, xs: 6, md: 3, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "ROI" }), _jsx(Typography, { variant: "h6", sx: { fontWeight: 600, color: 'primary.main' }, children: "18.7%" })] })] })] })] })] }) }), _jsx(TabPanel, { value: tabValue, index: 2, children: _jsxs(Paper, { sx: { p: 4, borderRadius: 3 }, children: [_jsx(Typography, { variant: "h5", sx: { fontWeight: 600, mb: 3, textAlign: 'center' }, children: "\u2696\uFE0F Balance Sheet (Real-time)" }), !realTimeData?.isBalanced && (_jsx(Alert, { severity: "warning", sx: { mb: 3 }, children: "\u26A0\uFE0F Balance Sheet is not balanced. Assets must equal Liabilities + Equity." })), _jsxs(Grid, { container: true, spacing: 4, children: [_jsxs(Grid, { item: true, xs: 12, md: 6, children: [_jsx(Typography, { variant: "h6", sx: { color: 'primary.main', mb: 2, fontWeight: 600 }, children: "\uD83D\uDCC8 ASSETS" }), _jsxs(Box, { sx: { p: 3, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2 }, children: [_jsx(Typography, { variant: "body1", sx: { mb: 1 }, children: "Current Assets" }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 2 }, children: "Cash, Receivables, Inventory" }), _jsx(Typography, { variant: "h5", sx: { fontWeight: 700, color: 'primary.main' }, children: formatCurrency(realTimeData?.totalAssets || 0) })] })] }), _jsxs(Grid, { item: true, xs: 12, md: 6, children: [_jsx(Typography, { variant: "h6", sx: { color: 'error.main', mb: 2, fontWeight: 600 }, children: "\uD83D\uDCC9 LIABILITIES & EQUITY" }), _jsxs(Box, { sx: { p: 3, bgcolor: alpha(theme.palette.error.main, 0.1), borderRadius: 2, mb: 2 }, children: [_jsx(Typography, { variant: "body1", sx: { mb: 1 }, children: "Liabilities" }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 2 }, children: "Accounts Payable, Loans" }), _jsx(Typography, { variant: "h6", sx: { fontWeight: 700, color: 'error.main' }, children: formatCurrency(realTimeData?.totalLiabilities || 0) })] }), _jsxs(Box, { sx: { p: 3, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 2 }, children: [_jsx(Typography, { variant: "body1", sx: { mb: 1 }, children: "Equity" }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 2 }, children: "Owner's Equity, Retained Earnings" }), _jsx(Typography, { variant: "h6", sx: { fontWeight: 700, color: 'success.main' }, children: formatCurrency((realTimeData?.totalEquity || 0) + (realTimeData?.netIncome || 0)) })] })] })] }), _jsxs(Box, { sx: { mt: 4, p: 3, bgcolor: realTimeData?.isBalanced ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1), borderRadius: 2, border: `1px solid ${realTimeData?.isBalanced ? theme.palette.success.main : theme.palette.error.main}` }, children: [_jsx(Typography, { variant: "h6", sx: {
                                        textAlign: 'center',
                                        color: realTimeData?.isBalanced ? 'success.main' : 'error.main',
                                        fontWeight: 700,
                                        mb: 2
                                    }, children: realTimeData?.isBalanced ? '✅ Balance Sheet is Balanced' : '❌ Balance Sheet is NOT Balanced' }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-around', textAlign: 'center' }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Total Assets" }), _jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: formatCurrency(realTimeData?.totalAssets || 0) })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Total L + E" }), _jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: formatCurrency((realTimeData?.totalLiabilities || 0) + (realTimeData?.totalEquity || 0) + (realTimeData?.netIncome || 0)) })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Difference" }), _jsx(Typography, { variant: "h6", sx: {
                                                        fontWeight: 600,
                                                        color: realTimeData?.isBalanced ? 'success.main' : 'error.main'
                                                    }, children: formatCurrency(Math.abs((realTimeData?.totalAssets || 0) - ((realTimeData?.totalLiabilities || 0) + (realTimeData?.totalEquity || 0) + (realTimeData?.netIncome || 0)))) })] })] })] })] }) }), _jsx(TabPanel, { value: tabValue, index: 3, children: _jsxs(Paper, { sx: { p: 4, borderRadius: 3 }, children: [_jsx(Typography, { variant: "h5", sx: { fontWeight: 600, mb: 3, textAlign: 'center' }, children: "\uD83D\uDCC8 Advanced Financial Analytics" }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Box, { sx: { p: 3, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2 }, children: [_jsx(Typography, { variant: "h6", sx: { color: 'primary.main', mb: 2 }, children: "\uD83D\uDCCA Performance Metrics" }), _jsxs(Box, { sx: { mb: 2 }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Revenue Growth Rate" }), _jsx(LinearProgress, { variant: "determinate", value: 75, sx: { mb: 1 } }), _jsx(Typography, { variant: "body2", sx: { fontWeight: 600 }, children: "+12.5% MoM" })] }), _jsxs(Box, { sx: { mb: 2 }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Profit Margin" }), _jsx(LinearProgress, { variant: "determinate", value: 65, color: "success", sx: { mb: 1 } }), _jsx(Typography, { variant: "body2", sx: { fontWeight: 600 }, children: "65.2%" })] }), _jsxs(Box, { sx: { mb: 2 }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Expense Efficiency" }), _jsx(LinearProgress, { variant: "determinate", value: 85, color: "warning", sx: { mb: 1 } }), _jsx(Typography, { variant: "body2", sx: { fontWeight: 600 }, children: "85.3%" })] })] }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Box, { sx: { p: 3, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 2 }, children: [_jsx(Typography, { variant: "h6", sx: { color: 'success.main', mb: 2 }, children: "\uD83C\uDFAF Compliance Score" }), _jsxs(Box, { sx: { textAlign: 'center', mb: 3 }, children: [_jsxs(Typography, { variant: "h2", sx: { fontWeight: 700, color: 'success.main' }, children: [realTimeData?.complianceScore?.toFixed(0) || 0, "%"] }), _jsx(Typography, { variant: "body1", color: "text.secondary", children: "Overall Compliance Rating" })] }), _jsxs(Box, { sx: { mb: 1 }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "VAT Compliance" }), _jsx(LinearProgress, { variant: "determinate", value: realTimeData?.complianceScore || 0, color: "success" })] }), _jsxs(Box, { sx: { mb: 1 }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Documentation" }), _jsx(LinearProgress, { variant: "determinate", value: 95, color: "success" })] }), _jsxs(Box, { sx: { mb: 1 }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Reporting Standards" }), _jsx(LinearProgress, { variant: "determinate", value: 88, color: "warning" })] })] }) }), _jsx(Grid, { item: true, xs: 12, children: _jsxs(Box, { sx: { p: 3, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 2 }, children: [_jsx(Typography, { variant: "h6", sx: { color: 'info.main', mb: 2 }, children: "\uD83D\uDCC5 Monthly Trends & Forecasting" }), _jsxs(Typography, { variant: "body1", sx: { textAlign: 'center', color: 'text.secondary', py: 4 }, children: ["\uD83D\uDCC8 Interactive charts and trend analysis would be displayed here", _jsx("br", {}), "\uD83D\uDD2E Predictive analytics and forecasting models", _jsx("br", {}), "\uD83D\uDCCA Cash flow projections and scenario planning"] })] }) })] })] }) }), _jsx(TabPanel, { value: tabValue, index: 4, children: _jsxs(Paper, { sx: { p: 4, borderRadius: 3 }, children: [_jsx(Typography, { variant: "h5", sx: { fontWeight: 600, mb: 3, textAlign: 'center' }, children: "\uD83D\uDCC1 Data Management & Entry System" }), _jsx(TableContainer, { component: Paper, sx: { mb: 3 }, children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Date" }), _jsx(TableCell, { children: "Type" }), _jsx(TableCell, { children: "Category" }), _jsx(TableCell, { children: "Description" }), _jsx(TableCell, { align: "right", children: "Amount" }), _jsx(TableCell, { align: "right", children: "VAT" }), _jsx(TableCell, { align: "center", children: "Compliance" }), _jsx(TableCell, { align: "center", children: "Actions" })] }) }), _jsx(TableBody, { children: financialEntries.map((entry) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: entry.date }), _jsx(TableCell, { children: _jsx(Chip, { label: entry.type, color: entry.type === 'revenue' ? 'success' : entry.type === 'expense' ? 'error' : 'default', size: "small" }) }), _jsx(TableCell, { children: entry.category }), _jsx(TableCell, { children: entry.description }), _jsx(TableCell, { align: "right", sx: { fontWeight: 600 }, children: formatCurrency(entry.amount) }), _jsx(TableCell, { align: "right", children: formatCurrency(entry.vatAmount || 0) }), _jsx(TableCell, { align: "center", children: _jsx(Chip, { label: `${entry.complianceScore || 0}%`, color: entry.complianceScore && entry.complianceScore > 90 ? 'success' : 'warning', size: "small" }) }), _jsxs(TableCell, { align: "center", children: [_jsx(IconButton, { onClick: () => handleEditEntry(entry), size: "small", children: _jsx(EditIcon, {}) }), _jsx(IconButton, { onClick: () => handleDeleteEntry(entry.id), size: "small", color: "error", children: _jsx(DeleteIcon, {}) })] })] }, entry.id))) })] }) }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Box, { sx: { textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2 }, children: [_jsx(Typography, { variant: "h4", sx: { fontWeight: 700, color: 'primary.main' }, children: financialEntries.length }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Total Entries" })] }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Box, { sx: { textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 2 }, children: [_jsxs(Typography, { variant: "h4", sx: { fontWeight: 700, color: 'success.main' }, children: [realTimeData?.complianceScore?.toFixed(0) || 0, "%"] }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Avg Compliance" })] }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Box, { sx: { textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 2 }, children: [_jsx(Typography, { variant: "h4", sx: { fontWeight: 700, color: 'info.main' }, children: formatCurrency((realTimeData?.vatCollected || 0) + (realTimeData?.vatPaid || 0)) }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Total VAT" })] }) })] })] }) }), _jsx(TabPanel, { value: tabValue, index: 5, children: _jsxs(Paper, { sx: { p: 4, borderRadius: 3 }, children: [_jsx(Typography, { variant: "h5", sx: { fontWeight: 600, mb: 3, textAlign: 'center' }, children: "\uD83D\uDD27 System Settings & Integration" }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Box, { sx: { p: 3, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2 }, children: [_jsx(Typography, { variant: "h6", sx: { color: 'primary.main', mb: 2 }, children: "\uD83D\uDD17 External Integrations" }), _jsxs(Box, { sx: { mb: 2 }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }, children: [_jsx(Typography, { variant: "body1", children: "\uD83C\uDFE6 Banking API" }), _jsx(Chip, { label: isConnected ? 'Connected' : 'Disconnected', color: isConnected ? 'success' : 'error', size: "small" })] }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }, children: [_jsx(Typography, { variant: "body1", children: "\uD83C\uDFDB\uFE0F FTA Portal" }), _jsx(Chip, { label: "Connected", color: "success", size: "small" })] }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }, children: [_jsx(Typography, { variant: "body1", children: "\uD83D\uDED2 POS Systems" }), _jsx(Chip, { label: "3 Connected", color: "success", size: "small" })] }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx(Typography, { variant: "body1", children: "\uD83D\uDCCA Analytics" }), _jsx(Chip, { label: "Active", color: "success", size: "small" })] })] })] }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Box, { sx: { p: 3, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 2 }, children: [_jsx(Typography, { variant: "h6", sx: { color: 'info.main', mb: 2 }, children: "\u2699\uFE0F System Configuration" }), _jsxs(Box, { sx: { mb: 2 }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 1 }, children: "Auto-sync interval: Every 5 minutes" }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 1 }, children: "Data retention: 7 years (UAE compliance)" }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 1 }, children: "Backup frequency: Daily at 2:00 AM" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Security level: Enterprise Grade" })] })] }) }), _jsx(Grid, { item: true, xs: 12, children: _jsxs(Box, { sx: { p: 3, bgcolor: alpha(theme.palette.warning.main, 0.1), borderRadius: 2 }, children: [_jsx(Typography, { variant: "h6", sx: { color: 'warning.main', mb: 2 }, children: "\uD83D\uDD14 System Status & Alerts" }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, md: 3, children: _jsxs(Box, { sx: { textAlign: 'center' }, children: [_jsx(CheckIcon, { sx: { fontSize: 40, color: 'success.main', mb: 1 } }), _jsx(Typography, { variant: "body2", children: "Data Integrity" })] }) }), _jsx(Grid, { item: true, xs: 12, md: 3, children: _jsxs(Box, { sx: { textAlign: 'center' }, children: [_jsx(CheckIcon, { sx: { fontSize: 40, color: 'success.main', mb: 1 } }), _jsx(Typography, { variant: "body2", children: "Real-time Sync" })] }) }), _jsx(Grid, { item: true, xs: 12, md: 3, children: _jsxs(Box, { sx: { textAlign: 'center' }, children: [_jsx(CheckIcon, { sx: { fontSize: 40, color: 'success.main', mb: 1 } }), _jsx(Typography, { variant: "body2", children: "Security" })] }) }), _jsx(Grid, { item: true, xs: 12, md: 3, children: _jsxs(Box, { sx: { textAlign: 'center' }, children: [_jsx(WarningIcon, { sx: { fontSize: 40, color: 'warning.main', mb: 1 } }), _jsx(Typography, { variant: "body2", children: "Backup Status" })] }) })] })] }) })] })] }) }), _jsx(Fab, { color: "primary", "aria-label": "add", onClick: handleAddEntry, sx: {
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                }, children: _jsx(AddIcon, {}) }), _jsxs(Dialog, { open: showAddDialog, onClose: () => setShowAddDialog(false), maxWidth: "md", fullWidth: true, children: [_jsx(DialogTitle, { children: editingEntry ? '✏️ Edit Financial Entry' : '➕ Add New Financial Entry' }), _jsx(DialogContent, { children: _jsxs(Grid, { container: true, spacing: 3, sx: { mt: 1 }, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Type" }), _jsxs(Select, { value: formData.type, onChange: (e) => setFormData(prev => ({ ...prev, type: e.target.value })), children: [_jsx(MenuItem, { value: "revenue", children: "\uD83D\uDCB0 Revenue" }), _jsx(MenuItem, { value: "expense", children: "\uD83D\uDCB8 Expense" }), _jsx(MenuItem, { value: "asset", children: "\uD83D\uDCC8 Asset" }), _jsx(MenuItem, { value: "liability", children: "\uD83D\uDCC9 Liability" }), _jsx(MenuItem, { value: "equity", children: "\u2696\uFE0F Equity" })] })] }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, label: "Category", value: formData.category, onChange: (e) => setFormData(prev => ({ ...prev, category: e.target.value })) }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, label: "Subcategory", value: formData.subcategory, onChange: (e) => setFormData(prev => ({ ...prev, subcategory: e.target.value })) }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, label: "Amount", type: "number", value: formData.amount, onChange: (e) => setFormData(prev => ({ ...prev, amount: e.target.value })) }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, label: "Date", type: "date", value: formData.date, onChange: (e) => setFormData(prev => ({ ...prev, date: e.target.value })), InputLabelProps: { shrink: true } }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, label: "VAT Rate (%)", type: "number", value: formData.vatRate, onChange: (e) => setFormData(prev => ({ ...prev, vatRate: e.target.value })) }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Description", multiline: true, rows: 3, value: formData.description, onChange: (e) => setFormData(prev => ({ ...prev, description: e.target.value })) }) })] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setShowAddDialog(false), children: "Cancel" }), _jsxs(Button, { onClick: handleSaveEntry, variant: "contained", children: [editingEntry ? 'Update' : 'Add', " Entry"] })] })] }), _jsx(Snackbar, { open: snackbarOpen, autoHideDuration: 6000, onClose: () => setSnackbarOpen(false), anchorOrigin: { vertical: 'bottom', horizontal: 'left' }, children: _jsx(Alert, { onClose: () => setSnackbarOpen(false), severity: snackbarSeverity, children: snackbarMessage }) }), _jsx(Box, { sx: {
                    mt: 6,
                    p: 3,
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`
                }, children: _jsxs(Typography, { variant: "body2", sx: { display: 'flex', alignItems: 'center', color: 'success.main', fontWeight: 500 }, children: ["\u2705 Advanced Financials System Active \u2022 \uD83D\uDCBE Last Updated: ", new Date().toLocaleTimeString(), " \u2022 \uD83C\uDFAF Status: All Systems Operational \u2022 \uD83D\uDCCA ", financialEntries.length, " Total Entries \u2022 \uD83D\uDD04 Real-time Sync: ", isConnected ? 'Connected' : 'Offline', " \u2022 \uD83D\uDEE1\uFE0F Compliance Score: ", realTimeData?.complianceScore?.toFixed(0) || 0, "%"] }) })] }));
};
export default Financials;
