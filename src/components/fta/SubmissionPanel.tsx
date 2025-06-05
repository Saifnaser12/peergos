
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';

interface SubmissionPanelProps {
  trn: string;
  companyName: string;
  submissionType: 'CIT' | 'VAT';
  formData: any;
  calculations: any;
  onSubmit: () => Promise<void>;
  disabled?: boolean;
}

const SubmissionPanel: React.FC<SubmissionPanelProps> = ({
  trn,
  companyName,
  submissionType,
  formData,
  calculations,
  onSubmit,
  disabled = false
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  // Check if tax agent certificate and payment slip are uploaded
  const taxAgentUploaded = localStorage.getItem(`tax_agent_cert_${trn}`) !== null;
  const paymentSlipUploaded = localStorage.getItem(`payment_slip_${trn}`) !== null;
  
  const canSubmit = !disabled && trn && companyName && taxAgentUploaded && paymentSlipUploaded;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit();
      
      // Mock submission result
      const result = {
        referenceNumber: `FTA-${submissionType}-${Date.now()}`,
        filingPeriod: formData.taxPeriod || `${new Date().getFullYear()}-Q${Math.ceil((new Date().getMonth() + 1) / 3)}`,
        amount: submissionType === 'VAT' ? calculations.netVAT : calculations.citPayable,
        submissionDate: new Date().toISOString(),
        status: 'Submitted Successfully'
      };
      
      setSubmissionResult(result);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  };

  return (
    <>
      <Paper sx={{ p: 3, mt: 3, border: '2px solid', borderColor: 'primary.main', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CloudUploadIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t('fta.submission.title', `Submit ${submissionType} to FTA`)}
          </Typography>
          <Tooltip title={t('fta.simulation.tooltip', 'Simulation only – not connected to FTA')}>
            <InfoIcon sx={{ ml: 1, fontSize: 16, color: 'text.secondary' }} />
          </Tooltip>
        </Box>

        {/* Prerequisites Check */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
            {t('fta.submission.prerequisites', 'Prerequisites:')}
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {taxAgentUploaded ? (
                <CheckCircleIcon sx={{ color: 'success.main', mr: 1, fontSize: 20 }} />
              ) : (
                <WarningIcon sx={{ color: 'warning.main', mr: 1, fontSize: 20 }} />
              )}
              <Typography variant="body2">
                {t('fta.submission.taxAgentCert', 'Tax Agent Certificate')}
              </Typography>
              {taxAgentUploaded && (
                <Chip label={t('common.uploaded', 'Uploaded')} size="small" color="success" sx={{ ml: 1 }} />
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {paymentSlipUploaded ? (
                <CheckCircleIcon sx={{ color: 'success.main', mr: 1, fontSize: 20 }} />
              ) : (
                <WarningIcon sx={{ color: 'warning.main', mr: 1, fontSize: 20 }} />
              )}
              <Typography variant="body2">
                {t('fta.submission.paymentSlip', 'Payment Slip / Bank Receipt')}
              </Typography>
              {paymentSlipUploaded && (
                <Chip label={t('common.uploaded', 'Uploaded')} size="small" color="success" sx={{ ml: 1 }} />
              )}
            </Box>
          </Box>
        </Box>

        {/* Warning if requirements not met */}
        {!canSubmit && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {!taxAgentUploaded || !paymentSlipUploaded
              ? t('fta.submission.missingDocuments', 'Please upload both Tax Agent Certificate and Payment Slip before submitting.')
              : t('fta.submission.missingInfo', 'Please complete all required information.')
            }
          </Alert>
        )}

        {/* Submission Summary */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
            {t('fta.submission.summary', 'Submission Summary:')}
          </Typography>
          <Typography variant="body2">
            <strong>{t('common.company')}:</strong> {companyName}
          </Typography>
          <Typography variant="body2">
            <strong>{t('common.trn')}:</strong> {trn}
          </Typography>
          <Typography variant="body2">
            <strong>{t('fta.submission.type')}:</strong> {submissionType}
          </Typography>
          {submissionType === 'VAT' && (
            <Typography variant="body2">
              <strong>{t('fta.submission.vatDue')}:</strong> {formatCurrency(calculations?.netVAT || 0)}
            </Typography>
          )}
          {submissionType === 'CIT' && (
            <Typography variant="body2">
              <strong>{t('fta.submission.citDue')}:</strong> {formatCurrency(calculations?.citPayable || 0)}
            </Typography>
          )}
        </Box>

        {/* Submit Button */}
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          sx={{ 
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
            }
          }}
        >
          {isSubmitting 
            ? t('fta.submission.submitting', 'Submitting to FTA...')
            : t('fta.submission.submit', `Submit ${submissionType} to FTA`)
          }
        </Button>
      </Paper>

      {/* Success Dialog */}
      <Dialog 
        open={showSuccessDialog} 
        onClose={() => setShowSuccessDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', color: 'success.main' }}>
          <CheckCircleIcon sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t('fta.submission.success.title', 'Submission Successful')}
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          {submissionResult && (
            <Box sx={{ textAlign: 'center' }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                {t('fta.submission.success.message', 'Your tax return has been successfully submitted to the Federal Tax Authority.')}
              </Alert>
              
              <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>{t('fta.submission.referenceNumber')}:</strong> {submissionResult.referenceNumber}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>{t('fta.submission.filingPeriod')}:</strong> {submissionResult.filingPeriod}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>{t('fta.submission.amount')}:</strong> {formatCurrency(submissionResult.amount)}
                </Typography>
                <Typography variant="body1">
                  <strong>{t('fta.submission.submissionDate')}:</strong> {new Date(submissionResult.submissionDate).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            onClick={() => setShowSuccessDialog(false)}
            variant="contained"
            size="large"
            sx={{ minWidth: 120 }}
          >
            {t('common.close', 'Close')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SubmissionPanel;
