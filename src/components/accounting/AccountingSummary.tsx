import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowTrendingUpIcon as TrendingUpIcon,
  ArrowTrendingDownIcon as TrendingDownIcon,
  BanknotesIcon
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Revenue */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t('accounting.totals.totalRevenue')}
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
            <TrendingUpIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      {/* Total Expenses */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t('accounting.totals.totalExpenses')}
            </p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
          <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-xl">
            <TrendingDownIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>

      {/* Net Income */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t('accounting.totals.netIncome')}
            </p>
            <p className={`text-2xl font-bold mt-1 ${
              netIncome >= 0 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(netIncome)}
            </p>
          </div>
          <div className={`p-3 rounded-xl ${
            netIncome >= 0 
              ? 'bg-blue-100 dark:bg-blue-900/20' 
              : 'bg-red-100 dark:bg-red-900/20'
          }`}>
            <BanknotesIcon className={`h-6 w-6 ${
              netIncome >= 0 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-red-600 dark:text-red-400'
            }`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingSummary;