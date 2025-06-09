import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFinance } from '../../context/FinanceContext';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, ExclamationTriangleIcon, ChartBarIcon } from '@heroicons/react/24/outline';
const SmartTotalsPanel = ({ isCollapsed = false, onToggle }) => {
    const { t } = useTranslation();
    const { getTotalRevenue, getTotalExpenses, getNetIncome } = useFinance();
    const [animationTrigger, setAnimationTrigger] = useState(0);
    const totalRevenue = getTotalRevenue();
    const totalExpenses = getTotalExpenses();
    const netIncome = getNetIncome();
    // Calculate financial health indicators
    const expenseRatio = totalRevenue > 0 ? (totalExpenses / totalRevenue) * 100 : 0;
    const profitMargin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;
    // Anomaly detection
    const highExpenseRatio = expenseRatio > 80;
    const lowProfitMargin = profitMargin < 10 && totalRevenue > 0;
    const hasAnomalies = highExpenseRatio || lowProfitMargin;
    // Listen for real-time updates
    useEffect(() => {
        const handleUpdate = () => {
            setAnimationTrigger(prev => prev + 1);
        };
        window.addEventListener('revenue-saved', handleUpdate);
        window.addEventListener('expense-saved', handleUpdate);
        return () => {
            window.removeEventListener('revenue-saved', handleUpdate);
            window.removeEventListener('expense-saved', handleUpdate);
        };
    }, []);
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: 'AED',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };
    if (isCollapsed) {
        return (_jsx("div", { className: "fixed top-20 right-4 z-40", children: _jsxs("button", { onClick: onToggle, className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200", children: [_jsx(ChartBarIcon, { className: "h-5 w-5 text-gray-600 dark:text-gray-400" }), hasAnomalies && (_jsx("div", { className: "absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" }))] }) }));
    }
    return (_jsx("div", { className: "fixed top-20 right-4 z-40 w-80", children: _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden", children: [_jsxs("div", { className: "bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 flex items-center justify-between", children: [_jsxs("h3", { className: "text-white font-semibold text-sm flex items-center", children: [_jsx(ChartBarIcon, { className: "h-4 w-4 mr-2" }), t('smartTotals.title', 'Financial Summary')] }), _jsx("button", { onClick: onToggle, className: "text-white/80 hover:text-white transition-colors", children: _jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsxs("div", { className: "p-4 space-y-4", children: [_jsxs("div", { className: `flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg transition-all duration-500 ${animationTrigger ? 'scale-105' : ''}`, children: [_jsxs("div", { className: "flex items-center", children: [_jsx(ArrowTrendingUpIcon, { className: "h-5 w-5 text-green-600 dark:text-green-400 mr-2" }), _jsx("span", { className: "text-sm font-medium text-green-800 dark:text-green-200", children: t('smartTotals.revenue', 'Revenue') })] }), _jsx("span", { className: "text-lg font-bold text-green-900 dark:text-green-100", children: formatCurrency(totalRevenue) })] }), _jsxs("div", { className: `flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg transition-all duration-500 ${animationTrigger ? 'scale-105' : ''}`, children: [_jsxs("div", { className: "flex items-center", children: [_jsx(ArrowTrendingDownIcon, { className: "h-5 w-5 text-red-600 dark:text-red-400 mr-2" }), _jsx("span", { className: "text-sm font-medium text-red-800 dark:text-red-200", children: t('smartTotals.expenses', 'Expenses') })] }), _jsx("span", { className: "text-lg font-bold text-red-900 dark:text-red-100", children: formatCurrency(totalExpenses) })] }), _jsxs("div", { className: `flex items-center justify-between p-3 rounded-lg transition-all duration-500 ${netIncome >= 0
                                ? 'bg-blue-50 dark:bg-blue-900/20'
                                : 'bg-red-50 dark:bg-red-900/20'} ${animationTrigger ? 'scale-105' : ''}`, children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `h-5 w-5 mr-2 ${netIncome >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`, children: netIncome >= 0 ?
                                                _jsx(ArrowTrendingUpIcon, { className: "h-5 w-5" }) :
                                                _jsx(ArrowTrendingDownIcon, { className: "h-5 w-5" }) }), _jsx("span", { className: `text-sm font-medium ${netIncome >= 0
                                                ? 'text-blue-800 dark:text-blue-200'
                                                : 'text-red-800 dark:text-red-200'}`, children: t('smartTotals.netIncome', 'Net Income') })] }), _jsx("span", { className: `text-lg font-bold ${netIncome >= 0
                                        ? 'text-blue-900 dark:text-blue-100'
                                        : 'text-red-900 dark:text-red-100'}`, children: formatCurrency(netIncome) })] }), _jsxs("div", { className: "pt-2 border-t border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2", children: [_jsx("span", { children: t('smartTotals.expenseRatio', 'Expense Ratio') }), _jsxs("span", { className: highExpenseRatio ? 'text-red-600 dark:text-red-400 font-semibold' : '', children: [expenseRatio.toFixed(1), "%"] })] }), _jsxs("div", { className: "flex justify-between text-xs text-gray-600 dark:text-gray-400", children: [_jsx("span", { children: t('smartTotals.profitMargin', 'Profit Margin') }), _jsxs("span", { className: lowProfitMargin ? 'text-red-600 dark:text-red-400 font-semibold' : '', children: [profitMargin.toFixed(1), "%"] })] })] }), hasAnomalies && (_jsx("div", { className: "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3", children: _jsxs("div", { className: "flex items-start", children: [_jsx(ExclamationTriangleIcon, { className: "h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2 flex-shrink-0" }), _jsxs("div", { className: "text-xs", children: [_jsx("p", { className: "font-medium text-yellow-800 dark:text-yellow-200 mb-1", children: t('smartTotals.anomalyDetected', 'Financial Anomaly Detected') }), highExpenseRatio && (_jsx("p", { className: "text-yellow-700 dark:text-yellow-300", children: t('smartTotals.highExpenseRatio', 'High expense ratio (>80%)') })), lowProfitMargin && (_jsx("p", { className: "text-yellow-700 dark:text-yellow-300", children: t('smartTotals.lowProfitMargin', 'Low profit margin (<10%)') }))] })] }) }))] })] }) }));
};
export default SmartTotalsPanel;
