
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  BuildingOfficeIcon, 
  CalendarDaysIcon, 
  MapPinIcon, 
  UserIcon, 
  Cog6ToothIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import Card from '../components/Card';
import Button from '../components/Button';

interface BusinessCategory {
  id: string;
  name: string;
  criteria: string[];
  revenueThreshold: string;
  employeeThreshold?: string;
  requirements: string[];
  color: string;
}

interface SMEData {
  revenue: number;
  employees: number;
  category: BusinessCategory | null;
  complianceItems: string[];
}

const Setup: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // SME Categorization State
  const [smeData, setSmeData] = useState<SMEData>({
    revenue: 0,
    employees: 0,
    category: null,
    complianceItems: []
  });

  // Form Data State
  const [formData, setFormData] = useState({
    organizationName: '',
    trn: '',
    fiscalYearStart: '',
    fiscalYearEnd: '',
    businessType: '',
    address: '',
    taxAgent: '',
    posIntegration: false,
    accountingIntegration: false
  });

  // Business Categories Definition
  const businessCategories: BusinessCategory[] = [
    {
      id: 'micro',
      name: 'Micro SME',
      criteria: ['< AED 3m Revenue'],
      revenueThreshold: '< AED 3m',
      requirements: [
        'No VAT invoices and submissions',
        'Required CIT Registration and filling 0% tax',
        'Cash basis F.S (with notes)'
      ],
      color: 'bg-blue-100 border-blue-300 text-blue-800'
    },
    {
      id: 'small-below-375k',
      name: 'Small Business',
      criteria: ['< AED 375k Revenue'],
      revenueThreshold: '< AED 375k',
      requirements: [
        'No VAT invoices and submissions',
        'Required CIT Registration and filling 0% tax',
        'Cash basis F.S (with notes)'
      ],
      color: 'bg-cyan-100 border-cyan-300 text-cyan-800'
    },
    {
      id: 'small-above-375k',
      name: 'Small Business',
      criteria: ['> AED 375k Revenue'],
      revenueThreshold: '> AED 375k',
      requirements: [
        'Required VAT invoices and submissions',
        'Required CIT Registration and filling 0% tax',
        'Cash basis F.S (with notes)'
      ],
      color: 'bg-teal-100 border-teal-300 text-teal-800'
    },
    {
      id: 'small-business',
      name: 'Small Business',
      criteria: ['< 100 FTE', '< 25m Rev'],
      revenueThreshold: '< AED 25m',
      employeeThreshold: '< 100 FTE',
      requirements: [
        'Required VAT invoices and submissions',
        'Required CIT Registration and filling',
        'Accrual basis F.S (with notes)',
        'Transfer prices requirements'
      ],
      color: 'bg-green-100 border-green-300 text-green-800'
    },
    {
      id: 'medium-business',
      name: 'Medium Business',
      criteria: ['< 250 FTE', '< 150m Rev'],
      revenueThreshold: '< AED 150m',
      employeeThreshold: '< 250 FTE',
      requirements: [
        'Required VAT invoices and submissions',
        'Required CIT Registration and filling',
        'Accrual basis F.S (with notes)',
        'Transfer prices requirements'
      ],
      color: 'bg-purple-100 border-purple-300 text-purple-800'
    }
  ];

  // Categorize business based on revenue and employees
  const categorizeBusiness = (revenue: number, employees: number): BusinessCategory | null => {
    if (revenue < 3000000) {
      return businessCategories.find(cat => cat.id === 'micro') || null;
    } else if (revenue < 375000) {
      return businessCategories.find(cat => cat.id === 'small-below-375k') || null;
    } else if (revenue < 25000000 && employees < 100) {
      return businessCategories.find(cat => cat.id === 'small-business') || null;
    } else if (revenue < 150000000 && employees < 250) {
      return businessCategories.find(cat => cat.id === 'medium-business') || null;
    } else {
      return businessCategories.find(cat => cat.id === 'small-above-375k') || null;
    }
  };

  // Handle SME categorization
  const handleSMECategorization = (revenue: number, employees: number) => {
    const category = categorizeBusiness(revenue, employees);
    setSmeData({
      revenue,
      employees,
      category,
      complianceItems: category?.requirements || []
    });
  };

  const steps = [
    {
      id: 1,
      title: t('setup.step1.title', 'Organization Details'),
      icon: BuildingOfficeIcon,
      description: t('setup.step1.description', 'Enter your organization name and TRN')
    },
    {
      id: 2,
      title: t('setup.step2.title', 'Business Categorization'),
      icon: InformationCircleIcon,
      description: t('setup.step2.description', 'Categorize your business for compliance requirements')
    },
    {
      id: 3,
      title: t('setup.step3.title', 'Fiscal Year'),
      icon: CalendarDaysIcon,
      description: t('setup.step3.description', 'Set your fiscal year dates')
    },
    {
      id: 4,
      title: t('setup.step4.title', 'Business Information'),
      icon: MapPinIcon,
      description: t('setup.step4.description', 'Configure business type and address')
    },
    {
      id: 5,
      title: t('setup.step5.title', 'System Configuration'),
      icon: Cog6ToothIcon,
      description: t('setup.step5.description', 'Connect integrations and finalize setup')
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('setupCompleted', 'true');
    localStorage.setItem('smeCategory', JSON.stringify(smeData));
    navigate('/dashboard');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('setup.organization.name', 'Organization Name')}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={formData.organizationName}
                onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                placeholder={t('setup.organization.namePlaceholder', 'Enter your organization name')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('setup.organization.trn', 'Tax Registration Number (TRN)')}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={formData.trn}
                onChange={(e) => setFormData({...formData, trn: e.target.value})}
                placeholder={t('setup.organization.trnPlaceholder', 'Enter your TRN')}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                <InformationCircleIcon className="w-5 h-5 mr-2" />
                SME Business Categorization
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Annual Revenue (AED)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    value={smeData.revenue}
                    onChange={(e) => {
                      const revenue = Number(e.target.value);
                      setSmeData({...smeData, revenue});
                      handleSMECategorization(revenue, smeData.employees);
                    }}
                    placeholder="Enter annual revenue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Employees (FTE)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    value={smeData.employees}
                    onChange={(e) => {
                      const employees = Number(e.target.value);
                      setSmeData({...smeData, employees});
                      handleSMECategorization(smeData.revenue, employees);
                    }}
                    placeholder="Enter number of employees"
                  />
                </div>
              </div>

              {smeData.category && (
                <div className="mt-6">
                  <div className={`rounded-lg p-4 border-2 ${smeData.category.color}`}>
                    <h4 className="font-semibold text-lg mb-2">{smeData.category.name}</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {smeData.category.criteria.map((criterion, index) => (
                        <span key={index} className="px-2 py-1 bg-white/50 rounded text-sm">
                          {criterion}
                        </span>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium">Compliance Requirements:</h5>
                      {smeData.category.requirements.map((requirement, index) => (
                        <div key={index} className="flex items-start">
                          <span className="flex-shrink-0 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-sm">{requirement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-medium mb-1">SME Workflow Benefits:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Tax Category Identification</li>
                    <li>All proof documents will be uploaded</li>
                    <li>Instant Readiness for FTA requirements changes</li>
                    <li>Centralized repository for SMEs Data</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('setup.fiscal.start', 'Fiscal Year Start')}
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={formData.fiscalYearStart}
                  onChange={(e) => setFormData({...formData, fiscalYearStart: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('setup.fiscal.end', 'Fiscal Year End')}
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={formData.fiscalYearEnd}
                  onChange={(e) => setFormData({...formData, fiscalYearEnd: e.target.value})}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('setup.business.type', 'Business Type')}
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={formData.businessType}
                onChange={(e) => setFormData({...formData, businessType: e.target.value})}
              >
                <option value="">{t('setup.business.selectType', 'Select business type')}</option>
                <option value="llc">LLC</option>
                <option value="freezone">Free Zone</option>
                <option value="branch">Branch</option>
                <option value="sole_proprietorship">Sole Proprietorship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('setup.business.address', 'Business Address')}
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder={t('setup.business.addressPlaceholder', 'Enter your business address')}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('setup.integrations.title', 'System Integrations')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {t('setup.integrations.pos', 'POS Integration')}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('setup.integrations.posDescription', 'Connect your Point-of-Sale system')}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.posIntegration}
                      onChange={(e) => setFormData({...formData, posIntegration: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {t('setup.integrations.accounting', 'Accounting Integration')}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('setup.integrations.accountingDescription', 'Connect your accounting system')}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.accountingIntegration}
                      onChange={(e) => setFormData({...formData, accountingIntegration: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {smeData.category && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2 flex items-center">
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Setup Summary - {smeData.category.name}
                </h4>
                <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <p>Revenue: AED {smeData.revenue.toLocaleString()}</p>
                  <p>Employees: {smeData.employees} FTE</p>
                  <p>Compliance Requirements: {smeData.complianceItems.length} items identified</p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <div className="p-6">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('setup.complete.title', 'Setup Complete!')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('setup.complete.description', 'Your Peergos Tax system is now configured and ready to use.')}
            </p>
            {smeData.category && (
              <div className="mb-6 text-left">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Business Category: {smeData.category.name}
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {smeData.complianceItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            <Button onClick={handleComplete} className="w-full">
              {t('setup.complete.button', 'Go to Dashboard')}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('setup.title', 'Setup Your Tax System')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('setup.description', 'Configure your Peergos Tax system with SME-specific requirements')}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-300'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="text-center mt-2">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden md:block w-full h-0.5 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} style={{ minWidth: '60px' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {steps[currentStep - 1].title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {steps[currentStep - 1].description}
              </p>
            </div>
            
            {renderStepContent()}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            {t('setup.previous', 'Previous')}
          </Button>
          <Button
            onClick={currentStep === steps.length ? handleComplete : handleNext}
          >
            {currentStep === steps.length 
              ? t('setup.complete.button', 'Complete Setup') 
              : t('setup.next', 'Next')
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Setup;
