import React from 'react';
import { useUserRole } from '../context/UserRoleContext';
import { XCircleIcon } from '@heroicons/react/24/outline';

interface PermissionDeniedProps {
  customMessage?: string;
}

const PermissionDenied: React.FC<PermissionDeniedProps> = ({ customMessage }) => {
  const { role } = useUserRole();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex flex-col items-center">
            <XCircleIcon className="h-12 w-12 text-red-500" />
            <h2 className="mt-4 text-center text-2xl font-bold text-gray-900">
              Access Denied
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {customMessage || `You don't have permission to access this resource.`}
            </p>
            <p className="mt-1 text-center text-sm text-gray-500">
              Current role: {role}
            </p>
            <div className="mt-6">
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Return to Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionDenied; 