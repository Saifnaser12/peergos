
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CameraIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';

interface ScannedInvoiceData {
  date: string;
  amount: number;
  trn: string;
  vendor: string;
  invoiceNumber: string;
  confidence: number;
}

interface InvoiceScannerProps {
  onInvoiceScanned?: (data: ScannedInvoiceData) => void;
  variant?: 'button' | 'card';
}

const InvoiceScanner: React.FC<InvoiceScannerProps> = ({ onInvoiceScanned, variant = 'button' }) => {
  const { t } = useTranslation();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<ScannedInvoiceData | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Mock OCR results
  const mockOCRResults: ScannedInvoiceData[] = [
    {
      date: '2024-01-15',
      amount: 525.00,
      trn: '100234567890003',
      vendor: 'Dubai Electric & Water Authority (DEWA)',
      invoiceNumber: 'INV-2024-001234',
      confidence: 0.95
    },
    {
      date: '2024-01-10',
      amount: 1250.75,
      trn: '100987654321003',
      vendor: 'Emirates Telecommunications (Etisalat)',
      invoiceNumber: 'ET-2024-567890',
      confidence: 0.89
    },
    {
      date: '2024-01-08',
      amount: 892.50,
      trn: '100456789012003',
      vendor: 'Al Futtaim Office Supplies LLC',
      invoiceNumber: 'AFS-2024-789123',
      confidence: 0.92
    }
  ];

  const handleScan = () => {
    setIsScanning(true);
    setShowModal(true);
    
    // Simulate OCR processing
    setTimeout(() => {
      const randomResult = mockOCRResults[Math.floor(Math.random() * mockOCRResults.length)];
      setScannedData(randomResult);
      setIsScanning(false);
      onInvoiceScanned?.(randomResult);
    }, 2000);
  };

  const handleAccept = () => {
    if (scannedData) {
      // In a real app, this would save to the system
      console.log('Invoice accepted:', scannedData);
      setShowModal(false);
      setScannedData(null);
    }
  };

  const handleReject = () => {
    setScannedData(null);
    setIsScanning(false);
  };

  if (variant === 'card') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
            <CameraIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('invoiceScanner.title', 'Scan Invoice')}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {t('invoiceScanner.description', 'Upload or scan an invoice to automatically extract key information using OCR technology.')}
          </p>
          <button
            onClick={handleScan}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
            {t('invoiceScanner.scanButton', 'Scan Invoice')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleScan}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <CameraIcon className="w-4 h-4 mr-2" />
        {t('invoiceScanner.scanButton', 'Scan Invoice')}
      </button>

      {/* Scanning Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
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
                      <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                      <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Mock OCR Processing
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
                  
                  <div className="mt-4 text-left bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Date:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{scannedData.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">AED {scannedData.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">TRN:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{scannedData.trn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Vendor:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{scannedData.vendor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Invoice #:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{scannedData.invoiceNumber}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Confidence:</span>
                        <span className={`text-sm font-medium ${scannedData.confidence > 0.9 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                          {(scannedData.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
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

              <div className="mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md text-sm"
                >
                  {t('common.close', 'Close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InvoiceScanner;
