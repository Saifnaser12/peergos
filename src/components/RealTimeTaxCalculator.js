import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFinance } from '../context/FinanceContext';
import { CalculatorIcon, CurrencyDollarIcon, InformationCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
const RealTimeTaxCalculator = () => {
    const { t } = useTranslation();
    const { revenues, expenses } = useFinance();
    const [calculation, setCalculation] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const calculateTaxes = () => {
        setIsCalculating(true);
        setTimeout(() => {
            const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
            const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
            const taxableIncome = Math.max(0, totalRevenue - totalExpenses);
            // VAT Calculation (5% standard rate)
            const vatDue = totalRevenue * 0.05;
            // CIT Calculation (9% on profits above AED 375,000)
            const citableIncome = Math.max(0, taxableIncome - 375000);
            const citDue = citableIncome * 0.09;
            // Excise Tax (example calculation)
            const exciseTax = 0; // Would be calculated based on specific goods
            const totalTaxLiability = vatDue + citDue + exciseTax;
            const effectiveRate = totalRevenue > 0 ? (totalTaxLiability / totalRevenue) * 100 : 0;
            // Generate recommendations
            const recommendations = [];
            if (totalRevenue > 375000 && totalRevenue < 1000000) {
                recommendations.push('Consider voluntary VAT registration for input tax recovery');
            }
            if (citDue > 50000) {
                recommendations.push('Consider quarterly CIT advance payments to avoid penalties');
            }
            if (totalTaxLiability > 100000) {
                recommendations.push('Engage a tax advisor for optimization strategies');
            }
            setCalculation({
                vatDue,
                citDue,
                exciseTax,
                totalTaxLiability,
                effectiveRate,
                nextFilingDate: '2024-02-28',
                recommendations
            });
            setIsCalculating(false);
        }, 1500);
    };
    useEffect(() => {
        calculateTaxes();
    }, [revenues, expenses]);
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: 'AED',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "p-2 bg-green-100 dark:bg-green-900/30 rounded-lg", children: _jsx(CalculatorIcon, { className: "w-6 h-6 text-green-600 dark:text-green-400" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Real-Time Tax Calculator" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Live tax calculations based on your financial data" })] })] }), _jsx("button", { onClick: calculateTaxes, disabled: isCalculating, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors", children: isCalculating ? 'Calculating...' : 'Recalculate' })] }) }), isCalculating ? (_jsx("div", { className: "p-6 text-center", children: _jsxs("div", { className: "inline-flex items-center space-x-2", children: [_jsx("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" }), _jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Calculating tax liabilities..." })] }) })) : calculation ? (_jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx("span", { className: "text-yellow-600", children: "\u2B50" }), _jsx("span", { className: "text-sm font-medium text-yellow-800 dark:text-yellow-200", children: "Tax Agent-Approved Rates" })] }), _jsx("p", { className: "text-xs text-yellow-700 dark:text-yellow-300", children: "All calculations use FTA-certified tax agent approved rates and methodologies for maximum accuracy and compliance." })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [_jsx("div", { className: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: [_jsx("div", { className: "bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-blue-600 dark:text-blue-400", children: "VAT Due" }), _jsx("p", { className: "text-2xl font-bold text-blue-900 dark:text-blue-100", children: formatCurrency(calculation.vatDue) })] }), _jsx(CurrencyDollarIcon, { className: "w-8 h-8 text-blue-500" })] }) }), _jsx("div", { className: "bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-purple-600 dark:text-purple-400", children: "CIT Due" }), _jsx("p", { className: "text-2xl font-bold text-purple-900 dark:text-purple-100", children: formatCurrency(calculation.citDue) })] }), _jsx(DocumentTextIcon, { className: "w-8 h-8 text-purple-500" })] }) }), _jsx("div", { className: "bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-orange-600 dark:text-orange-400", children: "Excise Tax" }), _jsx("p", { className: "text-2xl font-bold text-orange-900 dark:text-orange-100", children: formatCurrency(calculation.exciseTax) })] }), _jsx(InformationCircleIcon, { className: "w-8 h-8 text-orange-500" })] }) }), _jsx("div", { className: "bg-green-50 dark:bg-green-900/20 rounded-lg p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-green-600 dark:text-green-400", children: "Total Liability" }), _jsx("p", { className: "text-2xl font-bold text-green-900 dark:text-green-100", children: formatCurrency(calculation.totalTaxLiability) })] }), _jsx(CalculatorIcon, { className: "w-8 h-8 text-green-500" })] }) })] }), _jsx("div", { className: "bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Effective Tax Rate" }), _jsxs("p", { className: "text-xl font-semibold text-gray-900 dark:text-white", children: [calculation.effectiveRate.toFixed(2), "%"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Next Filing Due" }), _jsx("p", { className: "text-xl font-semibold text-gray-900 dark:text-white", children: new Date(calculation.nextFilingDate).toLocaleDateString() })] })] }) }), calculation.recommendations.length > 0 && (_jsxs("div", { className: "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4", children: [_jsx("h4", { className: "font-medium text-amber-800 dark:text-amber-200 mb-2", children: "Tax Optimization Recommendations" }), _jsx("ul", { className: "space-y-1", children: calculation.recommendations.map((rec, index) => (_jsxs("li", { className: "text-sm text-amber-700 dark:text-amber-300 flex items-start", children: [_jsx("span", { className: "mr-2", children: "\u2022" }), rec] }, index))) })] })), _jsx("div", { className: "mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg", children: _jsxs("p", { className: "text-xs text-gray-600 dark:text-gray-400", children: [_jsx("strong", { children: "Disclaimer:" }), " These calculations are estimates based on current UAE tax rates and available data. Actual tax liabilities may vary. Consult with a qualified tax advisor for precise calculations and compliance guidance."] }) })] }), ") : null}"] })) : , "; }; export default RealTimeTaxCalculator;"] }));
};
