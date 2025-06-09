
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DocumentArrowUpIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';
import { SecureFileStorage } from '../../utils/fileStorage';

interface CategoryDocumentUploaderProps {
  companyId: string;
  onDocumentUploaded: (docType: string, filePath: string) => void;
  existingDocuments?: {
    businessLicense?: string;
    trnLetter?: string;
    qfzpDeclaration?: string;
  };
}

const CategoryDocumentUploader: React.FC<CategoryDocumentUploaderProps> = ({
  companyId,
  onDocumentUploaded,
  existingDocuments = {}
}) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{[key: string]: 'success' | 'error'}>({});

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

  const handleFileUpload = async (docType: string, file: File) => {
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
      
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus(prev => ({ ...prev, [docType]: 'error' }));
    } finally {
      setUploading(null);
    }
  };

  const isAuditReady = documentTypes
    .filter(doc => doc.required)
    .every(doc => existingDocuments[doc.key as keyof typeof existingDocuments]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <DocumentArrowUpIcon className="w-6 h-6 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('setup.documents.title', 'Category Identification Documents')}
          </h3>
        </div>
        
        {isAuditReady && (
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/20 rounded-full">
            <ShieldCheckIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              {t('setup.documents.ftaAuditReady', 'FTA Audit Ready')}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {documentTypes.map((docType) => {
          const isUploaded = existingDocuments[docType.key as keyof typeof existingDocuments];
          const isCurrentlyUploading = uploading === docType.key;
          const hasError = uploadStatus[docType.key] === 'error';

          return (
            <div
              key={docType.key}
              className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                isUploaded 
                  ? 'border-green-300 bg-green-50 dark:bg-green-900/10' 
                  : hasError
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/10'
                  : 'border-gray-300 hover:border-indigo-400 dark:border-gray-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {docType.label}
                    </h4>
                    {docType.required && (
                      <span className="text-xs text-red-500">*Required</span>
                    )}
                    {isUploaded && (
                      <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    {docType.description}
                  </p>
                  
                  {!isUploaded && (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(docType.key, file);
                        }}
                        className="hidden"
                        disabled={isCurrentlyUploading}
                      />
                      <div className={`inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white ${
                        isCurrentlyUploading 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}>
                        {isCurrentlyUploading ? (
                          <>
                            <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full mr-2"></div>
                            {t('common.uploading', 'Uploading...')}
                          </>
                        ) : (
                          <>
                            <DocumentArrowUpIcon className="w-3 h-3 mr-1" />
                            {t('common.upload', 'Upload')}
                          </>
                        )}
                      </div>
                    </label>
                  )}

                  {hasError && (
                    <div className="flex items-center space-x-1 mt-2">
                      <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                      <span className="text-xs text-red-600 dark:text-red-400">
                        {t('setup.documents.uploadError', 'Upload failed. Please try again.')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <ShieldCheckIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300">
              {t('setup.documents.securityNote', 'Secure Document Storage')}
            </h4>
            <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
              {t('setup.documents.securityDescription', 'All documents are encrypted and stored securely with FTA audit trail compliance. Documents are organized by company and financial year for easy retrieval during audits.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CategoryDocumentUploader };
export default CategoryDocumentUploader;
