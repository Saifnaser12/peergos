import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuditAction, AuditEntry, AuditLog } from '../types/audit';
import { useUserRole } from './UserRoleContext';

interface AuditContextType {
  log: (action: AuditAction, details?: Record<string, any>) => void;
  getRecentEntries: (limit?: number) => AuditEntry[];
  clearLog: () => void;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

const STORAGE_KEY = 'audit_log';

export const AuditProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auditLog, setAuditLog] = useState<AuditLog>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { entries: [] };
  });

  const { role } = useUserRole();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auditLog));
  }, [auditLog]);

  const log = (action: AuditAction, details?: Record<string, any>) => {
    const entry: AuditEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      action,
      role,
      details
    };

    setAuditLog(prev => ({
      entries: [entry, ...prev.entries].slice(0, 1000) // Keep last 1000 entries
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
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuditLog {
  id: string;
  timestamp: Date;
  action: string;
  user: string;
  details: string;
}

interface AuditContextType {
  logs: AuditLog[];
  addLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export const AuditProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  const addLog = (logData: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...logData,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setLogs(prev => [...prev, newLog]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <AuditContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </AuditContext.Provider>
  );
};

export const useAuditContext = () => {
  const context = useContext(AuditContext);
  if (context === undefined) {
    throw new Error('useAuditContext must be used within an AuditProvider');
  }
  return context;
};
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuditContextType {
  auditLogs: any[];
  addAuditLog: (log: any) => void;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export const useAudit = () => {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAudit must be used within an AuditProvider');
  }
  return context;
};

export const AuditProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  const addAuditLog = (log: any) => {
    setAuditLogs(prev => [...prev, { ...log, timestamp: new Date() }]);
  };

  return (
    <AuditContext.Provider value={{ auditLogs, addAuditLog }}>
      {children}
    </AuditContext.Provider>
  );
};
