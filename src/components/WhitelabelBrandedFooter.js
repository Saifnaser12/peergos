import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useWhitelabel } from '../context/WhitelabelContext';
const WhitelabelBrandedFooter = () => {
    const { branding, isWhitelabelMode } = useWhitelabel();
    const footerNote = isWhitelabelMode && branding.footerNote
        ? branding.footerNote
        : '© 2025 Peergos Tax - UAE FTA Compliant Tax Management';
    const customDomain = isWhitelabelMode && branding.customDomain
        ? branding.customDomain
        : null;
    return (_jsx("footer", { className: "bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: footerNote }), customDomain && (_jsx("p", { className: "text-xs text-gray-500 dark:text-gray-500 mt-1", children: customDomain }))] }) }) }));
};
export default WhitelabelBrandedFooter;
