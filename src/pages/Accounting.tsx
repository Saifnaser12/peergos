import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  DocumentIcon,
  EyeIcon,
  ArrowUpTrayIcon,
  CalculatorIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import RevenueModal from '../components/accounting/RevenueModal';
import ExpenseModal from '../components/accounting/ExpenseModal';
import AccountingSummary from '../components/accounting/AccountingSummary';
import InvoiceModal from '../components/accounting/InvoiceModal';
import { ArrowTrendingUpIcon as TrendingUpIcon } from '@heroicons/react/24/outline';

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

  // State management
  const [revenues, setRevenues] = useState<RevenueEntry[]>([]);
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingRevenue, setEditingRevenue] = useState<RevenueEntry | null>(null);
  const [editingExpense, setEditingExpense] = useState<ExpenseEntry | null>(null);
  const [activeTab, setActiveTab] = useState<'revenue' | 'expenses'>('revenue');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedRevenueForInvoice, setSelectedRevenueForInvoice] = useState<RevenueEntry | null>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedRevenues = localStorage.getItem('peergos_accounting_revenues');
    const savedExpenses = localStorage.getItem('peergos_accounting_expenses');

    if (savedRevenues) {
      setRevenues(JSON.parse(savedRevenues));
    }

    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('peergos_accounting_revenues', JSON.stringify(revenues));
  }, [revenues]);

  useEffect(() => {
    localStorage.setItem('peergos_accounting_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Revenue handlers
  const handleAddRevenue = (revenueData: Omit<RevenueEntry, 'id' | 'createdAt'>) => {
    const newRevenue: RevenueEntry = {
      ...revenueData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setRevenues(prev => [newRevenue, ...prev]);
    setIsRevenueModalOpen(false);
  };

  const handleUpdateRevenue = (updatedRevenue: RevenueEntry) => {
    setRevenues(prev => prev.map(r => r.id === updatedRevenue.id ? updatedRevenue : r));
    setEditingRevenue(null);
    setIsRevenueModalOpen(false);
  };

  const handleDeleteRevenue = (id: string) => {
    if (window.confirm(t('accounting.messages.deleteConfirm'))) {
      setRevenues(prev => prev.filter(r => r.id !== id));
    }
  };

  // Expense handlers
  const handleAddExpense = (expenseData: Omit<ExpenseEntry, 'id' | 'createdAt'>) => {
    const newExpense: ExpenseEntry = {
      ...expenseData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setExpenses(prev => [newExpense, ...prev]);
    setIsExpenseModalOpen(false);
  };

  const handleUpdateExpense = (updatedExpense: ExpenseEntry) => {
    setExpenses(prev => prev.map(e => e.id === updatedExpense.id ? updatedExpense : e));
    setEditingExpense(null);
    setIsExpenseModalOpen(false);
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm(t('accounting.messages.deleteConfirm'))) {
      setExpenses(prev => prev.filter(e => e.id !== id));
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

  // Calculate totals
  const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netIncome = totalRevenue - totalExpenses;

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

              {revenues.length > 0 ? (
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
                          {t('accounting.revenue.table.invoice')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('accounting.revenue.table.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {revenues.map((revenue) => (
                        <tr key={revenue.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {formatDate(revenue.date)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                            {revenue.description}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {revenue.customer || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                            {formatCurrency(revenue.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {revenue.invoiceGenerated ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                                <DocumentIcon className="h-3 w-3 mr-1" />
                                Generated
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                                None
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              {!revenue.invoiceGenerated && (
                                <button
                                  onClick={() => handleGenerateInvoice(revenue)}
                                  className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-150"
                                  title={t('accounting.revenue.actions.generateInvoice')}
                                >
                                  <DocumentIcon className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleEditRevenue(revenue)}
                                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-150"
                                title={t('accounting.revenue.actions.edit')}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteRevenue(revenue.id)}
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
                          {t('accounting.expenses.table.receipt')}
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {expense.receiptUrl ? (
                              <button className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                <DocumentIcon className="h-4 w-4 mr-1" />
                                View
                              </button>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500">None</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditExpense(expense)}
                                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-150"
                                title={t('accounting.expenses.actions.edit')}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
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
      </div>
    </div>
  );
};

export default Accounting;