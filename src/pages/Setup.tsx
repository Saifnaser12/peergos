
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import TaxAgentSelector from '../components/TaxAgentSelector';
import { 
  BuildingOfficeIcon, 
  IdentificationIcon, 
  CalendarIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

interface SetupData {
  organizationName: string;
  trn: string;
  fiscalYearStart: string;
  fiscalYearEnd: string;
  businessType: string;
  address: string;
}

const Setup: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<SetupData>({
    organizationName: '',
    trn: '',
    fiscalYearStart: '',
    fiscalYearEnd: '',
    businessType: '',
    address: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleInputChange = (field: keyof SetupData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Save to localStorage or context
    localStorage.setItem('peergos_setup_complete', 'true');
    localStorage.setItem('peergos_organization_data', JSON.stringify(formData));
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.organizationName && formData.trn;
      case 2:
        return formData.fiscalYearStart && formData.fiscalYearEnd;
      case 3:
        return formData.businessType && formData.address;
      case 4:
        return true; // Tax agent selection is optional
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {t('setup.title', 'Setup Your Tax System')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {t('setup.subtitle', 'Configure your organization details to get started')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl rounded-lg sm:px-10">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {step < currentStep ? (
                      <CheckCircleIcon className="w-5 h-5" />
                    ) : (
                      step
                    )}
                  </div>
                  {step < totalSteps && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        step < currentStep ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Organization Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <BuildingOfficeIcon className="w-6 h-6 text-indigo-600" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('setup.step1.title', 'Organization Information')}
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('setup.step1.orgName', 'Organization Name')}
                </label>
                <input
                  type="text"
                  value={formData.organizationName}
                  onChange={(e) => handleInputChange('organizationName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter your organization name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('setup.step1.trn', 'Tax Registration Number (TRN)')}
                </label>
                <input
                  type="text"
                  value={formData.trn}
                  onChange={(e) => handleInputChange('trn', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="100000000000003"
                />
              </div>
            </div>
          )}

          {/* Step 2: Fiscal Year */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <CalendarIcon className="w-6 h-6 text-indigo-600" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('setup.step2.title', 'Fiscal Year Configuration')}
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('setup.step2.startDate', 'Fiscal Year Start Date')}
                </label>
                <input
                  type="date"
                  value={formData.fiscalYearStart}
                  onChange={(e) => handleInputChange('fiscalYearStart', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('setup.step2.endDate', 'Fiscal Year End Date')}
                </label>
                <input
                  type="date"
                  value={formData.fiscalYearEnd}
                  onChange={(e) => handleInputChange('fiscalYearEnd', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Step 3: Business Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <IdentificationIcon className="w-6 h-6 text-indigo-600" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('setup.step3.title', 'Business Details')}
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('setup.step3.businessType', 'Business Type')}
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select business type</option>
                  <option value="llc">Limited Liability Company (LLC)</option>
                  <option value="fze">Free Zone Establishment (FZE)</option>
                  <option value="fzco">Free Zone Company (FZCO)</option>
                  <option value="branch">Branch Office</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('setup.step3.address', 'Business Address')}
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter your business address"
                />
              </div>
            </div>
          )}

          {/* Step 4: Tax Agent Selection */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('setup.step4.title', 'Tax Agent Selection (Optional)')}
                </h3>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {t('setup.step4.description', 'You can select an FTA-approved tax agent to assist with your tax compliance and submissions. This is optional and can be configured later.')}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <TaxAgentSelector showTitle={false} variant="full" />
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {t('common.previous', 'Previous')}
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  canProceed()
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                }`}
              >
                {t('common.next', 'Next')}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canProceed()}
                className={`px-6 py-2 text-sm font-medium rounded-md ${
                  canProceed()
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                }`}
              >
                {t('setup.complete', 'Complete Setup')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup;
