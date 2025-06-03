import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import { InvoiceStatus } from '../../types/invoice';
import { Box, Card, CardContent, Typography, Chip, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, Divider, Grid, CircularProgress } from '@mui/material';
import { format } from 'date-fns';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
const statusColors = {
    [InvoiceStatus.DRAFT]: 'default',
    [InvoiceStatus.SIGNED]: 'info',
    [InvoiceStatus.SUBMITTED]: 'primary',
    [InvoiceStatus.ACKNOWLEDGED]: 'success',
    [InvoiceStatus.REJECTED]: 'error',
    [InvoiceStatus.CANCELLED]: 'warning'
};
export const InvoiceDetail = ({ invoiceId, onEdit }) => {
    const { currentInvoice, loading, error, getInvoice, submitInvoice } = useInvoice();
    useEffect(() => {
        getInvoice(invoiceId);
    }, [invoiceId, getInvoice]);
    if (loading) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px", children: _jsx(CircularProgress, {}) }));
    }
    if (error) {
        return (_jsx(Box, { p: 3, children: _jsx(Alert, { severity: "error", children: error }) }));
    }
    if (!currentInvoice) {
        return (_jsx(Box, { p: 3, children: _jsx(Alert, { severity: "warning", children: "Invoice not found" }) }));
    }
    const handleSubmit = async () => {
        await submitInvoice(currentInvoice);
    };
    return (_jsxs(Box, { p: 3, children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, children: [_jsxs(Typography, { variant: "h4", children: ["Invoice #", currentInvoice.invoiceNumber] }), _jsxs(Box, { display: "flex", gap: 2, children: [currentInvoice.status === InvoiceStatus.DRAFT && (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "contained", color: "primary", startIcon: _jsx(CloudUploadIcon, {}), onClick: handleSubmit, children: "Submit" }), _jsx(Button, { variant: "outlined", onClick: onEdit, children: "Edit" })] })), _jsx(Button, { variant: "outlined", startIcon: _jsx(PictureAsPdfIcon, {}), children: "View PDF" }), _jsx(Button, { variant: "outlined", startIcon: _jsx(DownloadIcon, {}), children: "Download XML" })] })] }), _jsx(Card, { sx: { mb: 3 }, children: _jsx(CardContent, { children: _jsxs(Grid, { container: true, spacing: 2, sx: { alignItems: 'center' }, children: [_jsxs(Grid, { item: true, xs: 12, md: 4, children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "Status" }), _jsx(Chip, { label: currentInvoice.status, color: statusColors[currentInvoice.status], size: "small" })] }), _jsxs(Grid, { item: true, xs: 12, md: 4, children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "Issue Date" }), _jsx(Typography, { children: format(new Date(currentInvoice.issueDate), 'dd/MM/yyyy') })] }), _jsxs(Grid, { item: true, xs: 12, md: 4, children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "Due Date" }), _jsx(Typography, { children: currentInvoice.dueDate
                                            ? format(new Date(currentInvoice.dueDate), 'dd/MM/yyyy')
                                            : 'N/A' })] })] }) }) }), _jsx(Card, { sx: { mb: 3 }, children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Seller Information" }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsxs(Grid, { item: true, xs: 12, md: 6, children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "Company Name" }), _jsx(Typography, { children: currentInvoice.seller.name })] }), _jsxs(Grid, { item: true, xs: 12, md: 6, children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "TRN" }), _jsx(Typography, { children: currentInvoice.seller.trn })] }), _jsxs(Grid, { item: true, xs: 12, children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "Address" }), _jsxs(Typography, { children: [currentInvoice.seller.address.street, _jsx("br", {}), currentInvoice.seller.address.city, ", ", currentInvoice.seller.address.emirate, _jsx("br", {}), currentInvoice.seller.address.country, currentInvoice.seller.address.postalCode && ` - ${currentInvoice.seller.address.postalCode}`] })] })] })] }) }), _jsx(Card, { sx: { mb: 3 }, children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Buyer Information" }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsxs(Grid, { item: true, xs: 12, md: 6, children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "Company Name" }), _jsx(Typography, { children: currentInvoice.buyer.name })] }), _jsxs(Grid, { item: true, xs: 12, md: 6, children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "TRN" }), _jsx(Typography, { children: currentInvoice.buyer.trn })] }), _jsxs(Grid, { item: true, xs: 12, children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "Address" }), _jsxs(Typography, { children: [currentInvoice.buyer.address.street, _jsx("br", {}), currentInvoice.buyer.address.city, ", ", currentInvoice.buyer.address.emirate, _jsx("br", {}), currentInvoice.buyer.address.country, currentInvoice.buyer.address.postalCode && ` - ${currentInvoice.buyer.address.postalCode}`] })] })] })] }) }), _jsx(Card, { sx: { mb: 3 }, children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Invoice Items" }), _jsx(TableContainer, { children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Description" }), _jsx(TableCell, { align: "right", children: "Quantity" }), _jsx(TableCell, { align: "right", children: "Unit Price" }), _jsx(TableCell, { align: "right", children: "VAT Rate" }), _jsx(TableCell, { align: "right", children: "VAT Amount" }), _jsx(TableCell, { align: "right", children: "Total" })] }) }), _jsx(TableBody, { children: currentInvoice.items.map((item, index) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: item.description }), _jsx(TableCell, { align: "right", children: item.quantity }), _jsx(TableCell, { align: "right", children: item.unitPrice.toLocaleString('en-AE', {
                                                        style: 'currency',
                                                        currency: 'AED'
                                                    }) }), _jsxs(TableCell, { align: "right", children: [item.vatRate, "%"] }), _jsx(TableCell, { align: "right", children: item.vatAmount.toLocaleString('en-AE', {
                                                        style: 'currency',
                                                        currency: 'AED'
                                                    }) }), _jsx(TableCell, { align: "right", children: item.total.toLocaleString('en-AE', {
                                                        style: 'currency',
                                                        currency: 'AED'
                                                    }) })] }, index))) })] }) })] }) }), _jsx(Card, { children: _jsx(CardContent, { children: _jsx(Grid, { container: true, spacing: 2, sx: { justifyContent: 'flex-end' }, children: _jsxs(Grid, { item: true, xs: 12, md: 4, children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", mb: 1, children: [_jsx(Typography, { children: "Subtotal" }), _jsx(Typography, { children: currentInvoice.subtotal.toLocaleString('en-AE', {
                                                style: 'currency',
                                                currency: 'AED'
                                            }) })] }), _jsxs(Box, { display: "flex", justifyContent: "space-between", mb: 1, children: [_jsx(Typography, { children: "VAT Total" }), _jsx(Typography, { children: currentInvoice.vatTotal.toLocaleString('en-AE', {
                                                style: 'currency',
                                                currency: 'AED'
                                            }) })] }), _jsx(Divider, { sx: { my: 1 } }), _jsxs(Box, { display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "h6", children: "Total" }), _jsx(Typography, { variant: "h6", children: currentInvoice.total.toLocaleString('en-AE', {
                                                style: 'currency',
                                                currency: 'AED'
                                            }) })] })] }) }) }) })] }));
};
