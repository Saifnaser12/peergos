
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFinance } from '../../context/FinanceContext';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface SmartTotalsPanelProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const SmartTotalsPanel: React.FC<SmartTotalsPanelProps> = ({ 
  isCollapsed = false, 
  onToggle 
}) => {
  const { t } = useTranslation();
  const {
    getTotalRevenue,
    getTotalExpenses,
    getNetIncome
  } = useFinance();

  const [animationTrigger, setAnimationTrigger] = useState(0);

  const totalRevenue = getTotalRevenue();
  const totalExpenses = getTotalExpenses();
  const netIncome = getNetIncome();

  // Calculate financial health indicators
  const expenseRatio = totalRevenue > 0 ? (totalExpenses / totalRevenue) * 100 : 0;
  const profitMargin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;
  
  // Anomaly detection
  const highExpenseRatio = expenseRatio > 80;
  const lowProfitMargin = profitMargin < 10 && totalRevenue > 0;
  const hasAnomalies = highExpenseRatio || lowProfitMargin;

  // Listen for real-time updates
  useEffect(() => {
    const handleUpdate = () => {
      setAnimationTrigger(prev => prev + 1);
    };

    window.addEventListener('revenue-saved', handleUpdate);
    window.addEventListener('expense-saved', handleUpdate);

    return () => {
      window.removeEventListener('revenue-saved', handleUpdate);
      window.removeEventListener('expense-saved', handleUpdate);
    };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isCollapsed) {
    return (
      <div className="fixed top-20 right-4 z-40">
        <button
          onClick={onToggle}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200"
        >
          <ChartBarIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          {hasAnomalies && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-20 right-4 z-40 w-80">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 flex items-center justify-between">
          <h3 className="text-white font-semibold text-sm flex items-center">
            <ChartBarIcon className="h-4 w-4 mr-2" />
            {t('smartTotals.title', 'Financial Summary')}
          </h3>
          <button
            onClick={onToggle}
            className="text-white/80 hover:text-white transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Revenue */}
          <div className={`flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg transition-all duration-500 ${animationTrigger ? 'scale-105' : ''}`}>
            <div className="flex items-center">
              <ArrowTrendingUpIcon className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                {t('smartTotals.revenue', 'Revenue')}
              </span>
            </div>
            <span className="text-lg font-bold text-green-900 dark:text-green-100">
              {formatCurrency(totalRevenue)}
            </span>
          </div>

          {/* Expenses */}
          <div className={`flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg transition-all duration-500 ${animationTrigger ? 'scale-105' : ''}`}>
            <div className="flex items-center">
              <ArrowTrendingDownIcon className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
              <span className="text-sm font-medium text-red-800 dark:text-red-200">
                {t('smartTotals.expenses', 'Expenses')}
              </span>
            </div>
            <span className="text-lg font-bold text-red-900 dark:text-red-100">
              {formatCurrency(totalExpenses)}
            </span>
          </div>

          {/* Net Income */}
          <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-500 ${
            netIncome >= 0 
              ? 'bg-blue-50 dark:bg-blue-900/20' 
              : 'bg-red-50 dark:bg-red-900/20'
          } ${animationTrigger ? 'scale-105' : ''}`}>
            <div className="flex items-center">
              <div className={`h-5 w-5 mr-2 ${netIncome >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                {netIncome >= 0 ? 
                  <ArrowTrendingUpIcon className="h-5 w-5" /> : 
                  <ArrowTrendingDownIcon className="h-5 w-5" />
                }
              </div>
              <span className={`text-sm font-medium ${
                netIncome >= 0 
                  ? 'text-blue-800 dark:text-blue-200' 
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {t('smartTotals.netIncome', 'Net Income')}
              </span>
            </div>
            <span className={`text-lg font-bold ${
              netIncome >= 0 
                ? 'text-blue-900 dark:text-blue-100' 
                : 'text-red-900 dark:text-red-100'
            }`}>
              {formatCurrency(netIncome)}
            </span>
          </div>

          {/* Financial Health Indicators */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
              <span>{t('smartTotals.expenseRatio', 'Expense Ratio')}</span>
              <span className={highExpenseRatio ? 'text-red-600 dark:text-red-400 font-semibold' : ''}>
                {expenseRatio.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>{t('smartTotals.profitMargin', 'Profit Margin')}</span>
              <span className={lowProfitMargin ? 'text-red-600 dark:text-red-400 font-semibold' : ''}>
                {profitMargin.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Anomaly Alerts */}
          {hasAnomalies && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                    {t('smartTotals.anomalyDetected', 'Financial Anomaly Detected')}
                  </p>
                  {highExpenseRatio && (
                    <p className="text-yellow-700 dark:text-yellow-300">
                      {t('smartTotals.highExpenseRatio', 'High expense ratio (>80%)')}
                    </p>
                  )}
                  {lowProfitMargin && (
                    <p className="text-yellow-700 dark:text-yellow-300">
                      {t('smartTotals.lowProfitMargin', 'Low profit margin (<10%)')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartTotalsPanel;
