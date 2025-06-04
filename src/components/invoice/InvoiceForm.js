import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { InvoiceStatus, InvoiceType } from '../../types/invoice';
import { v4 as uuidv4 } from 'uuid';
import { Box, Button, Card, CardContent, TextField, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
const emptyInvoiceItem = {
    id: '',
    description: '',
    quantity: 0,
    unitPrice: 0,
    totalAmount: 0,
    taxAmount: 0,
    taxableAmount: 0,
    productCode: '',
    taxCategory: '',
    taxRate: 5, // Default VAT rate in UAE
    vatAmount: 0,
    vatRate: 5
};
const defaultInvoice = {
    id: uuidv4(),
    type: InvoiceType.STANDARD,
    status: InvoiceStatus.DRAFT,
    issueDate: new Date().toISOString(),
    dueDate: new Date().toISOString(),
    invoiceNumber: '',
    currency: 'AED',
    amount: 0,
    vatAmount: 0,
    seller: {
        name: '',
        taxRegistrationNumber: '',
        address: {
            street: '',
            city: '',
            emirate: '',
            country: 'UAE',
            postalCode: ''
        }
    },
    buyer: {
        name: '',
        taxRegistrationNumber: '',
        address: {
            street: '',
            city: '',
            emirate: '',
            country: 'UAE',
            postalCode: ''
        }
    },
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};
export const InvoiceForm = ({ initialInvoice, onSubmit, onCancel }) => {
    const [invoice, setInvoice] = useState(initialInvoice || defaultInvoice);
    const [newItem, setNewItem] = useState({
        ...emptyInvoiceItem,
        id: uuidv4()
    });
    const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
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
    const handleNewItemChange = (field, value) => {
        setNewItem(prev => {
            const updated = { ...prev, [field]: value };
            // Recalculate amounts
            if (field === 'quantity' || field === 'unitPrice' || field === 'taxRate') {
                const quantity = field === 'quantity' ? +value : prev.quantity;
                const unitPrice = field === 'unitPrice' ? +value : prev.unitPrice;
                const taxRate = field === 'taxRate' ? +value : prev.taxRate;
                const taxableAmount = quantity * unitPrice;
                const taxAmount = taxableAmount * (taxRate / 100);
                const totalAmount = taxableAmount + taxAmount;
                return {
                    ...updated,
                    taxableAmount,
                    taxAmount,
                    totalAmount,
                    vatAmount: taxAmount,
                    vatRate: taxRate
                };
            }
            return updated;
        });
    };
    const handleAddItem = () => {
        setInvoice(prev => {
            const updatedItems = [...prev.items, newItem];
            const amount = updatedItems.reduce((sum, item) => sum + item.totalAmount, 0);
            const vatAmount = updatedItems.reduce((sum, item) => sum + item.taxAmount, 0);
            return {
                ...prev,
                items: updatedItems,
                amount,
                vatAmount,
                updatedAt: new Date().toISOString()
            };
        });
        setNewItem({
            ...emptyInvoiceItem,
            id: uuidv4()
        });
        setAddItemDialogOpen(false);
    };
    const handleDeleteItem = (itemId) => {
        setInvoice(prev => {
            const updatedItems = prev.items.filter(item => item.id !== itemId);
            const amount = updatedItems.reduce((sum, item) => sum + item.totalAmount, 0);
            const vatAmount = updatedItems.reduce((sum, item) => sum + item.taxAmount, 0);
            return {
                ...prev,
                items: updatedItems,
                amount,
                vatAmount,
                updatedAt: new Date().toISOString()
            };
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(invoice);
    };
    return (_jsxs(Box, { component: "form", onSubmit: handleSubmit, children: [_jsx(Card, { sx: { mb: 3 }, children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Basic Information" }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, label: "Invoice Number", value: invoice.invoiceNumber, onChange: (e) => handleInputChange('invoiceNumber', e.target.value), required: true }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(LocalizationProvider, { dateAdapter: AdapterDateFns, children: _jsx(DatePicker, { label: "Issue Date", value: new Date(invoice.issueDate), onChange: (date) => handleInputChange('issueDate', date?.toISOString() || ''), slotProps: { textField: { fullWidth: true } } }) }) })] })] }) }), _jsx(Card, { sx: { mb: 3 }, children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Seller Information" }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, label: "Company Name", value: invoice.seller.name, onChange: (e) => handleInputChange('name', e.target.value, 'seller'), required: true }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, label: "TRN", value: invoice.seller.taxRegistrationNumber, onChange: (e) => handleInputChange('taxRegistrationNumber', e.target.value, 'seller'), required: true }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Street", value: invoice.seller.address.street, onChange: (e) => handleAddressChange('street', e.target.value, 'seller'), required: true }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(TextField, { fullWidth: true, label: "City", value: invoice.seller.address.city, onChange: (e) => handleAddressChange('city', e.target.value, 'seller'), required: true }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(TextField, { fullWidth: true, label: "Emirate", value: invoice.seller.address.emirate, onChange: (e) => handleAddressChange('emirate', e.target.value, 'seller'), required: true }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(TextField, { fullWidth: true, label: "Postal Code", value: invoice.seller.address.postalCode, onChange: (e) => handleAddressChange('postalCode', e.target.value, 'seller') }) })] })] }) }), _jsx(Card, { sx: { mb: 3 }, children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Buyer Information" }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, label: "Company Name", value: invoice.buyer.name, onChange: (e) => handleInputChange('name', e.target.value, 'buyer'), required: true }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, label: "TRN", value: invoice.buyer.taxRegistrationNumber, onChange: (e) => handleInputChange('taxRegistrationNumber', e.target.value, 'buyer'), required: true }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Street", value: invoice.buyer.address.street, onChange: (e) => handleAddressChange('street', e.target.value, 'buyer'), required: true }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(TextField, { fullWidth: true, label: "City", value: invoice.buyer.address.city, onChange: (e) => handleAddressChange('city', e.target.value, 'buyer'), required: true }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(TextField, { fullWidth: true, label: "Emirate", value: invoice.buyer.address.emirate, onChange: (e) => handleAddressChange('emirate', e.target.value, 'buyer'), required: true }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(TextField, { fullWidth: true, label: "Postal Code", value: invoice.buyer.address.postalCode, onChange: (e) => handleAddressChange('postalCode', e.target.value, 'buyer') }) })] })] }) }), _jsx(Card, { sx: { mb: 3 }, children: _jsxs(CardContent, { children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, children: [_jsx(Typography, { variant: "h6", children: "Invoice Items" }), _jsx(Button, { startIcon: _jsx(AddIcon, {}), onClick: () => setAddItemDialogOpen(true), children: "Add Item" })] }), _jsx(TableContainer, { children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Description" }), _jsx(TableCell, { align: "right", children: "Quantity" }), _jsx(TableCell, { align: "right", children: "Unit Price" }), _jsx(TableCell, { align: "right", children: "Tax Rate" }), _jsx(TableCell, { align: "right", children: "Tax Amount" }), _jsx(TableCell, { align: "right", children: "Total Amount" }), _jsx(TableCell, { align: "right", children: "Actions" })] }) }), _jsx(TableBody, { children: invoice.items.map((item) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: item.description }), _jsx(TableCell, { align: "right", children: item.quantity }), _jsx(TableCell, { align: "right", children: item.unitPrice.toLocaleString('en-AE', {
                                                        style: 'currency',
                                                        currency: 'AED'
                                                    }) }), _jsxs(TableCell, { align: "right", children: [item.taxRate, "%"] }), _jsx(TableCell, { align: "right", children: item.taxAmount.toLocaleString('en-AE', {
                                                        style: 'currency',
                                                        currency: 'AED'
                                                    }) }), _jsx(TableCell, { align: "right", children: item.totalAmount.toLocaleString('en-AE', {
                                                        style: 'currency',
                                                        currency: 'AED'
                                                    }) }), _jsx(TableCell, { align: "right", children: _jsx(IconButton, { onClick: () => handleDeleteItem(item.id), size: "small", children: _jsx(DeleteIcon, {}) }) })] }, item.id))) })] }) }), _jsx(Box, { mt: 2, children: _jsx(Grid, { container: true, spacing: 2, sx: { justifyContent: 'flex-end' }, children: _jsxs(Grid, { item: true, xs: 12, md: 4, children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", mb: 1, children: [_jsx(Typography, { children: "Total Amount" }), _jsx(Typography, { children: invoice.amount.toLocaleString('en-AE', {
                                                        style: 'currency',
                                                        currency: 'AED'
                                                    }) })] }), _jsxs(Box, { display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { children: "VAT Amount" }), _jsx(Typography, { children: invoice.vatAmount.toLocaleString('en-AE', {
                                                        style: 'currency',
                                                        currency: 'AED'
                                                    }) })] })] }) }) })] }) }), _jsxs(Dialog, { open: addItemDialogOpen, onClose: () => setAddItemDialogOpen(false), maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: "Add Invoice Item" }), _jsx(DialogContent, { children: _jsx(Box, { sx: { pt: 2 }, children: _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Description", value: newItem.description, onChange: (e) => handleNewItemChange('description', e.target.value), required: true }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(TextField, { fullWidth: true, type: "number", label: "Quantity", value: newItem.quantity, onChange: (e) => handleNewItemChange('quantity', +e.target.value), required: true }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(TextField, { fullWidth: true, type: "number", label: "Unit Price", value: newItem.unitPrice, onChange: (e) => handleNewItemChange('unitPrice', +e.target.value), required: true }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(TextField, { fullWidth: true, type: "number", label: "Tax Rate (%)", value: newItem.taxRate, onChange: (e) => handleNewItemChange('taxRate', +e.target.value), required: true }) })] }) }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setAddItemDialogOpen(false), children: "Cancel" }), _jsx(Button, { onClick: handleAddItem, variant: "contained", children: "Add" })] })] }), _jsxs(Box, { display: "flex", justifyContent: "flex-end", gap: 2, children: [_jsx(Button, { onClick: onCancel, children: "Cancel" }), _jsx(Button, { type: "submit", variant: "contained", children: "Save" })] })] }));
};
