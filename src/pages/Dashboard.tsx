import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTax } from '../context/TaxContext';
import { useFinance } from '../context/FinanceContext';
import { useFinancialSync } from '../hooks/useFinancialSync';
import FTAIntegrationStatus from '../components/FTAIntegrationStatus';
import TRNLookup from '../components/TRNLookup';
import POSIntegrationStatus from '../components/POSIntegrationStatus';
import FTAComplianceCenter from '../components/FTAComplianceCenter';
import RealTimeTaxCalculator from '../components/RealTimeTaxCalculator';
import {
  DocumentTextIcon,
  ReceiptPercentIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  BuildingOfficeIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { citData, vatData } = useTax();
  const { revenue, expenses } = useFinance();
  const { summary, isUpdating, totalRevenue, totalExpenses, netIncome } = useFinancialSync();

  // Dashboard data with live financials
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
      revenue: totalRevenue,
      netIncome: netIncome,
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
      subtitle: t('dashboard.cit.subtitle'),
      icon: DocumentTextIcon,
      color: 'blue',
      path: '/cit'
    },
    {
      title: t('dashboard.vat.title'),
      value: `AED ${dashboardData.vat.due.toLocaleString()}`,
      status: dashboardData.vat.status,
      subtitle: t('dashboard.vat.subtitle'),
      icon: ReceiptPercentIcon,
      color: 'green',
      path: '/vat'
    },
    {
      title: t('dashboard.financials.title'),
      value: `AED ${dashboardData.financials.netIncome.toLocaleString()}`,
      status: dashboardData.financials.status,
      subtitle: t('dashboard.financials.subtitle'),
      icon: ChartBarIcon,
      color: 'purple',
      path: '/financials'
    },
    {
      title: t('dashboard.transferPricing.title'),
      value: `${dashboardData.transferPricing.compliance}% Complete`,
      status: dashboardData.transferPricing.riskLevel,
      subtitle: t('dashboard.transferPricing.subtitle'),
      icon: CurrencyDollarIcon,
      color: 'orange',
      path: '/transfer-pricing'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'filed':
      case 'current':
        return <span className="text-green-500 text-sm">✅</span>;
      case 'pending':
        return <span className="text-yellow-500 text-sm">🔄</span>;
      case 'medium':
        return <span className="text-orange-500 text-sm">⚠️</span>;
      case 'overdue':
        return <span className="text-red-500 text-sm">❌</span>;
      default:
        return <span className="text-gray-500 text-sm">⏳</span>;
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30',
      green: 'border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 dark:from-green-900/30 dark:to-green-800/30',
      purple: 'border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30',
      orange: 'border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Banner with Peergos Slide */}
        <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="absolute inset-0 opacity-20">
            <img 
              src="/images/peergos_slide_0.jpeg" 
              alt="Peergos Dashboard" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative px-8 py-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <BuildingOfficeIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">
                    {t('dashboard.title')}
                  </h1>
                  <p className="text-white/90 mt-2 text-lg">
                    {t('dashboard.subtitle')} - UAE FTA Integrated Platform
                  </p>
                </div>
              </div></div>
          </div>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div></div>
            <div className="flex items-center space-x-4">
              {/* Demo Mode Badge */}
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700">
                {t('fta.simulation.note')}
              </span>
              <button
                onClick={() => navigate('/assistant')}
                className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                {t('dashboard.askAssistant')}
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${getColorClasses(card.color)}`}
                onClick={() => navigate(card.path)}
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  {getStatusIcon(card.status)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {card.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {card.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {card.subtitle}
                </p>
                <ArrowRightIcon className="absolute bottom-4 right-4 h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>

        {/* Live Financial Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <ArrowTrendingUpIcon className="w-5 h-5 mr-2 text-green-500" />
                  {t('dashboard.liveFinancials', 'Live Financial Summary')}
                  {isUpdating && (
                    <div className="ml-2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {t('dashboard.liveFinancialsSubtitle', 'Real-time data from your accounting entries')}
                </p>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Last updated: {new Date(summary.lastUpdated).toLocaleTimeString()}
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <CurrencyDollarIcon className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('financials.totalRevenue', 'Total Revenue')}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    AED {totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                  <ReceiptPercentIcon className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('financials.totalExpenses', 'Total Expenses')}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    AED {totalExpenses.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className={`${netIncome >= 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} rounded-lg p-4`}>
                  <ChartBarIcon className={`w-8 h-8 ${netIncome >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'} mx-auto mb-2`} />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('financials.netIncome', 'Net Income')}
                  </p>
                  <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-gray-900 dark:text-white' : 'text-orange-600 dark:text-orange-400'}`}>
                    AED {netIncome.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FTA Compliance Center */}
        <div className="mb-8">
          <FTAComplianceCenter trn="100123456700003" revenue={totalRevenue} />
        </div>

        {/* Real-Time Tax Calculator */}
        <div className="mb-8">
          <RealTimeTaxCalculator />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {/* FTA Integration Card with Visual */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  🔐 {t('fta.integration.title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {t('fta.integration.subtitle')}
                </p>
              </div>
              <img 
                src="/images/peergos_slide_3.jpeg" 
                alt="FTA Integration Status" 
                className="w-16 h-16 object-contain rounded-lg opacity-80"
              />
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span>✅ Agent Certificate</span>
                <span className="text-green-600 font-medium">Uploaded</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>❌ Real-Time Sync</span>
                <span className="text-yellow-600 font-medium">Pending</span>
              </div>
              <div className="px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  <strong>Status:</strong> Demo Mode – Simulation Active
                </p>
              </div>
            </div>
            <FTAIntegrationStatus 
              trn="100123456700003" 
              variant="card" 
              showDetails={false}
            />
          </div>

          {/* FTA Alerts Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-200 dark:border-red-700 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 flex items-center">
                🚨 FTA Alerts
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Compliance notifications
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <span className="text-red-500">❗</span>
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">Bank slip not uploaded</p>
                  <p className="text-xs text-red-600 dark:text-red-300">Required for VAT filing</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <span className="text-yellow-500">⚠️</span>
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">TRN verification pending</p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-300">Verify in 48 hours</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <span className="text-orange-500">🔧</span>
                <div>
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-200">Setup incomplete</p>
                  <p className="text-xs text-orange-600 dark:text-orange-300">Complete agent setup</p>
                </div>
              </div>
            </div>
          </div>

          {/* TRN Lookup Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('trn.lookup.title')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {t('trn.lookup.subtitle')}
              </p>
            </div>
            <TRNLookup variant="embedded" />
          </div>

          {/* POS Integration Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <POSIntegrationStatus />
          </div>
        </div>

        {/* Quick Actions with Workflow Visual */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('dashboard.quickActions')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Streamlined UAE tax workflows
              </p>
            </div>
            <img 
              src="/images/peergos_slide_5.jpeg" 
              alt="Tax Workflow" 
              className="w-20 h-16 object-contain rounded-lg opacity-70"
            />
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/vat')}
                className="flex items-center justify-center space-x-2 px-6 py-4 bg-green-50 hover:bg-green-100 border border-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:border-green-700 rounded-lg text-green-800 dark:text-green-200 font-medium transition-colors duration-200"
              >
                <span>📄</span>
                <span>File VAT Return</span>
              </button>
              <button
                onClick={() => navigate('/cit')}
                className="flex items-center justify-center space-x-2 px-6 py-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:border-blue-700 rounded-lg text-blue-800 dark:text-blue-200 font-medium transition-colors duration-200"
              >
                <span>🧮</span>
                <span>Calculate CIT</span>
              </button>
              <button
                onClick={() => navigate('/financials')}
                className="flex items-center justify-center space-x-2 px-6 py-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 dark:border-purple-700 rounded-lg text-purple-800 dark:text-purple-200 font-medium transition-colors duration-200"
              >
                <span>📊</span>
                <span>View Financials</span>
              </button>
              <button
                onClick={() => navigate('/filing')}
                className="flex items-center justify-center space-x-2 px-6 py-4 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30 dark:border-yellow-700 rounded-lg text-yellow-800 dark:text-yellow-200 font-medium transition-colors duration-200"
              >
                <span>📁</span>
                <span>Upload Agent Certificate</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;