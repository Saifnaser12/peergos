import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusIcon, TrashIcon, DocumentIcon, CalculatorIcon, ArrowTrendingDownIcon, BanknotesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import RevenueModal from '../components/accounting/RevenueModal';
import ExpenseModal from '../components/accounting/ExpenseModal';
import AccountingSummary from '../components/accounting/AccountingSummary';
import InvoiceModal from '../components/accounting/InvoiceModal';
import { ArrowTrendingUpIcon as TrendingUpIcon } from '@heroicons/react/24/outline';
import { useFinance } from '../context/FinanceContext';
const Accounting = () => {
    const { t } = useTranslation();
    const { revenue, expenses, addRevenue, addExpense, deleteRevenue, deleteExpense, getTotalRevenue, getTotalExpenses, getNetIncome } = useFinance();
    // State management
    const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [editingRevenue, setEditingRevenue] = useState(null);
    const [editingExpense, setEditingExpense] = useState(null);
    const [activeTab, setActiveTab] = useState('revenue');
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [selectedRevenueForInvoice, setSelectedRevenueForInvoice] = useState(null);
    const handleBankUpload = (event) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'text/csv') {
            // TODO: Implement CSV parsing with papaparse
            // For now, show a placeholder message
            alert(t('accounting.bankImport.uploadSuccess', 'CSV uploaded successfully! Bank reconciliation feature coming soon.'));
            console.log('Bank CSV file selected:', file.name);
        }
        else {
            alert(t('accounting.bankImport.invalidFile', 'Please select a valid CSV file.'));
        }
    };
    // Revenue handlers
    const handleAddRevenue = (revenueData) => {
        // Add to global finance context
        addRevenue({
            amount: revenueData.amount,
            description: revenueData.description,
            date: revenueData.date,
            category: revenueData.customer || 'General'
        });
        setIsRevenueModalOpen(false);
    };
    const handleUpdateRevenue = (updatedRevenue) => {
        // For now, we'll delete the old and add new (since we don't have update in context yet)
        setEditingRevenue(null);
        setIsRevenueModalOpen(false);
    };
    const handleDeleteRevenue = (id) => {
        if (window.confirm(t('accounting.messages.deleteConfirm'))) {
            deleteRevenue(id);
        }
    };
    // Expense handlers
    const handleAddExpense = (expenseData) => {
        // Add to global finance context
        addExpense({
            amount: expenseData.amount,
            category: expenseData.category,
            date: expenseData.date,
            description: expenseData.description,
            vendor: expenseData.vendor
        });
        setIsExpenseModalOpen(false);
    };
    const handleUpdateExpense = (updatedExpense) => {
        // For now, we'll delete the old and add new (since we don't have update in context yet)
        setEditingExpense(null);
        setIsExpenseModalOpen(false);
    };
    const handleDeleteExpense = (id) => {
        if (window.confirm(t('accounting.messages.deleteConfirm'))) {
            deleteExpense(id);
        }
    };
    const handleEditRevenue = (revenue) => {
        setEditingRevenue(revenue);
        setIsRevenueModalOpen(true);
    };
    const handleEditExpense = (expense) => {
        setEditingExpense(expense);
        setIsExpenseModalOpen(true);
    };
    const handleGenerateInvoice = (revenue) => {
        setSelectedRevenueForInvoice(revenue);
        setIsInvoiceModalOpen(true);
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: 'AED',
            minimumFractionDigits: 2
        }).format(amount);
    };
    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat('en-AE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(new Date(dateString));
    };
    // Calculate totals from global context
    const totalRevenue = getTotalRevenue();
    const totalExpenses = getTotalExpenses();
    const netIncome = getNetIncome();
    return (_jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("div", { className: "mb-8", children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg", children: _jsx(CalculatorIcon, { className: "h-8 w-8 text-white" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white", children: t('accounting.title') }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-1", children: t('accounting.subtitle') })] })] }) }) }), _jsx(AccountingSummary, { totalRevenue: totalRevenue, totalExpenses: totalExpenses, netIncome: netIncome, formatCurrency: formatCurrency }), _jsx("div", { className: "mb-8", children: _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden", children: _jsxs("div", { className: "flex", children: [_jsx("button", { onClick: () => setActiveTab('revenue'), className: `flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${activeTab === 'revenue'
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-b-2 border-blue-500'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`, children: _jsxs("div", { className: "flex items-center justify-center space-x-2", children: [_jsx(TrendingUpIcon, { className: "h-5 w-5" }), _jsx("span", { children: t('accounting.revenue.title') })] }) }), _jsx("button", { onClick: () => setActiveTab('expenses'), className: `flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${activeTab === 'expenses'
                                        ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-b-2 border-red-500'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`, children: _jsxs("div", { className: "flex items-center justify-center space-x-2", children: [_jsx(ArrowTrendingDownIcon, { className: "h-5 w-5" }), _jsx("span", { children: t('accounting.expenses.title') })] }) })] }) }) }), _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden", children: activeTab === 'revenue' ? (_jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 dark:text-white", children: t('accounting.revenue.title') }), _jsxs("button", { onClick: () => setIsRevenueModalOpen(true), className: "inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md", children: [_jsx(PlusIcon, { className: "h-5 w-5 mr-2" }), t('accounting.revenue.addButton')] })] }), revenue.length > 0 ? (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [_jsx("thead", { className: "bg-gray-50 dark:bg-gray-700", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t('accounting.revenue.table.date') }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t('accounting.revenue.table.description') }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t('accounting.revenue.table.customer') }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t('accounting.revenue.table.amount') }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t('accounting.revenue.table.actions') })] }) }), _jsx("tbody", { className: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700", children: revenue.map((revenueItem) => (_jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100", children: formatDate(revenueItem.date) }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900 dark:text-gray-100", children: revenueItem.description }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-500 dark:text-gray-400", children: revenueItem.category || '-' }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400", children: formatCurrency(revenueItem.amount) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: () => handleGenerateInvoice(revenueItem), className: "p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-150", title: t('accounting.revenue.actions.generateInvoice'), children: _jsx(DocumentIcon, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => handleDeleteRevenue(revenueItem.id), className: "p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-150", title: t('accounting.revenue.actions.delete'), children: _jsx(TrashIcon, { className: "h-4 w-4" }) })] }) })] }, revenueItem.id))) })] }) })) : (_jsxs("div", { className: "text-center py-12", children: [_jsx(BanknotesIcon, { className: "h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white mb-2", children: t('accounting.revenue.noData') }), _jsx("p", { className: "text-gray-500 dark:text-gray-400 mb-6", children: t('accounting.revenue.noDataDescription') }), _jsxs("button", { onClick: () => setIsRevenueModalOpen(true), className: "inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md", children: [_jsx(PlusIcon, { className: "h-5 w-5 mr-2" }), t('accounting.revenue.addButton')] })] }))] })) : (_jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 dark:text-white", children: t('accounting.expenses.title') }), _jsxs("button", { onClick: () => setIsExpenseModalOpen(true), className: "inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md", children: [_jsx(PlusIcon, { className: "h-5 w-5 mr-2" }), t('accounting.expenses.addButton')] })] }), expenses.length > 0 ? (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [_jsx("thead", { className: "bg-gray-50 dark:bg-gray-700", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t('accounting.expenses.table.date') }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t('accounting.expenses.table.description') }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t('accounting.expenses.table.vendor') }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t('accounting.expenses.table.category') }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t('accounting.expenses.table.amount') }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t('accounting.expenses.table.actions') })] }) }), _jsx("tbody", { className: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700", children: expenses.map((expense) => (_jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100", children: formatDate(expense.date) }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900 dark:text-gray-100", children: expense.description }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-500 dark:text-gray-400", children: expense.vendor }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm", children: _jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300", children: t(`accounting.expenses.categories.${expense.category}`) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 dark:text-red-400", children: formatCurrency(expense.amount) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: _jsx("div", { className: "flex items-center space-x-2", children: _jsx("button", { onClick: () => handleDeleteExpense(expense.id), className: "p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-150", title: t('accounting.expenses.actions.delete'), children: _jsx(TrashIcon, { className: "h-4 w-4" }) }) }) })] }, expense.id))) })] }) })) : (_jsxs("div", { className: "text-center py-12", children: [_jsx(ArrowTrendingDownIcon, { className: "h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white mb-2", children: t('accounting.expenses.noData') }), _jsx("p", { className: "text-gray-500 dark:text-gray-400 mb-6", children: t('accounting.expenses.noDataDescription') }), _jsxs("button", { onClick: () => setIsExpenseModalOpen(true), className: "inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md", children: [_jsx(PlusIcon, { className: "h-5 w-5 mr-2" }), t('accounting.expenses.addButton')] })] }))] })) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx("div", { className: "w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-3", children: _jsx("svg", { className: "w-6 h-6 text-purple-600 dark:text-purple-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: t('accounting.posIntegration.title', 'POS Integration') }), _jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 mt-1", children: t('accounting.comingSoon', 'Coming Soon') })] })] }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 text-sm mb-4", children: t('accounting.posIntegration.description', 'Connect your Point-of-Sale system to auto-import daily revenue transactions and eliminate manual data entry.') }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center text-sm text-gray-500 dark:text-gray-400", children: [_jsx(CheckCircleIcon, { className: "w-4 h-4 mr-2 text-green-500" }), t('accounting.posIntegration.feature1', 'Automatic revenue sync')] }), _jsxs("div", { className: "flex items-center text-sm text-gray-500 dark:text-gray-400", children: [_jsx(CheckCircleIcon, { className: "w-4 h-4 mr-2 text-green-500" }), t('accounting.posIntegration.feature2', 'Real-time transaction import')] }), _jsxs("div", { className: "flex items-center text-sm text-gray-500 dark:text-gray-400", children: [_jsx(CheckCircleIcon, { className: "w-4 h-4 mr-2 text-green-500" }), t('accounting.posIntegration.feature3', 'Support for UAE POS systems')] })] }), _jsx("button", { disabled: true, className: "w-full mt-4 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed transition-colors", children: t('accounting.posIntegration.connectButton', 'Connect POS System') })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx("div", { className: "w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3", children: _jsx("svg", { className: "w-6 h-6 text-blue-600 dark:text-blue-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: t('accounting.bankImport.title', 'Bank Statement Import') }), _jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 mt-1", children: t('accounting.available', 'Available') })] })] }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 text-sm mb-4", children: t('accounting.bankImport.description', 'Upload CSV files from your bank to automatically match expenses and simplify reconciliation process.') }), _jsxs("div", { className: "space-y-3 mb-4", children: [_jsxs("div", { className: "flex items-center text-sm text-gray-500 dark:text-gray-400", children: [_jsx(CheckCircleIcon, { className: "w-4 h-4 mr-2 text-green-500" }), t('accounting.bankImport.feature1', 'Support for UAE banks (CBD, FAB, ENBD)')] }), _jsxs("div", { className: "flex items-center text-sm text-gray-500 dark:text-gray-400", children: [_jsx(CheckCircleIcon, { className: "w-4 h-4 mr-2 text-green-500" }), t('accounting.bankImport.feature2', 'Automatic expense matching')] }), _jsxs("div", { className: "flex items-center text-sm text-gray-500 dark:text-gray-400", children: [_jsx(CheckCircleIcon, { className: "w-4 h-4 mr-2 text-green-500" }), t('accounting.bankImport.feature3', 'CSV format validation')] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("input", { type: "file", accept: ".csv", onChange: handleBankUpload, className: "block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-400", id: "bank-csv-upload" }), _jsx("button", { onClick: () => document.getElementById('bank-csv-upload')?.click(), className: "w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors", children: t('accounting.bankImport.uploadButton', 'Upload Bank CSV') })] })] })] }), _jsx(RevenueModal, { isOpen: isRevenueModalOpen, onClose: () => {
                        setIsRevenueModalOpen(false);
                        setEditingRevenue(null);
                    }, onSave: editingRevenue ? handleUpdateRevenue : handleAddRevenue, editingRevenue: editingRevenue }), _jsx(ExpenseModal, { isOpen: isExpenseModalOpen, onClose: () => {
                        setIsExpenseModalOpen(false);
                        setEditingExpense(null);
                    }, onSave: editingExpense ? handleUpdateExpense : handleAddExpense, editingExpense: editingExpense }), _jsx(InvoiceModal, { isOpen: isInvoiceModalOpen, onClose: () => {
                        setIsInvoiceModalOpen(false);
                        setSelectedRevenueForInvoice(null);
                    }, revenueData: selectedRevenueForInvoice ? {
                        description: selectedRevenueForInvoice.description,
                        amount: selectedRevenueForInvoice.amount,
                        customer: selectedRevenueForInvoice.customer,
                        date: selectedRevenueForInvoice.date
                    } : null })] }) }));
};
export default Accounting;
