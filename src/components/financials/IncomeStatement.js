import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableRow, useTheme, alpha } from '@mui/material';
import { useTranslation } from 'react-i18next';
export const IncomeStatement = ({ data }) => {
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const revenues = data.filter(item => item.type === 'revenue');
    const expenses = data.filter(item => item.type === 'expense');
    const totalRevenue = revenues.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const netIncome = totalRevenue - totalExpenses;
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-AE' : 'en-AE', {
            style: 'currency',
            currency: 'AED'
        }).format(amount);
    };
    const groupByCategory = (items) => {
        return items.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {});
    };
    const revenueGroups = groupByCategory(revenues);
    const expenseGroups = groupByCategory(expenses);
    return (_jsxs(Paper, { sx: {
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: theme.shadows[4],
            direction: i18n.language === 'ar' ? 'rtl' : 'ltr'
        }, children: [_jsxs(Box, { sx: {
                    p: 3,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1)
                }, children: [_jsx(Typography, { variant: "h5", sx: { fontWeight: 600, textAlign: 'center' }, children: t('financials.incomeStatement', 'Income Statement') }), _jsxs(Typography, { variant: "body2", color: "text.secondary", sx: { textAlign: 'center', mt: 1 }, children: [t('financials.subtitle', 'For the period ending'), " ", new Date().toLocaleDateString()] })] }), _jsx(TableContainer, { children: _jsx(Table, { children: _jsxs(TableBody, { children: [_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 2, sx: { backgroundColor: alpha(theme.palette.success.main, 0.1) }, children: _jsx(Typography, { variant: "h6", sx: { fontWeight: 600, color: theme.palette.success.main }, children: t('financials.revenue', 'Revenue') }) }) }), Object.entries(revenueGroups).map(([category, items]) => (_jsxs(React.Fragment, { children: [_jsxs(TableRow, { children: [_jsx(TableCell, { sx: { pl: 4, fontWeight: 500 }, children: category }), _jsx(TableCell, { align: "right", sx: { fontWeight: 500 }, children: formatCurrency(items.reduce((sum, item) => sum + item.amount, 0)) })] }), items.map(item => (_jsxs(TableRow, { children: [_jsx(TableCell, { sx: { pl: 6, fontSize: '0.875rem', color: 'text.secondary' }, children: item.description }), _jsx(TableCell, { align: "right", sx: { fontSize: '0.875rem', color: 'text.secondary' }, children: formatCurrency(item.amount) })] }, item.id)))] }, category))), _jsxs(TableRow, { children: [_jsx(TableCell, { sx: { fontWeight: 600, borderTop: 2 }, children: t('financials.totalRevenue', 'Total Revenue') }), _jsx(TableCell, { align: "right", sx: { fontWeight: 600, borderTop: 2, color: theme.palette.success.main }, children: formatCurrency(totalRevenue) })] }), _jsx(TableRow, { children: _jsx(TableCell, { colSpan: 2, sx: { backgroundColor: alpha(theme.palette.error.main, 0.1), pt: 3 }, children: _jsx(Typography, { variant: "h6", sx: { fontWeight: 600, color: theme.palette.error.main }, children: t('financials.expenses', 'Expenses') }) }) }), Object.entries(expenseGroups).map(([category, items]) => (_jsxs(React.Fragment, { children: [_jsxs(TableRow, { children: [_jsx(TableCell, { sx: { pl: 4, fontWeight: 500 }, children: category }), _jsx(TableCell, { align: "right", sx: { fontWeight: 500 }, children: formatCurrency(items.reduce((sum, item) => sum + item.amount, 0)) })] }), items.map(item => (_jsxs(TableRow, { children: [_jsx(TableCell, { sx: { pl: 6, fontSize: '0.875rem', color: 'text.secondary' }, children: item.description }), _jsx(TableCell, { align: "right", sx: { fontSize: '0.875rem', color: 'text.secondary' }, children: formatCurrency(item.amount) })] }, item.id)))] }, category))), _jsxs(TableRow, { children: [_jsx(TableCell, { sx: { fontWeight: 600, borderTop: 2 }, children: t('financials.totalExpenses', 'Total Expenses') }), _jsx(TableCell, { align: "right", sx: { fontWeight: 600, borderTop: 2, color: theme.palette.error.main }, children: formatCurrency(totalExpenses) })] }), _jsxs(TableRow, { children: [_jsx(TableCell, { sx: {
                                            fontWeight: 700,
                                            fontSize: '1.1rem',
                                            borderTop: 3,
                                            borderColor: theme.palette.primary.main,
                                            backgroundColor: alpha(theme.palette.primary.main, 0.05)
                                        }, children: t('financials.netIncome', 'Net Income') }), _jsx(TableCell, { align: "right", sx: {
                                            fontWeight: 700,
                                            fontSize: '1.1rem',
                                            borderTop: 3,
                                            borderColor: theme.palette.primary.main,
                                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                            color: netIncome >= 0 ? theme.palette.success.main : theme.palette.error.main
                                        }, children: formatCurrency(netIncome) })] })] }) }) })] }));
};
