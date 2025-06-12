import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PlusIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';
import { Fab, Tooltip } from '@mui/material';
import RevenueModal from '../components/accounting/RevenueModal';
import ExpenseModal from '../components/accounting/ExpenseModal';
import AccountingSummary from '../components/accounting/AccountingSummary';
import InvoiceModal from '../components/accounting/InvoiceModal';
import { ArrowTrendingUpIcon as TrendingUpIcon } from '@heroicons/react/24/outline';
import { useFinance } from '../context/FinanceContext';
import { useTax } from '../context/TaxContext';
import { exportToExcel } from '../utils/exportUtils';
import FreeZoneAdvisor from '../components/FreeZoneAdvisor';
import { FREE_ZONE_THRESHOLDS } from '../utils/constants';
import {
  CheckCircleIcon,
  CalculatorIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';

interface RevenueEntry {
  id: string;
  date: string;
  description: string;
  customer?: string;
  amount: number;
  invoiceGenerated: boolean;
  invoiceId?: string;
  createdAt: string;
}

interface ExpenseEntry {
  id: string;
  date: string;
  description: string;
  vendor: string;
  category: string;
  amount: number;
  receiptUrl?: string;
  receiptFileName?: string;
  createdAt: string;
}

const Accounting: React.FC = () => {
  const { t } = useTranslation();
  const { state } = useTax();
  const {
    revenue,
    expenses,
    addRevenue,
    addExpense,
    deleteRevenue,
    deleteExpense,
    getTotalRevenue,
    getTotalExpenses,
    getNetIncome,
    getQualifyingIncome,
    getNonQualifyingIncome,
    getNonQualifyingPercentage,
    checkDeMinimisThreshold
  } = useFinance();

  // State management
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingRevenue, setEditingRevenue] = useState<RevenueEntry | null>(null);
  const [editingExpense, setEditingExpense] = useState<ExpenseEntry | null>(null);
  const [activeTab, setActiveTab] = useState<'revenue' | 'expenses'>('revenue');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedRevenueForInvoice, setSelectedRevenueForInvoice] = useState<RevenueEntry | null>(null);
  const [freeZoneAdvisorOpen, setFreeZoneAdvisorOpen] = useState(false);

  const handleBankUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      // TODO: Implement CSV parsing with papaparse
      // For now, show a placeholder message
      alert(t('accounting.bankImport.uploadSuccess', 'CSV uploaded successfully! Bank reconciliation feature coming soon.'));
      console.log('Bank CSV file selected:', file.name);
    } else {
      alert(t('accounting.bankImport.invalidFile', 'Please select a valid CSV file.'));
    }
  };

  // Revenue handlers
  const handleAddRevenue = (revenueData: Omit<RevenueEntry, 'id' | 'createdAt'>) => {
    // Add to global finance context
    addRevenue({
      amount: revenueData.amount,
      description: revenueData.description,
      date: revenueData.date,
      category: revenueData.customer || 'General'
    });
    setIsRevenueModalOpen(false);
  };

  const handleUpdateRevenue = (updatedRevenue: RevenueEntry) => {
    // For now, we'll delete the old and add new (since we don't have update in context yet)
    setEditingRevenue(null);
    setIsRevenueModalOpen(false);
  };

  const handleDeleteRevenue = (id: string) => {
    if (window.confirm(t('accounting.messages.deleteConfirm'))) {
      deleteRevenue(id);
    }
  };

  // Expense handlers
  const handleAddExpense = (expenseData: Omit<ExpenseEntry, 'id' | 'createdAt'>) => {
    // Add to global finance context
    addExpense({
      amount: expenseData.amount,
      category: expenseData.category,
      date: expenseData.date,
      description: expenseData.description,
      vendor: expenseData.vendor
    });
    setIsExpenseModalOpen(false);
  };

  const handleUpdateExpense = (updatedExpense: ExpenseEntry) => {
    // For now, we'll delete the old and add new (since we don't have update in context yet)
    setEditingExpense(null);
    setIsExpenseModalOpen(false);
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm(t('accounting.messages.deleteConfirm'))) {
      deleteExpense(id);
    }
  };

  const handleEditRevenue = (revenue: RevenueEntry) => {
    setEditingRevenue(revenue);
    setIsRevenueModalOpen(true);
  };

  const handleEditExpense = (expense: ExpenseEntry) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  const handleGenerateInvoice = (revenue: RevenueEntry) => {
    setSelectedRevenueForInvoice(revenue);
    setIsInvoiceModalOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-AE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  // Calculate totals from global context
  const totalRevenue = getTotalRevenue();
  const totalExpenses = getTotalExpenses();
  const netIncome = getNetIncome();

  // Free Zone Income Analytics
  const qualifyingIncome = getQualifyingIncome();
  const nonQualifyingIncome = getNonQualifyingIncome();
  const nonQualifyingPercentage = getNonQualifyingPercentage();
  const deMinimisCheck = checkDeMinimisThreshold();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                <CalculatorIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {t('accounting.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {t('accounting.subtitle')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <AccountingSummary
          totalRevenue={totalRevenue}
          totalExpenses={totalExpenses}
          netIncome={netIncome}
          formatCurrency={formatCurrency}
        />

        {/* Free Zone Income Analysis */}
        {(qualifyingIncome > 0 || nonQualifyingIncome > 0) && (
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <svg className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    {t('accounting.freeZone.title', 'Free Zone Income Analysis')}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Qualifying Income */}
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-700 dark:text-green-300">
                          {t('accounting.freeZone.qualifyingIncome', 'Qualifying Income')}
                        </p>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                          {formatCurrency(qualifyingIncome)}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          {totalRevenue > 0 ? `${((qualifyingIncome / totalRevenue) * 100).toFixed(1)}%` : '0%'} of total revenue
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Non-Qualifying Income */}
                  <div className={`rounded-xl p-4 border ${
                    deMinimisCheck.isCompliant
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${
                          deMinimisCheck.isCompliant
                            ? 'text-yellow-700 dark:text-yellow-300'
                            : 'text-red-700 dark:text-red-300'
                        }`}>
                          {t('accounting.freeZone.nonQualifyingIncome', 'Non-Qualifying Income')}
                        </p>
                        <p className={`text-2xl font-bold ${
                          deMinimisCheck.isCompliant
                            ? 'text-yellow-900 dark:text-yellow-100'
                            : 'text-red-900 dark:text-red-100'
                        }`}>
                          {formatCurrency(nonQualifyingIncome)}
                        </p>
                        <p className={`text-xs mt-1 ${
                          deMinimisCheck.isCompliant
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {nonQualifyingPercentage.toFixed(1)}% of total revenue
                        </p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        deMinimisCheck.isCompliant
                          ? 'bg-yellow-100 dark:bg-yellow-800'
                          : 'bg-red-100 dark:bg-red-800'
                      }`}>
                        <svg className={`w-6 h-6 ${
                          deMinimisCheck.isCompliant
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-red-600 dark:text-red-400'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Compliance Status */}
                  <div className={`rounded-xl p-4 border ${
                    deMinimisCheck.isCompliant
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${
                          deMinimisCheck.isCompliant
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-red-700 dark:text-red-300'
                        }`}>
                          {t('accounting.freeZone.complianceStatus', 'QFZP Compliance')}
                        </p>
                        <p className={`text-lg font-bold ${
                          deMinimisCheck.isCompliant
                            ? 'text-green-900 dark:text-green-100'
                            : 'text-red-900 dark:text-red-100'
                        }`}>
                          {deMinimisCheck.isCompliant ? t('accounting.freeZone.compliant', 'Compliant') : t('accounting.freeZone.nonCompliant', 'Non-Compliant')}
                        </p>
                        <p className={`text-xs mt-1 ${
                          deMinimisCheck.isCompliant
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {deMinimisCheck.isCompliant
                            ? t('accounting.freeZone.withinLimits', 'Within de minimis limits')
                            : t('accounting.freeZone.exceedsLimits', 'Exceeds de minimis thresholds')
                          }
                        </p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        deMinimisCheck.isCompliant
                          ? 'bg-green-100 dark:bg-green-800'
                          : 'bg-red-100 dark:bg-red-800'
                      }`}>
                        {deMinimisCheck.isCompliant ? (
                          <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compliance Warning */}
                {!deMinimisCheck.isCompliant && (
                  <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <div className="flex items-start">
                      <svg className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div>
                        <h4 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                          {t('accounting.freeZone.warningTitle', 'QFZP De Minimis Threshold Exceeded')}
                        </h4>
                        <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                          {t('accounting.freeZone.warningMessage', 'Your non-qualifying income exceeds the de minimis thresholds:')}
                        </p>
                        <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                          {deMinimisCheck.exceedsPercentage && (
                            <li>• {t('accounting.freeZone.percentageExceeded', 'Percentage: {{percentage}}% (limit: 5%)', { percentage: deMinimisCheck.percentage.toFixed(1) })}</li>
                          )}
                          {deMinimisCheck.exceedsAmount && (
                            <li>• {t('accounting.freeZone.amountExceeded', 'Amount: {{amount}} (limit: AED 5M)', { amount: formatCurrency(deMinimisCheck.amount) })}</li>
                          )}
                        </ul>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                          {t('accounting.freeZone.warningAdvice', 'This may affect your QFZP status and tax benefits. Consider restructuring transactions or consult a tax advisor.')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Automated Features Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                🤖 Automated Bookkeeping Features
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Streamlined accounting automation and compliance tools
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:border-blue-700 rounded-lg transition-colors duration-200">
                  <span className="text-2xl mb-2">📄</span>
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">VAT Invoice Generation</span>
                  <span className="text-xs text-blue-600 dark:text-blue-300 mt-1">Automated & FTA-compliant</span>
                </button>
                <button className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 border border-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:border-green-700 rounded-lg transition-colors duration-200">
                  <span className="text-2xl mb-2">🏦</span>
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">Bank Reconciliation</span>
                  <span className="text-xs text-green-600 dark:text-green-300 mt-1">Link payments & receipts</span>
                </button>
                <button className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 dark:border-purple-700 rounded-lg transition-colors duration-200">
                  <span className="text-2xl mb-2">📊</span>
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Financial Statements</span>
                  <span className="text-xs text-purple-600 dark:text-purple-300 mt-1">FTA-standardized reports</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"></div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex">
              <button
                onClick={() => setActiveTab('revenue')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                  activeTab === 'revenue'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-b-2 border-blue-500'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <TrendingUpIcon className="h-5 w-5" />
                  <span>{t('accounting.revenue.title')}</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('expenses')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                  activeTab === 'expenses'
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-b-2 border-red-500'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <ArrowTrendingDownIcon className="h-5 w-5" />
                  <span>{t('accounting.expenses.title')}</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          {activeTab === 'revenue' ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('accounting.revenue.title')}
                </h2>
                <button
                  onClick={() => setIsRevenueModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  {t('accounting.revenue.addButton')}
                </button>
              </div>

              {revenue.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('accounting.revenue.table.date')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('accounting.revenue.table.description')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('accounting.revenue.table.customer')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('accounting.revenue.table.amount')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('accounting.revenue.table.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {revenue.map((revenueItem) => (
                        <tr key={revenueItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {formatDate(revenueItem.date)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                            {revenueItem.description}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {revenueItem.category || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                            {formatCurrency(revenueItem.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleGenerateInvoice(revenueItem)}
                                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-150"
                                title={t('accounting.revenue.actions.generateInvoice')}
                              >
                                <DocumentIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteRevenue(revenueItem.id)}
                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-150"
                                title={t('accounting.revenue.actions.delete')}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BanknotesIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {t('accounting.revenue.noData')}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {t('accounting.revenue.noDataDescription')}
                  </p>
                  <button
                    onClick={() => setIsRevenueModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    {t('accounting.revenue.addButton')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('accounting.expenses.title')}
                </h2>
                <button
                  onClick={() => setIsExpenseModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  {t('accounting.expenses.addButton')}
                </button>
              </div>

              {expenses.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('accounting.expenses.table.date')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('accounting.expenses.table.description')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('accounting.expenses.table.vendor')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('accounting.expenses.table.category')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('accounting.expenses.table.amount')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('accounting.expenses.table.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {expenses.map((expense) => (
                        <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {formatDate(expense.date)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                            {expense.description}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {expense.vendor}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                              {t(`accounting.expenses.categories.${expense.category}`)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 dark:text-red-400">
                            {formatCurrency(expense.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleDeleteExpense(expense.id)}
                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-150"
                                title={t('accounting.expenses.actions.delete')}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ArrowTrendingDownIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {t('accounting.expenses.noData')}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {t('accounting.expenses.noDataDescription')}
                  </p>
                  <button
                    onClick={() => setIsExpenseModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    {t('accounting.expenses.addButton')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* POS Integration & Bank Import Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* POS Integration Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('accounting.posIntegration.title', 'POS Integration')}
                </h3>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 mt-1">
                  {t('accounting.comingSoon', 'Coming Soon')}
                </span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {t('accounting.posIntegration.description', 'Connect your Point-of-Sale system to auto-import daily revenue transactions and eliminate manual data entry.')}
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                {t('accounting.posIntegration.feature1', 'Automatic revenue sync')}
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                {t('accounting.posIntegration.feature2', 'Real-time transaction import')}
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                {t('accounting.posIntegration.feature3', 'Support for UAE POS systems')}
              </div>
            </div>
            <button
              disabled
              className="w-full mt-4 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed transition-colors"
            >
              {t('accounting.posIntegration.connectButton', 'Connect POS System')}
            </button>
          </div>

          {/* Bank Statement Import Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('accounting.bankImport.title', 'Bank Statement Import')}
                </h3>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 mt-1">
                  {t('accounting.available', 'Available')}
                </span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {t('accounting.bankImport.description', 'Upload CSV files from your bank to automatically match expenses and simplify reconciliation process.')}
            </p>
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                {t('accounting.bankImport.feature1', 'Support for UAE banks (CBD, FAB, ENBD)')}
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                {t('accounting.bankImport.feature2', 'Automatic expense matching')}
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                {t('accounting.bankImport.feature3', 'CSV format validation')}
              </div>
            </div>
            <div className="space-y-3">
              <input
                type="file"
                accept=".csv"
                onChange={handleBankUpload}
                className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-400"
                id="bank-csv-upload"
              />
              <button
                onClick={() => document.getElementById('bank-csv-upload')?.click()}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {t('accounting.bankImport.uploadButton', 'Upload Bank CSV')}
              </button>
            </div>
          </div>
        </div>

        {/* Modals */}
        <RevenueModal
          isOpen={isRevenueModalOpen}
          onClose={() => {
            setIsRevenueModalOpen(false);
            setEditingRevenue(null);
          }}
          onSave={editingRevenue ? handleUpdateRevenue : handleAddRevenue}
          editingRevenue={editingRevenue}
        />

        <ExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => {
            setIsExpenseModalOpen(false);
            setEditingExpense(null);
          }}
          onSave={editingExpense ? handleUpdateExpense : handleAddExpense}
          editingExpense={editingExpense}
        />

        <InvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={() => {
            setIsInvoiceModalOpen(false);
            setSelectedRevenueForInvoice(null);
          }}
          revenueData={selectedRevenueForInvoice ? {
            description: selectedRevenueForInvoice.description,
            amount: selectedRevenueForInvoice.amount,
            customer: selectedRevenueForInvoice.customer,
            date: selectedRevenueForInvoice.date
          } : null}
        />

        {/* Free Zone Advisor FAB */}
        {state.isFreeZone && (
          <Fab
            color="success"
            onClick={() => setFreeZoneAdvisorOpen(true)}
            className="fixed bottom-6 right-20 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            sx={{ zIndex: 1000 }}
          >
            <Tooltip title={t('freeZoneAdvisor.openButton', 'Free Zone Tax Advisor')}>
              <BuildingOffice2Icon className="h-6 w-6 text-white" />
            </Tooltip>
          </Fab>
        )}

        {/* Free Zone Advisor Dialog */}
        <FreeZoneAdvisor
          open={freeZoneAdvisorOpen}
          onClose={() => setFreeZoneAdvisorOpen(false)}
          context="accounting"
        />
      </div>
    </div>
  );
};

export default Accounting;