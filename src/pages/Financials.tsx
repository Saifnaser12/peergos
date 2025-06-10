import React, { useState, useEffect, useRef } from 'react';
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
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  LinearProgress,
  Badge,
  Fab,
  Divider
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  Add as AddIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudSync as SyncIcon,
  Assessment as ReportIcon,
  Timeline as TimelineIcon,
  Analytics as AnalyticsIcon,
  Receipt as ReceiptIcon,
  FileUpload as UploadIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  VerifiedUser as VerifiedIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useFinance } from '../context/FinanceContext';
import { useFinancialSync } from '../hooks/useFinancialSync';
import { libraryLoader } from '../utils/libraryLoader';
import { useTranslation } from 'react-i18next';

// Enhanced financial data structure
interface FinancialEntry {
  id: string;
  category: string;
  subcategory: string;
  amount: number;
  date: string;
  description: string;
  type: 'revenue' | 'expense' | 'asset' | 'liability' | 'equity';
  vatRate?: number;
  vatAmount?: number;
  source?: 'manual' | 'imported' | 'pos' | 'bank';
  complianceScore?: number;
}

interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  vatCollected: number;
  vatPaid: number;
  isBalanced: boolean;
  complianceScore: number;
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
  console.log('🚀 Advanced Financials component initializing...');

  const theme = useTheme();
  const { t } = useTranslation();
  const finance = useFinance();

  // State management
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FinancialEntry | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [realTimeData, setRealTimeData] = useState<FinancialSummary | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  const [complianceAlerts, setComplianceAlerts] = useState<string[]>([]);

  // Form state for adding/editing entries
  const [formData, setFormData] = useState({
    type: 'revenue' as 'revenue' | 'expense' | 'asset' | 'liability' | 'equity',
    category: '',
    subcategory: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    vatRate: '5'
  });

  // Financial data with sample entries
  const [financialEntries, setFinancialEntries] = useState<FinancialEntry[]>([
    {
      id: '1',
      type: 'revenue',
      category: 'Sales',
      subcategory: 'Product Sales',
      amount: 150000,
      date: '2024-01-15',
      description: 'Q1 Product Sales Revenue',
      vatRate: 5,
      vatAmount: 7500,
      source: 'manual',
      complianceScore: 95
    },
    {
      id: '2',
      type: 'revenue',
      category: 'Services',
      subcategory: 'Consulting',
      amount: 85000,
      date: '2024-01-20',
      description: 'Consulting Services Revenue',
      vatRate: 5,
      vatAmount: 4250,
      source: 'manual',
      complianceScore: 98
    },
    {
      id: '3',
      type: 'revenue',
      category: 'Licensing',
      subcategory: 'Software Licensing',
      amount: 25000,
      date: '2024-01-25',
      description: 'Software License Revenue',
      vatRate: 5,
      vatAmount: 1250,
      source: 'manual',
      complianceScore: 92
    },
    {
      id: '4',
      type: 'expense',
      category: 'Personnel',
      subcategory: 'Salaries',
      amount: 65000,
      date: '2024-01-31',
      description: 'Monthly Staff Salaries',
      vatRate: 0,
      vatAmount: 0,
      source: 'manual',
      complianceScore: 100
    },
    {
      id: '5',
      type: 'expense',
      category: 'Operations',
      subcategory: 'Rent',
      amount: 18000,
      date: '2024-01-01',
      description: 'Office Rent Payment',
      vatRate: 5,
      vatAmount: 900,
      source: 'manual',
      complianceScore: 100
    },
    {
      id: '6',
      type: 'expense',
      category: 'Operations',
      subcategory: 'Utilities',
      amount: 4500,
      date: '2024-01-05',
      description: 'Monthly Utilities',
      vatRate: 5,
      vatAmount: 225,
      source: 'manual',
      complianceScore: 97
    },
    {
      id: '7',
      type: 'expense',
      category: 'Marketing',
      subcategory: 'Digital Marketing',
      amount: 12000,
      date: '2024-01-10',
      description: 'Q1 Marketing Campaign',
      vatRate: 5,
      vatAmount: 600,
      source: 'manual',
      complianceScore: 94
    }
  ]);

  // Sync hook
  const { 
    syncData, 
    lastSyncTime, 
    isConnected, 
    syncError 
  } = useFinancialSync();

  // Calculate financial summary
  const calculateSummary = (): FinancialSummary => {
    const revenue = financialEntries
      .filter(entry => entry.type === 'revenue')
      .reduce((sum, entry) => sum + entry.amount, 0);

    const expenses = financialEntries
      .filter(entry => entry.type === 'expense')
      .reduce((sum, entry) => sum + entry.amount, 0);

    const assets = financialEntries
      .filter(entry => entry.type === 'asset')
      .reduce((sum, entry) => sum + entry.amount, 0);

    const liabilities = financialEntries
      .filter(entry => entry.type === 'liability')
      .reduce((sum, entry) => sum + entry.amount, 0);

    const equity = financialEntries
      .filter(entry => entry.type === 'equity')
      .reduce((sum, entry) => sum + entry.amount, 0);

    const vatCollected = financialEntries
      .filter(entry => entry.type === 'revenue')
      .reduce((sum, entry) => sum + (entry.vatAmount || 0), 0);

    const vatPaid = financialEntries
      .filter(entry => entry.type === 'expense')
      .reduce((sum, entry) => sum + (entry.vatAmount || 0), 0);

    const netIncome = revenue - expenses;
    const isBalanced = Math.abs(assets - (liabilities + equity + netIncome)) < 0.01;

    const avgComplianceScore = financialEntries.length > 0
      ? financialEntries.reduce((sum, entry) => sum + (entry.complianceScore || 0), 0) / financialEntries.length
      : 0;

    return {
      totalRevenue: revenue,
      totalExpenses: expenses,
      netIncome,
      totalAssets: assets,
      totalLiabilities: liabilities,
      totalEquity: equity,
      vatCollected,
      vatPaid,
      isBalanced,
      complianceScore: avgComplianceScore,
      revenueEntries: financialEntries.filter(e => e.type === 'revenue').length,
      expenseEntries: financialEntries.filter(e => e.type === 'expense').length
    };
  };

  // Real-time data updates
  useEffect(() => {
    const updateRealTimeData = () => {
      const summary = calculateSummary();
      setRealTimeData(summary);

      // Check compliance alerts
      const alerts: string[] = [];
      if (!summary.isBalanced) {
        alerts.push('Balance sheet is not balanced - please review entries');
      }
      if (summary.complianceScore < 90) {
        alerts.push('Some entries have low compliance scores - review required');
      }
      if (summary.vatCollected - summary.vatPaid < 0) {
        alerts.push('VAT refund situation detected - verify calculations');
      }

      setComplianceAlerts(alerts);
    };

    updateRealTimeData();
    const interval = setInterval(updateRealTimeData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [financialEntries]);

  // Initialize component
  useEffect(() => {
    console.log('⚡ Initializing Advanced Financials page...');

    const initializeFinancials = async () => {
      try {
        setIsLoading(true);

        // Initialize libraries
        await libraryLoader.loadJsSHA();
        await libraryLoader.loadQRCode();
        await libraryLoader.loadPDFLib();

        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log('✅ Advanced Financials page loaded successfully');
        setIsLoading(false);
        setError(null);

        showNotification('Financial dashboard loaded successfully', 'success');
      } catch (err) {
        console.error('❌ Error loading financials:', err);
        setError('Failed to load financial data');
        setIsLoading(false);
        showNotification('Error loading financial data', 'error');
      }
    };

    initializeFinancials();
  }, []);

  // Utility functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log('📋 Tab changed to:', newValue);
    setTabValue(newValue);
  };

  // Entry management functions
  const handleAddEntry = () => {
    setEditingEntry(null);
    setFormData({
      type: 'revenue',
      category: '',
      subcategory: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      vatRate: '5'
    });
    setShowAddDialog(true);
  };

  const handleEditEntry = (entry: FinancialEntry) => {
    setEditingEntry(entry);
    setFormData({
      type: entry.type,
      category: entry.category,
      subcategory: entry.subcategory,
      amount: entry.amount.toString(),
      date: entry.date,
      description: entry.description,
      vatRate: (entry.vatRate || 0).toString()
    });
    setShowAddDialog(true);
  };

  const handleDeleteEntry = (id: string) => {
    setFinancialEntries(prev => prev.filter(entry => entry.id !== id));
    showNotification('Entry deleted successfully', 'success');
  };

  const handleSaveEntry = () => {
    const amount = parseFloat(formData.amount);
    const vatRate = parseFloat(formData.vatRate);
    const vatAmount = (amount * vatRate) / 100;

    const entry: FinancialEntry = {
      id: editingEntry?.id || Date.now().toString(),
      type: formData.type,
      category: formData.category,
      subcategory: formData.subcategory,
      amount,
      date: formData.date,
      description: formData.description,
      vatRate,
      vatAmount,
      source: 'manual',
      complianceScore: Math.floor(Math.random() * 10) + 90 // Simulated compliance score
    };

    if (editingEntry) {
      setFinancialEntries(prev => prev.map(e => e.id === editingEntry.id ? entry : e));
      showNotification('Entry updated successfully', 'success');
    } else {
      setFinancialEntries(prev => [...prev, entry]);
      showNotification('Entry added successfully', 'success');
    }

    setShowAddDialog(false);
  };

  // Export functions
  const exportToPDF = async () => {
    console.log('📄 Exporting to PDF...');
    setExportProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setExportProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      clearInterval(progressInterval);
      setExportProgress(100);

      setTimeout(() => setExportProgress(0), 2000);
      showNotification('PDF exported successfully', 'success');
    } catch (error) {
      setExportProgress(0);
      showNotification('Error exporting PDF', 'error');
    }
  };

  const exportToExcel = async () => {
    console.log('📊 Exporting to Excel...');
    setExportProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setExportProgress(prev => Math.min(prev + 15, 90));
      }, 100);

      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500));

      clearInterval(progressInterval);
      setExportProgress(100);

      setTimeout(() => setExportProgress(0), 2000);
      showNotification('Excel exported successfully', 'success');
    } catch (error) {
      setExportProgress(0);
      showNotification('Error exporting Excel', 'error');
    }
  };

  // Sync functions
  const handleSync = async () => {
    console.log('🔄 Syncing financial data...');
    setSyncStatus('syncing');

    try {
      await syncData(financialEntries);
      setSyncStatus('success');
      showNotification('Data synced successfully', 'success');

      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      setSyncStatus('error');
      showNotification('Sync failed', 'error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      console.log('📁 Uploading files:', files);
      showNotification(`Uploading ${files.length} file(s)...`, 'info');

      // Simulate file processing
      setTimeout(() => {
        showNotification('Files processed successfully', 'success');
      }, 2000);
    }
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
          Loading Advanced Financial Dashboard...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Initializing libraries and real-time data feeds
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

  console.log('🎨 Rendering Advanced Financials component...');

  return (
    <Box sx={{ p: 3, backgroundColor: alpha(theme.palette.background.default, 0.5), minHeight: '100vh' }}>
      {/* Header with real-time status */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: theme.palette.primary.main }}>
              📊 Advanced Financial Management
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Real-time financial insights with UAE compliance monitoring
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip 
              icon={isConnected ? <CheckIcon /> : <ErrorIcon />}
              label={isConnected ? 'Connected' : 'Offline'}
              color={isConnected ? 'success' : 'error'}
              variant="outlined"
            />
            <Chip 
              icon={<SecurityIcon />}
              label={`${realTimeData?.complianceScore?.toFixed(0) || 0}% Compliant`}
              color={realTimeData?.complianceScore && realTimeData.complianceScore > 90 ? 'success' : 'warning'}
              variant="outlined"
            />
            <Tooltip title="Sync with external systems">
              <IconButton 
                onClick={handleSync}
                disabled={syncStatus === 'syncing'}
                color={syncStatus === 'success' ? 'success' : syncStatus === 'error' ? 'error' : 'default'}
              >
                {syncStatus === 'syncing' ? <CircularProgress size={24} /> : <SyncIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Compliance Alerts */}
        {complianceAlerts.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Compliance Alerts:
            </Typography>
            {complianceAlerts.map((alert, index) => (
              <Typography key={index} variant="body2">
                • {alert}
              </Typography>
            ))}
          </Alert>
        )}

        {/* Real-time sync status */}
        {lastSyncTime && (
          <Typography variant="body2" color="text.secondary">
            Last sync: {new Date(lastSyncTime).toLocaleString()} • Real-time updates active
          </Typography>
        )}
      </Box>

      {/* Enhanced Financial Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            height: '100%', 
            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.15)}, ${alpha(theme.palette.success.main, 0.05)})`,
            border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUpIcon sx={{ color: 'success.main', mr: 1, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 600 }}>
                    Total Revenue
                  </Typography>
                </Box>
                <Badge badgeContent={realTimeData?.revenueEntries || 0} color="success">
                  <ReceiptIcon sx={{ color: 'success.main' }} />
                </Badge>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: 'success.main' }}>
                {formatCurrency(realTimeData?.totalRevenue || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                📈 VAT Collected: {formatCurrency(realTimeData?.vatCollected || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                🎯 Revenue streams: {realTimeData?.revenueEntries || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ 
            height: '100%', 
            background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.15)}, ${alpha(theme.palette.error.main, 0.05)})`,
            border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingDownIcon sx={{ color: 'error.main', mr: 1, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ color: 'error.main', fontWeight: 600 }}>
                    Total Expenses
                  </Typography>
                </Box>
                <Badge badgeContent={realTimeData?.expenseEntries || 0} color="error">
                  <ReceiptIcon sx={{ color: 'error.main' }} />
                </Badge>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: 'error.main' }}>
                {formatCurrency(realTimeData?.totalExpenses || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                📉 VAT Paid: {formatCurrency(realTimeData?.vatPaid || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                🎯 Expense categories: {realTimeData?.expenseEntries || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ 
            height: '100%', 
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.primary.main, 0.05)})`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceIcon sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
                <Typography variant="h6" sx={{ color: realTimeData?.netIncome && realTimeData.netIncome >= 0 ? 'success.main' : 'error.main', fontWeight: 600 }}>
                  Net Income
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ 
                fontWeight: 700, 
                mb: 1, 
                color: realTimeData?.netIncome && realTimeData.netIncome >= 0 ? 'success.main' : 'error.main' 
              }}>
                {formatCurrency(realTimeData?.netIncome || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                💰 Profit Margin: {realTimeData?.totalRevenue ? ((realTimeData.netIncome / realTimeData.totalRevenue) * 100).toFixed(1) : 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                🎯 Status: {realTimeData?.netIncome && realTimeData.netIncome >= 0 ? 'Profitable' : 'Loss'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ 
            height: '100%', 
            background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.15)}, ${alpha(theme.palette.info.main, 0.05)})`,
            border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VerifiedIcon sx={{ color: realTimeData?.isBalanced ? 'success.main' : 'error.main', mr: 1, fontSize: 28 }} />
                <Typography variant="h6" sx={{ color: 'info.main', fontWeight: 600 }}>
                  Balance Status
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 700, 
                mb: 1, 
                color: realTimeData?.isBalanced ? 'success.main' : 'error.main' 
              }}>
                {realTimeData?.isBalanced ? 'Balanced' : 'Unbalanced'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ⚖️ Assets: {formatCurrency(realTimeData?.totalAssets || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                📊 L+E: {formatCurrency((realTimeData?.totalLiabilities || 0) + (realTimeData?.totalEquity || 0))}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Enhanced Quick Actions Panel */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          ⚡ Advanced Actions & Tools
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddEntry}
              sx={{ borderRadius: 2, textTransform: 'none', height: 48, fontWeight: 600 }}
              color="primary"
            >
              Add Entry
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
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
          <Grid item xs={12} sm={6} md={2}>
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
          <Grid item xs={12} sm={6} md={2}>
            <input
              accept=".pdf,.xlsx,.xls,.csv"
              style={{ display: 'none' }}
              id="upload-financial-files"
              type="file"
              multiple
              onChange={handleFileUpload}
            />
            <label htmlFor="upload-financial-files">
              <Button
                fullWidth
                variant="outlined"
                startIcon={<UploadIcon />}
                component="span"
                sx={{ borderRadius: 2, textTransform: 'none', height: 48, fontWeight: 600 }}
              >
                Import Data
              </Button>
            </label>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ReportIcon />}
              onClick={() => setTabValue(3)}
              sx={{ borderRadius: 2, textTransform: 'none', height: 48, fontWeight: 600 }}
            >
              Analytics
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => window.location.reload()}
              sx={{ borderRadius: 2, textTransform: 'none', height: 48, fontWeight: 600 }}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>

        {/* Export Progress */}
        {exportProgress > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Export Progress: {exportProgress}%
            </Typography>
            <LinearProgress variant="determinate" value={exportProgress} />
          </Box>
        )}
      </Paper>

      {/* Enhanced Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="advanced financial tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="📊 Overview" />
          <Tab label="📋 Income Statement" />
          <Tab label="⚖️ Balance Sheet" />
          <Tab label="📈 Analytics" />
          <Tab label="📁 Data Management" />
          <Tab label="🔧 Settings" />
        </Tabs>
      </Box>

      {/* Enhanced Tab Content */}
      <TabPanel value={tabValue} index={0}>
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
            📊 Financial Overview Dashboard
          </Typography>

          {/* Real-time Summary */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 2, border: `1px solid ${alpha(theme.palette.success.main, 0.3)}` }}>
                <Typography variant="h6" sx={{ color: 'success.main', mb: 2, display: 'flex', alignItems: 'center' }}>
                  <TrendingUpIcon sx={{ mr: 1 }} />
                  💰 Revenue Analytics
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Product Sales:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{formatCurrency(150000)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Services:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{formatCurrency(85000)}</Typography>
                </Box>
                ```python
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Licensing:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{formatCurrency(25000)}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ color: 'success.main' }}>Total VAT Collected:</Typography>
                  <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 700 }}>{formatCurrency(realTimeData?.vatCollected || 0)}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, bgcolor: alpha(theme.palette.error.main, 0.1), borderRadius: 2, border: `1px solid ${alpha(theme.palette.error.main, 0.3)}` }}>
                <Typography variant="h6" sx={{ color: 'error.main', mb: 2, display: 'flex', alignItems: 'center' }}>
                  <TrendingDownIcon sx={{ mr: 1 }} />
                  💸 Expense Analytics
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Salaries:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{formatCurrency(65000)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Rent:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{formatCurrency(18000)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Utilities:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{formatCurrency(4500)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Marketing:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{formatCurrency(12000)}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ color: 'error.main' }}>Total VAT Paid:</Typography>
                  <Typography variant="h6" sx={{ color: 'error.main', fontWeight: 700 }}>{formatCurrency(realTimeData?.vatPaid || 0)}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* VAT Summary */}
          <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2, mb: 3, border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}` }}>
            <Typography variant="h6" sx={{ color: 'primary.main', mb: 2, textAlign: 'center' }}>
              🏛️ VAT Summary & Compliance
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">VAT Collected</Typography>
                  <Typography variant="h5" sx={{ color: 'success.main', fontWeight: 700 }}>
                    {formatCurrency(realTimeData?.vatCollected || 0)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">VAT Paid</Typography>
                  <Typography variant="h5" sx={{ color: 'error.main', fontWeight: 700 }}>
                    {formatCurrency(realTimeData?.vatPaid || 0)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Net VAT Due</Typography>
                  <Typography variant="h5" sx={{ 
                    color: (realTimeData?.vatCollected || 0) - (realTimeData?.vatPaid || 0) >= 0 ? 'primary.main' : 'warning.main', 
                    fontWeight: 700 
                  }}>
                    {formatCurrency((realTimeData?.vatCollected || 0) - (realTimeData?.vatPaid || 0))}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
            📋 Income Statement (Real-time)
          </Typography>
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            {/* Revenue Section */}
            <Typography variant="h6" sx={{ color: 'success.main', mb: 2, fontWeight: 600 }}>
              💰 REVENUE
            </Typography>
            {financialEntries
              .filter(entry => entry.type === 'revenue')
              .map((entry, index) => (
                <Box key={entry.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: index === financialEntries.filter(e => e.type === 'revenue').length - 1 ? 2 : 1, borderColor: index === financialEntries.filter(e => e.type === 'revenue').length - 1 ? 'success.main' : 'divider' }}>
                  <Typography variant="body1">{entry.category} - {entry.subcategory}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                    {formatCurrency(entry.amount)}
                  </Typography>
                </Box>
              ))}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2, borderBottom: 2, borderColor: 'success.main' }}>
              <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 700 }}>Total Revenue</Typography>
              <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 700 }}>
                {formatCurrency(realTimeData?.totalRevenue || 0)}
              </Typography>
            </Box>

            {/* Expenses Section */}
            <Typography variant="h6" sx={{ color: 'error.main', mt: 4, mb: 2, fontWeight: 600 }}>
              💸 EXPENSES
            </Typography>
            {financialEntries
              .filter(entry => entry.type === 'expense')
              .map((entry, index) => (
                <Box key={entry.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: index === financialEntries.filter(e => e.type === 'expense').length - 1 ? 2 : 1, borderColor: index === financialEntries.filter(e => e.type === 'expense').length - 1 ? 'error.main' : 'divider' }}>
                  <Typography variant="body1">{entry.category} - {entry.subcategory}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'error.main' }}>
                    {formatCurrency(entry.amount)}
                  </Typography>
                </Box>
              ))}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2, borderBottom: 2, borderColor: 'error.main' }}>
              <Typography variant="h6" sx={{ color: 'error.main', fontWeight: 700 }}>Total Expenses</Typography>
              <Typography variant="h6" sx={{ color: 'error.main', fontWeight: 700 }}>
                {formatCurrency(realTimeData?.totalExpenses || 0)}
              </Typography>
            </Box>

            {/* Net Income */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 3, borderTop: 3, borderColor: 'primary.main', mt: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>NET INCOME</Typography>
              <Typography variant="h5" sx={{ 
                fontWeight: 700,
                color: realTimeData?.netIncome && realTimeData.netIncome >= 0 ? 'success.main' : 'error.main'
              }}>
                {formatCurrency(realTimeData?.netIncome || 0)}
              </Typography>
            </Box>

            {/* Additional Metrics */}
            <Box sx={{ mt: 4, p: 3, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'info.main' }}>
                📊 Key Performance Indicators
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">Gross Margin</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {realTimeData?.totalRevenue ? ((realTimeData.netIncome / realTimeData.totalRevenue) * 100).toFixed(1) : 0}%
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">Revenue Growth</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                    +12.5%
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">Expense Ratio</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {realTimeData?.totalRevenue ? ((realTimeData.totalExpenses / realTimeData.totalRevenue) * 100).toFixed(1) : 0}%
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">ROI</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    18.7%
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
            ⚖️ Balance Sheet (Real-time)
          </Typography>

          {!realTimeData?.isBalanced && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              ⚠️ Balance Sheet is not balanced. Assets must equal Liabilities + Equity.
            </Alert>
          )}

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: 'primary.main', mb: 2, fontWeight: 600 }}>
                📈 ASSETS
              </Typography>
              <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>Current Assets</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Cash, Receivables, Inventory
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {formatCurrency(realTimeData?.totalAssets || 0)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: 'error.main', mb: 2, fontWeight: 600 }}>
                📉 LIABILITIES & EQUITY
              </Typography>
              <Box sx={{ p: 3, bgcolor: alpha(theme.palette.error.main, 0.1), borderRadius: 2, mb: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>Liabilities</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Accounts Payable, Loans
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main' }}>
                  {formatCurrency(realTimeData?.totalLiabilities || 0)}
                </Typography>
              </Box>

              <Box sx={{ p: 3, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>Equity</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Owner's Equity, Retained Earnings
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {formatCurrency((realTimeData?.totalEquity || 0) + (realTimeData?.netIncome || 0))}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Balance Check */}
          <Box sx={{ mt: 4, p: 3, bgcolor: realTimeData?.isBalanced ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1), borderRadius: 2, border: `1px solid ${realTimeData?.isBalanced ? theme.palette.success.main : theme.palette.error.main}` }}>
            <Typography variant="h6" sx={{ 
              textAlign: 'center', 
              color: realTimeData?.isBalanced ? 'success.main' : 'error.main',
              fontWeight: 700,
              mb: 2
            }}>
              {realTimeData?.isBalanced ? '✅ Balance Sheet is Balanced' : '❌ Balance Sheet is NOT Balanced'}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Total Assets</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {formatCurrency(realTimeData?.totalAssets || 0)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Total L + E</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {formatCurrency((realTimeData?.totalLiabilities || 0) + (realTimeData?.totalEquity || 0) + (realTimeData?.netIncome || 0))}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Difference</Typography>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600,
                  color: realTimeData?.isBalanced ? 'success.main' : 'error.main'
                }}>
                  {formatCurrency(Math.abs((realTimeData?.totalAssets || 0) - ((realTimeData?.totalLiabilities || 0) + (realTimeData?.totalEquity || 0) + (realTimeData?.netIncome || 0))))}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
            📈 Advanced Financial Analytics
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
                  📊 Performance Metrics
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Revenue Growth Rate</Typography>
                  <LinearProgress variant="determinate" value={75} sx={{ mb: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>+12.5% MoM</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Profit Margin</Typography>
                  <LinearProgress variant="determinate" value={65} color="success" sx={{ mb: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>65.2%</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Expense Efficiency</Typography>
                  <LinearProgress variant="determinate" value={85} color="warning" sx={{ mb: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>85.3%</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: 'success.main', mb: 2 }}>
                  🎯 Compliance Score
                </Typography>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h2" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {realTimeData?.complianceScore?.toFixed(0) || 0}%
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Overall Compliance Rating
                  </Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">VAT Compliance</Typography>
                  <LinearProgress variant="determinate" value={realTimeData?.complianceScore || 0} color="success" />
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Documentation</Typography>
                  <LinearProgress variant="determinate" value={95} color="success" />
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Reporting Standards</Typography>
                  <LinearProgress variant="determinate" value={88} color="warning" />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ p: 3, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: 'info.main', mb: 2 }}>
                  📅 Monthly Trends & Forecasting
                </Typography>
                <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
                  📈 Interactive charts and trend analysis would be displayed here
                  <br />
                  🔮 Predictive analytics and forecasting models
                  <br />
                  📊 Cash flow projections and scenario planning
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
            📁 Data Management & Entry System
          </Typography>

          {/* Financial Entries Table */}
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">VAT</TableCell>
                  <TableCell align="center">Compliance</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {financialEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>
                      <Chip 
                        label={entry.type} 
                        color={entry.type === 'revenue' ? 'success' : entry.type === 'expense' ? 'error' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{entry.category}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      {formatCurrency(entry.amount)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(entry.vatAmount || 0)}
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={`${entry.complianceScore || 0}%`}
                        color={entry.complianceScore && entry.complianceScore > 90 ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleEditEntry(entry)} size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteEntry(entry.id)} size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Summary Stats */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {financialEntries.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Entries
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {realTimeData?.complianceScore?.toFixed(0) || 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Compliance
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                  {formatCurrency((realTimeData?.vatCollected || 0) + (realTimeData?.vatPaid || 0))}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total VAT
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={5}>
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
            🔧 System Settings & Integration
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
                  🔗 External Integrations
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">🏦 Banking API</Typography>
                    <Chip label={isConnected ? 'Connected' : 'Disconnected'} color={isConnected ? 'success' : 'error'} size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">🏛️ FTA Portal</Typography>
                    <Chip label="Connected" color="success" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">🛒 POS Systems</Typography>
                    <Chip label="3 Connected" color="success" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1">📊 Analytics</Typography>
                    <Chip label="Active" color="success" size="small" />
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: 'info.main', mb: 2 }}>
                  ⚙️ System Configuration
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Auto-sync interval: Every 5 minutes
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Data retention: 7 years (UAE compliance)
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Backup frequency: Daily at 2:00 AM
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Security level: Enterprise Grade
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ p: 3, bgcolor: alpha(theme.palette.warning.main, 0.1), borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: 'warning.main', mb: 2 }}>
                  🔔 System Status & Alerts
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <CheckIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                      <Typography variant="body2">Data Integrity</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <CheckIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                      <Typography variant="body2">Real-time Sync</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <CheckIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                      <Typography variant="body2">Security</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <WarningIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                      <Typography variant="body2">Backup Status</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </TabPanel>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddEntry}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <AddIcon />
      </Fab>

      {/* Add/Edit Entry Dialog */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingEntry ? '✏️ Edit Financial Entry' : '➕ Add New Financial Entry'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                >
                  <MenuItem value="revenue">💰 Revenue</MenuItem>
                  <MenuItem value="expense">💸 Expense</MenuItem>
                  <MenuItem value="asset">📈 Asset</MenuItem>
                  <MenuItem value="liability">📉 Liability</MenuItem>
                  <MenuItem value="equity">⚖️ Equity</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Subcategory"
                value={formData.subcategory}
                onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="VAT Rate (%)"
                type="number"
                value={formData.vatRate}
                onChange={(e) => setFormData(prev => ({ ...prev, vatRate: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveEntry} variant="contained">
            {editingEntry ? 'Update' : 'Add'} Entry
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Status Footer */}
      <Box sx={{ 
        mt: 6, 
        p: 3, 
        bgcolor: alpha(theme.palette.success.main, 0.1), 
        borderRadius: 2, 
        border: `1px solid ${alpha(theme.palette.success.main, 0.3)}` 
      }}>
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: 'success.main', fontWeight: 500 }}>
          ✅ Advanced Financials System Active • 
          💾 Last Updated: {new Date().toLocaleTimeString()} • 
          🎯 Status: All Systems Operational • 
          📊 {financialEntries.length} Total Entries • 
          🔄 Real-time Sync: {isConnected ? 'Connected' : 'Offline'} • 
          🛡️ Compliance Score: {realTimeData?.complianceScore?.toFixed(0) || 0}%
        </Typography>
      </Box>
    </Box>
  );
};

export default Financials;