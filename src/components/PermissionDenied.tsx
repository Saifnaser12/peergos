import React from 'react';
import { Link } from 'react-router-dom';
import { useUserRole } from '../context/UserRoleContext';

const PermissionDenied: React.FC = () => {
  const { role } = useUserRole();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your current role ({role}) does not have permission to access this page.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="text-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionDenied; 