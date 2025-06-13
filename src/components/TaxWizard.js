import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRightIcon, ArrowLeftIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
const TaxWizard = () => {
    const { t } = useTranslation();
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState(new Set());
    const steps = [
        {
            id: 'business-info',
            title: 'Business Information',
            description: 'Tell us about your business',
            component: BusinessInfoStep,
            estimatedTime: '3 min'
        },
        {
            id: 'income-review',
            title: 'Income Review',
            description: 'Review your revenue streams',
            component: IncomeReviewStep,
            estimatedTime: '5 min'
        },
        {
            id: 'expense-deductions',
            title: 'Expenses & Deductions',
            description: 'Maximize your tax savings',
            component: ExpenseDeductionsStep,
            estimatedTime: '7 min'
        },
        {
            id: 'tax-calculations',
            title: 'Tax Calculations',
            description: 'See your tax liability',
            component: TaxCalculationsStep,
            estimatedTime: '2 min'
        },
        {
            id: 'review-submit',
            title: 'Review & Submit',
            description: 'Final review before FTA submission',
            component: ReviewSubmitStep,
            estimatedTime: '5 min'
        }
    ];
    const progress = ((currentStep + 1) / steps.length) * 100;
    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCompletedSteps(prev => new Set([...prev, currentStep]));
            setCurrentStep(currentStep + 1);
        }
    };
    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    const CurrentStepComponent = steps[currentStep].component;
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx("div", { className: "bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 py-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "UAE Tax Filing Wizard" }), _jsxs("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Step ", currentStep + 1, " of ", steps.length] })] }), _jsx("div", { className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4", children: _jsx("div", { className: "bg-blue-600 h-2 rounded-full transition-all duration-300", style: { width: `${progress}%` } }) }), _jsx("div", { className: "flex justify-between", children: steps.map((step, index) => (_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${completedSteps.has(index)
                                            ? 'bg-green-500 text-white'
                                            : index === currentStep
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-300 text-gray-600'}`, children: completedSteps.has(index) ? (_jsx(CheckCircleIcon, { className: "w-5 h-5" })) : (index + 1) }), _jsx("span", { className: "text-xs text-gray-600 dark:text-gray-400 mt-1 text-center max-w-20", children: step.title })] }, step.id))) })] }) }), _jsx("div", { className: "max-w-4xl mx-auto px-4 py-8", children: _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "p-8", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 dark:text-white mb-2", children: steps[currentStep].title }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: steps[currentStep].description }), _jsxs("div", { className: "flex items-center mt-2 text-sm text-gray-500", children: [_jsx(InformationCircleIcon, { className: "w-4 h-4 mr-1" }), "Estimated time: ", steps[currentStep].estimatedTime] })] }), _jsx(CurrentStepComponent, { onNext: nextStep, onPrev: prevStep })] }), _jsx("div", { className: "border-t border-gray-200 dark:border-gray-700 px-8 py-4", children: _jsxs("div", { className: "flex justify-between", children: [_jsxs("button", { onClick: prevStep, disabled: currentStep === 0, className: "flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx(ArrowLeftIcon, { className: "w-4 h-4 mr-2" }), "Previous"] }), _jsxs("button", { onClick: nextStep, disabled: currentStep === steps.length - 1, className: "flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed", children: [currentStep === steps.length - 1 ? 'Submit to FTA' : 'Continue', _jsx(ArrowRightIcon, { className: "w-4 h-4 ml-2" })] })] }) })] }) })] }));
};
// Placeholder step components
const BusinessInfoStep = () => _jsx("div", { children: "Business Info Form" });
const IncomeReviewStep = () => _jsx("div", { children: "Income Review Form" });
const ExpenseDeductionsStep = () => _jsx("div", { children: "Expense Deductions Form" });
const TaxCalculationsStep = () => _jsx("div", { children: "Tax Calculations Display" });
const ReviewSubmitStep = () => _jsx("div", { children: "Review & Submit Form" });
export default TaxWizard;
