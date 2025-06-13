import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import WhitelabelConfig from '../components/WhitelabelConfig';
import { SwatchIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
const WhitelabelPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (_jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("button", { onClick: () => navigate('/admin'), className: "inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4", children: [_jsx(ArrowLeftIcon, { className: "w-4 h-4 mr-1" }), t('common.backToAdmin', 'Back to Admin')] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl", children: _jsx(SwatchIcon, { className: "w-8 h-8 text-purple-600 dark:text-purple-400" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white", children: t('whitelabel.page.title', 'Whitelabel Configuration') }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-1", children: t('whitelabel.page.subtitle', 'Customize branding and appearance for your organization') })] })] })] }), _jsx(WhitelabelConfig, {})] }) }));
};
export default WhitelabelPage;
