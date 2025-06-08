
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Backup as BackupIcon,
  Restore as RestoreIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  Security as SecurityIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { backupService, BackupMetadata } from '../services/BackupService';

const BackupManager: React.FC = () => {
  const { t } = useTranslation();
  const [backups, setBackups] = useState<BackupMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupMetadata | null>(null);
  const [backupDescription, setBackupDescription] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadBackups();
    // Schedule auto backup on component mount
    backupService.scheduleAutoBackup();
  }, []);

  const loadBackups = () => {
    try {
      const backupList = backupService.getBackupList();
      setBackups(backupList);
    } catch (error) {
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
    } catch (error) {
      showAlert('error', 'Failed to create backup');
    }
    setLoading(false);
  };

  const handleRestoreBackup = async () => {
    if (!selectedBackup) return;
    
    setLoading(true);
    try {
      await backupService.restoreFromBackup(selectedBackup.id);
      setRestoreDialogOpen(false);
      setSelectedBackup(null);
      showAlert('success', 'Data restored successfully. Page will reload.');
    } catch (error) {
      showAlert('error', 'Failed to restore backup');
    }
    setLoading(false);
  };

  const handleExportBackup = async (backupId: string) => {
    try {
      await backupService.exportBackup(backupId);
      showAlert('success', 'Backup exported successfully');
    } catch (error) {
      showAlert('error', 'Failed to export backup');
    }
  };

  const handleDeleteBackup = async (backupId: string) => {
    if (!confirm('Are you sure you want to delete this backup?')) return;
    
    try {
      await backupService.deleteBackup(backupId);
      loadBackups();
      showAlert('success', 'Backup deleted successfully');
    } catch (error) {
      showAlert('error', 'Failed to delete backup');
    }
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        🛡️ Backup & Recovery
      </Typography>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {/* Backup Actions */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Data Backup Management</Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              startIcon={<BackupIcon />}
              onClick={() => setCreateDialogOpen(true)}
              disabled={loading}
            >
              Create Backup
            </Button>
            <Button
              variant="outlined"
              startIcon={<ScheduleIcon />}
              onClick={() => backupService.scheduleAutoBackup()}
              disabled={loading}
            >
              Force Auto Backup
            </Button>
          </Box>
        </Box>

        <Alert severity="info" icon={<SecurityIcon />}>
          <Typography variant="body2">
            🔒 All backups are encrypted using AES encryption. Daily auto-backups are created automatically.
            Keep maximum 30 backups to optimize storage.
          </Typography>
        </Alert>
      </Paper>

      {/* Backup List */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Available Backups ({backups.length})
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date & Time</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="center">Records</TableCell>
                <TableCell align="center">Size</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {backups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="textSecondary">
                      No backups found. Create your first backup above.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                backups.map((backup) => (
                  <TableRow key={backup.id} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(backup.timestamp)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {backup.description}
                        {backup.description.includes('auto backup') && (
                          <Chip label="Auto" size="small" color="primary" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={backup.recordCount} size="small" />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">{backup.size}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center" gap={1}>
                        <Tooltip title="Restore from this backup">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedBackup(backup);
                              setRestoreDialogOpen(true);
                            }}
                            disabled={loading}
                          >
                            <RestoreIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Export backup">
                          <IconButton
                            size="small"
                            onClick={() => handleExportBackup(backup.id)}
                            disabled={loading}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete backup">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteBackup(backup.id)}
                            disabled={loading}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create Backup Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Backup</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Backup Description (optional)"
            fullWidth
            variant="outlined"
            value={backupDescription}
            onChange={(e) => setBackupDescription(e.target.value)}
            placeholder="e.g., Before tax filing submission"
          />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            This backup will include all revenue/expense entries, invoices, tax forms, and settings.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateBackup} 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <BackupIcon />}
          >
            Create Backup
          </Button>
        </DialogActions>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <Dialog open={restoreDialogOpen} onClose={() => setRestoreDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>⚠️ Restore Data from Backup</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Warning:</strong> This will replace all current data with data from the selected backup. 
              A pre-restore backup will be created automatically.
            </Typography>
          </Alert>
          {selectedBackup && (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>Backup Details:</strong>
              </Typography>
              <Typography variant="body2">Date: {formatDate(selectedBackup.timestamp)}</Typography>
              <Typography variant="body2">Description: {selectedBackup.description}</Typography>
              <Typography variant="body2">Records: {selectedBackup.recordCount}</Typography>
              <Typography variant="body2">Size: {selectedBackup.size}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestoreDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleRestoreBackup} 
            variant="contained" 
            color="warning"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <RestoreIcon />}
          >
            Restore Data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BackupManager;
