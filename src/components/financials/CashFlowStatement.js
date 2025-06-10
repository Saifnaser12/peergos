import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableRow, useTheme, alpha } from '@mui/material';
import { useTranslation } from 'react-i18next';
export const CashFlowStatement = ({ data, netIncome }) => {
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-AE' : 'en-AE', {
            style: 'currency',
            currency: 'AED'
        }).format(amount);
    };
    // Mock cash flow calculations (in a real app, this would be based on actual cash movements)
    const operatingActivities = {
        netIncome,
        depreciation: 15000, // Mock depreciation
        accountsReceivableChange: -5000, // Increase in receivables
        accountsPayableChange: 8000, // Increase in payables
        inventoryChange: -12000, // Increase in inventory
        prepaidExpensesChange: -2000, // Increase in prepaid expenses
    };
    const investingActivities = {
        equipmentPurchases: -25000, // Purchase of equipment
        equipmentSales: 0, // Sale of equipment
        investmentPurchases: -10000, // Purchase of investments
        investmentSales: 0, // Sale of investments
    };
    const financingActivities = {
        loanProceeds: 20000, // New loan proceeds
        loanRepayments: -8000, // Loan repayments
        ownerContributions: 15000, // Owner capital contributions
        ownerWithdrawals: -5000, // Owner withdrawals
        dividendPayments: 0, // Dividend payments
    };
    const operatingCashFlow = Object.values(operatingActivities).reduce((sum, val) => sum + val, 0);
    const investingCashFlow = Object.values(investingActivities).reduce((sum, val) => sum + val, 0);
    const financingCashFlow = Object.values(financingActivities).reduce((sum, val) => sum + val, 0);
    const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow;
    const renderSection = (title, items, total, color) => (_jsxs(_Fragment, { children: [_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 2, sx: { backgroundColor: alpha(color, 0.1), py: 2 }, children: _jsx(Typography, { variant: "h6", sx: { fontWeight: 600, color }, children: title }) }) }), Object.entries(items).map(([key, value]) => (_jsxs(TableRow, { children: [_jsx(TableCell, { sx: { pl: 4 }, children: t(`cashFlow.${key}`, key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())) }), _jsx(TableCell, { align: "right", sx: {
                            color: value >= 0 ? theme.palette.success.main : theme.palette.error.main
                        }, children: formatCurrency(value) })] }, key))), _jsxs(TableRow, { children: [_jsxs(TableCell, { sx: {
                            fontWeight: 600,
                            borderTop: 2,
                            borderColor: color,
                            backgroundColor: alpha(color, 0.05),
                            pl: 2
                        }, children: [t('cashFlow.totalFrom', 'Total from'), " ", title] }), _jsx(TableCell, { align: "right", sx: {
                            fontWeight: 600,
                            borderTop: 2,
                            borderColor: color,
                            backgroundColor: alpha(color, 0.05),
                            color
                        }, children: formatCurrency(total) })] })] }));
    return (_jsxs(Paper, { sx: {
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: theme.shadows[4],
            direction: i18n.language === 'ar' ? 'rtl' : 'ltr'
        }, children: [_jsxs(Box, { sx: {
                    p: 3,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    backgroundColor: alpha(theme.palette.info.main, 0.1)
                }, children: [_jsx(Typography, { variant: "h5", sx: { fontWeight: 600, textAlign: 'center' }, children: t('financials.cashFlowStatement', 'Cash Flow Statement') }), _jsxs(Typography, { variant: "body2", color: "text.secondary", sx: { textAlign: 'center', mt: 1 }, children: [t('financials.subtitle', 'For the period ending'), " ", new Date().toLocaleDateString()] })] }), _jsx(TableContainer, { children: _jsx(Table, { children: _jsxs(TableBody, { children: [renderSection(t('cashFlow.operatingActivities', 'Cash Flows from Operating Activities'), operatingActivities, operatingCashFlow, theme.palette.primary.main), renderSection(t('cashFlow.investingActivities', 'Cash Flows from Investing Activities'), investingActivities, investingCashFlow, theme.palette.secondary.main), renderSection(t('cashFlow.financingActivities', 'Cash Flows from Financing Activities'), financingActivities, financingCashFlow, theme.palette.info.main), _jsxs(TableRow, { children: [_jsx(TableCell, { sx: {
                                            fontWeight: 700,
                                            fontSize: '1.1rem',
                                            borderTop: 3,
                                            borderColor: theme.palette.warning.main,
                                            backgroundColor: alpha(theme.palette.warning.main, 0.05),
                                            py: 2
                                        }, children: t('cashFlow.netCashFlow', 'Net Increase (Decrease) in Cash') }), _jsx(TableCell, { align: "right", sx: {
                                            fontWeight: 700,
                                            fontSize: '1.1rem',
                                            borderTop: 3,
                                            borderColor: theme.palette.warning.main,
                                            backgroundColor: alpha(theme.palette.warning.main, 0.05),
                                            color: netCashFlow >= 0 ? theme.palette.success.main : theme.palette.error.main,
                                            py: 2
                                        }, children: formatCurrency(netCashFlow) })] }), _jsxs(TableRow, { children: [_jsx(TableCell, { sx: { fontWeight: 500, pt: 2 }, children: t('cashFlow.beginningCash', 'Cash at Beginning of Period') }), _jsxs(TableCell, { align: "right", sx: { pt: 2 }, children: [formatCurrency(50000), " "] })] }), _jsxs(TableRow, { children: [_jsx(TableCell, { sx: {
                                            fontWeight: 600,
                                            borderTop: 1,
                                            borderColor: theme.palette.divider
                                        }, children: t('cashFlow.endingCash', 'Cash at End of Period') }), _jsx(TableCell, { align: "right", sx: {
                                            fontWeight: 600,
                                            borderTop: 1,
                                            borderColor: theme.palette.divider,
                                            color: theme.palette.primary.main
                                        }, children: formatCurrency(50000 + netCashFlow) })] })] }) }) })] }));
};
