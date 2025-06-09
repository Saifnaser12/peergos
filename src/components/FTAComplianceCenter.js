import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircleIcon, ExclamationTriangleIcon, DocumentTextIcon, CalendarIcon, ShieldCheckIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
const FTAComplianceCenter = ({ trn, revenue }) => {
    const { t } = useTranslation();
    const [complianceItems, setComplianceItems] = useState([]);
    const [overallScore, setOverallScore] = useState(0);
    useEffect(() => {
        const items = [
            // VAT Compliance
            {
                id: 'vat-registration',
                title: 'VAT Registration Status',
                description: revenue > 375000 ? 'VAT registration is mandatory' : 'VAT registration is optional',
                status: revenue > 375000 ? 'compliant' : 'compliant',
                ftaReference: 'VAT Law Article 19'
            },
            {
                id: 'vat-filing',
                title: 'VAT Return Filing',
                description: 'Monthly/Quarterly VAT returns must be filed by 28th of following month',
                status: 'compliant',
                dueDate: '2024-02-28',
                action: 'File VAT Return',
                ftaReference: 'VAT Executive Regulation 16'
            },
            // CIT Compliance
            {
                id: 'cit-registration',
                title: 'Corporate Income Tax Registration',
                description: revenue > 3000000 ? 'CIT registration is mandatory' : 'CIT may apply based on business type',
                status: revenue > 3000000 ? 'compliant' : 'warning',
                ftaReference: 'CIT Law Article 4'
            },
            {
                id: 'cit-filing',
                title: 'CIT Return Filing',
                description: 'CIT return must be filed within 9 months of financial year-end',
                status: 'compliant',
                dueDate: '2024-09-30',
                action: 'Prepare CIT Return',
                ftaReference: 'CIT Law Article 47'
            },
            // Economic Substance
            {
                id: 'esr-compliance',
                title: 'Economic Substance Regulations',
                description: 'ESR notification and report required for relevant activities',
                status: 'warning',
                dueDate: '2024-06-30',
                action: 'Check ESR Requirements',
                ftaReference: 'ESR Cabinet Resolution No. 31/2019'
            },
            // Transfer Pricing
            {
                id: 'transfer-pricing',
                title: 'Transfer Pricing Documentation',
                description: 'Required for related party transactions exceeding AED 3M',
                status: revenue > 3000000 ? 'warning' : 'compliant',
                action: 'Prepare TP Documentation',
                ftaReference: 'CIT Law Article 22'
            },
            // Digital Services Tax
            {
                id: 'dst-compliance',
                title: 'Digital Services Tax',
                description: '50% withholding tax on certain digital services',
                status: 'compliant',
                ftaReference: 'Cabinet Resolution No. 49/2021'
            },
            // Excise Tax
            {
                id: 'excise-tax',
                title: 'Excise Tax Compliance',
                description: 'Applicable to tobacco, carbonated drinks, and energy drinks',
                status: 'compliant',
                ftaReference: 'Excise Tax Law'
            },
            // Record Keeping
            {
                id: 'record-keeping',
                title: 'Books and Records',
                description: 'Maintain proper accounting records for 5 years',
                status: 'compliant',
                ftaReference: 'VAT Law Article 62, CIT Law Article 51'
            },
            // Anti-Money Laundering
            {
                id: 'aml-compliance',
                title: 'AML/CTF Compliance',
                description: 'Customer Due Diligence and Suspicious Transaction Reporting',
                status: 'warning',
                action: 'Review AML Procedures',
                ftaReference: 'AML Law No. 20/2018'
            }
        ];
        setComplianceItems(items);
        // Calculate overall compliance score
        const compliantCount = items.filter(item => item.status === 'compliant').length;
        const score = Math.round((compliantCount / items.length) * 100);
        setOverallScore(score);
    }, [revenue]);
    const getStatusIcon = (status) => {
        switch (status) {
            case 'compliant':
                return _jsx(CheckCircleIcon, { className: "w-5 h-5 text-green-500" });
            case 'warning':
                return _jsx(ExclamationTriangleIcon, { className: "w-5 h-5 text-yellow-500" });
            case 'non-compliant':
                return _jsx(ExclamationTriangleIcon, { className: "w-5 h-5 text-red-500" });
            default:
                return _jsx(ExclamationTriangleIcon, { className: "w-5 h-5 text-gray-500" });
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'compliant':
                return 'border-green-200 bg-green-50';
            case 'warning':
                return 'border-yellow-200 bg-yellow-50';
            case 'non-compliant':
                return 'border-red-200 bg-red-50';
            default:
                return 'border-gray-200 bg-gray-50';
        }
    };
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg", children: _jsx(ShieldCheckIcon, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "FTA Compliance Center" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "UAE Federal Tax Authority compliance monitoring" })] })] }), _jsx("div", { className: "text-center", children: _jsxs("div", { className: `inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${overallScore >= 90 ? 'bg-green-100 text-green-800' :
                                    overallScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'}`, children: [overallScore, "% Compliant"] }) })] }) }), _jsx("div", { className: "px-6 py-3 bg-gray-50 dark:bg-gray-700/50", children: _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Tax Registration Number:" }), _jsx("span", { className: "font-mono font-medium text-gray-900 dark:text-white", children: trn })] }) }), _jsxs("div", { className: "p-6", children: [_jsx("div", { className: "space-y-4", children: complianceItems.map((item) => (_jsx("div", { className: `p-4 rounded-lg border-2 ${getStatusColor(item.status)}`, children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-start space-x-3 flex-1", children: [getStatusIcon(item.status), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white", children: item.title }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: item.description }), item.ftaReference && (_jsxs("p", { className: "text-xs text-blue-600 dark:text-blue-400 mt-1", children: ["Reference: ", item.ftaReference] })), item.dueDate && (_jsxs("div", { className: "flex items-center mt-2 text-xs text-gray-500", children: [_jsx(CalendarIcon, { className: "w-3 h-3 mr-1" }), "Due: ", new Date(item.dueDate).toLocaleDateString()] }))] })] }), item.action && (_jsx("button", { className: "ml-4 px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200", children: item.action }))] }) }, item.id))) }), _jsxs("div", { className: "mt-6 grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("button", { className: "flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: [_jsx(DocumentTextIcon, { className: "w-4 h-4 mr-2" }), "Download Compliance Report"] }), _jsxs("button", { className: "flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors", children: [_jsx(CheckCircleIcon, { className: "w-4 h-4 mr-2" }), "Schedule Compliance Review"] }), _jsxs("button", { className: "flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors", children: [_jsx(CurrencyDollarIcon, { className: "w-4 h-4 mr-2" }), "View Tax Calendar"] })] })] })] }));
};
export default FTAComplianceCenter;
