import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTax } from '../context/TaxContext';
import { useSettings } from '../context/SettingsContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface BalanceSheetInputs {
  currentAssets: number;
  fixedAssets: number;
  currentLiabilities: number;
  longTermLiabilities: number;
}

const Financials: React.FC = () => {
  const { t } = useTranslation();
  const { state } = useTax();
  const { formatCurrency } = useSettings();
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheetInputs>({
    currentAssets: 0,
    fixedAssets: 0,
    currentLiabilities: 0,
    longTermLiabilities: 0
  });

  // Calculate Income Statement values
  const totalRevenue = state.revenues.reduce((sum, entry) => sum + entry.amount, 0);
  const totalExpenses = state.expenses.reduce((sum, entry) => sum + entry.amount, 0);
  const netIncome = totalRevenue - totalExpenses;

  // Calculate Balance Sheet values
  const totalAssets = balanceSheet.currentAssets + balanceSheet.fixedAssets;
  const totalLiabilities = balanceSheet.currentLiabilities + balanceSheet.longTermLiabilities;
  const totalEquity = totalAssets - totalLiabilities;

  const handleBalanceSheetChange = (field: keyof BalanceSheetInputs) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value) || 0;
    setBalanceSheet(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Income Statement */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t('financials.incomeStatement')}
        </h2>
        <Card>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="font-medium">{t('financials.revenue')}</span>
              <span className="text-green-600 dark:text-green-400">
                {formatCurrency(totalRevenue)}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="font-medium">{t('financials.expenses')}</span>
              <span className="text-red-600 dark:text-red-400">
                {formatCurrency(totalExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-indigo-50 dark:bg-indigo-900/50 rounded-lg">
              <span className="font-semibold">{t('financials.netIncome')}</span>
              <span className={`font-semibold ${
                netIncome >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(netIncome)}
              </span>
            </div>
          </div>
        </Card>
      </section>

      {/* Balance Sheet */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t('financials.balanceSheet')}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assets */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">{t('financials.assets')}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('financials.currentAssets')}
                </label>
                <input
                  type="number"
                  value={balanceSheet.currentAssets}
                  onChange={handleBalanceSheetChange('currentAssets')}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('financials.fixedAssets')}
                </label>
                <input
                  type="number"
                  value={balanceSheet.fixedAssets}
                  onChange={handleBalanceSheetChange('fixedAssets')}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{t('financials.totalAssets')}</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(totalAssets)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Liabilities & Equity */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">{t('financials.liabilities')}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('financials.currentLiabilities')}
                </label>
                <input
                  type="number"
                  value={balanceSheet.currentLiabilities}
                  onChange={handleBalanceSheetChange('currentLiabilities')}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('financials.longTermLiabilities')}
                </label>
                <input
                  type="number"
                  value={balanceSheet.longTermLiabilities}
                  onChange={handleBalanceSheetChange('longTermLiabilities')}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{t('financials.totalLiabilities')}</span>
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    {formatCurrency(totalLiabilities)}
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{t('financials.totalEquity')}</span>
                  <span className={`font-semibold ${
                    totalEquity >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatCurrency(totalEquity)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          icon={<ArrowDownTrayIcon className="h-5 w-5" />}
          onClick={() => {
            // TODO: Implement export functionality
            console.log('Export financials');
          }}
        >
          {t('common.export')}
        </Button>
      </div>
    </div>
  );
};

export default Financials; 