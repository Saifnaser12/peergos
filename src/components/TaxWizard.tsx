
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowRightIcon, 
  ArrowLeftIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  validation?: () => boolean;
  estimatedTime: string;
}

const TaxWizard: React.FC = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const steps: WizardStep[] = [
    {
      id: 'business-info',
      title: 'Business Information',
      description: 'Tell us about your business',
      component: BusinessInfoStep,
      estimatedTime: '3 min'
    },
    {
      id: 'income-review',
      title: 'Income Review',
      description: 'Review your revenue streams',
      component: IncomeReviewStep,
      estimatedTime: '5 min'
    },
    {
      id: 'expense-deductions',
      title: 'Expenses & Deductions',
      description: 'Maximize your tax savings',
      component: ExpenseDeductionsStep,
      estimatedTime: '7 min'
    },
    {
      id: 'tax-calculations',
      title: 'Tax Calculations',
      description: 'See your tax liability',
      component: TaxCalculationsStep,
      estimatedTime: '2 min'
    },
    {
      id: 'review-submit',
      title: 'Review & Submit',
      description: 'Final review before FTA submission',
      component: ReviewSubmitStep,
      estimatedTime: '5 min'
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Progress Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              UAE Tax Filing Wizard
            </h1>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  completedSteps.has(index) 
                    ? 'bg-green-500 text-white' 
                    : index === currentStep 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {completedSteps.has(index) ? (
                    <CheckCircleIcon className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center max-w-20">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {steps[currentStep].description}
              </p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <InformationCircleIcon className="w-4 h-4 mr-1" />
                Estimated time: {steps[currentStep].estimatedTime}
              </div>
            </div>

            {/* Step Content */}
            <CurrentStepComponent onNext={nextStep} onPrev={prevStep} />
          </div>

          {/* Navigation */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-8 py-4">
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Previous
              </button>
              
              <button
                onClick={nextStep}
                disabled={currentStep === steps.length - 1}
                className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === steps.length - 1 ? 'Submit to FTA' : 'Continue'}
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder step components
const BusinessInfoStep: React.FC<any> = () => <div>Business Info Form</div>;
const IncomeReviewStep: React.FC<any> = () => <div>Income Review Form</div>;
const ExpenseDeductionsStep: React.FC<any> = () => <div>Expense Deductions Form</div>;
const TaxCalculationsStep: React.FC<any> = () => <div>Tax Calculations Display</div>;
const ReviewSubmitStep: React.FC<any> = () => <div>Review & Submit Form</div>;

export default TaxWizard;
