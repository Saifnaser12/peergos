import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUserRole } from '../context/UserRoleContext';
import { XCircleIcon } from '@heroicons/react/24/outline';
const PermissionDenied = ({ customMessage }) => {
    const { role } = useUserRole();
    return (_jsx("div", { className: "min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8", children: _jsx("div", { className: "mt-8 sm:mx-auto sm:w-full sm:max-w-md", children: _jsx("div", { className: "bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10", children: _jsxs("div", { className: "flex flex-col items-center", children: [_jsx(XCircleIcon, { className: "h-12 w-12 text-red-500" }), _jsx("h2", { className: "mt-4 text-center text-2xl font-bold text-gray-900", children: "Access Denied" }), _jsx("p", { className: "mt-2 text-center text-sm text-gray-600", children: customMessage || `You don't have permission to access this resource.` }), _jsxs("p", { className: "mt-1 text-center text-sm text-gray-500", children: ["Current role: ", role] }), _jsx("div", { className: "mt-6", children: _jsx("a", { href: "/", className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500", children: "Return to Dashboard" }) })] }) }) }) }));
};
export default PermissionDenied;
