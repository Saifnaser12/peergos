import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { permissions } from '../config/permissions';
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

export const UserRoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>('SME');
  const { log } = useAudit();

  const setRole = (newRole: Role) => {
    log('SWITCH_ROLE', { from: role, to: newRole });
    setRoleState(newRole);
  };

  const hasPermission = (resource: Resource, permission: Permission): boolean => {
    return permissions[role]?.[resource]?.[permission] ?? false;
  };

  const canAccess = (path: string): boolean => {
    // Map paths to resources
    const resourceMap: { [key: string]: Resource } = {
      '/setup': 'setup',
      '/filing': 'filing',
      '/dashboard': 'dashboard',
      '/assistant': 'assistant',
      '/admin': 'dashboard',
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