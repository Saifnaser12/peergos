import { useState, useEffect, useCallback } from 'react';
import { libraryLoader } from '../utils/libraryLoader';

interface SyncStatus {
  isConnected: boolean;
  lastSyncTime: Date | null;
  syncError: string | null;
  syncProgress: number;
}

interface FinancialSyncOptions {
  autoSync?: boolean;
  syncInterval?: number; // milliseconds
  retryAttempts?: number;
}

export const useFinancialSync = (options: FinancialSyncOptions = {}) => {
  const { autoSync = true, syncInterval = 30000, retryAttempts = 3 } = options;

  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isConnected: false,
    lastSyncTime: null,
    syncError: null,
    syncProgress: 0
  });

  // Initialize connection
  useEffect(() => {
    console.log('🔄 Initializing financial sync service...');

    const initializeSync = async () => {
      try {
        // Load required libraries with proper error handling
        await Promise.allSettled([
          libraryLoader.loadJsSHA(),
          libraryLoader.loadQRCode()
        ]);

        // Simulate connection to external services
        await new Promise(resolve => setTimeout(resolve, 500));

        setSyncStatus(prev => ({
          ...prev,
          isConnected: true,
          lastSyncTime: new Date(),
          syncError: null
        }));

        console.log('✅ Financial sync service connected');
      } catch (error) {
        console.error('❌ Failed to initialize sync service:', error);
        setSyncStatus(prev => ({
          ...prev,
          isConnected: false,
          syncError: error instanceof Error ? error.message : 'Failed to connect to sync service'
        }));
      }
    };

    initializeSync();
  }, []);

  // Auto-sync functionality
  useEffect(() => {
    if (!autoSync || !syncStatus.isConnected) return;

    console.log('🔄 Setting up auto-sync interval');
    const interval = setInterval(() => {
      console.log('🔄 Auto-sync triggered');
      performSync();
    }, syncInterval);

    return () => {
      console.log('🔄 Clearing auto-sync interval');
      clearInterval(interval);
    };
  }, [autoSync, syncInterval, syncStatus.isConnected, performSync]);

  const performSync = useCallback(async () => {
    setSyncStatus(prev => ({
      ...prev,
      syncProgress: 0,
      syncError: null
    }));

    try {
      // Simulate sync progress
      for (let i = 0; i <= 100; i += 10) {
        setSyncStatus(prev => ({ ...prev, syncProgress: i }));
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      setSyncStatus(prev => ({
        ...prev,
        lastSyncTime: new Date(),
        syncProgress: 100,
        isConnected: true
      }));

      console.log('✅ Sync completed successfully');
    } catch (error) {
      console.error('❌ Sync failed:', error);
      setSyncStatus(prev => ({
        ...prev,
        syncError: 'Sync failed',
        syncProgress: 0
      }));
    }
  }, []);

  const syncData = useCallback(async (data: any) => {
    console.log('🔄 Manual sync initiated with data:', data);
    return performSync();
  }, [performSync]);

  const forceReconnect = useCallback(async () => {
    console.log('🔄 Force reconnecting...');
    setSyncStatus(prev => ({
      ...prev,
      isConnected: false,
      syncError: null
    }));

    // Simulate reconnection
    await new Promise(resolve => setTimeout(resolve, 2000));

    setSyncStatus(prev => ({
      ...prev,
      isConnected: true,
      lastSyncTime: new Date()
    }));
  }, []);

  // Auto-sync functionality
  useEffect(() => {
    if (!autoSync || !syncStatus.isConnected) return;

    console.log('🔄 Setting up auto-sync interval');
    const interval = setInterval(() => {
      console.log('🔄 Auto-sync triggered');
      performSync();
    }, syncInterval);

    return () => {
      console.log('🔄 Clearing auto-sync interval');
      clearInterval(interval);
    };
  }, [autoSync, syncInterval, syncStatus.isConnected, performSync]);

  return {
    ...syncStatus,
    syncData,
    forceReconnect,
    performSync
  };
};