import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Alert,
  Chip,
  Divider,
  useTheme,
  alpha,
  Tabs,
  Tab,
  LinearProgress,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Assessment as AssessmentIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp,
  TrendingDown,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Language as LanguageIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Receipt as CashFlowIcon,
  Assignment as NotesIcon,
  MonetizationOn as RevenueIcon,
  ShoppingCart as ExpenseIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useTheme as useAppTheme } from '../context/ThemeContext';
import InvoiceScanner from '../components/InvoiceScanner';
import { IncomeStatement } from '../components/financials/IncomeStatement';
import { BalanceSheet } from '../components/financials/BalanceSheet';
import { CashFlowStatement } from '../components/financials/CashFlowStatement';
import { NotesToFinancials } from '../components/financials/NotesToFinancials';
import { 
  exportIncomeStatementToPDF, 
  exportBalanceSheetToPDF, 
  exportCashFlowToPDF,
  exportComprehensivePDF
} from '../utils/ftaReportsExport';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { useFinancialSync } from '../hooks/useFinancialSync';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Types
interface FinancialEntry {
  id: string;
  category: string;
  subcategory: string;
  amount: number;
  date: string;
  description: string;
  type: 'revenue' | 'expense' | 'asset' | 'liability' | 'equity';
  vendor?: string;
}

interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  isBalanced: boolean;
}

interface YearlySummary {
  year: number;
  revenue: number;
  expenses: number;
  netIncome: number;
  growthRate: number;
}

// Categories configuration
const CATEGORIES = {
  revenue: ['Product Sales', 'Services', 'Other Income'],
  expense: ['Salaries', 'Rent', 'Utilities', 'Marketing', 'Supplies', 'Professional Fees', 'Other'],
  asset: ['Cash', 'Inventory', 'Receivables', 'Equipment'],
  liability: ['Payables', 'Loans', 'Guarantees'],
  equity: ['Owner Capital', 'Retained Earnings']
};

const CHART_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

const Financials: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode, toggleTheme } = useAppTheme();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [notes, setNotes] = useState<any[]>([]);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FinancialEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use hooks directly - they must be called at the top level
  let financeContext: any = null;
  let syncData: any = null;

  try {
    financeContext = useFinance();
    syncData = useFinancialSync();
  } catch (err) {
    console.error('Error initializing finance hooks:', err);
    setError('Failed to load financial data');
  }

  const [financialData, setFinancialData] = useState<FinancialEntry[]>([
    {
      id: '1',
      category: 'Product Sales',
      subcategory: 'Main Products',
      amount: 150000,
      date: '2024-01-01',
      description: 'Q1 Product Sales',
      type: 'revenue'
    },
    {
      id: '2',
      category: 'Salaries',
      subcategory: 'Staff Salaries',
      amount: 45000,
      date: '2024-01-01',
      description: 'Monthly Salaries',
      type: 'expense',
      vendor: 'Payroll Department'
    },
    {
      id: '3',
      category: 'Cash',
      subcategory: 'Bank Account',
      amount: 85000,
      date: '2024-01-01',
      description: 'Cash in Bank',
      type: 'asset'
    },
    {
      id: '4',
      category: 'Loans',
      subcategory: 'Bank Loan',
      amount: 50000,
      date: '2024-01-01',
      description: 'Business Loan',
      type: 'liability'
    },
    {
      id: '5',
      category: 'Owner Capital',
      subcategory: 'Initial Investment',
      amount: 100000,
      date: '2024-01-01',
      description: 'Owner Investment',
      type: 'equity'
    }
  ]);

  const [newExpense, setNewExpense] = useState({
    vendor: '',
    category: '',
    subcategory: '',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Get data safely with fallbacks
  const revenues = financeContext?.revenue || [];
  const expenses = financeContext?.expenses || [];
  const totalRevenue = syncData?.totalRevenue || financeContext?.getTotalRevenue?.() || 0;
  const totalExpenses = syncData?.totalExpenses || financeContext?.getTotalExpenses?.() || 0;
  const netIncome = syncData?.netIncome || financeContext?.getNetIncome?.() || 0;
  const isUpdating = syncData?.isUpdating || false;

  // Calculate summary using live context data + static financial data
  const summary = {
    totalRevenue,
    totalExpenses,
    netIncome,
    totalAssets: financialData.filter(item => item.type === 'asset').reduce((sum, item) => sum + item.amount, 0),
    totalLiabilities: financialData.filter(item => item.type === 'liability').reduce((sum, item) => sum + item.amount, 0),
    totalEquity: financialData.filter(item => item.type === 'equity').reduce((sum, item) => sum + item.amount, 0),
    get isBalanced() { return Math.abs((this.totalAssets) - (this.totalLiabilities + this.totalEquity)) < 0.01; }
  };

  // Calculate yearly summary using live FinanceContext data
  const calculateYearlySummary = (): YearlySummary => {
    const currentYear = new Date().getFullYear();

    // Filter current year data from FinanceContext
    const currentYearRevenue = revenues
      .filter((item: any) => new Date(item.date).getFullYear() === currentYear)
      .reduce((sum: number, item: any) => sum + item.amount, 0);

    const currentYearExpenses = expenses
      .filter((item: any) => new Date(item.date).getFullYear() === currentYear)
      .reduce((sum: number, item: any) => sum + item.amount, 0);

    const netIncome = currentYearRevenue - currentYearExpenses;

    return {
      year: currentYear,
      revenue: currentYearRevenue,
      expenses: currentYearExpenses,
      netIncome,
      growthRate: 15.2 // Mock growth rate - could be calculated from historical data
    };
  };

  const yearlySummary = calculateYearlySummary();

  // Chart data for revenue vs expenses using live data
  const pieChartData = [
    { name: t('financials.revenue'), value: totalRevenue, color: '#10b981' },
    { name: t('financials.expenses'), value: totalExpenses, color: '#ef4444' }
  ];

  // Mock data for profit/loss over time
  const profitLossData = [
    { month: 'Jan', profit: 12000 },
    { month: 'Feb', profit: 18000 },
    { month: 'Mar', profit: 15000 },
    { month: 'Apr', profit: 22000 },
    { month: 'May', profit: 19000 },
    { month: 'Jun', profit: 25000 }
  ];

  const handleAddExpense = (expenseData: any) => {
    if (financeContext?.addExpense) {
      financeContext.addExpense({
        category: expenseData.category,
        amount: parseFloat(expenseData.amount),
        date: expenseData.date,
        description: expenseData.description,
        vendor: expenseData.vendor
      });
    }
    setOpenExpenseModal(false);
  };

  const handleEditEntry = (entry: FinancialEntry) => {
    setEditingEntry(entry);
    if (entry.type === 'expense') {
      setNewExpense({
        vendor: entry.vendor || '',
        category: entry.category,
        subcategory: entry.subcategory,
        amount: entry.amount,
        description: entry.description,
        date: entry.date
      });
      setOpenExpenseModal(true);
    }
  };

  const handleDeleteEntry = (id: string) => {
    setFinancialData(financialData.filter(item => item.id !== id));
  };

  const handleExportPDF = (type: 'income' | 'balance' | 'cashflow' | 'comprehensive') => {
    try {
      const exportData = {
        totalRevenue,
        totalExpenses,
        netIncome,
        revenues: revenues.map((r: any) => ({
          id: r.id,
          amount: r.amount,
          description: r.description,
          date: r.date,
          category: r.category
        })),
        expenses: expenses.map((e: any) => ({
          id: e.id,
          amount: e.amount,
          category: e.category,
          date: e.date,
          description: e.description,
          vendor: e.vendor
        }))
      };

      // Use the actual export function from ftaReportsExport
      if (type === 'comprehensive') {
        exportComprehensivePDF(exportData);
      } else if (type === 'income') {
        exportIncomeStatementToPDF(exportData);
      } else if (type === 'balance') {
        exportBalanceSheetToPDF(exportData);
      } else if (type === 'cashflow') {
        exportCashFlowToPDF(exportData);
      }

      setAlertMessage(t('financials.export.ftaPdfSuccess', 'Financial PDF generated successfully'));
      setShowSuccessAlert(true);
    } catch (error) {
      console.error('Export PDF error:', error);
      setAlertMessage(t('financials.export.ftaPdfError', 'Error generating PDF'));
      setShowWarningAlert(true);
    }
  };

  const handleExportExcel = () => {
    try {
      const exportData = {
        totalRevenue,
        totalExpenses,
        netIncome,
        revenues: revenues.map((r: any) => ({
          id: r.id,
          amount: r.amount,
          description: r.description,
          date: r.date,
          category: r.category
        })),
        expenses: expenses.map((e: any) => ({
          id: e.id,
          amount: e.amount,
          category: e.category,
          date: e.date,
          description: e.description,
          vendor: e.vendor
        }))
      };

      // Create CSV content for Excel export
      const csvContent = [
        ['Type', 'Category', 'Description', 'Amount', 'Date'],
        ...revenues.map((r: any) => ['Revenue', r.category || 'General', r.description, r.amount, r.date]),
        ...expenses.map((e: any) => ['Expense', e.category, e.description || '', e.amount, e.date])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financial-data-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      setAlertMessage(t('financials.export.excelSuccess', 'Excel file exported successfully'));
      setShowSuccessAlert(true);
    } catch (error) {
      console.error('Export Excel error:', error);
      setAlertMessage(t('financials.export.excelError', 'Error exporting Excel file'));
      setShowWarningAlert(true);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-AE' : 'en-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'revenue': return theme.palette.success.main;
      case 'expense': return theme.palette.error.main;
      case 'asset': return theme.palette.info.main;
      case 'liability': return theme.palette.warning.main;
      case 'equity': return theme.palette.secondary.main;
      default: return theme.palette.text.primary;
    }
  };

  const navigateToAccounting = () => {
    window.location.href = '/accounting?tab=revenue';
  };

  const navigateToAccountingExpense = () => {
    window.location.href = '/accounting?tab=expenses';
  };

  // Alert state variables
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Show error state
  if (error) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          <Typography variant="h6" gutterBottom>
            {t('common.error', 'Error')}
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()} 
            sx={{ mt: 2 }}
          >
            {t('common.retry', 'Retry')}
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <Box sx={{ p: 3, direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
              {t('financials.title', 'Financial Reports')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('financials.subtitle', 'Simplified financial management for non-accountants')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en')}>
              <LanguageIcon />
            </IconButton>
            <IconButton onClick={toggleTheme}>
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Live P&L Summary Card */}
        <Card sx={{ 
          mb: 4, 
          borderRadius: 3, 
          boxShadow: theme.shadows[4],
          background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)}, ${alpha(theme.palette.success.main, 0.05)})`
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                {t('financials.livePL', 'Live Profit & Loss Summary')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {isUpdating && (
                  <Chip 
                    label="🔄 Updating..." 
                    color="info" 
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                )}
                <Chip 
                  label={t('financials.realTime', 'Real-time')} 
                  color="success" 
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <RevenueIcon sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {t('financials.totalRevenue', 'Total Revenue')}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                    {formatCurrency(totalRevenue)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {revenues.length} {t('financials.transactions', 'transactions')}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <ExpenseIcon sx={{ fontSize: 40, color: theme.palette.error.main, mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {t('financials.totalExpenses', 'Total Expenses')}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
                    {formatCurrency(totalExpenses)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {expenses.length} {t('financials.transactions', 'transactions')}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <TrendingUp sx={{ fontSize: 40, color: netIncome >= 0 ? theme.palette.success.main : theme.palette.error.main, mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {t('financials.netProfit', 'Net Profit')}
                  </Typography>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700, 
                      color: netIncome >= 0 ? theme.palette.success.main : theme.palette.error.main 
                    }}
                  >
                    {formatCurrency(netIncome)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {totalRevenue > 0 ? ((netIncome / totalRevenue) * 100).toFixed(1) : 0}% {t('financials.margin', 'margin')}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<PdfIcon />}
                onClick={() => handleExportPDF('comprehensive')}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                {t('financials.exportPDF', 'Export PDF Report')}
              </Button>
              <Button
                variant="outlined"
                startIcon={<ExcelIcon />}
                onClick={handleExportExcel}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                {t('financials.exportExcel', 'Export Excel')}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Yearly Summary Card */}
        
        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center mb-6">
            <AssessmentIcon sx={{ mr: 2, color: theme.palette.primary.main, fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {t('financials.quickActions', 'Quick Actions')}
            </Typography>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Add Revenue Card */}
            <div 
              onClick={navigateToAccounting}
              className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl border border-green-200 dark:border-green-700"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-2xl mb-4">
                  <RevenueIcon sx={{ fontSize: 32, color: 'white' }} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('financials.addRevenue', 'Add Revenue')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('financials.recordSales', 'Record sales and income')}
                </p>
              </div>
            </div>

            {/* Add Expense Card */}
            <div 
              onClick={() => setOpenExpenseModal(true)}
              className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl border border-red-200 dark:border-red-700"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-2xl mb-4">
                  <ExpenseIcon sx={{ fontSize: 32, color: 'white' }} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('financials.addExpense', 'Add Expense')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('financials.trackCosts', 'Track business costs')}
                </p>
              </div>
            </div>

            {/* Export Reports Card */}
            <div 
              onClick={() => handleExportPDF('comprehensive')}
              className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl border border-amber-200 dark:border-amber-700"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 rounded-2xl mb-4">
                  <PdfIcon sx={{ fontSize: 32, color: 'white' }} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('financials.exportReports', 'Export Reports')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('financials.downloadPdf', 'Download PDF reports')}
                </p>
              </div>
            </div>

            {/* Export Data Card */}
            <div 
              onClick={handleExportExcel}
              className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl border border-blue-200 dark:border-blue-700"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl mb-4">
                  <ExcelIcon sx={{ fontSize: 32, color: 'white' }} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('financials.exportData', 'Export Data')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('financials.downloadExcel', 'Download Excel file')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Reports Tabs */}
        <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[4] }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{ px: 2 }}
            >
              <Tab 
                label={t('financials.incomeStatement', 'Income Statement')} 
                icon={<TrendingUp />}
                iconPosition="start"
                sx={{ textTransform: 'none' }}
              />
              <Tab 
                label={t('financials.balanceSheet', 'Balance Sheet')} 
                icon={<AccountBalanceIcon />}
                iconPosition="start"
                sx={{ textTransform: 'none' }}
              />
              <Tab 
                label={t('financials.cashFlowStatement', 'Cash Flow Statement')} 
                icon={<CashFlowIcon />}
                iconPosition="start"
                sx={{ textTransform: 'none' }}
              />
              <Tab 
                label={t('financials.dataEntries', 'Data Entries')} 
                icon={<AssessmentIcon />}
                iconPosition="start"
                sx={{ textTransform: 'none' }}
              />
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <ErrorBoundary>
                <IncomeStatement data={financialData} />
              </ErrorBoundary>
            )}
            {activeTab === 1 && (
              <ErrorBoundary>
                <BalanceSheet data={financialData} netIncome={summary.netIncome} />
              </ErrorBoundary>
            )}
            {activeTab === 2 && (
              <ErrorBoundary>
                <CashFlowStatement data={financialData} netIncome={summary.netIncome} />
              </ErrorBoundary>
            )}
            {activeTab === 3 && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                      <TableCell sx={{ fontWeight: 600 }}>{t('common.date', 'Date')}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{t('common.type', 'Type')}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{t('common.category', 'Category')}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{t('common.description', 'Description')}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>{t('common.amount', 'Amount')}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>{t('common.actions', 'Actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {financialData.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip 
                            label={row.type}
                            size="small"
                            sx={{ 
                              backgroundColor: alpha(getTypeColor(row.type), 0.1),
                              color: getTypeColor(row.type),
                              textTransform: 'capitalize'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {row.category}
                            </Typography>
                            {row.subcategory && (
                              <Typography variant="caption" color="text.secondary">
                                {row.subcategory}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell 
                          align="right" 
                          sx={{ 
                            color: getTypeColor(row.type),
                            fontWeight: 600
                          }}
                        >
                          {formatCurrency(row.amount)}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditEntry(row)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteEntry(row.id)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Paper>

        {/* Add Expense Modal */}
        <Dialog 
          open={openExpenseModal} 
          onClose={() => {
            setOpenExpenseModal(false);
            setEditingEntry(null);
            setNewExpense({ 
              vendor: '', 
              category: '', 
              subcategory: '', 
              amount: 0, 
              description: '', 
              date: new Date().toISOString().split('T')[0] 
            });
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 600 }}>
            {editingEntry ? t('financials.editExpense', 'Edit Expense') : t('financials.addExpense', 'Add New Expense')}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('common.vendor', 'Vendor Name')}
                  value={newExpense.vendor}
                  onChange={(e) => setNewExpense({ ...newExpense, vendor: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('common.date', 'Date')}
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label={t('common.category', 'Category')}
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                >
                  {CATEGORIES.expense.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('common.amount', 'Amount (AED)')}
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                  inputProps={{ step: '0.01', min: '0' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('common.description', 'Description')}
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => {
                setOpenExpenseModal(false);
                setEditingEntry(null);
                setNewExpense({ 
                  vendor: '', 
                  category: '', 
                  subcategory: '', 
                  amount: 0, 
                  description: '', 
                  date: new Date().toISOString().split('T')[0] 
                });
              }}
              sx={{ textTransform: 'none' }}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button 
              onClick={() => handleAddExpense(newExpense)} 
              variant="contained"
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              {editingEntry ? t('common.update', 'Update') : t('common.add', 'Add')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Bookkeeping Section */}
        

        {/* Success/Warning Alerts */}
        <Snackbar
          open={showSuccessAlert}
          autoHideDuration={4000}
          onClose={() => setShowSuccessAlert(false)}
        >
          <Alert severity="success" onClose={() => setShowSuccessAlert(false)}>
            {alertMessage}
          </Alert>
        </Snackbar>

        <Snackbar
          open={showWarningAlert}
          autoHideDuration={4000}
          onClose={() => setShowWarningAlert(false)}
        >
          <Alert severity="warning" onClose={() => setShowWarningAlert(false)}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ErrorBoundary>
  );
};

export default Financials;