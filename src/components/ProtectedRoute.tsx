
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useUserRole } from '../context/UserRoleContext';
import type { Permission, Resource } from '../config/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  resource?: Resource;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission = 'view',
  resource,
  redirectTo = '/unauthorized'
}) => {
  const { canAccess, hasPermission } = useUserRole();
  const location = useLocation();

  // Check if user can access the current route
  if (!canAccess(location.pathname)) {
    return <Navigate to={redirectTo} replace />;
  }

  // If specific resource and permission are required, check those too
  if (resource && !hasPermission(resource, requiredPermission)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
