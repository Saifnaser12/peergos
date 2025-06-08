import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { BellIcon, CalendarDaysIcon, DocumentIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';
const NotificationDropdown = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { notifications, unreadCount, markAsRead, markAllAsRead, dismissNotification } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const getNotificationIcon = (type, priority) => {
        const iconClass = `h-5 w-5 ${priority === 'urgent' ? 'text-red-500' :
            priority === 'high' ? 'text-orange-500' :
                priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'}`;
        switch (type) {
            case 'deadline':
                return _jsx(CalendarDaysIcon, { className: iconClass });
            case 'missing_document':
                return _jsx(DocumentIcon, { className: iconClass });
            case 'setup_incomplete':
                return _jsx(ExclamationTriangleIcon, { className: iconClass });
            default:
                return _jsx(InformationCircleIcon, { className: iconClass });
        }
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent':
                return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
            case 'high':
                return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20';
            case 'medium':
                return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
            default:
                return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
        }
    };
    const handleNotificationClick = (notification) => {
        markAsRead(notification.id);
        if (notification.action?.path) {
            navigate(notification.action.path);
            setIsOpen(false);
        }
    };
    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        if (diffInHours < 1)
            return t('notifications.justNow');
        if (diffInHours < 24)
            return t('notifications.hoursAgo', { hours: diffInHours });
        const diffInDays = Math.floor(diffInHours / 24);
        return t('notifications.daysAgo', { days: diffInDays });
    };
    return (_jsxs("div", { className: "relative", ref: dropdownRef, children: [_jsxs("button", { onClick: () => setIsOpen(!isOpen), className: "relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded-lg transition-colors", "aria-label": t('notifications.title'), children: [unreadCount > 0 ? (_jsx(BellSolidIcon, { className: "h-6 w-6" })) : (_jsx(BellIcon, { className: "h-6 w-6" })), unreadCount > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full min-w-[1.25rem] h-5", children: unreadCount > 99 ? '99+' : unreadCount }))] }), isOpen && (_jsxs("div", { className: "absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50", children: [_jsxs("div", { className: "px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: t('notifications.title') }), notifications.length > 0 && (_jsx("button", { onClick: markAllAsRead, className: "text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium", children: t('notifications.markAllRead') }))] }), _jsx("div", { className: "max-h-96 overflow-y-auto", children: notifications.length === 0 ? (_jsxs("div", { className: "px-4 py-8 text-center", children: [_jsx(BellIcon, { className: "mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" }), _jsx("h3", { className: "mt-2 text-sm font-medium text-gray-900 dark:text-white", children: t('notifications.noNotifications') }), _jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: t('notifications.allCaughtUp') })] })) : (notifications.map((notification) => (_jsx("div", { className: `border-l-4 ${getPriorityColor(notification.priority)} ${notification.isRead ? 'opacity-75' : ''}`, children: _jsx("div", { className: "px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors", children: _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: "flex-shrink-0 mt-0.5", children: getNotificationIcon(notification.type, notification.priority) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: `text-sm font-medium ${notification.isRead
                                                                        ? 'text-gray-600 dark:text-gray-400'
                                                                        : 'text-gray-900 dark:text-white'}`, children: notification.title }), _jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: notification.message }), notification.daysRemaining !== undefined && (_jsx("p", { className: `mt-1 text-xs font-medium ${notification.daysRemaining <= 3 ? 'text-red-600 dark:text-red-400' :
                                                                        notification.daysRemaining <= 7 ? 'text-orange-600 dark:text-orange-400' :
                                                                            'text-yellow-600 dark:text-yellow-400'}`, children: notification.daysRemaining === 0
                                                                        ? t('notifications.dueToday')
                                                                        : t('notifications.daysRemaining', { days: notification.daysRemaining }) })), _jsx("p", { className: "mt-2 text-xs text-gray-400 dark:text-gray-500", children: formatTimeAgo(notification.createdAt) })] }), _jsxs("div", { className: "flex items-start space-x-1 ml-2", children: [!notification.isRead && (_jsx("button", { onClick: (e) => {
                                                                        e.stopPropagation();
                                                                        markAsRead(notification.id);
                                                                    }, className: "p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300", title: t('notifications.markAsRead'), children: _jsx(CheckIcon, { className: "h-4 w-4" }) })), _jsx("button", { onClick: (e) => {
                                                                        e.stopPropagation();
                                                                        dismissNotification(notification.id);
                                                                    }, className: "p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300", title: t('notifications.dismiss'), children: _jsx(XMarkIcon, { className: "h-4 w-4" }) })] })] }), notification.action && (_jsx("button", { onClick: () => handleNotificationClick(notification), className: "mt-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:text-indigo-300 dark:bg-indigo-900/50 dark:hover:bg-indigo-900/75 transition-colors", children: notification.action.label }))] })] }) }) }, notification.id)))) })] }))] }));
};
export default NotificationDropdown;
