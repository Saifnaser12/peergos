import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Button, Card, CardContent, Alert, Snackbar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ArrowUpTrayIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useSettings } from '../context/SettingsContext';
import { processExcelFile, processPDFFile, exportToPDF, exportToZIP, validateFile } from '../utils/fileUtils';

interface CITReturn {
  period: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  taxableIncome: number;
  taxPayable: number;
  taxPaid: number;
  balanceDue: number;
}

const CIT: React.FC = () => {
  const { t } = useTranslation();
  const { formatCurrency } = useSettings();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [returns, setReturns] = useState<CITReturn[]>([
    {
      period: '2024',
      status: 'draft',
      taxableIncome: 2000000,
      taxPayable: 90000,
      taxPaid: 45000,
      balanceDue: 45000
    }
  ]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      if (!validateFile(file, ['xlsx', 'xls', 'pdf'])) {
        setError(t('cit.upload.error.invalidType', 'Invalid file type. Please upload Excel or PDF files.'));
        return;
      }

      setSelectedFile(file);
      try {
        const fileType = file.name.split('.').pop()?.toLowerCase();
        const result = fileType === 'pdf' 
          ? await processPDFFile(file)
          : await processExcelFile(file);

        if (result.success) {
          setSuccess(t('cit.upload.success', 'File processed successfully'));
          // TODO: Update returns with processed data
        } else {
          setError(t('cit.upload.error.processing', 'Error processing file'));
        }
      } catch (err) {
        setError(t('cit.upload.error.general', 'Error uploading file'));
      }
    }
  };

  const handleExport = async () => {
    try {
      // Export individual PDFs
      const pdfPromises = returns.map(return_ => 
        exportToPDF(return_, `cit-return-${return_.period}`)
      );
      await Promise.all(pdfPromises);

      // Create ZIP with all PDFs
      const files = returns.map(return_ => ({
        name: `cit-return-${return_.period}.pdf`,
        content: JSON.stringify(return_)
      }));
      await exportToZIP(files);

      setSuccess(t('cit.export.success', 'Returns exported successfully'));
    } catch (err) {
      setError(t('cit.export.error', 'Error exporting returns'));
    }
  };

  const getStatusColor = (status: CITReturn['status']) => {
    const colors = {
      draft: 'text-gray-600 dark:text-gray-400',
      submitted: 'text-blue-600 dark:text-blue-400',
      approved: 'text-green-600 dark:text-green-400',
      rejected: 'text-red-600 dark:text-red-400'
    };
    return colors[status];
  };

  return (
    <Box>
      <Paper elevation={0} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <Typography variant="h4" className="text-gray-900 dark:text-white mb-2">
          {t('cit.title')}
        </Typography>
        <Typography variant="body1" className="text-gray-600 dark:text-gray-400 mb-6">
          {t('cit.subtitle')}
        </Typography>

        {/* File Upload Section */}
        <Card className="mb-6 bg-gray-50 dark:bg-gray-700">
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h6" className="text-gray-900 dark:text-white mb-2">
                  {t('cit.upload.title')}
                </Typography>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-4">
                  {t('cit.upload.subtitle')}
                </Typography>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<ArrowUpTrayIcon className="h-5 w-5" />}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {t('cit.upload.button')}
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
                  {t('cit.export.button')}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Returns Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" className="text-gray-900 dark:text-white mb-4">
              {t('cit.returns.title')}
            </Typography>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('cit.returns.period')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('cit.returns.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('cit.returns.income')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('cit.returns.payable')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('cit.returns.paid')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('cit.returns.balance')}
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
                          {t(`cit.returns.status.${return_.status}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatCurrency(return_.taxableIncome)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatCurrency(return_.taxPayable)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatCurrency(return_.taxPaid)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatCurrency(return_.balanceDue)}
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

export default CIT; 
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';

const CIT: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    taxYear: '2024',
    grossIncome: '',
    deductions: '',
    taxableIncome: '',
    taxRate: '25'
  });
  
  const [calculationResult, setCalculationResult] = useState<{
    taxableIncome: number;
    taxDue: number;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const grossIncome = parseFloat(formData.grossIncome) || 0;
    const deductions = parseFloat(formData.deductions) || 0;
    const taxRate = parseFloat(formData.taxRate) || 0;
    
    const taxableIncome = Math.max(0, grossIncome - deductions);
    const taxDue = (taxableIncome * taxRate) / 100;
    
    setCalculationResult({
      taxableIncome,
      taxDue
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Corporate Income Tax (CIT)
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                CIT Calculation
              </Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      margin="normal"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Tax Year</InputLabel>
                      <Select
                        name="taxYear"
                        value={formData.taxYear}
                        label="Tax Year"
                        onChange={(e) => setFormData({...formData, taxYear: e.target.value})}
                      >
                        <MenuItem value="2024">2024</MenuItem>
                        <MenuItem value="2023">2023</MenuItem>
                        <MenuItem value="2022">2022</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Gross Income"
                      name="grossIncome"
                      type="number"
                      value={formData.grossIncome}
                      onChange={handleChange}
                      margin="normal"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Total Deductions"
                      name="deductions"
                      type="number"
                      value={formData.deductions}
                      onChange={handleChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Tax Rate (%)"
                      name="taxRate"
                      type="number"
                      value={formData.taxRate}
                      onChange={handleChange}
                      margin="normal"
                      required
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3 }}
                  size="large"
                >
                  Calculate CIT
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          {calculationResult && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  CIT Calculation Result
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Taxable Income
                  </Typography>
                  <Typography variant="h5">
                    ${calculationResult.taxableIncome.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Tax Due
                  </Typography>
                  <Typography variant="h4" color="primary">
                    ${calculationResult.taxDue.toLocaleString()}
                  </Typography>
                </Box>
                <Alert severity="info" sx={{ mt: 2 }}>
                  This is a preliminary calculation. Please consult with a tax professional for final filing.
                </Alert>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CIT;
import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const CIT: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Corporate Income Tax
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Corporate Income Tax filing and management features will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default CIT;
