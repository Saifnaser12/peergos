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
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Download as DownloadIcon,
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
  MonetizationOn as RevenueIcon,
  ShoppingCart as ExpenseIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useTheme as useAppTheme } from '../context/ThemeContext';
import { IncomeStatement } from '../components/financials/IncomeStatement';
import { BalanceSheet } from '../components/financials/BalanceSheet';
import { CashFlowStatement } from '../components/financials/CashFlowStatement';
import { useFinance } from '../context/FinanceContext';

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

// Categories configuration
const CATEGORIES = {
  revenue: ['Product Sales', 'Services', 'Other Income'],
  expense: ['Salaries', 'Rent', 'Utilities', 'Marketing', 'Supplies', 'Professional Fees', 'Other'],
  asset: ['Cash', 'Inventory', 'Receivables', 'Equipment'],
  liability: ['Payables', 'Loans', 'Guarantees'],
  equity: ['Owner Capital', 'Retained Earnings']
};

const Financials: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode, toggleTheme } = useAppTheme();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FinancialEntry | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Use Finance Context safely
  let financeContext;
  try {
    financeContext = useFinance();
  } catch (error) {
    console.error('Error loading finance context:', error);
    financeContext = {
      revenue: [],
      expenses: [],
      addExpense: () => {},
      getTotalRevenue: () => 0,
      getTotalExpenses: () => 0,
      getNetIncome: () => 0
    };
  }

  const {
    revenue: revenues = [],
    expenses = [],
    addExpense,
    getTotalRevenue,
    getTotalExpenses,
    getNetIncome
  } = financeContext;

  // Get totals safely
  const totalRevenue = getTotalRevenue ? getTotalRevenue() : 0;
  const totalExpenses = getTotalExpenses ? getTotalExpenses() : 0;
  const netIncome = getNetIncome ? getNetIncome() : 0;

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

  // Calculate summary
  const summary = {
    totalRevenue,
    totalExpenses,
    netIncome,
    totalAssets: financialData.filter(item => item.type === 'asset').reduce((sum, item) => sum + item.amount, 0),
    totalLiabilities: financialData.filter(item => item.type === 'liability').reduce((sum, item) => sum + item.amount, 0),
    totalEquity: financialData.filter(item => item.type === 'equity').reduce((sum, item) => sum + item.amount, 0),
    get isBalanced() { return Math.abs((this.totalAssets) - (this.totalLiabilities + this.totalEquity)) < 0.01; }
  };

  const handleAddExpense = (expenseData: any) => {
    try {
      if (addExpense) {
        addExpense({
          category: expenseData.category,
          amount: parseFloat(expenseData.amount),
          date: expenseData.date,
          description: expenseData.description,
          vendor: expenseData.vendor
        });
        setAlertMessage('Expense added successfully');
        setShowSuccessAlert(true);
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      setAlertMessage('Error adding expense');
      setShowWarningAlert(true);
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

  const handleExportPDF = () => {
    try {
      // Simple CSV export as fallback
      const csvContent = [
        ['Type', 'Category', 'Description', 'Amount', 'Date'],
        ...revenues.map((r: any) => ['Revenue', r.category || 'General', r.description, r.amount, r.date]),
        ...expenses.map((e: any) => ['Expense', e.category, e.description || '', e.amount, e.date])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financial-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      setAlertMessage('Financial report exported successfully');
      setShowSuccessAlert(true);
    } catch (error) {
      console.error('Export error:', error);
      setAlertMessage('Error exporting report');
      setShowWarningAlert(true);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
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

  console.log('Financials page rendered successfully', { totalRevenue, totalExpenses, netIncome });

  return (
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
            <Chip 
              label={t('financials.realTime', 'Real-time')} 
              color="success" 
              sx={{ fontWeight: 600 }}
            />
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
              onClick={handleExportPDF}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              {t('financials.exportPDF', 'Export Report')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setOpenExpenseModal(true)}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              {t('financials.addExpense', 'Add Expense')}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <AssessmentIcon sx={{ mr: 2, color: theme.palette.primary.main, fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {t('financials.quickActions', 'Quick Actions')}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box 
                onClick={navigateToAccounting}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 2,
                  cursor: 'pointer',
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  border: 1,
                  borderColor: alpha(theme.palette.success.main, 0.2),
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4]
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <RevenueIcon sx={{ fontSize: 32, color: theme.palette.success.main, mb: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {t('financials.addRevenue', 'Add Revenue')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('financials.recordSales', 'Record sales and income')}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box 
                onClick={() => setOpenExpenseModal(true)}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 2,
                  cursor: 'pointer',
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  border: 1,
                  borderColor: alpha(theme.palette.error.main, 0.2),
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4]
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <ExpenseIcon sx={{ fontSize: 32, color: theme.palette.error.main, mb: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {t('financials.addExpense', 'Add Expense')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('financials.trackCosts', 'Track business costs')}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box 
                onClick={handleExportPDF}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 2,
                  cursor: 'pointer',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  border: 1,
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4]
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <PdfIcon sx={{ fontSize: 32, color: theme.palette.primary.main, mb: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {t('financials.exportReports', 'Export Reports')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('financials.downloadPdf', 'Download financial reports')}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box 
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  border: 1,
                  borderColor: alpha(theme.palette.info.main, 0.2)
                }}
              >
                <AssessmentIcon sx={{ fontSize: 32, color: theme.palette.info.main, mb: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {t('financials.viewAnalytics', 'View Analytics')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('financials.businessInsights', 'Business insights')}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

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
            <IncomeStatement data={financialData} />
          )}
          {activeTab === 1 && (
            <BalanceSheet data={financialData} netIncome={summary.netIncome} />
          )}
          {activeTab === 2 && (
            <CashFlowStatement data={financialData} netIncome={summary.netIncome} />
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
  );
};

export default Financials;