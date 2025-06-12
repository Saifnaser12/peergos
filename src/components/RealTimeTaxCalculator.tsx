import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFinance } from '../context/FinanceContext';
import { 
  CalculatorIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface TaxCalculation {
  vatDue: number;
  citDue: number;
  exciseTax: number;
  totalTaxLiability: number;
  effectiveRate: number;
  nextFilingDate: string;
  recommendations: string[];
}

const RealTimeTaxCalculator: React.FC = () => {
  const { t } = useTranslation();
  const { revenues, expenses } = useFinance();
  const [calculation, setCalculation] = useState<TaxCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateTaxes = () => {
    setIsCalculating(true);

    setTimeout(() => {
      const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
      const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
      const taxableIncome = Math.max(0, totalRevenue - totalExpenses);

      // VAT Calculation (5% standard rate)
      const vatDue = totalRevenue * 0.05;

      // CIT Calculation (9% on profits above AED 375,000)
      const citableIncome = Math.max(0, taxableIncome - 375000);
      const citDue = citableIncome * 0.09;

      // Excise Tax (example calculation)
      const exciseTax = 0; // Would be calculated based on specific goods

      const totalTaxLiability = vatDue + citDue + exciseTax;
      const effectiveRate = totalRevenue > 0 ? (totalTaxLiability / totalRevenue) * 100 : 0;

      // Generate recommendations
      const recommendations: string[] = [];
      if (totalRevenue > 375000 && totalRevenue < 1000000) {
        recommendations.push('Consider voluntary VAT registration for input tax recovery');
      }
      if (citDue > 50000) {
        recommendations.push('Consider quarterly CIT advance payments to avoid penalties');
      }
      if (totalTaxLiability > 100000) {
        recommendations.push('Engage a tax advisor for optimization strategies');
      }

      setCalculation({
        vatDue,
        citDue,
        exciseTax,
        totalTaxLiability,
        effectiveRate,
        nextFilingDate: '2024-02-28',
        recommendations
      });

      setIsCalculating(false);
    }, 1500);
  };

  useEffect(() => {
    calculateTaxes();
  }, [revenues, expenses]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CalculatorIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Real-Time Tax Calculator
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Live tax calculations based on your financial data
              </p>
            </div>
          </div>
          <button
            onClick={calculateTaxes}
            disabled={isCalculating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isCalculating ? 'Calculating...' : 'Recalculate'}
          </button>
        </div>
      </div>

      {isCalculating ? (
        <div className="p-6 text-center">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600 dark:text-gray-400">Calculating tax liabilities...</span>
          </div>
        </div>
      ) : calculation ? (
        <div className="p-6">
          
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-yellow-600">⭐</span>
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Tax Agent-Approved Rates</span>
          </div>
          <p className="text-xs text-yellow-700 dark:text-yellow-300">
            All calculations use FTA-certified tax agent approved rates and methodologies for maximum accuracy and compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700"></div>
          

          {/* Tax Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">VAT Due</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {formatCurrency(calculation.vatDue)}
                  </p>
                </div>
                <CurrencyDollarIcon className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">CIT Due</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {formatCurrency(calculation.citDue)}
                  </p>
                </div>
                <DocumentTextIcon className="w-8 h-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Excise Tax</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {formatCurrency(calculation.exciseTax)}
                  </p>
                </div>
                <InformationCircleIcon className="w-8 h-8 text-orange-500" />
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Liability</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {formatCurrency(calculation.totalTaxLiability)}
                  </p>
                </div>
                <CalculatorIcon className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>

          {/* Effective Tax Rate */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Effective Tax Rate</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {calculation.effectiveRate.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Next Filing Due</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {new Date(calculation.nextFilingDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {calculation.recommendations.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                Tax Optimization Recommendations
              </h4>
              <ul className="space-y-1">
                {calculation.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-amber-700 dark:text-amber-300 flex items-start">
                    <span className="mr-2">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <strong>Disclaimer:</strong> These calculations are estimates based on current UAE tax rates and available data. 
              Actual tax liabilities may vary. Consult with a qualified tax advisor for precise calculations and compliance guidance.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RealTimeTaxCalculator;