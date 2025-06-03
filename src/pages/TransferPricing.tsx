import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Button, Alert, Snackbar, Select, MenuItem, FormControl, InputLabel, IconButton, Tooltip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ArrowDownTrayIcon, DocumentPlusIcon, ChartBarIcon, DocumentTextIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useSettings } from '../context/SettingsContext';
import { exportToPDF, exportToZIP } from '../utils/fileUtils';

interface TransferPricingDocument {
  id: string;
  name: string;
  type: 'masterfile' | 'localfile' | 'cbcr';
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  dueDate: string;
  lastUpdated: string;
}

interface RelatedPartyTransaction {
  id: string;
  relatedParty: string;
  transactionType: string;
  amount: number;
  method: string;
  status: 'compliant' | 'non-compliant' | 'pending';
}

const TransferPricing: React.FC = () => {
  const { t } = useTranslation();
  const { formatCurrency } = useSettings();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('2024');

  // Sample data - replace with actual data from API
  const [documents] = useState<TransferPricingDocument[]>([
    {
      id: '1',
      name: 'Master File 2024',
      type: 'masterfile',
      status: 'draft',
      dueDate: '2024-12-31',
      lastUpdated: '2024-03-15',
    },
    {
      id: '2',
      name: 'Local File 2024',
      type: 'localfile',
      status: 'submitted',
      dueDate: '2024-12-31',
      lastUpdated: '2024-03-10',
    },
    {
      id: '3',
      name: 'CbCR 2024',
      type: 'cbcr',
      status: 'approved',
      dueDate: '2024-12-31',
      lastUpdated: '2024-02-28',
    },
  ]);

  const [transactions] = useState<RelatedPartyTransaction[]>([
    {
      id: '1',
      relatedParty: 'Parent Company Ltd',
      transactionType: 'Management Services',
      amount: 500000,
      method: 'Cost Plus',
      status: 'compliant',
    },
    {
      id: '2',
      relatedParty: 'Subsidiary A',
      transactionType: 'Intra-group Sales',
      amount: 2000000,
      method: 'Resale Price',
      status: 'compliant',
    },
    {
      id: '3',
      relatedParty: 'Subsidiary B',
      transactionType: 'Royalty Payments',
      amount: 300000,
      method: 'Profit Split',
      status: 'pending',
    },
  ]);

  const handleExport = async () => {
    try {
      // Export documentation
      const files = documents.map(doc => ({
        name: `${doc.name}.pdf`,
        content: JSON.stringify(doc)
      }));
      await exportToZIP(files);
      setSuccess(t('transferPricing.export.success', 'Transfer pricing documentation exported successfully'));
    } catch (err) {
      setError(t('transferPricing.export.error', 'Error exporting transfer pricing documentation'));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'text-gray-600 dark:text-gray-400';
      case 'submitted':
        return 'text-blue-600 dark:text-blue-400';
      case 'approved':
        return 'text-green-600 dark:text-green-400';
      case 'rejected':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-green-600 dark:text-green-400';
      case 'non-compliant':
        return 'text-red-600 dark:text-red-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Box>
      <Paper elevation={0} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <Box className="flex justify-between items-center mb-6">
          <Box>
            <Typography variant="h4" className="text-gray-900 dark:text-white mb-2">
              {t('transferPricing.title')}
            </Typography>
            <Typography variant="body1" className="text-gray-600 dark:text-gray-400">
              {t('transferPricing.subtitle')}
            </Typography>
          </Box>
          <Box className="flex gap-4">
            <FormControl size="small">
              <InputLabel>{t('transferPricing.year', 'Year')}</InputLabel>
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                label={t('transferPricing.year', 'Year')}
                className="min-w-[120px]"
              >
                <MenuItem value="2024">2024</MenuItem>
                <MenuItem value="2023">2023</MenuItem>
                <MenuItem value="2022">2022</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<ArrowDownTrayIcon className="h-5 w-5" />}
              onClick={handleExport}
              className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
            >
              {t('transferPricing.export.button', 'Export Documentation')}
            </Button>
          </Box>
        </Box>

        {/* Documentation Status */}
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} md={4}>
            <Card className="bg-gray-50 dark:bg-gray-700">
              <CardContent>
                <Box className="flex justify-between items-start">
                  <Typography variant="h6" className="text-gray-900 dark:text-white mb-2">
                    {t('transferPricing.documentation.masterFile', 'Master File')}
                  </Typography>
                  <Tooltip title={t('transferPricing.documentation.masterFileTooltip', 'Global documentation of transfer pricing policies')}>
                    <IconButton size="small">
                      <InformationCircleIcon className="h-4 w-4 text-gray-500" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="h4" className={getStatusColor(documents[0].status)}>
                  {t(`transferPricing.status.${documents[0].status}`)}
                </Typography>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-2">
                  {t('transferPricing.documentation.dueDate', 'Due Date')}: {documents[0].dueDate}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card className="bg-gray-50 dark:bg-gray-700">
              <CardContent>
                <Box className="flex justify-between items-start">
                  <Typography variant="h6" className="text-gray-900 dark:text-white mb-2">
                    {t('transferPricing.documentation.localFile', 'Local File')}
                  </Typography>
                  <Tooltip title={t('transferPricing.documentation.localFileTooltip', 'Country-specific transfer pricing documentation')}>
                    <IconButton size="small">
                      <InformationCircleIcon className="h-4 w-4 text-gray-500" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="h4" className={getStatusColor(documents[1].status)}>
                  {t(`transferPricing.status.${documents[1].status}`)}
                </Typography>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-2">
                  {t('transferPricing.documentation.dueDate', 'Due Date')}: {documents[1].dueDate}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card className="bg-gray-50 dark:bg-gray-700">
              <CardContent>
                <Box className="flex justify-between items-start">
                  <Typography variant="h6" className="text-gray-900 dark:text-white mb-2">
                    {t('transferPricing.documentation.cbcr', 'CbCR')}
                  </Typography>
                  <Tooltip title={t('transferPricing.documentation.cbcrTooltip', 'Country-by-Country Reporting')}>
                    <IconButton size="small">
                      <InformationCircleIcon className="h-4 w-4 text-gray-500" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="h4" className={getStatusColor(documents[2].status)}>
                  {t(`transferPricing.status.${documents[2].status}`)}
                </Typography>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-2">
                  {t('transferPricing.documentation.dueDate', 'Due Date')}: {documents[2].dueDate}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Related Party Transactions */}
        <Box className="mb-6">
          <Typography variant="h5" className="text-gray-900 dark:text-white mb-4">
            {t('transferPricing.transactions.title', 'Related Party Transactions')}
          </Typography>
          <TableContainer component={Paper} className="bg-white dark:bg-gray-800">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('transferPricing.transactions.relatedParty', 'Related Party')}</TableCell>
                  <TableCell>{t('transferPricing.transactions.type', 'Transaction Type')}</TableCell>
                  <TableCell align="right">{t('transferPricing.transactions.amount', 'Amount')}</TableCell>
                  <TableCell>{t('transferPricing.transactions.method', 'Transfer Pricing Method')}</TableCell>
                  <TableCell>{t('transferPricing.transactions.status', 'Status')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.relatedParty}</TableCell>
                    <TableCell>{transaction.transactionType}</TableCell>
                    <TableCell align="right">{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell>{transaction.method}</TableCell>
                    <TableCell>
                      <Typography className={getTransactionStatusColor(transaction.status)}>
                        {t(`transferPricing.transactions.status.${transaction.status}`)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Quick Actions */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box className="flex items-center gap-4">
                  <DocumentPlusIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  <Box>
                    <Typography variant="h6" className="text-gray-900 dark:text-white">
                      {t('transferPricing.actions.upload', 'Upload Documentation')}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                      {t('transferPricing.actions.uploadDesc', 'Upload transfer pricing documentation')}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box className="flex items-center gap-4">
                  <ChartBarIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  <Box>
                    <Typography variant="h6" className="text-gray-900 dark:text-white">
                      {t('transferPricing.actions.analyze', 'Analyze Transactions')}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                      {t('transferPricing.actions.analyzeDesc', 'Analyze related party transactions')}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box className="flex items-center gap-4">
                  <DocumentTextIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  <Box>
                    <Typography variant="h6" className="text-gray-900 dark:text-white">
                      {t('transferPricing.actions.report', 'Generate Reports')}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                      {t('transferPricing.actions.reportDesc', 'Generate transfer pricing reports')}
                    </Typography>
                  </Box>
                </Box>
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

export default TransferPricing; 