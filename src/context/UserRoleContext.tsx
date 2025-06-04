import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Role = 'SME' | 'Tax Agent' | 'Admin' | 'FTA';

interface UserRoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  hasPermission: (permission: string) => boolean;
  canAccess: (path: string) => boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const UserRoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('SME');

  const hasPermission = (permission: string): boolean => {
    const permissions = {
      Admin: ['all'],
      'Tax Agent': ['view_financials', 'edit_financials', 'view_tax'],
      FTA: ['view_audit', 'view_financials', 'admin'],
      SME: ['view_basic'],
    };

    return permissions[role]?.includes(permission) || permissions[role]?.includes('all') || false;
  };

  const canAccess = (path: string): boolean => {
    const accessMap: { [key: string]: string[] } = {
      '/setup': ['Admin', 'SME'],
      '/filing': ['Admin', 'Tax Agent', 'SME'],
      '/dashboard': ['Admin', 'Tax Agent', 'SME', 'FTA'],
      '/assistant': ['Admin', 'Tax Agent', 'SME'],
      '/admin': ['Admin'],
      '/transfer-pricing': ['Admin', 'Tax Agent', 'SME'],
      '/vat': ['Admin', 'Tax Agent', 'SME'],
      '/cit': ['Admin', 'Tax Agent', 'SME'],
      '/financials': ['Admin', 'Tax Agent', 'FTA'],
      '/': ['Admin', 'Tax Agent', 'SME', 'FTA']
    };

    return accessMap[path]?.includes(role) || false;
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