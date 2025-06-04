
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
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Assessment as AssessmentIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Language as LanguageIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useTheme as useAppTheme } from '../context/ThemeContext';

// Types
interface FinancialEntry {
  id: string;
  category: string;
  subcategory: string;
  amount: number;
  date: string;
  description: string;
  type: 'revenue' | 'expense' | 'asset' | 'liability' | 'equity';
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

// Categories configuration
const CATEGORIES = {
  revenue: ['Product Sales', 'Services', 'Other Income'],
  expense: ['Salaries', 'Rent', 'Utilities', 'Depreciation', 'Other'],
  asset: ['Cash', 'Inventory', 'Receivables', 'Equipment'],
  liability: ['Payables', 'Loans', 'Guarantees'],
  equity: ['Owner Capital', 'Retained Earnings']
};

const Financials: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode, toggleTheme } = useAppTheme();
  const theme = useTheme();
  
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
      type: 'expense'
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

  const [openDialog, setOpenDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FinancialEntry | null>(null);
  const [newEntry, setNewEntry] = useState({
    category: '',
    subcategory: '',
    amount: 0,
    description: '',
    type: 'revenue' as const
  });

  // Calculate financial summary
  const calculateSummary = (): FinancialSummary => {
    const revenue = financialData
      .filter(item => item.type === 'revenue')
      .reduce((sum, item) => sum + item.amount, 0);

    const expenses = financialData
      .filter(item => item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0);

    const assets = financialData
      .filter(item => item.type === 'asset')
      .reduce((sum, item) => sum + item.amount, 0);

    const liabilities = financialData
      .filter(item => item.type === 'liability')
      .reduce((sum, item) => sum + item.amount, 0);

    const equity = financialData
      .filter(item => item.type === 'equity')
      .reduce((sum, item) => sum + item.amount, 0);

    const netIncome = revenue - expenses;
    const totalEquityWithRetained = equity + netIncome;
    const isBalanced = Math.abs(assets - (liabilities + totalEquityWithRetained)) < 0.01;

    return {
      totalRevenue: revenue,
      totalExpenses: expenses,
      netIncome,
      totalAssets: assets,
      totalLiabilities: liabilities,
      totalEquity: totalEquityWithRetained,
      isBalanced
    };
  };

  const summary = calculateSummary();

  const handleAddEntry = () => {
    if (newEntry.category && newEntry.amount && newEntry.description) {
      const entry: FinancialEntry = {
        id: Date.now().toString(),
        category: newEntry.category,
        subcategory: newEntry.subcategory,
        amount: newEntry.amount,
        date: new Date().toISOString().split('T')[0],
        description: newEntry.description,
        type: newEntry.type
      };
      setFinancialData([...financialData, entry]);
      setNewEntry({ category: '', subcategory: '', amount: 0, description: '', type: 'revenue' });
      setOpenDialog(false);
    }
  };

  const handleEditEntry = (entry: FinancialEntry) => {
    setEditingEntry(entry);
    setNewEntry({
      category: entry.category,
      subcategory: entry.subcategory,
      amount: entry.amount,
      description: entry.description,
      type: entry.type
    });
    setOpenDialog(true);
  };

  const handleUpdateEntry = () => {
    if (editingEntry && newEntry.category && newEntry.amount && newEntry.description) {
      const updatedData = financialData.map(item =>
        item.id === editingEntry.id
          ? { ...editingEntry, ...newEntry }
          : item
      );
      setFinancialData(updatedData);
      setEditingEntry(null);
      setNewEntry({ category: '', subcategory: '', amount: 0, description: '', type: 'revenue' });
      setOpenDialog(false);
    }
  };

  const handleDeleteEntry = (id: string) => {
    setFinancialData(financialData.filter(item => item.id !== id));
  };

  const exportToPDF = () => {
    // PDF export logic would go here
    console.log('Exporting to PDF...');
  };

  const exportToExcel = () => {
    // Excel export logic would go here
    console.log('Exporting to Excel...');
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

  return (
    <Box sx={{ p: 3, direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {t('financials.title', 'Financial Reports')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en')}>
            <LanguageIcon />
          </IconButton>
          <IconButton onClick={toggleTheme}>
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* Balance Alert */}
      {!summary.isBalanced && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {t('financials.imbalanceWarning', 'Warning: Balance Sheet is not balanced. Assets must equal Liabilities + Equity.')}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Income Statement Summary */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: theme.shadows[4],
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t('financials.incomeStatement', 'Income Statement')}
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    {t('financials.revenue', 'Revenue')}
                  </Typography>
                  <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
                    {formatCurrency(summary.totalRevenue)}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    {t('financials.expenses', 'Expenses')}
                  </Typography>
                  <Typography variant="h6" color="error.main" sx={{ fontWeight: 600 }}>
                    {formatCurrency(summary.totalExpenses)}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    {t('financials.netIncome', 'Net Income')}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color={summary.netIncome >= 0 ? 'success.main' : 'error.main'}
                    sx={{ fontWeight: 600 }}
                  >
                    {formatCurrency(summary.netIncome)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Balance Sheet Summary */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: theme.shadows[4],
            background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.05)})`
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t('financials.balanceSheet', 'Balance Sheet')}
                </Typography>
                {summary.isBalanced && (
                  <Chip label={t('financials.balanced', 'Balanced')} color="success" size="small" sx={{ ml: 1 }} />
                )}
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    {t('financials.assets', 'Assets')}
                  </Typography>
                  <Typography variant="h6" color="info.main" sx={{ fontWeight: 600 }}>
                    {formatCurrency(summary.totalAssets)}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    {t('financials.liabilities', 'Liabilities')}
                  </Typography>
                  <Typography variant="h6" color="warning.main" sx={{ fontWeight: 600 }}>
                    {formatCurrency(summary.totalLiabilities)}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    {t('financials.equity', 'Equity')}
                  </Typography>
                  <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 600 }}>
                    {formatCurrency(summary.totalEquity)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          {t('financials.addEntry', 'Add Entry')}
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={exportToPDF}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          {t('financials.exportPDF', 'Export PDF')}
        </Button>
        <Button
          variant="outlined"
          startIcon={<AssessmentIcon />}
          onClick={exportToExcel}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          {t('financials.exportExcel', 'Export Excel')}
        </Button>
        <Button
          variant="outlined"
          startIcon={<UploadIcon />}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          {t('financials.uploadDocs', 'Upload Documents')}
        </Button>
      </Box>

      {/* Financial Data Table */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[4] }}>
        <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t('financials.financialEntries', 'Financial Entries')}
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                <TableCell sx={{ fontWeight: 600 }}>{t('financials.date', 'Date')}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t('financials.type', 'Type')}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t('financials.category', 'Category')}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t('financials.description', 'Description')}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>{t('financials.amount', 'Amount')}</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>{t('financials.actions', 'Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {financialData.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={t(`financials.types.${row.type}`, row.type)}
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
      </Paper>

      {/* Add/Edit Entry Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => {
          setOpenDialog(false);
          setEditingEntry(null);
          setNewEntry({ category: '', subcategory: '', amount: 0, description: '', type: 'revenue' });
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingEntry ? t('financials.editEntry', 'Edit Entry') : t('financials.addNewEntry', 'Add New Entry')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label={t('financials.type', 'Type')}
                value={newEntry.type}
                onChange={(e) => {
                  setNewEntry({ ...newEntry, type: e.target.value as any, category: '' });
                }}
              >
                {Object.keys(CATEGORIES).map((type) => (
                  <MenuItem key={type} value={type}>
                    {t(`financials.types.${type}`, type)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label={t('financials.category', 'Category')}
                value={newEntry.category}
                onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                disabled={!newEntry.type}
              >
                {CATEGORIES[newEntry.type]?.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('financials.subcategory', 'Subcategory (Optional)')}
                value={newEntry.subcategory}
                onChange={(e) => setNewEntry({ ...newEntry, subcategory: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label={t('financials.amount', 'Amount (AED)')}
                value={newEntry.amount}
                onChange={(e) => setNewEntry({ ...newEntry, amount: parseFloat(e.target.value) || 0 })}
                inputProps={{ step: '0.01', min: '0' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('financials.description', 'Description')}
                value={newEntry.description}
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => {
              setOpenDialog(false);
              setEditingEntry(null);
              setNewEntry({ category: '', subcategory: '', amount: 0, description: '', type: 'revenue' });
            }}
            sx={{ textTransform: 'none' }}
          >
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button 
            onClick={editingEntry ? handleUpdateEntry : handleAddEntry} 
            variant="contained"
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            {editingEntry ? t('common.update', 'Update') : t('common.add', 'Add')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Financials;
