import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { illustrations } from './Illustration';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import Badge from './Badge';
const AuditSchedule = ({ nextAuditDate, lastAuditDate, status }) => {
    const getStatusBadge = () => {
        switch (status) {
            case 'scheduled':
                return _jsx(Badge, { variant: "info", icon: _jsx(CalendarIcon, { className: "h-4 w-4" }), children: "Scheduled" });
            case 'completed':
                return _jsx(Badge, { variant: "success", children: "Completed" });
            default:
                return _jsx(Badge, { variant: "warning", children: "No Audit Scheduled" });
        }
    };
    return (_jsx("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-6", children: _jsxs("div", { className: "flex items-start space-x-4", children: [_jsx("img", { src: illustrations.auditIcon, alt: "Audit Schedule", className: "w-12 h-12 object-contain" }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Tax Audit Schedule" }), getStatusBadge()] }), _jsxs("div", { className: "mt-4 space-y-3", children: [nextAuditDate && (_jsxs("div", { className: "flex items-center text-sm", children: [_jsx(CalendarIcon, { className: "h-5 w-5 text-gray-400 mr-2" }), _jsx("span", { className: "text-gray-600", children: "Next Audit:" }), _jsx("span", { className: "ml-2 font-medium text-gray-900", children: new Date(nextAuditDate).toLocaleDateString() })] })), lastAuditDate && (_jsxs("div", { className: "flex items-center text-sm", children: [_jsx(ClockIcon, { className: "h-5 w-5 text-gray-400 mr-2" }), _jsx("span", { className: "text-gray-600", children: "Last Audit:" }), _jsx("span", { className: "ml-2 font-medium text-gray-900", children: new Date(lastAuditDate).toLocaleDateString() })] }))] })] })] }) }));
};
export default AuditSchedule;
