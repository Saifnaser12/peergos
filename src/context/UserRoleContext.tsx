import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserRoleContextType {
  role: string;
  permissions: string[];
  setRole: (role: string) => void;
  hasPermission: (permission: string) => boolean;
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
  const [role, setRole] = useState('user');
  const [permissions, setPermissions] = useState<string[]>(['read']);

  const hasPermission = (permission: string) => {
    return permissions.includes(permission) || role === 'admin';
  };

  const value = {
    role,
    permissions,
    setRole,
    hasPermission,
  };

  return (
    <UserRoleContext.Provider value={value}>
      {children}
    </UserRoleContext.Provider>
  );
};