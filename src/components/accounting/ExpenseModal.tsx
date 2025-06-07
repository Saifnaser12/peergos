
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  XMarkIcon,
  CalendarIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  TagIcon,
  BanknotesIcon,
  ArrowUpTrayIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';

interface ExpenseEntry {
  id: string;
  date: string;
  description: string;
  vendor: string;
  category: string;
  amount: number;
  receiptUrl?: string;
  receiptFileName?: string;
  createdAt: string;
}

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: any) => void;
  editingExpense?: ExpenseEntry | null;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingExpense
}) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    vendor: '',
    category: '',
    amount: '',
    receiptFile: null as File | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'rent',
    'salaries',
    'supplies',
    'utilities',
    'marketing',
    'other'
  ];

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
    } else {
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
    const newErrors: Record<string, string> = {};

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

  const handleSubmit = (e: React.FormEvent) => {
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

    onSave(expenseData);
  };

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {editingExpense ? t('accounting.expenses.form.editTitle') : t('accounting.expenses.form.title')}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <CalendarIcon className="h-4 w-4 inline mr-2" />
              {t('accounting.expenses.form.date')}
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={`w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${
                errors.date ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.date && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <DocumentTextIcon className="h-4 w-4 inline mr-2" />
              {t('accounting.expenses.form.description')}
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={t('accounting.expenses.form.descriptionPlaceholder')}
              className={`w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${
                errors.description ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
          </div>

          {/* Vendor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <BuildingOfficeIcon className="h-4 w-4 inline mr-2" />
              {t('accounting.expenses.form.vendor')}
            </label>
            <input
              type="text"
              value={formData.vendor}
              onChange={(e) => handleInputChange('vendor', e.target.value)}
              placeholder={t('accounting.expenses.form.vendorPlaceholder')}
              className={`w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${
                errors.vendor ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.vendor && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.vendor}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <TagIcon className="h-4 w-4 inline mr-2" />
              {t('accounting.expenses.form.category')}
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${
                errors.category ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">{t('accounting.expenses.form.categoryPlaceholder')}</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {t(`accounting.expenses.categories.${category}`)}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <BanknotesIcon className="h-4 w-4 inline mr-2" />
              {t('accounting.expenses.form.amount')}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder={t('accounting.expenses.form.amountPlaceholder')}
              className={`w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${
                errors.amount ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.amount && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount}</p>}
          </div>

          {/* Receipt Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <DocumentIcon className="h-4 w-4 inline mr-2" />
              {t('accounting.expenses.form.receipt')}
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-150">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                id="receipt-upload"
              />
              <label
                htmlFor="receipt-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <ArrowUpTrayIcon className="h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  {formData.receiptFile ? formData.receiptFile.name : 
                   editingExpense?.receiptFileName || 'Click to upload receipt'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {t('accounting.expenses.form.receiptHelp')}
                </span>
              </label>
            </div>
            {errors.receiptFile && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.receiptFile}</p>}
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium transition-colors duration-150"
            >
              {t('accounting.expenses.form.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors duration-150 shadow-sm hover:shadow-md"
            >
              {editingExpense ? t('accounting.expenses.form.update') : t('accounting.expenses.form.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
