import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Alert, Chip, useTheme, alpha } from '@mui/material';
import { useTranslation } from 'react-i18next';
export const BalanceSheet = ({ data, netIncome }) => {
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const assets = data.filter(item => item.type === 'asset');
    const liabilities = data.filter(item => item.type === 'liability');
    const equity = data.filter(item => item.type === 'equity');
    const totalAssets = assets.reduce((sum, item) => sum + item.amount, 0);
    const totalLiabilities = liabilities.reduce((sum, item) => sum + item.amount, 0);
    const totalEquity = equity.reduce((sum, item) => sum + item.amount, 0) + netIncome;
    const isBalanced = Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01;
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
    const assetGroups = groupByCategory(assets);
    const liabilityGroups = groupByCategory(liabilities);
    const equityGroups = groupByCategory(equity);
    const renderSection = (title, groups, total, color) => (_jsx(TableContainer, { component: Paper, sx: { mb: 2, borderRadius: 2 }, children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsx(TableRow, { sx: { backgroundColor: alpha(color, 0.1) }, children: _jsx(TableCell, { colSpan: 2, children: _jsx(Typography, { variant: "h6", sx: { fontWeight: 600, color }, children: title }) }) }) }), _jsxs(TableBody, { children: [Object.entries(groups).map(([category, items]) => (_jsxs(React.Fragment, { children: [_jsxs(TableRow, { children: [_jsx(TableCell, { sx: { pl: 2, fontWeight: 500 }, children: category }), _jsx(TableCell, { align: "right", sx: { fontWeight: 500 }, children: formatCurrency(items.reduce((sum, item) => sum + item.amount, 0)) })] }), items.map(item => (_jsxs(TableRow, { children: [_jsx(TableCell, { sx: { pl: 4, fontSize: '0.875rem', color: 'text.secondary' }, children: item.description }), _jsx(TableCell, { align: "right", sx: { fontSize: '0.875rem', color: 'text.secondary' }, children: formatCurrency(item.amount) })] }, item.id)))] }, category))), title === t('financials.equity', 'Equity') && netIncome !== 0 && (_jsxs(TableRow, { children: [_jsx(TableCell, { sx: { pl: 2, fontWeight: 500 }, children: t('financials.retainedEarnings', 'Retained Earnings') }), _jsx(TableCell, { align: "right", sx: { fontWeight: 500 }, children: formatCurrency(netIncome) })] })), _jsxs(TableRow, { children: [_jsxs(TableCell, { sx: {
                                        fontWeight: 600,
                                        borderTop: 2,
                                        borderColor: color,
                                        backgroundColor: alpha(color, 0.05)
                                    }, children: [t('financials.total', 'Total'), " ", title] }), _jsx(TableCell, { align: "right", sx: {
                                        fontWeight: 600,
                                        borderTop: 2,
                                        borderColor: color,
                                        backgroundColor: alpha(color, 0.05),
                                        color
                                    }, children: formatCurrency(total) })] })] })] }) }));
    return (_jsx(Box, { sx: { direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }, children: _jsxs(Paper, { sx: {
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: theme.shadows[4],
                mb: 3
            }, children: [_jsxs(Box, { sx: {
                        p: 3,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "h5", sx: { fontWeight: 600 }, children: t('financials.balanceSheet', 'Balance Sheet') }), _jsxs(Typography, { variant: "body2", color: "text.secondary", sx: { mt: 1 }, children: [t('financials.asOf', 'As of'), " ", new Date().toLocaleDateString()] })] }), _jsx(Chip, { label: isBalanced ? t('financials.balanced', 'Balanced') : t('financials.unbalanced', 'Unbalanced'), color: isBalanced ? 'success' : 'error', sx: { fontSize: '0.9rem', fontWeight: 600 } })] }), !isBalanced && (_jsxs(Alert, { severity: "warning", sx: { m: 3, borderRadius: 2 }, children: [t('financials.imbalanceWarning', 'Warning: Balance Sheet is not balanced. Assets must equal Liabilities + Equity.'), _jsx("br", {}), _jsxs(Typography, { variant: "body2", sx: { mt: 1 }, children: [t('financials.difference', 'Difference'), ": ", formatCurrency(Math.abs(totalAssets - (totalLiabilities + totalEquity)))] })] })), _jsxs(Grid, { container: true, spacing: 3, sx: { p: 3 }, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: renderSection(t('financials.assets', 'Assets'), assetGroups, totalAssets, theme.palette.info.main) }), _jsxs(Grid, { item: true, xs: 12, md: 6, children: [renderSection(t('financials.liabilities', 'Liabilities'), liabilityGroups, totalLiabilities, theme.palette.warning.main), renderSection(t('financials.equity', 'Equity'), equityGroups, totalEquity, theme.palette.secondary.main), _jsx(Paper, { sx: { borderRadius: 2, backgroundColor: alpha(theme.palette.primary.main, 0.05) }, children: _jsxs(Box, { sx: { p: 2 }, children: [_jsx(Typography, { variant: "h6", sx: {
                                                    fontWeight: 700,
                                                    textAlign: 'center',
                                                    color: theme.palette.primary.main
                                                }, children: t('financials.totalLiabilitiesEquity', 'Total Liabilities + Equity') }), _jsx(Typography, { variant: "h5", sx: {
                                                    fontWeight: 700,
                                                    textAlign: 'center',
                                                    color: theme.palette.primary.main,
                                                    mt: 1
                                                }, children: formatCurrency(totalLiabilities + totalEquity) })] }) })] })] })] }) }));
};
