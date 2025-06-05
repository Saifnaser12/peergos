
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CameraIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowUpTrayIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface ScannedInvoiceData {
  date: string;
  amount: number;
  trn: string;
  vendor: string;
  invoiceNumber: string;
  confidence: number;
  vatAmount?: number;
}

interface InvoiceAutomationProps {
  onInvoiceProcessed?: (data: ScannedInvoiceData) => void;
}

const InvoiceAutomation: React.FC<InvoiceAutomationProps> = ({ onInvoiceProcessed }) => {
  const { t, i18n } = useTranslation();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<ScannedInvoiceData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Mock OCR results for UAE vendors
  const mockOCRResults: ScannedInvoiceData[] = [
    {
      date: '2024-01-15',
      amount: 525.00,
      trn: '100234567890003',
      vendor: 'Dubai Electric & Water Authority (DEWA)',
      invoiceNumber: 'DEWA-2024-001234',
      confidence: 0.95,
      vatAmount: 25.00
    },
    {
      date: '2024-01-10',
      amount: 1250.75,
      trn: '100987654321003',
      vendor: 'Emirates Telecommunications (Etisalat)',
      invoiceNumber: 'ET-2024-567890',
      confidence: 0.89,
      vatAmount: 59.56
    },
    {
      date: '2024-01-08',
      amount: 892.50,
      trn: '100456789012003',
      vendor: 'Al Futtaim Office Supplies LLC',
      invoiceNumber: 'AFS-2024-789123',
      confidence: 0.92,
      vatAmount: 42.50
    },
    {
      date: '2024-01-12',
      amount: 340.20,
      trn: '100123987456003',
      vendor: 'Emirates NBD Bank',
      invoiceNumber: 'ENBD-2024-445566',
      confidence: 0.87,
      vatAmount: 16.20
    }
  ];

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      alert(t('invoiceScanner.invalidFileType', 'Please upload an image or PDF file'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(t('invoiceScanner.fileTooLarge', 'File size must be less than 5MB'));
      return;
    }

    setIsScanning(true);
    setShowModal(true);
    
    // Simulate OCR processing
    setTimeout(() => {
      const randomResult = mockOCRResults[Math.floor(Math.random() * mockOCRResults.length)];
      setScannedData(randomResult);
      setIsScanning(false);
    }, 2500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleAccept = () => {
    if (scannedData) {
      onInvoiceProcessed?.(scannedData);
      setShowModal(false);
      setScannedData(null);
    }
  };

  const handleReject = () => {
    setScannedData(null);
    setIsScanning(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setScannedData(null);
    setIsScanning(false);
  };

  const isRTL = i18n.language === 'ar';

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <CameraIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('invoiceScanner.title', 'Scan Invoice')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('invoiceScanner.description', 'Upload or scan an invoice to automatically extract key information using OCR technology.')}
              </p>
            </div>
          </div>
          
          {/* Simulation Badge */}
          <div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded text-xs font-medium">
            {t('fta.simulation.note', 'Simulation Mode')}
          </div>
        </div>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver 
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
        >
          <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {isRTL ? 'اسحب وأفلت الفاتورة هنا أو' : 'Drag and drop invoice here, or'}
          </p>
          
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              className="hidden"
            />
            <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <ArrowUpTrayIcon className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {t('invoiceScanner.scanButton', 'Scan Invoice')}
            </span>
          </label>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {isRTL ? 'PNG، JPG، PDF - حد أقصى 5 ميجابايت' : 'PNG, JPG, PDF - Max 5MB'}
          </p>
        </div>
      </div>

      {/* Scanning Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative p-5 border w-full max-w-md mx-4 shadow-lg rounded-md bg-white dark:bg-gray-800">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 rtl:right-auto rtl:left-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div className="mt-3 text-center">
              {isScanning ? (
                <>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mt-4">
                    {t('invoiceScanner.scanning', 'Scanning Invoice...')}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {t('invoiceScanner.processing', 'Processing document with OCR technology')}
                  </p>
                  
                  {/* Mock Processing Indicator */}
                  <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2 rtl:ml-2 rtl:mr-0" />
                      <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        {isRTL ? 'معالجة تجريبية بتقنية OCR' : 'Mock OCR Processing'}
                      </span>
                    </div>
                  </div>
                </>
              ) : scannedData ? (
                <>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20">
                    <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mt-4">
                    {t('invoiceScanner.scanned', 'Invoice Scanned Successfully')}
                  </h3>
                  
                  <div className={`mt-4 text-${isRTL ? 'right' : 'left'} bg-gray-50 dark:bg-gray-700 rounded-lg p-4`}>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {isRTL ? 'التاريخ:' : 'Date:'}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {scannedData.date}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {isRTL ? 'المبلغ:' : 'Amount:'}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          AED {scannedData.amount.toFixed(2)}
                        </span>
                      </div>
                      {scannedData.vatAmount && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {isRTL ? 'ضريبة القيمة المضافة:' : 'VAT Amount:'}
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            AED {scannedData.vatAmount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {isRTL ? 'رقم التسجيل الضريبي:' : 'TRN:'}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {scannedData.trn}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {isRTL ? 'المورد:' : 'Vendor:'}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {scannedData.vendor}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {isRTL ? 'رقم الفاتورة:' : 'Invoice #:'}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {scannedData.invoiceNumber}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {isRTL ? 'مستوى الثقة:' : 'Confidence:'}
                        </span>
                        <span className={`text-sm font-medium ${scannedData.confidence > 0.9 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                          {(scannedData.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3 rtl:space-x-reverse">
                    <button
                      onClick={handleAccept}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md text-sm"
                    >
                      {t('common.accept', 'Accept')}
                    </button>
                    <button
                      onClick={handleReject}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md text-sm"
                    >
                      {t('common.reject', 'Reject')}
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InvoiceAutomation;
