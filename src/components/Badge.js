import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Badge = ({ children, variant = 'default', size = 'md', icon, className = '' }) => {
    const variants = {
        success: 'bg-green-100 text-green-800 border-green-200',
        warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        error: 'bg-red-100 text-red-800 border-red-200',
        info: 'bg-blue-100 text-blue-800 border-blue-200',
        default: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm'
    };
    return (_jsxs("span", { className: `
        inline-flex items-center gap-1 font-medium rounded-full border
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `, children: [icon && _jsx("span", { className: "-ml-0.5", children: icon }), children] }));
};
export default Badge;
export const DotIndicator = ({ variant = 'default', pulse = false }) => {
    const variants = {
        success: 'bg-green-400',
        warning: 'bg-yellow-400',
        error: 'bg-red-400',
        info: 'bg-blue-400',
        default: 'bg-gray-400'
    };
    return (_jsxs("span", { className: "relative flex h-2 w-2", children: [_jsx("span", { className: `absolute inline-flex h-full w-full rounded-full opacity-75 ${variants[variant]} ${pulse ? 'animate-ping' : ''}` }), _jsx("span", { className: `relative inline-flex rounded-full h-2 w-2 ${variants[variant]}` })] }));
};
