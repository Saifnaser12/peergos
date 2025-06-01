import React, { createContext, useContext, useEffect, useState } from 'react';
import type { UserRole } from '../types';

interface UserRoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  canAccess: (page: string) => boolean;
}

const UserRoleContext = createContext<UserRoleContextType | null>(null);

const pageAccessMap: Record<UserRole, string[]> = {
  'SME': ['/', '/dashboard', '/setup', '/filing', '/assistant'],
  'Tax Agent': ['/dashboard', '/filing'],
  'Admin': ['/', '/dashboard', '/setup', '/filing', '/assistant', '/admin'],
  'FTA': ['/dashboard']
};

export const UserRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('userRole');
    return (savedRole as UserRole) || 'SME';
  });

  useEffect(() => {
    localStorage.setItem('userRole', role);
  }, [role]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  const canAccess = (page: string): boolean => {
    return pageAccessMap[role]?.includes(page) || false;
  };

  return (
    <UserRoleContext.Provider value={{ role, setRole, canAccess }}>
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