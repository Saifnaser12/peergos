import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Box, Grid, Card, CardContent, Typography, IconButton, } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
export const InvoiceDetail = ({ invoice, onEdit, onDelete, }) => {
    return (_jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, children: [_jsxs(Typography, { variant: "h6", children: ["Invoice #", invoice.invoiceNumber] }), _jsxs(Box, { children: [_jsx(IconButton, { onClick: () => onEdit(invoice), size: "small", children: _jsx(EditIcon, {}) }), _jsx(IconButton, { onClick: () => onDelete(invoice), size: "small", children: _jsx(DeleteIcon, {}) })] })] }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsxs(Grid, { item: true, xs: 12, md: 6, children: [_jsx(Typography, { variant: "subtitle2", color: "textSecondary", children: "Seller" }), _jsx(Typography, { children: invoice.seller.name }), _jsx(Typography, { children: invoice.seller.taxRegistrationNumber }), _jsxs(Typography, { children: [invoice.seller.address.street, ", ", invoice.seller.address.city] }), _jsxs(Typography, { children: [invoice.seller.address.emirate, ", ", invoice.seller.address.country] })] }), _jsxs(Grid, { item: true, xs: 12, md: 6, children: [_jsx(Typography, { variant: "subtitle2", color: "textSecondary", children: "Buyer" }), _jsx(Typography, { children: invoice.buyer.name }), _jsx(Typography, { children: invoice.buyer.taxRegistrationNumber }), _jsxs(Typography, { children: [invoice.buyer.address.street, ", ", invoice.buyer.address.city] }), _jsxs(Typography, { children: [invoice.buyer.address.emirate, ", ", invoice.buyer.address.country] })] }), _jsxs(Grid, { item: true, xs: 12, children: [_jsx(Typography, { variant: "subtitle2", color: "textSecondary", gutterBottom: true, children: "Items" }), invoice.items.map((item) => (_jsxs(Box, { mb: 1, children: [_jsxs(Typography, { children: [item.description, " - ", item.quantity, " x ", item.unitPrice.toLocaleString('en-AE', {
                                                    style: 'currency',
                                                    currency: 'AED'
                                                })] }), _jsxs(Typography, { variant: "body2", color: "textSecondary", children: ["Tax Rate: ", item.taxRate, "% - Tax Amount: ", item.taxAmount.toLocaleString('en-AE', {
                                                    style: 'currency',
                                                    currency: 'AED'
                                                })] })] }, item.id)))] }), _jsxs(Grid, { item: true, xs: 12, children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", mt: 2, children: [_jsx(Typography, { variant: "subtitle1", children: "Total Amount" }), _jsx(Typography, { variant: "subtitle1", children: invoice.amount.toLocaleString('en-AE', {
                                                style: 'currency',
                                                currency: 'AED'
                                            }) })] }), _jsxs(Box, { display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "subtitle1", children: "VAT Amount" }), _jsx(Typography, { variant: "subtitle1", children: invoice.vatAmount.toLocaleString('en-AE', {
                                                style: 'currency',
                                                currency: 'AED'
                                            }) })] })] })] })] }) }));
};
