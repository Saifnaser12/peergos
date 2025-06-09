import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DocumentArrowUpIcon, CheckCircleIcon, ExclamationTriangleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { SecureFileStorage } from '../../utils/fileStorage';
const CategoryDocumentUploader = ({ companyId, onDocumentUploaded, existingDocuments = {} }) => {
    const { t } = useTranslation();
    const [uploading, setUploading] = useState(null);
    const [uploadStatus, setUploadStatus] = useState({});
    const documentTypes = [
        {
            key: 'businessLicense',
            label: t('setup.documents.businessLicense', 'Business License'),
            description: t('setup.documents.businessLicenseDesc', 'Official business license from relevant authority'),
            required: true
        },
        {
            key: 'trnLetter',
            label: t('setup.documents.trnLetter', 'TRN Registration Letter'),
            description: t('setup.documents.trnLetterDesc', 'Tax registration number certificate from FTA'),
            required: true
        },
        {
            key: 'qfzpDeclaration',
            label: t('setup.documents.qfzpDeclaration', 'QFZP Declaration (Free Zone Only)'),
            description: t('setup.documents.qfzpDeclarationDesc', 'Qualifying Free Zone Person status declaration'),
            required: false
        }
    ];
    const handleFileUpload = async (docType, file) => {
        setUploading(docType);
        try {
            const result = await SecureFileStorage.uploadFile({
                companyId,
                financialYear: new Date().getFullYear().toString(),
                category: 'category-documents',
                fileName: `${docType}_${file.name}`,
                file
            });
            setUploadStatus(prev => ({ ...prev, [docType]: 'success' }));
            onDocumentUploaded(docType, result.storagePath);
        }
        catch (error) {
            console.error('Upload failed:', error);
            setUploadStatus(prev => ({ ...prev, [docType]: 'error' }));
        }
        finally {
            setUploading(null);
        }
    };
    const isAuditReady = documentTypes
        .filter(doc => doc.required)
        .every(doc => existingDocuments[doc.key]);
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(DocumentArrowUpIcon, { className: "w-6 h-6 text-indigo-600" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: t('setup.documents.title', 'Category Identification Documents') })] }), isAuditReady && (_jsxs("div", { className: "flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/20 rounded-full", children: [_jsx(ShieldCheckIcon, { className: "w-4 h-4 text-green-600 dark:text-green-400" }), _jsx("span", { className: "text-sm font-medium text-green-800 dark:text-green-200", children: t('setup.documents.ftaAuditReady', 'FTA Audit Ready') })] }))] }), _jsx("div", { className: "space-y-4", children: documentTypes.map((docType) => {
                    const isUploaded = existingDocuments[docType.key];
                    const isCurrentlyUploading = uploading === docType.key;
                    const hasError = uploadStatus[docType.key] === 'error';
                    return (_jsx("div", { className: `border-2 border-dashed rounded-lg p-4 transition-colors ${isUploaded
                            ? 'border-green-300 bg-green-50 dark:bg-green-900/10'
                            : hasError
                                ? 'border-red-300 bg-red-50 dark:bg-red-900/10'
                                : 'border-gray-300 hover:border-indigo-400 dark:border-gray-600'}`, children: _jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-1", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900 dark:text-white", children: docType.label }), docType.required && (_jsx("span", { className: "text-xs text-red-500", children: "*Required" })), isUploaded && (_jsx(CheckCircleIcon, { className: "w-4 h-4 text-green-500" }))] }), _jsx("p", { className: "text-xs text-gray-600 dark:text-gray-400 mb-3", children: docType.description }), !isUploaded && (_jsxs("label", { className: "cursor-pointer", children: [_jsx("input", { type: "file", accept: ".pdf,.jpg,.jpeg,.png", onChange: (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file)
                                                        handleFileUpload(docType.key, file);
                                                }, className: "hidden", disabled: isCurrentlyUploading }), _jsx("div", { className: `inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white ${isCurrentlyUploading
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-indigo-600 hover:bg-indigo-700'}`, children: isCurrentlyUploading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin w-3 h-3 border border-white border-t-transparent rounded-full mr-2" }), t('common.uploading', 'Uploading...')] })) : (_jsxs(_Fragment, { children: [_jsx(DocumentArrowUpIcon, { className: "w-3 h-3 mr-1" }), t('common.upload', 'Upload')] })) })] })), hasError && (_jsxs("div", { className: "flex items-center space-x-1 mt-2", children: [_jsx(ExclamationTriangleIcon, { className: "w-4 h-4 text-red-500" }), _jsx("span", { className: "text-xs text-red-600 dark:text-red-400", children: t('setup.documents.uploadError', 'Upload failed. Please try again.') })] }))] }) }) }, docType.key));
                }) }), _jsx("div", { className: "mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800", children: _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx(ShieldCheckIcon, { className: "w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-blue-900 dark:text-blue-300", children: t('setup.documents.securityNote', 'Secure Document Storage') }), _jsx("p", { className: "text-xs text-blue-800 dark:text-blue-200 mt-1", children: t('setup.documents.securityDescription', 'All documents are encrypted and stored securely with FTA audit trail compliance. Documents are organized by company and financial year for easy retrieval during audits.') })] })] }) })] }));
};
export default CategoryDocumentUploader;
