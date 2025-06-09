import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, ServerIcon, CloudIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/react/24/outline';
const SystemHealthMonitor = ({ variant = 'full' }) => {
    const { t } = useTranslation();
    const [healthMetrics, setHealthMetrics] = useState([]);
    const [overallStatus, setOverallStatus] = useState('healthy');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const checkSystemHealth = async () => {
        setIsRefreshing(true);
        // Simulate health checks
        setTimeout(() => {
            const metrics = [
                {
                    id: 'fta-connection',
                    name: 'FTA API Connection',
                    status: 'healthy',
                    value: '200ms',
                    description: 'Connection to FTA services is stable',
                    lastChecked: new Date().toISOString(),
                    uptime: 99.9
                },
                {
                    id: 'database',
                    name: 'Database Performance',
                    status: 'healthy',
                    value: '< 100ms',
                    description: 'Database queries executing normally',
                    lastChecked: new Date().toISOString(),
                    uptime: 99.8
                },
                {
                    id: 'encryption',
                    name: 'Data Encryption',
                    status: 'healthy',
                    value: 'AES-256',
                    description: 'All sensitive data properly encrypted',
                    lastChecked: new Date().toISOString()
                },
                {
                    id: 'backup',
                    name: 'Data Backup Status',
                    status: 'healthy',
                    value: '2 hours ago',
                    description: 'Latest backup completed successfully',
                    lastChecked: new Date().toISOString()
                },
                {
                    id: 'ssl',
                    name: 'SSL Certificate',
                    status: 'healthy',
                    value: '364 days left',
                    description: 'SSL certificate is valid and active',
                    lastChecked: new Date().toISOString()
                },
                {
                    id: 'compliance',
                    name: 'Compliance Checks',
                    status: 'warning',
                    value: '2 pending',
                    description: 'Minor compliance items require attention',
                    lastChecked: new Date().toISOString()
                },
                {
                    id: 'storage',
                    name: 'Storage Usage',
                    status: 'warning',
                    value: '78% used',
                    description: 'Storage usage approaching threshold',
                    lastChecked: new Date().toISOString()
                },
                {
                    id: 'api-rate',
                    name: 'API Rate Limits',
                    status: 'healthy',
                    value: '45/1000',
                    description: 'API usage within normal limits',
                    lastChecked: new Date().toISOString()
                }
            ];
            setHealthMetrics(metrics);
            // Calculate overall status
            const errorCount = metrics.filter(m => m.status === 'error').length;
            const warningCount = metrics.filter(m => m.status === 'warning').length;
            if (errorCount > 0) {
                setOverallStatus('error');
            }
            else if (warningCount > 0) {
                setOverallStatus('warning');
            }
            else {
                setOverallStatus('healthy');
            }
            setIsRefreshing(false);
        }, 1500);
    };
    useEffect(() => {
        checkSystemHealth();
        // Set up auto-refresh every 5 minutes
        const interval = setInterval(checkSystemHealth, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);
    const getStatusIcon = (status) => {
        switch (status) {
            case 'healthy':
                return _jsx(CheckCircleIcon, { className: "w-5 h-5 text-green-500" });
            case 'warning':
                return _jsx(ExclamationTriangleIcon, { className: "w-5 h-5 text-yellow-500" });
            case 'error':
                return _jsx(XCircleIcon, { className: "w-5 h-5 text-red-500" });
            default:
                return _jsx(ClockIcon, { className: "w-5 h-5 text-gray-500" });
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'healthy':
                return 'border-green-200 bg-green-50';
            case 'warning':
                return 'border-yellow-200 bg-yellow-50';
            case 'error':
                return 'border-red-200 bg-red-50';
            default:
                return 'border-gray-200 bg-gray-50';
        }
    };
    const getOverallStatusColor = () => {
        switch (overallStatus) {
            case 'healthy':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'error':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
    if (variant === 'compact') {
        return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white", children: "System Health" }), _jsx("div", { className: `px-3 py-1 rounded-full text-sm font-medium border ${getOverallStatusColor()}`, children: overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1) })] }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: healthMetrics.slice(0, 4).map((metric) => (_jsxs("div", { className: "flex items-center space-x-2 text-sm", children: [getStatusIcon(metric.status), _jsx("span", { className: "text-gray-600 dark:text-gray-400 truncate", children: metric.name })] }, metric.id))) }), _jsx("button", { onClick: () => window.location.href = '/admin?tab=health', className: "mt-3 w-full text-center text-blue-600 hover:text-blue-700 text-sm", children: "View Detailed Health Report" })] }));
    }
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg", children: _jsx(ServerIcon, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "System Health Monitor" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Real-time monitoring of critical system components" })] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("div", { className: `px-4 py-2 rounded-full text-sm font-medium border ${getOverallStatusColor()}`, children: ["Overall Status: ", overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1)] }), _jsx("button", { onClick: checkSystemHealth, disabled: isRefreshing, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors", children: isRefreshing ? 'Checking...' : 'Refresh' })] })] }) }), _jsxs("div", { className: "p-6", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: healthMetrics.map((metric) => (_jsxs("div", { className: `p-4 rounded-lg border-2 ${getStatusColor(metric.status)}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [getStatusIcon(metric.status), _jsx("h4", { className: "font-medium text-gray-900 dark:text-white", children: metric.name })] }), _jsx("span", { className: "text-lg font-bold text-gray-900 dark:text-white", children: metric.value })] }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-2", children: metric.description }), _jsxs("div", { className: "flex items-center justify-between text-xs text-gray-500", children: [_jsxs("span", { children: ["Last checked: ", new Date(metric.lastChecked).toLocaleTimeString()] }), metric.uptime && (_jsxs("span", { children: ["Uptime: ", metric.uptime, "%"] }))] })] }, metric.id))) }), _jsxs("div", { className: "mt-6 grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx(CloudIcon, { className: "w-5 h-5 text-blue-500" }), _jsx("h5", { className: "font-medium text-gray-900 dark:text-white", children: "Cloud Infrastructure" })] }), _jsxs("div", { className: "text-sm text-gray-600 dark:text-gray-400 space-y-1", children: [_jsx("p", { children: "Region: UAE North (Dubai)" }), _jsx("p", { children: "Provider: AWS" }), _jsx("p", { children: "Instance: t3.medium" })] })] }), _jsxs("div", { className: "bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx(ShieldCheckIcon, { className: "w-5 h-5 text-green-500" }), _jsx("h5", { className: "font-medium text-gray-900 dark:text-white", children: "Security Status" })] }), _jsxs("div", { className: "text-sm text-gray-600 dark:text-gray-400 space-y-1", children: [_jsx("p", { children: "Firewall: Active" }), _jsx("p", { children: "DDoS Protection: Enabled" }), _jsx("p", { children: "Last Security Scan: 2 hours ago" })] })] }), _jsxs("div", { className: "bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx(ClockIcon, { className: "w-5 h-5 text-purple-500" }), _jsx("h5", { className: "font-medium text-gray-900 dark:text-white", children: "Performance Metrics" })] }), _jsxs("div", { className: "text-sm text-gray-600 dark:text-gray-400 space-y-1", children: [_jsx("p", { children: "Avg Response Time: 245ms" }), _jsx("p", { children: "CPU Usage: 23%" }), _jsx("p", { children: "Memory Usage: 67%" })] })] })] }), _jsxs("div", { className: "mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4", children: [_jsx("h5", { className: "font-medium text-blue-800 dark:text-blue-200 mb-2", children: "System Recommendations" }), _jsxs("ul", { className: "text-sm text-blue-700 dark:text-blue-300 space-y-1", children: [_jsx("li", { children: "\u2022 Consider upgrading storage capacity within 30 days" }), _jsx("li", { children: "\u2022 Review and address pending compliance items" }), _jsx("li", { children: "\u2022 Schedule regular security scans for enhanced protection" })] })] })] })] }));
};
export default SystemHealthMonitor;
