import React, { useState, useEffect, useMemo } from 'react';
import { useTax } from '../context/TaxContext';
import { useAudit } from '../context/AuditContext';
import SubmissionModal from '../components/SubmissionModal';
import SuccessAlert from '../components/SuccessAlert';
import BulkUpload from '../components/BulkUpload';
import { submitToFTA } from '../utils/submission';
import { ChevronUpIcon, ChevronDownIcon, FunnelIcon, PlusIcon } from '@heroicons/react/24/outline';
import type { RevenueEntry, ExpenseEntry } from '../types';
import { EmptyState, illustrations } from '../components/Illustration';
import Button from '../components/Button';
import Card from '../components/Card';
import PermissionGate from '../components/PermissionGate';
import { useTranslation } from 'react-i18next';

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

const Filing: React.FC = () => {
  const { state, dispatch } = useTax();
  const { log } = useAudit();
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

  const { t } = useTranslation();

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
    let result = filterEntries(state.revenues, revenueFilters);
    return sortEntries(result, revenueSort);
  }, [state.revenues, revenueFilters, revenueSort]);

  const filteredSortedExpenses = useMemo(() => {
    let result = filterEntries(state.expenses, expenseFilters);
    return sortEntries(result, expenseSort);
  }, [state.expenses, expenseFilters, expenseSort]);

  // Get unique categories/sources for filter options
  const revenueSources = useMemo(() => 
    Array.from(new Set(state.revenues.map(r => r.source))),
    [state.revenues]
  );

  const expenseCategories = useMemo(() => 
    Array.from(new Set(state.expenses.map(e => e.category))),
    [state.expenses]
  );

  const handleDraftToggle = () => {
    dispatch({ type: 'TOGGLE_DRAFT_MODE', payload: !state.isDraftMode });
  };

  const handleSubmitToFTA = async () => {
    if (!state.profile) {
      console.error('No profile data available');
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData = {
        trn: state.profile.trnNumber,
        timestamp: new Date().toISOString(),
        referenceNumber: '',
        data: {
          revenues: state.revenues,
          expenses: state.expenses,
          vatDue: state.revenues.reduce((sum, entry) => sum + entry.vatAmount, 0),
          citDue: state.revenues.reduce((sum, entry) => sum + (entry.amount * 0.09), 0),
          complianceScore: 100
        }
      };

      const referenceNumber = await submitToFTA(submissionData);
      
      log('SUBMIT_FILING', {
        trn: state.profile.trnNumber,
        referenceNumber,
        vatDue: submissionData.data.vatDue,
        citDue: submissionData.data.citDue
      });

      // Clear draft after successful submission
      if (state.isDraftMode) {
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
      dispatch({ type: 'ADD_REVENUES', payload: entries as RevenueEntry[] });
    } else {
      dispatch({ type: 'ADD_EXPENSES', payload: entries as ExpenseEntry[] });
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
      {!state.revenues.length && !state.expenses.length ? (
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
                  checked={state.isDraftMode}
                  onChange={handleDraftToggle}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Save as Draft
                </span>
              </label>
              {state.isDraftMode && (
                <span className="text-sm text-gray-500">
                  Auto-saving changes...
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={!state.profile}
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
    </div>
  );
};

export default Filing; 