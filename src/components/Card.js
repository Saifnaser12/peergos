import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Card = ({ children, className = '', noPadding = false }) => {
    return (_jsx("div", { className: `bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700 ${noPadding ? '' : 'p-4 sm:p-6'} ${className}`, children: children }));
};
export default Card;
// Section components for consistent spacing
export const PageHeader = ({ title, description }) => (_jsxs("div", { className: "mb-6 sm:mb-8", children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white", children: title }), description && (_jsx("p", { className: "mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400", children: description }))] }));
export const PageSection = ({ title, description, children, className = '' }) => (_jsxs("div", { className: `space-y-4 sm:space-y-6 ${className}`, children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg sm:text-xl font-semibold text-gray-900 dark:text-white", children: title }), description && (_jsx("p", { className: "mt-1 text-sm text-gray-600 dark:text-gray-400", children: description }))] }), children] }));
export const CardGrid = ({ children, columns = 3 }) => {
    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    };
    return (_jsx("div", { className: `grid ${gridCols[columns]} gap-4 sm:gap-6`, children: children }));
};
