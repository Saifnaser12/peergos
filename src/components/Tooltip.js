import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const Tooltip = ({ content, children, position = 'top' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const positionClasses = {
        top: '-translate-x-1/2 left-1/2 bottom-full mb-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
        bottom: '-translate-x-1/2 left-1/2 top-full mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2'
    };
    return (_jsxs("div", { className: "relative inline-block", children: [_jsx("div", { onMouseEnter: () => setIsVisible(true), onMouseLeave: () => setIsVisible(false), children: children }), isVisible && (_jsxs("div", { className: `absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm 
          transition-opacity duration-300 dark:bg-gray-700 max-w-xs ${positionClasses[position]}`, children: [content, _jsx("div", { className: "absolute w-2 h-2 bg-gray-900 rotate-45 -bottom-1 left-1/2 -translate-x-1/2" })] }))] }));
};
export default Tooltip;
export const InfoTooltip = ({ content, position = 'top' }) => {
    return (_jsx(Tooltip, { content: content, position: position, children: _jsx("svg", { className: "h-5 w-5 text-gray-400 hover:text-gray-500 cursor-help", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z", clipRule: "evenodd" }) }) }));
};
