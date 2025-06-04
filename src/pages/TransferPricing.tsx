
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Divider,
  useTheme,
  alpha,
  Fab,
  Zoom
} from '@mui/material';
import {
  Save as SaveIcon,
  FileDownload as ExportIcon,
  Upload as UploadIcon,
  Assessment as ReportIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { CompanyInfoForm } from '../components/transferPricing/CompanyInfoForm';
import { RelatedPartyForm } from '../components/transferPricing/RelatedPartyForm';
import { TransactionTable } from '../components/transferPricing/TransactionTable';
import { ComplianceChecklist } from '../components/transferPricing/ComplianceChecklist';
import { DocumentUploader } from '../components/transferPricing/DocumentUploader';
import { TransferPricingSummary } from '../components/transferPricing/TransferPricingSummary';
import { ExportControls } from '../components/transferPricing/ExportControls';
import { TransferPricingDisclosure, CompanyInfo, RelatedParty, IntercompanyTransaction, ComplianceAnswers, TransferPricingDocument } from '../types/transferPricing';
import { useTheme as useAppTheme } from '../context/ThemeContext';

const steps = [
  'companyInfo',
  'relatedParties', 
  'transactions',
  'compliance',
  'documents',
  'summary'
];

const TransferPricing: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { isDarkMode } = useAppTheme();
  
  const [activeStep, setActiveStep] = useState(0);
  const [disclosure, setDisclosure] = useState<TransferPricingDisclosure>({
    id: '',
    companyInfo: {
      legalName: '',
      trn: '',
      fiscalYearStart: '',
      fiscalYearEnd: '',
      isPartOfTaxGroup: false,
      isPartOfMultinationalGroup: false
    },
    relatedParties: [],
    transactions: [],
    complianceAnswers: {
      requiresMasterFile: false,
      hasPreparedLocalFile: false,
      meetsConsolidatedThreshold: false,
      hasCbCRFiled: false,
      hasTransferPricingPolicy: false,
      hasDocumentedArmLength: false,
      hasEconomicAnalysis: false
    },
    documents: [],
    summary: {
      totalTransactionsByType: {} as any,
      totalValue: 0,
      riskFlags: [],
      complianceScore: 0,
      requiredDocuments: [],
      uploadedDocuments: []
    },
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCompanyInfoUpdate = (companyInfo: CompanyInfo) => {
    setDisclosure(prev => ({
      ...prev,
      companyInfo,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleRelatedPartiesUpdate = (relatedParties: RelatedParty[]) => {
    setDisclosure(prev => ({
      ...prev,
      relatedParties,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleTransactionsUpdate = (transactions: IntercompanyTransaction[]) => {
    setDisclosure(prev => ({
      ...prev,
      transactions,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleComplianceUpdate = (complianceAnswers: ComplianceAnswers) => {
    setDisclosure(prev => ({
      ...prev,
      complianceAnswers,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleDocumentsUpdate = (documents: TransferPricingDocument[]) => {
    setDisclosure(prev => ({
      ...prev,
      documents,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Implement save to backend
      console.log('Saving disclosure:', disclosure);
      setError(null);
    } catch (err) {
      setError('Failed to save disclosure');
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <CompanyInfoForm
            companyInfo={disclosure.companyInfo}
            onUpdate={handleCompanyInfoUpdate}
          />
        );
      case 1:
        return (
          <RelatedPartyForm
            relatedParties={disclosure.relatedParties}
            onUpdate={handleRelatedPartiesUpdate}
          />
        );
      case 2:
        return (
          <TransactionTable
            transactions={disclosure.transactions}
            relatedParties={disclosure.relatedParties}
            onUpdate={handleTransactionsUpdate}
          />
        );
      case 3:
        return (
          <ComplianceChecklist
            complianceAnswers={disclosure.complianceAnswers}
            onUpdate={handleComplianceUpdate}
          />
        );
      case 4:
        return (
          <DocumentUploader
            documents={disclosure.documents}
            complianceAnswers={disclosure.complianceAnswers}
            onUpdate={handleDocumentsUpdate}
          />
        );
      case 5:
        return (
          <TransferPricingSummary
            disclosure={disclosure}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          borderRadius: 3,
          p: 4,
          mb: 3,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {t('transferPricing.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('transferPricing.subtitle')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              {t('common.save')}
            </Button>
            <ExportControls disclosure={disclosure} />
          </Box>
        </Box>

        {/* Progress Stepper */}
        <Stepper activeStep={activeStep} sx={{ mt: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{t(`transferPricing.steps.${label}`)}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Main Content */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 4 }}>
          {getStepContent(activeStep)}
        </Box>

        <Divider />

        {/* Navigation */}
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ borderRadius: 2 }}
          >
            {t('common.back')}
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={activeStep === steps.length - 1}
            sx={{ borderRadius: 2 }}
          >
            {activeStep === steps.length - 1 ? t('common.finish') : t('common.next')}
          </Button>
        </Box>
      </Paper>

      {/* Floating Action Buttons */}
      <Box sx={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Zoom in={activeStep === steps.length - 1}>
          <Fab
            color="primary"
            aria-label="export"
            sx={{ borderRadius: 2 }}
          >
            <ExportIcon />
          </Fab>
        </Zoom>
        <Zoom in={activeStep === 4}>
          <Fab
            color="secondary"
            aria-label="upload"
            sx={{ borderRadius: 2 }}
          >
            <UploadIcon />
          </Fab>
        </Zoom>
      </Box>
    </Container>
  );
};

export default TransferPricing;
