import React from 'react';
import { useUserRole } from '../context/UserRoleContext';
import { ROLES, ROLE_LABELS } from '../types/roles';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const RoleSwitcher: React.FC = () => {
  const { role, setRole } = useUserRole();
  const [isOpen, setIsOpen] = React.useState(false);

  const roles = [
    ROLES.ADMIN,
    ROLES.ACCOUNTANT,
    ROLES.ASSISTANT,
    ROLES.SME_CLIENT
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span>{ROLE_LABELS[role]}</span>
        <ChevronDownIcon className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50">
          <div className="py-1">
            {roles.map((roleOption) => (
              <button
                key={roleOption}
                onClick={() => {
                  setRole(roleOption);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  role === roleOption
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {ROLE_LABELS[roleOption]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSwitcher;