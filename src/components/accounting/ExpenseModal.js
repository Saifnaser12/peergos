import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { XMarkIcon, CalendarIcon, DocumentTextIcon, BuildingOfficeIcon, TagIcon, BanknotesIcon, ArrowUpTrayIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { expenseCategories, expenseCategoryTranslations } from '../../utils/constants';
const ExpenseModal = ({ isOpen, onClose, onSave, editingExpense }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        date: '',
        description: '',
        vendor: '',
        category: '',
        amount: '',
        receiptFile: null,
        vatType: 'standard',
        paymentMethod: 'bank_transfer'
    });
    const [errors, setErrors] = useState({});
    // Using imported expense categories
    useEffect(() => {
        if (editingExpense) {
            setFormData({
                date: editingExpense.date,
                description: editingExpense.description,
                vendor: editingExpense.vendor,
                category: editingExpense.category,
                amount: editingExpense.amount.toString(),
                receiptFile: null
            });
        }
        else {
            setFormData({
                date: new Date().toISOString().split('T')[0],
                description: '',
                vendor: '',
                category: '',
                amount: '',
                receiptFile: null
            });
        }
        setErrors({});
    }, [editingExpense, isOpen]);
    const validateForm = () => {
        const newErrors = {};
        if (!formData.date) {
            newErrors.date = 'Date is required';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }
        if (!formData.vendor.trim()) {
            newErrors.vendor = 'Vendor is required';
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
        let receiptUrl = editingExpense?.receiptUrl;
        let receiptFileName = editingExpense?.receiptFileName;
        // Handle file upload (simulate with localStorage for demo)
        if (formData.receiptFile) {
            receiptUrl = URL.createObjectURL(formData.receiptFile);
            receiptFileName = formData.receiptFile.name;
        }
        const expenseData = {
            ...(editingExpense || {}),
            date: formData.date,
            description: formData.description.trim(),
            vendor: formData.vendor.trim(),
            category: formData.category,
            amount: parseFloat(formData.amount),
            receiptUrl,
            receiptFileName
        };
        // Save data - this will trigger real-time updates across the app
        onSave(expenseData);
        // Show brief success feedback
        const event = new CustomEvent('expense-saved', {
            detail: {
                amount: expenseData.amount,
                type: editingExpense ? 'updated' : 'added'
            }
        });
        window.dispatchEvent(event);
    };
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, receiptFile: 'Invalid file type. Please upload PDF or JPG files only' }));
                return;
            }
            // Validate file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, receiptFile: 'File size exceeds 10MB limit' }));
                return;
            }
            handleInputChange('receiptFile', file);
            setErrors(prev => ({ ...prev, receiptFile: '' }));
        }
    };
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: editingExpense ? t('accounting.expenses.form.editTitle') : t('accounting.expenses.form.title') }), _jsx("button", { onClick: onClose, className: "p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150", children: _jsx(XMarkIcon, { className: "h-5 w-5" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [_jsx(CalendarIcon, { className: "h-4 w-4 inline mr-2" }), t('accounting.expenses.form.date')] }), _jsx("input", { type: "date", value: formData.date, onChange: (e) => handleInputChange('date', e.target.value), className: `w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${errors.date ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}` }), errors.date && _jsx("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400", children: errors.date })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [_jsx(DocumentTextIcon, { className: "h-4 w-4 inline mr-2" }), t('accounting.expenses.form.description')] }), _jsx("input", { type: "text", value: formData.description, onChange: (e) => handleInputChange('description', e.target.value), placeholder: t('accounting.expenses.form.descriptionPlaceholder'), className: `w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${errors.description ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}` }), errors.description && _jsx("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400", children: errors.description })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [_jsx(BuildingOfficeIcon, { className: "h-4 w-4 inline mr-2" }), t('accounting.expenses.form.vendor')] }), _jsx("input", { type: "text", value: formData.vendor, onChange: (e) => handleInputChange('vendor', e.target.value), placeholder: t('accounting.expenses.form.vendorPlaceholder'), className: `w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${errors.vendor ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}` }), errors.vendor && _jsx("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400", children: errors.vendor })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [_jsx(TagIcon, { className: "h-4 w-4 inline mr-2" }), t('accounting.expenses.form.category')] }), _jsxs("select", { value: formData.category, onChange: (e) => handleInputChange('category', e.target.value), className: `w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${errors.category ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`, children: [_jsx("option", { value: "", children: t('accounting.expenses.form.categoryPlaceholder') }), expenseCategories.map(category => (_jsx("option", { value: category, children: t(expenseCategoryTranslations[category] || category) }, category)))] }), errors.category && _jsx("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400", children: errors.category })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [_jsx(BanknotesIcon, { className: "h-4 w-4 inline mr-2" }), t('accounting.expenses.form.amount')] }), _jsx("input", { type: "number", step: "0.01", min: "0", value: formData.amount, onChange: (e) => handleInputChange('amount', e.target.value), placeholder: t('accounting.expenses.form.amountPlaceholder'), className: `w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${errors.amount ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}` }), errors.amount && _jsx("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400", children: errors.amount })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [_jsx(BanknotesIcon, { className: "h-4 w-4 inline mr-2" }), t('accounting.expenses.form.vatType', 'VAT Type')] }), _jsxs("select", { value: formData.vatType || 'standard', onChange: (e) => handleInputChange('vatType', e.target.value), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-colors duration-150", children: [_jsx("option", { value: "standard", children: t('accounting.vatTypes.standard', 'Standard 5%') }), _jsx("option", { value: "zero", children: t('accounting.vatTypes.zero', 'Zero-rated 0%') }), _jsx("option", { value: "exempt", children: t('accounting.vatTypes.exempt', 'Exempt') })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [_jsx(BanknotesIcon, { className: "h-4 w-4 inline mr-2" }), t('accounting.expenses.form.paymentMethod', 'Payment Method')] }), _jsxs("select", { value: formData.paymentMethod || 'bank_transfer', onChange: (e) => handleInputChange('paymentMethod', e.target.value), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-colors duration-150", children: [_jsx("option", { value: "bank_transfer", children: t('accounting.paymentMethods.bankTransfer', 'Bank Transfer') }), _jsx("option", { value: "wps", children: t('accounting.paymentMethods.wps', 'WPS') }), _jsx("option", { value: "taqa", children: t('accounting.paymentMethods.taqa', 'TAQA') }), _jsx("option", { value: "cash", children: t('accounting.paymentMethods.cash', 'Cash') }), _jsx("option", { value: "card", children: t('accounting.paymentMethods.card', 'Card Payment') }), _jsx("option", { value: "cheque", children: t('accounting.paymentMethods.cheque', 'Cheque') })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [_jsx(DocumentIcon, { className: "h-4 w-4 inline mr-2" }), t('accounting.expenses.form.receipt')] }), _jsxs("div", { className: "border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-150", children: [_jsx("input", { type: "file", onChange: handleFileChange, accept: ".pdf,.jpg,.jpeg,.png", className: "hidden", id: "receipt-upload" }), _jsxs("label", { htmlFor: "receipt-upload", className: "flex flex-col items-center justify-center cursor-pointer", children: [_jsx(ArrowUpTrayIcon, { className: "h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400 text-center", children: formData.receiptFile ? formData.receiptFile.name :
                                                        editingExpense?.receiptFileName || 'Click to upload receipt' }), _jsx("span", { className: "text-xs text-gray-500 dark:text-gray-500 mt-1", children: t('accounting.expenses.form.receiptHelp') })] })] }), errors.receiptFile && _jsx("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400", children: errors.receiptFile })] }), _jsxs("div", { className: "flex space-x-3 pt-4", children: [_jsx("button", { type: "button", onClick: onClose, className: "flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium transition-colors duration-150", children: t('accounting.expenses.form.cancel') }), _jsx("button", { type: "submit", className: "flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors duration-150 shadow-sm hover:shadow-md", children: editingExpense ? t('accounting.expenses.form.update') : t('accounting.expenses.form.save') })] })] })] }) }));
};
export default ExpenseModal;
