import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
import { ROLE_PERMISSIONS, ROLES } from '../types/roles';
import { adminPermissions, accountantPermissions, assistantPermissions, smeClientPermissions } from '../config/permissions';
const UserRoleContext = createContext(undefined);
export const useUserRole = () => {
    const context = useContext(UserRoleContext);
    if (!context) {
        throw new Error('useUserRole must be used within a UserRoleProvider');
    }
    return context;
};
export const UserRoleProvider = ({ children }) => {
    // Default role for demo - in production this would come from authentication
    const [role, setRole] = useState(ROLES.ADMIN);
    const canAccess = (path) => {
        const allowedRoles = ROLE_PERMISSIONS[path];
        if (!allowedRoles) {
            return role === ROLES.ADMIN; // Default to admin only for undefined routes
        }
        return allowedRoles.includes(role);
    };
    const hasPermission = (resource, permission) => {
        let rolePermissions;
        switch (role) {
            case ROLES.ADMIN:
                rolePermissions = adminPermissions;
                break;
            case ROLES.ACCOUNTANT:
                rolePermissions = accountantPermissions;
                break;
            case ROLES.ASSISTANT:
                rolePermissions = assistantPermissions;
                break;
            case ROLES.SME_CLIENT:
                rolePermissions = smeClientPermissions;
                break;
            default:
                return false;
        }
        const resourcePermissions = rolePermissions[resource];
        if (!resourcePermissions)
            return false;
        return resourcePermissions[permission] === true;
    };
    const permissions = Object.keys(ROLE_PERMISSIONS).filter(path => canAccess(path));
    const value = {
        role,
        permissions,
        setRole,
        hasPermission,
        canAccess,
        isAdmin: role === ROLES.ADMIN,
        isAccountant: role === ROLES.ACCOUNTANT,
        isAssistant: role === ROLES.ASSISTANT,
        isSMEClient: role === ROLES.SME_CLIENT,
    };
    return (_jsx(UserRoleContext.Provider, { value: value, children: children }));
};
