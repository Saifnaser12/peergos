import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from 'react';
import { useTax } from '../context/TaxContext';
import { useAudit } from '../context/AuditContext';
import SubmissionModal from '../components/SubmissionModal';
import SuccessAlert from '../components/SuccessAlert';
import { submitToFTA } from '../utils/submission';
import { ChevronUpIcon, ChevronDownIcon, FunnelIcon, PlusIcon } from '@heroicons/react/24/outline';
import { EmptyState, illustrations } from '../components/Illustration';
import Button from '../components/Button';
import Card from '../components/Card';
import PermissionGate from '../components/PermissionGate';
import { useTranslation } from 'react-i18next';
import { Validator } from '../utils/validation';
import { SecureStorage } from '../utils/storage';
const Filing = () => {
    const { state: taxState, dispatch } = useTax();
    const { log } = useAudit();
    const { t } = useTranslation();
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(null);
    const [showBulkUpload, setShowBulkUpload] = useState(null);
    const [showRevenueFilters, setShowRevenueFilters] = useState(false);
    const [showExpenseFilters, setShowExpenseFilters] = useState(false);
    const [showAddRecord, setShowAddRecord] = useState(false);
    // Filter states
    const [revenueFilters, setRevenueFilters] = useState({
        dateRange: { start: '', end: '' },
        category: [],
        amountRange: { min: '', max: '' }
    });
    const [expenseFilters, setExpenseFilters] = useState({
        dateRange: { start: '', end: '' },
        category: [],
        amountRange: { min: '', max: '' }
    });
    // Sort states
    const [revenueSort, setRevenueSort] = useState({
        field: 'date',
        direction: 'desc'
    });
    const [expenseSort, setExpenseSort] = useState({
        field: 'date',
        direction: 'desc'
    });
    const [filingFormState, setFilingFormState] = useState({
        step: 1,
        period: '',
        trn: '',
        isDeclarationAccepted: false,
        selectedTab: 'revenue',
        isSubmitting: false,
        showConfirmation: false,
        errors: {},
        revenueEntries: [],
        expenseEntries: []
    });
    useEffect(() => {
        log('VIEW_FILING');
    }, [log]);
    // Filter and sort functions
    const filterEntries = (entries, filters) => {
        return entries.filter(entry => {
            const date = new Date(entry.date);
            const amount = entry.amount;
            const category = 'source' in entry ? entry.source : entry.category;
            // Date range filter
            if (filters.dateRange.start && date < new Date(filters.dateRange.start))
                return false;
            if (filters.dateRange.end && date > new Date(filters.dateRange.end))
                return false;
            // Category filter
            if (filters.category.length > 0 && !filters.category.includes(category))
                return false;
            // Amount range filter
            if (filters.amountRange.min && amount < parseFloat(filters.amountRange.min))
                return false;
            if (filters.amountRange.max && amount > parseFloat(filters.amountRange.max))
                return false;
            return true;
        });
    };
    const sortEntries = (entries, sort) => {
        return [...entries].sort((a, b) => {
            const multiplier = sort.direction === 'asc' ? 1 : -1;
            if (sort.field === 'date') {
                return multiplier * (new Date(a.date).getTime() - new Date(b.date).getTime());
            }
            return multiplier * (a.amount - b.amount);
        });
    };
    // Memoized filtered and sorted data
    const filteredSortedRevenues = useMemo(() => {
        let result = filterEntries(taxState.revenues, revenueFilters);
        return sortEntries(result, revenueSort);
    }, [taxState.revenues, revenueFilters, revenueSort]);
    const filteredSortedExpenses = useMemo(() => {
        let result = filterEntries(taxState.expenses, expenseFilters);
        return sortEntries(result, expenseSort);
    }, [taxState.expenses, expenseFilters, expenseSort]);
    // Get unique categories/sources for filter options
    const revenueSources = useMemo(() => Array.from(new Set(taxState.revenues.map(r => r.source))), [taxState.revenues]);
    const expenseCategories = useMemo(() => Array.from(new Set(taxState.expenses.map(e => e.category))), [taxState.expenses]);
    const handleDraftToggle = () => {
        dispatch({ type: 'TOGGLE_DRAFT_MODE', payload: !taxState.isDraftMode });
    };
    const handleSubmitToFTA = async () => {
        if (!taxState.profile) {
            console.error('No profile data available');
            return;
        }
        setIsSubmitting(true);
        try {
            const submissionData = {
                trn: taxState.profile.trnNumber,
                timestamp: new Date().toISOString(),
                referenceNumber: '',
                data: {
                    revenues: taxState.revenues,
                    expenses: taxState.expenses,
                    vatDue: taxState.revenues.reduce((sum, entry) => sum + entry.vatAmount, 0),
                    citDue: taxState.revenues.reduce((sum, entry) => sum + (entry.amount * 0.09), 0),
                    complianceScore: 100
                }
            };
            const referenceNumber = await submitToFTA(submissionData);
            log('SUBMIT_FILING', {
                trn: taxState.profile.trnNumber,
                referenceNumber,
                vatDue: submissionData.data.vatDue,
                citDue: submissionData.data.citDue
            });
            // Clear draft after successful submission
            if (taxState.isDraftMode) {
                dispatch({ type: 'CLEAR_DRAFT' });
            }
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
    const handleBulkUpload = (entries) => {
        if (showBulkUpload === 'revenue') {
            entries.forEach(entry => {
                dispatch({ type: 'ADD_REVENUE', payload: entry });
            });
        }
        else {
            entries.forEach(entry => {
                dispatch({ type: 'ADD_EXPENSE', payload: entry });
            });
        }
        setShowBulkUpload(null);
    };
    const renderFilterPanel = (type, filters, setFilters, categories) => (_jsxs("div", { className: "bg-gray-50 p-4 rounded-lg mb-4 space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Start Date" }), _jsx("input", { type: "date", value: filters.dateRange.start, onChange: (e) => setFilters(prev => ({
                                    ...prev,
                                    dateRange: { ...prev.dateRange, start: e.target.value }
                                })), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "End Date" }), _jsx("input", { type: "date", value: filters.dateRange.end, onChange: (e) => setFilters(prev => ({
                                    ...prev,
                                    dateRange: { ...prev.dateRange, end: e.target.value }
                                })), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: type === 'revenue' ? 'Sources' : 'Categories' }), _jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: categories.map(category => (_jsx("button", { onClick: () => {
                                setFilters(prev => ({
                                    ...prev,
                                    category: prev.category.includes(category)
                                        ? prev.category.filter(c => c !== category)
                                        : [...prev.category, category]
                                }));
                            }, className: `px-3 py-1 rounded-full text-sm font-medium ${filters.category.includes(category)
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-gray-100 text-gray-800'}`, children: category }, category))) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Min Amount" }), _jsx("input", { type: "number", value: filters.amountRange.min, onChange: (e) => setFilters(prev => ({
                                    ...prev,
                                    amountRange: { ...prev.amountRange, min: e.target.value }
                                })), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm", placeholder: "0" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Max Amount" }), _jsx("input", { type: "number", value: filters.amountRange.max, onChange: (e) => setFilters(prev => ({
                                    ...prev,
                                    amountRange: { ...prev.amountRange, max: e.target.value }
                                })), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm", placeholder: "999999999" })] })] }), _jsx("div", { className: "flex justify-end space-x-2", children: _jsx("button", { onClick: () => setFilters({
                        dateRange: { start: '', end: '' },
                        category: [],
                        amountRange: { min: '', max: '' }
                    }), className: "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50", children: "Clear Filters" }) })] }));
    const renderSortHeader = (label, field, sort, setSort) => (_jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700", onClick: () => setSort(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        })), children: _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx("span", { children: label }), sort.field === field && (sort.direction === 'asc' ? _jsx(ChevronUpIcon, { className: "h-4 w-4" }) : _jsx(ChevronDownIcon, { className: "h-4 w-4" }))] }) }));
    const validateStep1 = () => {
        if (!filingFormState.period) {
            setFilingFormState(prev => ({ ...prev, errors: { period: 'Period is required' } }));
            return false;
        }
        const trnValidation = Validator.validateTRN(filingFormState.trn);
        if (!trnValidation.isValid) {
            setFilingFormState(prev => ({ ...prev, errors: { trn: trnValidation.errors[0] } }));
            return false;
        }
        return true;
    };
    const handleNext = () => {
        if (filingFormState.step === 1 && !validateStep1()) {
            return;
        }
        setFilingFormState(prev => ({ ...prev, step: prev.step + 1 }));
    };
    const handleBack = () => {
        setFilingFormState(prev => ({ ...prev, step: prev.step - 1 }));
    };
    const handleSubmit = () => {
        const submissionData = {
            period: filingFormState.period,
            trn: filingFormState.trn,
            totalRevenue: taxState.revenues.reduce((sum, r) => sum + r.amount, 0),
            totalExpenses: taxState.expenses.reduce((sum, e) => sum + e.amount, 0),
            vatPayable: taxState.revenues.reduce((sum, r) => sum + (r.vatAmount || 0), 0),
        };
        // Submit data to backend
        console.log('Submitting:', submissionData);
        setFilingFormState(prev => ({ ...prev, showConfirmation: true }));
    };
    const saveDraft = () => {
        SecureStorage.set('draftFiling', {
            ...taxState,
            lastUpdated: new Date().toISOString()
        });
    };
    const renderStep1 = () => (_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Tax Filing Period" }), _jsxs("div", { children: [_jsx("label", { htmlFor: "period", className: "block text-sm font-medium text-gray-700", children: "Filing Period" }), _jsxs("select", { id: "period", value: filingFormState.period, onChange: e => setFilingFormState(prev => ({ ...prev, period: e.target.value })), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500", children: [_jsx("option", { value: "", children: "Select Period" }), _jsx("option", { value: "2024-Q1", children: "2024 Q1" }), _jsx("option", { value: "2024-Q2", children: "2024 Q2" })] }), filingFormState.errors.period && _jsx("p", { className: "mt-1 text-sm text-red-600", children: filingFormState.errors.period })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "trn", className: "block text-sm font-medium text-gray-700", children: "Tax Registration Number (TRN)" }), _jsx("input", { type: "text", id: "trn", value: filingFormState.trn, onChange: e => setFilingFormState(prev => ({ ...prev, trn: e.target.value })), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" }), filingFormState.errors.trn && _jsx("p", { className: "mt-1 text-sm text-red-600", children: filingFormState.errors.trn })] })] }));
    const renderStep2 = () => (_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Revenue Summary" }), _jsx("div", { className: "rounded-lg bg-white shadow", children: _jsx("div", { className: "px-4 py-5 sm:p-6", children: _jsxs("dl", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2", children: [_jsxs("div", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500", children: "Total Revenue" }), _jsxs("dd", { className: "mt-1 text-3xl font-semibold text-gray-900", children: [new Intl.NumberFormat('en-AE', {
                                                style: 'decimal',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            }).format(taxState.revenues.reduce((sum, r) => sum + r.amount, 0)), ' ', "AED"] })] }), _jsxs("div", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500", children: "Total VAT" }), _jsxs("dd", { className: "mt-1 text-3xl font-semibold text-gray-900", children: [new Intl.NumberFormat('en-AE', {
                                                style: 'decimal',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            }).format(taxState.revenues.reduce((sum, r) => sum + (r.vatAmount || 0), 0)), ' ', "AED"] })] })] }) }) })] }));
    const renderStep3 = () => (_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Expense Summary" }), _jsx("div", { className: "rounded-lg bg-white shadow", children: _jsx("div", { className: "px-4 py-5 sm:p-6", children: _jsx("dl", { children: _jsxs("div", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500", children: "Total Expenses" }), _jsxs("dd", { className: "mt-1 text-3xl font-semibold text-gray-900", children: [new Intl.NumberFormat('en-AE', {
                                            style: 'decimal',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        }).format(taxState.expenses.reduce((sum, e) => sum + e.amount, 0)), ' ', "AED"] })] }) }) }) })] }));
    const renderStep4 = () => {
        const totalRevenue = taxState.revenues.reduce((sum, r) => sum + r.amount, 0);
        const totalExpenses = taxState.expenses.reduce((sum, e) => sum + e.amount, 0);
        const vatPayable = taxState.revenues.reduce((sum, r) => sum + (r.vatAmount || 0), 0);
        return (_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Filing Summary" }), _jsxs("div", { className: "rounded-lg bg-white shadow p-6 space-y-4", children: [_jsxs("p", { children: ["Net Income: ", totalRevenue - totalExpenses, " AED"] }), _jsxs("p", { children: ["VAT Payable: ", vatPayable, " AED"] }), _jsx("div", { className: "mt-4", children: _jsxs("label", { className: "inline-flex items-center", children: [_jsx("input", { type: "checkbox", checked: filingFormState.isDeclarationAccepted, onChange: e => setFilingFormState(prev => ({ ...prev, isDeclarationAccepted: e.target.checked })), className: "rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" }), _jsx("span", { className: "ml-2 text-sm text-gray-600", children: "I declare that the information provided is true and accurate" })] }) })] })] }));
    };
    const renderSuccess = () => (_jsx("div", { className: "rounded-lg bg-green-50 p-4", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "h-5 w-5 text-green-400", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) }) }), _jsx("div", { className: "ml-3", children: _jsx("p", { className: "text-sm font-medium text-green-800", children: filingFormState.showConfirmation ? 'Filing Submitted Successfully' : 'Filing Submitted Successfully' }) })] }) }));
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 shadow rounded-lg p-6", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-4", children: t('filing.title', 'Tax Filing') }), _jsx("p", { className: "text-gray-600 dark:text-gray-300", children: t('filing.description', 'Manage your tax returns and submissions') })] }), !taxState.revenues.length && !taxState.expenses.length ? (_jsx(EmptyState, { illustration: illustrations.noDataFolder, title: "No Records Found", description: "Start by adding your revenue and expense records to track your tax obligations.", action: _jsx(PermissionGate, { resource: "filing", requiredPermission: "edit", restrictedTo: "SME or Admin", children: _jsx(Button, { variant: "primary", icon: _jsx(PlusIcon, { className: "h-5 w-5" }), onClick: () => setShowAddRecord(true), children: "Add New Record" }) }) })) : (_jsxs(_Fragment, { children: [_jsx(PermissionGate, { resource: "filing", requiredPermission: "view", restrictedTo: "Tax Agent or Admin", children: _jsxs(Card, { children: [_jsxs("div", { className: "px-4 py-5 sm:px-6 flex justify-between items-center", children: [_jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900", children: "Revenue Entries" }), _jsx(PermissionGate, { resource: "filing", requiredPermission: "edit", restrictedTo: "SME or Admin", children: _jsxs("div", { className: "flex space-x-3", children: [_jsx(Button, { variant: "secondary", size: "sm", onClick: () => setShowBulkUpload('revenue'), children: "Bulk Upload" }), _jsxs(Button, { variant: "secondary", size: "sm", icon: _jsx(FunnelIcon, { className: "h-4 w-4" }), onClick: () => setShowRevenueFilters(!showRevenueFilters), children: ["Filter", showRevenueFilters ? (_jsx(ChevronUpIcon, { className: "h-4 w-4 ml-1" })) : (_jsx(ChevronDownIcon, { className: "h-4 w-4 ml-1" }))] })] }) })] }), showRevenueFilters && renderFilterPanel('revenue', revenueFilters, setRevenueFilters, revenueSources), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [renderSortHeader('Date', 'date', revenueSort, setRevenueSort), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Source" }), renderSortHeader('Amount', 'amount', revenueSort, setRevenueSort), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "VAT Amount" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredSortedRevenues.map((entry) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: new Date(entry.date).toLocaleDateString() }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: entry.source }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: ["AED ", entry.amount.toLocaleString()] }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: ["AED ", entry.vatAmount.toLocaleString()] })] }, entry.id))) })] }) })] }) }), _jsx(PermissionGate, { resource: "filing", requiredPermission: "view", restrictedTo: "Tax Agent or Admin", children: _jsxs(Card, { children: [_jsxs("div", { className: "px-4 py-5 sm:px-6 flex justify-between items-center", children: [_jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900", children: "Expense Entries" }), _jsx(PermissionGate, { resource: "filing", requiredPermission: "edit", restrictedTo: "SME or Admin", children: _jsxs("div", { className: "flex space-x-3", children: [_jsx(Button, { variant: "secondary", size: "sm", onClick: () => setShowBulkUpload('expense'), children: "Bulk Upload" }), _jsxs(Button, { variant: "secondary", size: "sm", icon: _jsx(FunnelIcon, { className: "h-4 w-4" }), onClick: () => setShowExpenseFilters(!showExpenseFilters), children: ["Filter", showExpenseFilters ? (_jsx(ChevronUpIcon, { className: "h-4 w-4 ml-1" })) : (_jsx(ChevronDownIcon, { className: "h-4 w-4 ml-1" }))] })] }) })] }), showExpenseFilters && renderFilterPanel('expense', expenseFilters, setExpenseFilters, expenseCategories), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [renderSortHeader('Date', 'date', expenseSort, setExpenseSort), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Category" }), renderSortHeader('Amount', 'amount', expenseSort, setExpenseSort)] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredSortedExpenses.map((entry) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: new Date(entry.date).toLocaleDateString() }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: entry.category }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: ["AED ", entry.amount.toLocaleString()] })] }, entry.id))) })] }) })] }) })] })), _jsx(PermissionGate, { resource: "filing", requiredPermission: "edit", restrictedTo: "SME or Admin", children: _jsxs("div", { className: "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "mb-6 flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("label", { className: "inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: taxState.isDraftMode, onChange: handleDraftToggle, className: "sr-only peer" }), _jsx("div", { className: "relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" }), _jsx("span", { className: "ml-3 text-sm font-medium text-gray-700", children: "Save as Draft" })] }), taxState.isDraftMode && (_jsx("span", { className: "text-sm text-gray-500", children: "Auto-saving changes..." }))] }), _jsx("button", { type: "button", onClick: () => setIsSubmitModalOpen(true), className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", disabled: !taxState.profile, children: "Submit to FTA" })] }), submissionSuccess && (_jsx("div", { className: "mb-6", children: _jsx(SuccessAlert, { message: submissionSuccess.message, referenceNumber: submissionSuccess.referenceNumber, onClose: () => setSubmissionSuccess(null) }) }))] }) }), _jsx(SubmissionModal, { isOpen: isSubmitModalOpen, isLoading: isSubmitting, onClose: () => setIsSubmitModalOpen(false), onConfirm: handleSubmitToFTA }), showAddRecord && (_jsx("div", { className: "fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center", children: _jsx(Card, { className: "max-w-lg w-full mx-4", children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Add New Record" }), _jsxs("div", { className: "mt-6 flex justify-end space-x-3", children: [_jsx(Button, { variant: "outline", onClick: () => setShowAddRecord(false), children: "Cancel" }), _jsx(Button, { variant: "primary", children: "Save Record" })] })] }) }) })), showBulkUpload && (_jsx("div", { className: "fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center", children: _jsx(Card, { className: "max-w-lg w-full mx-4", children: _jsxs("div", { className: "p-6", children: [_jsxs("h3", { className: "text-lg font-medium text-gray-900", children: ["Bulk Upload ", showBulkUpload === 'revenue' ? 'Revenue' : 'Expense', " Records"] }), _jsxs("div", { className: "mt-6 flex justify-end space-x-3", children: [_jsx(Button, { variant: "outline", onClick: () => setShowBulkUpload(null), children: "Cancel" }), _jsx(Button, { variant: "primary", children: "Upload" })] })] }) }) })), _jsx("div", { className: "max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8", children: filingFormState.showConfirmation ? (renderSuccess()) : (_jsxs("div", { className: "space-y-8", children: [filingFormState.step === 1 && renderStep1(), filingFormState.step === 2 && renderStep2(), filingFormState.step === 3 && renderStep3(), filingFormState.step === 4 && renderStep4(), _jsxs("div", { className: "mt-8 flex justify-between", children: [filingFormState.step > 1 && (_jsx("button", { type: "button", onClick: handleBack, className: "inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50", children: "Back" })), filingFormState.step < 4 ? (_jsx("button", { type: "button", onClick: handleNext, className: "ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700", children: "Next" })) : (_jsx("button", { type: "button", onClick: handleSubmit, disabled: !filingFormState.isDeclarationAccepted, className: "ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50", children: "Submit Filing" }))] })] })) })] }));
};
export default Filing;
