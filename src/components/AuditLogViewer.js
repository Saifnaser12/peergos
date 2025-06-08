import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAudit } from '../context/AuditContext';
import { useUserRole } from '../context/UserRoleContext';
import { ClockIcon, TrashIcon } from '@heroicons/react/24/outline';
const AuditLogViewer = () => {
    const { getRecentEntries, clearLog } = useAudit();
    const { role } = useUserRole();
    const [limit, setLimit] = useState(50);
    if (role !== 'Admin') {
        return null;
    }
    const entries = getRecentEntries(limit);
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };
    const formatAction = (action) => {
        return action.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
    };
    return (_jsxs("div", { className: "bg-white shadow rounded-lg overflow-hidden", children: [_jsxs("div", { className: "px-4 py-5 sm:px-6 flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900", children: "Audit Log" }), _jsx("p", { className: "mt-1 max-w-2xl text-sm text-gray-500", children: "Recent system activities and user actions" })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("select", { value: limit, onChange: (e) => setLimit(Number(e.target.value)), className: "rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm", children: [_jsx("option", { value: 25, children: "Last 25" }), _jsx("option", { value: 50, children: "Last 50" }), _jsx("option", { value: 100, children: "Last 100" })] }), _jsxs("button", { onClick: clearLog, className: "inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500", children: [_jsx(TrashIcon, { className: "h-4 w-4 mr-1" }), "Clear Log"] })] })] }), _jsx("div", { className: "border-t border-gray-200", children: _jsx("ul", { role: "list", className: "divide-y divide-gray-200 max-h-96 overflow-y-auto", children: entries.map((entry) => (_jsxs("li", { className: "px-4 py-4 sm:px-6 hover:bg-gray-50", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(ClockIcon, { className: "h-5 w-5 text-gray-400 mr-2" }), _jsx("p", { className: "text-sm font-medium text-gray-600", children: formatTimestamp(entry.timestamp) })] }), _jsx("div", { className: "ml-2 flex-shrink-0 flex", children: _jsx("p", { className: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800", children: entry.role }) })] }), _jsxs("div", { className: "mt-2 sm:flex sm:justify-between", children: [_jsx("div", { className: "sm:flex", children: _jsx("p", { className: "text-sm text-gray-900", children: formatAction(entry.action) }) }), entry.details && (_jsx("div", { className: "mt-2 flex items-center text-sm text-gray-500 sm:mt-0", children: _jsx("p", { className: "text-xs font-mono bg-gray-100 rounded px-2 py-1", children: JSON.stringify(entry.details) }) }))] })] }, entry.id))) }) })] }));
};
export default AuditLogViewer;
