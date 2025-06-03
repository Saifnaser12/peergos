import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useBalanceSheet } from '../context/BalanceSheetContext';
import { AccountType, AccountCategory } from '../types/financials';
import { useTranslation } from 'react-i18next';
import { downloadBalanceSheetPDF } from '../utils/pdfExport';
const AccountRow = ({ account, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedBalance, setEditedBalance] = useState(account.balance.toString());
    const handleSave = () => {
        onEdit({
            ...account,
            balance: parseFloat(editedBalance)
        });
        setIsEditing(false);
    };
    return (_jsxs(Box, { display: "flex", alignItems: "center", my: 1, children: [_jsx(Typography, { flex: 1, children: account.name }), isEditing ? (_jsxs(_Fragment, { children: [_jsx(TextField, { size: "small", value: editedBalance, onChange: (e) => setEditedBalance(e.target.value), type: "number", sx: { width: 150, mx: 2 } }), _jsx(IconButton, { onClick: handleSave, color: "primary", children: _jsx(SaveIcon, {}) }), _jsx(IconButton, { onClick: () => setIsEditing(false), color: "error", children: _jsx(CancelIcon, {}) })] })) : (_jsxs(_Fragment, { children: [_jsx(Typography, { sx: { width: 150, textAlign: 'right', mx: 2 }, children: account.balance.toLocaleString('en-AE', {
                            style: 'currency',
                            currency: 'AED'
                        }) }), !account.isLocked && (_jsx(IconButton, { onClick: () => setIsEditing(true), children: _jsx(EditIcon, {}) }))] }))] }));
};
const AddAccountDialog = ({ open, onClose, onAdd }) => {
    const { t } = useTranslation();
    const [account, setAccount] = useState({
        code: '',
        name: '',
        type: AccountType.ASSET,
        category: AccountCategory.CURRENT_ASSETS,
        balance: 0,
        isLocked: false
    });
    const handleSubmit = () => {
        onAdd(account);
        onClose();
    };
    return (_jsxs(Dialog, { open: open, onClose: onClose, children: [_jsx(DialogTitle, { children: t('balanceSheet.addAccount') }), _jsx(DialogContent, { children: _jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }, children: [_jsx(TextField, { fullWidth: true, label: t('balanceSheet.accountCode'), value: account.code, onChange: (e) => setAccount({ ...account, code: e.target.value }) }), _jsx(TextField, { fullWidth: true, label: t('balanceSheet.accountName'), value: account.name, onChange: (e) => setAccount({ ...account, name: e.target.value }) }), _jsx(TextField, { fullWidth: true, select: true, label: t('balanceSheet.accountType'), value: account.type, onChange: (e) => setAccount({ ...account, type: e.target.value }), children: Object.values(AccountType).map((type) => (_jsx(MenuItem, { value: type, children: t(`balanceSheet.accountTypes.${type}`) }, type))) }), _jsx(TextField, { fullWidth: true, select: true, label: t('balanceSheet.accountCategory'), value: account.category, onChange: (e) => setAccount({ ...account, category: e.target.value }), children: Object.values(AccountCategory).map((category) => (_jsx(MenuItem, { value: category, children: t(`balanceSheet.accountCategories.${category}`) }, category))) }), _jsx(TextField, { fullWidth: true, type: "number", label: t('balanceSheet.initialBalance'), value: account.balance, onChange: (e) => setAccount({ ...account, balance: parseFloat(e.target.value) }) })] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: onClose, children: t('common.cancel') }), _jsx(Button, { onClick: handleSubmit, variant: "contained", children: t('common.add') })] })] }));
};
export const BalanceSheetGenerator = () => {
    const { t } = useTranslation();
    const { accounts, currentBalanceSheet, addAccount, updateAccount, generateBalanceSheet } = useBalanceSheet();
    const [showAddDialog, setShowAddDialog] = useState(false);
    useEffect(() => {
        generateBalanceSheet();
    }, [accounts, generateBalanceSheet]);
    const handleExportPDF = () => {
        if (currentBalanceSheet) {
            downloadBalanceSheetPDF(currentBalanceSheet, t, false);
        }
    };
    return (_jsxs(Box, { children: [_jsx(Typography, { variant: "h4", gutterBottom: true, children: t('balanceSheet.title') }), _jsx(Button, { onClick: () => setShowAddDialog(true), children: t('balanceSheet.addAccount') }), _jsx(Button, { onClick: handleExportPDF, children: t('balanceSheet.exportPDF') }), _jsx(AddAccountDialog, { open: showAddDialog, onClose: () => setShowAddDialog(false), onAdd: addAccount })] }));
};
