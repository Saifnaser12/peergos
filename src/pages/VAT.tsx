import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Alert,
  Switch,
  FormControlLabel,
  useTheme,
  alpha,
} from '@mui/material';
import { 
  WbSunny as Sun, 
  NightlightRound as Moon, 
  Upload, 
  Description as FileText, 
  Download,
  Calculate,
  TableChart as TableCells,
  CloudUpload,
} from '@mui/icons-material';
import SubmissionHistory from '../components/SubmissionHistory';
import FTAIntegrationStatus from '../components/FTAIntegrationStatus';
import { ftaService } from '../services/ftaService';

interface VATFormData {
  standardRatedSales: number;
  zeroRatedSales: number;
  exemptSales: number;
  purchasesWithVAT: number;
  purchasesWithoutVAT: number;
  importsGoods: number;
  localServices: number;
  lateInvoices: number;
  badDebtRelief: number;
  vatCorrections: number;
  companyName: string;
  trn: string;
  taxPeriod: string;
}

interface VATCalculations {
  outputVAT: number;
  inputVAT: number;
  netVAT: number;
  isRefundable: boolean;
}

const VAT: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [darkMode, setDarkMode] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<VATFormData>({
    standardRatedSales: 0,
    zeroRatedSales: 0,
    exemptSales: 0,
    purchasesWithVAT: 0,
    purchasesWithoutVAT: 0,
    importsGoods: 0,
    localServices: 0,
    lateInvoices: 0,
    badDebtRelief: 0,
    vatCorrections: 0,
    companyName: '',
    trn: '',
    taxPeriod: `${new Date().getFullYear()}-Q${Math.ceil((new Date().getMonth() + 1) / 3)}`,
  });

  const validateField = useCallback((name: string, value: number): string => {
    if (isNaN(value)) {
      return t('Invalid number format');
    }
    if (value < 0) {
      return t('Amount cannot be negative');
    }
    return '';
  }, [t]);

  const handleInputChange = useCallback((field: keyof VATFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value) || 0;
    const error = validateField(field, value);

    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: error }));
  }, [validateField]);

  const calculateVAT = useCallback((): VATCalculations => {
    const outputVAT = formData.standardRatedSales * 0.05;
    const inputVAT = formData.purchasesWithVAT * 0.05;
    const netVAT = outputVAT - inputVAT;

    return {
      outputVAT,
      inputVAT,
      netVAT: Math.abs(netVAT),
      isRefundable: netVAT < 0,
    };
  }, [formData]);

  const calculations = calculateVAT();

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleExportPDF = () => {
    console.log('Exporting PDF...');
  };

  const handleExportExcel = () => {
    console.log('Exporting Excel...');
  };

  const handleSubmit = () => {
    console.log('Submitting VAT return...');
  };

  const handleSubmitToFTA = async () => {
    if (!formData.companyName || !formData.trn) {
      console.error('Missing company information for FTA submission');
      return;
    }

    try {
      const submissionData = {
        trn: formData.trn,
        companyName: formData.companyName,
        submissionType: 'VAT' as const,
        taxPeriod: formData.taxPeriod,
        data: {
          ...formData,
          calculations,
          vatDue: calculations.netVAT,
          submittedAt: new Date().toISOString()
        }
      };

      const response = await ftaService.submitVAT(submissionData);
      console.log('VAT submitted to FTA:', response);
      
    } catch (error) {
      console.error('FTA submission failed:', error);
    }
  };

  const inputFieldProps = {
    variant: 'outlined' as const,
    fullWidth: true,
    type: 'number',
    InputProps: {
      startAdornment: <InputAdornment position="start">AED</InputAdornment>,
      inputProps: { min: 0, step: 0.01 },
    },
    sx: {
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
        },
        '&.Mui-focused': {
          boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.25)}`,
        },
      },
    },
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
            {t('VAT Return Filing')}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
            {t('UAE FTA-compliant VAT return submission')}
          </Typography>
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              icon={<Sun />}
              checkedIcon={<Moon />}
            />
          }
          label={t('Dark Mode')}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Form Section */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: theme.shadows[2] }}>
            {/* Company Information */}
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              {t('Company Information')}
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  label={t('Company Name')}
                  placeholder={t('Enter company name')}
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  {...inputFieldProps}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label={t('Tax Registration Number (TRN)')}
                  placeholder="100123456700003"
                  value={formData.trn}
                  onChange={(e) => setFormData(prev => ({ ...prev, trn: e.target.value }))}
                  {...inputFieldProps}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label={t('Tax Period')}
                  placeholder="2024-Q1"
                  value={formData.taxPeriod}
                  onChange={(e) => setFormData(prev => ({ ...prev, taxPeriod: e.target.value }))}
                  {...inputFieldProps}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Sales Section */}
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              {t('Sales')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label={t('Standard-rated Sales (5%)')}
                  placeholder={t('Sales subject to 5% VAT rate')}
                  value={formData.standardRatedSales || ''}
                  onChange={handleInputChange('standardRatedSales')}
                  error={!!errors.standardRatedSales}
                  helperText={errors.standardRatedSales}
                  {...inputFieldProps}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label={t('Zero-rated Sales (0%)')}
                  placeholder={t('Sales with 0% VAT rate (exports, etc.)')}
                  value={formData.zeroRatedSales || ''}
                  onChange={handleInputChange('zeroRatedSales')}
                  error={!!errors.zeroRatedSales}
                  helperText={errors.zeroRatedSales}
                  {...inputFieldProps}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label={t('Exempt Sales')}
                  placeholder={t('Sales exempt from VAT')}
                  value={formData.exemptSales || ''}
                  onChange={handleInputChange('exemptSales')}
                  error={!!errors.exemptSales}
                  helperText={errors.exemptSales}
                  {...inputFieldProps}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Purchases Section */}
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              {t('Purchases')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label={t('Purchases with Recoverable VAT')}
                  placeholder={t('Business purchases where VAT can be recovered')}
                  value={formData.purchasesWithVAT || ''}
                  onChange={handleInputChange('purchasesWithVAT')}
                  error={!!errors.purchasesWithVAT}
                  helperText={errors.purchasesWithVAT}
                  {...inputFieldProps}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label={t('Purchases without Recoverable VAT')}
                  placeholder={t('Purchases where VAT cannot be recovered')}
                  value={formData.purchasesWithoutVAT || ''}
                  onChange={handleInputChange('purchasesWithoutVAT')}
                  error={!!errors.purchasesWithoutVAT}
                  helperText={errors.purchasesWithoutVAT}
                  {...inputFieldProps}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Reverse Charge Section */}
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              {t('Reverse Charge Mechanism')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label={t('Imports of Goods/Services')}
                  placeholder={t('Imported goods and services subject to reverse charge')}
                  value={formData.importsGoods || ''}
                  onChange={handleInputChange('importsGoods')}
                  error={!!errors.importsGoods}
                  helperText={errors.importsGoods}
                  {...inputFieldProps}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label={t('Local Services')}
                  placeholder={t('Local services subject to reverse charge')}
                  value={formData.localServices || ''}
                  onChange={handleInputChange('localServices')}
                  error={!!errors.localServices}
                  helperText={errors.localServices}
                  {...inputFieldProps}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Adjustments Section */}
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              {t('Adjustments')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  label={t('Late Invoices')}
                  placeholder={t('VAT adjustments for late invoices')}
                  value={formData.lateInvoices || ''}
                  onChange={handleInputChange('lateInvoices')}
                  error={!!errors.lateInvoices}
                  helperText={errors.lateInvoices}
                  {...inputFieldProps}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label={t('Bad Debt Relief')}
                  placeholder={t('VAT relief for bad debts')}
                  value={formData.badDebtRelief || ''}
                  onChange={handleInputChange('badDebtRelief')}
                  error={!!errors.badDebtRelief}
                  helperText={errors.badDebtRelief}
                  {...inputFieldProps}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label={t('VAT Corrections')}
                  placeholder={t('Other VAT corrections and adjustments')}
                  value={formData.vatCorrections || ''}
                  onChange={handleInputChange('vatCorrections')}
                  error={!!errors.vatCorrections}
                  helperText={errors.vatCorrections}
                  {...inputFieldProps}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* File Upload Section */}
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              {t('Supporting Documents')}
            </Typography>
            <Box
              sx={{
                border: `2px dashed ${theme.palette.divider}`,
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                backgroundColor: alpha(theme.palette.primary.main, 0.02),
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <Upload sx={{ fontSize: 32, color: theme.palette.primary.main }} />
              <Typography variant="body1" sx={{ mt: 2, fontWeight: 500 }}>
                {t('Upload invoices, receipts, and reports')}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {t('PDF, JPEG, PNG, XLSX - Max 10MB per file')}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Summary Section */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 3, boxShadow: theme.shadows[3] }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                {t('VAT Calculation Summary')}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{t('Output VAT')}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(calculations.outputVAT)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{t('Input VAT')}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(calculations.inputVAT)}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {calculations.isRefundable ? t('VAT Refundable') : t('VAT Payable')}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      color: calculations.isRefundable ? theme.palette.success.main : theme.palette.error.main
                    }}
                  >
                    {formatCurrency(calculations.netVAT)}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<Calculate />}
                sx={{ mb: 2 }}
                onClick={() => {/* Recalculate logic */}}
              >
                {t('Recalculate')}
              </Button>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<FileText />}
                    onClick={handleExportPDF}
                    size="small"
                  >
                    {t('PDF')}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<TableCells />}
                    onClick={handleExportExcel}
                    size="small"
                  >
                    {t('Excel')}
                  </Button>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleSubmit}
                  sx={{ py: 1.5, fontWeight: 600 }}
                >
                  {t('Submit VAT Return')}
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  onClick={handleSubmitToFTA}
                  disabled={!formData.companyName || !formData.trn}
                  startIcon={<CloudUpload />}
                  sx={{ py: 1.5, fontWeight: 600 }}
                >
                  {t('Submit to FTA')}
                </Button>
              </Box>

              <Alert severity="info" sx={{ mt: 3, fontSize: '0.875rem' }}>
                {t('This VAT return complies with UAE Federal Tax Authority requirements. Ensure all amounts are accurate before submission.')}
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Submission History */}
      {formData.trn && (
        <Box sx={{ mt: 4 }}>
          <SubmissionHistory 
            trn={formData.trn} 
            submissionType="VAT"
            maxItems={5}
          />
        </Box>
      )}
    </Box>
  );
};

export default VAT;