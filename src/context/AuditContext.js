import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const AuditContext = createContext(undefined);
export const useAuditContext = () => {
    const context = useContext(AuditContext);
    if (!context) {
        throw new Error('useAuditContext must be used within an AuditProvider');
    }
    return context;
};
export const AuditProvider = ({ children }) => {
    const [auditLogs, setAuditLogs] = useState([]);
    const addAuditLog = (log) => {
        setAuditLogs(prev => [...prev, { ...log, timestamp: new Date() }]);
    };
    const value = {
        auditLogs,
        addAuditLog,
    };
    return (_jsx(AuditContext.Provider, { value: value, children: children }));
};
