import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTax } from '../context/TaxContext';
import { useFinance } from '../context/FinanceContext';
import { useFinancialSync } from '../hooks/useFinancialSync';
import FTAIntegrationStatus from '../components/FTAIntegrationStatus';
import TRNLookup from '../components/TRNLookup';
import POSIntegrationStatus from '../components/POSIntegrationStatus';
import FTAComplianceCenter from '../components/FTAComplianceCenter';
import RealTimeTaxCalculator from '../components/RealTimeTaxCalculator';
import SmartReminders from '../components/SmartReminders';
import { useUserRole } from '../context/UserRoleContext';
import { useNotification } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import { ChartBarIcon, DocumentTextIcon, CurrencyDollarIcon, ArrowRightIcon, BuildingOfficeIcon, ReceiptPercentIcon } from '@heroicons/react/24/outline';
const Dashboard = () => {
    const { t } = useTranslation();
    const { role } = useUserRole();
    const { notifications } = useNotification();
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();
    // Check if setup is incomplete
    const setupIncomplete = !localStorage.getItem('peergos_setup_complete');
    const { citData, vatData } = useTax();
    const { revenue, expenses } = useFinance();
    const { summary, isUpdating, totalRevenue, totalExpenses, netIncome } = useFinancialSync();
    // Dashboard data with live financials
    const dashboardData = {
        cit: {
            liability: 125000,
            status: 'pending',
            dueDate: '2024-03-31'
        },
        vat: {
            due: 18500,
            status: 'filed',
            nextDue: '2024-02-28'
        },
        financials: {
            revenue: totalRevenue,
            netIncome: netIncome,
            status: 'current'
        },
        transferPricing: {
            riskLevel: 'medium',
            documentsRequired: 3,
            compliance: 75
        }
    };
    const summaryCards = [
        {
            title: t('dashboard.cit.title'),
            value: `AED ${dashboardData.cit.liability.toLocaleString()}`,
            status: dashboardData.cit.status,
            subtitle: t('dashboard.cit.subtitle'),
            icon: DocumentTextIcon,
            color: 'blue',
            path: '/cit'
        },
        {
            title: t('dashboard.vat.title'),
            value: `AED ${dashboardData.vat.due.toLocaleString()}`,
            status: dashboardData.vat.status,
            subtitle: t('dashboard.vat.subtitle'),
            icon: ReceiptPercentIcon,
            color: 'green',
            path: '/vat'
        },
        {
            title: t('dashboard.financials.title'),
            value: `AED ${dashboardData.financials.netIncome.toLocaleString()}`,
            status: dashboardData.financials.status,
            subtitle: t('dashboard.financials.subtitle'),
            icon: ChartBarIcon,
            color: 'purple',
            path: '/financials'
        },
        {
            title: t('dashboard.transferPricing.title'),
            value: `${dashboardData.transferPricing.compliance}% Complete`,
            status: dashboardData.transferPricing.riskLevel,
            subtitle: t('dashboard.transferPricing.subtitle'),
            icon: CurrencyDollarIcon,
            color: 'orange',
            path: '/transfer-pricing'
        }
    ];
    const getStatusIcon = (status) => {
        switch (status) {
            case 'filed':
            case 'current':
                return _jsx("span", { className: "text-green-500 text-sm", children: "\u2705" });
            case 'pending':
                return _jsx("span", { className: "text-yellow-500 text-sm", children: "\uD83D\uDD04" });
            case 'medium':
                return _jsx("span", { className: "text-orange-500 text-sm", children: "\u26A0\uFE0F" });
            case 'overdue':
                return _jsx("span", { className: "text-red-500 text-sm", children: "\u274C" });
            default:
                return _jsx("span", { className: "text-gray-500 text-sm", children: "\u23F3" });
        }
    };
    const getColorClasses = (color) => {
        const colors = {
            blue: 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30',
            green: 'border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 dark:from-green-900/30 dark:to-green-800/30',
            purple: 'border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30',
            orange: 'border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30'
        };
        return colors[color] || colors.blue;
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white", children: [_jsx("div", { className: "absolute inset-0 opacity-20", children: _jsx("img", { src: "/images/peergos_slide_0.jpeg", alt: "Peergos Dashboard", className: "w-full h-full object-cover" }) }), _jsx("div", { className: "relative px-8 py-12", children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "p-3 bg-white/20 backdrop-blur-sm rounded-xl", children: _jsx(BuildingOfficeIcon, { className: "w-8 h-8 text-white" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-bold text-white", children: t('dashboard.title') }), _jsxs("p", { className: "text-white/90 mt-2 text-lg", children: [t('dashboard.subtitle'), " - UAE FTA Integrated Platform"] })] })] }) }) })] }), _jsx("div", { className: "mb-8", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", {}), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("span", { className: "inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700", children: t('fta.simulation.note') }), _jsx("button", { onClick: () => navigate('/assistant'), className: "inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200", children: t('dashboard.askAssistant') })] })] }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: summaryCards.map((card, index) => {
                        const Icon = card.icon;
                        return (_jsxs("div", { className: `relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${getColorClasses(card.color)}`, onClick: () => navigate(card.path), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx(Icon, { className: "h-6 w-6 text-gray-600 dark:text-gray-400" }), getStatusIcon(card.status)] }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-2", children: card.title }), _jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-1", children: card.value }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: card.subtitle }), _jsx(ArrowRightIcon, { className: "absolute bottom-4 right-4 h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" })] }, index));
                    }) }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white flex items-center", children: ["\uD83D\uDCCA ", t('dashboard.liveFinancials', 'Live Financial Summary'), isUpdating && (_jsx("div", { className: "ml-2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" }))] }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: t('dashboard.liveFinancialsSubtitle', 'Real-time data from your accounting entries') })] }), _jsxs("div", { className: "text-xs text-gray-500 dark:text-gray-400 text-right", children: ["Last updated at ", new Date(summary.lastUpdated).toLocaleTimeString()] })] }) }), _jsx("div", { className: "p-6", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsx("div", { className: "text-center", children: _jsxs("div", { className: "bg-green-50 dark:bg-green-900/20 rounded-lg p-4 relative", children: [_jsx("div", { className: "absolute top-2 right-2", children: _jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200", children: "\uD83D\uDCC8 Revenue" }) }), _jsx(CurrencyDollarIcon, { className: "w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" }), _jsx("p", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: t('financials.totalRevenue', 'Total Revenue') }), _jsxs("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: ["AED ", totalRevenue.toLocaleString()] })] }) }), _jsx("div", { className: "text-center", children: _jsxs("div", { className: "bg-red-50 dark:bg-red-900/20 rounded-lg p-4 relative", children: [_jsx("div", { className: "absolute top-2 right-2", children: _jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200", children: "\uD83D\uDCC9 Expenses" }) }), _jsx(ReceiptPercentIcon, { className: "w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" }), _jsx("p", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: t('financials.totalExpenses', 'Total Expenses') }), _jsxs("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: ["AED ", totalExpenses.toLocaleString()] })] }) }), _jsx("div", { className: "text-center", children: _jsxs("div", { className: `${netIncome >= 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} rounded-lg p-4 relative`, children: [_jsx("div", { className: "absolute top-2 right-2", children: _jsx("span", { className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${netIncome >= 0
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'}`, children: netIncome >= 0 ? '✅ Profit' : '⚠️ Loss' }) }), _jsx(ChartBarIcon, { className: `w-8 h-8 ${netIncome >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'} mx-auto mb-2` }), _jsx("p", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: t('financials.netIncome', 'Net Income') }), _jsxs("p", { className: `text-2xl font-bold ${netIncome >= 0 ? 'text-gray-900 dark:text-white' : 'text-orange-600 dark:text-orange-400'}`, children: ["AED ", netIncome.toLocaleString()] })] }) })] }) })] }), _jsx("div", { className: "mb-8", children: _jsx(FTAComplianceCenter, { trn: "100123456700003", revenue: totalRevenue }) }), _jsx("div", { className: "mb-8", children: _jsx(RealTimeTaxCalculator, {}) }), _jsx("div", { className: "mb-8", children: _jsx(SmartReminders, {}) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6", children: [_jsx("div", { className: "mb-4 flex items-center justify-between", children: _jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white flex items-center", children: ["\uD83D\uDD10 ", t('fta.integration.title')] }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: t('fta.integration.subtitle') })] }) }), _jsxs("div", { className: "space-y-2 mb-4", children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { children: "\u2705 Agent Certificate" }), _jsx("span", { className: "text-green-600 font-medium", children: "Uploaded" })] }), _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { children: "\u274C Real-Time Sync" }), _jsx("span", { className: "text-yellow-600 font-medium", children: "Pending" })] }), _jsx("div", { className: "px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg", children: _jsxs("p", { className: "text-xs text-yellow-800 dark:text-yellow-200", children: [_jsx("strong", { children: "\u26A0\uFE0F Status:" }), " Demo Mode \u2013 Simulation Active"] }) })] }), _jsx(FTAIntegrationStatus, { trn: "100123456700003", variant: "card", showDetails: false })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-200 dark:border-red-700 p-6", children: [_jsxs("div", { className: "mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-red-700 dark:text-red-400 flex items-center", children: "\uD83D\uDCE3 FTA Alerts" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: "System setup notifications" })] }), _jsxs("div", { className: "space-y-3", children: [setupIncomplete && (_jsxs("div", { className: "flex items-start justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg group", children: [_jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("span", { className: "text-orange-500", children: "\u2757" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-orange-800 dark:text-orange-200", children: "Setup incomplete" }), _jsx("p", { className: "text-xs text-orange-600 dark:text-orange-300", children: "Complete initial configuration" })] })] }), _jsx("button", { className: "opacity-0 group-hover:opacity-100 text-orange-400 hover:text-orange-600 text-xs", onClick: () => navigate('/setup'), children: "\u2715" })] })), _jsxs("div", { className: "flex items-start justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg group", children: [_jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("span", { className: "text-red-500", children: "\u2757" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-red-800 dark:text-red-200", children: "TRN not entered" }), _jsx("p", { className: "text-xs text-red-600 dark:text-red-300", children: "Required for tax submissions" })] })] }), _jsx("button", { className: "opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 text-xs", onClick: () => { }, children: "\u2715" })] }), _jsxs("div", { className: "flex items-start justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg group", children: [_jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("span", { className: "text-yellow-500", children: "\u2757" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-yellow-800 dark:text-yellow-200", children: "Bank slip missing" }), _jsx("p", { className: "text-xs text-yellow-600 dark:text-yellow-300", children: "Upload payment confirmation" })] })] }), _jsx("button", { className: "opacity-0 group-hover:opacity-100 text-yellow-400 hover:text-yellow-600 text-xs", onClick: () => { }, children: "\u2715" })] })] })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6", children: [_jsxs("div", { className: "mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: t('trn.lookup.title') }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: t('trn.lookup.subtitle') })] }), _jsx(TRNLookup, { variant: "embedded" })] }), _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6", children: _jsx(POSIntegrationStatus, {}) })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: t('dashboard.quickActions') }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Streamlined UAE tax workflows" })] }), _jsx("img", { src: "/images/peergos_slide_5.jpeg", alt: "Tax Workflow", className: "w-20 h-16 object-contain rounded-lg opacity-70" })] }), _jsx("div", { className: "p-6", children: _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("button", { onClick: () => navigate('/vat'), className: "flex items-center justify-center space-x-2 px-6 py-4 bg-green-50 hover:bg-green-100 border border-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:border-green-700 rounded-lg text-green-800 dark:text-green-200 font-medium transition-colors duration-200", children: [_jsx("span", { children: "\uD83D\uDCC4" }), _jsx("span", { children: "File VAT Return" })] }), _jsxs("button", { onClick: () => navigate('/corporate-tax'), className: "flex items-center justify-center space-x-2 px-6 py-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:border-blue-700 rounded-lg text-blue-800 dark:text-blue-200 font-medium transition-colors duration-200", children: [_jsx("span", { children: "\uD83E\uDDEE" }), _jsx("span", { children: "Calculate CIT" })] }), _jsxs("button", { onClick: () => navigate('/financials'), className: "flex items-center justify-center space-x-2 px-6 py-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 dark:border-purple-700 rounded-lg text-purple-800 dark:text-purple-200 font-medium transition-colors duration-200", children: [_jsx("span", { children: "\uD83D\uDCCA" }), _jsx("span", { children: "View Financials" })] }), _jsxs("button", { onClick: () => navigate('/filing'), className: "flex items-center justify-center space-x-2 px-6 py-4 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30 dark:border-yellow-700 rounded-lg text-yellow-800 dark:text-yellow-200 font-medium transition-colors duration-200", children: [_jsx("span", { children: "\uD83D\uDCC1" }), _jsx("span", { children: "Upload Agent Certificate" })] }), _jsxs("button", { onClick: () => navigate('/transfer-pricing'), className: "flex items-center justify-center space-x-2 px-6 py-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 dark:border-purple-700 rounded-lg text-purple-800 dark:text-purple-200 font-medium transition-colors duration-200", children: [_jsx("span", { children: "\uD83E\uDDFE" }), _jsx("span", { children: "Transfer Pricing \u2013 75% Complete" })] })] }) })] })] }) }));
};
export default Dashboard;
