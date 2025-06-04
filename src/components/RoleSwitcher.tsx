
import React, { useState } from 'react';
import { useUserRole } from '../context/UserRoleContext';
import { ChevronDownIcon, UserIcon } from '@heroicons/react/24/outline';
import { ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS } from '../types/roles';
import type { Role } from '../types/roles';

const RoleSwitcher: React.FC = () => {
  const { role, setRole } = useUserRole();
  const [isOpen, setIsOpen] = useState(false);

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        <UserIcon className="h-4 w-4" />
        <span>{ROLE_LABELS[role]}</span>
        <ChevronDownIcon className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 z-20 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
            <div className="py-1">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-200 dark:border-gray-700">
                Switch Role (Dev Mode)
              </div>
              
              {Object.values(ROLES).map((roleOption) => (
                <button
                  key={roleOption}
                  onClick={() => handleRoleChange(roleOption)}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    role === roleOption 
                      ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="font-medium">{ROLE_LABELS[roleOption]}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {ROLE_DESCRIPTIONS[roleOption]}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RoleSwitcher;
