import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Button, Alert, Snackbar, Select, MenuItem, FormControl, InputLabel, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ArrowDownTrayIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useSettings } from '../context/SettingsContext';
import { exportToPDF, exportToZIP } from '../utils/fileUtils';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

interface FinancialMetrics {
  revenue: number;
  expenses: number;
  profit: number;
  assets: number;
  liabilities: number;
  equity: number;
  operatingMargin: number;
  currentRatio: number;
  debtToEquity: number;
  returnOnEquity: number;
  previousPeriodMetrics?: FinancialMetrics;
}

interface FinancialStatement {
  period: string;
  metrics: FinancialMetrics;
}

const Financials: React.FC = () => {
  const { t } = useTranslation();
  const { formatCurrency } = useSettings();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2024-Q2');
  const [comparisonPeriod, setComparisonPeriod] = useState<string>('2024-Q1');
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');

  // Sample data - replace with actual data from API
  const [statements] = useState<FinancialStatement[]>([
    {
      period: '2024-Q1',
      metrics: {
        revenue: 5000000,
        expenses: 3500000,
        profit: 1500000,
        assets: 10000000,
        liabilities: 4000000,
        equity: 6000000,
        operatingMargin: 0.3,
        currentRatio: 2.5,
        debtToEquity: 0.67,
        returnOnEquity: 0.25,
      },
    },
    {
      period: '2024-Q2',
      metrics: {
        revenue: 5500000,
        expenses: 3800000,
        profit: 1700000,
        assets: 10500000,
        liabilities: 4200000,
        equity: 6300000,
        operatingMargin: 0.31,
        currentRatio: 2.6,
        debtToEquity: 0.67,
        returnOnEquity: 0.27,
        previousPeriodMetrics: {
          revenue: 5000000,
          expenses: 3500000,
          profit: 1500000,
          assets: 10000000,
          liabilities: 4000000,
          equity: 6000000,
          operatingMargin: 0.3,
          currentRatio: 2.5,
          debtToEquity: 0.67,
          returnOnEquity: 0.25,
        },
      },
    },
  ]);

  const currentStatement = statements.find(s => s.period === selectedPeriod);
  const comparisonStatement = statements.find(s => s.period === comparisonPeriod);

  const calculateChange = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <Typography
        variant="body2"
        className={`flex items-center ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
      >
        {isPositive ? (
          <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
        ) : (
          <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
        )}
        {Math.abs(change).toFixed(1)}%
      </Typography>
    );
  };

  const handleExport = async () => {
    try {
      // Export individual PDFs for each statement
      const pdfPromises = statements.map(statement => 
        exportToPDF(statement, `financial-statement-${statement.period}`)
      );
      await Promise.all(pdfPromises);

      // Create ZIP with all PDFs
      const files = statements.map(statement => ({
        name: `financial-statement-${statement.period}.pdf`,
        content: JSON.stringify(statement)
      }));
      await exportToZIP(files);

      setSuccess(t('financials.export.success', 'Financial statements exported successfully'));
    } catch (err) {
      setError(t('financials.export.error', 'Error exporting financial statements'));
    }
  };

  // Chart data
  const revenueData = {
    labels: statements.map(s => s.period),
    datasets: [
      {
        label: t('financials.charts.revenue', 'Revenue'),
        data: statements.map(s => s.metrics.revenue),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const profitData = {
    labels: statements.map(s => s.period),
    datasets: [
      {
        label: t('financials.charts.profit', 'Profit'),
        data: statements.map(s => s.metrics.profit),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  const balanceSheetData = {
    labels: [t('financials.charts.assets', 'Assets'), t('financials.charts.liabilities', 'Liabilities'), t('financials.charts.equity', 'Equity')],
    datasets: [
      {
        data: [
          currentStatement?.metrics.assets || 0,
          currentStatement?.metrics.liabilities || 0,
          currentStatement?.metrics.equity || 0,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
        ],
      },
    ],
  };

  return (
    <Box>
      <Paper elevation={0} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <Box className="flex justify-between items-center mb-6">
          <Box>
            <Typography variant="h4" className="text-gray-900 dark:text-white mb-2">
              {t('financials.title')}
            </Typography>
            <Typography variant="body1" className="text-gray-600 dark:text-gray-400">
              {t('financials.subtitle')}
            </Typography>
          </Box>
          <Box className="flex gap-4">
            <FormControl size="small">
              <InputLabel>{t('financials.period', 'Period')}</InputLabel>
              <Select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                label={t('financials.period', 'Period')}
                className="min-w-[120px]"
              >
                {statements.map((statement) => (
                  <MenuItem key={statement.period} value={statement.period}>
                    {statement.period}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small">
              <InputLabel>{t('financials.compare', 'Compare with')}</InputLabel>
              <Select
                value={comparisonPeriod}
                onChange={(e) => setComparisonPeriod(e.target.value)}
                label={t('financials.compare', 'Compare with')}
                className="min-w-[120px]"
              >
                {statements.map((statement) => (
                  <MenuItem key={statement.period} value={statement.period}>
                    {statement.period}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<ArrowDownTrayIcon className="h-5 w-5" />}
              onClick={handleExport}
              className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
            >
              {t('financials.export.button', 'Export Statements')}
            </Button>
          </Box>
        </Box>

        {/* Key Metrics */}
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} md={3}>
            <Card className="bg-gray-50 dark:bg-gray-700">
              <CardContent>
                <Box className="flex justify-between items-start">
                  <Typography variant="h6" className="text-gray-900 dark:text-white mb-2">
                    {t('financials.metrics.revenue', 'Revenue')}
                  </Typography>
                  <Tooltip title={t('financials.metrics.revenueTooltip', 'Total revenue for the selected period')}>
                    <IconButton size="small">
                      <InformationCircleIcon className="h-4 w-4 text-gray-500" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="h4" className="text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(currentStatement?.metrics.revenue || 0)}
                </Typography>
                {currentStatement?.metrics.previousPeriodMetrics && (
                  formatChange(calculateChange(
                    currentStatement.metrics.revenue,
                    currentStatement.metrics.previousPeriodMetrics.revenue
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card className="bg-gray-50 dark:bg-gray-700">
              <CardContent>
                <Box className="flex justify-between items-start">
                  <Typography variant="h6" className="text-gray-900 dark:text-white mb-2">
                    {t('financials.metrics.profit', 'Profit')}
                  </Typography>
                  <Tooltip title={t('financials.metrics.profitTooltip', 'Net profit for the selected period')}>
                    <IconButton size="small">
                      <InformationCircleIcon className="h-4 w-4 text-gray-500" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="h4" className="text-green-600 dark:text-green-400">
                  {formatCurrency(currentStatement?.metrics.profit || 0)}
                </Typography>
                {currentStatement?.metrics.previousPeriodMetrics && (
                  formatChange(calculateChange(
                    currentStatement.metrics.profit,
                    currentStatement.metrics.previousPeriodMetrics.profit
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card className="bg-gray-50 dark:bg-gray-700">
              <CardContent>
                <Box className="flex justify-between items-start">
                  <Typography variant="h6" className="text-gray-900 dark:text-white mb-2">
                    {t('financials.metrics.operatingMargin', 'Operating Margin')}
                  </Typography>
                  <Tooltip title={t('financials.metrics.operatingMarginTooltip', 'Operating profit as a percentage of revenue')}>
                    <IconButton size="small">
                      <InformationCircleIcon className="h-4 w-4 text-gray-500" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="h4" className="text-blue-600 dark:text-blue-400">
                  {(currentStatement?.metrics.operatingMargin || 0).toFixed(1)}%
                </Typography>
                {currentStatement?.metrics.previousPeriodMetrics && (
                  formatChange(calculateChange(
                    currentStatement.metrics.operatingMargin,
                    currentStatement.metrics.previousPeriodMetrics.operatingMargin
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card className="bg-gray-50 dark:bg-gray-700">
              <CardContent>
                <Box className="flex justify-between items-start">
                  <Typography variant="h6" className="text-gray-900 dark:text-white mb-2">
                    {t('financials.metrics.returnOnEquity', 'ROE')}
                  </Typography>
                  <Tooltip title={t('financials.metrics.returnOnEquityTooltip', 'Return on Equity - Net income as a percentage of shareholders\' equity')}>
                    <IconButton size="small">
                      <InformationCircleIcon className="h-4 w-4 text-gray-500" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="h4" className="text-purple-600 dark:text-purple-400">
                  {(currentStatement?.metrics.returnOnEquity || 0).toFixed(1)}%
                </Typography>
                {currentStatement?.metrics.previousPeriodMetrics && (
                  formatChange(calculateChange(
                    currentStatement.metrics.returnOnEquity,
                    currentStatement.metrics.previousPeriodMetrics.returnOnEquity
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Financial Ratios */}
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="text-gray-900 dark:text-white mb-4">
                  {t('financials.ratios.currentRatio', 'Current Ratio')}
                </Typography>
                <Typography variant="h3" className="text-indigo-600 dark:text-indigo-400">
                  {(currentStatement?.metrics.currentRatio || 0).toFixed(2)}
                </Typography>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-2">
                  {t('financials.ratios.currentRatioDesc', 'Measures ability to pay short-term obligations')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="text-gray-900 dark:text-white mb-4">
                  {t('financials.ratios.debtToEquity', 'Debt to Equity')}
                </Typography>
                <Typography variant="h3" className="text-indigo-600 dark:text-indigo-400">
                  {(currentStatement?.metrics.debtToEquity || 0).toFixed(2)}
                </Typography>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-2">
                  {t('financials.ratios.debtToEquityDesc', 'Measures financial leverage')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="text-gray-900 dark:text-white mb-4">
                  {t('financials.ratios.operatingMargin', 'Operating Margin')}
                </Typography>
                <Typography variant="h3" className="text-indigo-600 dark:text-indigo-400">
                  {(currentStatement?.metrics.operatingMargin || 0).toFixed(1)}%
                </Typography>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-2">
                  {t('financials.ratios.operatingMarginDesc', 'Measures operational efficiency')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="text-gray-900 dark:text-white mb-4">
                  {t('financials.charts.revenueTrend', 'Revenue Trend')}
                </Typography>
                <Line 
                  data={revenueData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => formatCurrency(context.parsed.y)
                        }
                      }
                    },
                    scales: {
                      y: {
                        ticks: {
                          callback: (value) => formatCurrency(value as number)
                        }
                      }
                    }
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="text-gray-900 dark:text-white mb-4">
                  {t('financials.charts.balanceSheet', 'Balance Sheet')}
                </Typography>
                <Pie 
                  data={balanceSheetData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom' as const,
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => formatCurrency(context.parsed)
                        }
                      }
                    }
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="text-gray-900 dark:text-white mb-4">
                  {t('financials.charts.profitTrend', 'Profit Trend')}
                </Typography>
                <Bar 
                  data={profitData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => formatCurrency(context.parsed.y)
                        }
                      }
                    },
                    scales: {
                      y: {
                        ticks: {
                          callback: (value) => formatCurrency(value as number)
                        }
                      }
                    }
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Financials; 
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab
} from '@mui/material';

interface FinancialEntry {
  account: string;
  debit: number;
  credit: number;
}

const Financials: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  // Sample financial data
  const balanceSheetData: FinancialEntry[] = [
    { account: 'Cash', debit: 50000, credit: 0 },
    { account: 'Accounts Receivable', debit: 25000, credit: 0 },
    { account: 'Inventory', debit: 30000, credit: 0 },
    { account: 'Accounts Payable', debit: 0, credit: 15000 },
    { account: 'Equity', debit: 0, credit: 90000 },
  ];

  const incomeStatementData: FinancialEntry[] = [
    { account: 'Revenue', debit: 0, credit: 200000 },
    { account: 'Cost of Goods Sold', debit: 120000, credit: 0 },
    { account: 'Operating Expenses', debit: 45000, credit: 0 },
    { account: 'Interest Expense', debit: 2000, credit: 0 },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const generateReport = () => {
    // Mock report generation
    alert('Financial report generated successfully!');
  };

  const exportToExcel = () => {
    // Mock export functionality
    alert('Data exported to Excel successfully!');
  };

  const renderFinancialTable = (data: FinancialEntry[], title: string) => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        {title}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Account</TableCell>
              <TableCell align="right">Debit</TableCell>
              <TableCell align="right">Credit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.account}</TableCell>
                <TableCell align="right">
                  {entry.debit > 0 ? `$${entry.debit.toLocaleString()}` : '-'}
                </TableCell>
                <TableCell align="right">
                  {entry.credit > 0 ? `$${entry.credit.toLocaleString()}` : '-'}
                </TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ '& td': { fontWeight: 'bold' } }}>
              <TableCell>Total</TableCell>
              <TableCell align="right">
                ${data.reduce((sum, entry) => sum + entry.debit, 0).toLocaleString()}
              </TableCell>
              <TableCell align="right">
                ${data.reduce((sum, entry) => sum + entry.credit, 0).toLocaleString()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Financial Reports
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Total Assets
              </Typography>
              <Typography variant="h4">
                $105,000
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="secondary">
                Total Revenue
              </Typography>
              <Typography variant="h4">
                $200,000
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                Net Income
              </Typography>
              <Typography variant="h4">
                $33,000
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main">
                Total Expenses
              </Typography>
              <Typography variant="h4">
                $167,000
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={generateReport}
          sx={{ mr: 2 }}
        >
          Generate Report
        </Button>
        <Button 
          variant="outlined" 
          onClick={exportToExcel}
        >
          Export to Excel
        </Button>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Balance Sheet" />
          <Tab label="Income Statement" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {activeTab === 0 && renderFinancialTable(balanceSheetData, 'Balance Sheet')}
          {activeTab === 1 && renderFinancialTable(incomeStatementData, 'Income Statement')}
        </Box>
      </Paper>
    </Box>
  );
};

export default Financials;
