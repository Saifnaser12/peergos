import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { BuildingOffice2Icon } from '@heroicons/react/24/outline';
const SMEDashboard = () => {
    const { t } = useTranslation();
    const smeThresholds = {
        vatRegistration: 375000,
        citRegistration: 3000000,
        transferPricingDoc: 3000000,
        auditRequirement: 20000000
    };
    const complianceChecks = [
        {
            title: 'VAT Registration',
            threshold: smeThresholds.vatRegistration,
            status: 'compliant',
            description: 'Required if annual revenue > AED 375,000'
        },
        {
            title: 'CIT Registration',
            threshold: smeThresholds.citRegistration,
            status: 'pending',
            description: 'Required for most businesses'
        },
        {
            title: 'Transfer Pricing Docs',
            threshold: smeThresholds.transferPricingDoc,
            status: 'not-required',
            description: 'Required if related party transactions > AED 3M'
        }
    ];
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6", children: [_jsx("div", { className: "flex items-center justify-between mb-6", children: _jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white flex items-center", children: [_jsx(BuildingOffice2Icon, { className: "w-5 h-5 mr-2" }), "SME Compliance Dashboard"] }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "UAE-specific requirements for Small & Medium Enterprises" })] }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: complianceChecks.map((check, index) => (_jsxs("div", { className: `p-4 rounded-lg border-2 ${check.status === 'compliant' ? 'border-green-200 bg-green-50' :
                        check.status === 'pending' ? 'border-yellow-200 bg-yellow-50' :
                            'border-gray-200 bg-gray-50'}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "font-medium text-gray-900", children: check.title }), check.status === 'compliant' && _jsx("span", { className: "text-green-500", children: "\u2705" }), check.status === 'pending' && _jsx("span", { className: "text-yellow-500", children: "\u26A0\uFE0F" }), check.status === 'not-required' && _jsx("span", { className: "text-gray-500", children: "\u2139\uFE0F" })] }), _jsx("p", { className: "text-sm text-gray-600 mb-2", children: check.description }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Threshold: AED ", check.threshold.toLocaleString()] })] }, index))) }), _jsxs("div", { className: "mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg", children: [_jsx("h4", { className: "font-medium text-blue-800 dark:text-blue-200 mb-2", children: "\uD83D\uDCA1 SME Quick Tips" }), _jsxs("ul", { className: "text-sm text-blue-700 dark:text-blue-300 space-y-1", children: [_jsx("li", { children: "\u2022 Keep digital records for 5+ years as per UAE law" }), _jsx("li", { children: "\u2022 File nil returns even with no business activity" }), _jsx("li", { children: "\u2022 Consider voluntary VAT registration for input tax recovery" }), _jsx("li", { children: "\u2022 Use FTA-approved accounting software (like Peergos!)" })] })] })] }));
};
export default SMEDashboard;
