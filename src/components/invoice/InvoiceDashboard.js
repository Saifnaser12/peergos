import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Pagination, Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { format } from 'date-fns';
import { useInvoice } from '../../context/InvoiceContext';
import { InvoiceStatus } from '../../types/invoice';
const statusColors = {
    [InvoiceStatus.DRAFT]: 'default',
    [InvoiceStatus.SIGNED]: 'info',
    [InvoiceStatus.SUBMITTED]: 'primary',
    [InvoiceStatus.ACKNOWLEDGED]: 'success',
    [InvoiceStatus.REJECTED]: 'error',
    [InvoiceStatus.CANCELLED]: 'warning'
};
export const InvoiceDashboard = () => {
    const { invoices, loading, error, total, currentPage, loadInvoices, deleteInvoice, submitInvoice } = useInvoice();
    const [filters, setFilters] = useState({
        status: '',
        startDate: null,
        endDate: null
    });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
    useEffect(() => {
        const filterParams = {
            status: filters.status || undefined,
            dateRange: filters.startDate && filters.endDate
                ? {
                    start: filters.startDate.toISOString(),
                    end: filters.endDate.toISOString()
                }
                : undefined
        };
        loadInvoices(currentPage, filterParams);
    }, [currentPage, filters, loadInvoices]);
    const handlePageChange = (_, page) => {
        loadInvoices(page);
    };
    const handleStatusChange = (event) => {
        setFilters(prev => ({ ...prev, status: event.target.value }));
    };
    const handleStartDateChange = (date) => {
        setFilters(prev => ({ ...prev, startDate: date }));
    };
    const handleEndDateChange = (date) => {
        setFilters(prev => ({ ...prev, endDate: date }));
    };
    const handleDeleteClick = (id) => {
        setSelectedInvoiceId(id);
        setDeleteDialogOpen(true);
    };
    const handleDeleteConfirm = async () => {
        if (selectedInvoiceId) {
            await deleteInvoice(selectedInvoiceId);
            setDeleteDialogOpen(false);
            setSelectedInvoiceId(null);
        }
    };
    const handleSubmitInvoice = async (invoice) => {
        await submitInvoice(invoice);
    };
    if (error) {
        return (_jsx(Box, { p: 3, children: _jsx(Typography, { color: "error", children: error }) }));
    }
    return (_jsxs(Box, { p: 3, children: [_jsx(Typography, { variant: "h4", gutterBottom: true, children: "Invoice Dashboard" }), _jsx(Card, { sx: { mb: 3 }, children: _jsx(CardContent, { children: _jsxs(Grid, { container: true, spacing: 2, sx: { alignItems: 'center' }, children: [_jsx(Grid, { item: true, xs: 12, sm: 4, children: _jsxs(TextField, { select: true, fullWidth: true, label: "Status", value: filters.status, onChange: handleStatusChange, children: [_jsx(MenuItem, { value: "", children: "All" }), Object.values(InvoiceStatus).map(status => (_jsx(MenuItem, { value: status, children: status }, status)))] }) }), _jsx(Grid, { item: true, xs: 12, sm: 4, children: _jsx(LocalizationProvider, { dateAdapter: AdapterDateFns, children: _jsx(DatePicker, { label: "Start Date", value: filters.startDate, onChange: handleStartDateChange, slotProps: { textField: { fullWidth: true } } }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 4, children: _jsx(LocalizationProvider, { dateAdapter: AdapterDateFns, children: _jsx(DatePicker, { label: "End Date", value: filters.endDate, onChange: handleEndDateChange, slotProps: { textField: { fullWidth: true } } }) }) })] }) }) }), _jsx(TableContainer, { component: Paper, children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Invoice Number" }), _jsx(TableCell, { children: "Issue Date" }), _jsx(TableCell, { children: "Amount" }), _jsx(TableCell, { children: "Status" }), _jsx(TableCell, { align: "right", children: "Actions" })] }) }), _jsx(TableBody, { children: loading ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 5, align: "center", children: "Loading..." }) })) : invoices.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 5, align: "center", children: "No invoices found" }) })) : (invoices.map((invoice) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: invoice.invoiceNumber }), _jsx(TableCell, { children: format(new Date(invoice.issueDate), 'dd/MM/yyyy') }), _jsx(TableCell, { children: invoice.total.toLocaleString('en-AE', {
                                            style: 'currency',
                                            currency: 'AED'
                                        }) }), _jsx(TableCell, { children: _jsx(Chip, { label: invoice.status, color: statusColors[invoice.status], size: "small" }) }), _jsxs(TableCell, { align: "right", children: [_jsx(IconButton, { onClick: () => handleSubmitInvoice(invoice), disabled: invoice.status !== InvoiceStatus.DRAFT, size: "small", children: _jsx(CloudUploadIcon, {}) }), _jsx(IconButton, { component: "a", href: `/invoices/${invoice.id}`, size: "small", children: _jsx(VisibilityIcon, {}) }), _jsx(IconButton, { onClick: () => handleDeleteClick(invoice.id), size: "small", children: _jsx(DeleteIcon, {}) })] })] }, invoice.id)))) })] }) }), _jsx(Box, { display: "flex", justifyContent: "center", mt: 3, children: _jsx(Pagination, { count: Math.ceil(total / 10), page: currentPage, onChange: handlePageChange, color: "primary" }) }), _jsxs(Dialog, { open: deleteDialogOpen, onClose: () => setDeleteDialogOpen(false), children: [_jsx(DialogTitle, { children: "Confirm Delete" }), _jsx(DialogContent, { children: "Are you sure you want to delete this invoice?" }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setDeleteDialogOpen(false), children: "Cancel" }), _jsx(Button, { onClick: handleDeleteConfirm, color: "error", children: "Delete" })] })] })] }));
};
