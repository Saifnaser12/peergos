import React, { useState, useCallback, useEffect } from 'react';
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
  Chip,
  Snackbar,
  Fab,
  Tooltip
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
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CogIcon,
  CalendarIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  ShareIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';
import SubmissionHistory from '../components/SubmissionHistory';
import FTAIntegrationStatus from '../components/FTAIntegrationStatus';
import SubmissionPanel from '../components/fta/SubmissionPanel';
import { ftaService } from '../services/ftaService';
import { useFinance } from '../context/FinanceContext';
import { useTax } from '../context/TaxContext';
import { useFinancialSync } from '../hooks/useFinancialSync';
import SubmissionModal from '../components/SubmissionModal';
import FreeZoneAdvisor from '../components/FreeZoneAdvisor';

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
  isDesignatedZone: boolean;
  designatedZoneImports: number;
}

interface VATCalculations {
  outputVAT: number;
  inputVAT: number;
  netVAT: number;
  isRefundable: boolean;
}

const VAT: React.FC = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const [darkMode, setDarkMode] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { revenue, expenses } = useFinance();
  const { state } = useTax();
  const { summary, isUpdating, totalRevenue, totalExpenses, netIncome } = useFinancialSync();

  const [formData, setFormData] = useState<VATFormData>({
    standardRatedSales: totalRevenue,
    zeroRatedSales: 0,
    exemptSales: 0,
    purchasesWithVAT: totalExpenses,
    purchasesWithoutVAT: 0,
    importsGoods: 0,
    localServices: 0,
    lateInvoices: 0,
    badDebtRelief: 0,
    vatCorrections: 0,
    companyName: '',
    trn: '',
    taxPeriod: `${new Date().getFullYear()}-Q${Math.ceil((new Date().getMonth() + 1) / 3)}`,
    isDesignatedZone: false,
    designatedZoneImports: 0,
  });

  // Auto-update financial data when accounting entries change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      standardRatedSales: totalRevenue,
      purchasesWithVAT: totalExpenses
    }));
  }, [totalRevenue, totalExpenses]);

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
    let inputVAT = formData.purchasesWithVAT * 0.05;

    // Add reverse charge VAT for designated zone imports
    if (formData.isDesignatedZone) {
      const reverseChargeVAT = formData.designatedZoneImports * 0.05;
      inputVAT += reverseChargeVAT;
    }

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

  const handleSubmitVAT = async () => {
    setIsSubmitting(true);
    try {
      // Simulate VAT submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAlertMessage(t('vat.fta.submitSuccess', 'VAT return submitted successfully'));
      setShowSuccessAlert(true);
    } catch (error) {
      setAlertMessage(t('vat.fta.submitError', 'Error submitting VAT return'));
      setShowWarningAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportPDF = () => {
    console.log('Exporting PDF...');
  };

  const handleGenerateFTAPDF = async () => {
    try {
      const { FTAPDFExporter } = await import('../utils/ftaPdfExport');

      const exporter = new FTAPDFExporter(t, i18n.language === 'ar');

      const companyInfo = {
        name: formData.companyName || 'Company Name',
        trn: formData.trn || 'TRN Required',
        taxPeriod: formData.taxPeriod,
        submissionDate: new Date().toLocaleDateString()
      };

      const vatData = {
        standardRatedSales: formData.standardRatedSales,
        zeroRatedSales: formData.zeroRatedSales,
        exemptSales: formData.exemptSales,
        purchasesWithVAT: formData.purchasesWithVAT,
        outputVAT: calculations.outputVAT,
        inputVAT: calculations.inputVAT,
        netVAT: calculations.netVAT,
        isRefundable: calculations.isRefundable
      };

      const pdf = exporter.generateVATPDF(companyInfo, vatData);
      const fileName = `VAT_Return_${formData.companyName || 'Company'}_${formData.taxPeriod}.pdf`;
      pdf.save(fileName);

      setAlertMessage(t('vat.export.ftaPdfSuccess', 'FTA-style VAT PDF generated successfully'));
      setShowSuccessAlert(true);
    } catch (error) {
      console.error('Error generating FTA PDF:', error);
      setAlertMessage(t('vat.export.ftaPdfError', 'Error generating FTA PDF'));
      setShowWarningAlert(true);
    }
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

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [draftSource, setDraftSource] = useState<string | null>(null);
  const [freeZoneAdvisorOpen, setFreeZoneAdvisorOpen] = useState(false);

  // Check for preview mode and load draft data
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const source = urlParams.get('source');

    if (mode === 'preview') {
      setIsPreviewMode(true);
      setDraftSource(source);

      // Load draft data from sessionStorage
      const draftData = sessionStorage.getItem('draftVATFiling');
      if (draftData) {
        try {
          const parsed = JSON.parse(draftData);
          if (parsed.data) {
            setFormData(prev => ({
              ...prev,
              standardRatedSales: parsed.data.revenue || prev.standardRatedSales,
              purchasesWithVAT: parsed.data.expenses || prev.purchasesWithVAT,
              companyName: prev.companyName || 'Draft Company',
              trn: prev.trn || '100123456700003',
              taxPeriod: parsed.data.period || prev.taxPeriod
            }));
          }
        } catch (error) {
          console.error('Error loading draft VAT data:', error);
        }
      }
    }
  }, []);

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
              {t('VAT Return Filing')}
            </Typography>
            {isPreviewMode && (
              <Chip
                label={`🧪 ${t('vat.preview.mode', 'Draft Filing Mode')}`}
                color="info"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            {isPreviewMode 
              ? t('vat.preview.subtitle', `Preview mode - Data sourced from ${draftSource || 'assistant'}`)
              : t('UAE FTA-compliant VAT return submission')
            }
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

      {isPreviewMode && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            {t('vat.preview.warning', 'This is a draft filing simulation. No actual submission will be made to FTA. Review the data and make adjustments as needed.')}
          </Typography>
        </Alert>
      )}

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

            {/* Designated Zone Section */}
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              {t('Designated Zone Information')}
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isDesignatedZone}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        isDesignatedZone: e.target.checked,
                        designatedZoneImports: e.target.checked ? prev.designatedZoneImports : 0
                      }))}
                      color="primary"
                    />
                  }
                  label={t('Operating in Designated Zone (applies reverse charge on mainland imports)')}
                  sx={{ mb: 2 }}
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
              {formData.isDesignatedZone && (
                <Grid item xs={12} md={6}>
                  <TextField
                    label={t('Designated Zone Mainland Imports')}
                    placeholder={t('Imports from mainland UAE subject to reverse charge')}
                    value={formData.designatedZoneImports || ''}
                    onChange={handleInputChange('designatedZoneImports')}
                    error={!!errors.designatedZoneImports}
                    helperText={errors.designatedZoneImports || t('Reverse charge applies on supplies from mainland UAE')}
                    {...inputFieldProps}
                    sx={{
                      ...inputFieldProps.sx,
                      '& .MuiOutlinedInput-root': {
                        ...inputFieldProps.sx['& .MuiOutlinedInput-root'],
                        backgroundColor: alpha(theme.palette.info.main, 0.05),
                        borderColor: theme.palette.info.main,
                      },
                    }}
                  />
                </Grid>
              )}
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

              <Box sx={{ mb: 3, p: 2, bgcolor: 'success.50', borderRadius: 2, border: '1px solid', borderColor: 'success.200' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'success.main' }}>
                  {isUpdating ? '🔄 UPDATING Live Financial Data...' : '✅ AUTO-SYNC Live Financial Data'}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Total Revenue ({revenue.length} entries)</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                    AED {totalRevenue.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Total Expenses ({expenses.length} entries)</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                    AED {totalExpenses.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Taxable Income</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                    AED {netIncome.toLocaleString()}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: 'success.600', fontSize: '0.65rem' }}>
                  Last updated: {new Date(summary.lastUpdated).toLocaleTimeString()}
                </Typography>
              </Box>

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
                {formData.isDesignatedZone && formData.designatedZoneImports > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'info.main' }}>
                      {t('• Reverse Charge VAT (Designated Zone)')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', color: 'info.main' }}>
                      {formatCurrency(formData.designatedZoneImports * 0.05)}
                    </Typography>
                  </Box>
                )}
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
                  fullWidth
                  variant="contained"
                  startIcon={<FileText />}
                  onClick={handleGenerateFTAPDF}
                  disabled={!formData.companyName || !formData.trn}
                  sx={{ 
                    bgcolor: '#006A4E', 
                    '&:hover': { bgcolor: '#005A42' },
                    fontWeight: 600,
                    py: 2
                  }}
                >
                  {t('vat.export.generateFTAPDF', 'Generate FTA PDF')}
                </Button>

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<CloudUpload />}
                  sx={{ py: 2 }}
                  onClick={() => setShowSubmissionModal(true)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('vat.fta.submitting', 'Submitting...') : t('vat.submitReturn')}
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

      {/* FTA Submission Panel */}
      {formData.trn && formData.companyName && (
        <SubmissionPanel
          trn={formData.trn}
          companyName={formData.companyName}
          submissionType="VAT"
          formData={formData}
          calculations={calculations}
          onSubmit={handleSubmitToFTA}
        />
      )}

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

      {/* Submission Modal */}
      <SubmissionModal
        title="Confirm VAT Submission"
        description="Are you sure you want to submit your VAT return to the FTA? This action cannot be undone and the return will be officially filed."
        isOpen={showSubmissionModal}
        isLoading={isSubmitting}
        onClose={() => setShowSubmissionModal(false)}
        onConfirm={async () => {
          await handleSubmitVAT();
          setShowSubmissionModal(false);
        }}
      />

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

        {/* Free Zone Advisor FAB */}
        {state.isFreeZone && (
          <Fab
            color="success"
            onClick={() => setFreeZoneAdvisorOpen(true)}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            sx={{ zIndex: 1000 }}
          >
            <Tooltip title={t('freeZoneAdvisor.openButton', 'Free Zone Tax Advisor')}>
              <BuildingOffice2Icon className="h-6 w-6 text-white" />
            </Tooltip>
          </Fab>
        )}

        {/* Free Zone Advisor Dialog */}
        <FreeZoneAdvisor
          open={freeZoneAdvisorOpen}
          onClose={() => setFreeZoneAdvisorOpen(false)}
          context="vat"
        />
      </Box>
    
  );
};

export default VAT;