import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  IconButton,
  Divider,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  InputAdornment,
  Tooltip,
  Menu,
  Fab
} from '@mui/material';
import {
  Upload as UploadIcon,
  Download as DownloadIcon,
  Receipt as ReceiptIcon,
  Calculate as CalculateIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
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
import { useTranslation } from 'react-i18next';
import { TaxCalculator } from '../utils/calculations/tax';
import { Validator } from '../utils/validation';
import SubmissionHistory from '../components/SubmissionHistory';
import FTAIntegrationStatus from '../components/FTAIntegrationStatus';
import TaxAgentSelector from '../components/TaxAgentSelector';
import SubmissionPanel from '../components/fta/SubmissionPanel';
import SubmissionModal from '../components/SubmissionModal';
import { ftaService } from '../services/ftaService';
import { useTaxAgent } from '../context/TaxAgentContext';
import { useFinance } from '../context/FinanceContext';
import { useFinancialSync } from '../hooks/useFinancialSync';
import FreeZoneAdvisor from '../components/FreeZoneAdvisor';

interface CITFormData {
  revenue: number;
  expenses: number;
  taxAdjustments: number;
  exemptIncome: number;
  carriedForwardLosses: number;
  smallBusinessRelief: boolean;
  taxGroupElection: boolean;
  companyName: string;
  trn: string;
  financialYearEnd: string;
}

interface CITCalculation {
  netProfit: number;
  taxableIncome: number;
  allowedLosses: number;
  citPayable: number;
  effectiveRate: number;
  smallBusinessReliefApplied: boolean;
  isQFZP?: boolean;
  qualifyingIncome?: number;
  nonQualifyingIncome?: number;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
}

const CIT: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { selectedAgent, uploadedCertificate } = useTaxAgent();
  const { revenue, expenses } = useFinance();
  const { summary, isUpdating, totalRevenue, totalExpenses, netIncome } = useFinancialSync();

  const [formData, setFormData] = useState<CITFormData>({
    revenue: totalRevenue,
    expenses: totalExpenses,
    taxAdjustments: 0,
    exemptIncome: 0,
    carriedForwardLosses: 0,
    smallBusinessRelief: false,
    taxGroupElection: false,
    companyName: '',
    trn: '',
    financialYearEnd: ''
  });

  // Auto-update financial data when accounting entries change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      revenue: totalRevenue,
      expenses: totalExpenses
    }));
  }, [totalRevenue, totalExpenses]);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [draftSource, setDraftSource] = useState<string | null>(null);
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
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
      const draftData = sessionStorage.getItem('draftCITFiling');
      if (draftData) {
        try {
          const parsed = JSON.parse(draftData);
          if (parsed.data) {
            setFormData(prev => ({
              ...prev,
              revenue: parsed.data.revenue || prev.revenue,
              expenses: parsed.data.expenses || prev.expenses,
              companyName: prev.companyName || 'Draft Company',
              trn: prev.trn || '100123456700003'
            }));
          }
        } catch (error) {
          console.error('Error loading draft CIT data:', error);
        }
      }
    }
  }, []);

  // Calculate CIT based on form data
  const citCalculation = useMemo((): CITCalculation => {
    const netProfit = formData.revenue - formData.expenses;
    const adjustedProfit = netProfit + formData.taxAdjustments - formData.exemptIncome;

    // Cap carried forward losses at 75% of adjusted profit
    const maxAllowedLosses = Math.max(0, adjustedProfit * 0.75);
    const allowedLosses = Math.min(formData.carriedForwardLosses, maxAllowedLosses);

    const taxableIncome = Math.max(0, adjustedProfit - allowedLosses);

    // Small Business Relief: 0% if revenue ≤ AED 3M and relief claimed
    const smallBusinessReliefApplied = formData.smallBusinessRelief && formData.revenue <= 3000000;

    let citPayable = 0;

    // Check for Free Zone QFZP status from localStorage (Setup data)
    const setupData = localStorage.getItem('setupData');
    let isQFZP = false;
    let qualifyingIncome = 0;
    let nonQualifyingIncome = taxableIncome;

    if (setupData) {
      try {
        const parsed = JSON.parse(setupData);
        isQFZP = parsed.isQFZP || false;

        if (isQFZP && parsed.freeZoneIncome) {
          // For QFZPs, split income into qualifying and non-qualifying
          qualifyingIncome = Math.min(taxableIncome, parsed.freeZoneIncome.qualifying || 0);
          nonQualifyingIncome = Math.max(0, taxableIncome - qualifyingIncome);
        }
      } catch (error) {
        console.warn('Error parsing setup data for QFZP calculation:', error);
      }
    }

    if (!smallBusinessReliefApplied) {
      if (isQFZP) {
        // QFZP Treatment:
        // - 0% on Qualifying Income
        // - 9% on Non-Qualifying Income above AED 375k
        if (nonQualifyingIncome > 375000) {
          citPayable = (nonQualifyingIncome - 375000) * 0.09;
        }
      } else {
        // Standard CIT: 9% on total taxable income above AED 375k
        if (taxableIncome > 375000) {
          citPayable = (taxableIncome - 375000) * 0.09;
        }
      }
    }

    const effectiveRate = taxableIncome > 0 ? (citPayable / taxableIncome) * 100 : 0;

    return {
      netProfit,
      taxableIncome,
      allowedLosses,
      citPayable,
      effectiveRate,
      smallBusinessReliefApplied,
      isQFZP,
      qualifyingIncome,
      nonQualifyingIncome
    };
  }, [formData]);

  // Validation
  useEffect(() => {
    const errors: Record<string, string> = {};

    if (formData.companyName && formData.companyName.length < 2) {
      errors.companyName = t('validation.companyNameTooShort');
    }

    if (formData.trn) {
      const trnValidation = Validator.validateTRN(formData.trn);
      if (!trnValidation.isValid) {
        errors.trn = trnValidation.errors[0];
      }
    }

    if (formData.revenue < 0) {
      errors.revenue = t('validation.amountNegative');
    }

    if (formData.expenses < 0) {
      errors.expenses = t('validation.amountNegative');
    }

    if (formData.carriedForwardLosses < 0) {
      errors.carriedForwardLosses = t('validation.amountNegative');
    }

    if (formData.smallBusinessRelief && formData.revenue > 3000000) {
      errors.smallBusinessRelief = t('validation.smallBusinessReliefNotEligible');
    }

    setValidationErrors(errors);
  }, [formData, t]);

  const handleInputChange = (field: keyof CITFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'checkbox' 
      ? event.target.checked 
      : event.target.type === 'number'
      ? parseFloat(event.target.value) || 0
      : event.target.value;

    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        const allowedTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
          'text/csv'
        ];

        if (!allowedTypes.includes(file.type)) {
          setAlertMessage(t('cit.upload.invalidFileType'));
          setShowWarningAlert(true);
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          setAlertMessage(t('cit.upload.fileTooLarge'));
          setShowWarningAlert(true);
          continue;
        }

        const uploadedFile: UploadedFile = {
          id: Date.now().toString() + Math.random().toString(36),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date().toISOString()
        };

        setUploadedFiles(prev => [...prev, uploadedFile]);
      }

      setAlertMessage(t('cit.upload.success'));
      setShowSuccessAlert(true);
    } catch (error) {
      setAlertMessage(t('cit.upload.error'));
      setShowWarningAlert(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    // Simulate calculation delay for UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsCalculating(false);
    setAlertMessage(t('cit.calculation.complete'));
    setShowSuccessAlert(true);
  };

  const handleExportPDF = () => {
    // Simulate PDF export
    const element = document.createElement('a');
    const file = new Blob([`CIT Return Summary\n\nCompany: ${formData.companyName}\nTRN: ${formData.trn}\nRevenue: AED ${formData.revenue.toLocaleString()}\nCIT Payable: AED ${citCalculation.citPayable.toLocaleString()}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `CIT_Return_${formData.companyName}_${new Date().getFullYear()}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setAlertMessage(t('cit.export.pdfSuccess'));
    setShowSuccessAlert(true);
  };

  const handleGenerateFTAPDF = async () => {
    try {
      const { FTAPDFExporter } = await import('../utils/ftaPdfExport');

      const exporter = new FTAPDFExporter(t, i18n.language === 'ar');

      const companyInfo = {
        name: formData.companyName || 'Company Name',
        trn: formData.trn || 'TRN Required',
        taxPeriod: formData.financialYearEnd || new Date().getFullYear().toString(),
        submissionDate: new Date().toLocaleDateString()
      };

      const citData = {
        revenue: formData.revenue,
        expenses: formData.expenses,
        netProfit: citCalculation.netProfit,
        taxableIncome: citCalculation.taxableIncome,
        citPayable: citCalculation.citPayable,
        effectiveRate: citCalculation.effectiveRate,
        smallBusinessReliefApplied: citCalculation.smallBusinessReliefApplied,
        taxAdjustments: formData.taxAdjustments,
        exemptIncome: formData.exemptIncome,
        carriedForwardLosses: formData.carriedForwardLosses
      };

      const pdf = exporter.generateCITPDF(companyInfo, citData);
      const fileName = `CIT_Return_${formData.companyName || 'Company'}_${new Date().getFullYear()}.pdf`;
      pdf.save(fileName);

      setAlertMessage(t('cit.export.ftaPdfSuccess', 'FTA-style PDF generated successfully'));
      setShowSuccessAlert(true);
    } catch (error) {
      console.error('Error generating FTA PDF:', error);
      setAlertMessage(t('cit.export.ftaPdfError', 'Error generating FTA PDF'));
      setShowWarningAlert(true);
    }
  };

  const handleExportExcel = () => {
    // Simulate Excel export
    const csvContent = `Field,Value\nRevenue,${formData.revenue}\nExpenses,${formData.expenses}\nNet Profit,${citCalculation.netProfit}\nTaxable Income,${citCalculation.taxableIncome}\nCIT Payable,${citCalculation.citPayable}`;
    const element = document.createElement('a');
    const file = new Blob([csvContent], {type: 'text/csv'});
    element.href = URL.createObjectURL(file);
    element.download = `CIT_Data_${formData.companyName}_${new Date().getFullYear()}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setAlertMessage(t('cit.export.excelSuccess'));
    setShowSuccessAlert(true);
  };

  const handleSubmitToFTA = async () => {
    if (!formData.companyName || !formData.trn) {
      setAlertMessage(t('cit.fta.missingInfo'));
      setShowWarningAlert(true);
      return;
    }

    if (!selectedAgent || !uploadedCertificate) {
      setAlertMessage(t('cit.fta.missingTaxAgent', 'Please select a tax agent and upload their certificate before submitting'));
      setShowWarningAlert(true);
      return;
    }

    setIsCalculating(true);

    try {
      const submissionData = {
        trn: formData.trn,
        companyName: formData.companyName,
        submissionType: 'CIT' as const,
        taxPeriod: `${new Date().getFullYear()}-${formData.financialYearEnd}`,
        data: {
          ...formData,
          calculations: citCalculation,
          submittedAt: new Date().toISOString()
        }
      };

      const response = await ftaService.submitCIT(submissionData);

      setAlertMessage(t('cit.fta.submitSuccess', { 
        referenceNumber: response.referenceNumber 
      }));
      setShowSuccessAlert(true);

    } catch (error: any) {
      setAlertMessage(error.message || t('cit.fta.submitError'));
      setShowWarningAlert(true);
    } finally {
      setIsCalculating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-AE' : 'en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 300 }}>
                {t('dashboard.cit.title')}
              </Typography>
              {isPreviewMode && (
                <Chip
                  label={`🧪 ${t('cit.preview.mode', 'Draft Filing Mode')}`}
                  color="info"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              )}
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
              {isPreviewMode 
                ? t('cit.preview.subtitle', `Preview mode - Data sourced from ${draftSource || 'assistant'}`)
                : t('dashboard.cit.subtitle')
              }
            </Typography>
          </Box>
          {formData.trn && (
            <FTAIntegrationStatus trn={formData.trn} variant="badge" />
          )}
        </Box>

        {isPreviewMode && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              {t('cit.preview.warning', 'This is a draft filing simulation. No actual submission will be made to FTA. Review the data and make adjustments as needed.')}
            </Typography>
          </Alert>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Input Form */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
            <CardHeader 
              title={t('cit.form.title')}
              avatar={<ReceiptIcon color="primary" />}
            />
            <CardContent>
              <Grid container spacing={3}>
                {/* Company Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                    {t('cit.form.companyInfo')}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('cit.form.companyName')}
                    value={formData.companyName}
                    onChange={handleInputChange('companyName')}
                    error={!!validationErrors.companyName}
                    helperText={validationErrors.companyName}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('cit.form.trn')}
                    value={formData.trn}
                    onChange={handleInputChange('trn')}
                    error={!!validationErrors.trn}
                    helperText={validationErrors.trn}
                    inputProps={{ maxLength: 15 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label={t('cit.form.financialYearEnd')}
                    value={formData.financialYearEnd}
                    onChange={handleInputChange('financialYearEnd')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                {/* Financial Data */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                    {t('cit.form.financialData')}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label={t('cit.form.revenue')}
                    value={formData.revenue}
                    onChange={handleInputChange('revenue')}
                    error={!!validationErrors.revenue}
                    helperText={validationErrors.revenue || `Live data: AED ${totalRevenue.toLocaleString()}`}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">AED</InputAdornment>,
                    }}
                  />
                  <Box sx={{ mt: 1, p: 2, bgcolor: 'success.50', borderRadius: 1, border: '1px solid', borderColor: 'success.200' }}>
                    <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                      {isUpdating ? '🔄 UPDATING...' : '✅ AUTO-SYNC'}: AED {totalRevenue.toLocaleString()} from {revenue.length} transactions
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label={t('cit.form.expenses')}
                    value={formData.expenses}
                    onChange={handleInputChange('expenses')}
                    error={!!validationErrors.expenses}
                    helperText={validationErrors.expenses || `Live data: AED ${totalExpenses.toLocaleString()}`}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">AED</InputAdornment>,
                    }}
                  />
                  <Box sx={{ mt: 1, p: 2, bgcolor: 'success.50', borderRadius: 1, border: '1px solid', borderColor: 'success.200' }}>
                    <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                      {isUpdating ? '🔄 UPDATING...' : '✅ AUTO-SYNC'}: AED {totalExpenses.toLocaleString()} from {expenses.length} transactions
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label={t('cit.form.taxAdjustments')}
                    value={formData.taxAdjustments}
                    onChange={handleInputChange('taxAdjustments')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">AED</InputAdornment>,
                    }}
                    helperText={t('cit.form.taxAdjustmentsHelp')}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label={t('cit.form.exemptIncome')}
                    value={formData.exemptIncome}
                    onChange={handleInputChange('exemptIncome')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">AED</InputAdornment>,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label={t('cit.form.carriedForwardLosses')}
                    value={formData.carriedForwardLosses}
                    onChange={handleInputChange('carriedForwardLosses')}
                    error={!!validationErrors.carriedForwardLosses}
                    helperText={validationErrors.carriedForwardLosses || t('cit.form.lossesCapHelp')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">AED</InputAdornment>,
                    }}
                  />
                </Grid>

                {/* Election Options */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                    {t('cit.form.elections')}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.smallBusinessRelief}
                        onChange={handleInputChange('smallBusinessRelief')}
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1">
                          {t('cit.form.smallBusinessRelief')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t('cit.form.smallBusinessReliefHelp')}
                        </Typography>
                      </Box>
                    }
                  />
                  {validationErrors.smallBusinessRelief && (
                    <FormHelperText error sx={{ ml: 0 }}>
                      {validationErrors.smallBusinessRelief}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.taxGroupElection}
                        onChange={handleInputChange('taxGroupElection')}
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1">
                          {t('cit.form.taxGroupElection')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t('cit.form.taxGroupElectionHelp')}
                        </Typography>
                      </Box>
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* File Upload Section */}
          <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 3 }}>
            <CardHeader 
              title={t('cit.upload.title')}
              avatar={<AttachFileIcon color="primary" />}
            />
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <input
                  accept=".pdf,.xlsx,.xls,.csv"
                  style={{ display: 'none' }}
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<UploadIcon />}
                    disabled={isUploading}
                    fullWidth
                    sx={{ py: 2 }}
                  >
                    {isUploading ? t('cit.upload.uploading') : t('cit.upload.button')}
                  </Button>
                </label>
                {isUploading && <LinearProgress sx={{ mt: 1 }} />}
              </Box>

              {uploadedFiles.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    {t('cit.upload.uploadedFiles')}
                  </Typography>
                  {uploadedFiles.map((file) => (
                    <Chip
                      key={file.id}
                      label={`${file.name} (${(file.size / 1024).toFixed(1)} KB)`}
                      onDelete={() => handleRemoveFile(file.id)}
                      deleteIcon={<DeleteIcon />}
                      sx={{ mr: 1, mb: 1 }}
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Calculation Results */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ boxShadow: 3, borderRadius: 3, position: 'sticky', top: 24 }}>
            <CardHeader 
              title={t('cit.calculation.title')}
              avatar={<CalculateIcon color="primary" />}
              action={
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleCalculate}
                  disabled={isCalculating}
                  startIcon={isCalculating ? undefined : <CalculateIcon />}
                >
                  {isCalculating ? t('cit.calculation.calculating') : t('cit.calculation.calculate')}
                </Button>
              }
            />
            <CardContent>
              {isCalculating && <LinearProgress sx={{ mb: 2 }} />}

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('cit.calculation.netProfit')}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {formatCurrency(citCalculation.netProfit)}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('cit.calculation.allowedLosses')}
                </Typography>
                <Typography variant="body1">
                  {formatCurrency(citCalculation.allowedLosses)}
                </Typography>
                {formData.carriedForwardLosses > citCalculation.allowedLosses && (
                  <Typography variant="caption" color="warning.main">
                    {t('cit.calculation.lossesCapped')}
                  </Typography>
                )}
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('cit.calculation.taxableIncome')}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {formatCurrency(citCalculation.taxableIncome)}
                </Typography>

                {/* QFZP Income Breakdown */}
                {citCalculation.isQFZP && (
                  <Box sx={{ mt: 1, p: 2, bgcolor: 'info.50', borderRadius: 1, border: '1px solid', borderColor: 'info.200' }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'info.main', display: 'block' }}>
                      🏢 FREE ZONE QFZP STATUS
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'info.main', fontSize: '0.75rem' }}>
                      Qualifying Income (0% rate): AED {citCalculation.qualifyingIncome?.toLocaleString() || 0}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', color: 'info.main', fontSize: '0.75rem' }}>
                      Non-Qualifying Income (9% rate): AED {citCalculation.nonQualifyingIncome?.toLocaleString() || 0}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ mt: 1, p: 2, bgcolor: 'success.50', borderRadius: 1, border: '1px solid', borderColor: 'success.200' }}>
                  <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                    {isUpdating ? '🔄 UPDATING...' : '✅ AUTO-SYNC'} Live Taxable Income: AED {netIncome.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: 'success.main', fontSize: '0.65rem' }}>
                    Updates automatically from Accounting module • Last: {new Date(summary.lastUpdated).toLocaleTimeString()}
                  </Typography>
                </Box>

                {/* Free Zone Income Split Display */}
                {citCalculation.isQFZP && (
                  <Box sx={{ mt: 2, p: 3, bgcolor: 'blue.50', borderRadius: 2, border: '1px solid', borderColor: 'blue.200' }}>
                    <Typography variant="h6" sx={{ mb: 2, color: 'blue.main', fontWeight: 600 }}>
                      🏢 {t('cit.freeZone.incomeBreakdown', 'Free Zone Income Breakdown')}
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ p: 2, bgcolor: 'green.50', borderRadius: 1, border: '1px solid', borderColor: 'green.200' }}>
                          <Typography variant="subtitle2" sx={{ color: 'green.main', fontWeight: 600, mb: 1 }}>
                            {t('cit.freeZone.qualifyingIncome', 'Qualifying Income')} (0% CIT)
                          </Typography>
                          <Typography variant="h6" sx={{ color: 'green.main', fontWeight: 700 }}>
                            AED {citCalculation.qualifyingIncome?.toLocaleString() || 0}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'green.600', fontSize: '0.75rem' }}>
                            {t('cit.freeZone.qualifyingDescription', 'Exports, intra-zone trade, qualifying activities')}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box sx={{ p: 2, bgcolor: 'orange.50', borderRadius: 1, border: '1px solid', borderColor: 'orange.200' }}>
                          <Typography variant="subtitle2" sx={{ color: 'orange.main', fontWeight 600, mb: 1 }}>
                            {t('cit.freeZone.nonQualifyingIncome', 'Non-Qualifying Income')} (9% CIT)
                          </Typography>
                          <Typography variant="h6" sx={{ color: 'orange.main', fontWeight: 700 }}>
                            AED {citCalculation.nonQualifyingIncome?.toLocaleString() || 0}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'orange.600', fontSize: '0.75rem' }}>
                            {t('cit.freeZone.nonQualifyingDescription', 'Mainland sales, domestic consumption')}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 2, p: 2, bgcolor: 'blue.100', borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ color: 'blue.main', fontWeight: 600, fontSize: '0.8rem' }}>
                        📄 {t('cit.freeZone.footnote', 'Includes QFZP income at 0% per FTA regulations')}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('cit.calculation.citPayable')}
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 600,
                    color: citCalculation.citPayable > 0 ? 'error.main' : 'success.main'
                  }}
                >
                  {formatCurrency(citCalculation.citPayable)}
                </Typography>
                {citCalculation.smallBusinessReliefApplied && (
                  <Chip
                    label={t('cit.calculation.smallBusinessReliefApplied')}
                    color="success"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('cit.calculation.effectiveRate')}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {citCalculation.effectiveRate.toFixed(2)}%
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ReceiptIcon />}
                  onClick={handleGenerateFTAPDF}
                  disabled={isCalculating || !formData.companyName || !formData.trn}
                  sx={{ 
                    bgcolor: '#006A4E', 
                    '&:hover': { bgcolor: '#005A42' },
                    fontWeight: 600
                  }}
                >
                  {t('cit.export.generateFTAPDF', 'Generate FTA PDF')}
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => setShowExportDialog(true)}
                  disabled={isCalculating}
                >
                  {t('cit.export.button')}
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={() => setShowSubmissionModal(true)}
                  disabled={isCalculating || !formData.companyName || !formData.trn}
                  startIcon={<UploadIcon />}
                >
                  {isCalculating ? t('cit.fta.submitting') : t('cit.fta.submitToFTA')}
                </Button>
              </Box>

              {/* Compliance Status */}
              <Alert 
                severity={citCalculation.citPayable === 0 ? "success" : "info"}
                sx={{ mt: 2 }}
                icon={citCalculation.citPayable === 0 ? <CheckCircleIcon /> : <InfoIcon />}
              >
                <Typography variant="body2">
                  {citCalculation.citPayable === 0 
                    ? (citCalculation.isQFZP 
                        ? 'No CIT due - QFZP benefits applied to qualifying income'
                        : t('cit.compliance.noCitDue'))
                    : (citCalculation.isQFZP 
                        ? `CIT due on non-qualifying income only (QFZP)`
                        : t('cit.compliance.citDue'))
                  }
                </Typography>
              </Alert>
            </CardContent>
          </Card>

          {/* Tax Agent Selection */}
          <TaxAgentSelector variant="full" />
        </Grid>
      </Grid>

      {/* FTA Submission Panel */}
      {formData.trn && formData.companyName && (
        <SubmissionPanel
          trn={formData.trn}
          companyName={formData.companyName}
          submissionType="CIT"
          formData={formData}
          calculations={citCalculation}
          onSubmit={handleSubmitToFTA}
          disabled={isCalculating}
        />
      )}

      {/* Submission History */}
      {formData.trn && (
        <Box sx={{ mt: 4 }}>
          <SubmissionHistory 
            trn={formData.trn} 
            submissionType="CIT"
            maxItems={5}
          />
        </Box>
      )}

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onClose={() => setShowExportDialog(false)}>
        <DialogTitle>{t('cit.export.title')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3 }}>
            {t('cit.export.description')}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportPDF}
              fullWidth
            >
              {t('cit.export.pdf')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportExcel}
              fullWidth
            >
              {t('cit.export.excel')}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExportDialog(false)}>
            {t('common.cancel')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Submission Modal */}
      <SubmissionModal
        title="Confirm CIT Submission"
        description="Are you sure you want to submit your Corporate Income Tax return to the FTA? This action cannot be undone and the return will be officially filed."
        isOpen={showSubmissionModal}
        isLoading={isCalculating}
        onClose={() => setShowSubmissionModal(false)}
        onConfirm={async () => {
          await handleSubmitToFTA();
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

      <Snackbar
        open={showWarningAlert}
        autoHideDuration={4000}
        onClose={() => setShowWarningAlert(false)}
      >
        <Alert severity="warning" onClose={() => setShowWarningAlert(false)}>
          {alertMessage}
        </Alert>
      </Snackbar>

        {/* Free Zone Advisor FAB */}
        {/* Replace `state.isFreeZone` with a condition based on your actual state */}
        {/* For example: `{isFreeZone}` - assuming you have a state variable called `isFreeZone` */}
        {/* To make it work, you might want to get the value from TaxContext like `const { state } = useTax();` */}
        {/* and then put `state.isFreeZone && (` */}
        {false && (
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
        {/* Pass other relevant props as needed, e.g., context or initial data */}
        <FreeZoneAdvisor
          open={freeZoneAdvisorOpen}
          onClose={() => setFreeZoneAdvisorOpen(false)}
          context="cit"
        />
      </Box>
    </div>
  );
};

export default CIT;