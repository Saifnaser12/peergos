
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserRole } from '../context/UserRoleContext';

interface ProtectedRouteProps {
  rolesAllowed: string[];
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  rolesAllowed,
  children,
  redirectTo = '/unauthorized'
}) => {
  const { role } = useUserRole();

  // Check if user's current role is in the allowed roles
  if (!rolesAllowed.includes(role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
