import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { CalendarIcon, ClockIcon, ExclamationTriangleIcon, ChartBarIcon } from '@heroicons/react/24/outline';
const SmartReminders = () => {
    const { t } = useTranslation();
    const reminders = [
        {
            type: 'deadline',
            title: 'VAT Return Due',
            description: 'Next VAT filing deadline in 15 days',
            date: '2024-02-28',
            priority: 'high',
            icon: ExclamationTriangleIcon,
            color: 'red'
        },
        {
            type: 'insight',
            title: 'Revenue Growth Trend',
            description: '23% increase in Q4 revenue detected',
            priority: 'medium',
            icon: ChartBarIcon,
            color: 'green'
        },
        {
            type: 'compliance',
            title: 'Transfer Pricing Review',
            description: 'Annual TP documentation review recommended',
            priority: 'medium',
            icon: ClockIcon,
            color: 'yellow'
        }
    ];
    const getColorClasses = (color) => {
        const colors = {
            red: 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-700',
            green: 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-700',
            yellow: 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700',
            blue: 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700'
        };
        return colors[color] || colors.blue;
    };
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "px-6 py-4 border-b border-gray-200 dark:border-gray-700", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white flex items-center", children: "\uD83E\uDDE0 Smart Reminders & Insights" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: "AI-powered notifications and business intelligence" })] }), _jsx("div", { className: "p-6", children: _jsx("div", { className: "space-y-4", children: reminders.map((reminder, index) => {
                        const Icon = reminder.icon;
                        return (_jsx("div", { className: `p-4 rounded-lg border ${getColorClasses(reminder.color)}`, children: _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx(Icon, { className: "w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white", children: reminder.title }), _jsx("span", { className: `px-2 py-1 text-xs font-medium rounded-full ${reminder.priority === 'high'
                                                            ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                                                            : reminder.priority === 'medium'
                                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200'
                                                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200'}`, children: reminder.priority })] }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: reminder.description }), reminder.date && (_jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-500 mt-2 flex items-center", children: [_jsx(CalendarIcon, { className: "w-3 h-3 mr-1" }), reminder.date] }))] })] }) }, index));
                    }) }) })] }));
};
export default SmartReminders;
