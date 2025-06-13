import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, IconButton, Alert, CircularProgress, Tooltip } from '@mui/material';
import { Backup as BackupIcon, Restore as RestoreIcon, Download as DownloadIcon, Delete as DeleteIcon, Schedule as ScheduleIcon, Security as SecurityIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { backupService } from '../services/BackupService';
const BackupManager = () => {
    const { t } = useTranslation();
    const [backups, setBackups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
    const [selectedBackup, setSelectedBackup] = useState(null);
    const [backupDescription, setBackupDescription] = useState('');
    const [alert, setAlert] = useState(null);
    useEffect(() => {
        loadBackups();
        // Schedule auto backup on component mount
        backupService.scheduleAutoBackup();
    }, []);
    const loadBackups = () => {
        try {
            const backupList = backupService.getBackupList();
            setBackups(backupList);
        }
        catch (error) {
            showAlert('error', 'Failed to load backups');
        }
    };
    const handleCreateBackup = async () => {
        setLoading(true);
        try {
            await backupService.createBackup(backupDescription || undefined);
            setCreateDialogOpen(false);
            setBackupDescription('');
            loadBackups();
            showAlert('success', 'Backup created successfully');
        }
        catch (error) {
            showAlert('error', 'Failed to create backup');
        }
        setLoading(false);
    };
    const handleRestoreBackup = async () => {
        if (!selectedBackup)
            return;
        setLoading(true);
        try {
            await backupService.restoreFromBackup(selectedBackup.id);
            setRestoreDialogOpen(false);
            setSelectedBackup(null);
            showAlert('success', 'Data restored successfully. Page will reload.');
        }
        catch (error) {
            showAlert('error', 'Failed to restore backup');
        }
        setLoading(false);
    };
    const handleExportBackup = async (backupId) => {
        try {
            await backupService.exportBackup(backupId);
            showAlert('success', 'Backup exported successfully');
        }
        catch (error) {
            showAlert('error', 'Failed to export backup');
        }
    };
    const handleDeleteBackup = async (backupId) => {
        if (!confirm('Are you sure you want to delete this backup?'))
            return;
        try {
            await backupService.deleteBackup(backupId);
            loadBackups();
            showAlert('success', 'Backup deleted successfully');
        }
        catch (error) {
            showAlert('error', 'Failed to delete backup');
        }
    };
    const showAlert = (type, message) => {
        setAlert({ type, message });
        setTimeout(() => setAlert(null), 5000);
    };
    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };
    return (_jsxs(Box, { children: [_jsx(Typography, { variant: "h4", gutterBottom: true, children: "\uD83D\uDEE1\uFE0F Backup & Recovery" }), alert && (_jsx(Alert, { severity: alert.type, sx: { mb: 3 }, onClose: () => setAlert(null), children: alert.message })), _jsxs(Paper, { sx: { p: 3, mb: 3 }, children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, children: [_jsx(Typography, { variant: "h6", children: "Data Backup Management" }), _jsxs(Box, { display: "flex", gap: 2, children: [_jsx(Button, { variant: "contained", startIcon: _jsx(BackupIcon, {}), onClick: () => setCreateDialogOpen(true), disabled: loading, children: "Create Backup" }), _jsx(Button, { variant: "outlined", startIcon: _jsx(ScheduleIcon, {}), onClick: () => backupService.scheduleAutoBackup(), disabled: loading, children: "Force Auto Backup" })] })] }), _jsx(Alert, { severity: "info", icon: _jsx(SecurityIcon, {}), children: _jsx(Typography, { variant: "body2", children: "\uD83D\uDD12 All backups are encrypted using AES encryption. Daily auto-backups are created automatically. Keep maximum 30 backups to optimize storage." }) })] }), _jsxs(Paper, { sx: { p: 3 }, children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: ["Available Backups (", backups.length, ")"] }), _jsx(TableContainer, { children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Date & Time" }), _jsx(TableCell, { children: "Description" }), _jsx(TableCell, { align: "center", children: "Records" }), _jsx(TableCell, { align: "center", children: "Size" }), _jsx(TableCell, { align: "center", children: "Actions" })] }) }), _jsx(TableBody, { children: backups.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 5, align: "center", children: _jsx(Typography, { color: "textSecondary", children: "No backups found. Create your first backup above." }) }) })) : (backups.map((backup) => (_jsxs(TableRow, { hover: true, children: [_jsx(TableCell, { children: _jsx(Typography, { variant: "body2", children: formatDate(backup.timestamp) }) }), _jsx(TableCell, { children: _jsxs(Box, { display: "flex", alignItems: "center", gap: 1, children: [backup.description, backup.description.includes('auto backup') && (_jsx(Chip, { label: "Auto", size: "small", color: "primary" }))] }) }), _jsx(TableCell, { align: "center", children: _jsx(Chip, { label: backup.recordCount, size: "small" }) }), _jsx(TableCell, { align: "center", children: _jsx(Typography, { variant: "body2", children: backup.size }) }), _jsx(TableCell, { align: "center", children: _jsxs(Box, { display: "flex", justifyContent: "center", gap: 1, children: [_jsx(Tooltip, { title: "Restore from this backup", children: _jsx(IconButton, { size: "small", onClick: () => {
                                                                    setSelectedBackup(backup);
                                                                    setRestoreDialogOpen(true);
                                                                }, disabled: loading, children: _jsx(RestoreIcon, {}) }) }), _jsx(Tooltip, { title: "Export backup", children: _jsx(IconButton, { size: "small", onClick: () => handleExportBackup(backup.id), disabled: loading, children: _jsx(DownloadIcon, {}) }) }), _jsx(Tooltip, { title: "Delete backup", children: _jsx(IconButton, { size: "small", onClick: () => handleDeleteBackup(backup.id), disabled: loading, children: _jsx(DeleteIcon, {}) }) })] }) })] }, backup.id)))) })] }) })] }), _jsxs(Dialog, { open: createDialogOpen, onClose: () => setCreateDialogOpen(false), maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: "Create New Backup" }), _jsxs(DialogContent, { children: [_jsx(TextField, { autoFocus: true, margin: "dense", label: "Backup Description (optional)", fullWidth: true, variant: "outlined", value: backupDescription, onChange: (e) => setBackupDescription(e.target.value), placeholder: "e.g., Before tax filing submission" }), _jsx(Typography, { variant: "body2", color: "textSecondary", sx: { mt: 2 }, children: "This backup will include all revenue/expense entries, invoices, tax forms, and settings." })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setCreateDialogOpen(false), disabled: loading, children: "Cancel" }), _jsx(Button, { onClick: handleCreateBackup, variant: "contained", disabled: loading, startIcon: loading ? _jsx(CircularProgress, { size: 20 }) : _jsx(BackupIcon, {}), children: "Create Backup" })] })] }), _jsxs(Dialog, { open: restoreDialogOpen, onClose: () => setRestoreDialogOpen(false), maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: "\u26A0\uFE0F Restore Data from Backup" }), _jsxs(DialogContent, { children: [_jsx(Alert, { severity: "warning", sx: { mb: 2 }, children: _jsxs(Typography, { variant: "body2", children: [_jsx("strong", { children: "Warning:" }), " This will replace all current data with data from the selected backup. A pre-restore backup will be created automatically."] }) }), selectedBackup && (_jsxs(Box, { children: [_jsx(Typography, { variant: "body1", gutterBottom: true, children: _jsx("strong", { children: "Backup Details:" }) }), _jsxs(Typography, { variant: "body2", children: ["Date: ", formatDate(selectedBackup.timestamp)] }), _jsxs(Typography, { variant: "body2", children: ["Description: ", selectedBackup.description] }), _jsxs(Typography, { variant: "body2", children: ["Records: ", selectedBackup.recordCount] }), _jsxs(Typography, { variant: "body2", children: ["Size: ", selectedBackup.size] })] }))] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setRestoreDialogOpen(false), disabled: loading, children: "Cancel" }), _jsx(Button, { onClick: handleRestoreBackup, variant: "contained", color: "warning", disabled: loading, startIcon: loading ? _jsx(CircularProgress, { size: 20 }) : _jsx(RestoreIcon, {}), children: "Restore Data" })] })] })] }));
};
export default BackupManager;
