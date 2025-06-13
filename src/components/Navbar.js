import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUserRole } from '../context/UserRoleContext';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { useTranslation } from 'react-i18next';
import { HomeIcon, DocumentTextIcon, Cog6ToothIcon, ChatBubbleLeftRightIcon, BuildingOfficeIcon, UserCircleIcon, SunIcon, MoonIcon, Bars3Icon, XMarkIcon, LanguageIcon, CurrencyDollarIcon, ChartBarIcon } from '@heroicons/react/24/outline';
const Navbar = () => {
    const { canAccess } = useUserRole();
    const { isDarkMode, toggleDarkMode } = useTheme();
    const { currency, setCurrency, language, setLanguage } = useSettings();
    const { t } = useTranslation();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isActive = (path) => location.pathname === path;
    const navItems = [
        {
            name: t('nav.dashboard', 'Dashboard'),
            path: '/dashboard',
            icon: _jsx(HomeIcon, { className: "h-5 w-5" })
        },
        {
            name: t('nav.vat', 'VAT'),
            path: '/vat',
            icon: _jsx(DocumentTextIcon, { className: "h-5 w-5" })
        },
        {
            name: t('nav.cit', 'Corporate Tax'),
            path: '/cit',
            icon: _jsx(DocumentTextIcon, { className: "h-5 w-5" })
        },
        {
            name: t('nav.financials', 'Financials'),
            path: '/financials',
            icon: _jsx(ChartBarIcon, { className: "h-5 w-5" })
        },
        {
            name: t('nav.transferPricing', 'Transfer Pricing'),
            path: '/transfer-pricing',
            icon: _jsx(CurrencyDollarIcon, { className: "h-5 w-5" })
        },
        {
            name: t('nav.calendar', 'Calendar'),
            path: '/calendar',
            icon: _jsx(Cog6ToothIcon, { className: "h-5 w-5" })
        },
        {
            name: t('nav.assistant', 'Assistant'),
            path: '/assistant',
            icon: _jsx(ChatBubbleLeftRightIcon, { className: "h-5 w-5" })
        }
    ];
    // Filter navItems based on user's permissions
    const authorizedNavItems = navItems.filter(item => canAccess(item.path));
    return (_jsxs("nav", { className: "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700", children: [_jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between h-16", children: [_jsxs("div", { className: "flex", children: [_jsxs("div", { className: "flex-shrink-0 flex items-center", children: [_jsx(BuildingOfficeIcon, { className: "h-8 w-8 text-indigo-600 dark:text-indigo-400" }), _jsx("span", { className: "ml-2 text-xl font-semibold text-gray-900 dark:text-white", children: "TaxPro" })] }), _jsx("div", { className: "hidden md:ml-6 md:flex md:space-x-8", children: authorizedNavItems.map((item) => (_jsxs(Link, { to: item.path, className: `inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transform transition-all duration-200 ease-in-out hover:scale-105 ${isActive(item.path)
                                            ? 'border-indigo-500 text-gray-900 dark:text-white dark:border-indigo-400'
                                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`, children: [_jsx("span", { className: "mr-2 transition-transform duration-200 ease-in-out group-hover:scale-110", children: item.icon }), item.name] }, item.path))) })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "hidden md:flex items-center", children: _jsxs("button", { onClick: () => setLanguage(language === 'en' ? 'ar' : 'en'), className: "p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800", "aria-label": "Toggle Language", children: [_jsx(LanguageIcon, { className: "h-5 w-5" }), _jsx("span", { className: "sr-only", children: language === 'en' ? 'English' : 'العربية' })] }) }), _jsx("div", { className: "hidden md:flex items-center", children: _jsxs("button", { onClick: () => setCurrency(currency === 'AED' ? 'USD' : 'AED'), className: "p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800", "aria-label": "Toggle Currency", children: [_jsx(CurrencyDollarIcon, { className: "h-5 w-5" }), _jsx("span", { className: "sr-only", children: currency })] }) }), _jsx("button", { onClick: toggleDarkMode, className: "p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800", "aria-label": "Toggle dark mode", children: isDarkMode ? (_jsx(SunIcon, { className: "h-5 w-5" })) : (_jsx(MoonIcon, { className: "h-5 w-5" })) }), _jsx("div", { className: "hidden md:block", children: _jsxs("button", { type: "button", className: "max-w-xs bg-white dark:bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800", id: "user-menu", "aria-expanded": "false", "aria-haspopup": "true", children: [_jsx("span", { className: "sr-only", children: "Open user menu" }), _jsx(UserCircleIcon, { className: "h-8 w-8 text-gray-400 dark:text-gray-500" })] }) }), _jsx("div", { className: "md:hidden", children: _jsxs("button", { onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen), className: "inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500", "aria-expanded": "false", children: [_jsx("span", { className: "sr-only", children: "Open main menu" }), isMobileMenuOpen ? (_jsx(XMarkIcon, { className: "block h-6 w-6" })) : (_jsx(Bars3Icon, { className: "block h-6 w-6" }))] }) })] })] }) }), _jsxs("div", { className: `md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`, children: [_jsx("div", { className: "px-2 pt-2 pb-3 space-y-1", children: authorizedNavItems.map((item) => (_jsxs(Link, { to: item.path, onClick: () => setIsMobileMenuOpen(false), className: `flex items-center px-3 py-2 text-base font-medium rounded-md transition-all duration-200 ease-in-out ${isActive(item.path)
                                ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`, children: [_jsx("span", { className: "mr-3 flex-shrink-0", children: item.icon }), item.name] }, item.path))) }), _jsx("div", { className: "pt-4 pb-3 border-t border-gray-200 dark:border-gray-700", children: _jsx("div", { className: "px-4 flex items-center justify-between", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("button", { onClick: () => setLanguage(language === 'en' ? 'ar' : 'en'), className: "flex items-center px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300", children: [_jsx(LanguageIcon, { className: "h-5 w-5 mr-2" }), language === 'en' ? 'English' : 'العربية'] }), _jsxs("button", { onClick: () => setCurrency(currency === 'AED' ? 'USD' : 'AED'), className: "flex items-center px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300", children: [_jsx(CurrencyDollarIcon, { className: "h-5 w-5 mr-2" }), currency] })] }) }) })] })] }));
};
export default Navbar;
