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
    const getPriorityColor = (deadline) => {
        // Smart urgency based on days remaining
        const daysRemaining = Math.ceil((deadline.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        if (deadline.status === 'completed') {
            return 'text-green-600 bg-green-100 border-green-300';
        }
        if (deadline.status === 'overdue' || daysRemaining < 0) {
            return 'text-red-600 bg-red-100 border-red-300';
        }
        if (daysRemaining <= 7) {
            return 'text-red-600 bg-red-100 border-red-300'; // 🔴 High (due in < 7 days)
        }
        if (daysRemaining <= 30) {
            return 'text-yellow-600 bg-yellow-100 border-yellow-300'; // 🟡 Medium (7–30 days)
        }
        return 'text-blue-600 bg-blue-100 border-blue-300'; // 🟢 Low (> 30 days)
    };
    const getUrgencyFlag = (deadline) => {
        const daysRemaining = Math.ceil((deadline.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        if (deadline.status === 'completed')
            return '✅';
        if (deadline.status === 'overdue' || daysRemaining < 0)
            return '🔴';
        if (daysRemaining <= 7)
            return '🔴';
        if (daysRemaining <= 30)
            return '🟡';
        return '🟢';
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
                                const dayDeadlines = deadlines.filter(d => d.date.toDateString() === date.toDateString());
                                const hasDeadline = dayDeadlines.length > 0;
                                // Smart completion logic - check if deadline is completed
                                const getDeadlineColor = (deadline) => {
                                    if (deadline.status === 'completed')
                                        return 'bg-green-500'; // ✅ submitted
                                    if (deadline.status === 'overdue')
                                        return 'bg-red-500'; // 🔴 overdue
                                    const daysUntil = Math.ceil((deadline.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                    if (daysUntil <= 7)
                                        return 'bg-yellow-500'; // 🟡 due soon
                                    return 'bg-blue-500'; // 🟢 future
                                };
                                return (_jsxs("div", { className: `
                  relative p-2 text-center text-sm border rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                  ${isCurrentMonth
                                        ? 'text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                        : 'text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800'}
                  ${isToday ? 'ring-2 ring-indigo-500' : ''}
                  ${hasDeadline ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : ''}
                `, title: dayDeadlines.length > 0 ? dayDeadlines.map(d => `${d.title} - ${d.type}`).join('\n') : '', children: [_jsxs("div", { className: "flex items-center justify-center h-8", children: [_jsx("span", { className: dayDeadlines.some(d => d.status === 'completed') ? 'line-through' : '', children: date.getDate() }), hasDeadline && (_jsxs("div", { className: "ml-1 flex flex-col space-y-1", children: [dayDeadlines.slice(0, 3).map((deadline, idx) => (_jsx("div", { className: `w-2 h-2 rounded-full ${getDeadlineColor(deadline)}` }, idx))), dayDeadlines.length > 3 && (_jsxs("div", { className: "text-xs text-gray-500", children: ["+", dayDeadlines.length - 3] }))] }))] }), dayDeadlines.some(d => d.status === 'completed') && (_jsx("div", { className: "absolute top-1 right-1", children: _jsx(CheckCircleIcon, { className: "h-3 w-3 text-green-500" }) }))] }, i));
                            })] })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 shadow rounded-lg", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200 dark:border-gray-700", children: _jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white", children: t('calendar.upcomingDeadlines', 'Upcoming Deadlines') }) }), _jsx("div", { className: "divide-y divide-gray-200 dark:divide-gray-700", children: deadlines.length === 0 ? (_jsxs("div", { className: "px-6 py-8 text-center", children: [_jsx(CalendarDaysIcon, { className: "mx-auto h-12 w-12 text-gray-400" }), _jsx("h3", { className: "mt-2 text-sm font-medium text-gray-900 dark:text-white", children: t('calendar.noDeadlines', 'No deadlines this month') }), _jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: t('calendar.noDeadlinesDesc', 'All your tax obligations are up to date.') })] })) : (deadlines.map((deadline) => {
                            const daysRemaining = Math.ceil((deadline.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                            return (_jsx("div", { className: "px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [getStatusIcon(deadline.status), _jsxs("div", { children: [_jsx("h4", { className: `text-sm font-medium ${deadline.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`, children: deadline.title }), _jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [deadline.type, " \u2022 ", deadline.date.toLocaleDateString(i18n.language), daysRemaining >= 0 && deadline.status !== 'completed' && (_jsxs("span", { className: "ml-2", children: ["(", daysRemaining === 0 ? t('calendar.dueToday', 'Due Today') :
                                                                            daysRemaining === 1 ? t('calendar.dueTomorrow', 'Due Tomorrow') :
                                                                                t('calendar.daysRemaining', `${daysRemaining} days remaining`), ")"] }))] })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-lg", children: getUrgencyFlag(deadline) }), _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(deadline)}`, children: deadline.status === 'completed' ? t('calendar.completed', 'Completed') :
                                                        daysRemaining < 0 ? t('calendar.overdue', 'Overdue') :
                                                            daysRemaining <= 7 ? t('calendar.urgent', 'Urgent') :
                                                                daysRemaining <= 30 ? t('calendar.medium', 'Medium') :
                                                                    t('calendar.low', 'Low') })] })] }) }, deadline.id));
                        })) })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 shadow rounded-lg", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200 dark:border-gray-700", children: _jsxs("h3", { className: "text-lg font-medium text-gray-900 dark:text-white flex items-center", children: [_jsx(BellIcon, { className: "h-5 w-5 mr-2" }), t('calendar.activeNotifications', 'Active Notifications')] }) }), _jsxs("div", { className: "divide-y divide-gray-200 dark:divide-gray-700", children: [(!profile?.isSetupComplete) && (_jsx("div", { className: "px-6 py-4 bg-yellow-50 dark:bg-yellow-900/20", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-start space-x-3", children: [_jsx(ExclamationTriangleIcon, { className: "h-5 w-5 text-yellow-500 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "text-sm font-medium text-gray-900 dark:text-white", children: ["\u2757 ", t('calendar.setupIncomplete', 'Setup Incomplete')] }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: t('calendar.completeSetup', 'Complete your company setup to ensure compliance') }), _jsx("a", { href: "/setup", className: "text-sm text-indigo-600 hover:text-indigo-500 mt-1 inline-block", children: t('calendar.goToSetup', 'Go to Setup →') })] })] }), _jsxs("button", { className: "text-gray-400 hover:text-gray-500", children: [_jsx("span", { className: "sr-only", children: t('calendar.dismiss', 'Dismiss') }), "\u2715"] })] }) })), (!profile?.taxAgentCertificate) && (_jsx("div", { className: "px-6 py-4 bg-red-50 dark:bg-red-900/20", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-start space-x-3", children: [_jsx(ExclamationTriangleIcon, { className: "h-5 w-5 text-red-500 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "text-sm font-medium text-gray-900 dark:text-white", children: ["\u2757 ", t('calendar.taxAgentMissing', 'Tax Agent Certificate Missing')] }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: t('calendar.uploadCertificate', 'Upload your tax agent certificate to complete filing') }), _jsx("a", { href: "/corporate-tax", className: "text-sm text-indigo-600 hover:text-indigo-500 mt-1 inline-block", children: t('calendar.goToFiling', 'Go to Filing →') })] })] }), _jsxs("button", { className: "text-gray-400 hover:text-gray-500", children: [_jsx("span", { className: "sr-only", children: t('calendar.remindLater', 'Remind Me Later') }), "\u23F0"] })] }) })), (!profile?.bankSlip) && (_jsx("div", { className: "px-6 py-4 bg-orange-50 dark:bg-orange-900/20", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-start space-x-3", children: [_jsx(ExclamationTriangleIcon, { className: "h-5 w-5 text-orange-500 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "text-sm font-medium text-gray-900 dark:text-white", children: ["\u2757 ", t('calendar.bankSlipMissing', 'Bank Slip Missing')] }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: t('calendar.uploadBankSlip', 'Upload payment transfer slip for tax compliance') }), _jsx("a", { href: "/corporate-tax", className: "text-sm text-indigo-600 hover:text-indigo-500 mt-1 inline-block", children: t('calendar.goToFiling', 'Go to Filing →') })] })] }), _jsxs("button", { className: "text-gray-400 hover:text-gray-500", children: [_jsx("span", { className: "sr-only", children: t('calendar.dismiss', 'Dismiss') }), "\u2715"] })] }) })), notifications.slice(0, 5).map((notification) => (_jsx("div", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: `flex-shrink-0 w-2 h-2 rounded-full mt-2 ${notification.priority === 'urgent' ? 'bg-red-500' :
                                                        notification.priority === 'high' ? 'bg-orange-500' :
                                                            notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}` }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900 dark:text-white", children: notification.title }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: notification.message }), notification.daysRemaining !== undefined && (_jsx("p", { className: "text-xs text-gray-400 mt-1", children: notification.daysRemaining === 0
                                                                ? t('notifications.dueToday')
                                                                : t('notifications.daysRemaining', { days: notification.daysRemaining }) }))] })] }), _jsxs("button", { className: "text-gray-400 hover:text-gray-500", children: [_jsx("span", { className: "sr-only", children: t('calendar.dismiss', 'Dismiss') }), "\u2715"] })] }) }, notification.id))), notifications.length === 0 && (_jsxs("div", { className: "px-6 py-8 text-center", children: [_jsx(BellIcon, { className: "mx-auto h-12 w-12 text-gray-400" }), _jsx("h3", { className: "mt-2 text-sm font-medium text-gray-900 dark:text-white", children: t('notifications.noNotifications') }), _jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: t('notifications.allCaughtUp') })] }))] })] })] }));
};
export default Calendar;
