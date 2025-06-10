import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../context/NotificationContext';
import { useTax } from '../context/TaxContext';
import { CalendarDaysIcon, ClockIcon, ExclamationTriangleIcon, CheckCircleIcon, BellIcon } from '@heroicons/react/24/outline';
const Calendar = () => {
    const { t, i18n } = useTranslation();
    const { notifications } = useNotifications();
    const { profile } = useTax();
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const isRTL = i18n.language === 'ar';
    // Generate calendar deadlines
    const generateDeadlines = () => {
        const deadlines = [];
        const today = new Date();
        // VAT deadlines - 28th of each month
        for (let month = 0; month < 12; month++) {
            deadlines.push({
                id: `vat-${month}`,
                type: 'VAT',
                title: t('calendar.vatReturn'),
                date: new Date(selectedYear, month + 1, 28),
                dueDate: new Date(selectedYear, month + 1, 28),
                priority: 'high',
                status: new Date(selectedYear, month + 1, 28) < today ? 'overdue' : 'upcoming'
            });
        }
        // CIT deadline
        if (profile?.citSubmissionDate) {
            const citDate = new Date(profile.citSubmissionDate);
            deadlines.push({
                id: 'cit-annual',
                type: 'CIT',
                title: t('calendar.citReturn'),
                date: citDate,
                dueDate: citDate,
                priority: 'urgent',
                status: citDate < today ? 'overdue' : 'upcoming'
            });
        }
        return deadlines.filter(deadline => deadline.date.getMonth() === selectedMonth &&
            deadline.date.getFullYear() === selectedYear);
    };
    const deadlines = generateDeadlines();
    const currentMonth = new Date(selectedYear, selectedMonth, 1);
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent': return 'text-red-600 bg-red-100 border-red-300';
            case 'high': return 'text-orange-600 bg-orange-100 border-orange-300';
            case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
            default: return 'text-blue-600 bg-blue-100 border-blue-300';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'overdue':
                return _jsx(ExclamationTriangleIcon, { className: "h-5 w-5 text-red-500" });
            case 'completed':
                return _jsx(CheckCircleIcon, { className: "h-5 w-5 text-green-500" });
            default:
                return _jsx(ClockIcon, { className: "h-5 w-5 text-yellow-500" });
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "md:flex md:items-center md:justify-between", children: _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h2", { className: "text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate", children: t('calendar.title', 'Tax Calendar & Deadlines') }), _jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: t('calendar.subtitle', 'Track your tax filing deadlines and compliance dates') })] }) }), _jsxs("div", { className: "bg-white dark:bg-gray-800 shadow rounded-lg p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("select", { value: selectedMonth, onChange: (e) => setSelectedMonth(parseInt(e.target.value)), className: "block w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white", children: Array.from({ length: 12 }, (_, i) => (_jsx("option", { value: i, children: new Date(0, i).toLocaleDateString(i18n.language, { month: 'long' }) }, i))) }), _jsx("select", { value: selectedYear, onChange: (e) => setSelectedYear(parseInt(e.target.value)), className: "block w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white", children: Array.from({ length: 5 }, (_, i) => (_jsx("option", { value: 2024 + i, children: 2024 + i }, i))) })] }), _jsx(CalendarDaysIcon, { className: "h-6 w-6 text-gray-400" })] }), _jsxs("div", { className: "grid grid-cols-7 gap-2 mb-6", children: [['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (_jsx("div", { className: "p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400", children: t(`calendar.days.${day.toLowerCase()}`, day) }, day))), Array.from({ length: 42 }, (_, i) => {
                                const date = new Date(selectedYear, selectedMonth, 1 - currentMonth.getDay() + i);
                                const isCurrentMonth = date.getMonth() === selectedMonth;
                                const isToday = date.toDateString() === new Date().toDateString();
                                const hasDeadline = deadlines.some(d => d.date.toDateString() === date.toDateString());
                                return (_jsx("div", { className: `
                  p-2 text-center text-sm border rounded
                  ${isCurrentMonth
                                        ? 'text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                        : 'text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800'}
                  ${isToday ? 'ring-2 ring-indigo-500' : ''}
                  ${hasDeadline ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : ''}
                `, children: _jsxs("div", { className: "flex items-center justify-center h-8", children: [date.getDate(), hasDeadline && (_jsx("div", { className: "ml-1", children: _jsx("div", { className: "w-2 h-2 bg-red-500 rounded-full" }) }))] }) }, i));
                            })] })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 shadow rounded-lg", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200 dark:border-gray-700", children: _jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white", children: t('calendar.upcomingDeadlines', 'Upcoming Deadlines') }) }), _jsx("div", { className: "divide-y divide-gray-200 dark:divide-gray-700", children: deadlines.length === 0 ? (_jsxs("div", { className: "px-6 py-8 text-center", children: [_jsx(CalendarDaysIcon, { className: "mx-auto h-12 w-12 text-gray-400" }), _jsx("h3", { className: "mt-2 text-sm font-medium text-gray-900 dark:text-white", children: t('calendar.noDeadlines', 'No deadlines this month') }), _jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: t('calendar.noDeadlinesDesc', 'All your tax obligations are up to date.') })] })) : (deadlines.map((deadline) => (_jsx("div", { className: "px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [getStatusIcon(deadline.status), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-gray-900 dark:text-white", children: deadline.title }), _jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [deadline.type, " \u2022 ", deadline.date.toLocaleDateString(i18n.language)] })] })] }), _jsx("div", { className: "flex items-center space-x-2", children: _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(deadline.priority)}`, children: t(`calendar.priority.${deadline.priority}`, deadline.priority) }) })] }) }, deadline.id)))) })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 shadow rounded-lg", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200 dark:border-gray-700", children: _jsxs("h3", { className: "text-lg font-medium text-gray-900 dark:text-white flex items-center", children: [_jsx(BellIcon, { className: "h-5 w-5 mr-2" }), t('calendar.activeNotifications', 'Active Notifications')] }) }), _jsxs("div", { className: "divide-y divide-gray-200 dark:divide-gray-700", children: [notifications.slice(0, 5).map((notification) => (_jsx("div", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: `flex-shrink-0 w-2 h-2 rounded-full mt-2 ${notification.priority === 'urgent' ? 'bg-red-500' :
                                                notification.priority === 'high' ? 'bg-orange-500' :
                                                    notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}` }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900 dark:text-white", children: notification.title }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: notification.message }), notification.daysRemaining !== undefined && (_jsx("p", { className: "text-xs text-gray-400 mt-1", children: notification.daysRemaining === 0
                                                        ? t('notifications.dueToday')
                                                        : t('notifications.daysRemaining', { days: notification.daysRemaining }) }))] })] }) }, notification.id))), notifications.length === 0 && (_jsxs("div", { className: "px-6 py-8 text-center", children: [_jsx(BellIcon, { className: "mx-auto h-12 w-12 text-gray-400" }), _jsx("h3", { className: "mt-2 text-sm font-medium text-gray-900 dark:text-white", children: t('notifications.noNotifications') }), _jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: t('notifications.allCaughtUp') })] }))] })] })] }));
};
export default Calendar;
