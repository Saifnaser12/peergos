
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  XMarkIcon,
  DocumentTextIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  revenueData: {
    description: string;
    amount: number;
    customer?: string;
    date: string;
  } | null;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  revenueData
}) => {
  const { t } = useTranslation();
  
  const [invoiceData, setInvoiceData] = useState({
    customerName: '',
    dueDate: '',
    serviceDescription: '',
    includeVAT: true,
    invoiceNumber: ''
  });

  useEffect(() => {
    if (isOpen && revenueData) {
      // Generate invoice number
      const date = new Date();
      const year = date.getFullYear();
      const invoiceNumber = `INV-${year}-${String(Date.now()).slice(-5)}`;
      
      // Calculate due date (30 days from today)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      
      setInvoiceData({
        customerName: revenueData.customer || '',
        dueDate: dueDate.toISOString().split('T')[0],
        serviceDescription: revenueData.description,
        includeVAT: true,
        invoiceNumber
      });
    }
  }, [isOpen, revenueData]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setInvoiceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateAmounts = () => {
    if (!revenueData) return { subtotal: 0, vat: 0, total: 0 };
    
    const subtotal = revenueData.amount;
    const vat = invoiceData.includeVAT ? subtotal * 0.05 : 0;
    const total = subtotal + vat;
    
    return { subtotal, vat, total };
  };

  const { subtotal, vat, total } = calculateAmounts();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleGenerateInvoice = () => {
    // TODO: Implement PDF generation
    console.log('Generating invoice PDF...', {
      ...invoiceData,
      amounts: { subtotal, vat, total }
    });
    
    // Close modal after generation
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <DocumentTextIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {t('accounting.invoice.title')}
                  </h3>
                  <p className="text-blue-100 text-sm">
                    {invoiceData.invoiceNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-150"
              >
                <XMarkIcon className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Customer Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('accounting.invoice.customerName')}
              </label>
              <input
                type="text"
                value={invoiceData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-150"
                placeholder={t('accounting.invoice.customerNamePlaceholder')}
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('accounting.invoice.dueDate')}
              </label>
              <input
                type="date"
                value={invoiceData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-150"
              />
            </div>

            {/* Service Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('accounting.invoice.serviceDescription')}
              </label>
              <textarea
                value={invoiceData.serviceDescription}
                onChange={(e) => handleInputChange('serviceDescription', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-150"
                placeholder={t('accounting.invoice.serviceDescriptionPlaceholder')}
              />
            </div>

            {/* VAT Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('accounting.invoice.includeVAT')}
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('accounting.invoice.includeVATHelp')}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={invoiceData.includeVAT}
                  onChange={(e) => handleInputChange('includeVAT', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Invoice Summary */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 space-y-3">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('accounting.invoice.summary')}
              </h4>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{t('accounting.invoice.subtotal')}:</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
              </div>
              
              {invoiceData.includeVAT && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{t('accounting.invoice.vat')} (5%):</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(vat)}</span>
                </div>
              )}
              
              <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900 dark:text-white">{t('accounting.invoice.total')}:</span>
                  <span className="text-blue-600 dark:text-blue-400">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150 font-medium"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleGenerateInvoice}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-150 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
            >
              <PrinterIcon className="h-5 w-5 mr-2" />
              {t('accounting.invoice.generatePDF')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
