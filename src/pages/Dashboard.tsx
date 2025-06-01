import React, { useMemo, useState } from 'react';
import { useTax, calculateCIT } from '../context/TaxContext';
import { useUserRole } from '../context/UserRoleContext';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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
  const { role } = useUserRole();
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

  const handleSearch = () => {
    setError(null);
    setSearchResult(null);
    setShowResults(false);

    const validation = validateTRN(searchTRN);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

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

  if (role === 'FTA') {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {submissionSuccess && (
          <div className="mb-6">
            <SuccessAlert
              message={submissionSuccess.message}
              referenceNumber={submissionSuccess.referenceNumber}
              onClose={() => setSubmissionSuccess(null)}
            />
          </div>
        )}

        <div className="px-4 py-6 sm:px-0">
          {/* TRN Search Panel */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Search Company by TRN</h2>
              <div className="flex gap-4">
                <div className="flex-grow">
                  <label htmlFor="trn-search" className="block text-sm font-medium text-gray-700 mb-2">
                    Search by TRN Number
                  </label>
                  <input
                    type="text"
                    id="trn-search"
                    value={searchTRN}
                    onChange={handleTRNChange}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      error && searchTRN ? 'border-red-300' : ''
                    }`}
                    placeholder="Enter 15-digit TRN"
                    maxLength={15}
                  />
                  {error && searchTRN && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                  )}
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleSearch}
                    disabled={!validateTRN(searchTRN)}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                      validateTRN(searchTRN)
                        ? 'bg-indigo-600 hover:bg-indigo-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && !searchTRN && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Search Results with enhanced animation */}
          {searchResult && (
            <div 
              className={`transform transition-all duration-700 ease-in-out ${
                showResults ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              } ${
                searchResult.isCITApplicable && !searchResult.hasCITSubmission
                  ? 'border-2 border-red-500'
                  : ''
              } bg-white shadow-lg hover:shadow-xl rounded-lg`}
            >
              {/* Compliance Score */}
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Company Details</h3>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Compliance Score:</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      searchResult.complianceScore >= 90 ? 'bg-green-100 text-green-800' :
                      searchResult.complianceScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {searchResult.complianceScore}%
                    </span>
                  </div>
                </div>
                {searchResult.isCITApplicable && !searchResult.hasCITSubmission && (
                  <div className="mt-2 flex items-center text-sm text-red-600">
                    <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    CIT submission required but not completed
                  </div>
                )}
              </div>

              {/* Compliance Details */}
              <div className="px-4 py-5 sm:p-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-base font-medium text-gray-900">Compliance Details</h4>
                  <button
                    onClick={() => setShowComplianceDetails(!showComplianceDetails)}
                    className="text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    {showComplianceDetails ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>
                {showComplianceDetails && (
                  <div className="mt-4 space-y-4">
                    {complianceBreakdown.map((category) => (
                      <div key={category.category} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{category.category}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            (category.score / category.maxScore) >= 0.7
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {category.score}/{category.maxScore}
                          </span>
                        </div>
                        {category.issues.length > 0 && (
                          <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
                            {category.issues.map((issue, index) => (
                              <li key={index}>{issue}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {renderComplianceChart()}
              </div>

              {/* Trend Analysis */}
              <div className="px-4 py-5 sm:p-6 border-t border-gray-200">
                <h4 className="text-base font-medium text-gray-900 mb-4">12-Month Trend</h4>
                {renderTrendChart()}
              </div>

              {/* Quick Actions */}
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 rounded-b-lg">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => handleExport('pdf')}
                      disabled={isExporting}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                        isExporting && selectedReport === 'pdf'
                          ? 'bg-indigo-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                      {isExporting && selectedReport === 'pdf' ? 'Exporting...' : 'Export PDF'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExport('excel')}
                      disabled={isExporting}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                        isExporting && selectedReport === 'excel'
                          ? 'bg-green-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                    >
                      {isExporting && selectedReport === 'excel' ? 'Exporting...' : 'Export Excel'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSubmitModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Submit to FTA
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleScheduleAudit}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    Schedule Audit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <SubmissionModal
          isOpen={isSubmitModalOpen}
          isLoading={isSubmitting}
          onClose={() => setIsSubmitModalOpen(false)}
          onConfirm={handleSubmitToFTA}
        />
      </div>
    );
  }

  // Regular dashboard for non-FTA roles
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {submissionSuccess && (
        <div className="mb-6">
          <SuccessAlert
            message={submissionSuccess.message}
            referenceNumber={submissionSuccess.referenceNumber}
            onClose={() => setSubmissionSuccess(null)}
          />
        </div>
      )}

      {/* Alerts */}
      <div className="mb-8 space-y-4">
        {showVATAlert && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Your revenue exceeds AED 375,000. VAT registration is required.
                </p>
              </div>
            </div>
          </div>
        )}
        {showCITAlert && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Your revenue exceeds AED 3,000,000. Corporate Income Tax registration is required.
                </p>
              </div>
            </div>
          </div>
        )}
        {showNoExpensesAlert && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  No expenses have been logged yet. Add your business expenses to get accurate tax calculations.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              AED {totalRevenue.toLocaleString()}
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Expenses</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              AED {totalExpenses.toLocaleString()}
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500 truncate">Net Income</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              AED {netIncome.toLocaleString()}
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500 truncate">VAT Due</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              AED {totalVAT.toLocaleString()}
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500 truncate">CIT Due</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              AED {citAmount.toLocaleString()}
            </dd>
          </div>
        </div>
        <div className="col-span-full flex justify-end">
          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit to FTA
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `AED ${value.toLocaleString()}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  name="Revenue"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Categories Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Expense Categories</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `AED ${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <SubmissionModal
        isOpen={isSubmitModalOpen}
        isLoading={isSubmitting}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirm={handleSubmitToFTA}
      />
    </div>
  );
};

export default Dashboard; 