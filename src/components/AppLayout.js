import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import Sidebar from './Sidebar';
import { useUserRole } from '../context/UserRoleContext';
export default function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { hasPermission } = useUserRole();
    const location = useLocation();
    const { isDarkMode } = useTheme();
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    return (_jsxs("div", { className: `min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`, children: [sidebarOpen && (_jsx("div", { className: "fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden", onClick: () => setSidebarOpen(false) })), _jsx(Sidebar, { isOpen: sidebarOpen, onClose: () => setSidebarOpen(false) }), _jsx("div", { className: "flex-1 lg:pl-64", children: _jsx("main", { className: "py-8", children: _jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: _jsx(Outlet, {}) }) }) })] }));
}
