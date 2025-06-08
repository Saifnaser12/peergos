import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CameraIcon, CheckCircleIcon, ExclamationTriangleIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
const InvoiceScanner = ({ onInvoiceScanned, variant = 'button' }) => {
    const { t } = useTranslation();
    const [isScanning, setIsScanning] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    // Mock OCR results
    const mockOCRResults = [
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
        return (_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4", children: _jsx(CameraIcon, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" }) }), _jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white mb-2", children: t('invoiceScanner.title', 'Scan Invoice') }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-4", children: t('invoiceScanner.description', 'Upload or scan an invoice to automatically extract key information using OCR technology.') }), _jsxs("button", { onClick: handleScan, className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", children: [_jsx(ArrowUpTrayIcon, { className: "w-4 h-4 mr-2" }), t('invoiceScanner.scanButton', 'Scan Invoice')] })] }) }));
    }
    return (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: handleScan, className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", children: [_jsx(CameraIcon, { className: "w-4 h-4 mr-2" }), t('invoiceScanner.scanButton', 'Scan Invoice')] }), showModal && (_jsx("div", { className: "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50", children: _jsx("div", { className: "relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800", children: _jsxs("div", { className: "mt-3 text-center", children: [isScanning ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20", children: _jsx("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" }) }), _jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900 dark:text-white mt-4", children: t('invoiceScanner.scanning', 'Scanning Invoice...') }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-2", children: t('invoiceScanner.processing', 'Processing document with OCR technology') }), _jsx("div", { className: "mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3", children: _jsxs("div", { className: "flex items-center", children: [_jsx(ExclamationTriangleIcon, { className: "w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" }), _jsx("span", { className: "text-sm font-medium text-yellow-800 dark:text-yellow-200", children: "Mock OCR Processing" })] }) })] })) : scannedData ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20", children: _jsx(CheckCircleIcon, { className: "h-6 w-6 text-green-600 dark:text-green-400" }) }), _jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900 dark:text-white mt-4", children: t('invoiceScanner.scanned', 'Invoice Scanned Successfully') }), _jsx("div", { className: "mt-4 text-left bg-gray-50 dark:bg-gray-700 rounded-lg p-4", children: _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Date:" }), _jsx("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children: scannedData.date })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Amount:" }), _jsxs("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children: ["AED ", scannedData.amount.toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "TRN:" }), _jsx("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children: scannedData.trn })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Vendor:" }), _jsx("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children: scannedData.vendor })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Invoice #:" }), _jsx("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children: scannedData.invoiceNumber })] }), _jsxs("div", { className: "flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Confidence:" }), _jsxs("span", { className: `text-sm font-medium ${scannedData.confidence > 0.9 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`, children: [(scannedData.confidence * 100).toFixed(0), "%"] })] })] }) }), _jsxs("div", { className: "mt-6 flex space-x-3", children: [_jsx("button", { onClick: handleAccept, className: "flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md text-sm", children: t('common.accept', 'Accept') }), _jsx("button", { onClick: handleReject, className: "flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md text-sm", children: t('common.reject', 'Reject') })] })] })) : null, _jsx("div", { className: "mt-4", children: _jsx("button", { onClick: () => setShowModal(false), className: "bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md text-sm", children: t('common.close', 'Close') }) })] }) }) }))] }));
};
export default InvoiceScanner;
