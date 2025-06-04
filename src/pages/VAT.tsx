import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Button, Card, CardContent, TextField, MenuItem, Alert, Snackbar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ArrowUpTrayIcon, ArrowDownTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useSettings } from '../context/SettingsContext';
import { processExcelFile, processPDFFile, exportToPDF, exportToZIP, validateFile } from '../utils/fileUtils';

interface VATReturn {
  period: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  taxableSales: number;
  taxablePurchases: number;
  vatPayable: number;
}

const VAT: React.FC = () => {
  const { t } = useTranslation();
  const { formatCurrency } = useSettings();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [returns, setReturns] = useState<VATReturn[]>([
    {
      period: '2024-Q1',
      status: 'draft',
      taxableSales: 1000000,
      taxablePurchases: 800000,
      vatPayable: 10000
    }
  ]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      if (!validateFile(file, ['xlsx', 'xls', 'pdf'])) {
        setError(t('vat.upload.error.invalidType', 'Invalid file type. Please upload Excel or PDF files.'));
        return;
      }

      setSelectedFile(file);
      try {
        const fileType = file.name.split('.').pop()?.toLowerCase();
        const result = fileType === 'pdf' 
          ? await processPDFFile(file)
          : await processExcelFile(file);

        if (result.success) {
          setSuccess(t('vat.upload.success', 'File processed successfully'));
          // TODO: Update returns with processed data
        } else {
          setError(t('vat.upload.error.processing', 'Error processing file'));
        }
      } catch (err) {
        setError(t('vat.upload.error.general', 'Error uploading file'));
      }
    }
  };

  const handleExport = async () => {
    try {
      // Export individual PDFs
      const pdfPromises = returns.map(return_ => 
        exportToPDF(return_, `vat-return-${return_.period}`)
      );
      await Promise.all(pdfPromises);

      // Create ZIP with all PDFs
      const files = returns.map(return_ => ({
        name: `vat-return-${return_.period}.pdf`,
        content: JSON.stringify(return_)
      }));
      await exportToZIP(files);

      setSuccess(t('vat.export.success', 'Returns exported successfully'));
    } catch (err) {
      setError(t('vat.export.error', 'Error exporting returns'));
    }
  };

  const getStatusColor = (status: VATReturn['status']) => {
    switch (status) {
      case 'approved': return 'text-green-600 dark:text-green-400';
      case 'rejected': return 'text-red-600 dark:text-red-400';
      case 'submitted': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Box>
      <Paper elevation={0} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white">
          {t('vat.title')}
        </Typography>
        <Typography variant="subtitle1" className="text-gray-600 dark:text-gray-400 mb-6">
          {t('vat.subtitle')}
        </Typography>

        {/* File Upload Section */}
        <Card className="mb-6 bg-gray-50 dark:bg-gray-700">
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h6" className="text-gray-900 dark:text-white mb-2">
                  {t('vat.upload.title')}
                </Typography>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-4">
                  {t('vat.upload.subtitle')}
                </Typography>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<ArrowUpTrayIcon className="h-5 w-5" />}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {t('vat.upload.button')}
                  <input
                    type="file"
                    hidden
                    accept=".xlsx,.xls,.pdf"
                    onChange={handleFileUpload}
                  />
                </Button>
                {selectedFile && (
                  <Typography variant="body2" className="mt-2 text-gray-600 dark:text-gray-400">
                    {selectedFile.name}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowDownTrayIcon className="h-5 w-5" />}
                  onClick={handleExport}
                  className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                >
                  {t('vat.export.button')}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Returns Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" className="text-gray-900 dark:text-white mb-4">
              {t('vat.returns.title')}
            </Typography>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('vat.returns.period')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('vat.returns.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('vat.returns.sales')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('vat.returns.purchases')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('vat.returns.payable')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {returns.map((return_, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {return_.period}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`${getStatusColor(return_.status)}`}>
                          {t(`vat.returns.status.${return_.status}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatCurrency(return_.taxableSales)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatCurrency(return_.taxablePurchases)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatCurrency(return_.vatPayable)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
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

export default VAT; 
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
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
  Paper
} from '@mui/material';

interface VATRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  vatAmount: number;
  vatRate: number;
}

const VAT: React.FC = () => {
  const [vatRecords, setVatRecords] = useState<VATRecord[]>([]);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    vatRate: '15'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    const vatRate = parseFloat(formData.vatRate);
    const vatAmount = (amount * vatRate) / 100;

    const newRecord: VATRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      description: formData.description,
      amount: amount,
      vatAmount: vatAmount,
      vatRate: vatRate
    };

    setVatRecords([...vatRecords, newRecord]);
    setFormData({ description: '', amount: '', vatRate: '15' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const totalVAT = vatRecords.reduce((sum, record) => sum + record.vatAmount, 0);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        VAT Management
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Add VAT Record
              </Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="VAT Rate (%)"
                  name="vatRate"
                  type="number"
                  value={formData.vatRate}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  Add Record
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                VAT Summary
              </Typography>
              <Typography variant="h4" color="primary">
                ${totalVAT.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total VAT Amount
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            VAT Records
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">VAT Rate</TableCell>
                  <TableCell align="right">VAT Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vatRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.description}</TableCell>
                    <TableCell align="right">${record.amount.toFixed(2)}</TableCell>
                    <TableCell align="right">{record.vatRate}%</TableCell>
                    <TableCell align="right">${record.vatAmount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VAT;
