import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useTax } from '../context/TaxContext';
import { Validator } from '../utils/validation';
import { SecureStorage } from '../utils/storage';
import Button from '../components/Button';
export const FilingPage = () => {
    const { state: taxData } = useTax();
    const [state, setState] = useState({
        step: 1,
        period: '',
        trn: '',
        isDeclarationAccepted: false
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const validateStep1 = () => {
        const newErrors = {};
        if (!state.period) {
            newErrors.period = 'Filing Period is required';
        }
        const trnValidation = Validator.validateTRN(state.trn);
        if (!trnValidation.isValid) {
            newErrors.trn = trnValidation.errors[0];
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleNext = () => {
        if (state.step === 1 && !validateStep1()) {
            return;
        }
        setState(prev => ({ ...prev, step: prev.step + 1 }));
    };
    const handleBack = () => {
        setState(prev => ({ ...prev, step: prev.step - 1 }));
    };
    const calculateTotal = (items, field) => {
        return items.reduce((sum, item) => sum + (item[field] || 0), 0);
    };
    const handleSubmit = () => {
        const filing = {
            period: state.period,
            trn: state.trn,
            totalRevenue: calculateTotal(taxData.revenue, 'amount'),
            totalExpenses: calculateTotal(taxData.expenses, 'amount'),
            vatPayable: calculateTotal(taxData.revenue, 'vatAmount'),
            submittedAt: new Date().toISOString()
        };
        const existingFilings = SecureStorage.get('filings') || [];
        SecureStorage.set('filings', [...existingFilings, filing]);
        setSuccessMessage('Filing Submitted Successfully');
        // Reset form after successful submission
        setState({
            step: 1,
            period: '',
            trn: '',
            isDeclarationAccepted: false
        });
    };
    const saveDraft = () => {
        SecureStorage.set('draftFiling', {
            ...state,
            lastUpdated: new Date().toISOString()
        });
        setSuccessMessage('Draft Saved');
    };
    const renderStep1 = () => (_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Tax Filing Period" }), _jsxs("div", { children: [_jsx("label", { htmlFor: "period", className: "block text-sm font-medium text-gray-700", children: "Filing Period" }), _jsxs("select", { id: "period", value: state.period, onChange: e => setState(prev => ({ ...prev, period: e.target.value })), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500", children: [_jsx("option", { value: "", children: "Select Period" }), _jsx("option", { value: "2024-Q1", children: "2024 Q1" }), _jsx("option", { value: "2024-Q2", children: "2024 Q2" })] }), errors.period && _jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.period })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "trn", className: "block text-sm font-medium text-gray-700", children: "Tax Registration Number (TRN)" }), _jsx("input", { type: "text", id: "trn", value: state.trn, onChange: e => setState(prev => ({ ...prev, trn: e.target.value })), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" }), errors.trn && _jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.trn })] })] }));
    const renderStep2 = () => (_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Revenue Summary" }), _jsx("div", { className: "rounded-lg bg-white shadow", children: _jsx("div", { className: "px-4 py-5 sm:p-6", children: _jsxs("dl", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2", children: [_jsxs("div", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500", children: "Total Revenue" }), _jsxs("dd", { className: "mt-1 text-3xl font-semibold text-gray-900", children: [new Intl.NumberFormat('en-AE', {
                                                style: 'decimal',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            }).format(calculateTotal(taxData.revenue, 'amount')), ' ', "AED"] })] }), _jsxs("div", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500", children: "Total VAT" }), _jsxs("dd", { className: "mt-1 text-3xl font-semibold text-gray-900", children: [new Intl.NumberFormat('en-AE', {
                                                style: 'decimal',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            }).format(calculateTotal(taxData.revenue, 'vatAmount')), ' ', "AED"] })] })] }) }) })] }));
    const renderStep3 = () => (_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Expense Summary" }), _jsx("div", { className: "rounded-lg bg-white shadow", children: _jsx("div", { className: "px-4 py-5 sm:p-6", children: _jsx("dl", { children: _jsxs("div", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500", children: "Total Expenses" }), _jsxs("dd", { className: "mt-1 text-3xl font-semibold text-gray-900", children: [new Intl.NumberFormat('en-AE', {
                                            style: 'decimal',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        }).format(calculateTotal(taxData.expenses, 'amount')), ' ', "AED"] })] }) }) }) })] }));
    const renderStep4 = () => {
        const totalRevenue = calculateTotal(taxData.revenue, 'amount');
        const totalExpenses = calculateTotal(taxData.expenses, 'amount');
        const vatPayable = calculateTotal(taxData.revenue, 'vatAmount');
        return (_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Filing Summary" }), _jsxs("div", { className: "rounded-lg bg-white shadow p-6 space-y-4", children: [_jsxs("p", { children: ["Net Income: ", totalRevenue - totalExpenses, " AED"] }), _jsxs("p", { children: ["VAT Payable: ", vatPayable, " AED"] }), _jsx("div", { className: "mt-4", children: _jsxs("label", { className: "inline-flex items-center", children: [_jsx("input", { type: "checkbox", checked: state.isDeclarationAccepted, onChange: e => setState(prev => ({ ...prev, isDeclarationAccepted: e.target.checked })), className: "rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" }), _jsx("span", { className: "ml-2 text-sm text-gray-600", children: "I declare that the information provided is true and accurate" })] }) })] })] }));
    };
    const renderSuccess = () => (_jsx("div", { className: "rounded-lg bg-green-50 p-4", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "h-5 w-5 text-green-400", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) }) }), _jsx("div", { className: "ml-3", children: _jsx("p", { className: "text-sm font-medium text-green-800", children: successMessage }) })] }) }));
    return (_jsx("div", { className: "max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8", children: successMessage ? (renderSuccess()) : (_jsxs("div", { className: "space-y-8", children: [state.step === 1 && renderStep1(), state.step === 2 && renderStep2(), state.step === 3 && renderStep3(), state.step === 4 && renderStep4(), _jsxs("div", { className: "flex justify-between", children: [state.step > 1 && (_jsx(Button, { onClick: handleBack, variant: "secondary", children: "Back" })), _jsxs("div", { className: "flex space-x-4", children: [_jsx(Button, { onClick: saveDraft, variant: "outline", children: "Save Draft" }), state.step < 4 ? (_jsx(Button, { onClick: handleNext, children: "Next" })) : (_jsx(Button, { onClick: handleSubmit, disabled: !state.isDeclarationAccepted, children: "Submit Filing" }))] })] })] })) }));
};
