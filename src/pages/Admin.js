import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import AuditLogViewer from '../components/AuditLogViewer';
const Admin = () => {
    return (_jsx("div", { className: "py-6", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Admin Dashboard" }), _jsx("div", { className: "mt-6", children: _jsx(AuditLogViewer, {}) })] }) }));
};
export default Admin;
