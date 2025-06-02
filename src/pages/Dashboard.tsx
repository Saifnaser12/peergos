import React, { useRef, useState, useMemo } from 'react';
import { useTax, calculateCIT } from '../context/TaxContext';
import { useAudit } from '../context/AuditContext';
import { useNavigate } from 'react-router-dom';
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
  RadialBar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { generatePDFReport, generateExcelReport, calculateDetailedComplianceScore } from '../utils/reports';
import SubmissionModal from '../components/SubmissionModal';
import SuccessAlert from '../components/SuccessAlert';
import { submitToFTA } from '../utils/submission';
import ChartControls from '../components/ChartControls';
import type { ChartType } from '../components/ChartControls';
import html2canvas from 'html2canvas';
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
import AlertBanner from '../components/AlertBanner';
import Button from '../components/Button';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import ExcelJS from 'exceljs';

interface CompanySearchResult {
  name: string;
  trn: string;
  status: string;
  monthlyTrend?: Array<{
    revenue: number;
    expenses: number;
    month: string;
  }>;
}

interface ComplianceBreakdown {
  category: string;
  score: number;
  maxScore: number;
  issues: string[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface DateRange {
  startDate: string;
  endDate: string;
}

const Dashboard: React.FC = () => {
  const { state } = useTax();
  const { log } = useAudit();
  const navigate = useNavigate();
  const [searchResult, setSearchResult] = useState<CompanySearchResult | null>(null);
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
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '',
    endDate: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [exportStarted, setExportStarted] = useState(false);

  // Calculate VAT and CIT
  const vatDue = useMemo(() => {
    // VAT calculation logic
    return state.revenues.reduce((acc, rev) => acc + rev.amount * 0.05, 0);
  }, [state.revenues]);

  const citDue = useMemo(() => {
    const totalRevenue = state.revenues.reduce((acc, rev) => acc + rev.amount, 0);
    return calculateCIT(totalRevenue);
  }, [state.revenues]);

  const complianceScore = useMemo(() => {
    return 85; // Default compliance score
  }, []);

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

  // Validate TRN
  const validateTRN = (trn: string): { isValid: boolean; message: string } => {
    if (!trn) return { isValid: false, message: 'TRN is required' };
    if (!/^\d+$/.test(trn)) return { isValid: false, message: 'TRN must contain only digits' };
    if (trn.length !== 15) return { isValid: false, message: 'TRN must be exactly 15 digits' };
    
    // Checksum validation (example - adjust according to actual TRN format)
    const sum = trn.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    if (sum % 7 !== 0) return { isValid: false, message: 'Invalid TRN checksum' };
    
    return { isValid: true, message: '' };
  };

  const handleSearch = (searchTRN: string) => {
    const validation = validateTRN(searchTRN);
    if (!validation.isValid) {
      return;
    }

    // Get all company profiles from localStorage
    const storedData = localStorage.getItem('taxState');
    if (!storedData) {
      return;
    }

    try {
      const allData = JSON.parse(storedData);
      if (!allData.profile || allData.profile.trnNumber !== searchTRN) {
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

      const complianceDetails = calculateDetailedComplianceScore(allData);
      setComplianceBreakdown(complianceDetails.breakdown);

      setSearchResult({
        name: allData.profile.companyName,
        trn: allData.profile.trnNumber,
        status: allData.profile.licenseType,
        monthlyTrend: monthlyTrend
      });
    } catch (err) {
      console.error('Error processing company data');
    }
  };

  const handleExport = async (type?: 'pdf' | 'excel') => {
    if (!type) {
      // Simulate export functionality
      console.log('Exporting...');
      setTimeout(() => {
        console.log('Export complete');
      }, 1000);
      return;
    }

    try {
      if (type === 'pdf') {
        // PDF export logic
        const doc = new jsPDF();
        // Add content to PDF
        doc.save('tax-report.pdf');
      } else {
        // Excel export logic using exceljs
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Tax Report');
        
        // Add headers
        worksheet.addRow(['TRN', 'Company Name', 'Tax Period', 'VAT Due', 'CIT Due']);
        
        // Add data
        worksheet.addRow([
          searchResult?.trn || '',
          searchResult?.name || '',
          format(new Date(), 'MM/yyyy'),
          vatDue.toFixed(2),
          citDue.toFixed(2)
        ]);

        // Generate and save file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tax-report.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
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
        trn: searchResult.trn,
        timestamp: new Date().toISOString(),
        referenceNumber: '',
        data: {
          revenues: state.revenues,
          expenses: state.expenses,
          vatDue: vatDue,
          citDue: citDue,
          complianceScore: complianceScore
        }
      };

      const referenceNumber = await submitToFTA(submissionData);
      
      // Log successful submission
      log('SUBMIT_FILING', { 
        trn: searchResult.trn,
        referenceNumber,
        vatDue: vatDue,
        citDue: citDue
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

  const filteredData = useMemo(() => {
    if (!dateRange.startDate || !dateRange.endDate) {
      return state;
    }

    return {
      revenues: state.revenues.filter(
        r => r.date >= dateRange.startDate && r.date <= dateRange.endDate
      ),
      expenses: state.expenses.filter(
        e => e.date >= dateRange.startDate && e.date <= dateRange.endDate
      )
    };
  }, [state, dateRange]);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

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
                          AED {formatCurrency(metrics.totalRevenue)}
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
                          AED {formatCurrency(metrics.totalExpenses)}
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
                          AED {formatCurrency(metrics.netIncome)}
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
                          AED {(metrics.totalVAT + citAmount).toLocaleString()}
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

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Trend Chart */}
            <PermissionGate
              resource="dashboard"
              requiredPermission="view"
              restrictedTo="Tax Agent or Admin"
            >
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
            </PermissionGate>

            {/* Expense Breakdown Chart */}
            <PermissionGate
              resource="dashboard"
              requiredPermission="edit"
              restrictedTo="Admins"
            >
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
    </div>
  );
};

export default Dashboard; 