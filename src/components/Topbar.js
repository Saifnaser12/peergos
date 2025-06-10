import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Bars3Icon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useUserRole } from '../context/UserRoleContext';
import { ROLE_LABELS } from '../types/roles';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import RoleSwitcher from './RoleSwitcher';
import NotificationDropdown from './NotificationDropdown';
const Topbar = ({ onMenuClick }) => {
    const { t } = useTranslation();
    const { role } = useUserRole();
    return (_jsx("div", { className: "sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex h-16 justify-between items-center px-4 sm:px-6 lg:px-8", children: [_jsx("button", { type: "button", className: "lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500", onClick: onMenuClick, children: _jsx(Bars3Icon, { className: "h-6 w-6" }) }), _jsx("div", { className: "flex-1 lg:flex-none", children: _jsx("h1", { className: "text-lg font-semibold text-gray-900 dark:text-white lg:text-xl", children: t('common.appTitle', 'UAE Tax Compliance') }) }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(LanguageSwitcher, {}), _jsx(ThemeToggle, {}), _jsx(NotificationDropdown, {}), _jsx(RoleSwitcher, {}), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(UserCircleIcon, { className: "h-8 w-8 text-gray-500 dark:text-gray-400" }), _jsxs("div", { className: "hidden sm:block", children: [_jsx("p", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: t('common.user', 'Admin User') }), _jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: [ROLE_LABELS[role], " \u2022 admin@company.ae"] })] })] })] })] }) }));
};
export default Topbar;
