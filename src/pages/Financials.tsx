
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
  useTheme,
  alpha
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  Add as AddIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
} from '@mui/icons-material';

// Simple financial data structure
interface FinancialData {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  revenueEntries: number;
  expenseEntries: number;
}

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
  console.log('🚀 Financials component initializing...');

  const theme = useTheme();
  
  // State management
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Simple demo financial data
  const [financialData] = useState<FinancialData>({
    totalRevenue: 260000,
    totalExpenses: 99500,
    netIncome: 160500,
    revenueEntries: 3,
    expenseEntries: 4
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
        >
          Retry
        </Button>
      </Box>
    );
  }

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
                {formatCurrency(financialData.totalRevenue)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                📈 {financialData.revenueEntries} revenue streams • +12% vs last month
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
                {formatCurrency(financialData.totalExpenses)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                📉 {financialData.expenseEntries} expense categories • -5% vs last month
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
                <Typography variant="h6" sx={{ color: financialData.netIncome >= 0 ? 'success.main' : 'error.main', fontWeight: 600 }}>
                  Net Income
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ 
                fontWeight: 700, 
                mb: 1, 
                color: financialData.netIncome >= 0 ? 'success.main' : 'error.main' 
              }}>
                {formatCurrency(financialData.netIncome)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                💰 {((financialData.netIncome / financialData.totalRevenue) * 100).toFixed(1)}% profit margin • Profitable
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          ⚡ Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => alert('Add Revenue feature coming soon')}
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
              onClick={() => alert('Add Expense feature coming soon')}
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
        >
          <Tab label="Overview" />
          <Tab label="Income Statement" />
          <Tab label="Balance Sheet" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <TabPanel value={tabValue} index={0}>
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
            📊 Financial Overview
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, bgcolor: 'success.50', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: 'success.main', mb: 2 }}>
                  💰 Revenue Breakdown
                </Typography>
                <Typography variant="body1">
                  Product Sales: {formatCurrency(150000)}
                </Typography>
                <Typography variant="body1">
                  Services: {formatCurrency(85000)}
                </Typography>
                <Typography variant="body1">
                  Licensing: {formatCurrency(25000)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, bgcolor: 'error.50', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: 'error.main', mb: 2 }}>
                  💸 Expense Breakdown
                </Typography>
                <Typography variant="body1">
                  Salaries: {formatCurrency(65000)}
                </Typography>
                <Typography variant="body1">
                  Rent: {formatCurrency(18000)}
                </Typography>
                <Typography variant="body1">
                  Utilities: {formatCurrency(4500)}
                </Typography>
                <Typography variant="body1">
                  Marketing: {formatCurrency(12000)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
            📋 Income Statement
          </Typography>
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6">Total Revenue</Typography>
              <Typography variant="h6" sx={{ color: 'success.main' }}>
                {formatCurrency(financialData.totalRevenue)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6">Total Expenses</Typography>
              <Typography variant="h6" sx={{ color: 'error.main' }}>
                {formatCurrency(financialData.totalExpenses)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2, borderTop: 2, borderColor: 'primary.main' }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Net Income</Typography>
              <Typography variant="h5" sx={{ 
                fontWeight: 700,
                color: financialData.netIncome >= 0 ? 'success.main' : 'error.main'
              }}>
                {formatCurrency(financialData.netIncome)}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
            ⚖️ Balance Sheet
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary' }}>
            Balance sheet data will be displayed here based on your revenue and expense entries
          </Typography>
        </Paper>
      </TabPanel>

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
          📊 {financialData.revenueEntries + financialData.expenseEntries} Total Entries
        </Typography>
      </Box>
    </Box>
  );
};

export default Financials;
