import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuditContextType {
  auditLogs: any[];
  addAuditLog: (log: any) => void;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

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

  const addAuditLog = (log: any) => {
    setAuditLogs(prev => [...prev, { ...log, timestamp: new Date() }]);
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