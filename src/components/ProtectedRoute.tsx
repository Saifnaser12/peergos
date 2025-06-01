import React from 'react';
import { useUserRole } from '../context/UserRoleContext';
import PermissionDenied from './PermissionDenied';

interface ProtectedRouteProps {
  children: React.ReactNode;
  path: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, path }) => {
  const { canAccess } = useUserRole();

  if (!canAccess(path)) {
    return <PermissionDenied />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 