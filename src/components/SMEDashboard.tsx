
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BuildingOffice2Icon,
  CurrencyDollarIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const SMEDashboard: React.FC = () => {
  const { t } = useTranslation();

  const smeThresholds = {
    vatRegistration: 375000,
    citRegistration: 3000000,
    transferPricingDoc: 3000000,
    auditRequirement: 20000000
  };

  const complianceChecks = [
    {
      title: t('sme.compliance.vatRegistration', 'VAT Registration'),
      threshold: smeThresholds.vatRegistration,
      status: 'compliant' as const,
      description: t('sme.compliance.vatRegistrationDesc', 'Required if annual revenue > AED 375,000')
    },
    {
      title: t('sme.compliance.citRegistration', 'CIT Registration'), 
      threshold: smeThresholds.citRegistration,
      status: 'pending' as const,
      description: t('sme.compliance.citRegistrationDesc', 'Required for most businesses')
    },
    {
      title: t('sme.compliance.transferPricingDocs', 'Transfer Pricing Docs'),
      threshold: smeThresholds.transferPricingDoc,
      status: 'not-required' as const,
      description: t('sme.compliance.transferPricingDesc', 'Required if related party transactions > AED 3M')
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <BuildingOffice2Icon className="w-5 h-5 mr-2" />
            SME Compliance Dashboard
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            UAE-specific requirements for Small & Medium Enterprises
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {complianceChecks.map((check, index) => (
          <div key={index} className={`p-4 rounded-lg border-2 ${
            check.status === 'compliant' ? 'border-green-200 bg-green-50' :
            check.status === 'pending' ? 'border-yellow-200 bg-yellow-50' :
            'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{check.title}</h4>
              {check.status === 'compliant' && <span className="text-green-500">✅</span>}
              {check.status === 'pending' && <span className="text-yellow-500">⚠️</span>}
              {check.status === 'not-required' && <span className="text-gray-500">ℹ️</span>}
            </div>
            <p className="text-sm text-gray-600 mb-2">{check.description}</p>
            <p className="text-xs text-gray-500">
              Threshold: AED {check.threshold.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
          💡 SME Quick Tips
        </h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Keep digital records for 5+ years as per UAE law</li>
          <li>• File nil returns even with no business activity</li>
          <li>• Consider voluntary VAT registration for input tax recovery</li>
          <li>• Use FTA-approved accounting software (like Peergos!)</li>
        </ul>
      </div>
    </div>
  );
};

export default SMEDashboard;
