
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserRole } from '../context/UserRoleContext';
import {
  HomeIcon,
  DocumentTextIcon,
  ReceiptPercentIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { role } = useUserRole();

  const { canAccess } = useUserRole();

  const navigationItems = [
    {
      name: t('nav.dashboard'),
      path: '/dashboard',
      icon: HomeIcon,
    },
    {
      name: t('nav.cit'),
      path: '/cit',
      icon: DocumentTextIcon,
    },
    {
      name: t('nav.vat'),
      path: '/vat',
      icon: ReceiptPercentIcon,
    },
    {
      name: t('nav.financials'),
      path: '/financials',
      icon: ChartBarIcon,
    },
    {
      name: t('nav.transferPricing'),
      path: '/transfer-pricing',
      icon: CurrencyDollarIcon,
    },
    {
      name: t('nav.assistant'),
      path: '/assistant',
      icon: ChatBubbleLeftRightIcon,
    },
    {
      name: t('nav.setup'),
      path: '/setup',
      icon: Cog6ToothIcon,
    }
  ];

  const filteredNavItems = navigationItems.filter(item => canAccess(item.path));

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            {/* Logo */}
            <div className="flex flex-shrink-0 items-center px-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
                  Peergos Tax
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="mt-8 flex-1 space-y-1 px-2">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                      isActive(item.path)
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        isActive(item.path)
                          ? 'text-indigo-500 dark:text-indigo-400'
                          : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                      }`}
                    />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-30 lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex h-16 flex-shrink-0 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
                Peergos Tax
              </span>
            </div>
            <button
              onClick={onClose}
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <nav className="mt-5 flex-1 space-y-1 px-2">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                    isActive(item.path)
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive(item.path)
                        ? 'text-indigo-500 dark:text-indigo-400'
                        : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                    }`}
                  />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
