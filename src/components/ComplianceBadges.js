import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import Tooltip from './Tooltip';
const ComplianceBadges = ({ revenue }) => {
    const [animate, setAnimate] = useState(false);
    const [prevRevenue, setPrevRevenue] = useState(revenue);
    useEffect(() => {
        if (revenue !== prevRevenue) {
            setAnimate(true);
            setPrevRevenue(revenue);
            const timer = setTimeout(() => setAnimate(false), 500);
            return () => clearTimeout(timer);
        }
    }, [revenue, prevRevenue]);
    const getBadgeContent = () => {
        if (revenue > 3000000) {
            return {
                icon: _jsx(ExclamationCircleIcon, { className: "h-5 w-5" }),
                text: 'VAT + CIT Required',
                bgColor: 'bg-red-100',
                textColor: 'text-red-800',
                borderColor: 'border-red-200',
                tooltip: 'Your revenue exceeds AED 3M. Both VAT and Corporate Income Tax registration are mandatory.'
            };
        }
        if (revenue > 375000) {
            return {
                icon: _jsx(InformationCircleIcon, { className: "h-5 w-5" }),
                text: 'VAT Only',
                bgColor: 'bg-blue-100',
                textColor: 'text-blue-800',
                borderColor: 'border-blue-200',
                tooltip: 'Your revenue exceeds AED 375K. VAT registration is mandatory.'
            };
        }
        return {
            icon: _jsx(CheckCircleIcon, { className: "h-5 w-5" }),
            text: 'No Tax Filing Required',
            bgColor: 'bg-green-100',
            textColor: 'text-green-800',
            borderColor: 'border-green-200',
            tooltip: 'Your revenue is below the tax thresholds. No mandatory tax filings are required at this time.'
        };
    };
    const badge = getBadgeContent();
    return (_jsxs("div", { className: "flex flex-col space-y-2", children: [_jsx(Tooltip, { content: badge.tooltip, children: _jsxs("div", { className: `
            inline-flex items-center px-3 py-1 rounded-full border
            ${badge.bgColor} ${badge.textColor} ${badge.borderColor}
            ${animate ? 'animate-bounce' : ''}
            transition-colors duration-200
          `, children: [_jsx("span", { className: "mr-1.5", children: badge.icon }), _jsx("span", { className: "text-sm font-medium", children: badge.text })] }) }), _jsxs("div", { className: "flex justify-between text-xs text-gray-500 px-1", children: [_jsx("span", { children: "0" }), _jsx("span", { children: "375K" }), _jsx("span", { children: "3M+" })] }), _jsx("div", { className: "h-2 rounded-full bg-gray-200 overflow-hidden", children: _jsx("div", { className: `h-full transition-all duration-500 ease-out ${revenue > 3000000
                        ? 'bg-red-500 w-full'
                        : revenue > 375000
                            ? 'bg-blue-500 w-2/3'
                            : 'bg-green-500 w-1/3'}` }) })] }));
};
export default ComplianceBadges;
