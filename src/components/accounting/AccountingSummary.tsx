import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

interface AccountingSummaryProps {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  period: string;
}

const AccountingSummary: React.FC<AccountingSummaryProps> = ({
  totalRevenue,
  totalExpenses,
  netIncome,
  period = 'This Month'
}) => {
  const { t } = useTranslation();

  const formatCurrency = (amount: number) => {
    return `AED ${amount.toLocaleString('en-AE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const summaryCards = [
    {
      title: t('accounting.summary.totalRevenue'),
      amount: totalRevenue,
      color: 'green',
      icon: ArrowTrendingUpIcon
    },
    {
      title: t('accounting.summary.totalExpenses'),
      amount: totalExpenses,
      color: 'red',
      icon: ArrowTrendingDownIcon
    },
    {
      title: t('accounting.summary.netIncome'),
      amount: netIncome,
      color: netIncome >= 0 ? 'blue' : 'red',
      icon: ArrowTrendingUpIcon
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      green: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300',
      red: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300',
      blue: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('accounting.summary.thisMonth')}
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {period}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`p-6 rounded-xl border-2 ${getColorClasses(card.color)}`}
            >
              <div className="flex items-center justify-between mb-4">
                {card.color === 'red' ? (
                  <ArrowTrendingDownIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                ) : (
                  <ArrowTrendingUpIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                )}
                <span className="text-sm font-medium opacity-75">
                  {period}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {card.title}
              </h3>
              <p className="text-2xl font-bold">
                {formatCurrency(card.amount)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccountingSummary;