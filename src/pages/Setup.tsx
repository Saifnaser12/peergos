import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import TaxAgentSelector from '../components/TaxAgentSelector';
import POSIntegrationToggle from '../components/POSIntegrationToggle';
import { 
  BuildingOfficeIcon, 
  IdentificationIcon, 
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

interface SetupData {
  organizationName: string;
  trn: string;
  fiscalYearStart: string;
  fiscalYearEnd: string;
  businessType: string;
  address: string;
  isFreeZone: boolean;
  freeZoneName: string;
  freeZoneAddress: string;
  freeZoneEmployees: number;
  freeZoneOperatingExpenses: number;
  freeZoneIncome: {
    qualifying: number;
    nonQualifying: number;
  };
  smeCategory: string;
  citExemption: boolean;
  vatRegistration: string;
  relatedPartyTracking: boolean;
  bankIntegration: boolean;
}

const Setup: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [isPageLoading, setIsPageLoading] = useState(true);

  const [formData, setFormData] = useState<SetupData>({
    organizationName: '',
    trn: '',
    fiscalYearStart: '',
    fiscalYearEnd: '',
    businessType: '',
    address: '',
    isFreeZone: false,
    freeZoneName: '',
    freeZoneAddress: '',
    freeZoneEmployees: 0,
    freeZoneOperatingExpenses: 0,
    freeZoneIncome: {
      qualifying: 0,
      nonQualifying: 0
    },
    smeCategory: '',
    citExemption: false,
    vatRegistration: '',
    relatedPartyTracking: false,
    bankIntegration: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [showAIGuide, setShowAIGuide] = useState(true);
  const [aiMessage, setAiMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleInputChange = (field: keyof SetupData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Mark final step as completed
    setCompletedSteps(prev => [...prev, currentStep]);

    // Calculate QFZP qualification for Free Zone companies
    let qfzpStatus = null;
    if (formData.isFreeZone) {
      // QFZP qualification criteria: <50 employees AND <500k AED annual expenses
      const isQualified = formData.freeZoneEmployees < 50 && formData.freeZoneOperatingExpenses < 500000;
      qfzpStatus = isQualified ? 'qualified' : 'unqualified';
    }

    const setupData = {
      ...formData,
      qfzpStatus,
      setupCompletedAt: new Date().toISOString()
    };

    // Show confetti celebration
    setShowConfetti(true);
    const message = formData.isFreeZone 
      ? `🎉 Congratulations! Your Free Zone company setup is complete. QFZP Status: ${qfzpStatus?.toUpperCase()}. Welcome to automated tax management!`
      : "🎉 Congratulations! Your Peergos tax system is now fully configured and ready for UAE compliance. Welcome to automated tax management!";
    setAiMessage(message);

    // Save to localStorage or context
    localStorage.setItem('peergos_setup_complete', 'true');
    localStorage.setItem('peergos_organization_data', JSON.stringify(setupData));

    // Navigate to dashboard after celebration
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.organizationName && formData.trn;
      case 2:
        return formData.fiscalYearStart && formData.fiscalYearEnd;
      case 3:
        return formData.businessType && formData.address && formData.smeCategory;
      case 4:
        return true; // Tax agent selection is optional
      case 5:
        return true; // POS integration is optional
      default:
        return false;
    }
  };

  // AI Guidance System
  const getAIGuidance = (step: number) => {
    const guidance = {
      1: "Welcome to Peergos — your UAE tax assistant! 🇦🇪 Let's start by setting up your company details. I'll need your organization name and TRN (Tax Registration Number) to ensure FTA compliance.",
      2: "Great! Now let's configure your fiscal year. This determines your CIT filing deadlines. Most UAE companies use calendar year (Jan-Dec), but you can customize based on your business needs.",
      3: "Perfect! Next, I need your business type and address. If you operate in a Free Zone, I'll also determine your QFZP (Qualifying Free Zone Person) status for special tax treatments.",
      4: "You're doing great! 🎯 Tax agent selection is optional but recommended for complex filings. FTA-approved agents can help ensure compliance and represent you during audits.",
      5: "Almost there! System integrations help automate your bookkeeping. Connect your POS or accounting software to sync transactions automatically. Don't worry - this is optional and can be set up later."
    };
    return guidance[step as keyof typeof guidance] || '';
  };

  const getProgressTips = (step: number) => {
    const tips = {
      1: "💡 Tip: Your TRN should be 15 digits starting with '1'. Example: 100000000000003",
      2: "💡 Tip: CIT filing deadline is 9 months after your fiscal year end",
      3: "💡 Tip: QFZP qualification requires <50 employees and <500k AED annual operating expenses",
      4: "💡 Tip: Tax agents charge 0.1-0.5% of revenue for compliance services",
      5: "💡 Tip: Automated integrations reduce manual data entry by 80%"
    };
    return tips[step as keyof typeof tips] || '';
  };

  // Page initialization
  useEffect(() => {
    // Simulate any async initialization
    const initializePage = async () => {
      try {
        // Small delay to ensure contexts are loaded
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsPageLoading(false);
      } catch (error) {
        console.error('Setup page initialization error:', error);
        setIsPageLoading(false);
      }
    };
    
    initializePage();
  }, []);

  // Update AI guidance when step changes
  useEffect(() => {
    if (showAIGuide) {
      setAiMessage(getAIGuidance(currentStep));
    }
  }, [currentStep, showAIGuide]);

  // Mark step as completed when user proceeds
  useEffect(() => {
    if (canProceed() && currentStep > 1 && !completedSteps.includes(currentStep - 1)) {
      setCompletedSteps(prev => [...prev, currentStep - 1]);
    }
  }, [currentStep, canProceed, completedSteps]);

  const getCompletionPercentage = () => {
    return Math.round((completedSteps.length / totalSteps) * 100);
  };

  // Show loading state while page initializes
  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <div className="text-gray-600 dark:text-gray-400">Loading Setup...</div>
      </div>
    );
  }

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

        {/* Progress Bar */}
        <div className="mt-4 max-w-xs mx-auto">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>{t('setup.progress', 'Setup Progress')}</span>
            <span>{completedSteps.length}/{totalSteps} {t('common.complete', 'Complete')}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getCompletionPercentage()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* AI Onboarding Guide Widget */}
      {showAIGuide && (
        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-2xl">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800 shadow-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                    <SparklesIcon className="w-4 h-4 mr-1 text-indigo-500" />
                    AI Setup Assistant
                  </h4>
                  <button
                    onClick={() => setShowAIGuide(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  {aiMessage}
                </p>
                <div className="mt-3 flex items-center text-xs text-indigo-600 dark:text-indigo-400">
                  <LightBulbIcon className="w-3 h-3 mr-1" />
                  {getProgressTips(currentStep)}
                </div>
              </div>
            </div>

            {/* Confetti Effect */}
            {showConfetti && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-4xl animate-bounce">🎉</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl rounded-lg sm:px-10">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4, 5].map((step) => (
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

              {/* SME Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  SME Category
                </label>
                <select
                  value={formData.smeCategory}
                  onChange={(e) => handleInputChange('smeCategory', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select SME Category</option>
                  <option value="micro">Micro</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                </select>
              </div>

              {/* Free Zone Section */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    id="freeZoneCheckbox"
                    checked={formData.isFreeZone}
                    onChange={(e) => handleInputChange('isFreeZone', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="freeZoneCheckbox" className="text-sm font-medium text-gray-900 dark:text-white">
                    {t('setup.step3.freeZone', 'I operate in a UAE Free Zone')}
                  </label>
                </div>

                {formData.isFreeZone && (
                  <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('setup.step3.freeZoneName', 'Free Zone Name')}
                        </label>
                        <select
                          value={formData.freeZoneName}
                          onChange={(e) => handleInputChange('freeZoneName', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="">Select Free Zone</option>
                          <option value="DIFC">Dubai International Financial Centre (DIFC)</option>
                          <option value="DMCC">Dubai Multi Commodities Centre (DMCC)</option>
                          <option value="JAFZA">Jebel Ali Free Zone (JAFZA)</option>
                          <option value="ADGM">Abu Dhabi Global Market (ADGM)</option>
                          <option value="RAK">Ras Al Khaimah Economic Zone (RAKEZ)</option>
                          <option value="SAIF">Sharjah Airport International Free Zone (SAIF)</option>
                          <option value="AFZA">Ajman Free Zone (AFZA)</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('setup.step3.employees', 'Number of Employees')}
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.freeZoneEmployees}
                          onChange={(e) => handleInputChange('freeZoneEmployees', parseInt(e.target.value) || 0)}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('setup.step3.freeZoneAddress', 'Free Zone Registered Address')}
                      </label>
                      <textarea
                        value={formData.freeZoneAddress}
                        onChange={(e) => handleInputChange('freeZoneAddress', e.target.value)}
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Enter your Free Zone registered address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('setup.step3.operatingExpenses', 'Annual Operating Expenses in Free Zone (AED)')}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.freeZoneOperatingExpenses}
                        onChange={(e) => handleInputChange('freeZoneOperatingExpenses', parseFloat(e.target.value) || 0)}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="0"
                      />
                    </div>

                      {/* QFZP Status Display */}
                      <div className="mt-4 p-3 rounded-lg border">
                        <div className={`flex items-center space-x-2 ${
                          formData.freeZoneEmployees < 50 && formData.freeZoneOperatingExpenses < 500000
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-orange-700 dark:text-orange-300'
                        }`}>
                          <div className={`w-3 h-3 rounded-full ${
                            formData.freeZoneEmployees < 50 && formData.freeZoneOperatingExpenses < 500000
                              ? 'bg-green-500'
                              : 'bg-orange-500'
                          }`}></div>
                          <span className={`text-sm font-medium ${
                            formData.freeZoneEmployees < 50 && formData.freeZoneOperatingExpenses < 500000
                              ? 'text-green-800 dark:text-green-200'
                              : 'text-orange-800 dark:text-orange-200'
                          }`}>
                            QFZP Status: {formData.freeZoneEmployees < 50 && formData.freeZoneOperatingExpenses < 500000 ? 'Qualified' : 'Unqualified'}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 ${
                          formData.freeZoneEmployees < 50 && formData.freeZoneOperatingExpenses < 500000
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-orange-700 dark:text-orange-300'
                        }`}>
                          {formData.freeZoneEmployees < 50 && formData.freeZoneOperatingExpenses < 500000 
                            ? 'Your company qualifies for QFZP benefits and special tax treatments.'
                            : 'Your company does not qualify for QFZP status. Standard Free Zone tax rules apply.'
                          }
                        </p>
                      </div>

                      {/* Free Zone Income Categorization (for QFZP CIT calculation) */}
                      {formData.freeZoneEmployees < 50 && formData.freeZoneOperatingExpenses < 500000 && (
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
                            QFZP Income Categories (for CIT Calculation)
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="qualifyingIncome" className="block text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                                Qualifying Income (0% CIT rate)
                              </label>
                              <input
                                id="qualifyingIncome"
                                type="number"
                                className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                                value={formData.freeZoneIncome?.qualifying || 0}
                                onChange={(e) => setFormData({
                                  ...formData, 
                                  freeZoneIncome: {
                                    ...formData.freeZoneIncome,
                                    qualifying: parseInt(e.target.value) || 0
                                  }
                                })}
                                placeholder="0"
                              />
                              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                Exports, intra-zone trade, qualifying activities
                              </p>
                            </div>

                            <div>
                              <label htmlFor="nonQualifyingIncome" className="block text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                                Non-Qualifying Income (9% CIT rate)
                              </label>
                              <input
                                id="nonQualifyingIncome"
                                type="number"
                                className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                                value={formData.freeZoneIncome?.nonQualifying || 0}
                                onChange={(e) => setFormData({
                                  ...formData, 
                                  freeZoneIncome: {
                                    ...formData.freeZoneIncome,
                                    nonQualifying: parseInt(e.target.value) || 0
                                  }
                                })}
                                placeholder="0"
                              />
                              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                Mainland sales, domestic consumption
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                )}
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

          {/* Step 5: System Integrations */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('setup.step5.title', 'System Integrations (Optional)')}
                </h3>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {t('setup.step5.description', 'Connect your POS system and accounting software to automatically sync transactions and streamline your bookkeeping. This is optional and can be configured later.')}
                </p>
              </div>

              {/* Integrations Section */}
              <div className="space-y-6">
                {/* POS Integration */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {t('setup.integrations.pos.title', 'POS System Integration')}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {t('setup.integrations.pos.description', 'Connect your point-of-sale system for automated transaction sync')}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <p><strong>{t('setup.integrations.supported', 'Supported Systems')}:</strong></p>
                    <p>• Omnivore POS • Toast POS • Clover POS</p>
                  </div>
                </div>

                {/* Accounting Integration */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {t('setup.integrations.accounting.title', 'Accounting System Sync')}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {t('setup.integrations.accounting.description', 'Sync with accounting software for seamless bookkeeping')}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <p><strong>{t('setup.integrations.supported', 'Supported Systems')}:</strong></p>
                    <p>• Xero • QuickBooks • Zoho Books</p>
                  </div>
                </div>

                {/* Mock Integration Warning */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      {t('setup.integrations.mockWarning', 'Simulation Only - Demo Mode')}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
                    {t('setup.integrations.mockDescription', 'These integrations are simulated for demonstration purposes. No actual connections are made.')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI Guide Toggle */}
          {!showAIGuide && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAIGuide(true)}
                className="inline-flex items-center px-3 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                {t('setup.showAIGuide', 'Show AI Guide')}
              </button>
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
                disabled={!canProceed() || showConfetti}
                className={`px-6 py-2 text-sm font-medium rounded-md flex items-center ${
                  showConfetti
                    ? 'bg-green-500 text-white animate-pulse'
                    : canProceed()
                    ? 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105 transition-all duration-200'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                }`}
              >
                {showConfetti ? (
                  <>
                    <SparklesIcon className="w-4 h-4 mr-1 animate-spin" />
                    {t('setup.celebrating', 'Setting up...')}
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                    {t('setup.complete', 'Complete Setup')}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup;