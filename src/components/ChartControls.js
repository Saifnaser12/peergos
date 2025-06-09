import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChartBarIcon, ChartPieIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
const ChartControls = ({ chartType, onChartTypeChange, onDownload, chartTitle }) => {
    return (_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: chartTitle }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "inline-flex items-center p-0.5 rounded-lg bg-gray-100 shadow-sm", children: [_jsxs("button", { type: "button", onClick: () => onChartTypeChange('line'), className: `inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${chartType === 'line'
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'}`, children: [_jsx(ChartPieIcon, { className: "h-4 w-4 mr-1.5" }), "Line"] }), _jsxs("button", { type: "button", onClick: () => onChartTypeChange('bar'), className: `inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${chartType === 'bar'
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'}`, children: [_jsx(ChartBarIcon, { className: "h-4 w-4 mr-1.5" }), "Bar"] })] }), _jsxs("button", { type: "button", onClick: onDownload, className: "inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500", children: [_jsx(ArrowDownTrayIcon, { className: "h-4 w-4 mr-1.5" }), "Download"] })] })] }));
};
export default ChartControls;
