
import { useState, useEffect } from 'react';
import { backupService, BackupMetadata } from '../services/BackupService';

export const useBackup = () => {
  const [backups, setBackups] = useState<BackupMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBackups = async () => {
    try {
      const backupList = backupService.getBackupList();
      setBackups(backupList);
      setError(null);
    } catch (err) {
      setError('Failed to load backups');
    }
  };

  const createBackup = async (description?: string) => {
    setLoading(true);
    setError(null);
    try {
      const backupId = await backupService.createBackup(description);
      await loadBackups();
      return backupId;
    } catch (err) {
      setError('Failed to create backup');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const restoreBackup = async (backupId: string) => {
    setLoading(true);
    setError(null);
    try {
      await backupService.restoreFromBackup(backupId);
    } catch (err) {
      setError('Failed to restore backup');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const exportBackup = async (backupId: string) => {
    setError(null);
    try {
      await backupService.exportBackup(backupId);
    } catch (err) {
      setError('Failed to export backup');
      throw err;
    }
  };

  const deleteBackup = async (backupId: string) => {
    setError(null);
    try {
      await backupService.deleteBackup(backupId);
      await loadBackups();
    } catch (err) {
      setError('Failed to delete backup');
      throw err;
    }
  };

  const scheduleAutoBackup = async () => {
    try {
      await backupService.scheduleAutoBackup();
      await loadBackups();
    } catch (err) {
      setError('Failed to schedule auto backup');
    }
  };

  useEffect(() => {
    loadBackups();
  }, []);

  return {
    backups,
    loading,
    error,
    createBackup,
    restoreBackup,
    exportBackup,
    deleteBackup,
    scheduleAutoBackup,
    refreshBackups: loadBackups
  };
};
