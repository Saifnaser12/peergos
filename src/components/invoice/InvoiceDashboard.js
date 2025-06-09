import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Grid, Card, CardContent, Typography, Button, IconButton, CircularProgress, Alert, } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
export const InvoiceDashboard = ({ invoices, loading, error, onAdd, onEdit, onDelete, }) => {
    if (loading) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px", children: _jsx(CircularProgress, {}) }));
    }
    if (error) {
        return (_jsx(Box, { mb: 3, children: _jsx(Alert, { severity: "error", children: error }) }));
    }
    return (_jsxs(Box, { children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, children: [_jsx(Typography, { variant: "h5", component: "h1", children: "Invoices" }), _jsx(Button, { variant: "contained", color: "primary", startIcon: _jsx(AddIcon, {}), onClick: onAdd, children: "New Invoice" })] }), _jsx(Grid, { container: true, spacing: 3, children: invoices.map((invoice) => (_jsx(Grid, { item: true, xs: 12, md: 6, lg: 4, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, children: [_jsxs(Typography, { variant: "h6", children: ["Invoice #", invoice.invoiceNumber] }), _jsxs(Box, { children: [_jsx(IconButton, { onClick: () => onEdit(invoice), size: "small", children: _jsx(EditIcon, {}) }), _jsx(IconButton, { onClick: () => onDelete(invoice), size: "small", children: _jsx(DeleteIcon, {}) })] })] }), _jsx(Typography, { variant: "body2", color: "textSecondary", gutterBottom: true, children: new Date(invoice.issueDate).toLocaleDateString() }), _jsx(Typography, { variant: "body1", gutterBottom: true, children: invoice.seller.name }), _jsxs(Box, { display: "flex", justifyContent: "space-between", mt: 2, children: [_jsx(Typography, { variant: "subtitle1", children: "Amount" }), _jsx(Typography, { variant: "subtitle1", children: invoice.amount.toLocaleString('en-AE', {
                                                style: 'currency',
                                                currency: 'AED'
                                            }) })] }), _jsxs(Box, { display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "subtitle1", children: "VAT" }), _jsx(Typography, { variant: "subtitle1", children: invoice.vatAmount.toLocaleString('en-AE', {
                                                style: 'currency',
                                                currency: 'AED'
                                            }) })] })] }) }) }, invoice.id))) })] }));
};
