import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Button, Alert, Snackbar, Select, MenuItem, FormControl, InputLabel, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ArrowDownTrayIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useSettings } from '../context/SettingsContext';
import { exportToPDF, exportToZIP } from '../utils/fileUtils';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip as ChartTooltip, Legend, ArcElement, } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, ChartTooltip, Legend, ArcElement);
const Financials = () => {
    const { t } = useTranslation();
    const { formatCurrency } = useSettings();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('2024-Q2');
    const [comparisonPeriod, setComparisonPeriod] = useState('2024-Q1');
    const [viewMode, setViewMode] = useState('overview');
    // Sample data - replace with actual data from API
    const [statements] = useState([
        {
            period: '2024-Q1',
            metrics: {
                revenue: 5000000,
                expenses: 3500000,
                profit: 1500000,
                assets: 10000000,
                liabilities: 4000000,
                equity: 6000000,
                operatingMargin: 0.3,
                currentRatio: 2.5,
                debtToEquity: 0.67,
                returnOnEquity: 0.25,
            },
        },
        {
            period: '2024-Q2',
            metrics: {
                revenue: 5500000,
                expenses: 3800000,
                profit: 1700000,
                assets: 10500000,
                liabilities: 4200000,
                equity: 6300000,
                operatingMargin: 0.31,
                currentRatio: 2.6,
                debtToEquity: 0.67,
                returnOnEquity: 0.27,
                previousPeriodMetrics: {
                    revenue: 5000000,
                    expenses: 3500000,
                    profit: 1500000,
                    assets: 10000000,
                    liabilities: 4000000,
                    equity: 6000000,
                    operatingMargin: 0.3,
                    currentRatio: 2.5,
                    debtToEquity: 0.67,
                    returnOnEquity: 0.25,
                },
            },
        },
    ]);
    const currentStatement = statements.find(s => s.period === selectedPeriod);
    const comparisonStatement = statements.find(s => s.period === comparisonPeriod);
    const calculateChange = (current, previous) => {
        return ((current - previous) / previous) * 100;
    };
    const formatChange = (change) => {
        const isPositive = change >= 0;
        return (_jsxs(Typography, { variant: "body2", className: `flex items-center ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`, children: [isPositive ? (_jsx(ArrowTrendingUpIcon, { className: "h-4 w-4 mr-1" })) : (_jsx(ArrowTrendingDownIcon, { className: "h-4 w-4 mr-1" })), Math.abs(change).toFixed(1), "%"] }));
    };
    const handleExport = async () => {
        try {
            // Export individual PDFs for each statement
            const pdfPromises = statements.map(statement => exportToPDF(statement, `financial-statement-${statement.period}`));
            await Promise.all(pdfPromises);
            // Create ZIP with all PDFs
            const files = statements.map(statement => ({
                name: `financial-statement-${statement.period}.pdf`,
                content: JSON.stringify(statement)
            }));
            await exportToZIP(files);
            setSuccess(t('financials.export.success', 'Financial statements exported successfully'));
        }
        catch (err) {
            setError(t('financials.export.error', 'Error exporting financial statements'));
        }
    };
    // Chart data
    const revenueData = {
        labels: statements.map(s => s.period),
        datasets: [
            {
                label: t('financials.charts.revenue', 'Revenue'),
                data: statements.map(s => s.metrics.revenue),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };
    const profitData = {
        labels: statements.map(s => s.period),
        datasets: [
            {
                label: t('financials.charts.profit', 'Profit'),
                data: statements.map(s => s.metrics.profit),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
        ],
    };
    const balanceSheetData = {
        labels: [t('financials.charts.assets', 'Assets'), t('financials.charts.liabilities', 'Liabilities'), t('financials.charts.equity', 'Equity')],
        datasets: [
            {
                data: [
                    currentStatement?.metrics.assets || 0,
                    currentStatement?.metrics.liabilities || 0,
                    currentStatement?.metrics.equity || 0,
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                ],
            },
        ],
    };
    return (_jsxs(Box, { children: [_jsxs(Paper, { elevation: 0, className: "p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm", children: [_jsxs(Box, { className: "flex justify-between items-center mb-6", children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "h4", className: "text-gray-900 dark:text-white mb-2", children: t('financials.title') }), _jsx(Typography, { variant: "body1", className: "text-gray-600 dark:text-gray-400", children: t('financials.subtitle') })] }), _jsxs(Box, { className: "flex gap-4", children: [_jsxs(FormControl, { size: "small", children: [_jsx(InputLabel, { children: t('financials.period', 'Period') }), _jsx(Select, { value: selectedPeriod, onChange: (e) => setSelectedPeriod(e.target.value), label: t('financials.period', 'Period'), className: "min-w-[120px]", children: statements.map((statement) => (_jsx(MenuItem, { value: statement.period, children: statement.period }, statement.period))) })] }), _jsxs(FormControl, { size: "small", children: [_jsx(InputLabel, { children: t('financials.compare', 'Compare with') }), _jsx(Select, { value: comparisonPeriod, onChange: (e) => setComparisonPeriod(e.target.value), label: t('financials.compare', 'Compare with'), className: "min-w-[120px]", children: statements.map((statement) => (_jsx(MenuItem, { value: statement.period, children: statement.period }, statement.period))) })] }), _jsx(Button, { variant: "outlined", startIcon: _jsx(ArrowDownTrayIcon, { className: "h-5 w-5" }), onClick: handleExport, className: "border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-900/50", children: t('financials.export.button', 'Export Statements') })] })] }), _jsxs(Grid, { container: true, spacing: 3, className: "mb-6", children: [_jsx(Grid, { item: true, xs: 12, md: 3, children: _jsx(Card, { className: "bg-gray-50 dark:bg-gray-700", children: _jsxs(CardContent, { children: [_jsxs(Box, { className: "flex justify-between items-start", children: [_jsx(Typography, { variant: "h6", className: "text-gray-900 dark:text-white mb-2", children: t('financials.metrics.revenue', 'Revenue') }), _jsx(Tooltip, { title: t('financials.metrics.revenueTooltip', 'Total revenue for the selected period'), children: _jsx(IconButton, { size: "small", children: _jsx(InformationCircleIcon, { className: "h-4 w-4 text-gray-500" }) }) })] }), _jsx(Typography, { variant: "h4", className: "text-indigo-600 dark:text-indigo-400", children: formatCurrency(currentStatement?.metrics.revenue || 0) }), currentStatement?.metrics.previousPeriodMetrics && (formatChange(calculateChange(currentStatement.metrics.revenue, currentStatement.metrics.previousPeriodMetrics.revenue)))] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 3, children: _jsx(Card, { className: "bg-gray-50 dark:bg-gray-700", children: _jsxs(CardContent, { children: [_jsxs(Box, { className: "flex justify-between items-start", children: [_jsx(Typography, { variant: "h6", className: "text-gray-900 dark:text-white mb-2", children: t('financials.metrics.profit', 'Profit') }), _jsx(Tooltip, { title: t('financials.metrics.profitTooltip', 'Net profit for the selected period'), children: _jsx(IconButton, { size: "small", children: _jsx(InformationCircleIcon, { className: "h-4 w-4 text-gray-500" }) }) })] }), _jsx(Typography, { variant: "h4", className: "text-green-600 dark:text-green-400", children: formatCurrency(currentStatement?.metrics.profit || 0) }), currentStatement?.metrics.previousPeriodMetrics && (formatChange(calculateChange(currentStatement.metrics.profit, currentStatement.metrics.previousPeriodMetrics.profit)))] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 3, children: _jsx(Card, { className: "bg-gray-50 dark:bg-gray-700", children: _jsxs(CardContent, { children: [_jsxs(Box, { className: "flex justify-between items-start", children: [_jsx(Typography, { variant: "h6", className: "text-gray-900 dark:text-white mb-2", children: t('financials.metrics.operatingMargin', 'Operating Margin') }), _jsx(Tooltip, { title: t('financials.metrics.operatingMarginTooltip', 'Operating profit as a percentage of revenue'), children: _jsx(IconButton, { size: "small", children: _jsx(InformationCircleIcon, { className: "h-4 w-4 text-gray-500" }) }) })] }), _jsxs(Typography, { variant: "h4", className: "text-blue-600 dark:text-blue-400", children: [(currentStatement?.metrics.operatingMargin || 0).toFixed(1), "%"] }), currentStatement?.metrics.previousPeriodMetrics && (formatChange(calculateChange(currentStatement.metrics.operatingMargin, currentStatement.metrics.previousPeriodMetrics.operatingMargin)))] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 3, children: _jsx(Card, { className: "bg-gray-50 dark:bg-gray-700", children: _jsxs(CardContent, { children: [_jsxs(Box, { className: "flex justify-between items-start", children: [_jsx(Typography, { variant: "h6", className: "text-gray-900 dark:text-white mb-2", children: t('financials.metrics.returnOnEquity', 'ROE') }), _jsx(Tooltip, { title: t('financials.metrics.returnOnEquityTooltip', 'Return on Equity - Net income as a percentage of shareholders\' equity'), children: _jsx(IconButton, { size: "small", children: _jsx(InformationCircleIcon, { className: "h-4 w-4 text-gray-500" }) }) })] }), _jsxs(Typography, { variant: "h4", className: "text-purple-600 dark:text-purple-400", children: [(currentStatement?.metrics.returnOnEquity || 0).toFixed(1), "%"] }), currentStatement?.metrics.previousPeriodMetrics && (formatChange(calculateChange(currentStatement.metrics.returnOnEquity, currentStatement.metrics.previousPeriodMetrics.returnOnEquity)))] }) }) })] }), _jsxs(Grid, { container: true, spacing: 3, className: "mb-6", children: [_jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", className: "text-gray-900 dark:text-white mb-4", children: t('financials.ratios.currentRatio', 'Current Ratio') }), _jsx(Typography, { variant: "h3", className: "text-indigo-600 dark:text-indigo-400", children: (currentStatement?.metrics.currentRatio || 0).toFixed(2) }), _jsx(Typography, { variant: "body2", className: "text-gray-600 dark:text-gray-400 mt-2", children: t('financials.ratios.currentRatioDesc', 'Measures ability to pay short-term obligations') })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", className: "text-gray-900 dark:text-white mb-4", children: t('financials.ratios.debtToEquity', 'Debt to Equity') }), _jsx(Typography, { variant: "h3", className: "text-indigo-600 dark:text-indigo-400", children: (currentStatement?.metrics.debtToEquity || 0).toFixed(2) }), _jsx(Typography, { variant: "body2", className: "text-gray-600 dark:text-gray-400 mt-2", children: t('financials.ratios.debtToEquityDesc', 'Measures financial leverage') })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", className: "text-gray-900 dark:text-white mb-4", children: t('financials.ratios.operatingMargin', 'Operating Margin') }), _jsxs(Typography, { variant: "h3", className: "text-indigo-600 dark:text-indigo-400", children: [(currentStatement?.metrics.operatingMargin || 0).toFixed(1), "%"] }), _jsx(Typography, { variant: "body2", className: "text-gray-600 dark:text-gray-400 mt-2", children: t('financials.ratios.operatingMarginDesc', 'Measures operational efficiency') })] }) }) })] }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 8, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", className: "text-gray-900 dark:text-white mb-4", children: t('financials.charts.revenueTrend', 'Revenue Trend') }), _jsx(Line, { data: revenueData, options: {
                                                    responsive: true,
                                                    plugins: {
                                                        legend: {
                                                            position: 'top',
                                                        },
                                                        tooltip: {
                                                            callbacks: {
                                                                label: (context) => formatCurrency(context.parsed.y)
                                                            }
                                                        }
                                                    },
                                                    scales: {
                                                        y: {
                                                            ticks: {
                                                                callback: (value) => formatCurrency(value)
                                                            }
                                                        }
                                                    }
                                                } })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", className: "text-gray-900 dark:text-white mb-4", children: t('financials.charts.balanceSheet', 'Balance Sheet') }), _jsx(Pie, { data: balanceSheetData, options: {
                                                    responsive: true,
                                                    plugins: {
                                                        legend: {
                                                            position: 'bottom',
                                                        },
                                                        tooltip: {
                                                            callbacks: {
                                                                label: (context) => formatCurrency(context.parsed)
                                                            }
                                                        }
                                                    }
                                                } })] }) }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", className: "text-gray-900 dark:text-white mb-4", children: t('financials.charts.profitTrend', 'Profit Trend') }), _jsx(Bar, { data: profitData, options: {
                                                    responsive: true,
                                                    plugins: {
                                                        legend: {
                                                            position: 'top',
                                                        },
                                                        tooltip: {
                                                            callbacks: {
                                                                label: (context) => formatCurrency(context.parsed.y)
                                                            }
                                                        }
                                                    },
                                                    scales: {
                                                        y: {
                                                            ticks: {
                                                                callback: (value) => formatCurrency(value)
                                                            }
                                                        }
                                                    }
                                                } })] }) }) })] })] }), _jsx(Snackbar, { open: !!error, autoHideDuration: 6000, onClose: () => setError(null), anchorOrigin: { vertical: 'bottom', horizontal: 'right' }, children: _jsx(Alert, { severity: "error", onClose: () => setError(null), children: error }) }), _jsx(Snackbar, { open: !!success, autoHideDuration: 6000, onClose: () => setSuccess(null), anchorOrigin: { vertical: 'bottom', horizontal: 'right' }, children: _jsx(Alert, { severity: "success", onClose: () => setSuccess(null), children: success }) })] }));
};
export default Financials;
