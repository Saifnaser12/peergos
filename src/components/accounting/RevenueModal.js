import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { XMarkIcon, CalendarIcon, DocumentTextIcon, UserIcon, BanknotesIcon, DocumentIcon, TagIcon } from '@heroicons/react/24/outline';
import InvoiceModal from './InvoiceModal';
import { freeZoneIncomeTypes, freeZoneIncomeSubcategories, freeZoneIncomeTranslations, categoryConfig } from '../../utils/constants';
import SmartCategoryInput from '../common/SmartCategoryInput';
const RevenueModal = ({ isOpen, onClose, onSave, editingRevenue }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        date: '',
        description: '',
        customer: '',
        category: '',
        amount: '',
        invoiceGenerated: false,
        freeZoneIncomeType: '',
        freeZoneSubcategory: '',
        incomeClassification: 'non-qualifying',
        activityType: '',
        isExport: false,
        isRelatedPartyTransaction: false
    });
    const [lastUsedCategory, setLastUsedCategory] = useState('');
    const [focusIndex, setFocusIndex] = useState(0);
    const fieldRefs = useRef([]);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [errors, setErrors] = useState({});
    const getAvailableSubcategories = () => {
        if (!formData.freeZoneIncomeType)
            return [];
        return freeZoneIncomeSubcategories[formData.freeZoneIncomeType] || [];
    };
    useEffect(() => {
        // Get last used category from localStorage
        const savedCategory = localStorage.getItem('lastUsedRevenueCategory') || '';
        setLastUsedCategory(savedCategory);
        if (editingRevenue) {
            setFormData({
                date: editingRevenue.date,
                description: editingRevenue.description,
                customer: editingRevenue.customer || '',
                category: editingRevenue.category || '',
                amount: editingRevenue.amount.toString(),
                invoiceGenerated: editingRevenue.invoiceGenerated,
                freeZoneIncomeType: editingRevenue.freeZoneIncomeType || '',
                freeZoneSubcategory: editingRevenue.freeZoneSubcategory || '',
                incomeClassification: editingRevenue.incomeClassification || 'non-qualifying',
                activityType: editingRevenue.activityType || '',
                isExport: editingRevenue.isExport || false,
                isRelatedPartyTransaction: editingRevenue.isRelatedPartyTransaction || false
            });
        }
        else {
            // Smart defaults for new entries
            setFormData({
                date: new Date().toISOString().split('T')[0], // Today's date
                description: '',
                customer: '',
                category: savedCategory, // Last used category
                amount: '',
                invoiceGenerated: false,
                freeZoneIncomeType: '',
                freeZoneSubcategory: '',
                incomeClassification: 'non-qualifying',
                activityType: '',
                isExport: false,
                isRelatedPartyTransaction: false
            });
        }
        setErrors({});
        setFocusIndex(0);
    }, [editingRevenue, isOpen]);
    // Focus management for keyboard navigation
    useEffect(() => {
        if (isOpen && fieldRefs.current[focusIndex]) {
            fieldRefs.current[focusIndex]?.focus();
        }
    }, [focusIndex, isOpen]);
    // Auto-classify income based on activity type
    useEffect(() => {
        let classification = 'non-qualifying';
        if (formData.isExport ||
            formData.activityType === 'export-services' ||
            formData.activityType === 'intra-zone-trade' ||
            formData.activityType === 'qualifying-activities') {
            classification = 'qualifying';
        }
        if (formData.incomeClassification !== classification) {
            setFormData(prev => ({ ...prev, incomeClassification: classification }));
        }
    }, [formData.activityType, formData.isExport]);
    const validateForm = () => {
        const newErrors = {};
        if (!formData.date) {
            newErrors.date = 'Date is required';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }
        if (!formData.category) {
            newErrors.category = 'Category is required';
        }
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        // Save last used category
        if (formData.category) {
            localStorage.setItem('lastUsedRevenueCategory', formData.category);
        }
        const revenueData = {
            date: formData.date,
            description: formData.description.trim(),
            customer: formData.customer.trim() || undefined,
            category: formData.category,
            amount: parseFloat(formData.amount),
            invoiceGenerated: formData.invoiceGenerated,
            invoiceId: formData.invoiceGenerated ? Date.now().toString() : undefined,
            freeZoneIncomeType: formData.freeZoneIncomeType || undefined,
            freeZoneSubcategory: formData.freeZoneSubcategory || undefined,
            incomeClassification: formData.incomeClassification,
            activityType: formData.activityType,
            isExport: formData.isExport,
            isRelatedPartyTransaction: formData.isRelatedPartyTransaction
        };
        // Save data - this will trigger real-time updates across the app
        onSave(revenueData);
        // Show brief success feedback
        const event = new CustomEvent('revenue-saved', {
            detail: {
                amount: revenueData.amount,
                type: editingRevenue ? 'updated' : 'added'
            }
        });
        window.dispatchEvent(event);
        // Show invoice modal if invoice generation was toggled
        if (formData.invoiceGenerated) {
            setShowInvoiceModal(true);
        }
    };
    // Keyboard navigation handlers
    const handleKeyDown = (e, currentIndex) => {
        if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault();
            setFocusIndex(prev => Math.min(prev + 1, fieldRefs.current.length - 1));
        }
        else if (e.key === 'Tab' && e.shiftKey) {
            e.preventDefault();
            setFocusIndex(prev => Math.max(prev - 1, 0));
        }
        else if (e.key === 'Enter' && currentIndex === fieldRefs.current.length - 1) {
            // Submit form when pressing Enter on last field
            handleSubmit(e);
        }
    };
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: editingRevenue ? t('accounting.revenue.form.editTitle') : t('accounting.revenue.form.title') }), _jsx("button", { onClick: onClose, className: "p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150", children: _jsx(XMarkIcon, { className: "h-5 w-5" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [_jsx(CalendarIcon, { className: "h-4 w-4 inline mr-2" }), t('accounting.revenue.form.date')] }), _jsx("input", { type: "date", value: formData.date, onChange: (e) => handleInputChange('date', e.target.value), className: `w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${errors.date ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}` }), errors.date && _jsx("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400", children: errors.date })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [_jsx(DocumentTextIcon, { className: "h-4 w-4 inline mr-2" }), t('accounting.revenue.form.description')] }), _jsx("input", { type: "text", value: formData.description, onChange: (e) => handleInputChange('description', e.target.value), placeholder: t('accounting.revenue.form.descriptionPlaceholder'), className: `w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${errors.description ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}` }), errors.description && _jsx("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400", children: errors.description })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [_jsx(UserIcon, { className: "h-4 w-4 inline mr-2" }), t('accounting.revenue.form.customer')] }), _jsx("input", { type: "text", value: formData.customer, onChange: (e) => handleInputChange('customer', e.target.value), placeholder: t('accounting.revenue.form.customerPlaceholder'), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-150" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [_jsx(TagIcon, { className: "h-4 w-4 inline mr-2" }), t('accounting.revenue.form.category'), lastUsedCategory && !editingRevenue && (_jsxs("span", { className: "ml-2 text-xs text-blue-600 dark:text-blue-400", children: ["(Last: ", lastUsedCategory.replace(/-/g, ' '), ")"] }))] }), _jsx(SmartCategoryInput, { type: "revenue", value: formData.category, onChange: (value) => handleInputChange('category', value), placeholder: t('accounting.revenue.form.categoryPlaceholder'), className: `w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${errors.category ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`, onKeyDown: (e) => handleKeyDown(e, 2) }), errors.category && _jsx("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400", children: errors.category }), formData.category && categoryConfig.revenue[formData.category] && (_jsxs("div", { className: "mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400", children: [_jsx("span", { className: "text-lg mr-2", children: categoryConfig.revenue[formData.category].icon }), _jsx("div", { className: "w-3 h-3 rounded-full mr-2", style: { backgroundColor: categoryConfig.revenue[formData.category].color } }), _jsx("span", { className: "capitalize", children: formData.category.replace(/-/g, ' ') })] }))] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [_jsx(BanknotesIcon, { className: "h-4 w-4 inline mr-2" }), t('accounting.revenue.form.amount')] }), _jsx("input", { type: "number", step: "0.01", min: "0", value: formData.amount, onChange: (e) => handleInputChange('amount', e.target.value), placeholder: t('accounting.revenue.form.amountPlaceholder'), className: `w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${errors.amount ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}` }), errors.amount && _jsx("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400", children: errors.amount })] }), _jsxs("div", { className: "space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800", children: [_jsxs("h4", { className: "text-sm font-semibold text-blue-900 dark:text-blue-200 flex items-center", children: [_jsx("svg", { className: "h-4 w-4 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" }) }), t('accounting.revenue.form.freeZoneClassification', 'Free Zone Income Classification')] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: t('accounting.revenue.form.incomeType', 'Income Type') }), _jsxs("select", { value: formData.freeZoneIncomeType, onChange: (e) => {
                                                    handleInputChange('freeZoneIncomeType', e.target.value);
                                                    handleInputChange('freeZoneSubcategory', ''); // Reset subcategory
                                                }, className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-150", children: [_jsx("option", { value: "", children: t('accounting.revenue.form.selectIncomeType', 'Select Income Type') }), freeZoneIncomeTypes.map(type => (_jsx("option", { value: type, children: t(freeZoneIncomeTranslations[type] || type) }, type)))] })] }), formData.freeZoneIncomeType && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: t('accounting.revenue.form.subcategory', 'Subcategory') }), _jsxs("select", { value: formData.freeZoneSubcategory, onChange: (e) => handleInputChange('freeZoneSubcategory', e.target.value), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-150", children: [_jsx("option", { value: "", children: t('accounting.revenue.form.selectSubcategory', 'Select Subcategory') }), getAvailableSubcategories().map(subcategory => (_jsx("option", { value: subcategory, children: t(freeZoneIncomeTranslations[subcategory] || subcategory) }, subcategory)))] })] })), formData.freeZoneIncomeType === 'non-qualifying' && (_jsx("div", { className: "p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg", children: _jsxs("div", { className: "flex items-center", children: [_jsx("svg", { className: "h-4 w-4 text-orange-600 dark:text-orange-400 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" }) }), _jsx("span", { className: "text-sm text-orange-800 dark:text-orange-200", children: t('accounting.revenue.form.nonQualifyingWarning', 'Non-qualifying income may affect QFZP status if it exceeds de minimis thresholds (5% or AED 5M)') })] }) }))] }), _jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(DocumentIcon, { className: "h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: t('accounting.revenue.form.generateInvoice') }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: t('accounting.revenue.form.generateInvoiceHelp') })] })] }), _jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: formData.invoiceGenerated, onChange: (e) => handleInputChange('invoiceGenerated', e.target.checked), className: "sr-only" }), _jsx("div", { className: `w-11 h-6 rounded-full transition-colors duration-200 ${formData.invoiceGenerated ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`, children: _jsx("div", { className: `w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${formData.invoiceGenerated ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5` }) })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: t('accounting.revenue.form.activityType', 'Activity Type') }), _jsxs("select", { value: formData.activityType, onChange: (e) => handleInputChange('activityType', e.target.value), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-150", children: [_jsx("option", { value: "", children: t('accounting.revenue.form.selectActivityType', 'Select Activity Type') }), _jsx("option", { value: "export-services", children: t('accounting.revenue.form.exportServices', 'Export Services') }), _jsx("option", { value: "other", children: t('accounting.revenue.form.other', 'Other') })] })] }), _jsx("div", { children: _jsxs("label", { className: "inline-flex items-center", children: [_jsx("input", { type: "checkbox", className: "form-checkbox h-5 w-5 text-blue-600", checked: formData.isExport, onChange: (e) => handleInputChange('isExport', e.target.checked) }), _jsx("span", { className: "ml-2 text-gray-700 dark:text-gray-300", children: t('accounting.revenue.form.isExport', 'Is Export') })] }) })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("input", { type: "checkbox", id: "relatedPartyTransaction", checked: formData.isRelatedPartyTransaction || false, onChange: (e) => handleInputChange('isRelatedPartyTransaction', e.target.checked), className: "h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" }), _jsx("label", { htmlFor: "relatedPartyTransaction", className: "text-sm text-gray-700 dark:text-gray-300", children: t('accounting.revenue.relatedPartyTransaction', 'Related Party Transaction') })] }), _jsxs("div", { className: "flex space-x-3 pt-4", children: [_jsx("button", { type: "button", onClick: onClose, className: "flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium transition-colors duration-150", children: t('accounting.revenue.form.cancel') }), _jsx("button", { type: "submit", className: "flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-150 shadow-sm hover:shadow-md", children: editingRevenue ? t('accounting.revenue.form.update') : t('accounting.revenue.form.save') })] })] })] }), showInvoiceModal && (_jsx(InvoiceModal, { isOpen: showInvoiceModal, onClose: () => {
                    setShowInvoiceModal(false);
                    onClose(); // Close the revenue modal too
                }, revenueData: {
                    customer: formData.customer,
                    amount: parseFloat(formData.amount),
                    description: formData.description,
                    date: formData.date
                } }))] }));
};
export default RevenueModal;
