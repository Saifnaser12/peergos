import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BuildingOfficeIcon, CalendarDaysIcon, MapPinIcon, Cog6ToothIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import Card from '../components/Card';
import Button from '../components/Button';
const Setup = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isCompleted, setIsCompleted] = useState(false);
    // SME Categorization State
    const [smeData, setSmeData] = useState({
        revenue: 0,
        employees: 0,
        category: null,
        complianceItems: []
    });
    // Form Data State
    const [formData, setFormData] = useState({
        organizationName: '',
        trn: '',
        fiscalYearStart: '',
        fiscalYearEnd: '',
        businessType: '',
        address: '',
        taxAgent: '',
        posIntegration: false,
        accountingIntegration: false
    });
    // Business Categories Definition
    const businessCategories = [
        {
            id: 'micro',
            name: 'Micro SME',
            criteria: ['< AED 3m Revenue'],
            revenueThreshold: '< AED 3m',
            requirements: [
                'No VAT invoices and submissions',
                'Required CIT Registration and filling 0% tax',
                'Cash basis F.S (with notes)'
            ],
            color: 'bg-blue-100 border-blue-300 text-blue-800'
        },
        {
            id: 'small-below-375k',
            name: 'Small Business',
            criteria: ['< AED 375k Revenue'],
            revenueThreshold: '< AED 375k',
            requirements: [
                'No VAT invoices and submissions',
                'Required CIT Registration and filling 0% tax',
                'Cash basis F.S (with notes)'
            ],
            color: 'bg-cyan-100 border-cyan-300 text-cyan-800'
        },
        {
            id: 'small-above-375k',
            name: 'Small Business',
            criteria: ['> AED 375k Revenue'],
            revenueThreshold: '> AED 375k',
            requirements: [
                'Required VAT invoices and submissions',
                'Required CIT Registration and filling 0% tax',
                'Cash basis F.S (with notes)'
            ],
            color: 'bg-teal-100 border-teal-300 text-teal-800'
        },
        {
            id: 'small-business',
            name: 'Small Business',
            criteria: ['< 100 FTE', '< 25m Rev'],
            revenueThreshold: '< AED 25m',
            employeeThreshold: '< 100 FTE',
            requirements: [
                'Required VAT invoices and submissions',
                'Required CIT Registration and filling',
                'Accrual basis F.S (with notes)',
                'Transfer prices requirements'
            ],
            color: 'bg-green-100 border-green-300 text-green-800'
        },
        {
            id: 'medium-business',
            name: 'Medium Business',
            criteria: ['< 250 FTE', '< 150m Rev'],
            revenueThreshold: '< AED 150m',
            employeeThreshold: '< 250 FTE',
            requirements: [
                'Required VAT invoices and submissions',
                'Required CIT Registration and filling',
                'Accrual basis F.S (with notes)',
                'Transfer prices requirements'
            ],
            color: 'bg-purple-100 border-purple-300 text-purple-800'
        }
    ];
    // Categorize business based on revenue and employees
    const categorizeBusiness = (revenue, employees) => {
        if (revenue < 3000000) {
            return businessCategories.find(cat => cat.id === 'micro') || null;
        }
        else if (revenue < 375000) {
            return businessCategories.find(cat => cat.id === 'small-below-375k') || null;
        }
        else if (revenue < 25000000 && employees < 100) {
            return businessCategories.find(cat => cat.id === 'small-business') || null;
        }
        else if (revenue < 150000000 && employees < 250) {
            return businessCategories.find(cat => cat.id === 'medium-business') || null;
        }
        else {
            return businessCategories.find(cat => cat.id === 'small-above-375k') || null;
        }
    };
    // Handle SME categorization
    const handleSMECategorization = (revenue, employees) => {
        const category = categorizeBusiness(revenue, employees);
        setSmeData({
            revenue,
            employees,
            category,
            complianceItems: category?.requirements || []
        });
    };
    const steps = [
        {
            id: 1,
            title: t('setup.step1.title', 'Organization Details'),
            icon: BuildingOfficeIcon,
            description: t('setup.step1.description', 'Enter your organization name and TRN')
        },
        {
            id: 2,
            title: t('setup.step2.title', 'Business Categorization'),
            icon: InformationCircleIcon,
            description: t('setup.step2.description', 'Categorize your business for compliance requirements')
        },
        {
            id: 3,
            title: t('setup.step3.title', 'Fiscal Year'),
            icon: CalendarDaysIcon,
            description: t('setup.step3.description', 'Set your fiscal year dates')
        },
        {
            id: 4,
            title: t('setup.step4.title', 'Business Information'),
            icon: MapPinIcon,
            description: t('setup.step4.description', 'Configure business type and address')
        },
        {
            id: 5,
            title: t('setup.step5.title', 'System Configuration'),
            icon: Cog6ToothIcon,
            description: t('setup.step5.description', 'Connect integrations and finalize setup')
        }
    ];
    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
        else {
            setIsCompleted(true);
        }
    };
    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };
    const handleComplete = () => {
        localStorage.setItem('setupCompleted', 'true');
        localStorage.setItem('smeCategory', JSON.stringify(smeData));
        navigate('/dashboard');
    };
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: t('setup.organization.name', 'Organization Name') }), _jsx("input", { type: "text", className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white", value: formData.organizationName, onChange: (e) => setFormData({ ...formData, organizationName: e.target.value }), placeholder: t('setup.organization.namePlaceholder', 'Enter your organization name') })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: t('setup.organization.trn', 'Tax Registration Number (TRN)') }), _jsx("input", { type: "text", className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white", value: formData.trn, onChange: (e) => setFormData({ ...formData, trn: e.target.value }), placeholder: t('setup.organization.trnPlaceholder', 'Enter your TRN') })] })] }));
            case 2:
                return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800", children: [_jsxs("h3", { className: "text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center", children: [_jsx(InformationCircleIcon, { className: "w-5 h-5 mr-2" }), "SME Business Categorization"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Annual Revenue (AED)" }), _jsx("input", { type: "number", className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white", value: smeData.revenue, onChange: (e) => {
                                                        const revenue = Number(e.target.value);
                                                        setSmeData({ ...smeData, revenue });
                                                        handleSMECategorization(revenue, smeData.employees);
                                                    }, placeholder: "Enter annual revenue" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Number of Employees (FTE)" }), _jsx("input", { type: "number", className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white", value: smeData.employees, onChange: (e) => {
                                                        const employees = Number(e.target.value);
                                                        setSmeData({ ...smeData, employees });
                                                        handleSMECategorization(smeData.revenue, employees);
                                                    }, placeholder: "Enter number of employees" })] })] }), smeData.category && (_jsx("div", { className: "mt-6", children: _jsxs("div", { className: `rounded-lg p-4 border-2 ${smeData.category.color}`, children: [_jsx("h4", { className: "font-semibold text-lg mb-2", children: smeData.category.name }), _jsx("div", { className: "flex flex-wrap gap-2 mb-3", children: smeData.category.criteria.map((criterion, index) => (_jsx("span", { className: "px-2 py-1 bg-white/50 rounded text-sm", children: criterion }, index))) }), _jsxs("div", { className: "space-y-2", children: [_jsx("h5", { className: "font-medium", children: "Compliance Requirements:" }), smeData.category.requirements.map((requirement, index) => (_jsxs("div", { className: "flex items-start", children: [_jsx("span", { className: "flex-shrink-0 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5", children: index + 1 }), _jsx("span", { className: "text-sm", children: requirement })] }, index)))] })] }) }))] }), _jsx("div", { className: "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start", children: [_jsx(ExclamationTriangleIcon, { className: "w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2" }), _jsxs("div", { className: "text-sm text-yellow-800 dark:text-yellow-200", children: [_jsx("p", { className: "font-medium mb-1", children: "SME Workflow Benefits:" }), _jsxs("ul", { className: "list-disc list-inside space-y-1 text-xs", children: [_jsx("li", { children: "Tax Category Identification" }), _jsx("li", { children: "All proof documents will be uploaded" }), _jsx("li", { children: "Instant Readiness for FTA requirements changes" }), _jsx("li", { children: "Centralized repository for SMEs Data" })] })] })] }) })] }));
            case 3:
                return (_jsx("div", { className: "space-y-6", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: t('setup.fiscal.start', 'Fiscal Year Start') }), _jsx("input", { type: "date", className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white", value: formData.fiscalYearStart, onChange: (e) => setFormData({ ...formData, fiscalYearStart: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: t('setup.fiscal.end', 'Fiscal Year End') }), _jsx("input", { type: "date", className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white", value: formData.fiscalYearEnd, onChange: (e) => setFormData({ ...formData, fiscalYearEnd: e.target.value }) })] })] }) }));
            case 4:
                return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: t('setup.business.type', 'Business Type') }), _jsxs("select", { className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white", value: formData.businessType, onChange: (e) => setFormData({ ...formData, businessType: e.target.value }), children: [_jsx("option", { value: "", children: t('setup.business.selectType', 'Select business type') }), _jsx("option", { value: "llc", children: "LLC" }), _jsx("option", { value: "freezone", children: "Free Zone" }), _jsx("option", { value: "branch", children: "Branch" }), _jsx("option", { value: "sole_proprietorship", children: "Sole Proprietorship" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: t('setup.business.address', 'Business Address') }), _jsx("textarea", { rows: 3, className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white", value: formData.address, onChange: (e) => setFormData({ ...formData, address: e.target.value }), placeholder: t('setup.business.addressPlaceholder', 'Enter your business address') })] })] }));
            case 5:
                return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: t('setup.integrations.title', 'System Integrations') }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white", children: t('setup.integrations.pos', 'POS Integration') }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: t('setup.integrations.posDescription', 'Connect your Point-of-Sale system') })] }), _jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: formData.posIntegration, onChange: (e) => setFormData({ ...formData, posIntegration: e.target.checked }), className: "sr-only peer" }), _jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" })] })] }), _jsxs("div", { className: "flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white", children: t('setup.integrations.accounting', 'Accounting Integration') }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: t('setup.integrations.accountingDescription', 'Connect your accounting system') })] }), _jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: formData.accountingIntegration, onChange: (e) => setFormData({ ...formData, accountingIntegration: e.target.checked }), className: "sr-only peer" }), _jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" })] })] })] })] }), smeData.category && (_jsxs("div", { className: "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4", children: [_jsxs("h4", { className: "font-medium text-green-800 dark:text-green-200 mb-2 flex items-center", children: [_jsx(CheckCircleIcon, { className: "w-5 h-5 mr-2" }), "Setup Summary - ", smeData.category.name] }), _jsxs("div", { className: "text-sm text-green-700 dark:text-green-300 space-y-1", children: [_jsxs("p", { children: ["Revenue: AED ", smeData.revenue.toLocaleString()] }), _jsxs("p", { children: ["Employees: ", smeData.employees, " FTE"] }), _jsxs("p", { children: ["Compliance Requirements: ", smeData.complianceItems.length, " items identified"] })] })] }))] }));
            default:
                return null;
        }
    };
    if (isCompleted) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4", children: _jsx(Card, { className: "max-w-md w-full text-center", children: _jsxs("div", { className: "p-6", children: [_jsx(CheckCircleIcon, { className: "w-16 h-16 text-green-500 mx-auto mb-4" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-2", children: t('setup.complete.title', 'Setup Complete!') }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-6", children: t('setup.complete.description', 'Your Peergos Tax system is now configured and ready to use.') }), smeData.category && (_jsxs("div", { className: "mb-6 text-left", children: [_jsxs("h3", { className: "font-medium text-gray-900 dark:text-white mb-2", children: ["Business Category: ", smeData.category.name] }), _jsx("ul", { className: "list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1", children: smeData.complianceItems.map((item, index) => (_jsx("li", { children: item }, index))) })] })), _jsx(Button, { onClick: handleComplete, className: "w-full", children: t('setup.complete.button', 'Go to Dashboard') })] }) }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-2", children: t('setup.title', 'Setup Your Tax System') }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: t('setup.description', 'Configure your Peergos Tax system with SME-specific requirements') })] }), _jsx("div", { className: "mb-8", children: _jsx("div", { className: "flex items-center justify-between", children: steps.map((step, index) => (_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: `w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= step.id
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'border-gray-300 text-gray-300'}`, children: currentStep > step.id ? (_jsx(CheckCircleIcon, { className: "w-6 h-6" })) : (_jsx(step.icon, { className: "w-5 h-5" })) }), _jsx("div", { className: "text-center mt-2", children: _jsx("p", { className: `text-sm font-medium ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'}`, children: step.title }) }), index < steps.length - 1 && (_jsx("div", { className: `hidden md:block w-full h-0.5 ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'}`, style: { minWidth: '60px' } }))] }, step.id))) }) }), _jsx(Card, { className: "mb-6", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 dark:text-white mb-2", children: steps[currentStep - 1].title }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: steps[currentStep - 1].description })] }), renderStepContent()] }) }), _jsxs("div", { className: "flex justify-between", children: [_jsx(Button, { variant: "outline", onClick: handlePrevious, disabled: currentStep === 1, children: t('setup.previous', 'Previous') }), _jsx(Button, { onClick: currentStep === steps.length ? handleComplete : handleNext, children: currentStep === steps.length
                                ? t('setup.complete.button', 'Complete Setup')
                                : t('setup.next', 'Next') })] })] }) }));
};
export default Setup;
