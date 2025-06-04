
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bars3Icon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useUserRole } from '../context/UserRoleContext';
import { ROLE_LABELS } from '../types/roles';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import RoleSwitcher from './RoleSwitcher';

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const { t } = useTranslation();
  const { role } = useUserRole();

  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex h-16 justify-between items-center px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          onClick={onMenuClick}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        {/* Page title - could be dynamic based on route */}
        <div className="flex-1 lg:flex-none">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white lg:text-xl">
            {t('common.appTitle', 'UAE Tax Compliance')}
          </h1>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-4">
          {/* Language switcher */}
          <LanguageSwitcher />

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Role switcher */}
          <RoleSwitcher />

          {/* User menu */}
          <div className="flex items-center space-x-2">
            <UserCircleIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('common.user', 'Admin User')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {ROLE_LABELS[role]} • admin@company.ae
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
