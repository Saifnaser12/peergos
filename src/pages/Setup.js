import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from 'react';
import { useAudit } from '../context/AuditContext';
import { useTax } from '../context/TaxContext';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { BuildingOfficeIcon, IdentificationIcon, DocumentCheckIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, BriefcaseIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import ComplianceBadges from '../components/ComplianceBadges';
import Card from '../components/Card';
import Button from '../components/Button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
const STORAGE_KEY = 'setup_form_data';
const Setup = () => {
    const navigate = useNavigate();
    const { log } = useAudit();
    const { dispatch, state } = useTax();
    const { t } = useTranslation();
    const [profile, setProfile] = useState({
        companyName: state.profile?.companyName || '',
        trnNumber: state.profile?.trnNumber || '',
        licenseType: state.profile?.licenseType || '',
        email: state.profile?.email || '',
        phone: state.profile?.phone || '',
        address: state.profile?.address || '',
        businessActivity: state.profile?.businessActivity || '',
        vatRegistered: state.profile?.vatRegistered || false,
        citRegistered: state.profile?.citRegistered || false,
        citSubmissionDate: state.profile?.citSubmissionDate
    });
    const [errors, setErrors] = useState({
        companyName: { isValid: true, message: '' },
        trnNumber: { isValid: true, message: '' },
        licenseType: { isValid: true, message: '' },
        revenue: { isValid: true, message: '' }
    });
    const [taxMessage, setTaxMessage] = useState('');
    const [messageColor, setMessageColor] = useState('text-gray-600');
    const [showTooltip, setShowTooltip] = useState(null);
    const [saveIndicator, setSaveIndicator] = useState('');
    // Log page view
    useEffect(() => {
        log('VIEW_SETUP');
    }, [log]);
    // Save form data to localStorage whenever it changes
    useEffect(() => {
        const saveData = () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
            setSaveIndicator('Saved');
            const timer = setTimeout(() => setSaveIndicator(''), 2000);
            return () => clearTimeout(timer);
        };
        // Debounce the save operation
        const timeoutId = setTimeout(saveData, 500);
        return () => clearTimeout(timeoutId);
    }, [profile]);
    const validateTRN = (trn) => {
        if (!trn)
            return { isValid: false, message: 'TRN is required' };
        if (!/^\d+$/.test(trn))
            return { isValid: false, message: 'TRN must contain only digits' };
        if (trn.length !== 15)
            return { isValid: false, message: 'TRN must be exactly 15 digits' };
        // Checksum validation
        const sum = trn.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
        if (sum % 7 !== 0)
            return { isValid: false, message: 'Invalid TRN checksum' };
        return { isValid: true, message: '' };
    };
    const validateRevenue = (value) => {
        if (!value)
            return { isValid: false, message: 'Revenue is required' };
        const numericValue = parseFloat(value.replace(/,/g, ''));
        if (isNaN(numericValue))
            return { isValid: false, message: 'Revenue must be a valid number' };
        if (numericValue < 0)
            return { isValid: false, message: 'Revenue cannot be negative' };
        return { isValid: true, message: '' };
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;
        if (name === 'trnNumber') {
            processedValue = value.replace(/[^0-9]/g, '').slice(0, 15);
        }
        else if (name === 'revenue') {
            processedValue = value.replace(/[^0-9.]/g, '');
        }
        setProfile(prev => ({
            ...prev,
            [name]: processedValue
        }));
        setSaveIndicator('Saving...');
        // Validate field
        let validation = { isValid: true, message: '' };
        switch (name) {
            case 'companyName':
                validation = {
                    isValid: value.trim().length > 0,
                    message: value.trim().length === 0 ? 'Company name is required' : ''
                };
                break;
            case 'trnNumber':
                validation = validateTRN(processedValue);
                break;
            case 'licenseType':
                validation = {
                    isValid: value !== '',
                    message: value === '' ? 'Please select a license type' : ''
                };
                break;
            case 'revenue':
                validation = validateRevenue(processedValue);
                if (validation.isValid) {
                    const numericRevenue = parseFloat(processedValue.replace(/,/g, ''));
                    if (numericRevenue < 375000) {
                        setTaxMessage('No VAT or Corporate Income Tax obligations');
                        setMessageColor('text-green-600');
                    }
                    else if (numericRevenue <= 3000000) {
                        setTaxMessage('VAT registration required. No Corporate Income Tax obligations');
                        setMessageColor('text-blue-600');
                    }
                    else {
                        setTaxMessage('Both VAT registration and Corporate Income Tax (accrual basis) required');
                        setMessageColor('text-indigo-600');
                    }
                }
                break;
        }
        setErrors(prev => ({
            ...prev,
            [name]: validation
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch({ type: 'SET_PROFILE', payload: profile });
        setSaveIndicator('Saved');
        setTimeout(() => setSaveIndicator(''), 2000);
    };
    const renderTooltip = (field) => {
        const tooltips = {
            trnNumber: 'The Tax Registration Number (TRN) is a unique 15-digit identifier issued by the FTA.',
            licenseType: 'Select your company\'s operating license type. This affects your tax obligations.',
            revenue: 'Enter your annual revenue in AED. This determines your VAT and CIT obligations.'
        };
        return (_jsxs("div", { className: "relative inline-block", children: [_jsx(QuestionMarkCircleIcon, { className: "h-5 w-5 text-gray-400 hover:text-gray-500 cursor-pointer ml-2", onMouseEnter: () => setShowTooltip(field), onMouseLeave: () => setShowTooltip(null) }), showTooltip === field && (_jsxs("div", { className: "absolute z-10 w-72 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm dark:bg-gray-700 -right-2 top-6", children: [tooltips[field], _jsx("div", { className: "absolute w-2 h-2 bg-gray-900 transform rotate-45 -top-1 right-4" })] }))] }));
    };
    const totalRevenue = useMemo(() => {
        return state.revenue.reduce((sum, entry) => sum + entry.amount, 0);
    }, [state.revenue]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 shadow rounded-lg p-6", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-4", children: t('setup.title', 'Setup') }), _jsx("p", { className: "text-gray-600 dark:text-gray-300", children: t('setup.description', 'Configure your tax compliance settings') })] }), _jsx("div", { className: "min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "bg-white shadow-lg rounded-2xl border border-gray-100", children: _jsx("div", { className: "p-8", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-8", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-medium text-gray-900 mb-6 flex items-center", children: [_jsx(BuildingOfficeIcon, { className: "h-6 w-6 text-indigo-500 mr-2" }), "Basic Information"] }), _jsxs("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "companyName", className: "block text-sm font-medium text-gray-700", children: "Company Name" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(IdentificationIcon, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { type: "text", name: "companyName", id: "companyName", value: profile.companyName, onChange: (e) => setProfile({ ...profile, companyName: e.target.value }), className: "pl-10 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "trnNumber", className: "block text-sm font-medium text-gray-700", children: "TRN Number" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(DocumentCheckIcon, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { type: "text", name: "trnNumber", id: "trnNumber", value: profile.trnNumber, onChange: (e) => setProfile({ ...profile, trnNumber: e.target.value }), className: "pl-10 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", pattern: "\\d{15}", title: "TRN must be 15 digits", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Email Address" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(EnvelopeIcon, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { type: "email", name: "email", id: "email", value: profile.email, onChange: (e) => setProfile({ ...profile, email: e.target.value }), className: "pl-10 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "phone", className: "block text-sm font-medium text-gray-700", children: "Phone Number" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(PhoneIcon, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { type: "tel", name: "phone", id: "phone", value: profile.phone, onChange: (e) => setProfile({ ...profile, phone: e.target.value }), className: "pl-10 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", required: true })] })] })] })] }), _jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-medium text-gray-900 mb-6 flex items-center", children: [_jsx(BriefcaseIcon, { className: "h-6 w-6 text-indigo-500 mr-2" }), "Business Details"] }), _jsxs("div", { className: "grid grid-cols-1 gap-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "address", className: "block text-sm font-medium text-gray-700", children: "Business Address" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute top-3 left-3 flex items-start pointer-events-none", children: _jsx(MapPinIcon, { className: "h-5 w-5 text-gray-400" }) }), _jsx("textarea", { name: "address", id: "address", value: profile.address, onChange: (e) => setProfile({ ...profile, address: e.target.value }), rows: 3, className: "pl-10 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", required: true })] })] }), _jsxs("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "licenseType", className: "block text-sm font-medium text-gray-700", children: "License Type" }), _jsxs("select", { id: "licenseType", name: "licenseType", value: profile.licenseType, onChange: (e) => setProfile({ ...profile, licenseType: e.target.value }), className: "mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", required: true, children: [_jsx("option", { value: "", children: "Select type" }), _jsx("option", { value: "mainland", children: "Mainland" }), _jsx("option", { value: "freezone", children: "Free Zone" }), _jsx("option", { value: "offshore", children: "Offshore" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "businessActivity", className: "block text-sm font-medium text-gray-700", children: "Business Activity" }), _jsx("input", { type: "text", name: "businessActivity", id: "businessActivity", value: profile.businessActivity, onChange: (e) => setProfile({ ...profile, businessActivity: e.target.value }), className: "mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", required: true })] })] })] })] }), _jsx(Card, { children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Tax Registration Status" }), _jsx(Button, { variant: "outline", size: "sm", icon: _jsx(DocumentCheckIcon, { className: "h-5 w-5" }), onClick: () => window.open('https://www.tax.gov.ae/register', '_blank'), children: "Register Now" })] }), _jsx("div", { className: "bg-gradient-to-b from-gray-50 to-white rounded-xl p-6 border border-gray-100", children: _jsx(ComplianceBadges, { revenue: totalRevenue }) }), _jsxs("div", { className: "grid gap-6 sm:grid-cols-2", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex flex-col space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", id: "vatRegistered", checked: profile.vatRegistered, onChange: (e) => setProfile({ ...profile, vatRegistered: e.target.checked }), className: "h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" }), _jsx("label", { htmlFor: "vatRegistered", className: "ml-2 block text-sm text-gray-900", children: "VAT Registered" })] }), totalRevenue > 375000 && !profile.vatRegistered && (_jsxs("span", { className: "text-sm text-red-600 flex items-center", children: [_jsx(ExclamationCircleIcon, { className: "h-4 w-4 mr-1" }), "Registration Required"] }))] }), profile.vatRegistered && (_jsxs("div", { className: "ml-6 flex items-center text-sm text-green-600", children: [_jsx(CheckCircleIcon, { className: "h-4 w-4 mr-1" }), "Registered for Value Added Tax"] }))] }), _jsxs("div", { className: "flex flex-col space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", id: "citRegistered", checked: profile.citRegistered, onChange: (e) => setProfile({ ...profile, citRegistered: e.target.checked }), className: "h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" }), _jsx("label", { htmlFor: "citRegistered", className: "ml-2 block text-sm text-gray-900", children: "Corporate Income Tax Registered" })] }), totalRevenue > 3000000 && !profile.citRegistered && (_jsxs("span", { className: "text-sm text-red-600 flex items-center", children: [_jsx(ExclamationCircleIcon, { className: "h-4 w-4 mr-1" }), "Registration Required"] }))] }), profile.citRegistered && (_jsxs("div", { className: "ml-6 flex items-center text-sm text-green-600", children: [_jsx(CheckCircleIcon, { className: "h-4 w-4 mr-1" }), "Registered for Corporate Income Tax"] }))] })] }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-4 text-sm text-gray-600", children: [_jsx("h4", { className: "font-medium text-gray-900 mb-2", children: "Registration Requirements" }), _jsxs("ul", { className: "space-y-2", children: [_jsxs("li", { className: "flex items-start", children: [_jsx("span", { className: "flex-shrink-0 h-5 w-5 text-blue-500 mr-1.5", children: _jsx(InformationCircleIcon, {}) }), _jsx("span", { children: "VAT registration is mandatory for businesses with annual revenue exceeding AED 375,000" })] }), _jsxs("li", { className: "flex items-start", children: [_jsx("span", { className: "flex-shrink-0 h-5 w-5 text-blue-500 mr-1.5", children: _jsx(InformationCircleIcon, {}) }), _jsx("span", { children: "Corporate Income Tax applies to businesses with annual revenue over AED 3,000,000" })] })] })] })] })] }) }), _jsxs("div", { className: "flex items-center justify-between pt-6", children: [_jsx("div", { children: saveIndicator && (_jsxs("div", { className: "flex items-center text-sm text-green-600", children: [_jsx(CheckCircleIcon, { className: "h-5 w-5 mr-1" }), saveIndicator] })) }), _jsx("button", { type: "submit", className: "inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500", children: "Save Profile" })] })] }) }) }) }) })] }));
};
export default Setup;
