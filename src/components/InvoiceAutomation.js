import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CameraIcon, DocumentTextIcon, CheckCircleIcon, ExclamationTriangleIcon, ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';
const InvoiceAutomation = ({ onInvoiceProcessed }) => {
    const { t, i18n } = useTranslation();
    const [isScanning, setIsScanning] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    // Mock OCR results for UAE vendors
    const mockOCRResults = [
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
    const handleFileUpload = (file) => {
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
    const handleDrop = (e) => {
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
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center space-x-3 rtl:space-x-reverse", children: [_jsx("div", { className: "w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center", children: _jsx(CameraIcon, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white", children: t('invoiceScanner.title', 'Scan Invoice') }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: t('invoiceScanner.description', 'Upload or scan an invoice to automatically extract key information using OCR technology.') })] })] }), _jsx("div", { className: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded text-xs font-medium", children: t('fta.simulation.note', 'Simulation Mode') })] }), _jsxs("div", { className: `border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragOver
                            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-300 dark:border-gray-600'}`, onDrop: handleDrop, onDragOver: (e) => {
                            e.preventDefault();
                            setDragOver(true);
                        }, onDragLeave: () => setDragOver(false), children: [_jsx(DocumentTextIcon, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-4", children: isRTL ? 'اسحب وأفلت الفاتورة هنا أو' : 'Drag and drop invoice here, or' }), _jsxs("label", { className: "cursor-pointer", children: [_jsx("input", { type: "file", accept: "image/*,.pdf", onChange: (e) => {
                                            const file = e.target.files?.[0];
                                            if (file)
                                                handleFileUpload(file);
                                        }, className: "hidden" }), _jsxs("span", { className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", children: [_jsx(ArrowUpTrayIcon, { className: "w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" }), t('invoiceScanner.scanButton', 'Scan Invoice')] })] }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-2", children: isRTL ? 'PNG، JPG، PDF - حد أقصى 5 ميجابايت' : 'PNG, JPG, PDF - Max 5MB' })] })] }), showModal && (_jsx("div", { className: "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center", children: _jsxs("div", { className: "relative p-5 border w-full max-w-md mx-4 shadow-lg rounded-md bg-white dark:bg-gray-800", children: [_jsx("button", { onClick: handleCloseModal, className: "absolute top-3 right-3 rtl:right-auto rtl:left-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300", children: _jsx(XMarkIcon, { className: "w-5 h-5" }) }), _jsx("div", { className: "mt-3 text-center", children: isScanning ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20", children: _jsx("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" }) }), _jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900 dark:text-white mt-4", children: t('invoiceScanner.scanning', 'Scanning Invoice...') }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-2", children: t('invoiceScanner.processing', 'Processing document with OCR technology') }), _jsx("div", { className: "mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3", children: _jsxs("div", { className: "flex items-center", children: [_jsx(ExclamationTriangleIcon, { className: "w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2 rtl:ml-2 rtl:mr-0" }), _jsx("span", { className: "text-sm font-medium text-yellow-800 dark:text-yellow-200", children: isRTL ? 'معالجة تجريبية بتقنية OCR' : 'Mock OCR Processing' })] }) })] })) : scannedData ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20", children: _jsx(CheckCircleIcon, { className: "h-6 w-6 text-green-600 dark:text-green-400" }) }), _jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900 dark:text-white mt-4", children: t('invoiceScanner.scanned', 'Invoice Scanned Successfully') }), _jsx("div", { className: `mt-4 text-${isRTL ? 'right' : 'left'} bg-gray-50 dark:bg-gray-700 rounded-lg p-4`, children: _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: isRTL ? 'التاريخ:' : 'Date:' }), _jsx("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children: scannedData.date })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: isRTL ? 'المبلغ:' : 'Amount:' }), _jsxs("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children: ["AED ", scannedData.amount.toFixed(2)] })] }), scannedData.vatAmount && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: isRTL ? 'ضريبة القيمة المضافة:' : 'VAT Amount:' }), _jsxs("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children: ["AED ", scannedData.vatAmount.toFixed(2)] })] })), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: isRTL ? 'رقم التسجيل الضريبي:' : 'TRN:' }), _jsx("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children: scannedData.trn })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: isRTL ? 'المورد:' : 'Vendor:' }), _jsx("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children: scannedData.vendor })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: isRTL ? 'رقم الفاتورة:' : 'Invoice #:' }), _jsx("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children: scannedData.invoiceNumber })] }), _jsxs("div", { className: "flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: isRTL ? 'مستوى الثقة:' : 'Confidence:' }), _jsxs("span", { className: `text-sm font-medium ${scannedData.confidence > 0.9 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`, children: [(scannedData.confidence * 100).toFixed(0), "%"] })] })] }) }), _jsxs("div", { className: "mt-6 flex space-x-3 rtl:space-x-reverse", children: [_jsx("button", { onClick: handleAccept, className: "flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md text-sm", children: t('common.accept', 'Accept') }), _jsx("button", { onClick: handleReject, className: "flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md text-sm", children: t('common.reject', 'Reject') })] })] })) : null })] }) }))] }));
};
export default InvoiceAutomation;
