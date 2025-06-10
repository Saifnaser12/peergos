import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  details: string;
}

interface AuditContextType {
  auditLogs: AuditEntry[];
  addAuditLog: (log: Omit<AuditEntry, 'id' | 'timestamp'>) => void;
}

export const AuditContext = createContext<AuditContextType | undefined>(undefined);

export const useAuditContext = () => {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAuditContext must be used within an AuditProvider');
  }
  return context;
};

interface AuditProviderProps {
  children: ReactNode;
}

export const AuditProvider: React.FC<AuditProviderProps> = ({ children }) => {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  const addAuditLog = (log: Omit<AuditEntry, 'id' | 'timestamp'>) => {
    const newEntry: AuditEntry = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [...prev, newEntry]);
  };

  const value = {
    auditLogs,
    addAuditLog,
  };

  return (
    <AuditContext.Provider value={value}>
      {children}
    </AuditContext.Provider>
  );
};