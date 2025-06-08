import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, DocumentArrowDownIcon, TableCellsIcon, EyeIcon } from '@heroicons/react/24/outline';
const AccountingSummary = ({ totalRevenue, totalExpenses, netIncome, formatCurrency }) => {
    const { t } = useTranslation();
    const summaryCards = [
        {
            title: t('accounting.summary.totalRevenue'),
            amount: totalRevenue,
            color: 'green',
            icon: ArrowTrendingUpIcon,
            bgGradient: 'from-green-500 to-emerald-600',
            textColor: 'text-green-600 dark:text-green-400'
        },
        {
            title: t('accounting.summary.totalExpenses'),
            amount: totalExpenses,
            color: 'red',
            icon: ArrowTrendingDownIcon,
            bgGradient: 'from-red-500 to-rose-600',
            textColor: 'text-red-600 dark:text-red-400'
        },
        {
            title: t('accounting.summary.netIncome'),
            amount: netIncome,
            color: netIncome >= 0 ? 'blue' : 'red',
            icon: netIncome >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon,
            bgGradient: netIncome >= 0 ? 'from-blue-500 to-indigo-600' : 'from-red-500 to-rose-600',
            textColor: netIncome >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'
        }
    ];
    const handleDownloadPDF = () => {
        // TODO: Implement PDF export
        console.log('Downloading PDF summary...');
    };
    const handleDownloadExcel = () => {
        // TODO: Implement Excel export
        console.log('Downloading Excel summary...');
    };
    const handleViewFinancials = () => {
        window.location.href = '/financials';
    };
    return (_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: t('accounting.summary.title') }), _jsx("span", { className: "text-sm text-gray-500 dark:text-gray-400", children: t('accounting.summary.thisMonth') })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: summaryCards.map((card, index) => {
                    const Icon = card.icon;
                    return (_jsxs("div", { className: "relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1", children: [_jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: `p-3 rounded-xl bg-gradient-to-br ${card.bgGradient} shadow-lg`, children: _jsx(Icon, { className: "h-6 w-6 text-white" }) }), _jsx("span", { className: "text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider", children: t('accounting.summary.thisMonth') })] }), _jsx("h3", { className: "text-sm font-medium text-gray-600 dark:text-gray-400 mb-2", children: card.title }), _jsx("p", { className: `text-3xl font-bold ${card.textColor} mb-1`, children: formatCurrency(card.amount) }), _jsx("div", { className: "flex items-center text-xs text-gray-500 dark:text-gray-400", children: _jsx("span", { children: t('accounting.summary.monthToDate') }) })] }), _jsx("div", { className: `absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.bgGradient}` })] }, index));
                }) }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 items-center justify-center", children: [_jsxs("button", { onClick: handleDownloadPDF, className: "inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 min-w-[200px] justify-center", children: [_jsx(DocumentArrowDownIcon, { className: "h-5 w-5 mr-2" }), t('accounting.summary.downloadPDF')] }), _jsxs("button", { onClick: handleDownloadExcel, className: "inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 min-w-[200px] justify-center", children: [_jsx(TableCellsIcon, { className: "h-5 w-5 mr-2" }), t('accounting.summary.downloadExcel')] }), _jsxs("button", { onClick: handleViewFinancials, className: "inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 min-w-[200px] justify-center", children: [_jsx(EyeIcon, { className: "h-5 w-5 mr-2" }), t('accounting.summary.viewFinancials')] })] })] }));
};
export default AccountingSummary;
