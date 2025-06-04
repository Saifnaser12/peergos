import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  role: string;
  details?: Record<string, any>;
}

interface AuditContextType {
  log: (action: string, details?: Record<string, any>) => void;
  getRecentEntries: (limit?: number) => AuditEntry[];
  clearLog: () => void;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

const STORAGE_KEY = 'audit_log';

export const AuditProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auditLog, setAuditLog] = useState<{ entries: AuditEntry[] }>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { entries: [] };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auditLog));
  }, [auditLog]);

  const log = (action: string, details?: Record<string, any>) => {
    const entry: AuditEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      action,
      role: 'SME', // Default role
      details
    };

    setAuditLog(prev => ({
      entries: [entry, ...prev.entries].slice(0, 1000)
    }));
  };

  const getRecentEntries = (limit = 50): AuditEntry[] => {
    return auditLog.entries.slice(0, limit);
  };

  const clearLog = () => {
    setAuditLog({ entries: [] });
  };

  return (
    <AuditContext.Provider value={{ log, getRecentEntries, clearLog }}>
      {children}
    </AuditContext.Provider>
  );
};

export const useAudit = () => {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAudit must be used within an AuditProvider');
  }
  return context;
};