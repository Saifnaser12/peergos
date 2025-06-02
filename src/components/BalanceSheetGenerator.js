import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, TextField, IconButton, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Divider } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon, PictureAsPdf as PdfIcon, BarChart as ChartIcon, Add as AddIcon } from '@mui/icons-material';
import { useBalanceSheet } from '../context/BalanceSheetContext';
import { AccountType, AccountCategory } from '../types/financials';
import { Bar } from 'react-chartjs-2';
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
    const { t, i18n } = useTranslation();
    const { accounts, currentBalanceSheet, loading, error, addAccount, updateAccount, generateBalanceSheet } = useBalanceSheet();
    const [showChart, setShowChart] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    useEffect(() => {
        generateBalanceSheet();
    }, [accounts, generateBalanceSheet]);
    const handleExportPDF = () => {
        if (currentBalanceSheet) {
            downloadBalanceSheetPDF(currentBalanceSheet, t, i18n.language === 'ar');
        }
    };
    const chartData = {
        labels: ['Assets', 'Liabilities', 'Equity'],
        datasets: [
            {
                label: t('balanceSheet.breakdown'),
                data: [
                    currentBalanceSheet?.assets.totalAssets || 0,
                    currentBalanceSheet?.liabilities.totalLiabilities || 0,
                    currentBalanceSheet?.equity.totalEquity || 0
                ],
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1
            }
        ]
    };
    if (loading) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400, children: _jsx(CircularProgress, {}) }));
    }
    if (error) {
        return _jsx(Alert, { severity: "error", children: error });
    }
    if (!currentBalanceSheet) {
        return _jsx(Alert, { severity: "info", children: t('balanceSheet.noData') });
    }
    return (_jsxs(Paper, { sx: { p: 3 }, children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, children: [_jsx(Typography, { variant: "h5", children: t('balanceSheet.title') }), _jsxs(Box, { children: [_jsx(Button, { startIcon: _jsx(AddIcon, {}), onClick: () => setShowAddDialog(true), sx: { mr: 1 }, children: t('balanceSheet.addAccount') }), _jsx(Button, { startIcon: _jsx(ChartIcon, {}), onClick: () => setShowChart(!showChart), sx: { mr: 1 }, children: showChart ? t('balanceSheet.hideChart') : t('balanceSheet.showChart') }), _jsx(Button, { startIcon: _jsx(PdfIcon, {}), onClick: handleExportPDF, children: t('common.export') })] })] }), showChart && (_jsx(Box, { mb: 4, height: 300, children: _jsx(Bar, { data: chartData, options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    } }) })), _jsxs(Box, { sx: { display: 'flex', flexWrap: 'wrap', gap: 4 }, children: [_jsxs(Box, { sx: { flex: '1 1 300px', minWidth: 0 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: t('balanceSheet.assets') }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", color: "primary", gutterBottom: true, children: t('balanceSheet.currentAssets') }), currentBalanceSheet.assets.currentAssets.map((account) => (_jsx(AccountRow, { account: account, onEdit: updateAccount }, account.id)))] }), _jsxs(Box, { mt: 2, children: [_jsx(Typography, { variant: "subtitle1", color: "primary", gutterBottom: true, children: t('balanceSheet.fixedAssets') }), currentBalanceSheet.assets.fixedAssets.map((account) => (_jsx(AccountRow, { account: account, onEdit: updateAccount }, account.id)))] }), _jsx(Divider, { sx: { my: 2 } }), _jsxs(Box, { display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "subtitle1", fontWeight: "bold", children: t('balanceSheet.totalAssets') }), _jsx(Typography, { variant: "subtitle1", fontWeight: "bold", children: currentBalanceSheet.assets.totalAssets.toLocaleString('en-AE', {
                                            style: 'currency',
                                            currency: 'AED'
                                        }) })] })] }), _jsxs(Box, { sx: { flex: '1 1 300px', minWidth: 0 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: t('balanceSheet.liabilities') }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", color: "primary", gutterBottom: true, children: t('balanceSheet.currentLiabilities') }), currentBalanceSheet.liabilities.currentLiabilities.map((account) => (_jsx(AccountRow, { account: account, onEdit: updateAccount }, account.id)))] }), _jsxs(Box, { mt: 2, children: [_jsx(Typography, { variant: "subtitle1", color: "primary", gutterBottom: true, children: t('balanceSheet.longTermLiabilities') }), currentBalanceSheet.liabilities.longTermLiabilities.map((account) => (_jsx(AccountRow, { account: account, onEdit: updateAccount }, account.id)))] }), _jsx(Divider, { sx: { my: 2 } }), _jsxs(Box, { display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "subtitle1", fontWeight: "bold", children: t('balanceSheet.totalLiabilities') }), _jsx(Typography, { variant: "subtitle1", fontWeight: "bold", children: currentBalanceSheet.liabilities.totalLiabilities.toLocaleString('en-AE', {
                                            style: 'currency',
                                            currency: 'AED'
                                        }) })] })] }), _jsxs(Box, { sx: { flex: '1 1 300px', minWidth: 0 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: t('balanceSheet.equity') }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", color: "primary", gutterBottom: true, children: t('balanceSheet.shareCapital') }), currentBalanceSheet.equity.shareCapital.map((account) => (_jsx(AccountRow, { account: account, onEdit: updateAccount }, account.id)))] }), _jsxs(Box, { mt: 2, children: [_jsx(Typography, { variant: "subtitle1", color: "primary", gutterBottom: true, children: t('balanceSheet.retainedEarnings') }), currentBalanceSheet.equity.retainedEarnings.map((account) => (_jsx(AccountRow, { account: account, onEdit: updateAccount }, account.id)))] }), _jsx(Divider, { sx: { my: 2 } }), _jsxs(Box, { display: "flex", justifyContent: "space-between", children: [_jsx(Typography, { variant: "subtitle1", fontWeight: "bold", children: t('balanceSheet.totalEquity') }), _jsx(Typography, { variant: "subtitle1", fontWeight: "bold", children: currentBalanceSheet.equity.totalEquity.toLocaleString('en-AE', {
                                            style: 'currency',
                                            currency: 'AED'
                                        }) })] })] })] }), _jsx(Box, { mt: 4, children: _jsx(Alert, { severity: Math.abs(currentBalanceSheet.assets.totalAssets -
                        currentBalanceSheet.totalLiabilitiesAndEquity) < 0.01
                        ? 'success'
                        : 'error', children: Math.abs(currentBalanceSheet.assets.totalAssets -
                        currentBalanceSheet.totalLiabilitiesAndEquity) < 0.01
                        ? t('balanceSheet.balanced')
                        : t('balanceSheet.notBalanced') }) }), _jsx(AddAccountDialog, { open: showAddDialog, onClose: () => setShowAddDialog(false), onAdd: addAccount })] }));
};
