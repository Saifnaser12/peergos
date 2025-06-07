import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentArrowDownIcon,
  TableCellsIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface AccountingSummaryProps {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  formatCurrency: (amount: number) => string;
}

const AccountingSummary: React.FC<AccountingSummaryProps> = ({
  totalRevenue,
  totalExpenses,
  netIncome,
  formatCurrency
}) => {
  const { t } = useTranslation();

  const summaryCards = [
    {
      title: t('accounting.summary.totalRevenue'),
      amount: totalRevenue,
      color: 'green',
      icon: ArrowTrendingUpIcon,
      bgGradient: 'from-green-500 to-emerald-600',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: t('accounting.summary.totalExpenses'),
      amount: totalExpenses,
      color: 'red',
      icon: ArrowTrendingDownIcon,
      bgGradient: 'from-red-500 to-rose-600',
      textColor: 'text-red-600 dark:text-red-400'
    },
    {
      title: t('accounting.summary.netIncome'),
      amount: netIncome,
      color: netIncome >= 0 ? 'blue' : 'red',
      icon: netIncome >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon,
      bgGradient: netIncome >= 0 ? 'from-blue-500 to-indigo-600' : 'from-red-500 to-rose-600',
      textColor: netIncome >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'
    }
  ];

  const handleDownloadPDF = () => {
    // TODO: Implement PDF export
    console.log('Downloading PDF summary...');
  };

  const handleDownloadExcel = () => {
    // TODO: Implement Excel export
    console.log('Downloading Excel summary...');
  };

  const handleViewFinancials = () => {
    window.location.href = '/financials';
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('accounting.summary.title')}
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {t('accounting.summary.thisMonth')}
        </span>
      </div>

      {/* Apple-style Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.bgGradient} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    {t('accounting.summary.thisMonth')}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {card.title}
                </h3>
                <p className={`text-3xl font-bold ${card.textColor} mb-1`}>
                  {formatCurrency(card.amount)}
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>{t('accounting.summary.monthToDate')}</span>
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.bgGradient}`}></div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <button
          onClick={handleDownloadPDF}
          className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 min-w-[200px] justify-center"
        >
          <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
          {t('accounting.summary.downloadPDF')}
        </button>
        
        <button
          onClick={handleDownloadExcel}
          className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 min-w-[200px] justify-center"
        >
          <TableCellsIcon className="h-5 w-5 mr-2" />
          {t('accounting.summary.downloadExcel')}
        </button>
        
        <button
          onClick={handleViewFinancials}
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 min-w-[200px] justify-center"
        >
          <EyeIcon className="h-5 w-5 mr-2" />
          {t('accounting.summary.viewFinancials')}
        </button>
      </div>
    </div>
  );
};

export default AccountingSummary;