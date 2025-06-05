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
  ArrowRightIcon
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
      title: t('dashboard.cit.title', 'Corporate Income Tax'),
      value: `AED ${dashboardData.cit.liability.toLocaleString()}`,
      status: dashboardData.cit.status,
      subtitle: `Due: ${dashboardData.cit.dueDate}`,
      icon: DocumentTextIcon,
      color: 'blue',
      path: '/cit'
    },
    {
      title: t('dashboard.vat.title', 'VAT Returns'),
      value: `AED ${dashboardData.vat.due.toLocaleString()}`,
      status: dashboardData.vat.status,
      subtitle: `Next: ${dashboardData.vat.nextDue}`,
      icon: ReceiptPercentIcon,
      color: 'green',
      path: '/vat'
    },
    {
      title: t('dashboard.financials.title', 'Net Income'),
      value: `AED ${dashboardData.financials.netIncome.toLocaleString()}`,
      status: dashboardData.financials.status,
      subtitle: 'Current Year',
      icon: ChartBarIcon,
      color: 'purple',
      path: '/financials'
    },
    {
      title: t('dashboard.transferPricing.title', 'Transfer Pricing'),
      value: `${dashboardData.transferPricing.compliance}% Complete`,
      status: dashboardData.transferPricing.riskLevel,
      subtitle: `${dashboardData.transferPricing.documentsRequired} docs needed`,
      icon: CurrencyDollarIcon,
      color: 'orange',
      path: '/transfer-pricing'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'filed':
      case 'current':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'medium':
        return <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800',
      green: 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800',
      purple: 'border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800',
      orange: 'border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            {t('dashboard.title', 'Tax Compliance Dashboard')}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('dashboard.subtitle', 'Overview of your tax obligations and compliance status')}
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => navigate('/assistant')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t('dashboard.askAssistant', 'Ask Tax Assistant')}
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
              className={`relative group cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-lg ${getColorClasses(card.color)}`}
              onClick={() => navigate(card.path)}
            >
              <div className="flex items-center">
                <Icon className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                <div className="ml-auto">
                  {getStatusIcon(card.status)}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {card.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {card.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {card.subtitle}
                </p>
              </div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <ArrowRightIcon className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Integration Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {t('dashboard.ftaIntegration', 'FTA Integration')}
          </h3>
          <FTAIntegrationStatus 
            trn="100123456700003" 
            variant="card" 
            showDetails={true}
          />

          {/* Quick Action Links */}
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={() => navigate('/cit')}
              className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
            >
              Submit CIT Return
            </button>
            <button
              onClick={() => navigate('/vat')}
              className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
            >
              Submit VAT Return
            </button>
            <button
              onClick={() => navigate('/submission-history')}
              className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
            >
              View Submission History
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {t('dashboard.trnLookup', 'TRN Lookup')}
          </h3>
          <TRNLookup variant="embedded" />
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <POSIntegrationStatus />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {t('dashboard.quickActions', 'Quick Actions')}
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={() => navigate('/vat')}
              className="text-left p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <h4 className="font-medium text-gray-900 dark:text-white">
                {t('dashboard.actions.fileVAT', 'File VAT Return')}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Submit your quarterly VAT return
              </p>
            </button>

            <button
              onClick={() => navigate('/cit')}
              className="text-left p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <h4 className="font-medium text-gray-900 dark:text-white">
                {t('dashboard.actions.calculateCIT', 'Calculate CIT')}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Estimate your corporate tax liability
              </p>
            </button>

            <button
              onClick={() => navigate('/financials')}
              className="text-left p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <h4 className="font-medium text-gray-900 dark:text-white">
                {t('dashboard.actions.viewFinancials', 'View Financials')}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Review your financial statements
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;