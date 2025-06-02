import React, { useState, useEffect, useMemo } from 'react';
import { useTax } from '../context/TaxContext';
import { useAudit } from '../context/AuditContext';
import SubmissionModal from '../components/SubmissionModal';
import SuccessAlert from '../components/SuccessAlert';
import { submitToFTA } from '../utils/submission';
import { ChevronUpIcon, ChevronDownIcon, FunnelIcon, PlusIcon } from '@heroicons/react/24/outline';
import type { RevenueEntry, ExpenseEntry } from '../types';
import { EmptyState, illustrations } from '../components/Illustration';
import Button from '../components/Button';
import Card from '../components/Card';
import PermissionGate from '../components/PermissionGate';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../components/Card';
import { 
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  TagIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import { Validator } from '../utils/validation';
import { SecureStorage } from '../utils/storage';

interface FilterState {
  dateRange: {
    start: string;
    end: string;
  };
  category: string[];
  amountRange: {
    min: string;
    max: string;
  };
}

interface SortState {
  field: 'date' | 'amount';
  direction: 'asc' | 'desc';
}

interface FilingFormData {
  period: string;
  trn: string;
}

interface FilingState extends FilingFormData {
  step: number;
  isDeclarationAccepted: boolean;
  selectedTab: string;
  isSubmitting: boolean;
  showConfirmation: boolean;
  errors: Partial<FilingFormData>;
  revenueEntries: RevenueEntry[];
  expenseEntries: ExpenseEntry[];
}

const Filing: React.FC = () => {
  const { state: taxState, dispatch } = useTax();
  const { log } = useAudit();
  const { t } = useTranslation();
  
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    message: string;
    referenceNumber: string;
  } | null>(null);
  const [showBulkUpload, setShowBulkUpload] = useState<'revenue' | 'expense' | null>(null);
  const [showRevenueFilters, setShowRevenueFilters] = useState(false);
  const [showExpenseFilters, setShowExpenseFilters] = useState(false);
  const [showAddRecord, setShowAddRecord] = useState(false);

  // Filter states
  const [revenueFilters, setRevenueFilters] = useState<FilterState>({
    dateRange: { start: '', end: '' },
    category: [],
    amountRange: { min: '', max: '' }
  });

  const [expenseFilters, setExpenseFilters] = useState<FilterState>({
    dateRange: { start: '', end: '' },
    category: [],
    amountRange: { min: '', max: '' }
  });

  // Sort states
  const [revenueSort, setRevenueSort] = useState<SortState>({
    field: 'date',
    direction: 'desc'
  });

  const [expenseSort, setExpenseSort] = useState<SortState>({
    field: 'date',
    direction: 'desc'
  });

  const [filingFormState, setFilingFormState] = useState<FilingState>({
    step: 1,
    period: '',
    trn: '',
    isDeclarationAccepted: false,
    selectedTab: 'revenue',
    isSubmitting: false,
    showConfirmation: false,
    errors: {},
    revenueEntries: [],
    expenseEntries: []
  });

  useEffect(() => {
    log('VIEW_FILING');
  }, [log]);

  // Filter and sort functions
  const filterEntries = <T extends RevenueEntry | ExpenseEntry>(
    entries: T[],
    filters: FilterState
  ): T[] => {
    return entries.filter(entry => {
      const date = new Date(entry.date);
      const amount = entry.amount;
      const category = 'source' in entry ? entry.source : entry.category;

      // Date range filter
      if (filters.dateRange.start && date < new Date(filters.dateRange.start)) return false;
      if (filters.dateRange.end && date > new Date(filters.dateRange.end)) return false;

      // Category filter
      if (filters.category.length > 0 && !filters.category.includes(category)) return false;

      // Amount range filter
      if (filters.amountRange.min && amount < parseFloat(filters.amountRange.min)) return false;
      if (filters.amountRange.max && amount > parseFloat(filters.amountRange.max)) return false;

      return true;
    });
  };

  const sortEntries = <T extends RevenueEntry | ExpenseEntry>(
    entries: T[],
    sort: SortState
  ): T[] => {
    return [...entries].sort((a, b) => {
      const multiplier = sort.direction === 'asc' ? 1 : -1;
      if (sort.field === 'date') {
        return multiplier * (new Date(a.date).getTime() - new Date(b.date).getTime());
      }
      return multiplier * (a.amount - b.amount);
    });
  };

  // Memoized filtered and sorted data
  const filteredSortedRevenues = useMemo(() => {
    let result = filterEntries(taxState.revenues, revenueFilters);
    return sortEntries(result, revenueSort);
  }, [taxState.revenues, revenueFilters, revenueSort]);

  const filteredSortedExpenses = useMemo(() => {
    let result = filterEntries(taxState.expenses, expenseFilters);
    return sortEntries(result, expenseSort);
  }, [taxState.expenses, expenseFilters, expenseSort]);

  // Get unique categories/sources for filter options
  const revenueSources = useMemo(() => 
    Array.from(new Set(taxState.revenues.map(r => r.source))),
    [taxState.revenues]
  );

  const expenseCategories = useMemo(() => 
    Array.from(new Set(taxState.expenses.map(e => e.category))),
    [taxState.expenses]
  );

  const handleDraftToggle = () => {
    dispatch({ type: 'TOGGLE_DRAFT_MODE', payload: !taxState.isDraftMode });
  };

  const handleSubmitToFTA = async () => {
    if (!taxState.profile) {
      console.error('No profile data available');
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData = {
        trn: taxState.profile.trnNumber,
        timestamp: new Date().toISOString(),
        referenceNumber: '',
        data: {
          revenues: taxState.revenues,
          expenses: taxState.expenses,
          vatDue: taxState.revenues.reduce((sum, entry) => sum + entry.vatAmount, 0),
          citDue: taxState.revenues.reduce((sum, entry) => sum + (entry.amount * 0.09), 0),
          complianceScore: 100
        }
      };

      const referenceNumber = await submitToFTA(submissionData);
      
      log('SUBMIT_FILING', {
        trn: taxState.profile.trnNumber,
        referenceNumber,
        vatDue: submissionData.data.vatDue,
        citDue: submissionData.data.citDue
      });

      // Clear draft after successful submission
      if (taxState.isDraftMode) {
        dispatch({ type: 'CLEAR_DRAFT' });
      }

      setSubmissionSuccess({
        message: 'Tax report submitted successfully to FTA.',
        referenceNumber
      });
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
      setIsSubmitModalOpen(false);
    }
  };

  const handleBulkUpload = (entries: (RevenueEntry | ExpenseEntry)[]) => {
    if (showBulkUpload === 'revenue') {
      entries.forEach(entry => {
        dispatch({ type: 'ADD_REVENUE', payload: entry as RevenueEntry });
      });
    } else {
      entries.forEach(entry => {
        dispatch({ type: 'ADD_EXPENSE', payload: entry as ExpenseEntry });
      });
    }
    setShowBulkUpload(null);
  };

  const renderFilterPanel = (
    type: 'revenue' | 'expense',
    filters: FilterState,
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>,
    categories: string[]
  ) => (
    <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              dateRange: { ...prev.dateRange, start: e.target.value }
            }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={filters.dateRange.end}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              dateRange: { ...prev.dateRange, end: e.target.value }
            }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {type === 'revenue' ? 'Sources' : 'Categories'}
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                setFilters(prev => ({
                  ...prev,
                  category: prev.category.includes(category)
                    ? prev.category.filter(c => c !== category)
                    : [...prev.category, category]
                }));
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filters.category.includes(category)
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Min Amount</label>
          <input
            type="number"
            value={filters.amountRange.min}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              amountRange: { ...prev.amountRange, min: e.target.value }
            }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Max Amount</label>
          <input
            type="number"
            value={filters.amountRange.max}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              amountRange: { ...prev.amountRange, max: e.target.value }
            }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="999999999"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setFilters({
            dateRange: { start: '', end: '' },
            category: [],
            amountRange: { min: '', max: '' }
          })}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );

  const renderSortHeader = (
    label: string,
    field: 'date' | 'amount',
    sort: SortState,
    setSort: React.Dispatch<React.SetStateAction<SortState>>
  ) => (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
      onClick={() => setSort(prev => ({
        field,
        direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
      }))}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        {sort.field === field && (
          sort.direction === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />
        )}
      </div>
    </th>
  );

  const validateStep1 = () => {
    if (!filingFormState.period) {
      setFilingFormState(prev => ({ ...prev, errors: { period: 'Period is required' } }));
      return false;
    }
    const trnValidation = Validator.validateTRN(filingFormState.trn);
    if (!trnValidation.isValid) {
      setFilingFormState(prev => ({ ...prev, errors: { trn: trnValidation.errors[0] } }));
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (filingFormState.step === 1 && !validateStep1()) {
      return;
    }
    setFilingFormState(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const handleBack = () => {
    setFilingFormState(prev => ({ ...prev, step: prev.step - 1 }));
  };

  const handleSubmit = () => {
    const submissionData = {
      period: filingFormState.period,
      trn: filingFormState.trn,
      totalRevenue: taxState.revenues.reduce((sum, r) => sum + r.amount, 0),
      totalExpenses: taxState.expenses.reduce((sum, e) => sum + e.amount, 0),
      vatPayable: taxState.revenues.reduce((sum, r) => sum + (r.vatAmount || 0), 0),
    };

    // Submit data to backend
    console.log('Submitting:', submissionData);
    setFilingFormState(prev => ({ ...prev, showConfirmation: true }));
  };

  const saveDraft = () => {
    SecureStorage.set('draftFiling', {
      ...taxState,
      lastUpdated: new Date().toISOString()
    });
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
          value={filingFormState.period}
          onChange={e => setFilingFormState(prev => ({ ...prev, period: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select Period</option>
          <option value="2024-Q1">2024 Q1</option>
          <option value="2024-Q2">2024 Q2</option>
        </select>
        {filingFormState.errors.period && <p className="mt-1 text-sm text-red-600">{filingFormState.errors.period}</p>}
      </div>
      <div>
        <label htmlFor="trn" className="block text-sm font-medium text-gray-700">
          Tax Registration Number (TRN)
        </label>
        <input
          type="text"
          id="trn"
          value={filingFormState.trn}
          onChange={e => setFilingFormState(prev => ({ ...prev, trn: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {filingFormState.errors.trn && <p className="mt-1 text-sm text-red-600">{filingFormState.errors.trn}</p>}
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
                }).format(taxState.revenues.reduce((sum, r) => sum + r.amount, 0))}{' '}
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
                }).format(taxState.revenues.reduce((sum, r) => sum + (r.vatAmount || 0), 0))}{' '}
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
                }).format(taxState.expenses.reduce((sum, e) => sum + e.amount, 0))}{' '}
                AED
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => {
    const totalRevenue = taxState.revenues.reduce((sum, r) => sum + r.amount, 0);
    const totalExpenses = taxState.expenses.reduce((sum, e) => sum + e.amount, 0);
    const vatPayable = taxState.revenues.reduce((sum, r) => sum + (r.vatAmount || 0), 0);

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
                checked={filingFormState.isDeclarationAccepted}
                onChange={e => setFilingFormState(prev => ({ ...prev, isDeclarationAccepted: e.target.checked }))}
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
          <p className="text-sm font-medium text-green-800">{filingFormState.showConfirmation ? 'Filing Submitted Successfully' : 'Filing Submitted Successfully'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t('filing.title', 'Tax Filing')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('filing.description', 'Manage your tax returns and submissions')}
        </p>
      </div>
      {!taxState.revenues.length && !taxState.expenses.length ? (
        <EmptyState
          illustration={illustrations.noDataFolder}
          title="No Records Found"
          description="Start by adding your revenue and expense records to track your tax obligations."
          action={
            <PermissionGate
              resource="filing"
              requiredPermission="edit"
              restrictedTo="SME or Admin"
            >
              <Button
                variant="primary"
                icon={<PlusIcon className="h-5 w-5" />}
                onClick={() => setShowAddRecord(true)}
              >
                Add New Record
              </Button>
            </PermissionGate>
          }
        />
      ) : (
        <>
          {/* Revenue Section */}
          <PermissionGate
            resource="filing"
            requiredPermission="view"
            restrictedTo="Tax Agent or Admin"
          >
            <Card>
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Revenue Entries
                </h3>
                <PermissionGate
                  resource="filing"
                  requiredPermission="edit"
                  restrictedTo="SME or Admin"
                >
                  <div className="flex space-x-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowBulkUpload('revenue')}
                    >
                      Bulk Upload
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<FunnelIcon className="h-4 w-4" />}
                      onClick={() => setShowRevenueFilters(!showRevenueFilters)}
                    >
                      Filter
                      {showRevenueFilters ? (
                        <ChevronUpIcon className="h-4 w-4 ml-1" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4 ml-1" />
                      )}
                    </Button>
                  </div>
                </PermissionGate>
              </div>
              {showRevenueFilters && renderFilterPanel('revenue', revenueFilters, setRevenueFilters, revenueSources)}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {renderSortHeader('Date', 'date', revenueSort, setRevenueSort)}
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                      {renderSortHeader('Amount', 'amount', revenueSort, setRevenueSort)}
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VAT Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSortedRevenues.map((entry) => (
                      <tr key={entry.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(entry.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.source}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          AED {entry.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          AED {entry.vatAmount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </PermissionGate>

          {/* Expense Section */}
          <PermissionGate
            resource="filing"
            requiredPermission="view"
            restrictedTo="Tax Agent or Admin"
          >
            <Card>
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Expense Entries
                </h3>
                <PermissionGate
                  resource="filing"
                  requiredPermission="edit"
                  restrictedTo="SME or Admin"
                >
                  <div className="flex space-x-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowBulkUpload('expense')}
                    >
                      Bulk Upload
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<FunnelIcon className="h-4 w-4" />}
                      onClick={() => setShowExpenseFilters(!showExpenseFilters)}
                    >
                      Filter
                      {showExpenseFilters ? (
                        <ChevronUpIcon className="h-4 w-4 ml-1" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4 ml-1" />
                      )}
                    </Button>
                  </div>
                </PermissionGate>
              </div>
              {showExpenseFilters && renderFilterPanel('expense', expenseFilters, setExpenseFilters, expenseCategories)}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {renderSortHeader('Date', 'date', expenseSort, setExpenseSort)}
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      {renderSortHeader('Amount', 'amount', expenseSort, setExpenseSort)}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSortedExpenses.map((entry) => (
                      <tr key={entry.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(entry.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          AED {entry.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </PermissionGate>
        </>
      )}

      {/* Draft Mode and Submit Section */}
      <PermissionGate
        resource="filing"
        requiredPermission="edit"
        restrictedTo="SME or Admin"
      >
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={taxState.isDraftMode}
                  onChange={handleDraftToggle}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Save as Draft
                </span>
              </label>
              {taxState.isDraftMode && (
                <span className="text-sm text-gray-500">
                  Auto-saving changes...
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={!taxState.profile}
            >
              Submit to FTA
            </button>
          </div>

          {submissionSuccess && (
            <div className="mb-6">
              <SuccessAlert
                message={submissionSuccess.message}
                referenceNumber={submissionSuccess.referenceNumber}
                onClose={() => setSubmissionSuccess(null)}
              />
            </div>
          )}
        </div>
      </PermissionGate>

      {/* Modals */}
      <SubmissionModal
        isOpen={isSubmitModalOpen}
        isLoading={isSubmitting}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirm={handleSubmitToFTA}
      />

      {/* Add Record Modal */}
      {showAddRecord && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <Card className="max-w-lg w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">
                Add New Record
              </h3>
              {/* Add record form */}
              {/* ... Your add record form code ... */}
              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowAddRecord(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary">Save Record</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUpload && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <Card className="max-w-lg w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">
                Bulk Upload {showBulkUpload === 'revenue' ? 'Revenue' : 'Expense'} Records
              </h3>
              {/* Bulk upload form */}
              {/* ... Your bulk upload form code ... */}
              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowBulkUpload(null)}
                >
                  Cancel
                </Button>
                <Button variant="primary">Upload</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filing Form */}
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {filingFormState.showConfirmation ? (
          renderSuccess()
        ) : (
          <div className="space-y-8">
            {filingFormState.step === 1 && renderStep1()}
            {filingFormState.step === 2 && renderStep2()}
            {filingFormState.step === 3 && renderStep3()}
            {filingFormState.step === 4 && renderStep4()}

            <div className="mt-8 flex justify-between">
              {filingFormState.step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Back
                </button>
              )}

              {filingFormState.step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!filingFormState.isDeclarationAccepted}
                  className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  Submit Filing
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filing; 