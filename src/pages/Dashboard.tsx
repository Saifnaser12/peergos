
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTax } from '../context/TaxContext';
import FTAIntegrationStatus from '../components/FTAIntegrationStatus';
import TRNLookup from '../components/TRNLookup';
import POSIntegrationStatus from '../components/POSIntegrationStatus';
import {
  DocumentTextIcon,
  ReceiptPercentIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { citData, vatData } = useTax();

  // Mock data - in real app this would come from context/API
  const dashboardData = {
    cit: {
      liability: 125000,
      status: 'pending',
      dueDate: '2024-03-31'
    },
    vat: {
      due: 18500,
      status: 'filed',
      nextDue: '2024-02-28'
    },
    financials: {
      revenue: 1250000,
      netIncome: 287500,
      status: 'current'
    },
    transferPricing: {
      riskLevel: 'medium',
      documentsRequired: 3,
      compliance: 75
    }
  };

  const summaryCards = [
    {
      title: t('dashboard.cit.title'),
      value: `AED ${dashboardData.cit.liability.toLocaleString()}`,
      status: dashboardData.cit.status,
      subtitle: `Due: ${dashboardData.cit.dueDate}`,
      icon: DocumentTextIcon,
      color: 'blue',
      path: '/cit',
      emoji: '💼'
    },
    {
      title: t('dashboard.vat.title'),
      value: `AED ${dashboardData.vat.due.toLocaleString()}`,
      status: dashboardData.vat.status,
      subtitle: `Next: ${dashboardData.vat.nextDue}`,
      icon: ReceiptPercentIcon,
      color: 'green',
      path: '/vat',
      emoji: '📊'
    },
    {
      title: t('dashboard.financials.title'),
      value: `AED ${dashboardData.financials.netIncome.toLocaleString()}`,
      status: dashboardData.financials.status,
      subtitle: 'Current Year',
      icon: ChartBarIcon,
      color: 'purple',
      path: '/financials',
      emoji: '💰'
    },
    {
      title: t('dashboard.transferPricing.title'),
      value: `${dashboardData.transferPricing.compliance}% Complete`,
      status: dashboardData.transferPricing.riskLevel,
      subtitle: `${dashboardData.transferPricing.documentsRequired} docs needed`,
      icon: CurrencyDollarIcon,
      color: 'orange',
      path: '/transfer-pricing',
      emoji: '🔄'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'filed':
      case 'current':
        return <span className="text-green-500">✅</span>;
      case 'pending':
        return <span className="text-yellow-500">🔄</span>;
      case 'medium':
        return <span className="text-orange-500">⚠️</span>;
      case 'overdue':
        return <span className="text-red-500">❌</span>;
      default:
        return <span className="text-gray-500">⏳</span>;
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-800 hover:shadow-blue-200/50',
      green: 'border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-800 hover:shadow-green-200/50',
      purple: 'border-purple-100 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 dark:border-purple-800 hover:shadow-purple-200/50',
      orange: 'border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 dark:border-orange-800 hover:shadow-orange-200/50'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-8 p-1">
      {/* Header with Company Info */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
              <BuildingOfficeIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl">
                {t('dashboard.title')}
              </h2>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('dashboard.subtitle')}
                </p>
                <div className="hidden sm:flex items-center gap-2 text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                  <span className="text-gray-600 dark:text-gray-400">TRN:</span>
                  <span className="font-mono text-gray-900 dark:text-white">100123456700003</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-3 md:mt-0 md:ml-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            ✅ {t('fta.simulation.note')}
          </div>
          <button
            onClick={() => navigate('/assistant')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-105 shadow-lg"
          >
            {t('dashboard.askAssistant')}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`relative group cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95 md:hover:scale-105 ${getColorClasses(card.color)}`}
              onClick={() => navigate(card.path)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{card.emoji}</span>
                  <Icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(card.status)}
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {card.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {card.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {card.subtitle}
                </p>
              </div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                <ArrowRightIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Integration Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>🔗</span>
            {t('dashboard.ftaIntegration')}
          </h3>
          <FTAIntegrationStatus 
            trn="100123456700003" 
            variant="card" 
            showDetails={true}
          />

          {/* Quick Action Links */}
          <div className="mt-6 space-y-3">
            <button
              onClick={() => navigate('/cit')}
              className="w-full text-left px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 flex items-center justify-between group"
            >
              <span>Submit CIT Return</span>
              <ArrowRightIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
            </button>
            <button
              onClick={() => navigate('/vat')}
              className="w-full text-left px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 flex items-center justify-between group"
            >
              <span>Submit VAT Return</span>
              <ArrowRightIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
            </button>
            <button
              onClick={() => navigate('/submission-history')}
              className="w-full text-left px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 flex items-center justify-between group"
            >
              <span>View Submission History</span>
              <ArrowRightIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>🔍</span>
            {t('dashboard.trnLookup')}
          </h3>
          <TRNLookup variant="embedded" />
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
          <POSIntegrationStatus />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span>⚡</span>
            {t('dashboard.quickActions')}
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={() => navigate('/vat')}
              className="text-left p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 hover:shadow-md group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">📊</span>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {t('dashboard.actions.fileVAT')}
                </h4>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Submit your quarterly VAT return
              </p>
              <div className="flex justify-end mt-3">
                <ArrowRightIcon className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
              </div>
            </button>

            <button
              onClick={() => navigate('/cit')}
              className="text-left p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 hover:shadow-md group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">💼</span>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {t('dashboard.actions.calculateCIT')}
                </h4>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Estimate your corporate tax liability
              </p>
              <div className="flex justify-end mt-3">
                <ArrowRightIcon className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
              </div>
            </button>

            <button
              onClick={() => navigate('/financials')}
              className="text-left p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 hover:shadow-md group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">💰</span>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {t('dashboard.actions.viewFinancials')}
                </h4>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Review your financial statements
              </p>
              <div className="flex justify-end mt-3">
                <ArrowRightIcon className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
