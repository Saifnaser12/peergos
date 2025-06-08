import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useUserRole } from '../context/UserRoleContext';
import { ROLES, ROLE_LABELS } from '../types/roles';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
const RoleSwitcher = () => {
    const { role, setRole } = useUserRole();
    const [isOpen, setIsOpen] = React.useState(false);
    const roles = [
        ROLES.ADMIN,
        ROLES.ACCOUNTANT,
        ROLES.ASSISTANT,
        ROLES.SME_CLIENT
    ];
    return (_jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setIsOpen(!isOpen), className: "flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500", children: [_jsx("span", { children: ROLE_LABELS[role] }), _jsx(ChevronDownIcon, { className: "h-4 w-4" })] }), isOpen && (_jsx("div", { className: "absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50", children: _jsx("div", { className: "py-1", children: roles.map((roleOption) => (_jsx("button", { onClick: () => {
                            setRole(roleOption);
                            setIsOpen(false);
                        }, className: `block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${role === roleOption
                            ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100'
                            : 'text-gray-700 dark:text-gray-300'}`, children: ROLE_LABELS[roleOption] }, roleOption))) }) }))] }));
};
export default RoleSwitcher;
