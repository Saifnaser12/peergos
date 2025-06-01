import React from 'react';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import { useUserRole } from '../context/UserRoleContext';
import type { Resource, Permission } from '../config/permissions';

interface PermissionGateProps {
  children: React.ReactNode;
  resource: Resource;
  requiredPermission?: Permission;
  restrictedTo?: string;
}

const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  resource,
  requiredPermission = 'view',
  restrictedTo = 'Admins'
}) => {
  const { hasPermission } = useUserRole();
  const hasAccess = hasPermission(resource, requiredPermission);

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred content */}
      <div className="filter blur-sm pointer-events-none opacity-50">
        {children}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-3 shadow-lg flex items-center gap-2 group">
          <LockClosedIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Restricted to {restrictedTo}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PermissionGate; 