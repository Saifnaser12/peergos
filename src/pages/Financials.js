import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Alert, Chip, Divider, useTheme, alpha, Tabs, Tab, Snackbar } from '@mui/material';
import { Assessment as AssessmentIcon, AccountBalance as AccountBalanceIcon, TrendingUp, DarkMode as DarkModeIcon, LightMode as LightModeIcon, Language as LanguageIcon, Delete as DeleteIcon, Edit as EditIcon, PictureAsPdf as PdfIcon, TableChart as ExcelIcon, Receipt as CashFlowIcon, MonetizationOn as RevenueIcon, ShoppingCart as ExpenseIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useTheme as useAppTheme } from '../context/ThemeContext';
import InvoiceScanner from '../components/InvoiceScanner';
import { IncomeStatement } from '../components/financials/IncomeStatement';
import { BalanceSheet } from '../components/financials/BalanceSheet';
import { CashFlowStatement } from '../components/financials/CashFlowStatement';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { useFinancialSync } from '../hooks/useFinancialSync';
// Categories configuration
const CATEGORIES = {
    revenue: ['Product Sales', 'Services', 'Other Income'],
    expense: ['Salaries', 'Rent', 'Utilities', 'Marketing', 'Supplies', 'Professional Fees', 'Other'],
    asset: ['Cash', 'Inventory', 'Receivables', 'Equipment'],
    liability: ['Payables', 'Loans', 'Guarantees'],
    equity: ['Owner Capital', 'Retained Earnings']
};
const CHART_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];
const Financials = () => {
    const { t, i18n } = useTranslation();
    const { isDarkMode, toggleTheme } = useAppTheme();
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState(0);
    const [notes, setNotes] = useState([]);
    const [openExpenseModal, setOpenExpenseModal] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const { revenues, expenses, addRevenue, addExpense } = useFinance();
    const { summary: syncSummary, isUpdating, totalRevenue, totalExpenses, netIncome } = useFinancialSync();
    const [financialData, setFinancialData] = useState([
        {
            id: '1',
            category: 'Product Sales',
            subcategory: 'Main Products',
            amount: 150000,
            date: '2024-01-01',
            description: 'Q1 Product Sales',
            type: 'revenue'
        },
        {
            id: '2',
            category: 'Salaries',
            subcategory: 'Staff Salaries',
            amount: 45000,
            date: '2024-01-01',
            description: 'Monthly Salaries',
            type: 'expense',
            vendor: 'Payroll Department'
        },
        {
            id: '3',
            category: 'Cash',
            subcategory: 'Bank Account',
            amount: 85000,
            date: '2024-01-01',
            description: 'Cash in Bank',
            type: 'asset'
        },
        {
            id: '4',
            category: 'Loans',
            subcategory: 'Bank Loan',
            amount: 50000,
            date: '2024-01-01',
            description: 'Business Loan',
            type: 'liability'
        },
        {
            id: '5',
            category: 'Owner Capital',
            subcategory: 'Initial Investment',
            amount: 100000,
            date: '2024-01-01',
            description: 'Owner Investment',
            type: 'equity'
        }
    ]);
    const [newExpense, setNewExpense] = useState({
        vendor: '',
        category: '',
        subcategory: '',
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0]
    });
    // Use real-time totals from FinanceContext
    const netProfit = netIncome;
    // Calculate summary using live context data + static financial data
    const summary = {
        totalRevenue,
        totalExpenses,
        netIncome: netProfit,
        totalAssets: financialData.filter(item => item.type === 'asset').reduce((sum, item) => sum + item.amount, 0),
        totalLiabilities: financialData.filter(item => item.type === 'liability').reduce((sum, item) => sum + item.amount, 0),
        totalEquity: financialData.filter(item => item.type === 'equity').reduce((sum, item) => sum + item.amount, 0),
        get isBalanced() { return Math.abs((this.totalAssets) - (this.totalLiabilities + this.totalEquity)) < 0.01; }
    };
    // Calculate yearly summary using live FinanceContext data
    const calculateYearlySummary = () => {
        const currentYear = new Date().getFullYear();
        // Filter current year data from FinanceContext
        const currentYearRevenue = revenues
            .filter(item => new Date(item.date).getFullYear() === currentYear)
            .reduce((sum, item) => sum + item.amount, 0);
        const currentYearExpenses = expenses
            .filter(item => new Date(item.date).getFullYear() === currentYear)
            .reduce((sum, item) => sum + item.amount, 0);
        const netIncome = currentYearRevenue - currentYearExpenses;
        return {
            year: currentYear,
            revenue: currentYearRevenue,
            expenses: currentYearExpenses,
            netIncome,
            growthRate: 15.2 // Mock growth rate - could be calculated from historical data
        };
    };
    const yearlySummary = calculateYearlySummary();
    // Chart data for revenue vs expenses using live data
    const pieChartData = [
        { name: t('financials.revenue'), value: totalRevenue, color: '#10b981' },
        { name: t('financials.expenses'), value: totalExpenses, color: '#ef4444' }
    ];
    // Mock data for profit/loss over time
    const profitLossData = [
        { month: 'Jan', profit: 12000 },
        { month: 'Feb', profit: 18000 },
        { month: 'Mar', profit: 15000 },
        { month: 'Apr', profit: 22000 },
        { month: 'May', profit: 19000 },
        { month: 'Jun', profit: 25000 }
    ];
    const handleAddExpense = (expenseData) => {
        addExpense({
            category: expenseData.category,
            amount: parseFloat(expenseData.amount),
            date: expenseData.date,
            description: expenseData.description,
            vendor: expenseData.vendor
        });
        setOpenExpenseModal(false);
    };
    const handleEditEntry = (entry) => {
        setEditingEntry(entry);
        if (entry.type === 'expense') {
            setNewExpense({
                vendor: entry.vendor || '',
                category: entry.category,
                subcategory: entry.subcategory,
                amount: entry.amount,
                description: entry.description,
                date: entry.date
            });
            setOpenExpenseModal(true);
        }
    };
    const handleDeleteEntry = (id) => {
        setFinancialData(financialData.filter(item => item.id !== id));
    };
    const handleExportPDF = (type) => {
        const exportData = {
            totalRevenue,
            totalExpenses,
            netIncome: netProfit,
            revenues: revenues.map(r => ({
                id: r.id,
                amount: r.amount,
                description: r.description,
                date: r.date,
                category: r.category
            })),
            expenses: expenses.map(e => ({
                id: e.id,
                amount: e.amount,
                category: e.category,
                date: e.date,
                description: e.description,
                vendor: e.vendor
            }))
        };
        exportToPDF(exportData);
    };
    const handleExportExcel = () => {
        const exportData = {
            totalRevenue,
            totalExpenses,
            netIncome: netProfit,
            revenues: revenues.map(r => ({
                id: r.id,
                amount: r.amount,
                description: r.description,
                date: r.date,
                category: r.category
            })),
            expenses: expenses.map(e => ({
                id: e.id,
                amount: e.amount,
                category: e.category,
                date: e.date,
                description: e.description,
                vendor: e.vendor
            }))
        };
        exportToExcel(exportData);
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-AE' : 'en-AE', {
            style: 'currency',
            currency: 'AED'
        }).format(amount);
    };
    const getTypeColor = (type) => {
        switch (type) {
            case 'revenue': return theme.palette.success.main;
            case 'expense': return theme.palette.error.main;
            case 'asset': return theme.palette.info.main;
            case 'liability': return theme.palette.warning.main;
            case 'equity': return theme.palette.secondary.main;
            default: return theme.palette.text.primary;
        }
    };
    const navigateToAccounting = () => {
        window.location.href = '/accounting?tab=revenue';
    };
    const navigateToAccountingExpense = () => {
        window.location.href = '/accounting?tab=expenses';
    };
    // Alert state variables
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showWarningAlert, setShowWarningAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    return (_jsxs(Box, { sx: { p: 3, direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "h4", sx: { fontWeight: 600, color: theme.palette.text.primary }, children: t('financials.title', 'Financial Reports') }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mt: 1 }, children: t('financials.subtitle', 'Simplified financial management for non-accountants') })] }), _jsxs(Box, { sx: { display: 'flex', gap: 1 }, children: [_jsx(IconButton, { onClick: () => i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en'), children: _jsx(LanguageIcon, {}) }), _jsx(IconButton, { onClick: toggleTheme, children: isDarkMode ? _jsx(LightModeIcon, {}) : _jsx(DarkModeIcon, {}) })] })] }), _jsx(Card, { sx: {
                    mb: 4,
                    borderRadius: 3,
                    boxShadow: theme.shadows[4],
                    background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)}, ${alpha(theme.palette.success.main, 0.05)})`
                }, children: _jsxs(CardContent, { sx: { p: 4 }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }, children: [_jsx(Typography, { variant: "h5", sx: { fontWeight: 700, color: theme.palette.text.primary }, children: t('financials.livePL', 'Live Profit & Loss Summary') }), _jsxs(Box, { sx: { display: 'flex', gap: 1 }, children: [isUpdating && (_jsx(Chip, { label: "\uD83D\uDD04 Updating...", color: "info", variant: "outlined", sx: { fontWeight: 600 } })), _jsx(Chip, { label: t('financials.realTime', 'Real-time'), color: "success", sx: { fontWeight: 600 } })] })] }), _jsxs(Grid, { container: true, spacing: 4, children: [_jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Box, { sx: { textAlign: 'center' }, children: [_jsx(RevenueIcon, { sx: { fontSize: 40, color: theme.palette.success.main, mb: 1 } }), _jsx(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: t('financials.totalRevenue', 'Total Revenue') }), _jsx(Typography, { variant: "h4", sx: { fontWeight: 700, color: theme.palette.success.main }, children: formatCurrency(totalRevenue) }), _jsxs(Typography, { variant: "caption", color: "text.secondary", children: [revenues.length, " ", t('financials.transactions', 'transactions')] })] }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Box, { sx: { textAlign: 'center' }, children: [_jsx(ExpenseIcon, { sx: { fontSize: 40, color: theme.palette.error.main, mb: 1 } }), _jsx(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: t('financials.totalExpenses', 'Total Expenses') }), _jsx(Typography, { variant: "h4", sx: { fontWeight: 700, color: theme.palette.error.main }, children: formatCurrency(totalExpenses) }), _jsxs(Typography, { variant: "caption", color: "text.secondary", children: [expenses.length, " ", t('financials.transactions', 'transactions')] })] }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Box, { sx: { textAlign: 'center' }, children: [_jsx(TrendingUp, { sx: { fontSize: 40, color: netProfit >= 0 ? theme.palette.success.main : theme.palette.error.main, mb: 1 } }), _jsx(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: t('financials.netProfit', 'Net Profit') }), _jsx(Typography, { variant: "h4", sx: {
                                                    fontWeight: 700,
                                                    color: netProfit >= 0 ? theme.palette.success.main : theme.palette.error.main
                                                }, children: formatCurrency(netProfit) }), _jsxs(Typography, { variant: "caption", color: "text.secondary", children: [totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0, "% ", t('financials.margin', 'margin')] })] }) })] }), _jsx(Divider, { sx: { my: 3 } }), _jsxs(Box, { sx: { display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }, children: [_jsx(Button, { variant: "contained", startIcon: _jsx(PdfIcon, {}), onClick: () => handleExportPDF('comprehensive'), sx: { borderRadius: 2, textTransform: 'none' }, children: t('financials.exportPDF', 'Export PDF Report') }), _jsx(Button, { variant: "outlined", startIcon: _jsx(ExcelIcon, {}), onClick: handleExportExcel, sx: { borderRadius: 2, textTransform: 'none' }, children: t('financials.exportExcel', 'Export Excel') })] })] }) }), _jsx(Card, { sx: {
                    mb: 4,
                    borderRadius: 3,
                    boxShadow: theme.shadows[4],
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`
                }, children: _jsxs(CardContent, { sx: { p: 4 }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }, children: [_jsx(Typography, { variant: "h5", sx: { fontWeight: 700, color: theme.palette.text.primary }, children: t('financials.yearlySummary', `${yearlySummary.year} Financial Summary`) }), _jsx(Chip, { label: `+${yearlySummary.growthRate}% Growth`, color: "success", sx: { fontWeight: 600 } })] }), _jsxs(Grid, { container: true, spacing: 4, children: [_jsx(Grid, { item: true, xs: 12, md: 3, children: _jsxs(Box, { sx: { textAlign: 'center' }, children: [_jsx(RevenueIcon, { sx: { fontSize: 40, color: theme.palette.success.main, mb: 1 } }), _jsx(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: t('financials.totalRevenue', 'Total Revenue') }), _jsx(Typography, { variant: "h4", sx: { fontWeight: 700, color: theme.palette.success.main }, children: formatCurrency(yearlySummary.revenue) })] }) }), _jsx(Grid, { item: true, xs: 12, md: 3, children: _jsxs(Box, { sx: { textAlign: 'center' }, children: [_jsx(ExpenseIcon, { sx: { fontSize: 40, color: theme.palette.error.main, mb: 1 } }), _jsx(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: t('financials.totalExpenses', 'Total Expenses') }), _jsx(Typography, { variant: "h4", sx: { fontWeight: 700, color: theme.palette.error.main }, children: formatCurrency(yearlySummary.expenses) })] }) }), _jsx(Grid, { item: true, xs: 12, md: 3, children: _jsxs(Box, { sx: { textAlign: 'center' }, children: [_jsx(TrendingUp, { sx: { fontSize: 40, color: theme.palette.primary.main, mb: 1 } }), _jsx(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: t('financials.netIncome', 'Net Income') }), _jsx(Typography, { variant: "h4", sx: {
                                                    fontWeight: 700,
                                                    color: yearlySummary.netIncome >= 0 ? theme.palette.success.main : theme.palette.error.main
                                                }, children: formatCurrency(yearlySummary.netIncome) })] }) }), _jsx(Grid, { item: true, xs: 12, md: 3, children: _jsxs(Box, { sx: { textAlign: 'center' }, children: [_jsx(AccountBalanceIcon, { sx: { fontSize: 40, color: theme.palette.info.main, mb: 1 } }), _jsx(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: t('financials.profitMargin', 'Profit Margin') }), _jsxs(Typography, { variant: "h4", sx: { fontWeight: 700, color: theme.palette.info.main }, children: [yearlySummary.revenue > 0 ? ((yearlySummary.netIncome / yearlySummary.revenue) * 100).toFixed(1) : 0, "%"] })] }) })] })] }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8", children: [_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 h-80 relative overflow-hidden", children: _jsxs("div", { className: "p-6 h-full flex flex-col", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx(AccountBalanceIcon, { sx: { mr: 1, color: theme.palette.secondary.main } }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: t('financials.balanceSheet', 'Balance Sheet') }), summary.isBalanced && (_jsx("span", { className: "ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full", children: "Balanced" }))] }), _jsxs("div", { className: "space-y-4 flex-grow", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: t('financials.assets', 'Assets') }), _jsx("p", { className: "text-xl font-semibold text-blue-600 dark:text-blue-400", children: formatCurrency(summary.totalAssets) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: t('financials.liabilities', 'Liabilities') }), _jsx("p", { className: "text-xl font-semibold text-amber-600 dark:text-amber-400", children: formatCurrency(summary.totalLiabilities) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: t('financials.equity', 'Equity') }), _jsx("p", { className: "text-xl font-semibold text-purple-600 dark:text-purple-400", children: formatCurrency(summary.totalEquity) })] })] }), _jsxs("button", { onClick: () => setActiveTab(1), className: "w-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-xl transition-colors duration-200 mt-4", children: [_jsx(ViewIcon, { sx: { mr: 1, fontSize: 16 } }), t('common.view', 'View Details')] })] }) }), _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 h-80", children: _jsxs("div", { className: "p-6 h-full", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: t('financials.profitLoss', 'Profit & Loss') }), _jsx("div", { className: "h-48", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { data: profitLossData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e5e7eb" }), _jsx(XAxis, { dataKey: "month", fontSize: 12 }), _jsx(YAxis, { fontSize: 12 }), _jsx(Tooltip, { formatter: (value) => formatCurrency(Number(value)), contentStyle: {
                                                        backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                                                        border: '1px solid #e5e7eb',
                                                        borderRadius: '12px'
                                                    } }), _jsx(Line, { type: "monotone", dataKey: "profit", stroke: "#3b82f6", strokeWidth: 3, dot: { fill: '#3b82f6', strokeWidth: 2, r: 4 } })] }) }) })] }) }), _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 h-80", children: _jsxs("div", { className: "p-6 h-full", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: t('financials.revenueVsExpenses', 'Revenue vs Expenses') }), _jsx("div", { className: "h-40", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { data: pieChartData, cx: "50%", cy: "50%", outerRadius: 60, dataKey: "value", children: pieChartData.map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) }), _jsx(Tooltip, { formatter: (value) => formatCurrency(Number(value)), contentStyle: {
                                                        backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                                                        border: '1px solid #e5e7eb',
                                                        borderRadius: '12px'
                                                    } })] }) }) }), _jsx("div", { className: "flex justify-center gap-4 mt-2", children: pieChartData.map((entry, index) => (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-3 h-3 rounded mr-2", style: { backgroundColor: entry.color } }), _jsx("span", { className: "text-xs text-gray-600 dark:text-gray-400", children: entry.name })] }, index))) })] }) })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6 shadow-lg border border-gray-100 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx(AssessmentIcon, { sx: { mr: 2, color: theme.palette.primary.main, fontSize: 28 } }), _jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: t('financials.quickActions', 'Quick Actions') })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx("div", { onClick: navigateToAccounting, className: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl border border-green-200 dark:border-green-700", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-2xl mb-4", children: _jsx(RevenueIcon, { sx: { fontSize: 32, color: 'white' } }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-2", children: t('financials.addRevenue', 'Add Revenue') }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: t('financials.recordSales', 'Record sales and income') })] }) }), _jsx("div", { onClick: () => setOpenExpenseModal(true), className: "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl border border-red-200 dark:border-red-700", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-2xl mb-4", children: _jsx(ExpenseIcon, { sx: { fontSize: 32, color: 'white' } }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-2", children: t('financials.addExpense', 'Add Expense') }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: t('financials.trackCosts', 'Track business costs') })] }) }), _jsx("div", { onClick: () => handleExportPDF('comprehensive'), className: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl border border-amber-200 dark:border-amber-700", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-amber-500 rounded-2xl mb-4", children: _jsx(PdfIcon, { sx: { fontSize: 32, color: 'white' } }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-2", children: t('financials.exportReports', 'Export Reports') }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: t('financials.downloadPdf', 'Download PDF reports') })] }) }), _jsx("div", { onClick: handleExportExcel, className: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl border border-blue-200 dark:border-blue-700", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl mb-4", children: _jsx(ExcelIcon, { sx: { fontSize: 32, color: 'white' } }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-2", children: t('financials.exportData', 'Export Data') }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: t('financials.downloadExcel', 'Download Excel file') })] }) })] })] }), _jsxs(Paper, { sx: { borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[4] }, children: [_jsx(Box, { sx: { borderBottom: 1, borderColor: 'divider' }, children: _jsxs(Tabs, { value: activeTab, onChange: (_, newValue) => setActiveTab(newValue), sx: { px: 2 }, children: [_jsx(Tab, { label: t('financials.incomeStatement', 'Income Statement'), icon: _jsx(TrendingUp, {}), iconPosition: "start", sx: { textTransform: 'none' } }), _jsx(Tab, { label: t('financials.balanceSheet', 'Balance Sheet'), icon: _jsx(AccountBalanceIcon, {}), iconPosition: "start", sx: { textTransform: 'none' } }), _jsx(Tab, { label: t('financials.cashFlowStatement', 'Cash Flow Statement'), icon: _jsx(CashFlowIcon, {}), iconPosition: "start", sx: { textTransform: 'none' } }), _jsx(Tab, { label: t('financials.dataEntries', 'Data Entries'), icon: _jsx(AssessmentIcon, {}), iconPosition: "start", sx: { textTransform: 'none' } })] }) }), _jsxs(Box, { sx: { p: 3 }, children: [activeTab === 0 && _jsx(IncomeStatement, { data: financialData }), activeTab === 1 && _jsx(BalanceSheet, { data: financialData, netIncome: summary.netIncome }), activeTab === 2 && _jsx(CashFlowStatement, { data: financialData, netIncome: summary.netIncome }), activeTab === 3 && (_jsx(TableContainer, { children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { sx: { backgroundColor: alpha(theme.palette.primary.main, 0.1) }, children: [_jsx(TableCell, { sx: { fontWeight: 600 }, children: t('common.date', 'Date') }), _jsx(TableCell, { sx: { fontWeight: 600 }, children: t('common.type', 'Type') }), _jsx(TableCell, { sx: { fontWeight: 600 }, children: t('common.category', 'Category') }), _jsx(TableCell, { sx: { fontWeight: 600 }, children: t('common.description', 'Description') }), _jsx(TableCell, { align: "right", sx: { fontWeight: 600 }, children: t('common.amount', 'Amount') }), _jsx(TableCell, { align: "center", sx: { fontWeight: 600 }, children: t('common.actions', 'Actions') })] }) }), _jsx(TableBody, { children: financialData.map((row) => (_jsxs(TableRow, { hover: true, children: [_jsx(TableCell, { children: new Date(row.date).toLocaleDateString() }), _jsx(TableCell, { children: _jsx(Chip, { label: row.type, size: "small", sx: {
                                                                backgroundColor: alpha(getTypeColor(row.type), 0.1),
                                                                color: getTypeColor(row.type),
                                                                textTransform: 'capitalize'
                                                            } }) }), _jsx(TableCell, { children: _jsxs(Box, { children: [_jsx(Typography, { variant: "body2", sx: { fontWeight: 500 }, children: row.category }), row.subcategory && (_jsx(Typography, { variant: "caption", color: "text.secondary", children: row.subcategory }))] }) }), _jsx(TableCell, { children: row.description }), _jsx(TableCell, { align: "right", sx: {
                                                            color: getTypeColor(row.type),
                                                            fontWeight: 600
                                                        }, children: formatCurrency(row.amount) }), _jsxs(TableCell, { align: "center", children: [_jsx(IconButton, { size: "small", onClick: () => Financials.handleEditEntry(row), sx: { mr: 1 }, children: _jsx(EditIcon, { fontSize: "small" }) }), _jsx(IconButton, { size: "small", onClick: () => Financials.handleDeleteEntry(row.id), color: "error", children: _jsx(DeleteIcon, { fontSize: "small" }) })] })] }, row.id))) })] }) }))] })] }), _jsxs(Dialog, { open: openExpenseModal, onClose: () => {
                    setOpenExpenseModal(false);
                    setEditingEntry(null);
                    setNewExpense({
                        vendor: '',
                        category: '',
                        subcategory: '',
                        amount: 0,
                        description: '',
                        date: new Date().toISOString().split('T')[0]
                    });
                }, maxWidth: "sm", fullWidth: true, fullScreen: window.innerWidth < 600, PaperProps: {
                    sx: {
                        borderRadius: window.innerWidth < 600 ? 0 : 3,
                        margin: window.innerWidth < 600 ? 0 : 2
                    }
                }, children: [_jsx(DialogTitle, { sx: { fontWeight: 600 }, children: editingEntry ? t('financials.editExpense', 'Edit Expense') : t('financials.addExpense', 'Add New Expense') }), _jsx(DialogContent, { children: _jsxs(Grid, { container: true, spacing: 2, sx: { mt: 1 }, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: t('common.vendor', 'Vendor Name'), value: newExpense.vendor, onChange: (e) => setNewExpense({ ...newExpense, vendor: e.target.value }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: t('common.date', 'Date'), type: "date", value: newExpense.date, onChange: (e) => setNewExpense({ ...newExpense, date: e.target.value }), InputLabelProps: {
                                            shrink: true,
                                        } }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, select: true, label: t('common.category', 'Category'), value: newExpense.category, onChange: (e) => setNewExpense({ ...newExpense, category: e.target.value }), children: CATEGORIES.expense.map((category) => (_jsx(MenuItem, { value: category, children: category }, category))) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, type: "number", label: t('common.amount', 'Amount (AED)'), value: newExpense.amount, onChange: (e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 }), inputProps: { step: '0.01', min: '0' } }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: t('common.description', 'Description'), value: newExpense.description, onChange: (e) => setNewExpense({ ...newExpense, description: e.target.value }), multiline: true, rows: 2 }) })] }) }), _jsxs(DialogActions, { sx: { p: 3 }, children: [_jsx(Button, { onClick: () => {
                                    setOpenExpenseModal(false);
                                    setEditingEntry(null);
                                    setNewExpense({
                                        vendor: '',
                                        category: '',
                                        subcategory: '',
                                        amount: 0,
                                        description: '',
                                        date: new Date().toISOString().split('T')[0]
                                    });
                                }, sx: { textTransform: 'none' }, children: t('common.cancel', 'Cancel') }), _jsx(Button, { onClick: () => handleAddExpense(newExpense), variant: "contained", sx: { textTransform: 'none', borderRadius: 2 }, children: editingEntry ? t('common.update', 'Update') : t('common.add', 'Add') })] })] }), _jsxs(Box, { sx: { mt: 4 }, children: [_jsx(Typography, { variant: "h5", gutterBottom: true, sx: { color: theme.palette.text.primary, fontWeight: 600 }, children: t('financials.bookkeeping', 'Bookkeeping & Document Management') }), _jsxs(Grid, { container: true, spacing: 3, sx: { mt: 1 }, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(InvoiceScanner, { variant: "card" }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Paper, { elevation: 1, sx: {
                                        p: 3,
                                        borderRadius: 2,
                                        backgroundColor: theme.palette.background.paper,
                                        border: `1px solid ${theme.palette.divider}`
                                    }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, sx: { color: theme.palette.text.primary }, children: t('financials.recentInvoices', 'Recent Scanned Invoices') }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 2 }, children: t('financials.invoicesProcessed', 'Invoices processed through OCR scanning') }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: "DEWA - AED 525.00" }), _jsx("p", { className: "text-xs text-gray-500", children: "2024-01-15 \u2022 95% confidence" })] }), _jsx("span", { className: "text-xs bg-green-100 text-green-800 px-2 py-1 rounded", children: "Processed" })] }), _jsxs("div", { className: "flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: "Etisalat - AED 1,250.75" }), _jsx("p", { className: "text-xs text-gray-500", children: "2024-01-10 \u2022 89% confidence" })] }), _jsx("span", { className: "text-xs bg-green-100 text-green-800 px-2 py-1 rounded", children: "Processed" })] }), _jsx("div", { className: "text-center pt-2", children: _jsx(InvoiceScanner, { variant: "button" }) })] })] }) })] })] }), _jsx(Snackbar, { open: showSuccessAlert, autoHideDuration: 4000, onClose: () => setShowSuccessAlert(false), children: _jsx(Alert, { severity: "success", onClose: () => setShowSuccessAlert(false), children: alertMessage }) }), _jsx(Snackbar, { open: showWarningAlert, autoHideDuration: 4000, onClose: () => setShowWarningAlert(false), children: _jsx(Alert, { severity: "warning", onClose: () => setShowWarningAlert(false), children: alertMessage }) })] }));
};
export default Financials;
