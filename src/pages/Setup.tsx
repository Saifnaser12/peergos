import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useI18nHelpers from '../hooks/useI18nHelpers';
import { useTheme } from '../context/ThemeContext';
import Layout from '../components/Layout';
import {
  CheckCircleIcon,
  Cog6ToothIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

interface SetupStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  icon: React.ComponentType<any>;
}

const Setup: React.FC = () => {
  const { t } = useI18nHelpers();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [setupData, setSetupData] = useState({
    organizationName: '',
    trn: '',
    fiscalYearStart: '',
    fiscalYearEnd: '',
    businessType: '',
    address: ''
  });

  const steps: SetupStep[] = [
    {
      id: 1,
      title: t('setup.step1.title', 'Organization Details'),
      description: t('setup.step1.description', 'Enter your basic organization information'),
      completed: false,
      icon: BuildingOfficeIcon
    },
    {
      id: 2,
      title: t('setup.step2.title', 'Fiscal Year'),
      description: 'Set your fiscal year dates',
      completed: false,
      icon: CalendarDaysIcon
    },
    {
      id: 3,
      title: t('setup.step3.title', 'Business Information'),
      description: 'Configure business type and address',
      completed: false,
      icon: DocumentTextIcon
    },
    {
      id: 4,
      title: t('setup.step4.title', 'Tax Agent Selection'),
      description: t('setup.step4.description', 'Choose a tax agent to help with compliance'),
      completed: false,
      icon: Cog6ToothIcon
    },
    {
      id: 5,
      title: t('setup.step5.title', 'System Integrations'),
      description: t('setup.step5.description', 'Connect your POS and accounting systems'),
      completed: false,
      icon: LinkIcon
    }
  ];

  const handleComplete = () => {
    localStorage.setItem('peergos_setup_complete', 'true');
    navigate('/dashboard');
  };

  const handleInputChange = (field: string, value: string) => {
    setSetupData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('setup.step1.orgName', 'Organization Name')}
              </label>
              <input
                type="text"
                value={setupData.organizationName}
                onChange={(e) => handleInputChange('organizationName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your organization name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('setup.step1.trn', 'Tax Registration Number (TRN)')}
              </label>
              <input
                type="text"
                value={setupData.trn}
                onChange={(e) => handleInputChange('trn', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your TRN"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('setup.step2.startDate', 'Fiscal Year Start')}
              </label>
              <input
                type="date"
                value={setupData.fiscalYearStart}
                onChange={(e) => handleInputChange('fiscalYearStart', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('setup.step2.endDate', 'Fiscal Year End')}
              </label>
              <input
                type="date"
                value={setupData.fiscalYearEnd}
                onChange={(e) => handleInputChange('fiscalYearEnd', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('setup.step3.businessType', 'Business Type')}
              </label>
              <select
                value={setupData.businessType}
                onChange={(e) => handleInputChange('businessType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Business Type</option>
                <option value="llc">LLC</option>
                <option value="corporation">Corporation</option>
                <option value="partnership">Partnership</option>
                <option value="sole_proprietorship">Sole Proprietorship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('setup.step3.address', 'Business Address')}
              </label>
              <textarea
                value={setupData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your business address"
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="text-center py-8">
            <Cog6ToothIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Tax Agent Selection
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Configure your tax agent preferences
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Tax agent integration will be configured in the next update
              </p>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="text-center py-8">
            <LinkIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              System Integrations
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Connect your external systems
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300">
                POS and accounting system integrations will be available soon
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('setup.title', 'Setup Your Tax System')}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {t('setup.subtitle', 'Configure your organization details to get started')}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = step.id < currentStep;

                return (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : isActive
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : 'bg-gray-200 border-gray-300 text-gray-500 dark:bg-gray-700 dark:border-gray-600'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircleIcon className="w-6 h-6" />
                      ) : (
                        <StepIcon className="w-6 h-6" />
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-20 h-1 mx-2 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {steps[currentStep - 1]?.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {steps[currentStep - 1]?.description}
            </p>
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Previous
            </button>

            {currentStep < steps.length ? (
              <button
                onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                {t('setup.complete', 'Complete Setup')}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Setup;