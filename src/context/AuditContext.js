import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
import { useUserRole } from './UserRoleContext';
const AuditContext = createContext(undefined);
const STORAGE_KEY = 'audit_log';
export const AuditProvider = ({ children }) => {
    const [auditLog, setAuditLog] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : { entries: [] };
    });
    const { role } = useUserRole();
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(auditLog));
    }, [auditLog]);
    const log = (action, details) => {
        const entry = {
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
    const getRecentEntries = (limit = 50) => {
        return auditLog.entries.slice(0, limit);
    };
    const clearLog = () => {
        setAuditLog({ entries: [] });
    };
    return (_jsx(AuditContext.Provider, { value: { log, getRecentEntries, clearLog }, children: children }));
};
export const useAudit = () => {
    const context = useContext(AuditContext);
    if (!context) {
        throw new Error('useAudit must be used within an AuditProvider');
    }
    return context;
};
