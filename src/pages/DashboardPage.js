import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { useTax } from '../context/TaxContext';
import { format } from 'date-fns';
import Button from '../components/Button';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
export const DashboardPage = () => {
    const { state: taxData } = useTax();
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [exportStarted, setExportStarted] = useState(false);
    const filteredData = useMemo(() => {
        if (!dateRange.startDate || !dateRange.endDate) {
            return taxData;
        }
        return {
            revenue: taxData.revenue.filter(r => r.date >= dateRange.startDate && r.date <= dateRange.endDate),
            revenues: taxData.revenue.filter(r => r.date >= dateRange.startDate && r.date <= dateRange.endDate),
            expenses: taxData.expenses.filter(e => e.date >= dateRange.startDate && e.date <= dateRange.endDate)
        };
    }, [taxData, dateRange]);
    const metrics = useMemo(() => {
        const totalRevenue = filteredData.revenue.reduce((sum, r) => sum + r.amount, 0);
        const totalExpenses = filteredData.expenses.reduce((sum, e) => sum + e.amount, 0);
        const totalVAT = filteredData.revenue.reduce((sum, r) => sum + (r.vatAmount || 0), 0);
        return {
            totalRevenue,
            totalExpenses,
            totalVAT,
            netIncome: totalRevenue - totalExpenses
        };
    }, [filteredData]);
    const revenueTrendData = useMemo(() => {
        const monthlyData = new Map();
        filteredData.revenue.forEach(revenue => {
            const month = format(new Date(revenue.date), 'MMM yyyy');
            monthlyData.set(month, (monthlyData.get(month) || 0) + revenue.amount);
        });
        return Array.from(monthlyData.entries()).map(([month, amount]) => ({
            month,
            amount
        }));
    }, [filteredData]);
    const expenseBreakdownData = useMemo(() => {
        const categoryData = new Map();
        filteredData.expenses.forEach(expense => {
            categoryData.set(expense.category, (categoryData.get(expense.category) || 0) + expense.amount);
        });
        return Array.from(categoryData.entries()).map(([category, amount]) => ({
            category,
            amount
        }));
    }, [filteredData]);
    const handleExport = async () => {
        setExportStarted(true);
        // Simulating export delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setExportStarted(false);
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-AE', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };
    return (_jsxs("div", { className: "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "md:flex md:items-center md:justify-between mb-8", children: [_jsx("div", { className: "flex-1 min-w-0", children: _jsx("h2", { className: "text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate", children: "Financial Dashboard" }) }), _jsxs("div", { className: "mt-4 flex md:mt-0 md:ml-4 space-x-3", children: [_jsx(Button, { onClick: () => setShowDatePicker(!showDatePicker), variant: "secondary", children: "Date Range" }), _jsx(Button, { onClick: handleExport, children: "Export" })] })] }), showDatePicker && (_jsxs("div", { className: "mb-8 p-4 bg-white shadow rounded-lg", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "startDate", className: "block text-sm font-medium text-gray-700", children: "Start Date" }), _jsx("input", { type: "date", id: "startDate", value: dateRange.startDate, onChange: e => setDateRange(prev => ({ ...prev, startDate: e.target.value })), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "endDate", className: "block text-sm font-medium text-gray-700", children: "End Date" }), _jsx("input", { type: "date", id: "endDate", value: dateRange.endDate, onChange: e => setDateRange(prev => ({ ...prev, endDate: e.target.value })), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" })] })] }), _jsxs("div", { className: "mt-4 flex justify-end", children: [_jsx(Button, { onClick: () => {
                                    setDateRange({ startDate: '', endDate: '' });
                                    setShowDatePicker(false);
                                }, variant: "secondary", className: "mr-3", children: "Reset" }), _jsx(Button, { onClick: () => setShowDatePicker(false), children: "Apply" })] })] })), _jsxs("div", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8", children: [_jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: _jsxs("div", { className: "px-4 py-5 sm:p-6", children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Total Revenue" }), _jsxs("dd", { className: "mt-1 text-3xl font-semibold text-gray-900", children: [formatCurrency(metrics.totalRevenue), " AED"] })] }) }), _jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: _jsxs("div", { className: "px-4 py-5 sm:p-6", children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Total Expenses" }), _jsxs("dd", { className: "mt-1 text-3xl font-semibold text-gray-900", children: [formatCurrency(metrics.totalExpenses), " AED"] })] }) }), _jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: _jsxs("div", { className: "px-4 py-5 sm:p-6", children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Net Income" }), _jsxs("dd", { className: "mt-1 text-3xl font-semibold text-gray-900", children: [formatCurrency(metrics.netIncome), " AED"] })] }) }), _jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: _jsxs("div", { className: "px-4 py-5 sm:p-6", children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Total VAT" }), _jsxs("dd", { className: "mt-1 text-3xl font-semibold text-gray-900", children: [formatCurrency(metrics.totalVAT), " AED"] })] }) })] }), metrics.totalRevenue >= 375000 && (_jsx("div", { className: "rounded-md bg-yellow-50 p-4 mb-8", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "h-5 w-5 text-yellow-400", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }) }), _jsxs("div", { className: "ml-3", children: [_jsx("h3", { className: "text-sm font-medium text-yellow-800", children: "VAT Registration Required" }), _jsx("div", { className: "mt-2 text-sm text-yellow-700", children: _jsx("p", { children: "Your revenue has exceeded the VAT registration threshold of 375,000 AED. Please register for VAT within 30 days." }) })] })] }) })), metrics.totalRevenue >= 1000000 && (_jsx("div", { className: "rounded-md bg-yellow-50 p-4 mb-8", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "h-5 w-5 text-yellow-400", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }) }), _jsxs("div", { className: "ml-3", children: [_jsx("h3", { className: "text-sm font-medium text-yellow-800", children: "Corporate Income Tax Registration Required" }), _jsx("div", { className: "mt-2 text-sm text-yellow-700", children: _jsx("p", { children: "Your revenue has exceeded the CIT registration threshold of 1,000,000 AED. Please register for Corporate Income Tax." }) })] })] }) })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-white shadow rounded-lg p-6", "data-testid": "revenue-trend-chart", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Revenue Trend" }), _jsx("div", { className: "h-80", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { data: revenueTrendData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "month" }), _jsx(YAxis, {}), _jsx(Tooltip, { formatter: (value) => `${formatCurrency(value)} AED` }), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "amount", stroke: "#0088FE", name: "Revenue" })] }) }) })] }), _jsxs("div", { className: "bg-white shadow rounded-lg p-6", "data-testid": "expense-breakdown-chart", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Expense Breakdown" }), _jsx("div", { className: "h-80", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { data: expenseBreakdownData, dataKey: "amount", nameKey: "category", cx: "50%", cy: "50%", outerRadius: 100, label: ({ category, percent }) => `${category} (${(percent * 100).toFixed(0)}%)`, children: expenseBreakdownData.map((_, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, { formatter: (value) => `${formatCurrency(value)} AED` }), _jsx(Legend, {})] }) }) })] })] })] }));
};
