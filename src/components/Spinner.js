import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Spinner = ({ size = 'md', color = 'primary', className = '' }) => {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8'
    };
    const colors = {
        primary: 'text-indigo-600 dark:text-indigo-400',
        white: 'text-white',
        gray: 'text-gray-400 dark:text-gray-500'
    };
    return (_jsxs("svg", { className: `animate-spin ${sizes[size]} ${colors[color]} ${className}`, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }));
};
export default Spinner;
export const LoadingOverlay = ({ isLoading, text = 'Loading...' }) => {
    if (!isLoading)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-gray-900 dark:bg-black bg-opacity-50 dark:bg-opacity-60 flex items-center justify-center z-50", children: _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 sm:mx-0", children: _jsxs("div", { className: "flex flex-col items-center space-y-4", children: [_jsx(Spinner, { size: "lg" }), _jsx("p", { className: "text-gray-700 dark:text-gray-300 font-medium", children: text })] }) }) }));
};
