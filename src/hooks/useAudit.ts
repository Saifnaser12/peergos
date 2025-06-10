
import { useContext } from 'react';
import { AuditContext } from '../context/AuditContext';

export const useAudit = () => {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAudit must be used within an AuditProvider');
  }

  const getRecentEntries = (limit: number = 50) => {
    return context.auditLogs.slice(-limit).reverse();
  };

  const clearLog = () => {
    // Clear implementation
    console.log('Clearing audit logs...');
  };

  return {
    ...context,
    getRecentEntries,
    clearLog,
  };
};
