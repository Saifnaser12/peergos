import React, { useState, useEffect, useRef } from 'react';
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
import { expenseCategories, expenseCategoryTranslations, categoryConfig } from '../../utils/constants';
import { SecureFileStorage } from '../../utils/fileStorage';
import SmartCategoryInput from '../common/SmartCategoryInput';


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
  const [isUploading, setIsUploading] = useState(false);
  const [lastUsedCategory, setLastUsedCategory] = useState<string>('');
  const [focusIndex, setFocusIndex] = useState(0);
  const fieldRefs = useRef<(HTMLInputElement | HTMLSelectElement | null)[]>([]);

  // Using imported expense categories

  useEffect(() => {
    // Get last used category from localStorage
    const savedCategory = localStorage.getItem('lastUsedExpenseCategory') || '';
    setLastUsedCategory(savedCategory);

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
      // Smart defaults for new entries
      setFormData({
        date: new Date().toISOString().split('T')[0], // Today's date
        description: '',
        vendor: '',
        category: savedCategory, // Last used category
        amount: '',
        receiptFile: null
      });
    }
    setErrors({});
    setFocusIndex(0);
  }, [editingExpense, isOpen]);

  // Focus management for keyboard navigation
  useEffect(() => {
    if (isOpen && fieldRefs.current[focusIndex]) {
      fieldRefs.current[focusIndex]?.focus();
    }
  }, [focusIndex, isOpen]);

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

    // FTA compliance: Mandatory receipt/invoice upload
    if (!formData.receiptFile && !editingExpense?.receiptUrl) {
      newErrors.receiptFile = 'FTA-compliant documentation is mandatory for recorded expenses';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsUploading(true);

    let receiptUrl = editingExpense?.receiptUrl;
    let receiptFileName = editingExpense?.receiptFileName;
    let receiptFileId = editingExpense?.receiptFileId;

    // Handle FTA-compliant file storage
    if (formData.receiptFile) {
      try {
        const currentYear = new Date().getFullYear().toString();
        const storedFile = await SecureFileStorage.storeExpenseReceipt({
          companyId: 'default-company', // In production, get from context
          financialYear: currentYear,
          category: formData.category,
          fileName: formData.receiptFile.name,
          file: formData.receiptFile
        });

        receiptUrl = `stored://${storedFile.id}`;
        receiptFileName = storedFile.originalName;
        receiptFileId = storedFile.id;
      } catch (error) {
        setErrors(prev => ({ ...prev, receiptFile: 'Failed to upload file securely. Please try again.' }));
        setIsUploading(false);
        return;
      }
    }

    const expenseData = {
      ...(editingExpense || {}),
      date: formData.date,
      description: formData.description.trim(),
      vendor: formData.vendor.trim(),
      category: formData.category,
      amount: parseFloat(formData.amount),
      receiptUrl,
      receiptFileName,
      receiptFileId, // Store file ID for secure retrieval
      ftaCompliant: true // Mark as FTA compliant
    };

    // Save last used category
    if (formData.category) {
      localStorage.setItem('lastUsedExpenseCategory', formData.category);
    }

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

    setIsUploading(false);
  };

  // Keyboard navigation handlers
  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      setFocusIndex(prev => Math.min(prev + 1, fieldRefs.current.length - 1));
    } else if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault();
      setFocusIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && currentIndex === fieldRefs.current.length - 1) {
      // Submit form when pressing Enter on last field
      handleSubmit(e as any);
    }
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
      // Validate file type - FTA accepts PDF, JPEG, PNG
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, receiptFile: 'Invalid file type. FTA requires PDF, JPEG, or PNG files only' }));
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

          {/* Category with Smart Suggestions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <TagIcon className="h-4 w-4 inline mr-2" />
              {t('accounting.expenses.form.category')}
              {lastUsedCategory && !editingExpense && (
                <span className="ml-2 text-xs text-red-600 dark:text-red-400">
                  (Last: {lastUsedCategory.replace(/-/g, ' ')})
                </span>
              )}
            </label>
            <SmartCategoryInput
              type="expense"
              value={formData.category}
              onChange={(value) => handleInputChange('category', value)}
              placeholder={t('accounting.expenses.form.categoryPlaceholder')}
              className={`w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${
                errors.category ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              }`}
              onKeyDown={(e) => handleKeyDown(e, 3)}
            />
            {errors.category && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>}
            
            {/* Show category preview */}
            {formData.category && categoryConfig.expense[formData.category as keyof typeof categoryConfig.expense] && (
              <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="text-lg mr-2">
                  {categoryConfig.expense[formData.category as keyof typeof categoryConfig.expense].icon}
                </span>
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: categoryConfig.expense[formData.category as keyof typeof categoryConfig.expense].color }}
                ></div>
                <span className="capitalize">{formData.category.replace(/-/g, ' ')}</span>
              </div>
            )}
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

          {/* Receipt Upload - FTA Required */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <DocumentIcon className="h-4 w-4 inline mr-2" />
              {t('accounting.expenses.form.receipt')} 
              <span className="text-red-500 ml-1">*</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1">
                Attach Tax Invoice or Proof of Expense (FTA Required)
              </span>
            </label>
            <div className={`border-2 border-dashed rounded-xl p-4 transition-colors duration-150 ${
              errors.receiptFile ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10' : 
              'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}>
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
                <ArrowUpTrayIcon className={`h-8 w-8 mb-2 ${
                  errors.receiptFile ? 'text-red-400 dark:text-red-500' : 'text-gray-400 dark:text-gray-500'
                }`} />
                <span className="text-sm text-gray-600 dark:text-gray-400 text-center font-medium">
                  {formData.receiptFile ? formData.receiptFile.name : 
                   editingExpense?.receiptFileName || 'Upload Tax Invoice or Proof of Expense'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500 mt-1 text-center">
                  PDF, JPEG, PNG files only (Max 10MB)
                </span>
                <span className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium">
                  Required for FTA compliance
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
              disabled={isUploading}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors duration-150 shadow-sm hover:shadow-md flex items-center justify-center"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                editingExpense ? t('accounting.expenses.form.update') : t('accounting.expenses.form.save')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;