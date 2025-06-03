import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Box, Paper, Typography, Button, TextField, IconButton, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, List, ListItem, ListItemText, ListItemSecondaryAction, Divider, Chip, InputAdornment } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Upload as UploadIcon } from '@mui/icons-material';
import { useTransferPricing } from '../context/TransferPricingContext';
import { TransactionType, TransferPricingMethod } from '../types/transferPricing';
import { useTranslation } from 'react-i18next';
const AddRelatedPartyDialog = ({ open, onClose, onAdd }) => {
    const { t } = useTranslation();
    const [party, setParty] = useState({
        name: '',
        jurisdiction: '',
        taxId: '',
        relationshipType: '',
        isActive: true
    });
    const handleSubmit = () => {
        onAdd(party);
        onClose();
    };
    return (_jsxs(Dialog, { open: open, onClose: onClose, children: [_jsx(DialogTitle, { children: t('transferPricing.addRelatedParty') }), _jsx(DialogContent, { children: _jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }, children: [_jsx(TextField, { fullWidth: true, label: t('transferPricing.partyName'), value: party.name, onChange: (e) => setParty({ ...party, name: e.target.value }) }), _jsx(TextField, { fullWidth: true, label: t('transferPricing.jurisdiction'), value: party.jurisdiction, onChange: (e) => setParty({ ...party, jurisdiction: e.target.value }) }), _jsx(TextField, { fullWidth: true, label: t('transferPricing.taxId'), value: party.taxId, onChange: (e) => setParty({ ...party, taxId: e.target.value }) }), _jsx(TextField, { fullWidth: true, label: t('transferPricing.relationshipType'), value: party.relationshipType, onChange: (e) => setParty({ ...party, relationshipType: e.target.value }) })] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: onClose, children: t('common.cancel') }), _jsx(Button, { onClick: handleSubmit, variant: "contained", children: t('common.add') })] })] }));
};
const AddTransactionDialog = ({ open, onClose, onAdd, relatedParties }) => {
    const { t } = useTranslation();
    const { validateTransaction } = useTransferPricing();
    const [transaction, setTransaction] = useState({
        relatedPartyId: '',
        transactionType: TransactionType.SALE_OF_GOODS,
        transferPricingMethod: TransferPricingMethod.CUP,
        transactionValue: 0,
        currency: 'AED',
        fiscalYear: new Date().getFullYear().toString(),
        description: '',
        documents: [],
        status: 'DRAFT',
        isCompliant: false
    });
    const [errors, setErrors] = useState([]);
    const handleSubmit = () => {
        const validationErrors = validateTransaction(transaction);
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }
        onAdd(transaction);
        onClose();
    };
    const handleFileUpload = (type) => (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const newDocument = {
                id: '', // Will be set by the context
                type,
                name: file.name,
                url: '', // Will be set after upload
                fileName: file.name,
                fileSize: file.size,
                uploadedAt: new Date().toISOString(),
                status: 'PENDING'
            };
            setTransaction({
                ...transaction,
                documents: [...transaction.documents, newDocument]
            });
        }
    };
    return (_jsxs(Dialog, { open: open, onClose: onClose, maxWidth: "md", fullWidth: true, children: [_jsx(DialogTitle, { children: t('transferPricing.addTransaction') }), _jsx(DialogContent, { children: _jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }, children: [_jsx(TextField, { fullWidth: true, select: true, label: t('transferPricing.relatedParty'), value: transaction.relatedPartyId, onChange: (e) => setTransaction({ ...transaction, relatedPartyId: e.target.value }), children: relatedParties.map((party) => (_jsxs(MenuItem, { value: party.id, children: [party.name, " (", party.jurisdiction, ")"] }, party.id))) }), _jsx(TextField, { fullWidth: true, select: true, label: t('transferPricing.transactionType'), value: transaction.transactionType, onChange: (e) => setTransaction({ ...transaction, transactionType: e.target.value }), children: Object.values(TransactionType).map((type) => (_jsx(MenuItem, { value: type, children: t(`transferPricing.transactionTypes.${type}`) }, type))) }), _jsx(TextField, { fullWidth: true, select: true, label: t('transferPricing.pricingMethod'), value: transaction.transferPricingMethod, onChange: (e) => setTransaction({ ...transaction, transferPricingMethod: e.target.value }), children: Object.values(TransferPricingMethod).map((method) => (_jsx(MenuItem, { value: method, children: t(`transferPricing.pricingMethods.${method}`) }, method))) }), _jsx(TextField, { fullWidth: true, type: "number", label: t('transferPricing.transactionValue'), value: transaction.transactionValue, onChange: (e) => setTransaction({ ...transaction, transactionValue: parseFloat(e.target.value) }), InputProps: {
                                startAdornment: _jsx(InputAdornment, { position: "start", children: "AED" })
                            } }), _jsx(TextField, { fullWidth: true, label: t('transferPricing.fiscalYear'), value: transaction.fiscalYear, onChange: (e) => setTransaction({ ...transaction, fiscalYear: e.target.value }) }), _jsx(TextField, { fullWidth: true, multiline: true, rows: 4, label: t('transferPricing.description'), value: transaction.description, onChange: (e) => setTransaction({ ...transaction, description: e.target.value }) }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: t('transferPricing.documents') }), _jsxs(Box, { sx: { display: 'flex', gap: 2 }, children: [_jsxs(Button, { variant: "outlined", startIcon: _jsx(UploadIcon, {}), component: "label", children: [t('transferPricing.uploadMasterFile'), _jsx("input", { type: "file", hidden: true, onChange: handleFileUpload('MASTER_FILE'), accept: ".pdf,.doc,.docx" })] }), _jsxs(Button, { variant: "outlined", startIcon: _jsx(UploadIcon, {}), component: "label", children: [t('transferPricing.uploadLocalFile'), _jsx("input", { type: "file", hidden: true, onChange: handleFileUpload('LOCAL_FILE'), accept: ".pdf,.doc,.docx" })] }), _jsxs(Button, { variant: "outlined", startIcon: _jsx(UploadIcon, {}), component: "label", children: [t('transferPricing.uploadCbcReport'), _jsx("input", { type: "file", hidden: true, onChange: handleFileUpload('CBC_REPORT'), accept: ".pdf,.doc,.docx" })] })] }), _jsx(List, { children: transaction.documents.map((doc) => (_jsxs(ListItem, { children: [_jsx(ListItemText, { primary: doc.fileName, secondary: `${doc.type} - ${(doc.fileSize / 1024 / 1024).toFixed(2)} MB` }), _jsx(ListItemSecondaryAction, { children: _jsx(IconButton, { edge: "end", onClick: () => {
                                                        setTransaction({
                                                            ...transaction,
                                                            documents: transaction.documents.filter(d => d.fileName !== doc.fileName)
                                                        });
                                                    }, children: _jsx(DeleteIcon, {}) }) })] }, doc.fileName))) })] }), errors.length > 0 && (_jsx(Alert, { severity: "error", children: _jsx("ul", { children: errors.map((error, index) => (_jsx("li", { children: error }, index))) }) }))] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: onClose, children: t('common.cancel') }), _jsx(Button, { onClick: handleSubmit, variant: "contained", children: t('common.add') })] })] }));
};
export const TransferPricing = () => {
    const { t } = useTranslation();
    const { relatedParties, transactions, loading, error, addRelatedParty, deleteRelatedParty, addTransaction, deleteTransaction } = useTransferPricing();
    const [showAddPartyDialog, setShowAddPartyDialog] = useState(false);
    const [showAddTransactionDialog, setShowAddTransactionDialog] = useState(false);
    if (loading) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400, children: _jsx(CircularProgress, {}) }));
    }
    if (error) {
        return _jsx(Alert, { severity: "error", children: error });
    }
    return (_jsxs(Paper, { sx: { p: 3 }, children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, children: [_jsx(Typography, { variant: "h5", children: t('transferPricing.title') }), _jsxs(Box, { children: [_jsx(Button, { startIcon: _jsx(AddIcon, {}), onClick: () => setShowAddPartyDialog(true), sx: { mr: 1 }, children: t('transferPricing.addRelatedParty') }), _jsx(Button, { startIcon: _jsx(AddIcon, {}), onClick: () => setShowAddTransactionDialog(true), variant: "contained", children: t('transferPricing.addTransaction') })] })] }), _jsxs(Box, { mb: 4, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: t('transferPricing.relatedParties') }), _jsx(List, { children: relatedParties.map((party) => (_jsxs(React.Fragment, { children: [_jsxs(ListItem, { children: [_jsx(ListItemText, { primary: party.name, secondary: `${party.jurisdiction} ${party.taxId ? `- ${party.taxId}` : ''}` }), _jsx(ListItemSecondaryAction, { children: _jsx(IconButton, { edge: "end", onClick: () => deleteRelatedParty(party.id), children: _jsx(DeleteIcon, {}) }) })] }), _jsx(Divider, {})] }, party.id))) })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: t('transferPricing.transactions') }), _jsx(List, { children: transactions.map((transaction) => (_jsxs(React.Fragment, { children: [_jsxs(ListItem, { children: [_jsx(ListItemText, { primary: _jsxs(Box, { display: "flex", alignItems: "center", gap: 1, children: [_jsx(Typography, { children: relatedParties.find(p => p.id === transaction.relatedPartyId)?.name }), _jsx(Chip, { size: "small", label: t(`transferPricing.transactionTypes.${transaction.transactionType}`) }), _jsx(Chip, { size: "small", label: transaction.transactionValue.toLocaleString('en-AE', {
                                                            style: 'currency',
                                                            currency: 'AED'
                                                        }) })] }), secondary: _jsxs(Box, { children: [_jsx(Typography, { variant: "body2", children: t(`transferPricing.pricingMethods.${transaction.transferPricingMethod}`) }), _jsx(Typography, { variant: "body2", color: "textSecondary", children: transaction.description })] }) }), _jsx(ListItemSecondaryAction, { children: _jsx(IconButton, { edge: "end", onClick: () => deleteTransaction(transaction.id), sx: { ml: 1 }, children: _jsx(DeleteIcon, {}) }) })] }), _jsx(Divider, {})] }, transaction.id))) })] }), _jsx(AddRelatedPartyDialog, { open: showAddPartyDialog, onClose: () => setShowAddPartyDialog(false), onAdd: addRelatedParty }), _jsx(AddTransactionDialog, { open: showAddTransactionDialog, onClose: () => setShowAddTransactionDialog(false), onAdd: addTransaction, relatedParties: relatedParties })] }));
};
