import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useTax, calculateCIT } from '../context/TaxContext';
import { useUserRole } from '../context/UserRoleContext';
import { useAudit } from '../context/AuditContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { generatePDFReport, generateExcelReport, calculateDetailedComplianceScore } from '../utils/reports';
import SubmissionModal from '../components/SubmissionModal';
import SuccessAlert from '../components/SuccessAlert';
import { submitToFTA } from '../utils/submission';
import ChartControls from '../components/ChartControls';
import type { ChartType } from '../components/ChartControls';
import html2canvas from 'html2canvas';
import AlertBanner from '../components/AlertBanner';
import { useNavigate } from 'react-router-dom';
import {
  BanknotesIcon,
  ReceiptPercentIcon,
  BuildingOfficeIcon,
  ArrowTrendingUpIcon,
  DocumentChartBarIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { PageHeader } from '../components/Card';
import RelatedPartySection from '../components/RelatedPartySection';
import PermissionGate from '../components/PermissionGate';

interface CompanySearchResult {
  profile: {
    companyName: string;
    trnNumber: string;
    licenseType: string;
  };
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  vatDue: number;
  citDue: number;
  isVATApplicable: boolean;
  isCITApplicable: boolean;
  hasCITSubmission: boolean;
  monthlyTrend: {
    revenue: number;
    expenses: number;
    month: string;
  }[];
  complianceScore: number;
}

interface ComplianceBreakdown {
  category: string;
  score: number;
  maxScore: number;
  issues: string[];
}

const Dashboard: React.FC = () => {
  const { state } = useTax();
  const { canAccess } = useUserRole();
  const { log } = useAudit();
  const navigate = useNavigate();
  const [searchTRN, setSearchTRN] = useState('');
  const [searchResult, setSearchResult] = useState<CompanySearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [selectedReport, setSelectedReport] = useState<'pdf' | 'excel' | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showComplianceDetails, setShowComplianceDetails] = useState(false);
  const [selectedChartView, setSelectedChartView] = useState<'line' | 'bar'>('line');
  const [complianceBreakdown, setComplianceBreakdown] = useState<ComplianceBreakdown[]>([]);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    message: string;
    referenceNumber: string;
  } | null>(null);
  const [revenueChartType, setRevenueChartType] = useState<ChartType>('line');
  const [expenseChartType, setExpenseChartType] = useState<ChartType>('bar');
  const revenueChartRef = useRef<HTMLDivElement>(null!);
  const expenseChartRef = useRef<HTMLDivElement>(null!);

  // Log dashboard view on mount
  useEffect(() => {
    log('VIEW_DASHBOARD');
  }, [log]);

  // Calculate summary metrics
  const totalRevenue = state.revenues.reduce((sum, entry) => sum + entry.amount, 0);
  const totalExpenses = state.expenses.reduce((sum, entry) => sum + entry.amount, 0);
  const netIncome = totalRevenue - totalExpenses;
  const totalVAT = state.revenues.reduce((sum, entry) => sum + entry.vatAmount, 0);
  const citAmount = calculateCIT(netIncome);

  // Prepare monthly revenue data
  const monthlyData = useMemo(() => {
    const monthlyMap = new Map<string, number>();
    state.revenues.forEach(entry => {
      const date = new Date(entry.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + entry.amount);
    });

    return Array.from(monthlyMap.entries())
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [state.revenues]);

  // Prepare expense categories data
  const expenseData = useMemo(() => {
    const categoryMap = new Map<string, number>();
    state.expenses.forEach(entry => {
      categoryMap.set(entry.category, (categoryMap.get(entry.category) || 0) + entry.amount);
    });

    return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
  }, [state.expenses]);

  // Alert conditions
  const showVATAlert = totalRevenue > 375000 && !state.revenues.some(r => r.vatAmount > 0);
  const showCITAlert = totalRevenue > 3000000;
  const showNoExpensesAlert = state.expenses.length === 0;

  // Enhanced TRN validation
  const validateTRN = (trn: string): { isValid: boolean; message: string } => {
    if (!trn) return { isValid: false, message: 'TRN is required' };
    if (!/^\d+$/.test(trn)) return { isValid: false, message: 'TRN must contain only digits' };
    if (trn.length !== 15) return { isValid: false, message: 'TRN must be exactly 15 digits' };
    
    // Checksum validation (example - adjust according to actual TRN format)
    const sum = trn.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    if (sum % 7 !== 0) return { isValid: false, message: 'Invalid TRN checksum' };
    
    return { isValid: true, message: '' };
  };

  const handleTRNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 15); // Only allow digits
    setSearchTRN(value);
    const validation = validateTRN(value);
    setError(validation.isValid ? null : validation.message);
  };

  const handleSearch = () => {
    setError(null);
    setSearchResult(null);
    setShowResults(false);

    const validation = validateTRN(searchTRN);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    // Log TRN search
    log('TRN_SEARCH', { trn: searchTRN });

    // Get all company profiles from localStorage
    const storedData = localStorage.getItem('taxState');
    if (!storedData) {
      setError('No company data available');
      return;
    }

    try {
      const allData = JSON.parse(storedData);
      if (!allData.profile || allData.profile.trnNumber !== searchTRN) {
        setError('Company not found for this TRN');
        return;
      }

      // Calculate monthly trends
      const monthlyTrend = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = date.toISOString().slice(0, 7);
        
        const revenue = allData.revenues
          .filter((r: any) => r.date.startsWith(monthKey))
          .reduce((sum: number, r: any) => sum + r.amount, 0);
          
        const expenses = allData.expenses
          .filter((e: any) => e.date.startsWith(monthKey))
          .reduce((sum: number, e: any) => sum + e.amount, 0);
          
        return {
          month: new Date(monthKey).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          revenue,
          expenses
        };
      }).reverse();

      // Calculate totals
      const totalRevenue = allData.revenues.reduce((sum: number, entry: any) => sum + entry.amount, 0);
      const totalExpenses = allData.expenses.reduce((sum: number, entry: any) => sum + entry.amount, 0);
      const netIncome = totalRevenue - totalExpenses;
      const vatDue = allData.revenues.reduce((sum: number, entry: any) => sum + entry.vatAmount, 0);
      const citDue = calculateCIT(netIncome);

      // Determine tax applicability
      const isVATApplicable = totalRevenue > 375000;
      const isCITApplicable = netIncome > 375000;
      
      // For demo purposes, assume CIT is submitted if there's a submission date in the profile
      const hasCITSubmission = Boolean(allData.profile.citSubmissionDate);

      const complianceDetails = calculateDetailedComplianceScore(allData);
      setComplianceBreakdown(complianceDetails.breakdown);

      const complianceScore = complianceDetails.score;

      setSearchResult({
        profile: allData.profile,
        totalRevenue,
        totalExpenses,
        netIncome,
        vatDue,
        citDue,
        isVATApplicable,
        isCITApplicable,
        hasCITSubmission,
        monthlyTrend,
        complianceScore
      });

      // Enhanced animation sequence
      setTimeout(() => setShowResults(true), 50);
    } catch (err) {
      setError('Error processing company data');
    }
  };

  const handleExport = async (type: 'pdf' | 'excel') => {
    if (!searchResult) return;
    
    setIsExporting(true);
    setSelectedReport(type);
    
    try {
      const reportData = {
        profile: searchResult.profile,
        revenues: state.revenues,
        expenses: state.expenses,
        vatDue: searchResult.vatDue,
        citDue: searchResult.citDue,
        complianceScore: searchResult.complianceScore
      };

      // Log export attempt
      log('EXPORT_REPORT', { type, trn: searchResult.profile.trnNumber });

      const blob = await (type === 'pdf' ? generatePDFReport(reportData) : generateExcelReport(reportData));
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tax_report_${searchResult.profile.trnNumber}.${type}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setSelectedReport(null);
    }
  };

  const handleScheduleAudit = () => {
    // In a real implementation, this would integrate with a calendar API
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    alert(`Audit scheduled for ${nextMonth.toLocaleDateString()}`);
  };

  const handleSubmitToFTA = async () => {
    if (!searchResult) return;
    
    setIsSubmitting(true);
    try {
      const submissionData = {
        trn: searchResult.profile.trnNumber,
        timestamp: new Date().toISOString(),
        referenceNumber: '',
        data: {
          revenues: state.revenues,
          expenses: state.expenses,
          vatDue: searchResult.vatDue,
          citDue: searchResult.citDue,
          complianceScore: searchResult.complianceScore
        }
      };

      const referenceNumber = await submitToFTA(submissionData);
      
      // Log successful submission
      log('SUBMIT_FILING', { 
        trn: searchResult.profile.trnNumber,
        referenceNumber,
        vatDue: searchResult.vatDue,
        citDue: searchResult.citDue
      });

      setSubmissionSuccess({
        message: 'Tax report submitted successfully to FTA.',
        referenceNumber
      });
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
      setIsSubmitModalOpen(false);
    }
  };

  const renderComplianceChart = () => {
    if (!complianceBreakdown.length) return null;

    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="30%"
            outerRadius="100%"
            data={complianceBreakdown}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar
              background
              dataKey="score"
              cornerRadius={10}
              label={{ position: 'insideStart', fill: '#fff' }}
            />
            <Legend
              iconSize={10}
              layout="vertical"
              verticalAlign="middle"
              align="right"
            />
            <Tooltip
              formatter={(value, name) => [`${value}/${name === 'score' ? 'maxScore' : ''}`, name]}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderTrendChart = () => {
    if (!searchResult?.monthlyTrend) return null;

    return (
      <div className="h-64">
        <div className="flex justify-end mb-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setSelectedChartView('line')}
              className={`px-4 py-2 text-sm font-medium ${
                selectedChartView === 'line'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-200 rounded-l-lg`}
            >
              Line
            </button>
            <button
              type="button"
              onClick={() => setSelectedChartView('bar')}
              className={`px-4 py-2 text-sm font-medium ${
                selectedChartView === 'bar'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-200 rounded-r-lg`}
            >
              Bar
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          {selectedChartView === 'line' ? (
            <LineChart data={searchResult.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `AED ${value.toLocaleString()}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                name="Revenue"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#82ca9d"
                name="Expenses"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          ) : (
            <BarChart data={searchResult.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `AED ${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
              <Bar dataKey="expenses" fill="#82ca9d" name="Expenses" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  };

  const handleChartDownload = async (chartRef: React.RefObject<HTMLDivElement>, chartName: string) => {
    if (!chartRef.current) return;

    try {
      const canvas = await html2canvas(chartRef.current);
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${chartName}-${new Date().toISOString()}.png`;
      link.href = dataUrl;
      link.click();

      log('DOWNLOAD_CHART', { chartName });
    } catch (error) {
      console.error('Failed to download chart:', error);
    }
  };

  const renderChart = (
    type: ChartType,
    data: any[],
    dataKeys: { key: string; color: string }[]
  ) => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    if (type === 'line') {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {dataKeys.map(({ key, color }) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      );
    }

    return (
      <BarChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {dataKeys.map(({ key, color }) => (
          <Bar key={key} dataKey={key} fill={color} />
        ))}
      </BarChart>
    );
  };

  // Check for missing setup information
  const setupMissing = useMemo(() => {
    if (!state.profile) return true;
    return !state.profile.trnNumber || !state.profile.licenseType;
  }, [state.profile]);

  // Check for missing filings
  const missingFilings = useMemo(() => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthStr = lastMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    // Check if there are any revenues or expenses in the last month
    const hasLastMonthEntries = [...state.revenues, ...state.expenses].some(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === lastMonth.getMonth() && 
             entryDate.getFullYear() === lastMonth.getFullYear();
    });

    return hasLastMonthEntries ? null : lastMonthStr;
  }, [state.revenues, state.expenses]);

  // Check for incomplete profile information
  const incompleteProfile = useMemo(() => {
    if (!state.profile) return [];
    
    const missing: string[] = [];
    if (!state.profile.email) missing.push('Email');
    if (!state.profile.phone) missing.push('Phone');
    if (!state.profile.address) missing.push('Address');
    if (!state.profile.businessActivity) missing.push('Business Activity');
    
    return missing;
  }, [state.profile]);

  // Check for tax registration requirements
  const taxRegistrationAlerts = useMemo(() => {
    const alerts = [];
    const totalRevenue = state.revenues.reduce((sum, entry) => sum + entry.amount, 0);
    
    if (totalRevenue > 375000 && !state.profile?.vatRegistered) {
      alerts.push({
        type: 'warning' as const,
        title: 'VAT Registration Required',
        message: 'Your revenue exceeds AED 375,000. VAT registration is mandatory.',
        action: {
          label: 'Register for VAT',
          onClick: () => window.open('https://www.tax.gov.ae/vat', '_blank')
        }
      });
    }

    if (totalRevenue > 3000000 && !state.profile?.citRegistered) {
      alerts.push({
        type: 'error' as const,
        title: 'Corporate Tax Registration Required',
        message: 'Your revenue exceeds AED 3,000,000. Corporate Tax registration is mandatory.',
        action: {
          label: 'Register for CIT',
          onClick: () => window.open('https://www.tax.gov.ae/ct', '_blank')
        }
      });
    }

    return alerts;
  }, [state.revenues, state.profile]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tax Dashboard"
        description="Monitor your tax compliance and financial metrics"
      />
      
      <RelatedPartySection />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Tax Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Monitor your tax compliance and financial metrics
            </p>
          </div>

          {/* Alerts Section */}
          <PermissionGate
            resource="dashboard"
            requiredPermission="view"
            restrictedTo="Tax Agent or Admin"
          >
            <div className="space-y-4 mb-8">
              {setupMissing && (
                <AlertBanner
                  type="error"
                  title="Setup Not Completed"
                  message="Please complete your company setup to ensure compliance."
                  action={{
                    label: 'Complete Setup',
                    onClick: () => navigate('/setup')
                  }}
                />
              )}

              {missingFilings && (
                <AlertBanner
                  type="warning"
                  title="Missing Filing"
                  message={`No entries found for ${missingFilings}. Please ensure all transactions are recorded.`}
                  action={{
                    label: 'Add Entries',
                    onClick: () => navigate('/filing')
                  }}
                />
              )}

              {incompleteProfile.length > 0 && (
                <AlertBanner
                  type="info"
                  title="Incomplete Profile"
                  message={`The following information is missing: ${incompleteProfile.join(', ')}`}
                  action={{
                    label: 'Update Profile',
                    onClick: () => navigate('/setup')
                  }}
                />
              )}

              {taxRegistrationAlerts.map((alert, index) => (
                <AlertBanner
                  key={index}
                  type={alert.type}
                  title={alert.title}
                  message={alert.message}
                  action={alert.action}
                />
              ))}
            </div>
          </PermissionGate>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <PermissionGate
              resource="dashboard"
              requiredPermission="view"
              restrictedTo="Tax Agent or Admin"
            >
              {/* Revenue Card */}
              <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-gray-100">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BanknotesIcon className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          AED {totalRevenue.toLocaleString()}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-b from-green-50 to-white px-5 py-3">
                  <div className="text-sm">
                    <span className="text-green-700 font-medium">
                      {state.revenues.length} transactions
                    </span>
                  </div>
                </div>
              </div>

              {/* Expenses Card */}
              <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-gray-100">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ReceiptPercentIcon className="h-6 w-6 text-red-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Expenses</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          AED {totalExpenses.toLocaleString()}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-b from-red-50 to-white px-5 py-3">
                  <div className="text-sm">
                    <span className="text-red-700 font-medium">
                      {state.expenses.length} transactions
                    </span>
                  </div>
                </div>
              </div>
            </PermissionGate>

            {/* Net Income Card - Admin Only */}
            <PermissionGate
              resource="dashboard"
              requiredPermission="edit"
              restrictedTo="Admins"
            >
              <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-gray-100">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BuildingOfficeIcon className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Net Income</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          AED {netIncome.toLocaleString()}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-b from-blue-50 to-white px-5 py-3">
                  <div className="text-sm">
                    <span className="text-blue-700 font-medium">
                      Year to date
                    </span>
                  </div>
                </div>
              </div>
            </PermissionGate>

            {/* Tax Due Card - Tax Agent and Admin */}
            <PermissionGate
              resource="dashboard"
              requiredPermission="view"
              restrictedTo="Tax Agent or Admin"
            >
              <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-gray-100">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DocumentChartBarIcon className="h-6 w-6 text-purple-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Tax Due</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          AED {(totalVAT + citAmount).toLocaleString()}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-b from-purple-50 to-white px-5 py-3">
                  <div className="text-sm">
                    <span className="text-purple-700 font-medium">
                      VAT + CIT
                    </span>
                  </div>
                </div>
              </div>
            </PermissionGate>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Chart - Tax Agent and Admin */}
            <PermissionGate
              resource="dashboard"
              requiredPermission="view"
              restrictedTo="Tax Agent or Admin"
            >
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div ref={revenueChartRef}>
                  <ChartControls
                    chartType={revenueChartType}
                    onChartTypeChange={setRevenueChartType}
                    onDownload={() => handleChartDownload(revenueChartRef, 'revenue')}
                    chartTitle="Monthly Revenue"
                  />
                  <div className="h-80 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      {revenueChartType === 'line' ? (
                        <LineChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis dataKey="month" stroke="#6B7280" />
                          <YAxis stroke="#6B7280" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #E5E7EB',
                              borderRadius: '0.5rem'
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="amount"
                            name="Revenue"
                            stroke="#8B5CF6"
                            strokeWidth={2}
                            dot={{ r: 4, strokeWidth: 2 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      ) : (
                        <BarChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis dataKey="month" stroke="#6B7280" />
                          <YAxis stroke="#6B7280" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #E5E7EB',
                              borderRadius: '0.5rem'
                            }}
                          />
                          <Legend />
                          <Bar dataKey="amount" name="Revenue" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </PermissionGate>

            {/* Expense Chart - Admin Only */}
            <PermissionGate
              resource="dashboard"
              requiredPermission="edit"
              restrictedTo="Admins"
            >
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div ref={expenseChartRef}>
                  <ChartControls
                    chartType={expenseChartType}
                    onChartTypeChange={setExpenseChartType}
                    onDownload={() => handleChartDownload(expenseChartRef, 'expenses')}
                    chartTitle="Expense Categories"
                  />
                  <div className="h-80 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      {expenseChartType === 'line' ? (
                        <LineChart data={expenseData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis dataKey="name" stroke="#6B7280" />
                          <YAxis stroke="#6B7280" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #E5E7EB',
                              borderRadius: '0.5rem'
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="value"
                            name="Amount"
                            stroke="#EF4444"
                            strokeWidth={2}
                            dot={{ r: 4, strokeWidth: 2 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      ) : (
                        <BarChart data={expenseData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis dataKey="name" stroke="#6B7280" />
                          <YAxis stroke="#6B7280" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #E5E7EB',
                              borderRadius: '0.5rem'
                            }}
                          />
                          <Legend />
                          <Bar dataKey="value" name="Amount" fill="#EF4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </PermissionGate>
          </div>

          {/* Action Buttons */}
          <PermissionGate
            resource="dashboard"
            requiredPermission="edit"
            restrictedTo="Admins"
          >
            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => handleExport('pdf')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                Export PDF
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <DocumentChartBarIcon className="h-5 w-5 mr-2" />
                Export Excel
              </button>
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />
                Submit to FTA
              </button>
            </div>
          </PermissionGate>
        </div>

        {submissionSuccess && (
          <div className="mt-6">
            <SuccessAlert
              message={submissionSuccess.message}
              referenceNumber={submissionSuccess.referenceNumber}
              onClose={() => setSubmissionSuccess(null)}
            />
          </div>
        )}

        <SubmissionModal
          isOpen={isSubmitModalOpen}
          isLoading={isSubmitting}
          onClose={() => setIsSubmitModalOpen(false)}
          onConfirm={handleSubmitToFTA}
        />
      </div>
    </div>
  );
};

export default Dashboard; 