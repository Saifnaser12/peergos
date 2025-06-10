import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Chip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
const transactionTypes = [
    'GOODS_SALE',
    'GOODS_PURCHASE',
    'SERVICE_PROVISION',
    'SERVICE_RECEIPT',
    'ROYALTY_PAYMENT',
    'ROYALTY_RECEIPT',
    'INTEREST_PAYMENT',
    'INTEREST_RECEIPT',
    'MANAGEMENT_FEE',
    'OTHER'
];
const TransactionTable = ({ transactions, relatedParties, onUpdate }) => {
    const [open, setOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [formData, setFormData] = useState({});
    const handleAdd = () => {
        setEditingTransaction(null);
        setFormData({
            type: 'GOODS_SALE',
            description: '',
            amount: 0,
            currency: 'AED',
            date: new Date().toISOString().split('T')[0],
            relatedPartyId: '',
            armLengthPricing: false,
            documentationAvailable: false
        });
        setOpen(true);
    };
    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setFormData(transaction);
        setOpen(true);
    };
    const handleSave = () => {
        if (!formData.relatedPartyId || !formData.amount)
            return;
        const newTransaction = {
            id: editingTransaction?.id || Date.now().toString(),
            type: formData.type,
            description: formData.description || '',
            amount: Number(formData.amount),
            currency: formData.currency || 'AED',
            date: formData.date,
            relatedPartyId: formData.relatedPartyId,
            armLengthPricing: formData.armLengthPricing || false,
            documentationAvailable: formData.documentationAvailable || false
        };
        if (editingTransaction) {
            const updatedTransactions = transactions.map(t => t.id === editingTransaction.id ? newTransaction : t);
            onUpdate(updatedTransactions);
        }
        else {
            onUpdate([...transactions, newTransaction]);
        }
        setOpen(false);
    };
    const handleDelete = (id) => {
        const filteredTransactions = transactions.filter(t => t.id !== id);
        onUpdate(filteredTransactions);
    };
    const getRelatedPartyName = (id) => {
        const party = relatedParties.find(p => p.id === id);
        return party?.name || 'Unknown';
    };
    return (_jsxs(Box, { children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }, children: [_jsx(Typography, { variant: "h6", children: "Intercompany Transactions" }), _jsx(Button, { variant: "contained", startIcon: _jsx(AddIcon, {}), onClick: handleAdd, sx: { borderRadius: 2 }, children: "Add Transaction" })] }), _jsx(TableContainer, { component: Paper, sx: { borderRadius: 2 }, children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Type" }), _jsx(TableCell, { children: "Description" }), _jsx(TableCell, { children: "Related Party" }), _jsx(TableCell, { align: "right", children: "Amount" }), _jsx(TableCell, { children: "Date" }), _jsx(TableCell, { children: "Arm's Length" }), _jsx(TableCell, { align: "center", children: "Actions" })] }) }), _jsx(TableBody, { children: transactions.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 7, align: "center", sx: { py: 4 }, children: _jsx(Typography, { color: "text.secondary", children: "No transactions added yet" }) }) })) : (transactions.map((transaction) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsx(Chip, { label: transaction.type.replace('_', ' '), size: "small", variant: "outlined" }) }), _jsx(TableCell, { children: transaction.description }), _jsx(TableCell, { children: getRelatedPartyName(transaction.relatedPartyId) }), _jsxs(TableCell, { align: "right", children: [transaction.amount.toLocaleString(), " ", transaction.currency] }), _jsx(TableCell, { children: transaction.date }), _jsx(TableCell, { children: _jsx(Chip, { label: transaction.armLengthPricing ? 'Yes' : 'No', color: transaction.armLengthPricing ? 'success' : 'warning', size: "small" }) }), _jsxs(TableCell, { align: "center", children: [_jsx(IconButton, { onClick: () => handleEdit(transaction), size: "small", children: _jsx(EditIcon, { fontSize: "small" }) }), _jsx(IconButton, { onClick: () => handleDelete(transaction.id), size: "small", color: "error", children: _jsx(DeleteIcon, { fontSize: "small" }) })] })] }, transaction.id)))) })] }) }), _jsxs(Dialog, { open: open, onClose: () => setOpen(false), maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: editingTransaction ? 'Edit Transaction' : 'Add Transaction' }), _jsx(DialogContent, { children: _jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }, children: [_jsx(TextField, { select: true, label: "Transaction Type", value: formData.type || '', onChange: (e) => setFormData({ ...formData, type: e.target.value }), fullWidth: true, children: transactionTypes.map((type) => (_jsx(MenuItem, { value: type, children: type.replace('_', ' ') }, type))) }), _jsx(TextField, { label: "Description", value: formData.description || '', onChange: (e) => setFormData({ ...formData, description: e.target.value }), fullWidth: true, multiline: true, rows: 2 }), _jsx(TextField, { select: true, label: "Related Party", value: formData.relatedPartyId || '', onChange: (e) => setFormData({ ...formData, relatedPartyId: e.target.value }), fullWidth: true, children: relatedParties.map((party) => (_jsx(MenuItem, { value: party.id, children: party.name }, party.id))) }), _jsx(TextField, { label: "Amount", type: "number", value: formData.amount || '', onChange: (e) => setFormData({ ...formData, amount: Number(e.target.value) }), fullWidth: true }), _jsx(TextField, { label: "Date", type: "date", value: formData.date || '', onChange: (e) => setFormData({ ...formData, date: e.target.value }), fullWidth: true, InputLabelProps: { shrink: true } })] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setOpen(false), children: "Cancel" }), _jsx(Button, { onClick: handleSave, variant: "contained", children: editingTransaction ? 'Update' : 'Add' })] })] })] }));
};
export default TransactionTable;
