import React from 'react';
import { useUserRole } from '../context/UserRoleContext';
import type { Permission, Resource } from '../config/permissions';
import PermissionDenied from './PermissionDenied';

interface ProtectedRouteProps {
  children: React.ReactNode;
  path: string;
  requiredPermission?: Permission;
  resource?: Resource;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  path,
  requiredPermission = 'view',
  resource
}) => {
  const { canAccess, hasPermission } = useUserRole();

  // First check if user can access the route
  if (!canAccess(path)) {
    return <PermissionDenied />;
  }

  // If specific resource and permission are required, check those too
  if (resource && !hasPermission(resource, requiredPermission)) {
    return <PermissionDenied />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 