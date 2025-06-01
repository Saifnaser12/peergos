import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUserRole } from '../context/UserRoleContext';
import type { UserRole } from '../types';

const Navbar: React.FC = () => {
  const { role, setRole, canAccess } = useUserRole();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const roles: UserRole[] = ['SME', 'Tax Agent', 'Admin', 'FTA'];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-indigo-600">
                Peergos
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {canAccess('/dashboard') && (
                <Link
                  to="/dashboard"
                  className={`${
                    location.pathname === '/dashboard'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Dashboard
                </Link>
              )}
              {canAccess('/setup') && (
                <Link
                  to="/setup"
                  className={`${
                    location.pathname === '/setup'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Setup
                </Link>
              )}
              {canAccess('/filing') && (
                <Link
                  to="/filing"
                  className={`${
                    location.pathname === '/filing'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Filing
                </Link>
              )}
              {canAccess('/assistant') && (
                <Link
                  to="/assistant"
                  className={`${
                    location.pathname === '/assistant'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Assistant
                </Link>
              )}
            </div>
          </div>
          <div className="relative flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 border rounded-md"
            >
              Role: {role}
            </button>
            {isOpen && (
              <div className="origin-top-right absolute right-0 mt-32 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu">
                  {roles.map((roleOption) => (
                    <button
                      key={roleOption}
                      onClick={() => {
                        setRole(roleOption);
                        setIsOpen(false);
                      }}
                      className={`${
                        role === roleOption ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } block w-full text-left px-4 py-2 text-sm hover:bg-gray-50`}
                      role="menuitem"
                    >
                      {roleOption}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 