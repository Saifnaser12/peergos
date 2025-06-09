import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { illustrations } from './Illustration';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Badge from './Badge';
const TRNVerification = ({ trn, companyName, licenseType, isVerified }) => {
    if (!isVerified)
        return null;
    return (_jsxs("div", { className: "flex items-center space-x-6 bg-green-50 rounded-2xl p-6 border border-green-100", children: [_jsx("img", { src: illustrations.trnVerified, alt: "TRN Verified", className: "w-24 h-24 object-contain" }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(CheckCircleIcon, { className: "h-6 w-6 text-green-500" }), _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "TRN Verified Successfully" })] }), _jsxs("div", { className: "mt-3 grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "TRN Number" }), _jsx("p", { className: "mt-1 text-sm text-gray-900", children: trn })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "Company Name" }), _jsx("p", { className: "mt-1 text-sm text-gray-900", children: companyName })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "License Type" }), _jsx(Badge, { variant: "success", size: "sm", children: licenseType })] })] })] })] }));
};
export default TRNVerification;
