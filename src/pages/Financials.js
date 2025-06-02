import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTax } from '../context/TaxContext';
import { useSettings } from '../context/SettingsContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
const Financials = () => {
    const { t } = useTranslation();
    const { state } = useTax();
    const { formatCurrency } = useSettings();
    const [balanceSheet, setBalanceSheet] = useState({
        currentAssets: 0,
        fixedAssets: 0,
        currentLiabilities: 0,
        longTermLiabilities: 0
    });
    // Calculate Income Statement values
    const totalRevenue = state.revenues.reduce((sum, entry) => sum + entry.amount, 0);
    const totalExpenses = state.expenses.reduce((sum, entry) => sum + entry.amount, 0);
    const netIncome = totalRevenue - totalExpenses;
    // Calculate Balance Sheet values
    const totalAssets = balanceSheet.currentAssets + balanceSheet.fixedAssets;
    const totalLiabilities = balanceSheet.currentLiabilities + balanceSheet.longTermLiabilities;
    const totalEquity = totalAssets - totalLiabilities;
    const handleBalanceSheetChange = (field) => (e) => {
        const value = parseFloat(e.target.value) || 0;
        setBalanceSheet(prev => ({
            ...prev,
            [field]: value
        }));
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("section", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-4", children: t('financials.incomeStatement') }), _jsx(Card, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: [_jsx("span", { className: "font-medium", children: t('financials.revenue') }), _jsx("span", { className: "text-green-600 dark:text-green-400", children: formatCurrency(totalRevenue) })] }), _jsxs("div", { className: "flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: [_jsx("span", { className: "font-medium", children: t('financials.expenses') }), _jsx("span", { className: "text-red-600 dark:text-red-400", children: formatCurrency(totalExpenses) })] }), _jsxs("div", { className: "flex justify-between items-center p-4 bg-indigo-50 dark:bg-indigo-900/50 rounded-lg", children: [_jsx("span", { className: "font-semibold", children: t('financials.netIncome') }), _jsx("span", { className: `font-semibold ${netIncome >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`, children: formatCurrency(netIncome) })] })] }) })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-4", children: t('financials.balanceSheet') }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: t('financials.assets') }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: t('financials.currentAssets') }), _jsx("input", { type: "number", value: balanceSheet.currentAssets, onChange: handleBalanceSheetChange('currentAssets'), className: "block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: t('financials.fixedAssets') }), _jsx("input", { type: "number", value: balanceSheet.fixedAssets, onChange: handleBalanceSheetChange('fixedAssets'), className: "block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" })] }), _jsx("div", { className: "pt-4 border-t border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "font-semibold", children: t('financials.totalAssets') }), _jsx("span", { className: "font-semibold text-green-600 dark:text-green-400", children: formatCurrency(totalAssets) })] }) })] })] }), _jsxs(Card, { children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: t('financials.liabilities') }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: t('financials.currentLiabilities') }), _jsx("input", { type: "number", value: balanceSheet.currentLiabilities, onChange: handleBalanceSheetChange('currentLiabilities'), className: "block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: t('financials.longTermLiabilities') }), _jsx("input", { type: "number", value: balanceSheet.longTermLiabilities, onChange: handleBalanceSheetChange('longTermLiabilities'), className: "block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" })] }), _jsx("div", { className: "pt-4 border-t border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "font-semibold", children: t('financials.totalLiabilities') }), _jsx("span", { className: "font-semibold text-red-600 dark:text-red-400", children: formatCurrency(totalLiabilities) })] }) }), _jsx("div", { className: "pt-4 border-t border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "font-semibold", children: t('financials.totalEquity') }), _jsx("span", { className: `font-semibold ${totalEquity >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`, children: formatCurrency(totalEquity) })] }) })] })] })] })] }), _jsx("div", { className: "flex justify-end", children: _jsx(Button, { variant: "primary", icon: _jsx(ArrowDownTrayIcon, { className: "h-5 w-5" }), onClick: () => {
                        // TODO: Implement export functionality
                        console.log('Export financials');
                    }, children: t('common.export') }) })] }));
};
export default Financials;
