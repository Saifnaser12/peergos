import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { adminPermissions, userPermissions, superAdminPermissions, auditorPermissions } from '../config/permissions';
import type { Permission, Resource } from '../config/permissions';
import { useAudit } from './AuditContext';

type Role = 'SME' | 'Tax Agent' | 'Admin' | 'FTA';

interface UserRoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  hasPermission: (resource: Resource, permission: Permission) => boolean;
  canAccess: (path: string) => boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

const permissionsByRole = {
  Admin: adminPermissions,
  SME: userPermissions,
  'Tax Agent': auditorPermissions,
  FTA: superAdminPermissions
};

export const UserRoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>('SME');
  const { log } = useAudit();

  const setRole = (newRole: Role) => {
    log('SWITCH_ROLE', { from: role, to: newRole });
    setRoleState(newRole);
  };

  const hasPermission = (resource: Resource, permission: Permission): boolean => {
    return permissionsByRole[role]?.[resource]?.[permission] ?? false;
  };

  const canAccess = (path: string): boolean => {
    // Map paths to resources
    const resourceMap: { [key: string]: Resource } = {
      '/setup': 'setup',
      '/filing': 'filing',
      '/dashboard': 'dashboard',
      '/assistant': 'assistant',
      '/admin': 'admin',
      '/transfer-pricing': 'transfer-pricing',
      '/vat': 'vat',
      '/cit': 'cit',
      '/financials': 'financials',
      '/': 'dashboard' // Default route
    };

    const resource = resourceMap[path];
    if (!resource) return false;

    // At minimum, user needs view permission to access a route
    return hasPermission(resource, 'view');
  };

  return (
    <UserRoleContext.Provider value={{ role, setRole, hasPermission, canAccess }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
}; 
import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'admin' | 'user' | 'accountant' | 'auditor';

interface UserRoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  hasPermission: (permission: string) => boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const UserRoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('user');

  const hasPermission = (permission: string): boolean => {
    // Basic permission logic - can be expanded
    const permissions = {
      admin: ['all'],
      accountant: ['view_financials', 'edit_financials', 'view_tax'],
      auditor: ['view_audit', 'view_financials'],
      user: ['view_basic'],
    };
    
    return permissions[role]?.includes(permission) || permissions[role]?.includes('all') || false;
  };

  return (
    <UserRoleContext.Provider value={{ role, setRole, hasPermission }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserRoleContextType {
  userRole: string;
  setUserRole: (role: string) => void;
  permissions: string[];
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};

export const UserRoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<string>('user');
  const [permissions] = useState<string[]>(['read', 'write']);

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole, permissions }}>
      {children}
    </UserRoleContext.Provider>
  );
};
