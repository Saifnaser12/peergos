import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { XMarkIcon, CalendarIcon, DocumentTextIcon, UserIcon, BanknotesIcon, DocumentIcon, TagIcon } from '@heroicons/react/24/outline';
import InvoiceModal from './InvoiceModal';
import { revenueCategories, revenueCategoryTranslations } from '../../utils/constants';
const RevenueModal = ({ isOpen, onClose, onSave, editingRevenue }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        date: '',
        description: '',
        customer: '',
        category: '',
        amount: '',
        invoiceGenerated: false
    });
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (editingRevenue) {
            setFormData({
                date: editingRevenue.date,
                description: editingRevenue.description,
                customer: editingRevenue.customer || '',
                category: editingRevenue.category || '',
                amount: editingRevenue.amount.toString(),
                invoiceGenerated: editingRevenue.invoiceGenerated
            });
        }
        else {
            setFormData({
                date: new Date().toISOString().split('T')[0],
                description: '',
                customer: '',
                category: '',
                amount: '',
                invoiceGenerated: false
            });
        }
        setErrors({});
    }, [editingRevenue, isOpen]);
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
        const revenueData = {
            date: formData.date,
            description: formData.description.trim(),
            customer: formData.customer.trim() || undefined,
            category: formData.category,
            amount: parseFloat(formData.amount),
            invoiceGenerated: formData.invoiceGenerated,
            invoiceId: formData.invoiceGenerated ? Date.now().toString() : undefined
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
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: editingRevenue ? t('accounting.revenue.form.editTitle') : t('accounting.revenue.form.title') }), _jsx("button", { onClick: onClose, className: "p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150", children: _jsx(XMarkIcon, { className: "h-5 w-5" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [_jsx(CalendarIcon, { className: "h-4 w-4 inline mr-2" }), t('accounting.revenue.form.date')] }), _jsx("input", { type: "date", value: formData.date, onChange: (e) => handleInputChange('date', e.target.value), className: `w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${errors.date ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}` }), errors.date && _jsx("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400", children: errors.date })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [_jsx(DocumentTextIcon, { className: "h-4 w-4 inline mr-2" }), t('accounting.revenue.form.description')] }), _jsx("input", { type: "text", value: formData.description, onChange: (e) => handleInputChange('description', e.target.value), placeholder: t('accounting.revenue.form.descriptionPlaceholder'), className: `w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${errors.description ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}` }), errors.description && _jsx("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400", children: errors.description })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [_jsx(UserIcon, { className: "h-4 w-4 inline mr-2" }), t('accounting.revenue.form.customer')] }), _jsx("input", { type: "text", value: formData.customer, onChange: (e) => handleInputChange('customer', e.target.value), placeholder: t('accounting.revenue.form.customerPlaceholder'), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-150" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [_jsx(TagIcon, { className: "h-4 w-4 inline mr-2" }), t('accounting.revenue.form.category')] }), _jsxs("select", { value: formData.category, onChange: (e) => handleInputChange('category', e.target.value), className: `w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${errors.category ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`, children: [_jsx("option", { value: "", children: t('accounting.revenue.form.categoryPlaceholder') }), revenueCategories.map(category => (_jsx("option", { value: category, children: t(revenueCategoryTranslations[category] || category) }, category)))] }), errors.category && _jsx("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400", children: errors.category })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [_jsx(BanknotesIcon, { className: "h-4 w-4 inline mr-2" }), t('accounting.revenue.form.amount')] }), _jsx("input", { type: "number", step: "0.01", min: "0", value: formData.amount, onChange: (e) => handleInputChange('amount', e.target.value), placeholder: t('accounting.revenue.form.amountPlaceholder'), className: `w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${errors.amount ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}` }), errors.amount && _jsx("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400", children: errors.amount })] }), _jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(DocumentIcon, { className: "h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: t('accounting.revenue.form.generateInvoice') }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: t('accounting.revenue.form.generateInvoiceHelp') })] })] }), _jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: formData.invoiceGenerated, onChange: (e) => handleInputChange('invoiceGenerated', e.target.checked), className: "sr-only" }), _jsx("div", { className: `w-11 h-6 rounded-full transition-colors duration-200 ${formData.invoiceGenerated ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`, children: _jsx("div", { className: `w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${formData.invoiceGenerated ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5` }) })] })] }), _jsxs("div", { className: "flex space-x-3 pt-4", children: [_jsx("button", { type: "button", onClick: onClose, className: "flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium transition-colors duration-150", children: t('accounting.revenue.form.cancel') }), _jsx("button", { type: "submit", className: "flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-150 shadow-sm hover:shadow-md", children: editingRevenue ? t('accounting.revenue.form.update') : t('accounting.revenue.form.save') })] })] })] }), showInvoiceModal && (_jsx(InvoiceModal, { isOpen: showInvoiceModal, onClose: () => {
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
