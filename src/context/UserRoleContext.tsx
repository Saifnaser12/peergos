
import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Role } from '../types/roles';
import { ROLE_PERMISSIONS, ROLES } from '../types/roles';
import type { Permission, Resource } from '../config/permissions';

interface UserRoleContextType {
  role: Role;
  permissions: string[];
  setRole: (role: Role) => void;
  hasPermission: (resource: Resource, permission: Permission) => boolean;
  canAccess: (path: string) => boolean;
  isAdmin: boolean;
  isAccountant: boolean;
  isAssistant: boolean;
  isViewer: boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};

interface UserRoleProviderProps {
  children: ReactNode;
}

export const UserRoleProvider: React.FC<UserRoleProviderProps> = ({ children }) => {
  // Default role for demo - in production this would come from authentication
  const [role, setRole] = useState<Role>(ROLES.ADMIN);
  
  const canAccess = (path: string): boolean => {
    const allowedRoles = ROLE_PERMISSIONS[path];
    if (!allowedRoles) {
      return role === ROLES.ADMIN; // Default to admin only for undefined routes
    }
    return allowedRoles.includes(role);
  };

  const hasPermission = (resource: Resource, permission: Permission): boolean => {
    // Simple permission check based on role
    switch (role) {
      case ROLES.ADMIN:
        return true; // Admin has all permissions
      case ROLES.ACCOUNTANT:
        if (['dashboard', 'filing', 'vat', 'cit', 'financials', 'transfer-pricing', 'assistant'].includes(resource)) {
          return permission === 'view' || permission === 'edit' || permission === 'create';
        }
        return false;
      case ROLES.ASSISTANT:
        if (['dashboard', 'cit', 'assistant'].includes(resource)) {
          return permission === 'view' || permission === 'create' || permission === 'edit';
        }
        return false;
      case ROLES.VIEWER:
        return resource === 'dashboard' && permission === 'view';
      default:
        return false;
    }
  };

  const permissions = Object.keys(ROLE_PERMISSIONS).filter(path => canAccess(path));

  const value: UserRoleContextType = {
    role,
    permissions,
    setRole,
    hasPermission,
    canAccess,
    isAdmin: role === ROLES.ADMIN,
    isAccountant: role === ROLES.ACCOUNTANT,
    isAssistant: role === ROLES.ASSISTANT,
    isViewer: role === ROLES.VIEWER,
  };

  return (
    <UserRoleContext.Provider value={value}>
      {children}
    </UserRoleContext.Provider>
  );
};
