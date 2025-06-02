import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
import { permissions } from '../config/permissions';
import { useAudit } from './AuditContext';
const UserRoleContext = createContext(undefined);
export const UserRoleProvider = ({ children }) => {
    const [role, setRoleState] = useState('SME');
    const { log } = useAudit();
    const setRole = (newRole) => {
        log('SWITCH_ROLE', { from: role, to: newRole });
        setRoleState(newRole);
    };
    const hasPermission = (resource, permission) => {
        return permissions[role]?.[resource]?.[permission] ?? false;
    };
    const canAccess = (path) => {
        // Map paths to resources
        const resourceMap = {
            '/setup': 'setup',
            '/filing': 'filing',
            '/dashboard': 'dashboard',
            '/assistant': 'assistant',
            '/admin': 'dashboard',
            '/': 'dashboard' // Default route
        };
        const resource = resourceMap[path];
        if (!resource)
            return false;
        // At minimum, user needs view permission to access a route
        return hasPermission(resource, 'view');
    };
    return (_jsx(UserRoleContext.Provider, { value: { role, setRole, hasPermission, canAccess }, children: children }));
};
export const useUserRole = () => {
    const context = useContext(UserRoleContext);
    if (!context) {
        throw new Error('useUserRole must be used within a UserRoleProvider');
    }
    return context;
};
