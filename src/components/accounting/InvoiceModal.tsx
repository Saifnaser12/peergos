import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { 
  XMarkIcon,
  CalendarIcon,
  DocumentTextIcon,
  UserIcon,
  BanknotesIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  BuildingOfficeIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice, InvoiceItem, FTAEInvoice } from '../../types/invoice';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  revenueData: {
    customer: string;
    amount: number;
    description: string;
    date: string;
  };
}

interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  supplierTRN: string;
  businessName: string;
  customerName: string;
  customerTRN?: string;
  serviceDescription: string;
  subtotal: number;
  vat: number;
  total: number;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  revenueData
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    invoiceNumber: '',
    customerName: '',
    customerTRN: '',
    issueDate: '',
    dueDate: '',
    serviceDescription: '',
    amount: 0,
    vatEnabled: true,
    customerAddress: {
      street: '',
      city: 'Dubai',
      emirate: 'Dubai',
      country: 'UAE',
      postalCode: ''
    },
    customerContact: {
      phone: '',
      email: ''
    }
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutputs, setGeneratedOutputs] = useState<{
    pdf: Blob;
    ftaJson: FTAEInvoice;
    xmlString: string;
  } | null>(null);
  const [showXmlPreview, setShowXmlPreview] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const invoiceService = InvoiceService.getInstance();

  // Generate invoice number
  const generateInvoiceNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `INV-${year}${month}${day}-${random}`;
  };

  useEffect(() => {
    if (isOpen && revenueData) {
      const today = new Date();
      const dueDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

      setFormData(prev => ({
        ...prev,
        invoiceNumber: generateInvoiceNumber(),
        customerName: revenueData.customer || 'Client',
        serviceDescription: revenueData.description || '',
        amount: revenueData.amount || 0,
        issueDate: today.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0]
      }));
    }
  }, [isOpen, revenueData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = t('invoice.validation.customerNameRequired');
    }

    if (!formData.issueDate) {
      newErrors.issueDate = t('invoice.validation.dueDateRequired');
    }

    if (!formData.dueDate) {
      newErrors.dueDate = t('invoice.validation.dueDateRequired');
    }

    if (!formData.serviceDescription.trim()) {
      newErrors.serviceDescription = t('invoice.validation.descriptionRequired');
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = t('invoice.validation.amountPositive');
    }

    if (formData.customerTRN && !/^\d{15}$/.test(formData.customerTRN)) {
      newErrors.customerTRN = t('invoice.validation.invalidTRN');
    }

    if (!formData.customerAddress.street.trim()) {
      newErrors.customerStreet = t('invoice.validation.addressRequired');
    }

    if (!formData.customerAddress.city.trim()) {
      newErrors.customerCity = t('invoice.validation.cityRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateInvoice = async () => {
    if (!validateForm()) {
      return;
    }

    setIsGenerating(true);
    try {
      // Get company info from localStorage or default
      const companyInfo = JSON.parse(localStorage.getItem('companyInfo') || '{}');

      const baseAmount = formData.amount;
      const vatRate = formData.vatEnabled ? 5 : 0;
      const vatAmount = (baseAmount * vatRate) / 100;
      const totalAmount = baseAmount + vatAmount;

      const invoiceItem: InvoiceItem = {
        id: uuidv4(),
        description: formData.serviceDescription,
        quantity: 1,
        unitPrice: baseAmount,
        totalAmount,
        taxAmount: vatAmount,
        taxableAmount: baseAmount,
        productCode: 'SERVICE-001',
        taxCategory: formData.vatEnabled ? 'S' : 'Z',
        taxRate: vatRate,
        unitsOfMeasure: 'PCE',
        classifiedTaxCategory: formData.vatEnabled ? 'S' : 'Z',
        sellersItemIdentification: 'SERVICE-001'
      };

      const invoice: Invoice = {
        id: uuidv4(),
        invoiceNumber: formData.invoiceNumber,
        issueDate: formData.issueDate,
        dueDate: formData.dueDate,
        currency: 'AED',
        amount: totalAmount,
        vatAmount,
        subtotal: baseAmount,

        seller: {
          name: companyInfo.name || 'Your Company Name',
          taxRegistrationNumber: companyInfo.trn || '100000000000003',
          address: {
            street: companyInfo.address?.street || 'Business Bay',
            city: companyInfo.address?.city || 'Dubai',
            emirate: companyInfo.address?.emirate || 'Dubai',
            country: 'UAE',
            postalCode: companyInfo.address?.postalCode || '00000'
          },
          contactDetails: {
            phone: companyInfo.phone || '+971-50-000-0000',
            email: companyInfo.email || 'info@company.ae'
          }
        },

        buyer: {
          name: formData.customerName,
          taxRegistrationNumber: formData.customerTRN || undefined,
          address: {
            street: formData.customerAddress.street,
            city: formData.customerAddress.city,
            emirate: formData.customerAddress.emirate,
            country: formData.customerAddress.country,
            postalCode: formData.customerAddress.postalCode
          },
          contactDetails: {
            phone: formData.customerContact.phone || undefined,
            email: formData.customerContact.email || undefined
          }
        },

        items: [invoiceItem],

        // UAE FTA specific fields
        uuid: uuidv4(),

        // PINT AE compliance
        customizationID: "urn:cen.eu:en16931:2017#compliant#urn:xeinkauf.de:kosit:xrechnung_3.0",
        profileID: "urn:fdc:peppol.eu:2017:poacc:billing:01:1.0",
        businessProcessTypeID: "urn:fdc:peppol.eu:2017:poacc:billing:01:1.0",

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Generate dual output
      const outputs = await invoiceService.generateDualOutput(invoice, i18n.language as 'en' | 'ar');
      setGeneratedOutputs(outputs);

    } catch (error) {
      console.error('Error generating invoice:', error);
      alert(t('invoice.error.generationFailed'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!generatedOutputs) return;

    const url = URL.createObjectURL(generatedOutputs.pdf);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${formData.invoiceNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    if (!generatedOutputs) return;

    const blob = new Blob([JSON.stringify(generatedOutputs.ftaJson, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fta-einvoice-${formData.invoiceNumber}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadXML = () => {
    const invoiceData: InvoiceData = {
      invoiceNumber: formData.invoiceNumber,
      issueDate: formData.issueDate,
      supplierTRN: '123456789012345', // This should come from user profile
      businessName: 'Your Business Name', // This should come from user profile
      customerName: formData.customerName,
      customerTRN: formData.customerTRN,
      serviceDescription: formData.serviceDescription,
      subtotal: formData.amount,
      vat: formData.vatEnabled ? formData.amount * 0.05 : 0,
      total: formData.vatEnabled ? formData.amount * 1.05 : formData.amount
    };

    downloadInvoiceXML(invoiceData);
  };

  const handleInputChange = (field: string, value: string | number | boolean, nested?: string) => {
    if (nested) {
      setFormData(prev => ({
        ...prev,
        [nested]: {
          ...prev[nested as keyof typeof prev] as any,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const subtotal = formData.amount;
  const vatAmount = formData.vatEnabled ? (subtotal * 0.05) : 0;
  const totalAmount = subtotal + vatAmount;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <DocumentArrowDownIcon className="h-6 w-6 mr-3 text-blue-600" />
            {t('invoice.modal.title')}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {!generatedOutputs ? (
          /* Invoice Form */
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Invoice Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                    <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                    {t('invoice.modal.invoiceInfo')}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('invoice.modal.invoiceNumber')}
                      </label>
                      <input
                        type="text"
                        value={formData.invoiceNumber}
                        onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-50 font-mono text-sm"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <CalendarIcon className="h-4 w-4 inline mr-2" />
                        {t('invoice.modal.issueDate')}
                      </label>
                      <input
                        type="date"
                        value={formData.issueDate}
                        onChange={(e) => handleInputChange('issueDate', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${
                          errors.issueDate ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {errors.issueDate && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.issueDate}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <CalendarIcon className="h-4 w-4 inline mr-2" />
                      {t('invoice.modal.dueDate')}
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${
                        errors.dueDate ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.dueDate && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.dueDate}</p>}
                  </div>
                </div>

                {/* Supplier Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                    {t('invoice.modal.supplierInfo')}
                  </h4>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{t('invoice.modal.supplierName')}:</span>
                        <span className="font-medium">Your Company Name</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{t('invoice.modal.supplierTRN')}:</span>
                        <span className="font-medium font-mono">100000000000003</span>
                      </div>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                        Configure in System Setup to personalize
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                    <UserIcon className="h-5 w-5 mr-2" />
                    {t('invoice.modal.customerInfo')}
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('invoice.modal.customerName')} *
                    </label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${
                        errors.customerName ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder={t('invoice.modal.customerNamePlaceholder')}
                    />
                    {errors.customerName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customerName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('invoice.modal.customerTRN')}
                    </label>
                    <input
                      type="text"
                      value={formData.customerTRN}
                      onChange={(e) => handleInputChange('customerTRN', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${
                        errors.customerTRN ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder={t('invoice.modal.customerTRNPlaceholder')}
                    />
                    {errors.customerTRN && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customerTRN}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('invoice.modal.street')} *
                      </label>
                      <input
                        type="text"
                        value={formData.customerAddress.street}
                        onChange={(e) => handleInputChange('street', e.target.value, 'customerAddress')}
                        className={`w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${
                          errors.customerStreet ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Business Bay"
                      />
                      {errors.customerStreet && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customerStreet}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('invoice.modal.city')} *
                      </label>
                      <input
                        type="text"
                        value={formData.customerAddress.city}
                        onChange={(e) => handleInputChange('city', e.target.value, 'customerAddress')}
                        className={`w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${
                          errors.customerCity ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {errors.customerCity && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customerCity}</p>}
                    </div>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    {t('invoice.modal.invoiceDetails')}
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('invoice.modal.serviceDescription')} *
                    </label>
                    <textarea
                      value={formData.serviceDescription}
                      onChange={(e) => handleInputChange('serviceDescription', e.target.value)}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${
                        errors.serviceDescription ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder={t('invoice.modal.serviceDescriptionPlaceholder')}
                    />
                    {errors.serviceDescription && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.serviceDescription}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('invoice.modal.amount')} *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-150 ${
                        errors.amount ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="0.00"
                    />
                    {errors.amount && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* VAT Toggle */}
            <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center">
                <BanknotesIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                    {t('invoice.modal.vatToggle')}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    {t('invoice.modal.vatToggleHelp')}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.vatEnabled}
                  onChange={(e) => handleInputChange('vatEnabled', e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                  formData.vatEnabled ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${
                    formData.vatEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  } mt-0.5`} />
                </div>
              </label>
            </div>

            {/* Amount Summary */}
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              <h5 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t('invoice.modal.amountSummary')}
              </h5>
              <div className="space-y-3 text-base">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('invoice.modal.subtotal')}</span>
                  <span className="font-medium">{subtotal.toFixed(2)} AED</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('invoice.modal.vat')} ({formData.vatEnabled ? '5%' : '0%'})</span>
                  <span className="font-medium">{vatAmount.toFixed(2)} AED</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">{t('invoice.modal.totalAmount')}</span>
                    <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
                      {totalAmount.toFixed(2)} AED
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                {t('invoice.modal.vatNote')}
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium transition-colors duration-150"
              >
                {t('invoice.modal.cancel')}
              </button>
              <button
                type="button"
                onClick={handleGenerateInvoice}
                disabled={isGenerating}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium transition-colors duration-150 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {t('invoice.modal.generating')}
                  </>
                ) : (
                  <>
                    <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                    {t('invoice.modal.generate')}
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Generated Invoice Output */
          <div className="p-6 space-y-6">
            <div className="text-center">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('invoice.modal.generationSuccess')}
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                {t('invoice.modal.generationSuccessDesc')}
              </p>
            </div>

            {/* FTA Compliance Badge */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    {t('invoice.modal.ftaCompliant')}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {t('invoice.modal.ftaCompliantDesc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Download Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors duration-150 shadow-sm hover:shadow-md"
              >
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                {t('invoice.modal.downloadPDF')}
              </button>

              <button
                onClick={handleDownloadJSON}
                className="flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-150 shadow-sm hover:shadow-md"
              >
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                {t('invoice.modal.downloadJSON')}
              </button>

              <button
                onClick={() => setShowXmlPreview(!showXmlPreview)}
                className="flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors duration-150 shadow-sm hover:shadow-md"
              >
                <EyeIcon className="h-5 w-5 mr-2" />
                {t('invoice.modal.previewXML')}
              </button>
            </div>

            {/* XML Preview */}
            {showXmlPreview && (
              <div className="mt-6">
                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {t('invoice.modal.xmlPreview')}
                </h5>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 max-h-48 overflow-y-auto">
                  <pre className="text-xs text-gray-700 dark:text-gray-300 font-mono">
                    {generatedOutputs.xmlString.substring(0, 1000)}...
                  </pre>
                </div>
              </div>
            )}

            {/* JSON Preview */}
            <div className="mt-6">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                {t('invoice.modal.ftaJsonPreview')}
              </h5>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 max-h-48 overflow-y-auto">
                <pre className="text-xs text-gray-700 dark:text-gray-300 font-mono">
                  {JSON.stringify(generatedOutputs.ftaJson, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setGeneratedOutputs(null);
                  setFormData({
                    invoiceNumber: generateInvoiceNumber(),
                    customerName: '',
                    customerTRN: '',
                    issueDate: new Date().toISOString().split('T')[0],
                    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    serviceDescription: '',
                    amount: 0,
                    vatEnabled: true,
                    customerAddress: {
                      street: '',
                      city: 'Dubai',
                      emirate: 'Dubai',
                      country: 'UAE',
                      postalCode: ''
                    },
                    customerContact: {
                      phone: '',
                      email: ''
                    }
                  });
                }}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium transition-colors duration-150"
              >
                {t('invoice.modal.generateAnother')}
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors duration-150 shadow-sm hover:shadow-md"
              >
                {t('invoice.modal.done')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Function to generate XML
export function generateInvoiceXML(invoice: InvoiceData): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Invoice>
  <InvoiceNumber>${invoice.invoiceNumber}</InvoiceNumber>
  <IssueDate>${invoice.issueDate}</IssueDate>
  <SupplierTRN>${invoice.supplierTRN}</SupplierTRN>
  <SupplierName>${invoice.businessName}</SupplierName>
  <CustomerName>${invoice.customerName}</CustomerName>
  <CustomerTRN>${invoice.customerTRN || ''}</CustomerTRN>
  <Description>${invoice.serviceDescription}</Description>
  <Subtotal>${invoice.subtotal.toFixed(2)}</Subtotal>
  <VAT>${invoice.vat.toFixed(2)}</VAT>
  <Total>${invoice.total.toFixed(2)}</Total>
</Invoice>`;
}

function downloadInvoiceXML(invoiceData: InvoiceData) {
  const xmlString = generateInvoiceXML(invoiceData);
  const blob = new Blob([xmlString], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `invoice-${invoiceData.invoiceNumber}.xml`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default InvoiceModal;