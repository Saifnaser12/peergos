import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon, CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
const AlertBanner = ({ type, title, message, action }) => {
    const types = {
        warning: {
            icon: _jsx(ExclamationTriangleIcon, { className: "h-5 w-5 text-yellow-400" }),
            bg: 'bg-yellow-50 dark:bg-yellow-900/20',
            border: 'border-yellow-400 dark:border-yellow-500',
            text: 'text-yellow-800 dark:text-yellow-300',
            button: 'bg-yellow-50 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/60'
        },
        error: {
            icon: _jsx(XCircleIcon, { className: "h-5 w-5 text-red-400" }),
            bg: 'bg-red-50 dark:bg-red-900/20',
            border: 'border-red-400 dark:border-red-500',
            text: 'text-red-800 dark:text-red-300',
            button: 'bg-red-50 dark:bg-red-900/40 text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/60'
        },
        info: {
            icon: _jsx(InformationCircleIcon, { className: "h-5 w-5 text-blue-400" }),
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-400 dark:border-blue-500',
            text: 'text-blue-800 dark:text-blue-300',
            button: 'bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60'
        },
        success: {
            icon: _jsx(CheckCircleIcon, { className: "h-5 w-5 text-green-400" }),
            bg: 'bg-green-50 dark:bg-green-900/20',
            border: 'border-green-400 dark:border-green-500',
            text: 'text-green-800 dark:text-green-300',
            button: 'bg-green-50 dark:bg-green-900/40 text-green-800 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/60'
        }
    };
    const style = types[type];
    return (_jsx("div", { className: `rounded-xl ${style.bg} border ${style.border} p-3 sm:p-4 shadow-sm mb-4`, children: _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start", children: [_jsx("div", { className: "flex-shrink-0 self-center sm:self-start", children: style.icon }), _jsxs("div", { className: "mt-3 sm:mt-0 sm:ml-3 flex-1 text-center sm:text-left", children: [_jsx("h3", { className: `text-sm font-semibold ${style.text}`, children: title }), _jsx("div", { className: `mt-2 text-sm ${style.text}`, children: _jsx("p", { children: message }) }), action && (_jsx("div", { className: "mt-4", children: _jsxs("button", { type: "button", onClick: action.onClick, className: `w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg ${style.button} transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${type}-500`, children: [action.label, _jsx(ArrowRightIcon, { className: "ml-2 h-4 w-4" })] }) }))] })] }) }));
};
export default AlertBanner;
