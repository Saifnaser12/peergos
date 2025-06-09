import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { illustrations } from './Illustration';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline';
const ComplianceGauge = ({ score, size = 'md', showIcon = true }) => {
    const sizes = {
        sm: 'w-24 h-24',
        md: 'w-32 h-32',
        lg: 'w-40 h-40'
    };
    const getScoreColor = (score) => {
        if (score >= 80)
            return 'text-green-500';
        if (score >= 60)
            return 'text-yellow-500';
        return 'text-red-500';
    };
    const getScoreIcon = (score) => {
        if (score >= 80)
            return _jsx(CheckCircleIcon, { className: "h-6 w-6 text-green-500" });
        if (score >= 60)
            return _jsx(ExclamationTriangleIcon, { className: "h-6 w-6 text-yellow-500" });
        return _jsx(XCircleIcon, { className: "h-6 w-6 text-red-500" });
    };
    return (_jsxs("div", { className: "relative flex flex-col items-center", children: [_jsxs("div", { className: `relative ${sizes[size]}`, children: [_jsx("img", { src: illustrations.complianceGauge, alt: "Compliance Score Gauge", className: "w-full h-full" }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsx("div", { className: "text-center", children: _jsxs("span", { className: `text-2xl font-bold ${getScoreColor(score)}`, children: [score, "%"] }) }) })] }), showIcon && (_jsxs("div", { className: "mt-2 flex items-center space-x-2", children: [getScoreIcon(score), _jsx("span", { className: `text-sm font-medium ${getScoreColor(score)}`, children: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Attention' })] }))] }));
};
export default ComplianceGauge;
