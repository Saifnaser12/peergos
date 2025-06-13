import { useState, useEffect } from 'react';
import { backupService } from '../services/BackupService';
export const useBackup = () => {
    const [backups, setBackups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const loadBackups = async () => {
        try {
            const backupList = backupService.getBackupList();
            setBackups(backupList);
            setError(null);
        }
        catch (err) {
            setError('Failed to load backups');
        }
    };
    const createBackup = async (description) => {
        setLoading(true);
        setError(null);
        try {
            const backupId = await backupService.createBackup(description);
            await loadBackups();
            return backupId;
        }
        catch (err) {
            setError('Failed to create backup');
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    const restoreBackup = async (backupId) => {
        setLoading(true);
        setError(null);
        try {
            await backupService.restoreFromBackup(backupId);
        }
        catch (err) {
            setError('Failed to restore backup');
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    const exportBackup = async (backupId) => {
        setError(null);
        try {
            await backupService.exportBackup(backupId);
        }
        catch (err) {
            setError('Failed to export backup');
            throw err;
        }
    };
    const deleteBackup = async (backupId) => {
        setError(null);
        try {
            await backupService.deleteBackup(backupId);
            await loadBackups();
        }
        catch (err) {
            setError('Failed to delete backup');
            throw err;
        }
    };
    const scheduleAutoBackup = async () => {
        try {
            await backupService.scheduleAutoBackup();
            await loadBackups();
        }
        catch (err) {
            setError('Failed to schedule auto backup');
        }
    };
    const createSystemBackup = async (description) => {
        setLoading(true);
        setError(null);
        try {
            const backupId = await backupService.createBackup(description);
            await loadBackups();
            return backupId;
        }
        catch (err) {
            setError('Failed to create system backup');
            throw err;
        }
        finally {
            setLoading(false);
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
        createSystemBackup,
        refreshBackups: loadBackups
    };
};
