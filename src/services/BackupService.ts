
import { SecureStorage } from '../utils/storage';
import CryptoJS from 'crypto-js';

export interface BackupData {
  id: string;
  timestamp: string;
  version: string;
  data: {
    finance: {
      revenue: any[];
      expenses: any[];
    };
    invoices: any[];
    taxForms: {
      cit: any;
      vat: any;
    };
    userSettings: any;
    uploadedFiles: any[];
  };
  metadata: {
    totalRecords: number;
    dataSize: string;
    checksum: string;
  };
}

export interface BackupMetadata {
  id: string;
  timestamp: string;
  description: string;
  size: string;
  recordCount: number;
}

class BackupService {
  private readonly BACKUP_KEY_PREFIX = 'backup_';
  private readonly BACKUP_METADATA_KEY = 'backup_metadata_list';
  private readonly MAX_BACKUPS = 30; // Keep 30 days of backups
  private readonly ENCRYPTION_KEY = process.env.VITE_BACKUP_KEY || 'peergos-backup-key-2025';

  // Create a new backup
  async createBackup(description?: string): Promise<string> {
    try {
      const backupId = `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = new Date().toISOString();

      // Collect all user data
      const backupData: BackupData = {
        id: backupId,
        timestamp,
        version: '1.0.0',
        data: await this.collectUserData(),
        metadata: {
          totalRecords: 0,
          dataSize: '',
          checksum: ''
        }
      };

      // Calculate metadata
      const dataString = JSON.stringify(backupData.data);
      backupData.metadata.totalRecords = this.countRecords(backupData.data);
      backupData.metadata.dataSize = this.formatBytes(dataString.length);
      backupData.metadata.checksum = CryptoJS.SHA256(dataString).toString();

      // Store encrypted backup
      SecureStorage.set(`${this.BACKUP_KEY_PREFIX}${backupId}`, backupData, { 
        encrypted: true 
      });

      // Update metadata list
      await this.updateBackupMetadata({
        id: backupId,
        timestamp,
        description: description || `Auto backup - ${new Date().toLocaleDateString()}`,
        size: backupData.metadata.dataSize,
        recordCount: backupData.metadata.totalRecords
      });

      // Clean old backups
      await this.cleanOldBackups();

      console.log(`✅ Backup created successfully: ${backupId}`);
      return backupId;
    } catch (error) {
      console.error('❌ Backup creation failed:', error);
      throw new Error('Failed to create backup');
    }
  }

  // Collect all user-generated data
  private async collectUserData(): Promise<BackupData['data']> {
    return {
      finance: {
        revenue: this.getStorageData('finance_revenue') || [],
        expenses: this.getStorageData('finance_expenses') || []
      },
      invoices: this.getStorageData('invoices') || [],
      taxForms: {
        cit: this.getStorageData('cit_form_data') || {},
        vat: this.getStorageData('vat_form_data') || {}
      },
      userSettings: this.getStorageData('settings') || {},
      uploadedFiles: this.getStorageData('uploaded_files') || []
    };
  }

  // Restore from backup
  async restoreFromBackup(backupId: string): Promise<void> {
    try {
      const backupData = SecureStorage.get<BackupData>(`${this.BACKUP_KEY_PREFIX}${backupId}`, { 
        encrypted: true 
      });

      if (!backupData) {
        throw new Error('Backup not found');
      }

      // Verify backup integrity
      const dataString = JSON.stringify(backupData.data);
      const currentChecksum = CryptoJS.SHA256(dataString).toString();
      
      if (currentChecksum !== backupData.metadata.checksum) {
        throw new Error('Backup integrity check failed');
      }

      // Create recovery backup before restoring
      await this.createBackup(`Pre-restore backup - ${new Date().toLocaleDateString()}`);

      // Restore all data
      await this.restoreUserData(backupData.data);

      console.log(`✅ Data restored successfully from backup: ${backupId}`);
    } catch (error) {
      console.error('❌ Restore failed:', error);
      throw new Error(`Failed to restore from backup: ${error.message}`);
    }
  }

  // Restore user data to storage
  private async restoreUserData(data: BackupData['data']): Promise<void> {
    // Restore finance data
    if (data.finance.revenue.length > 0) {
      localStorage.setItem('finance_revenue', JSON.stringify(data.finance.revenue));
    }
    if (data.finance.expenses.length > 0) {
      localStorage.setItem('finance_expenses', JSON.stringify(data.finance.expenses));
    }

    // Restore invoices
    if (data.invoices.length > 0) {
      localStorage.setItem('invoices', JSON.stringify(data.invoices));
    }

    // Restore tax forms
    if (Object.keys(data.taxForms.cit).length > 0) {
      localStorage.setItem('cit_form_data', JSON.stringify(data.taxForms.cit));
    }
    if (Object.keys(data.taxForms.vat).length > 0) {
      localStorage.setItem('vat_form_data', JSON.stringify(data.taxForms.vat));
    }

    // Restore settings
    if (Object.keys(data.userSettings).length > 0) {
      localStorage.setItem('settings', JSON.stringify(data.userSettings));
    }

    // Trigger page reload to apply restored data
    window.location.reload();
  }

  // Get all backup metadata
  getBackupList(): BackupMetadata[] {
    const metadata = SecureStorage.get<BackupMetadata[]>(this.BACKUP_METADATA_KEY) || [];
    return metadata.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Delete a specific backup
  async deleteBackup(backupId: string): Promise<void> {
    try {
      SecureStorage.remove(`${this.BACKUP_KEY_PREFIX}${backupId}`);
      
      const metadata = this.getBackupList();
      const updatedMetadata = metadata.filter(item => item.id !== backupId);
      SecureStorage.set(this.BACKUP_METADATA_KEY, updatedMetadata);

      console.log(`🗑️ Backup deleted: ${backupId}`);
    } catch (error) {
      console.error('❌ Failed to delete backup:', error);
      throw new Error('Failed to delete backup');
    }
  }

  // Export backup data
  async exportBackup(backupId: string): Promise<void> {
    try {
      const backupData = SecureStorage.get<BackupData>(`${this.BACKUP_KEY_PREFIX}${backupId}`, { 
        encrypted: true 
      });

      if (!backupData) {
        throw new Error('Backup not found');
      }

      const exportData = {
        ...backupData,
        exportedAt: new Date().toISOString(),
        note: 'Peergos UAE Tax System Data Export'
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `peergos-backup-${backupData.timestamp.split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log(`📤 Backup exported: ${backupId}`);
    } catch (error) {
      console.error('❌ Export failed:', error);
      throw new Error('Failed to export backup');
    }
  }

  // Auto backup functionality
  async scheduleAutoBackup(): Promise<void> {
    const lastBackup = SecureStorage.get<string>('last_auto_backup_date');
    const today = new Date().toDateString();

    if (lastBackup !== today) {
      await this.createBackup(`Daily auto backup - ${today}`);
      SecureStorage.set('last_auto_backup_date', today);
    }
  }

  // Helper methods
  private getStorageData(key: string): any {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private async updateBackupMetadata(metadata: BackupMetadata): Promise<void> {
    const currentMetadata = this.getBackupList();
    currentMetadata.push(metadata);
    SecureStorage.set(this.BACKUP_METADATA_KEY, currentMetadata);
  }

  private async cleanOldBackups(): Promise<void> {
    const metadata = this.getBackupList();
    if (metadata.length > this.MAX_BACKUPS) {
      const toDelete = metadata.slice(this.MAX_BACKUPS);
      for (const backup of toDelete) {
        await this.deleteBackup(backup.id);
      }
    }
  }

  private countRecords(data: BackupData['data']): number {
    return (
      data.finance.revenue.length +
      data.finance.expenses.length +
      data.invoices.length +
      Object.keys(data.taxForms.cit).length +
      Object.keys(data.taxForms.vat).length +
      data.uploadedFiles.length
    );
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export const backupService = new BackupService();
