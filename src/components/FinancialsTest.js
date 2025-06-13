import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography, Button } from '@mui/material';
import { useFinance } from '../context/FinanceContext';
const FinancialsTest = () => {
    console.log('FinancialsTest component rendering...');
    try {
        const finance = useFinance();
        console.log('Finance context in test:', finance);
        return (_jsxs(Box, { sx: { p: 3 }, children: [_jsx(Typography, { variant: "h4", sx: { mb: 2 }, children: "\u2705 Financials Test - SUCCESS" }), _jsx(Typography, { variant: "body1", sx: { mb: 2 }, children: "Finance context loaded successfully!" }), _jsxs(Typography, { variant: "body2", children: ["Revenue entries: ", finance.revenue?.length || 0] }), _jsxs(Typography, { variant: "body2", children: ["Expense entries: ", finance.expenses?.length || 0] }), _jsxs(Typography, { variant: "body2", children: ["Total Revenue: AED ", finance.getTotalRevenue?.() || 0] }), _jsxs(Typography, { variant: "body2", children: ["Total Expenses: AED ", finance.getTotalExpenses?.() || 0] }), _jsx(Button, { variant: "contained", sx: { mt: 2 }, onClick: () => window.location.href = '/financials', children: "Go to Full Financials Page" })] }));
    }
    catch (error) {
        console.error('Error in FinancialsTest:', error);
        return (_jsxs(Box, { sx: { p: 3 }, children: [_jsx(Typography, { variant: "h4", color: "error", sx: { mb: 2 }, children: "\u274C Financials Test - FAILED" }), _jsxs(Typography, { variant: "body1", color: "error", children: ["Error: ", error instanceof Error ? error.message : 'Unknown error'] })] }));
    }
};
export default FinancialsTest;
