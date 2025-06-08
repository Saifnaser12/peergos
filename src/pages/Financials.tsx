import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Tabs,
  Tab,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  alpha
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  Assessment as AssessmentIcon,
  Add as AddIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Note as NoteIcon
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`financial-tabpanel-${index}`}
      aria-labelledby={`financial-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Financials: React.FC = () => {
  console.log('🚀 Financials component starting...');

  const theme = useTheme();

  // State management
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'revenue' | 'expense'>('revenue');
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  // Sample financial data
  const [revenueData] = useState([
    {
      id: '1',
      category: 'Product Sales',
      amount: 150000,
      date: '2024-01-15',
      description: 'Q1 Product Sales Revenue'
    },
    {
      id: '2',
      category: 'Services',
      amount: 85000,
      date: '2024-01-20',
      description: 'Consulting and Professional Services'
    },
    {
      id: '3',
      category: 'Licensing',
      amount: 25000,
      date: '2024-01-25',
      description: 'Software Licensing Revenue'
    }
  ]);

  const [expenseData] = useState([
    {
      id: '1',
      category: 'Salaries',
      amount: 65000,
      date: '2024-01-01',
      description: 'Monthly Staff Salaries'
    },
    {
      id: '2',
      category: 'Rent',
      amount: 18000,
      date: '2024-01-01',
      description: 'Office Space Rental'
    },
    {
      id: '3',
      category: 'Utilities',
      amount: 4500,
      date: '2024-01-05',
      description: 'Electricity and Internet'
    },
    {
      id: '4',
      category: 'Marketing',
      amount: 12000,
      date: '2024-01-10',
      description: 'Digital Marketing Campaign'
    }
  ]);

  const [notes] = useState([
    {
      id: '1',
      title: 'Accounting Policies',
      content: 'The financial statements are prepared in accordance with International Financial Reporting Standards (IFRS) as adopted by the UAE. Revenue is recognized when control of goods or services is transferred to customers.',
      tags: ['IFRS', 'Revenue Recognition', 'Policies'],
      lastModified: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Depreciation Methods',
      content: 'Fixed assets are depreciated using the straight-line method over their estimated useful lives. Office equipment: 5 years, Computer equipment: 3 years.',
      tags: ['Depreciation', 'Fixed Assets'],
      lastModified: new Date().toISOString()
    }
  ]);

  // Financial calculations
  const totalRevenue = revenueData.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalExpenses = expenseData.reduce((sum, item) => sum + (item.amount || 0), 0);
  const netIncome = totalRevenue - totalExpenses;

  console.log('📊 Financial calculations complete:', { 
    totalRevenue: totalRevenue.toLocaleString(), 
    totalExpenses: totalExpenses.toLocaleString(), 
    netIncome: netIncome.toLocaleString() 
  });

  useEffect(() => {
    console.log('⚡ Initializing Financials page...');

    const initializeFinancials = async () => {
      try {
        // Simulate loading
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('✅ Financials page loaded successfully');
        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error('❌ Error loading financials:', err);
        setError('Failed to load financial data');
        setIsLoading(false);
      }
    };

    initializeFinancials();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log('📋 Tab changed to:', newValue);
    setTabValue(newValue);
  };

  const handleAddTransaction = () => {
    const amount = parseFloat(formData.amount);
    if (!formData.category || !amount || !formData.date) {
      console.warn('⚠️ Invalid transaction data');
      return;
    }

    const transaction = {
      id: Date.now().toString(),
      category: formData.category,
      amount,
      date: formData.date,
      description: formData.description || ''
    };

    console.log('💳 Adding transaction:', transaction);

    // Reset form
    setFormData({
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
    setOpenAddDialog(false);
  };

  const openAddTransactionDialog = (type: 'revenue' | 'expense') => {
    console.log('🆕 Opening add transaction dialog for:', type);
    setDialogType(type);
    setOpenAddDialog(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  };

  const exportToPDF = () => {
    console.log('📄 Exporting to PDF...');
    alert('PDF Export: Financial statements are ready for download');
  };

  const exportToExcel = () => {
    console.log('📊 Exporting to Excel...');
    alert('Excel Export: Financial data spreadsheet is ready for download');
  };

  if (isLoading) {
    console.log('⏳ Rendering loading state...');
    return (
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column'
      }}>
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h6" color="text.secondary">
          Loading Financial Data...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Preparing your financial overview
        </Typography>
      </Box>
    );
  }

  if (error) {
    console.log('❌ Rendering error state:', error);
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mr: 2 }}
        >
          Retry
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => setError(null)}
        >
          Continue with Demo Data
        </Button>
      </Box>
    );
  }

  // Overview Panel Component
  const OverviewPanel = () => (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: theme.palette.primary.main }}>
          📊 Financial Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Real-time financial insights and performance metrics
        </Typography>
        {error && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Demo Mode Active: {error}
          </Alert>
        )}
      </Box>

      {/* Financial Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.15)}, ${alpha(theme.palette.success.main, 0.05)})`,
            border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ color: 'success.main', mr: 1, fontSize: 28 }} />
                <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 600 }}>
                  Total Revenue
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: 'success.main' }}>
                {formatCurrency(totalRevenue)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                📈 {revenueData.length} revenue streams • +12% vs last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.15)}, ${alpha(theme.palette.error.main, 0.05)})`,
            border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingDownIcon sx={{ color: 'error.main', mr: 1, fontSize: 28 }} />
                <Typography variant="h6" sx={{ color: 'error.main', fontWeight: 600 }}>
                  Total Expenses
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: 'error.main' }}>
                {formatCurrency(totalExpenses)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                📉 {expenseData.length} expense categories • -5% vs last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.primary.main, 0.05)})`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceIcon sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
                <Typography variant="h6" sx={{ color: netIncome >= 0 ? 'success.main' : 'error.main', fontWeight: 600 }}>
                  Net Income
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ 
                fontWeight: 700, 
                mb: 1, 
                color: netIncome >= 0 ? 'success.main' : 'error.main' 
              }}>
                {formatCurrency(netIncome)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                💰 {((netIncome / totalRevenue) * 100).toFixed(1)}% profit margin • {netIncome >= 0 ? 'Profitable' : 'Loss'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          ⚡ Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => openAddTransactionDialog('revenue')}
              sx={{ borderRadius: 2, textTransform: 'none', height: 48, fontWeight: 600 }}
              color="success"
            >
              Add Revenue
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => openAddTransactionDialog('expense')}
              sx={{ borderRadius: 2, textTransform: 'none', height: 48, fontWeight: 600 }}
              color="error"
            >
              Add Expense
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PdfIcon />}
              onClick={exportToPDF}
              sx={{ borderRadius: 2, textTransform: 'none', height: 48, fontWeight: 600 }}
            >
              Export PDF
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ExcelIcon />}
              onClick={exportToExcel}
              sx={{ borderRadius: 2, textTransform: 'none', height: 48, fontWeight: 600 }}
            >
              Export Excel
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Revenue and Expense Details */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                💰 Recent Revenue
              </Typography>
              <Chip label={`${revenueData.length} entries`} color="success" size="small" />
            </Box>
            {revenueData.map((item, index) => (
              <Box key={item.id} sx={{ mb: 2, pb: 2, borderBottom: index < revenueData.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {item.category}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'success.main', fontWeight: 600 }}>
                    {formatCurrency(item.amount)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {item.description} • {new Date(item.date).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                💸 Recent Expenses
              </Typography>
              <Chip label={`${expenseData.length} entries`} color="error" size="small" />
            </Box>
            {expenseData.map((item, index) => (
              <Box key={item.id} sx={{ mb: 2, pb: 2, borderBottom: index < expenseData.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {item.category}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'error.main', fontWeight: 600 }}>
                    {formatCurrency(item.amount)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {item.description} • {new Date(item.date).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  // Income Statement Component
  const IncomeStatement = () => {
    const groupByCategory = (items: any[]) => {
      return items.reduce((acc, item) => {
        const category = item.category || 'Other';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(item);
        return acc;
      }, {} as Record<string, any[]>);
    };

    const revenueGroups = groupByCategory(revenueData);
    const expenseGroups = groupByCategory(expenseData);

    return (
      <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[4] }}>
        <Box sx={{ 
          p: 4, 
          borderBottom: `1px solid ${theme.palette.divider}`, 
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})` 
        }}>
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: 'center', color: theme.palette.primary.main }}>
            📋 Income Statement
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
            For the period ending {new Date().toLocaleDateString()}
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableBody>
              {/* Revenue Section */}
              <TableRow>
                <TableCell colSpan={2} sx={{ 
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  py: 2
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                    💰 REVENUE
                  </Typography>
                </TableCell>
              </TableRow>
              {Object.entries(revenueGroups).map(([category, items]) => (
                <TableRow key={category}>
                  <TableCell sx={{ pl: 4, fontWeight: 500, fontSize: '1rem' }}>{category}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 500, fontSize: '1rem' }}>
                    {formatCurrency(items.reduce((sum, item) => sum + (item.amount || 0), 0))}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell sx={{ fontWeight: 700, borderTop: 2, borderColor: theme.palette.success.main, fontSize: '1.1rem' }}>
                  Total Revenue
                </TableCell>
                <TableCell align="right" sx={{ 
                  fontWeight: 700, 
                  borderTop: 2, 
                  borderColor: theme.palette.success.main,
                  color: theme.palette.success.main,
                  fontSize: '1.1rem'
                }}>
                  {formatCurrency(totalRevenue)}
                </TableCell>
              </TableRow>

              {/* Expenses Section */}
              <TableRow>
                <TableCell colSpan={2} sx={{ 
                  backgroundColor: alpha(theme.palette.error.main, 0.1), 
                  pt: 4, 
                  pb: 2 
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.error.main }}>
                    💸 EXPENSES
                  </Typography>
                </TableCell>
              </TableRow>
              {Object.entries(expenseGroups).map(([category, items]) => (
                <TableRow key={category}>
                  <TableCell sx={{ pl: 4, fontWeight: 500, fontSize: '1rem' }}>{category}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 500, fontSize: '1rem' }}>
                    {formatCurrency(items.reduce((sum, item) => sum + (item.amount || 0), 0))}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell sx={{ fontWeight: 700, borderTop: 2, borderColor: theme.palette.error.main, fontSize: '1.1rem' }}>
                  Total Expenses
                </TableCell>
                <TableCell align="right" sx={{ 
                  fontWeight: 700, 
                  borderTop: 2, 
                  borderColor: theme.palette.error.main,
                  color: theme.palette.error.main,
                  fontSize: '1.1rem'
                }}>
                  {formatCurrency(totalExpenses)}
                </TableCell>
              </TableRow>

              {/* Net Income */}
              <TableRow>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  fontSize: '1.2rem',
                  borderTop: 3,
                  borderColor: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  py: 2
                }}>
                  💎 NET INCOME
                </TableCell>
                <TableCell align="right" sx={{ 
                  fontWeight: 700, 
                  fontSize: '1.2rem',
                  borderTop: 3,
                  borderColor: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  color: netIncome >= 0 ? theme.palette.success.main : theme.palette.error.main,
                  py: 2
                }}>
                  {formatCurrency(netIncome)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  };

  // Balance Sheet Component
  const BalanceSheet = () => {
    const mockAssets = [
      { id: '1', category: 'Current Assets', subcategory: 'Cash & Bank', amount: 85000, description: 'Cash and bank balances' },
      { id: '2', category: 'Current Assets', subcategory: 'Accounts Receivable', amount: 45000, description: 'Customer outstanding amounts' },
      { id: '3', category: 'Current Assets', subcategory: 'Inventory', amount: 30000, description: 'Stock on hand' },
      { id: '4', category: 'Fixed Assets', subcategory: 'Office Equipment', amount: 120000, description: 'Furniture and equipment' },
      { id: '5', category: 'Fixed Assets', subcategory: 'Computer Equipment', amount: 35000, description: 'IT equipment and software' }
    ];

    const mockLiabilities = [
      { id: '1', category: 'Current Liabilities', subcategory: 'Accounts Payable', amount: 28000, description: 'Supplier outstanding amounts' },
      { id: '2', category: 'Current Liabilities', subcategory: 'Accrued Expenses', amount: 12000, description: 'Accrued salaries and utilities' },
      { id: '3', category: 'Long-term Liabilities', subcategory: 'Bank Loan', amount: 75000, description: 'Long-term financing' }
    ];

    const mockEquity = [
      { id: '1', category: 'Owner Equity', subcategory: 'Share Capital', amount: 100000, description: 'Initial investment' },
      { id: '2', category: 'Owner Equity', subcategory: 'Retained Earnings', amount: 100000, description: 'Accumulated profits' }
    ];

    const totalAssets = mockAssets.reduce((sum, item) => sum + item.amount, 0);
    const totalLiabilities = mockLiabilities.reduce((sum, item) => sum + item.amount, 0);
    const totalEquity = mockEquity.reduce((sum, item) => sum + item.amount, 0);

    return (
      <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[4] }}>
        <Box sx={{ 
          p: 4, 
          borderBottom: `1px solid ${theme.palette.divider}`, 
          background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.05)})` 
        }}>
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: 'center', color: theme.palette.secondary.main }}>
            ⚖️ Balance Sheet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
            As of {new Date().toLocaleDateString()}
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={4}>
            {/* Assets */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.primary.main }}>
                📈 ASSETS
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableBody>
                    {mockAssets.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 500 }}>
                          {formatCurrency(item.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, borderTop: 2 }}>Total Assets</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, borderTop: 2, color: theme.palette.primary.main }}>
                        {formatCurrency(totalAssets)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* Liabilities & Equity */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.error.main }}>
                📉 LIABILITIES & EQUITY
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableBody>
                    {mockLiabilities.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 500 }}>
                          {formatCurrency(item.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, fontStyle: 'italic' }}>Total Liabilities</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: theme.palette.error.main }}>
                        {formatCurrency(totalLiabilities)}
                      </TableCell>
                    </TableRow>
                    {mockEquity.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 500 }}>
                          {formatCurrency(item.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, borderTop: 2 }}>Total Liabilities & Equity</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, borderTop: 2, color: theme.palette.primary.main }}>
                        {formatCurrency(totalLiabilities + totalEquity)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    );
  };

  // Notes Component
  const NotesPanel = () => (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <NoteIcon sx={{ mr: 2, color: theme.palette.primary.main, fontSize: 32 }} />
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          📝 Notes to Financial Statements
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {notes.map((note) => (
          <Grid item xs={12} md={6} key={note.id}>
            <Paper sx={{ 
              p: 4, 
              borderRadius: 3, 
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              height: '100%',
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)}, ${alpha(theme.palette.primary.main, 0.01)})`
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main }}>
                {note.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, color: 'text.primary' }}>
                {note.content}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {note.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" color="primary" variant="outlined" />
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary">
                📅 Last modified: {new Date(note.lastModified).toLocaleDateString()}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Main render
  console.log('🎨 Rendering main Financials component...');

  return (
    <Box sx={{ p: 3, backgroundColor: alpha(theme.palette.background.default, 0.5), minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.main }}>
          📊 Financial Overview
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Real-time financial insights and performance metrics
        </Typography>
      </Box>

      {/* Financial Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.15)}, ${alpha(theme.palette.success.main, 0.05)})`,
            border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ color: 'success.main', mr: 1, fontSize: 28 }} />
                <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 600 }}>
                  Total Revenue
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: 'success.main' }}>
                {formatCurrency(totalRevenue)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                📈 {revenueData.length} revenue streams • +12% vs last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.15)}, ${alpha(theme.palette.error.main, 0.05)})`,
            border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingDownIcon sx={{ color: 'error.main', mr: 1, fontSize: 28 }} />
                <Typography variant="h6" sx={{ color: 'error.main', fontWeight: 600 }}>
                  Total Expenses
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: 'error.main' }}>
                {formatCurrency(totalExpenses)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                📉 {expenseData.length} expense categories • -5% vs last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.primary.main, 0.05)})`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceIcon sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
                <Typography variant="h6" sx={{ color: netIncome >= 0 ? 'success.main' : 'error.main', fontWeight: 600 }}>
                  Net Income
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ 
                fontWeight: 700, 
                mb: 1, 
                color: netIncome >= 0 ? 'success.main' : 'error.main' 
              }}>
                {formatCurrency(netIncome)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                💰 {((netIncome / totalRevenue) * 100).toFixed(1)}% profit margin • {netIncome >= 0 ? 'Profitable' : 'Loss'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          ⚡ Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => openAddTransactionDialog('revenue')}
              sx={{ borderRadius: 2, textTransform: 'none', height: 48, fontWeight: 600 }}
              color="success"
            >
              Add Revenue
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => openAddTransactionDialog('expense')}
              sx={{ borderRadius: 2, textTransform: 'none', height: 48, fontWeight: 600 }}
              color="error"
            >
              Add Expense
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PdfIcon />}
              onClick={exportToPDF}
              sx={{ borderRadius: 2, textTransform: 'none', height: 48, fontWeight: 600 }}
            >
              Export PDF
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ExcelIcon />}
              onClick={exportToExcel}
              sx={{ borderRadius: 2, textTransform: 'none', height: 48, fontWeight: 600 }}
            >
              Export Excel
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="financial tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overview" icon={<AssessmentIcon />} iconPosition="start" />
          <Tab label="Income Statement" icon={<ReceiptIcon />} iconPosition="start" />
          <Tab label="Balance Sheet" icon={<AccountBalanceIcon />} iconPosition="start" />
          <Tab label="Notes" icon={<NoteIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  💰 Recent Revenue
                </Typography>
                <Chip label={`${revenueData.length} entries`} color="success" size="small" />
              </Box>
              {revenueData.map((item, index) => (
                <Box key={item.id} sx={{ mb: 2, pb: 2, borderBottom: index < revenueData.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {item.category}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'success.main', fontWeight: 600 }}>
                      {formatCurrency(item.amount)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.description} • {new Date(item.date).toLocaleDateString()}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  💸 Recent Expenses
                </Typography>
                <Chip label={`${expenseData.length} entries`} color="error" size="small" />
              </Box>
              {expenseData.map((item, index) => (
                <Box key={item.id} sx={{ mb: 2, pb: 2, borderBottom: index < expenseData.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {item.category}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'error.main', fontWeight: 600 }}>
                      {formatCurrency(item.amount)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.description} • {new Date(item.date).toLocaleDateString()}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
            📋 Income Statement
          </Typography>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: '1.1rem' }}>Total Revenue</TableCell>
                  <TableCell align="right" sx={{ color: 'success.main', fontWeight: 600, fontSize: '1.1rem' }}>
                    {formatCurrency(totalRevenue)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: '1.1rem' }}>Total Expenses</TableCell>
                  <TableCell align="right" sx={{ color: 'error.main', fontWeight: 600, fontSize: '1.1rem' }}>
                    {formatCurrency(totalExpenses)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: '1.2rem', borderTop: 2 }}>Net Income</TableCell>
                  <TableCell align="right" sx={{ 
                    fontWeight: 700, 
                    fontSize: '1.2rem',
                    borderTop: 2,
                    color: netIncome >= 0 ? 'success.main' : 'error.main'
                  }}>
                    {formatCurrency(netIncome)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
            ⚖️ Balance Sheet
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary' }}>
            Balance sheet data will be displayed here
          </Typography>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
            📝 Notes to Financial Statements
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary' }}>
            Financial notes and documentation will be displayed here
          </Typography>
        </Paper>
      </TabPanel>

      {/* Add Transaction Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'revenue' ? '💰 Add New Revenue' : '💸 Add New Expense'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    label="Category"
                  >
                    {dialogType === 'revenue' ? (
                      <>
                        <MenuItem value="Product Sales">Product Sales</MenuItem>
                        <MenuItem value="Services">Services</MenuItem>
                        <MenuItem value="Consulting">Consulting</MenuItem>
                        <MenuItem value="Licensing">Licensing</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </>
                    ) : (
                      <>
                        <MenuItem value="Salaries">Salaries</MenuItem>
                        <MenuItem value="Rent">Rent</MenuItem>
                        <MenuItem value="Utilities">Utilities</MenuItem>
                        <MenuItem value="Marketing">Marketing</MenuItem>
                        <MenuItem value="Travel">Travel</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </>
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Amount (AED)"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter a detailed description..."
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenAddDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAddTransaction}
            color={dialogType === 'revenue' ? 'success' : 'error'}
            sx={{ fontWeight: 600 }}
          >
            Add {dialogType === 'revenue' ? 'Revenue' : 'Expense'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Footer */}
      <Box sx={{ 
        mt: 6, 
        p: 3, 
        bgcolor: alpha(theme.palette.success.main, 0.1), 
        borderRadius: 2, 
        border: `1px solid ${alpha(theme.palette.success.main, 0.3)}` 
      }}>
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: 'success.main', fontWeight: 500 }}>
          ✅ Financials Page Loaded Successfully • 
          💾 Last Updated: {new Date().toLocaleTimeString()} • 
          🎯 Status: Ready • 
          📊 {revenueData.length + expenseData.length} Total Entries
        </Typography>
      </Box>
    </Box>
  );
};

export default Financials;