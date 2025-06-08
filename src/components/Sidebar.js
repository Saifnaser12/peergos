import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { NavLink, useLocation } from 'react-router-dom';
import useI18nHelpers from '../hooks/useI18nHelpers';
import { useUserRole } from '../context/UserRoleContext';
import { HomeIcon, DocumentTextIcon, ChartBarIcon, ChatBubbleLeftRightIcon, Cog6ToothIcon, XMarkIcon, CalendarDaysIcon, CurrencyDollarIcon, ReceiptPercentIcon, CalculatorIcon } from '@heroicons/react/24/outline';
const Sidebar = ({ isOpen, onClose }) => {
    const { t } = useI18nHelpers();
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
            name: t('nav.accounting'),
            path: '/accounting',
            icon: CalculatorIcon,
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
        },
        {
            name: t('nav.calendar', 'Calendar'),
            path: '/calendar',
            icon: CalendarDaysIcon,
        }
    ];
    const filteredNavItems = navigationItems.filter(item => canAccess(item.path));
    const isActive = (path) => location.pathname === path;
    const canAccessRoute = (path) => canAccess(path);
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col", children: _jsx("div", { className: "flex min-h-0 flex-1 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex flex-1 flex-col overflow-y-auto pt-5 pb-4", children: [_jsx("div", { className: "flex flex-shrink-0 items-center px-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-sm", children: "P" }) }), _jsx("span", { className: "ml-3 text-xl font-semibold text-gray-900 dark:text-white", children: "Peergos Tax" })] }) }), _jsxs("nav", { className: "mt-8 flex-1 space-y-1 px-2", children: [canAccessRoute('/dashboard') && (_jsxs(NavLink, { to: "/dashboard", className: ({ isActive }) => `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'}`, children: [_jsx(HomeIcon, { className: "w-5 h-5 mr-3" }), t('nav.dashboard')] })), canAccessRoute('/accounting') && (_jsxs(NavLink, { to: "/accounting", className: ({ isActive }) => `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'}`, children: [_jsx(CurrencyDollarIcon, { className: "w-5 h-5 mr-3" }), t('nav.accounting')] })), canAccessRoute('/vat') && (_jsxs(NavLink, { to: "/vat", className: ({ isActive }) => `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'}`, children: [_jsx(ReceiptPercentIcon, { className: "w-5 h-5 mr-3" }), t('nav.vat')] })), canAccessRoute('/cit') && (_jsxs(NavLink, { to: "/cit", className: ({ isActive }) => `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'}`, children: [_jsx(CalculatorIcon, { className: "w-5 h-5 mr-3" }), t('nav.cit')] })), canAccessRoute('/financials') && (_jsxs(NavLink, { to: "/financials", className: ({ isActive }) => `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'}`, children: [_jsx(ChartBarIcon, { className: "w-5 h-5 mr-3" }), t('nav.financials')] })), canAccessRoute('/transfer-pricing') && (_jsxs(NavLink, { to: "/transfer-pricing", className: ({ isActive }) => `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'}`, children: [_jsx(DocumentTextIcon, { className: "w-5 h-5 mr-3" }), t('nav.transferPricing')] })), canAccessRoute('/filing') && (_jsxs(NavLink, { to: "/filing", className: ({ isActive }) => `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'}`, children: [_jsx(DocumentTextIcon, { className: "w-5 h-5 mr-3" }), t('nav.filing')] })), canAccessRoute('/assistant') && (_jsxs(NavLink, { to: "/assistant", className: ({ isActive }) => `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'}`, children: [_jsx(ChatBubbleLeftRightIcon, { className: "w-5 h-5 mr-3" }), t('nav.assistant')] })), canAccessRoute('/calendar') && (_jsxs(NavLink, { to: "/calendar", className: ({ isActive }) => `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'}`, children: [_jsx(CalendarDaysIcon, { className: "w-5 h-5 mr-3" }), t('nav.calendar')] }))] })] }) }) }), _jsx("div", { className: `fixed inset-0 z-30 lg:hidden ${isOpen ? 'block' : 'hidden'}`, children: _jsxs("div", { className: "fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "flex h-16 flex-shrink-0 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-sm", children: "P" }) }), _jsx("span", { className: "ml-3 text-xl font-semibold text-gray-900 dark:text-white", children: "Peergos Tax" })] }), _jsx("button", { onClick: onClose, className: "ml-1 flex h-10 w-10 items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500", children: _jsx(XMarkIcon, { className: "h-6 w-6 text-gray-600 dark:text-gray-400" }) })] }), _jsx("nav", { className: "mt-5 flex-1 space-y-1 px-2", children: filteredNavItems.map((item) => {
                                const Icon = item.icon;
                                return (_jsxs(NavLink, { to: item.path, onClick: onClose, className: `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${isActive(item.path)
                                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`, children: [_jsx(Icon, { className: `mr-3 h-5 w-5 flex-shrink-0 ${isActive(item.path)
                                                ? 'text-indigo-500 dark:text-indigo-400'
                                                : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'}` }), item.name] }, item.path));
                            }) })] }) })] }));
};
export default Sidebar;
