import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CalendarIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface ComplianceItem {
  id: string;
  title: string;
  description: string;
  status: 'compliant' | 'warning' | 'non-compliant';
  dueDate?: string;
  action?: string;
  ftaReference?: string;
}

interface FTAComplianceCenterProps {
  trn: string;
  revenue: number;
}

const FTAComplianceCenter: React.FC<FTAComplianceCenterProps> = ({ trn, revenue }) => {
  const { t } = useTranslation();
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    const items: ComplianceItem[] = [
      // VAT Compliance
      {
        id: 'vat-registration',
        title: 'VAT Registration Status',
        description: revenue > 375000 ? 'VAT registration is mandatory' : 'VAT registration is optional',
        status: revenue > 375000 ? 'compliant' : 'compliant',
        ftaReference: 'VAT Law Article 19'
      },
      {
        id: 'vat-filing',
        title: 'VAT Return Filing',
        description: 'Monthly/Quarterly VAT returns must be filed by 28th of following month',
        status: 'compliant',
        dueDate: '2024-02-28',
        action: 'File VAT Return',
        ftaReference: 'VAT Executive Regulation 16'
      },
      // CIT Compliance
      {
        id: 'cit-registration',
        title: 'Corporate Income Tax Registration',
        description: revenue > 3000000 ? 'CIT registration is mandatory' : 'CIT may apply based on business type',
        status: revenue > 3000000 ? 'compliant' : 'warning',
        ftaReference: 'CIT Law Article 4'
      },
      {
        id: 'cit-filing',
        title: 'CIT Return Filing',
        description: 'CIT return must be filed within 9 months of financial year-end',
        status: 'compliant',
        dueDate: '2024-09-30',
        action: 'Prepare CIT Return',
        ftaReference: 'CIT Law Article 47'
      },
      // Economic Substance
      {
        id: 'esr-compliance',
        title: 'Economic Substance Regulations',
        description: 'ESR notification and report required for relevant activities',
        status: 'warning',
        dueDate: '2024-06-30',
        action: 'Check ESR Requirements',
        ftaReference: 'ESR Cabinet Resolution No. 31/2019'
      },
      // Transfer Pricing
      {
        id: 'transfer-pricing',
        title: 'Transfer Pricing Documentation',
        description: 'Required for related party transactions exceeding AED 3M',
        status: revenue > 3000000 ? 'warning' : 'compliant',
        action: 'Prepare TP Documentation',
        ftaReference: 'CIT Law Article 22'
      },
      // Digital Services Tax
      {
        id: 'dst-compliance',
        title: 'Digital Services Tax',
        description: '50% withholding tax on certain digital services',
        status: 'compliant',
        ftaReference: 'Cabinet Resolution No. 49/2021'
      },
      // Excise Tax
      {
        id: 'excise-tax',
        title: 'Excise Tax Compliance',
        description: 'Applicable to tobacco, carbonated drinks, and energy drinks',
        status: 'compliant',
        ftaReference: 'Excise Tax Law'
      },
      // Record Keeping
      {
        id: 'record-keeping',
        title: 'Books and Records',
        description: 'Maintain proper accounting records for 5 years',
        status: 'compliant',
        ftaReference: 'VAT Law Article 62, CIT Law Article 51'
      },
      // Anti-Money Laundering
      {
        id: 'aml-compliance',
        title: 'AML/CTF Compliance',
        description: 'Customer Due Diligence and Suspicious Transaction Reporting',
        status: 'warning',
        action: 'Review AML Procedures',
        ftaReference: 'AML Law No. 20/2018'
      }
    ];

    setComplianceItems(items);

    // Calculate overall compliance score
    const compliantCount = items.filter(item => item.status === 'compliant').length;
    const score = Math.round((compliantCount / items.length) * 100);
    setOverallScore(score);
  }, [revenue]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'non-compliant':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ExclamationTriangleIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'non-compliant':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ShieldCheckIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                FTA Compliance Center
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                UAE Federal Tax Authority compliance monitoring
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              overallScore >= 90 ? 'bg-green-100 text-green-800' :
              overallScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {overallScore}% Compliant
            </div>
          </div>
        </div>
      </div>

      {/* TRN Display */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Tax Registration Number:</span>
          <span className="font-mono font-medium text-gray-900 dark:text-white">{trn}</span>
        </div>
      </div>

      {/* Compliance Items */}
      <div className="p-6">
        <div className="space-y-4">
          {complianceItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-lg border-2 ${getStatusColor(item.status)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {getStatusIcon(item.status)}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {item.description}
                    </p>
                    {item.ftaReference && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Reference: {item.ftaReference}
                      </p>
                    )}
                    {item.dueDate && (
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <CalendarIcon className="w-3 h-3 mr-1" />
                        Due: {new Date(item.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                {item.action && (
                  <button className="ml-4 px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200">
                    {item.action}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="flex items-center space-x-3">
                <span className="text-blue-500">🤖</span>
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Automated Filings</p>
                  <p className="text-xs text-blue-600 dark:text-blue-300">CIT & VAT auto-submission enabled</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 rounded-full">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
              <div className="flex items-center space-x-3">
                <span className="text-purple-500">💳</span>
                <div>
                  <p className="text-sm font-medium text-purple-800 dark:text-purple-200">FTA Payment Gateway</p>
                  <p className="text-xs text-purple-600 dark:text-purple-300">Integrated payment processing</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200 rounded-full">
                Connected
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Schedule Compliance Review
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <DocumentTextIcon className="w-4 h-4 mr-2" />
              Download Compliance Report
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <CurrencyDollarIcon className="w-4 h-4 mr-2" />
              View Tax Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FTAComplianceCenter;