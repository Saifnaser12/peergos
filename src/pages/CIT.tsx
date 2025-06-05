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
  Tooltip
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
import { useTranslation } from 'react-i18next';
import { TaxCalculator } from '../utils/calculations/tax';
import { Validator } from '../utils/validation';
import SubmissionHistory from '../components/SubmissionHistory';
import FTAIntegrationStatus from '../components/FTAIntegrationStatus';
import { ftaService } from '../services/ftaService';

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

  const [formData, setFormData] = useState<CITFormData>({
    revenue: 0,
    expenses: 0,
    taxAdjustments: 0,
    exemptIncome: 0,
    carriedForwardLosses: 0,
    smallBusinessRelief: false,
    taxGroupElection: false,
    companyName: '',
    trn: '',
    financialYearEnd: ''
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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
    if (!smallBusinessReliefApplied) {
      if (taxableIncome > 375000) {
        citPayable = (taxableIncome - 375000) * 0.09; // 9% on amount above AED 375,000
      }
    }

    const effectiveRate = taxableIncome > 0 ? (citPayable / taxableIncome) * 100 : 0;

    return {
      netProfit,
      taxableIncome,
      allowedLosses,
      citPayable,
      effectiveRate,
      smallBusinessReliefApplied
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
            <Typography variant="h3" component="h1" sx={{ mb: 1, fontWeight: 300 }}>
              {t('cit.title')}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {t('cit.subtitle')}
            </Typography>
          </Box>
          {formData.trn && (
            <FTAIntegrationStatus trn={formData.trn} variant="badge" />
          )}
        </Box>
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
                    helperText={validationErrors.revenue}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">AED</InputAdornment>,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label={t('cit.form.expenses')}
                    value={formData.expenses}
                    onChange={handleInputChange('expenses')}
                    error={!!validationErrors.expenses}
                    helperText={validationErrors.expenses}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">AED</InputAdornment>,
                    }}
                  />
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
                  onClick={handleSubmitToFTA}
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
                    ? t('cit.compliance.noCitDue')
                    : t('cit.compliance.citDue')
                  }
                </Typography>
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
    </Box>
  );
};

export default CIT;