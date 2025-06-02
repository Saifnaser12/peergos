import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useTax } from '../context/TaxContext';
import { format } from 'date-fns';
import Button from '../components/Button';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface DateRange {
  startDate: string;
  endDate: string;
}

export const DashboardPage: React.FC = () => {
  const { state: taxData } = useTax();
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '',
    endDate: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [exportStarted, setExportStarted] = useState(false);

  const filteredData = useMemo(() => {
    if (!dateRange.startDate || !dateRange.endDate) {
      return taxData;
    }

    return {
      revenues: taxData.revenues.filter(
        r => r.date >= dateRange.startDate && r.date <= dateRange.endDate
      ),
      expenses: taxData.expenses.filter(
        e => e.date >= dateRange.startDate && e.date <= dateRange.endDate
      )
    };
  }, [taxData, dateRange]);

  const metrics = useMemo(() => {
    const totalRevenue = filteredData.revenues.reduce((sum, r) => sum + r.amount, 0);
    const totalExpenses = filteredData.expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalVAT = filteredData.revenues.reduce((sum, r) => sum + (r.vatAmount || 0), 0);

    return {
      totalRevenue,
      totalExpenses,
      totalVAT,
      netIncome: totalRevenue - totalExpenses
    };
  }, [filteredData]);

  const revenueTrendData = useMemo(() => {
    const monthlyData = new Map<string, number>();
    
    filteredData.revenues.forEach(revenue => {
      const month = format(new Date(revenue.date), 'MMM yyyy');
      monthlyData.set(month, (monthlyData.get(month) || 0) + revenue.amount);
    });

    return Array.from(monthlyData.entries()).map(([month, amount]) => ({
      month,
      amount
    }));
  }, [filteredData]);

  const expenseBreakdownData = useMemo(() => {
    const categoryData = new Map<string, number>();
    
    filteredData.expenses.forEach(expense => {
      categoryData.set(expense.category, (categoryData.get(expense.category) || 0) + expense.amount);
    });

    return Array.from(categoryData.entries()).map(([category, amount]) => ({
      category,
      amount
    }));
  }, [filteredData]);

  const handleExport = async () => {
    setExportStarted(true);
    // Simulating export delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setExportStarted(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Financial Dashboard
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <Button
            onClick={() => setShowDatePicker(!showDatePicker)}
            variant="secondary"
          >
            Date Range
          </Button>
          <Button onClick={handleExport}>Export</Button>
        </div>
      </div>

      {/* Date Range Picker */}
      {showDatePicker && (
        <div className="mb-8 p-4 bg-white shadow rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={dateRange.startDate}
                onChange={e => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={dateRange.endDate}
                onChange={e => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => {
                setDateRange({ startDate: '', endDate: '' });
                setShowDatePicker(false);
              }}
              variant="secondary"
              className="mr-3"
            >
              Reset
            </Button>
            <Button onClick={() => setShowDatePicker(false)}>Apply</Button>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {formatCurrency(metrics.totalRevenue)} AED
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Expenses</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {formatCurrency(metrics.totalExpenses)} AED
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Net Income</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {formatCurrency(metrics.netIncome)} AED
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total VAT</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {formatCurrency(metrics.totalVAT)} AED
            </dd>
          </div>
        </div>
      </div>

      {/* Tax Registration Alerts */}
      {metrics.totalRevenue >= 375000 && (
        <div className="rounded-md bg-yellow-50 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                VAT Registration Required
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Your revenue has exceeded the VAT registration threshold of 375,000 AED.
                  Please register for VAT within 30 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {metrics.totalRevenue >= 1000000 && (
        <div className="rounded-md bg-yellow-50 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Corporate Income Tax Registration Required
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Your revenue has exceeded the CIT registration threshold of 1,000,000 AED.
                  Please register for Corporate Income Tax.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend Chart */}
        <div className="bg-white shadow rounded-lg p-6" data-testid="revenue-trend-chart">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${formatCurrency(value as number)} AED`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#0088FE"
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown Chart */}
        <div className="bg-white shadow rounded-lg p-6" data-testid="expense-breakdown-chart">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Expense Breakdown</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdownData}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ category, percent }) =>
                    `${category} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {expenseBreakdownData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${formatCurrency(value as number)} AED`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Export Started Toast */}
      {exportStarted && (
        <div className="fixed bottom-4 right-4">
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
                <p className="text-sm font-medium text-green-800">Export Started</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 