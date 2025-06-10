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
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                <BuildingOfficeIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {t('dashboard.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {t('dashboard.subtitle')}
                </p>
              </div>
            </div>
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

        {/* Enhanced Live Financial Summary */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-blue-200 dark:border-gray-700 mb-8 overflow-hidden">
          <div 
            className="h-16 bg-gradient-to-r from-blue-900 to-indigo-800 relative"
            style={{
              backgroundImage: 'url(/images/peergos_slide_0.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-blue-900/85"></div>
            <div className="relative px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center">
                <ArrowTrendingUpIcon className="w-6 h-6 mr-3 text-green-400" />
                <div>
                  <h3 className="text-lg font-bold">
                    {t('dashboard.liveFinancials', 'Live Financial Summary')}
                    {isUpdating && (
                      <div className="ml-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </h3>
                </div>
              </div>
              <div className="text-xs text-blue-200 text-right">
                <div>Last updated:</div>
                <div className="font-medium">{new Date(summary.lastUpdated).toLocaleTimeString()}</div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-3">
                    <CurrencyDollarIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      📈 +12.5%
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {t('financials.totalRevenue', 'Total Revenue')}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    <span className="text-green-600 dark:text-green-400">AED</span> {totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-red-200 dark:border-red-800">
                  <div className="flex items-center justify-between mb-3">
                    <ReceiptPercentIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                      📉 +3.2%
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {t('financials.totalExpenses', 'Total Expenses')}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    <span className="text-red-600 dark:text-red-400">AED</span> {totalExpenses.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border ${netIncome >= 0 ? 'border-blue-200 dark:border-blue-800' : 'border-orange-200 dark:border-orange-800'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <ChartBarIcon className={`w-8 h-8 ${netIncome >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`} />
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${netIncome >= 0 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                      {netIncome >= 0 ? '📈 +18.7%' : '📉 -5.2%'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {t('financials.netIncome', 'Net Income')}
                  </p>
                  <p className={`text-3xl font-bold ${netIncome >= 0 ? 'text-gray-900 dark:text-white' : 'text-orange-600 dark:text-orange-400'}`}>
                    <span className={netIncome >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}>AED</span> {netIncome.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FTA Integration Status and Alerts Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* FTA Integration Status Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div 
              className="h-24 bg-gradient-to-r from-blue-900 to-blue-700 relative"
              style={{
                backgroundImage: 'url(/images/peergos_slide_3.jpeg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-blue-900/80"></div>
              <div className="relative p-4 text-white">
                <h3 className="text-lg font-semibold flex items-center">
                  🔐 {t('fta.integration.title', 'FTA Integration')}
                </h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Agent Certificate</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    ✅ Uploaded
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Real-Time Sync</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                    ❌ Pending
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Status</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      Demo Mode – Simulation Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FTA Alerts Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                🚨 {t('fta.alerts.title', 'FTA Alerts')}
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                  3 Active
                </span>
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <span className="text-red-500">❗</span>
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-400">
                      Bank slip not uploaded
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                      Required for CIT filing completion
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <span className="text-yellow-500">❗</span>
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                      TRN verification pending
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
                      Automated verification in progress
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <span className="text-orange-500">❗</span>
                  <div>
                    <p className="text-sm font-medium text-orange-800 dark:text-orange-400">
                      Setup incomplete
                    </p>
                    <p className="text-xs text-orange-600 dark:text-orange-500 mt-1">
                      Complete initial configuration
                    </p>
                  </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {/* FTA Integration Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('fta.integration.title')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {t('fta.integration.subtitle')}
              </p>
            </div>
            <FTAIntegrationStatus 
              trn="100123456700003" 
              variant="card" 
              showDetails={true}
            />
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

        {/* Enhanced Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                ⚡ {t('dashboard.quickActions', 'Quick Actions')}
              </h3>
              <div 
                className="w-12 h-8 rounded bg-cover bg-center opacity-50"
                style={{
                  backgroundImage: 'url(/images/peergos_slide_5.jpeg)'
                }}
              ></div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/vat')}
                className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 dark:from-green-900/30 dark:to-green-800/30 dark:hover:from-green-800/40 dark:hover:to-green-700/40 border-2 border-green-200 dark:border-green-700 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-white text-xl">📄</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {t('dashboard.actions.fileVAT', 'File VAT Return')}
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => navigate('/cit')}
                className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 dark:hover:from-blue-800/40 dark:hover:to-blue-700/40 border-2 border-blue-200 dark:border-blue-700 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-white text-xl">🧮</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {t('dashboard.actions.calculateCIT', 'Calculate CIT')}
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => navigate('/financials')}
                className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 dark:hover:from-purple-800/40 dark:hover:to-purple-700/40 border-2 border-purple-200 dark:border-purple-700 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {t('dashboard.actions.viewFinancials', 'View Financials')}
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => navigate('/filing')}
                className="group relative overflow-hidden bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 dark:hover:from-yellow-800/40 dark:hover:to-yellow-700/40 border-2 border-yellow-200 dark:border-yellow-700 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-white text-xl">📁</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {t('dashboard.actions.uploadCertificate', 'Upload Agent Certificate')}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;