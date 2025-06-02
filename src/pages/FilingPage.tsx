import React, { useState } from 'react';
import { useTax } from '../context/TaxContext';
import { Validator } from '../utils/validation';
import { SecureStorage } from '../utils/storage';
import Button from '../components/Button';
import type { RevenueEntry, ExpenseEntry } from '../types';

interface FilingFormData {
  period: string;
  trn: string;
}

interface FilingState extends FilingFormData {
  step: number;
  isDeclarationAccepted: boolean;
}

export const FilingPage: React.FC = () => {
  const { state: taxData } = useTax();
  const [state, setState] = useState<FilingState>({
    step: 1,
    period: '',
    trn: '',
    isDeclarationAccepted: false
  });
  const [errors, setErrors] = useState<Partial<FilingFormData>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateStep1 = () => {
    const newErrors: Partial<FilingFormData> = {};

    if (!state.period) {
      newErrors.period = 'Filing Period is required';
    }

    const trnValidation = Validator.validateTRN(state.trn);
    if (!trnValidation.isValid) {
      newErrors.trn = trnValidation.errors[0];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (state.step === 1 && !validateStep1()) {
      return;
    }
    setState(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const handleBack = () => {
    setState(prev => ({ ...prev, step: prev.step - 1 }));
  };

  const calculateTotal = (items: (RevenueEntry | ExpenseEntry)[], field: keyof RevenueEntry | keyof ExpenseEntry): number => {
    return items.reduce((sum: number, item) => sum + (item[field] as number || 0), 0);
  };

  const handleSubmit = () => {
    const filing = {
      period: state.period,
      trn: state.trn,
      totalRevenue: calculateTotal(taxData.revenues, 'amount'),
      totalExpenses: calculateTotal(taxData.expenses, 'amount'),
      vatPayable: calculateTotal(taxData.revenues, 'vatAmount'),
      submittedAt: new Date().toISOString()
    };

    const existingFilings = SecureStorage.get<any[]>('filings') || [];
    SecureStorage.set('filings', [...existingFilings, filing]);
    
    setSuccessMessage('Filing Submitted Successfully');
    // Reset form after successful submission
    setState({
      step: 1,
      period: '',
      trn: '',
      isDeclarationAccepted: false
    });
  };

  const saveDraft = () => {
    SecureStorage.set('draftFiling', {
      ...state,
      lastUpdated: new Date().toISOString()
    });
    setSuccessMessage('Draft Saved');
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Tax Filing Period</h2>
      <div>
        <label htmlFor="period" className="block text-sm font-medium text-gray-700">
          Filing Period
        </label>
        <select
          id="period"
          value={state.period}
          onChange={e => setState(prev => ({ ...prev, period: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select Period</option>
          <option value="2024-Q1">2024 Q1</option>
          <option value="2024-Q2">2024 Q2</option>
        </select>
        {errors.period && <p className="mt-1 text-sm text-red-600">{errors.period}</p>}
      </div>
      <div>
        <label htmlFor="trn" className="block text-sm font-medium text-gray-700">
          Tax Registration Number (TRN)
        </label>
        <input
          type="text"
          id="trn"
          value={state.trn}
          onChange={e => setState(prev => ({ ...prev, trn: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.trn && <p className="mt-1 text-sm text-red-600">{errors.trn}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Revenue Summary</h2>
      <div className="rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Revenue</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {new Intl.NumberFormat('en-AE', {
                  style: 'decimal',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(calculateTotal(taxData.revenues, 'amount'))}{' '}
                AED
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Total VAT</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {new Intl.NumberFormat('en-AE', {
                  style: 'decimal',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(calculateTotal(taxData.revenues, 'vatAmount'))}{' '}
                AED
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Expense Summary</h2>
      <div className="rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <dl>
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Expenses</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {new Intl.NumberFormat('en-AE', {
                  style: 'decimal',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(calculateTotal(taxData.expenses, 'amount'))}{' '}
                AED
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => {
    const totalRevenue = calculateTotal(taxData.revenues, 'amount');
    const totalExpenses = calculateTotal(taxData.expenses, 'amount');
    const vatPayable = calculateTotal(taxData.revenues, 'vatAmount');

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Filing Summary</h2>
        <div className="rounded-lg bg-white shadow p-6 space-y-4">
          <p>Net Income: {totalRevenue - totalExpenses} AED</p>
          <p>VAT Payable: {vatPayable} AED</p>
          
          <div className="mt-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={state.isDeclarationAccepted}
                onChange={e => setState(prev => ({ ...prev, isDeclarationAccepted: e.target.checked }))}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                I declare that the information provided is true and accurate
              </span>
            </label>
          </div>
        </div>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="rounded-lg bg-green-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-green-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-green-800">{successMessage}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {successMessage ? (
        renderSuccess()
      ) : (
        <div className="space-y-8">
          {state.step === 1 && renderStep1()}
          {state.step === 2 && renderStep2()}
          {state.step === 3 && renderStep3()}
          {state.step === 4 && renderStep4()}

          <div className="flex justify-between">
            {state.step > 1 && (
              <Button onClick={handleBack} variant="secondary">
                Back
              </Button>
            )}
            <div className="flex space-x-4">
              <Button onClick={saveDraft} variant="outline">
                Save Draft
              </Button>
              {state.step < 4 ? (
                <Button onClick={handleNext}>Next</Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!state.isDeclarationAccepted}
                >
                  Submit Filing
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 