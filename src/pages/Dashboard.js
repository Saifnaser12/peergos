import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState, useMemo } from 'react';
import { useTax, calculateCIT } from '../context/TaxContext';
import { useAudit } from '../context/AuditContext';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, RadialBarChart, RadialBar, PieChart, Pie, Cell } from 'recharts';
import { generatePDFReport, generateExcelReport, calculateDetailedComplianceScore } from '../utils/reports';
import SubmissionModal from '../components/SubmissionModal';
import SuccessAlert from '../components/SuccessAlert';
import { submitToFTA } from '../utils/submission';
import { BanknotesIcon, ReceiptPercentIcon, BuildingOfficeIcon, ArrowTrendingUpIcon, DocumentChartBarIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { PageHeader } from '../components/Card';
import RelatedPartySection from '../components/RelatedPartySection';
import PermissionGate from '../components/PermissionGate';
import AlertBanner from '../components/AlertBanner';
import Button from '../components/Button';
import { format } from 'date-fns';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
export const Dashboard = () => {
    const { state } = useTax();
    const { log } = useAudit();
    const navigate = useNavigate();
    const [searchResult, setSearchResult] = useState(null);
    const [selectedChartView, setSelectedChartView] = useState('line');
    const [complianceBreakdown, setComplianceBreakdown] = useState([]);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(null);
    const [revenueChartType, setRevenueChartType] = useState('line');
    const [expenseChartType, setExpenseChartType] = useState('bar');
    const revenueChartRef = useRef(null);
    const expenseChartRef = useRef(null);
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [exportStarted, setExportStarted] = useState(false);
    const [searchTRN, setSearchTRN] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('2024-Q1');
    // Calculate VAT and CIT
    const vatDue = useMemo(() => {
        // VAT calculation logic
        return state.revenue.reduce((acc, rev) => acc + rev.amount * 0.05, 0);
    }, [state.revenue]);
    const citDue = useMemo(() => {
        const totalRevenue = state.revenue.reduce((acc, rev) => acc + rev.amount, 0);
        return calculateCIT(totalRevenue);
    }, [state.revenue]);
    const complianceScore = useMemo(() => {
        return 85; // Default compliance score
    }, []);
    // Calculate summary metrics
    const totalRevenue = state.revenue.reduce((sum, entry) => sum + entry.amount, 0);
    const totalExpenses = state.expenses.reduce((sum, entry) => sum + entry.amount, 0);
    const netIncome = totalRevenue - totalExpenses;
    const totalVAT = state.revenue.reduce((sum, entry) => sum + entry.vatAmount, 0);
    const citAmount = calculateCIT(netIncome);
    // Prepare monthly revenue data
    const monthlyData = useMemo(() => {
        const monthlyMap = new Map();
        state.revenue.forEach((entry) => {
            const date = new Date(entry.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + entry.amount);
        });
        return Array.from(monthlyMap.entries())
            .map(([month, amount]) => ({ month, amount }))
            .sort((a, b) => a.month.localeCompare(b.month));
    }, [state.revenue]);
    // Prepare expense categories data
    const expenseData = useMemo(() => {
        const categoryMap = new Map();
        state.expenses.forEach((entry) => {
            categoryMap.set(entry.category, (categoryMap.get(entry.category) || 0) + entry.amount);
        });
        return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
    }, [state.expenses]);
    // Alert conditions
    const taxRegistrationAlerts = useMemo(() => {
        const alerts = [];
        const totalRevenue = state.revenue.reduce((sum, entry) => sum + entry.amount, 0);
        if (totalRevenue > 375000 && !state.profile?.vatRegistered) {
            alerts.push({
                type: 'warning',
                title: 'VAT Registration Required',
                message: 'Your revenue exceeds AED 375,000. VAT registration is mandatory.',
                action: {
                    label: 'Register for VAT',
                    onClick: () => window.open('https://www.tax.gov.ae/vat', '_blank')
                }
            });
        }
        if (totalRevenue > 3000000 && !state.profile?.citRegistered) {
            alerts.push({
                type: 'error',
                title: 'Corporate Tax Registration Required',
                message: 'Your revenue exceeds AED 3,000,000. Corporate Tax registration is mandatory.',
                action: {
                    label: 'Register for CIT',
                    onClick: () => window.open('https://www.tax.gov.ae/ct', '_blank')
                }
            });
        }
        return alerts;
    }, [state.revenue, state.profile]);
    // Validate TRN
    const validateTRN = (trn) => {
        if (!trn)
            return { isValid: false, message: 'TRN is required' };
        if (!/^\d+$/.test(trn))
            return { isValid: false, message: 'TRN must contain only digits' };
        if (trn.length !== 15)
            return { isValid: false, message: 'TRN must be exactly 15 digits' };
        // Checksum validation (example - adjust according to actual TRN format)
        const sum = trn.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
        if (sum % 7 !== 0)
            return { isValid: false, message: 'Invalid TRN checksum' };
        return { isValid: true, message: '' };
    };
    const handleSearch = (searchTRN) => {
        const validation = validateTRN(searchTRN);
        if (!validation.isValid) {
            return;
        }
        // Get all company profiles from localStorage
        const storedData = localStorage.getItem('taxState');
        if (!storedData) {
            return;
        }
        try {
            const allData = JSON.parse(storedData);
            if (!allData.profile || allData.profile.trnNumber !== searchTRN) {
                return;
            }
            // Calculate monthly trends
            const monthlyTrend = Array.from({ length: 12 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const monthKey = date.toISOString().slice(0, 7);
                const revenue = allData.revenue
                    .filter((r) => r.date.startsWith(monthKey))
                    .reduce((sum, r) => sum + r.amount, 0);
                const expenses = allData.expenses
                    .filter((e) => e.date.startsWith(monthKey))
                    .reduce((sum, e) => sum + e.amount, 0);
                return {
                    month: new Date(monthKey).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
                    revenue,
                    expenses
                };
            }).reverse();
            const complianceDetails = calculateDetailedComplianceScore(allData);
            setComplianceBreakdown(complianceDetails.breakdown);
            setSearchResult({
                name: allData.profile.companyName,
                trn: allData.profile.trnNumber,
                status: allData.profile.licenseType,
                monthlyTrend: monthlyTrend
            });
        }
        catch (err) {
            console.error('Error processing company data');
        }
    };
    const handleExport = async (type) => {
        try {
            setExportStarted(true);
            const reportData = {
                revenue: state.revenue,
                revenues: state.revenue,
                expenses: state.expenses,
                profile: state.profile,
                vatDue: state.revenue.reduce((sum, r) => sum + (r.vatAmount || 0), 0),
                citDue: state.revenue.reduce((sum, r) => sum + (r.amount * 0.09), 0),
                complianceScore: calculateDetailedComplianceScore(state).score
            };
            if (type === 'pdf') {
                await generatePDFReport(reportData);
            }
            else {
                await generateExcelReport(reportData);
            }
        }
        catch (error) {
            console.error('Export failed:', error);
        }
        finally {
            setExportStarted(false);
        }
    };
    const handleScheduleAudit = () => {
        // In a real implementation, this would integrate with a calendar API
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        alert(`Audit scheduled for ${nextMonth.toLocaleDateString()}`);
    };
    const handleSubmitToFTA = async () => {
        if (!searchResult)
            return;
        setIsSubmitting(true);
        try {
            const submissionData = {
                trn: searchResult.trn,
                timestamp: new Date().toISOString(),
                referenceNumber: '',
                data: {
                    revenue: state.revenue,
                    revenues: state.revenue,
                    expenses: state.expenses,
                    vatDue: vatDue,
                    citDue: citDue,
                    complianceScore: calculateDetailedComplianceScore(state).score
                }
            };
            const referenceNumber = await submitToFTA(submissionData);
            // Log successful submission
            log('SUBMIT_FILING', {
                trn: searchResult.trn,
                referenceNumber,
                vatDue: vatDue,
                citDue: citDue
            });
            setSubmissionSuccess({
                message: 'Tax report submitted successfully to FTA.',
                referenceNumber
            });
        }
        catch (error) {
            console.error('Submission failed:', error);
        }
        finally {
            setIsSubmitting(false);
            setIsSubmitModalOpen(false);
        }
    };
    const renderComplianceChart = () => {
        if (!complianceBreakdown.length)
            return null;
        return (_jsx("div", { className: "h-64", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(RadialBarChart, { cx: "50%", cy: "50%", innerRadius: "30%", outerRadius: "100%", data: complianceBreakdown, startAngle: 180, endAngle: 0, children: [_jsx(RadialBar, { background: true, dataKey: "score", cornerRadius: 10, label: { position: 'insideStart', fill: '#fff' } }), _jsx(Legend, { iconSize: 10, layout: "vertical", verticalAlign: "middle", align: "right" }), _jsx(Tooltip, { formatter: (value, name) => [`${value}/${name === 'score' ? 'maxScore' : ''}`, name] })] }) }) }));
    };
    const renderTrendChart = () => {
        if (!searchResult?.monthlyTrend)
            return null;
        return (_jsxs("div", { className: "h-64", children: [_jsx("div", { className: "flex justify-end mb-4", children: _jsxs("div", { className: "inline-flex rounded-md shadow-sm", role: "group", children: [_jsx("button", { type: "button", onClick: () => setSelectedChartView('line'), className: `px-4 py-2 text-sm font-medium ${selectedChartView === 'line'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-200 rounded-l-lg`, children: "Line" }), _jsx("button", { type: "button", onClick: () => setSelectedChartView('bar'), className: `px-4 py-2 text-sm font-medium ${selectedChartView === 'bar'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-200 rounded-r-lg`, children: "Bar" })] }) }), _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: selectedChartView === 'line' ? (_jsxs(LineChart, { data: searchResult.monthlyTrend, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "month" }), _jsx(YAxis, {}), _jsx(Tooltip, { formatter: (value) => `AED ${value.toLocaleString()}` }), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "revenue", stroke: "#8884d8", name: "Revenue", strokeWidth: 2, dot: { r: 4 }, activeDot: { r: 6 } }), _jsx(Line, { type: "monotone", dataKey: "expenses", stroke: "#82ca9d", name: "Expenses", strokeWidth: 2, dot: { r: 4 }, activeDot: { r: 6 } })] })) : (_jsxs(BarChart, { data: searchResult.monthlyTrend, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "month" }), _jsx(YAxis, {}), _jsx(Tooltip, { formatter: (value) => `AED ${value.toLocaleString()}` }), _jsx(Legend, {}), _jsx(Bar, { dataKey: "revenue", fill: "#8884d8", name: "Revenue" }), _jsx(Bar, { dataKey: "expenses", fill: "#82ca9d", name: "Expenses" })] })) })] }));
    };
    const renderChart = (type, data, dataKeys) => {
        const commonProps = {
            data,
            margin: { top: 5, right: 30, left: 20, bottom: 5 }
        };
        if (type === 'line') {
            return (_jsxs(LineChart, { ...commonProps, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), dataKeys.map(({ key, color }) => (_jsx(Line, { type: "monotone", dataKey: key, stroke: color, activeDot: { r: 8 } }, key)))] }));
        }
        return (_jsxs(BarChart, { ...commonProps, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), dataKeys.map(({ key, color }) => (_jsx(Bar, { dataKey: key, fill: color }, key)))] }));
    };
    // Check for missing setup information
    const setupMissing = useMemo(() => {
        if (!state.profile)
            return true;
        return !state.profile.trnNumber || !state.profile.licenseType;
    }, [state.profile]);
    // Check for missing filings
    const missingFilings = useMemo(() => {
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthStr = lastMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
        // Check if there are any revenues or expenses in the last month
        const hasLastMonthEntries = [...state.revenue, ...state.expenses].some(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getMonth() === lastMonth.getMonth() &&
                entryDate.getFullYear() === lastMonth.getFullYear();
        });
        return hasLastMonthEntries ? null : lastMonthStr;
    }, [state.revenue, state.expenses]);
    // Check for incomplete profile information
    const incompleteProfile = useMemo(() => {
        if (!state.profile)
            return [];
        const missing = [];
        if (!state.profile.email)
            missing.push('Email');
        if (!state.profile.phone)
            missing.push('Phone');
        if (!state.profile.address)
            missing.push('Address');
        if (!state.profile.businessActivity)
            missing.push('Business Activity');
        return missing;
    }, [state.profile]);
    const filteredData = useMemo(() => {
        if (!dateRange.startDate || !dateRange.endDate) {
            return state;
        }
        return {
            revenue: state.revenue.filter(r => r.date >= dateRange.startDate && r.date <= dateRange.endDate),
            expenses: state.expenses.filter(e => e.date >= dateRange.startDate && e.date <= dateRange.endDate)
        };
    }, [state, dateRange]);
    const metrics = useMemo(() => {
        const totalRevenue = filteredData.revenue.reduce((sum, r) => sum + r.amount, 0);
        const totalExpenses = filteredData.expenses.reduce((sum, e) => sum + e.amount, 0);
        const totalVAT = filteredData.revenue.reduce((sum, r) => sum + (r.vatAmount || 0), 0);
        return {
            totalRevenue,
            totalExpenses,
            totalVAT,
            netIncome: totalRevenue - totalExpenses
        };
    }, [filteredData]);
    const revenueTrendData = useMemo(() => {
        const monthlyData = new Map();
        filteredData.revenue.forEach((revenue) => {
            const month = format(new Date(revenue.date), 'MMM yyyy');
            monthlyData.set(month, (monthlyData.get(month) || 0) + revenue.amount);
        });
        return Array.from(monthlyData.entries()).map(([month, amount]) => ({
            month,
            amount
        }));
    }, [filteredData]);
    const expenseBreakdownData = useMemo(() => {
        const categoryData = new Map();
        filteredData.expenses.forEach((expense) => {
            categoryData.set(expense.category, (categoryData.get(expense.category) || 0) + expense.amount);
        });
        return Array.from(categoryData.entries()).map(([category, amount]) => ({
            category,
            amount
        }));
    }, [filteredData]);
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-AE', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageHeader, { title: "Tax Dashboard", description: "Monitor your tax compliance and financial metrics" }), _jsx(RelatedPartySection, {}), _jsxs("div", { className: "min-h-screen bg-gradient-to-b from-gray-50 to-gray-100", children: [_jsxs("div", { className: "max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Tax Dashboard" }), _jsx("p", { className: "mt-2 text-sm text-gray-600", children: "Monitor your tax compliance and financial metrics" })] }), _jsx(PermissionGate, { resource: "dashboard", requiredPermission: "view", restrictedTo: "Tax Agent or Admin", children: _jsxs("div", { className: "space-y-4 mb-8", children: [setupMissing && (_jsx(AlertBanner, { type: "error", title: "Setup Not Completed", message: "Please complete your company setup to ensure compliance.", action: {
                                                label: 'Complete Setup',
                                                onClick: () => navigate('/setup')
                                            } })), missingFilings && (_jsx(AlertBanner, { type: "warning", title: "Missing Filing", message: `No entries found for ${missingFilings}. Please ensure all transactions are recorded.`, action: {
                                                label: 'Add Entries',
                                                onClick: () => navigate('/filing')
                                            } })), incompleteProfile.length > 0 && (_jsx(AlertBanner, { type: "info", title: "Incomplete Profile", message: `The following information is missing: ${incompleteProfile.join(', ')}`, action: {
                                                label: 'Update Profile',
                                                onClick: () => navigate('/setup')
                                            } })), taxRegistrationAlerts.map((alert, index) => (_jsx(AlertBanner, { type: alert.type, title: alert.title, message: alert.message, action: alert.action }, index)))] }) }), _jsxs("div", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8", children: [_jsxs(PermissionGate, { resource: "dashboard", requiredPermission: "view", restrictedTo: "Tax Agent or Admin", children: [_jsxs("div", { className: "bg-white overflow-hidden shadow-lg rounded-2xl border border-gray-100", children: [_jsx("div", { className: "p-5", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(BanknotesIcon, { className: "h-6 w-6 text-green-500" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Total Revenue" }), _jsxs("dd", { className: "text-lg font-semibold text-gray-900", children: ["AED ", formatCurrency(metrics.totalRevenue)] })] }) })] }) }), _jsx("div", { className: "bg-gradient-to-b from-green-50 to-white px-5 py-3", children: _jsx("div", { className: "text-sm", children: _jsxs("span", { className: "text-green-700 font-medium", children: [state.revenue.length, " transactions"] }) }) })] }), _jsxs("div", { className: "bg-white overflow-hidden shadow-lg rounded-2xl border border-gray-100", children: [_jsx("div", { className: "p-5", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(ReceiptPercentIcon, { className: "h-6 w-6 text-red-500" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Total Expenses" }), _jsxs("dd", { className: "text-lg font-semibold text-gray-900", children: ["AED ", formatCurrency(metrics.totalExpenses)] })] }) })] }) }), _jsx("div", { className: "bg-gradient-to-b from-red-50 to-white px-5 py-3", children: _jsx("div", { className: "text-sm", children: _jsxs("span", { className: "text-red-700 font-medium", children: [state.expenses.length, " transactions"] }) }) })] })] }), _jsx(PermissionGate, { resource: "dashboard", requiredPermission: "edit", restrictedTo: "Admins", children: _jsxs("div", { className: "bg-white overflow-hidden shadow-lg rounded-2xl border border-gray-100", children: [_jsx("div", { className: "p-5", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(BuildingOfficeIcon, { className: "h-6 w-6 text-blue-500" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Net Income" }), _jsxs("dd", { className: "text-lg font-semibold text-gray-900", children: ["AED ", formatCurrency(metrics.netIncome)] })] }) })] }) }), _jsx("div", { className: "bg-gradient-to-b from-blue-50 to-white px-5 py-3", children: _jsx("div", { className: "text-sm", children: _jsx("span", { className: "text-blue-700 font-medium", children: "Year to date" }) }) })] }) }), _jsx(PermissionGate, { resource: "dashboard", requiredPermission: "view", restrictedTo: "Tax Agent or Admin", children: _jsxs("div", { className: "bg-white overflow-hidden shadow-lg rounded-2xl border border-gray-100", children: [_jsx("div", { className: "p-5", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(DocumentChartBarIcon, { className: "h-6 w-6 text-purple-500" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Tax Due" }), _jsxs("dd", { className: "text-lg font-semibold text-gray-900", children: ["AED ", (metrics.totalVAT + citAmount).toLocaleString()] })] }) })] }) }), _jsx("div", { className: "bg-gradient-to-b from-purple-50 to-white px-5 py-3", children: _jsx("div", { className: "text-sm", children: _jsx("span", { className: "text-purple-700 font-medium", children: "VAT + CIT" }) }) })] }) })] }), showDatePicker && (_jsxs("div", { className: "mb-8 p-4 bg-white shadow rounded-lg", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "startDate", className: "block text-sm font-medium text-gray-700", children: "Start Date" }), _jsx("input", { type: "date", id: "startDate", value: dateRange.startDate, onChange: e => setDateRange(prev => ({ ...prev, startDate: e.target.value })), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "endDate", className: "block text-sm font-medium text-gray-700", children: "End Date" }), _jsx("input", { type: "date", id: "endDate", value: dateRange.endDate, onChange: e => setDateRange(prev => ({ ...prev, endDate: e.target.value })), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" })] })] }), _jsxs("div", { className: "mt-4 flex justify-end", children: [_jsx(Button, { onClick: () => {
                                                    setDateRange({ startDate: '', endDate: '' });
                                                    setShowDatePicker(false);
                                                }, variant: "secondary", className: "mr-3", children: "Reset" }), _jsx(Button, { onClick: () => setShowDatePicker(false), children: "Apply" })] })] })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsx(PermissionGate, { resource: "dashboard", requiredPermission: "view", restrictedTo: "Tax Agent or Admin", children: _jsxs("div", { className: "bg-white shadow rounded-lg p-6", "data-testid": "revenue-trend-chart", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Revenue Trend" }), _jsx("div", { className: "h-80", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { data: revenueTrendData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "month" }), _jsx(YAxis, {}), _jsx(Tooltip, { formatter: (value) => `${formatCurrency(value)} AED` }), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "amount", stroke: "#0088FE", name: "Revenue" })] }) }) })] }) }), _jsx(PermissionGate, { resource: "dashboard", requiredPermission: "edit", restrictedTo: "Admins", children: _jsxs("div", { className: "bg-white shadow rounded-lg p-6", "data-testid": "expense-breakdown-chart", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Expense Breakdown" }), _jsx("div", { className: "h-80", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { data: expenseBreakdownData, dataKey: "amount", nameKey: "category", cx: "50%", cy: "50%", outerRadius: 100, label: ({ category, percent }) => `${category} (${(percent * 100).toFixed(0)}%)`, children: expenseBreakdownData.map((_, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, { formatter: (value) => `${formatCurrency(value)} AED` }), _jsx(Legend, {})] }) }) })] }) })] }), _jsx(PermissionGate, { resource: "dashboard", requiredPermission: "edit", restrictedTo: "Admins", children: _jsxs("div", { className: "mt-8 flex justify-end space-x-4", children: [_jsxs("button", { onClick: () => handleExport('pdf'), className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500", children: [_jsx(ArrowDownTrayIcon, { className: "h-5 w-5 mr-2" }), "Export PDF"] }), _jsxs("button", { onClick: () => handleExport('excel'), className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500", children: [_jsx(DocumentChartBarIcon, { className: "h-5 w-5 mr-2" }), "Export Excel"] }), _jsxs("button", { onClick: () => setIsSubmitModalOpen(true), className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", children: [_jsx(ArrowTrendingUpIcon, { className: "h-5 w-5 mr-2" }), "Submit to FTA"] })] }) })] }), submissionSuccess && (_jsx("div", { className: "mt-6", children: _jsx(SuccessAlert, { message: submissionSuccess.message, referenceNumber: submissionSuccess.referenceNumber, onClose: () => setSubmissionSuccess(null) }) })), _jsx(SubmissionModal, { isOpen: isSubmitModalOpen, isLoading: isSubmitting, onClose: () => setIsSubmitModalOpen(false), onConfirm: handleSubmitToFTA }), exportStarted && (_jsx("div", { className: "fixed bottom-4 right-4", children: _jsx("div", { className: "rounded-lg bg-green-50 p-4", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "h-5 w-5 text-green-400", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) }) }), _jsx("div", { className: "ml-3", children: _jsx("p", { className: "text-sm font-medium text-green-800", children: "Export Started" }) })] }) }) }))] })] }));
};
export default Dashboard;
