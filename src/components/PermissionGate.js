import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LockClosedIcon } from '@heroicons/react/24/solid';
import { useUserRole } from '../context/UserRoleContext';
const PermissionGate = ({ children, resource, requiredPermission = 'view', restrictedTo = 'Admins' }) => {
    const { hasPermission } = useUserRole();
    const hasAccess = hasPermission(resource, requiredPermission);
    if (hasAccess) {
        return _jsx(_Fragment, { children: children });
    }
    return (_jsxs("div", { className: "relative", children: [_jsx("div", { className: "filter blur-sm pointer-events-none opacity-50", children: children }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsxs("div", { className: "bg-white/90 dark:bg-gray-800/90 rounded-lg p-3 shadow-lg flex items-center gap-2 group", children: [_jsx(LockClosedIcon, { className: "h-5 w-5 text-gray-500 dark:text-gray-400" }), _jsxs("span", { className: "text-sm font-medium text-gray-600 dark:text-gray-300", children: ["Restricted to ", restrictedTo] })] }) })] }));
};
export default PermissionGate;
