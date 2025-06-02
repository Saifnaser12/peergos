import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { InvoiceStatus, InvoiceType } from '../../types/invoice';
import { v4 as uuidv4 } from 'uuid';
import { Box, Button, Card, CardContent, TextField, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, } from '@mui/material';
import { Grid } from '../common/Grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
const GridItem = ({ children, ...props }) => (_jsx(Grid, { ...props, children: children }));
const emptyInvoiceLine = {
    id: '',
    productCode: '',
    description: '',
    quantity: 0,
    unitPrice: 0,
    netAmount: 0,
    taxBreakdown: {
        taxableAmount: 0,
        taxRate: 5, // Default VAT rate in UAE
        taxAmount: 0,
        taxCategory: 'S'
    }
};
const defaultInvoice = {
    id: uuidv4(),
    type: InvoiceType.STANDARD,
    status: InvoiceStatus.DRAFT,
    issueDate: new Date().toISOString(),
    invoiceNumber: '',
    uuid: uuidv4(),
    seller: {
        name: '',
        address: {
            street: '',
            city: '',
            emirate: '',
            country: 'UAE',
            postalCode: ''
        },
        trn: ''
    },
    buyer: {
        name: '',
        address: {
            street: '',
            city: '',
            emirate: '',
            country: 'UAE',
            postalCode: ''
        },
        trn: ''
    },
    lines: [],
    totalAmount: 0,
    totalTaxAmount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};
export const InvoiceForm = ({ initialInvoice, onSubmit, onCancel }) => {
    const [invoice, setInvoice] = useState(initialInvoice || defaultInvoice);
    const [newLine, setNewLine] = useState({
        ...emptyInvoiceLine,
        id: uuidv4()
    });
    const [addLineDialogOpen, setAddLineDialogOpen] = useState(false);
    const handleInputChange = (field, value, section, subfield) => {
        setInvoice(prev => {
            if (section && subfield) {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [subfield]: value
                    }
                };
            }
            else if (section) {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [field]: value
                    }
                };
            }
            else {
                return {
                    ...prev,
                    [field]: value
                };
            }
        });
    };
    const handleAddressChange = (field, value, party) => {
        setInvoice(prev => ({
            ...prev,
            [party]: {
                ...prev[party],
                address: {
                    ...prev[party].address,
                    [field]: value
                }
            }
        }));
    };
    const handleNewLineChange = (field, value) => {
        setNewLine(prev => {
            const updated = { ...prev, [field]: value };
            // Recalculate amounts
            if (field === 'quantity' || field === 'unitPrice') {
                const quantity = field === 'quantity' ? +value : prev.quantity;
                const unitPrice = field === 'unitPrice' ? +value : prev.unitPrice;
                const netAmount = quantity * unitPrice;
                const taxAmount = netAmount * (prev.taxBreakdown.taxRate / 100);
                return {
                    ...updated,
                    netAmount,
                    taxBreakdown: {
                        ...prev.taxBreakdown,
                        taxableAmount: netAmount,
                        taxAmount
                    }
                };
            }
            return updated;
        });
    };
    const handleAddLine = () => {
        setInvoice(prev => {
            const updatedLines = [...prev.lines, newLine];
            const totalAmount = updatedLines.reduce((sum, line) => sum + line.netAmount + line.taxBreakdown.taxAmount, 0);
            const totalTaxAmount = updatedLines.reduce((sum, line) => sum + line.taxBreakdown.taxAmount, 0);
            return {
                ...prev,
                lines: updatedLines,
                totalAmount,
                totalTaxAmount
            };
        });
        setNewLine({
            ...emptyInvoiceLine,
            id: uuidv4()
        });
        setAddLineDialogOpen(false);
    };
    const handleDeleteLine = (lineId) => {
        setInvoice(prev => {
            const updatedLines = prev.lines.filter(line => line.id !== lineId);
            const totalAmount = updatedLines.reduce((sum, line) => sum + line.netAmount + line.taxBreakdown.taxAmount, 0);
            const totalTaxAmount = updatedLines.reduce((sum, line) => sum + line.taxBreakdown.taxAmount, 0);
            return {
                ...prev,
                lines: updatedLines,
                totalAmount,
                totalTaxAmount
            };
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...invoice,
            updatedAt: new Date().toISOString()
        });
    };
    return (_jsxs(Box, { component: "form", onSubmit: handleSubmit, sx: { p: 3 }, children: [_jsx(Typography, { variant: "h4", gutterBottom: true, children: initialInvoice ? 'Edit Invoice' : 'Create Invoice' }), _jsx(Card, { sx: { mb: 3 }, children: _jsx(CardContent, { children: _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { size: { xs: 12, sm: 6 }, children: _jsx(TextField, { fullWidth: true, label: "Invoice Number", value: invoice.invoiceNumber, onChange: e => handleInputChange('invoiceNumber', e.target.value), required: true }) }), _jsx(Grid, { size: { xs: 12, sm: 6 }, children: _jsx(LocalizationProvider, { dateAdapter: AdapterDateFns, children: _jsx(DatePicker, { label: "Issue Date", value: new Date(invoice.issueDate), onChange: date => date && handleInputChange('issueDate', date.toISOString()), slotProps: { textField: { fullWidth: true } } }) }) })] }) }) }), _jsx(Card, { sx: { mb: 3 }, children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Seller Information" }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { size: { xs: 12 }, children: _jsx(TextField, { fullWidth: true, label: "Company Name", value: invoice.seller.name, onChange: e => handleInputChange('name', e.target.value, 'seller'), required: true }) }), _jsx(Grid, { size: { xs: 12 }, children: _jsx(TextField, { fullWidth: true, label: "TRN", value: invoice.seller.trn, onChange: e => handleInputChange('trn', e.target.value, 'seller'), required: true }) }), _jsx(Grid, { size: { xs: 12 }, children: _jsx(TextField, { fullWidth: true, label: "Street Address", value: invoice.seller.address.street, onChange: e => handleAddressChange('street', e.target.value, 'seller'), required: true }) }), _jsx(Grid, { size: { xs: 12, sm: 6 }, children: _jsx(TextField, { fullWidth: true, label: "City", value: invoice.seller.address.city, onChange: e => handleAddressChange('city', e.target.value, 'seller'), required: true }) }), _jsx(Grid, { size: { xs: 12, sm: 6 }, children: _jsx(TextField, { fullWidth: true, label: "Emirate", value: invoice.seller.address.emirate, onChange: e => handleAddressChange('emirate', e.target.value, 'seller'), required: true }) })] })] }) }), _jsx(Card, { sx: { mb: 3 }, children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Buyer Information" }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { size: { xs: 12 }, children: _jsx(TextField, { fullWidth: true, label: "Company Name", value: invoice.buyer.name, onChange: e => handleInputChange('name', e.target.value, 'buyer'), required: true }) }), _jsx(Grid, { size: { xs: 12 }, children: _jsx(TextField, { fullWidth: true, label: "TRN", value: invoice.buyer.trn, onChange: e => handleInputChange('trn', e.target.value, 'buyer'), required: true }) }), _jsx(Grid, { size: { xs: 12 }, children: _jsx(TextField, { fullWidth: true, label: "Street Address", value: invoice.buyer.address.street, onChange: e => handleAddressChange('street', e.target.value, 'buyer'), required: true }) }), _jsx(Grid, { size: { xs: 12, sm: 6 }, children: _jsx(TextField, { fullWidth: true, label: "City", value: invoice.buyer.address.city, onChange: e => handleAddressChange('city', e.target.value, 'buyer'), required: true }) }), _jsx(Grid, { size: { xs: 12, sm: 6 }, children: _jsx(TextField, { fullWidth: true, label: "Emirate", value: invoice.buyer.address.emirate, onChange: e => handleAddressChange('emirate', e.target.value, 'buyer'), required: true }) })] })] }) }), _jsx(Card, { sx: { mb: 3 }, children: _jsxs(CardContent, { children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, children: [_jsx(Typography, { variant: "h6", children: "Invoice Lines" }), _jsx(Button, { variant: "contained", startIcon: _jsx(AddIcon, {}), onClick: () => setAddLineDialogOpen(true), children: "Add Line" })] }), _jsx(TableContainer, { component: Paper, children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Product Code" }), _jsx(TableCell, { children: "Description" }), _jsx(TableCell, { children: "Quantity" }), _jsx(TableCell, { children: "Unit Price" }), _jsx(TableCell, { children: "Net Amount" }), _jsx(TableCell, { children: "VAT" }), _jsx(TableCell, { children: "Total" }), _jsx(TableCell, { children: "Actions" })] }) }), _jsxs(TableBody, { children: [invoice.lines.map(line => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: line.productCode }), _jsx(TableCell, { children: line.description }), _jsx(TableCell, { children: line.quantity }), _jsxs(TableCell, { children: ["AED ", line.unitPrice.toFixed(2)] }), _jsxs(TableCell, { children: ["AED ", line.netAmount.toFixed(2)] }), _jsxs(TableCell, { children: ["AED ", line.taxBreakdown.taxAmount.toFixed(2)] }), _jsxs(TableCell, { children: ["AED ", (line.netAmount + line.taxBreakdown.taxAmount).toFixed(2)] }), _jsx(TableCell, { children: _jsx(IconButton, { color: "error", onClick: () => handleDeleteLine(line.id), children: _jsx(DeleteIcon, {}) }) })] }, line.id))), invoice.lines.length === 0 && (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 8, align: "center", children: "No items added" }) }))] })] }) })] }) }), _jsx(Card, { sx: { mb: 3 }, children: _jsx(CardContent, { children: _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { size: { xs: 12, sm: 4 }, children: _jsxs(Typography, { variant: "subtitle1", children: ["Net Amount: AED ", (invoice.totalAmount - invoice.totalTaxAmount).toFixed(2)] }) }), _jsx(Grid, { size: { xs: 12, sm: 4 }, children: _jsxs(Typography, { variant: "subtitle1", children: ["VAT Amount: AED ", invoice.totalTaxAmount.toFixed(2)] }) }), _jsx(Grid, { size: { xs: 12, sm: 4 }, children: _jsxs(Typography, { variant: "h6", children: ["Total Amount: AED ", invoice.totalAmount.toFixed(2)] }) })] }) }) }), _jsxs(Box, { display: "flex", justifyContent: "flex-end", gap: 2, children: [_jsx(Button, { variant: "outlined", onClick: onCancel, children: "Cancel" }), _jsx(Button, { variant: "contained", color: "primary", type: "submit", children: "Save" })] }), _jsxs(Dialog, { open: addLineDialogOpen, onClose: () => setAddLineDialogOpen(false), maxWidth: "md", fullWidth: true, children: [_jsx(DialogTitle, { children: "Add Invoice Line" }), _jsx(DialogContent, { children: _jsxs(Grid, { container: true, spacing: 2, sx: { mt: 1 }, children: [_jsx(Grid, { size: { xs: 12, sm: 6 }, children: _jsx(TextField, { fullWidth: true, label: "Product Code", value: newLine.productCode, onChange: e => handleNewLineChange('productCode', e.target.value), required: true }) }), _jsx(Grid, { size: { xs: 12 }, children: _jsx(TextField, { fullWidth: true, label: "Description", value: newLine.description, onChange: e => handleNewLineChange('description', e.target.value), required: true }) }), _jsx(Grid, { size: { xs: 12, sm: 6 }, children: _jsx(TextField, { fullWidth: true, type: "number", label: "Quantity", value: newLine.quantity, onChange: e => handleNewLineChange('quantity', e.target.value), required: true }) }), _jsx(Grid, { size: { xs: 12, sm: 6 }, children: _jsx(TextField, { fullWidth: true, type: "number", label: "Unit Price", value: newLine.unitPrice, onChange: e => handleNewLineChange('unitPrice', e.target.value), required: true }) }), _jsx(Grid, { size: { xs: 12, sm: 6 }, children: _jsxs(Typography, { variant: "subtitle1", children: ["Net Amount: AED ", newLine.netAmount.toFixed(2)] }) }), _jsx(Grid, { size: { xs: 12, sm: 6 }, children: _jsxs(Typography, { variant: "subtitle1", children: ["VAT Amount: AED ", newLine.taxBreakdown.taxAmount.toFixed(2)] }) })] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setAddLineDialogOpen(false), children: "Cancel" }), _jsx(Button, { onClick: handleAddLine, color: "primary", disabled: !newLine.productCode || !newLine.description || !newLine.quantity || !newLine.unitPrice, children: "Add" })] })] })] }));
};
