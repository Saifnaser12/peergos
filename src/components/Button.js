import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { forwardRef } from 'react';
const Button = forwardRef(({ children, variant = 'primary', size = 'md', icon, isLoading = false, fullWidth = false, className = '', disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
        primary: 'bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:ring-indigo-500',
        secondary: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500',
        outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-indigo-500',
        danger: 'bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600 focus:ring-red-500'
    };
    const sizes = {
        sm: 'px-2.5 py-1.5 text-xs sm:px-3 sm:py-1.5 sm:text-sm',
        md: 'px-3 py-2 text-sm sm:px-4 sm:py-2',
        lg: 'px-4 py-2 text-base sm:px-6 sm:py-3'
    };
    return (_jsx("button", { ref: ref, className: `
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `, disabled: isLoading || disabled, ...props, children: isLoading ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), _jsx("span", { className: "text-sm", children: "Loading..." })] })) : (_jsxs(_Fragment, { children: [icon && _jsx("span", { className: "mr-2 flex-shrink-0", children: icon }), _jsx("span", { className: "truncate", children: children })] })) }));
});
Button.displayName = 'Button';
export default Button;
