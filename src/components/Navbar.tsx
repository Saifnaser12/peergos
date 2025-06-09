import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUserRole } from '../context/UserRoleContext';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { useTranslation } from 'react-i18next';
import {
  HomeIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  LanguageIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const { canAccess } = useUserRole();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { currency, setCurrency, language, setLanguage } = useSettings();
  const { t } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      name: t('nav.dashboard'),
      path: '/dashboard',
      icon: <HomeIcon className="h-5 w-5" />
    },
    {
      name: t('nav.vat'),
      path: '/vat',
      icon: <DocumentTextIcon className="h-5 w-5" />
    },
    {
      name: t('nav.cit'),
      path: '/cit',
      icon: <DocumentTextIcon className="h-5 w-5" />
    },
    {
      name: t('nav.financials'),
      path: '/financials',
      icon: <ChartBarIcon className="h-5 w-5" />
    },
    {
      name: t('nav.transferPricing'),
      path: '/transfer-pricing',
      icon: <CurrencyDollarIcon className="h-5 w-5" />
    },
    {
      name: t('nav.setup'),
      path: '/setup',
      icon: <Cog6ToothIcon className="h-5 w-5" />
    },
    {
      name: t('nav.assistant'),
      path: '/assistant',
      icon: <ChatBubbleLeftRightIcon className="h-5 w-5" />
    }
  ];

  // Filter navItems based on user's permissions
  const authorizedNavItems = navItems.filter(item => canAccess(item.path));

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <BuildingOfficeIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">TaxPro</span>
            </div>

            {/* Desktop Navigation Items */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {authorizedNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transform transition-all duration-200 ease-in-out hover:scale-105 ${
                    isActive(item.path)
                      ? 'border-indigo-500 text-gray-900 dark:text-white dark:border-indigo-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <span className="mr-2 transition-transform duration-200 ease-in-out group-hover:scale-110">
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                aria-label={t('language.select')}
              >
                <LanguageIcon className="h-5 w-5" />
                <span className="sr-only">{language === 'en' ? 'English' : 'العربية'}</span>
              </button>
            </div>

            {/* Currency Selector */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => setCurrency(currency === 'AED' ? 'USD' : 'AED')}
                className="flex items-center px-3 py-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                aria-label={t('currency.select')}
              >
                <span className="text-lg mr-1">{currency === 'AED' ? '🇦🇪' : '🇺🇸'}</span>
                <span className="text-sm font-medium">{currency}</span>
              </button>
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

            {/* User Menu */}
            <div className="hidden md:block">
              <button
                type="button"
                className="max-w-xs bg-white dark:bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                id="user-menu"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <span className="sr-only">Open user menu</span>
                <UserCircleIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {authorizedNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-all duration-200 ease-in-out ${
                isActive(item.path)
                  ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-3 flex-shrink-0">
                {item.icon}
              </span>
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile settings */}
        <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="flex items-center px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300"
              >
                <LanguageIcon className="h-5 w-5 mr-2" />
                {language === 'en' ? 'English' : 'العربية'}
              </button>

              {/* Mobile Currency Toggle */}
              <button
                onClick={() => setCurrency(currency === 'AED' ? 'USD' : 'AED')}
                className="flex items-center px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300"
              >
                <span className="text-lg mr-2">{currency === 'AED' ? '🇦🇪' : '🇺🇸'}</span>
                {currency}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 