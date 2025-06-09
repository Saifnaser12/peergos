import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
const Input = ({ label, error, icon, helpText, className = '', ...props }) => {
    return (_jsxs("div", { className: "space-y-1", children: [label && (_jsx("label", { htmlFor: props.id, className: "block text-sm font-medium text-gray-700", children: label })), _jsxs("div", { className: "relative rounded-md shadow-sm", children: [icon && (_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: icon })), _jsx("input", { ...props, className: `
            block w-full rounded-lg shadow-sm sm:text-sm
            ${icon ? 'pl-10' : 'pl-3'}
            ${error
                            ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}
            ${className}
          ` }), error && (_jsx("div", { className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none", children: _jsx(ExclamationCircleIcon, { className: "h-5 w-5 text-red-500", "aria-hidden": "true" }) }))] }), (error || helpText) && (_jsx("p", { className: `text-sm ${error ? 'text-red-600' : 'text-gray-500'}`, children: error || helpText }))] }));
};
export default Input;
export const Select = ({ label, error, icon, helpText, options, className = '', ...props }) => {
    return (_jsxs("div", { className: "space-y-1", children: [label && (_jsx("label", { htmlFor: props.id, className: "block text-sm font-medium text-gray-700", children: label })), _jsxs("div", { className: "relative rounded-md shadow-sm", children: [icon && (_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: icon })), _jsx("select", { ...props, className: `
            block w-full rounded-lg shadow-sm sm:text-sm
            ${icon ? 'pl-10' : 'pl-3'}
            ${error
                            ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}
            ${className}
          `, children: options.map(option => (_jsx("option", { value: option.value, children: option.label }, option.value))) }), error && (_jsx("div", { className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none", children: _jsx(ExclamationCircleIcon, { className: "h-5 w-5 text-red-500", "aria-hidden": "true" }) }))] }), (error || helpText) && (_jsx("p", { className: `text-sm ${error ? 'text-red-600' : 'text-gray-500'}`, children: error || helpText }))] }));
};
