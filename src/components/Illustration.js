import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Illustration = ({ src, alt, className = '', size = 'md' }) => {
    const sizes = {
        sm: 'w-24 h-24',
        md: 'w-32 h-32',
        lg: 'w-48 h-48',
        xl: 'w-64 h-64'
    };
    return (_jsx("div", { className: `relative ${sizes[size]} ${className}`, children: _jsx("img", { src: src, alt: alt, className: "w-full h-full object-contain" }) }));
};
export default Illustration;
// Predefined illustrations with consistent paths
export const illustrations = {
    dashboardEmpty: '/assets/dashboard_empty.svg',
    trnVerified: '/assets/trn_search_verified.svg',
    noDataFolder: '/assets/no_data_folder.svg',
    auditIcon: '/assets/audit_icon.svg',
    complianceGauge: '/assets/compliance_score_gauge.svg'
};
export const EmptyState = ({ illustration, title, description, action }) => {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center py-12 px-4", children: [_jsx(Illustration, { src: illustration, alt: title, size: "lg", className: "mb-6" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 text-center", children: title }), description && (_jsx("p", { className: "mt-2 text-sm text-gray-500 text-center max-w-sm", children: description })), action && (_jsx("div", { className: "mt-6", children: action }))] }));
};
