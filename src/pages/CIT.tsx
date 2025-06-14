import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  LinearProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  InputAdornment,
  Tooltip,
  Divider
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Upload as UploadIcon,
  CloudUpload as CloudUploadIcon,
  Verified as VerifiedIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Calculate as CalculateIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import {
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { alpha, useTheme } from '@mui/material/styles';

interface CITWorkflowData {
  revenueRecording: {
    invoiceGeneration: boolean;
    posIntegration: boolean;
    accountingIntegration: boolean;
    manualEntryBackup: boolean;
  };
  documentManagement: {
    invoiceScanning: boolean;
    systemIntegration: boolean;
    ocrProcessing: boolean;
  };
  citCalculation: {
    ftaCompliantCalculations: boolean;
    taxPayableGenerated: boolean;
    incomeStatementGenerated: boolean;
    standardizedBalanceSheet: boolean;
  };
  submissionReporting: {
    ftaAccess: boolean;
    automaticSubmission: boolean;
    realTimeAccess: boolean;
  };
  verificationPayment: {
    taxAgentSelected: boolean;
    eSignVerification: boolean;
    smePaymentProcess: boolean;
    certificateUploaded: boolean;
    bankSlipUploaded: boolean;
  };
  dataStorage: {
    uaeCloudStorage: boolean;
    ftaLiveAccess: boolean;
    trnLinked: boolean;
  };
}

const CIT: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [workflowData, setWorkflowData] = useState<CITWorkflowData>({
    revenueRecording: {
      invoiceGeneration: false,
      posIntegration: false,
      accountingIntegration: false,
      manualEntryBackup: true
    },
    documentManagement: {
      invoiceScanning: false,
      systemIntegration: false,
      ocrProcessing: false
    },
    citCalculation: {
      ftaCompliantCalculations: false,
      taxPayableGenerated: false,
      incomeStatementGenerated: false,
      standardizedBalanceSheet: false
    },
    submissionReporting: {
      ftaAccess: false,
      automaticSubmission: false,
      realTimeAccess: false
    },
    verificationPayment: {
      taxAgentSelected: false,
      eSignVerification: false,
      smePaymentProcess: false,
      certificateUploaded: false,
      bankSlipUploaded: false
    },
    dataStorage: {
      uaeCloudStorage: true,
      ftaLiveAccess: false,
      trnLinked: false
    }
  });

  const [citData, setCitData] = useState({
    taxableIncome: 0,
    allowableDeductions: 0,
    taxPayable: 0,
    taxRate: 9, // UAE CIT rate 9%
    exemptionThreshold: 375000 // AED 375k exemption
  });

  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  const [selectedTaxAgent, setSelectedTaxAgent] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState('pending');

  const [citFormData, setCitFormData] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    taxAdjustments: 0,
    exemptIncome: 0,
    carriedForwardLosses: 0,
    smallBusinessRelief: false,
    taxGroupElection: false,
  });

  const [citCalculations, setCitCalculations] = useState({
    netProfit: 0,
    allowedLosses: 0,
    taxableIncome: 0,
    effectiveTaxRate: 0,
    finalCITPayable: 0,
  });

  const [hasAgentCertificate, setHasAgentCertificate] = useState(false);

  const workflowSteps = [
    {
      id: 1,
      title: 'Revenue Recording',
      description: 'Invoice Generation, POS Integration, Accounting System Integration',
      icon: <ReceiptIcon />,
      color: '#2196F3'
    },
    {
      id: 2,
      title: 'Document Management',
      description: 'Invoice Scanning, System Integration',
      icon: <CloudUploadIcon />,
      color: '#4CAF50'
    },
    {
      id: 3,
      title: 'CIT Calculation & Reporting',
      description: 'Calculations per FTA, Tax Payable Generation',
      icon: <CalculateIcon />,
      color: '#FF9800'
    },
    {
      id: 4,
      title: 'Submission & Reporting to FTA',
      description: 'FTA Access, Automatic Submission',
      icon: <SendIcon />,
      color: '#9C27B0'
    },
    {
      id: 5,
      title: 'Verification & Payment',
      description: 'Tax Agent Selection, E-sign Verification, Payment Process',
      icon: <PaymentIcon />,
      color: '#F44336'
    },
    {
      id: 6,
      title: 'Data Storage & Access',
      description: 'UAE Cloud Storage, FTA Live Access via TRN',
      icon: <VerifiedIcon />,
      color: '#607D8B'
    }
  ];

    const filingSteps = [
    { id: 1, title: 'Revenue & Expenses', completed: activeStep > 0, active: activeStep === 0 },
    { id: 2, title: 'Adjustments & Exemptions', completed: activeStep > 1, active: activeStep === 1 },
    { id: 3, title: 'Tax Elections', completed: activeStep > 2, active: activeStep === 2 },
    { id: 4, title: 'Supporting Documents', completed: activeStep > 3, active: activeStep === 3 },
    { id: 5, title: 'Final Calculation & Submission', completed: false, active: activeStep === 4 },
  ];

  const calculateCIT = () => {
    const { taxableIncome, exemptionThreshold, taxRate } = citData;
    const taxableAmount = Math.max(0, taxableIncome - exemptionThreshold);
    const calculatedTax = (taxableAmount * taxRate) / 100;

    setCitData(prev => ({
      ...prev,
      taxPayable: calculatedTax
    }));

    // Update calculation status
    setWorkflowData(prev => ({
      ...prev,
      citCalculation: {
        ...prev.citCalculation,
        ftaCompliantCalculations: true,
        taxPayableGenerated: true
      }
    }));
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newDocuments = Array.from(files).map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString()
      }));
      setUploadedDocuments(prev => [...prev, ...newDocuments]);

      // Update document management status
      setWorkflowData(prev => ({
        ...prev,
        documentManagement: {
          ...prev.documentManagement,
          invoiceScanning: true,
          systemIntegration: true,
          ocrProcessing: true
        }
      }));
    }
  };

  const simulateFTASubmission = () => {
    setSubmissionStatus('submitting');
    setTimeout(() => {
      setSubmissionStatus('submitted');
      setWorkflowData(prev => ({
        ...prev,
        submissionReporting: {
          ...prev.submissionReporting,
          ftaAccess: true,
          automaticSubmission: true,
          realTimeAccess: true
        }
      }));
    }, 3000);
  };

  const exportFTAPDF = () => {
    // Simulate FTA-compliant PDF generation
    const ftaData = {
      companyName: 'SME Company Ltd',
      trn: '100123456789003',
      taxYear: '2024',
      taxableIncome: citData.taxableIncome,
      exemption: citData.exemptionThreshold,
      taxPayable: citData.taxPayable,
      submissionDate: new Date().toISOString()
    };

    console.log('Generating FTA-compliant CIT PDF:', ftaData);
    alert('FTA-compliant CIT PDF generated successfully');
  };

  const renderStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: // Revenue Recording
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <ReceiptIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Revenue Sources
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={workflowData.revenueRecording.invoiceGeneration}
                        onChange={(e) => setWorkflowData(prev => ({
                          ...prev,
                          revenueRecording: {
                            ...prev.revenueRecording,
                            invoiceGeneration: e.target.checked
                          }
                        }))}
                      />
                    }
                    label="Invoice Generation System"
                  />
                  <br />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={workflowData.revenueRecording.posIntegration}
                        onChange={(e) => setWorkflowData(prev => ({
                          ...prev,
                          revenueRecording: {
                            ...prev.revenueRecording,
                            posIntegration: e.target.checked
                          }
                        }))}
                      />
                    }
                    label="POS Integration"
                  />
                  <br />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={workflowData.revenueRecording.accountingIntegration}
                        onChange={(e) => setWorkflowData(prev => ({
                          ...prev,
                          revenueRecording: {
                            ...prev.revenueRecording,
                            accountingIntegration: e.target.checked
                          }
                        }))}
                      />
                    }
                    label="Accounting System Integration"
                  />
                  <Alert severity="info" sx={{ mt: 2 }}>
                    All manual entries must be backed with proof evidence, which could be captured using a phone.
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Revenue Input
                  </Typography>
                  <TextField
                    fullWidth
                    label="Annual Taxable Income (AED)"
                    type="number"
                    value={citData.taxableIncome}
                    onChange={(e) => setCitData(prev => ({
                      ...prev,
                      taxableIncome: Number(e.target.value)
                    }))}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Allowable Deductions (AED)"
                    type="number"
                    value={citData.allowableDeductions}
                    onChange={(e) => setCitData(prev => ({
                      ...prev,
                      allowableDeductions: Number(e.target.value)
                    }))}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={calculateCIT}
                    startIcon={<CalculateIcon />}
                    fullWidth
                  >
                    Calculate CIT
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case 1: // Document Management
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <CloudUploadIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Document Management & Scanning
                  </Typography>
                  <Box
                    sx={{
                      border: `2px dashed ${theme.palette.divider}`,
                      borderRadius: 2,
                      p: 4,
                      textAlign: 'center',
                      mb: 3,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05)
                      }
                    }}
                  >
                    <input
                      type="file"
                      multiple
                      onChange={handleDocumentUpload}
                      style={{ display: 'none' }}
                      id="document-upload"
                      accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
                    />
                    <label htmlFor="document-upload">
                      <UploadIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
                      <Typography variant="h6">Upload Financial Documents</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Invoices, receipts, bank statements, financial records
                      </Typography>
                    </label>
                  </Box>

                  {uploadedDocuments.length > 0 && (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Document Name</TableCell>
                            <TableCell>Size</TableCell>
                            <TableCell>Upload Date</TableCell>
                            <TableCell>OCR Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {uploadedDocuments.map((doc) => (
                            <TableRow key={doc.id}>
                              <TableCell>{doc.name}</TableCell>
                              <TableCell>{(doc.size / 1024).toFixed(1)} KB</TableCell>
                              <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Chip
                                  label="Processed"
                                  color="success"
                                  size="small"
                                  icon={<CheckCircleIcon />}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case 2: // CIT Calculation & Reporting
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <CalculateIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    CIT Calculation & Reporting
                  </Typography>

                  <Alert severity="success" sx={{ mb: 3 }}>
                    Calculations performed as per FTA requirements
                  </Alert>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Taxable Income"
                        value={`AED ${citData.taxableIncome.toLocaleString()}`}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Exemption Threshold"
                        value={`AED ${citData.exemptionThreshold.toLocaleString()}`}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Tax Rate"
                        value={`${citData.taxRate}%`}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Tax Payable"
                        value={`AED ${citData.taxPayable.toLocaleString()}`}
                        InputProps={{ readOnly: true }}
                        sx={{
                          '& .MuiInputBase-input': {
                            fontWeight: 'bold',
                            color: theme.palette.primary.main
                          }
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Generated Reports:
                    </Typography>
                    <Chip
                      label="Income Statement"
                      color={workflowData.citCalculation.incomeStatementGenerated ? 'success' : 'default'}
                      icon={workflowData.citCalculation.incomeStatementGenerated ? <CheckCircleIcon /> : <InfoIcon />}
                      sx={{ mr: 1, mb: 1 }}
                    />
                    <Chip
                      label="Standardized Balance Sheet"
                      color={workflowData.citCalculation.standardizedBalanceSheet ? 'success' : 'default'}
                      icon={workflowData.citCalculation.standardizedBalanceSheet ? <CheckCircleIcon /> : <InfoIcon />}
                      sx={{ mr: 1, mb: 1 }}
                    />
                    <Chip
                      label="Tax Payable Calculation"
                      color={workflowData.citCalculation.taxPayableGenerated ? 'success' : 'default'}
                      icon={workflowData.citCalculation.taxPayableGenerated ? <CheckCircleIcon /> : <InfoIcon />}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Export Options
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<FileDownloadIcon />}
                    onClick={exportFTAPDF}
                    sx={{ mb: 2 }}
                  >
                    Generate FTA PDF
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<FileDownloadIcon />}
                    sx={{ mb: 2 }}
                  >
                    Export Excel
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<FileDownloadIcon />}
                  >
                    Export Financial Statements
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case 3: // Submission & Reporting to FTA
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <SendIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    FTA Submission & Reporting
                  </Typography>

                  <Alert severity="info" sx={{ mb: 3 }}>
                    All data will be stored in UAE cloud. FTA will have live access to all SME data via TRN number.
                  </Alert>

                  {submissionStatus === 'pending' && (
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        Ready for FTA Submission
                      </Typography>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={simulateFTASubmission}
                        startIcon={<SendIcon />}
                        sx={{ mt: 2 }}
                      >
                        Submit to FTA
                      </Button>
                    </Box>
                  )}

                  {submissionStatus === 'submitting' && (
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        Submitting to FTA...
                      </Typography>
                      <LinearProgress sx={{ mt: 2 }} />
                    </Box>
                  )}

                  {submissionStatus === 'submitted' && (
                    <Box>
                      <Alert severity="success" sx={{ mb: 2 }}>
                        Successfully submitted to FTA
                      </Alert>
                      <Typography variant="subtitle1" gutterBottom>
                        Submission Details:
                      </Typography>
                      <Chip label="FTA Access: Real-Time" color="success" sx={{ mr: 1, mb: 1 }} />
                      <Chip label="Automatic Submission: Enabled" color="success" sx={{ mr: 1, mb: 1 }} />
                      <Chip label="Submission ID: CIT-2024-001" color="primary" sx={{ mr: 1, mb: 1 }} />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case 4: // Verification & Payment
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <VerifiedIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Tax Agent Selection & Verification
                  </Typography>

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Select FTA Approved Tax Agent</InputLabel>
                    <Select
                      value={selectedTaxAgent}
                      onChange={(e) => setSelectedTaxAgent(e.target.value)}
                    >
                      <MenuItem value="agent1">UAE Tax Consultants LLC</MenuItem>
                      <MenuItem value="agent2">Emirates Tax Advisory</MenuItem>
                      <MenuItem value="agent3">Professional Tax Services</MenuItem>
                    </Select>
                  </FormControl>

                  <Typography variant="subtitle2" gutterBottom>
                    Required Documents:
                  </Typography>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={workflowData.verificationPayment.certificateUploaded}
                        onChange={(e) => setWorkflowData(prev => ({
                          ...prev,
                          verificationPayment: {
                            ...prev.verificationPayment,
                            certificateUploaded: e.target.checked
                          }
                        }))}
                      />
                    }
                    label="Tax Agent Certificate"
                  />
                  <br />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={workflowData.verificationPayment.bankSlipUploaded}
                        onChange={(e) => setWorkflowData(prev => ({
                          ...prev,
                          verificationPayment: {
                            ...prev.verificationPayment,
                            bankSlipUploaded: e.target.checked
                          }
                        }))}
                      />
                    }
                    label="Bank Payment Slip"
                  />
                  <br />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={workflowData.verificationPayment.eSignVerification}
                        onChange={(e) => setWorkflowData(prev => ({
                          ...prev,
                          verificationPayment: {
                            ...prev.verificationPayment,
                            eSignVerification: e.target.checked
                          }
                        }))}
                      />
                    }
                    label="E-sign Verification"
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <PaymentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    SME Payment Process
                  </Typography>

                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Tax Payable: AED {citData.taxPayable.toLocaleString()}
                  </Alert>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Payment methods available:
                  </Typography>
                  <ul>
                    <li>Bank Transfer</li>
                    <li>Online Payment Gateway</li>
                    <li>Check Payment</li>
                  </ul>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<PaymentIcon />}
                    disabled={!workflowData.verificationPayment.certificateUploaded || !workflowData.verificationPayment.eSignVerification}
                    sx={{ mt: 2 }}
                  >
                    Process Payment
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case 5: // Data Storage & Access
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <VerifiedIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Data Storage & FTA Access
                  </Typography>

                  <Alert severity="success" sx={{ mb: 3 }}>
                    All data will be stored in UAE cloud. FTA will have live access to all SME data via TRN number.
                  </Alert>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                        <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
                        <Typography variant="h6">UAE Cloud Storage</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Data stored in compliance with UAE regulations
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                        <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
                        <Typography variant="h6">FTA Live Access</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Real-time access for FTA via TRN
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                        <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
                        <Typography variant="h6">Secure & Compliant</Typography>
                        <Typography variant="body2" color="text.secondary">
                          End-to-end encryption and audit trails
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      System Status:
                    </Typography>
                    <Chip
                      label="UAE Cloud: Active"
                      color="success"
                      icon={<CheckCircleIcon />}
                      sx={{ mr: 1, mb: 1 }}
                    />
                    <Chip
                      label="FTA Connection: Live"
                      color="success"
                      icon={<CheckCircleIcon />}
                      sx={{ mr: 1, mb: 1 }}
                    />
                    <Chip
                      label="TRN Linked"
                      color="success"
                      icon={<CheckCircleIcon />}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Corporate Income Tax (CIT) Filing
      </Typography>

      {/* 5-Step Filing Workflow Banner */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          🧭 CIT Filing Workflow
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {filingSteps.map((step, index) => (
            <Box key={step.id} sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: step.completed ? '#4CAF50' : step.active ? '#2196F3' : '#E0E0E0',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                onClick={() => setActiveStep(index)}
              >
                {step.completed ? '✓' : step.id}
              </Box>
              <Box sx={{ ml: 2, flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: step.active ? 600 : 400 }}>
                  {step.title}
                </Typography>
              </Box>
              {index < filingSteps.length - 1 && (
                <Box sx={{ width: 40, height: 2, backgroundColor: '#E0E0E0', mx: 2 }} />
              )}
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Step Content */}
      {activeStep === 0 && (
        <Grid container spacing={3}>
          {/* Revenue & Expenses Section */}
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    💰 Revenue & Expenses (Auto-Synced)
                  </Typography>
                  <Chip 
                    label="✅ AUTO-SYNC" 
                    color="success" 
                    size="small" 
                    sx={{ ml: 2 }}
                  />
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Total Revenue"
                      value={citFormData.totalRevenue}
                      onChange={(e) => setCitFormData(prev => ({ ...prev, totalRevenue: parseFloat(e.target.value) || 0 }))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">AED</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Total Expenses"
                      value={citFormData.totalExpenses}
                      onChange={(e) => setCitFormData(prev => ({ ...prev, totalExpenses: parseFloat(e.target.value) || 0 }))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">AED</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Tax Adjustments"
                      value={citFormData.taxAdjustments}
                      onChange={(e) => setCitFormData(prev => ({ ...prev, taxAdjustments: parseFloat(e.target.value) || 0 }))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">AED</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Exempt Income"
                      value={citFormData.exemptIncome}
                      onChange={(e) => setCitFormData(prev => ({ ...prev, exemptIncome: parseFloat(e.target.value) || 0 }))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">AED</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Carried Forward Losses (max 75% offset)"
                      value={citFormData.carriedForwardLosses}
                      onChange={(e) => setCitFormData(prev => ({ ...prev, carriedForwardLosses: parseFloat(e.target.value) || 0 }))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">AED</InputAdornment>,
                      }}
                      helperText="Maximum 75% of current year profit can be offset"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* CIT Calculation Summary */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  🧮 CIT Calculation Summary
                </Typography>
                <Box sx={{ space: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2">Net Profit</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      AED {citCalculations.netProfit.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2">Allowed Losses (max 75%)</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      AED {citCalculations.allowedLosses.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2">Taxable Income</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      AED {citCalculations.taxableIncome.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2">Effective Tax Rate                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {citCalculations.effectiveTaxRate.toLocaleString()}%
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">Final CIT Payable</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                      AED {citCalculations.finalCITPayable.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeStep === 1 && (
        <Grid container spacing={3}>
          {/* Adjustments & Exemptions Section */}
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  ⚙️ Adjustments & Exemptions
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Voluntary Disclosure Adjustments"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">AED</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Other Deductions (specify)"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">AED</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Exempt Income (specify)"
                      helperText="e.g., income from Qualifying Activities"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">AED</InputAdornment>,
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Links & Resources */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  📚 Quick Links & Resources
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<InfoIcon />}
                  sx={{ mb: 2 }}
                >
                  FTA Guidance on CIT
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<InfoIcon />}
                  sx={{ mb: 2 }}
                >
                  CIT Law Overview
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<InfoIcon />}
                >
                  FAQs on CIT
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeStep === 2 && (
        <Grid container spacing={3}>
          {/* Tax Elections Section */}
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  🗳️ Tax Elections
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={citFormData.smallBusinessRelief}
                      onChange={(e) => setCitFormData(prev => ({ ...prev, smallBusinessRelief: e.target.checked }))}
                    />
                  }
                  label="Small Business Relief Election"
                  sx={{ mb: 2 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={citFormData.taxGroupElection}
                      onChange={(e) => setCitFormData(prev => ({ ...prev, taxGroupElection: e.target.checked }))}
                    />
                  }
                  label="Tax Group Election"
                />
                <Alert severity="info" sx={{ mt: 3 }}>
                  Making elections could have significant implications. Consult with a tax advisor.
                </Alert>
              </CardContent>
            </Card>
          </Grid>

          {/* Tax Planning Tips */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  💡 Tax Planning Tips
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  ✅ Maximize allowable deductions
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  ✅ Utilize carried forward losses (max 75%)
                </Typography>
                <Typography variant="body2">
                  ✅ Consider tax-efficient structuring
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeStep === 3 && (
        <Grid container spacing={3}>
          {/* Supporting Documents Section */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    📁 Supporting Documents
                  </Typography>
                  <Tooltip title="Mandatory: Financial Statements, Optional: Contracts, Agreements">
                    <InformationCircleIcon className="h-5 w-5 text-gray-500" />
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    border: `2px dashed ${theme.palette.divider}`,
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    mb: 3,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                >
                  <input
                    type="file"
                    multiple
                    onChange={handleDocumentUpload}
                    style={{ display: 'none' }}
                    id="document-upload"
                    accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
                  />
                  <label htmlFor="document-upload">
                    <UploadIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
                    <Typography variant="h6">Upload Supporting Documents</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Financial statements, contracts, agreements, etc.
                    </Typography>
                  </label>
                </Box>

                {uploadedDocuments.length > 0 && (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Document Name</TableCell>
                          <TableCell>Size</TableCell>
                          <TableCell>Upload Date</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {uploadedDocuments.map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell>{doc.name}</TableCell>
                            <TableCell>{(doc.size / 1024).toFixed(1)} KB</TableCell>
                            <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                            <TableCell>Uploaded</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeStep === 4 && (
        <Grid container spacing={3}>
          {/* Final Calculation & Submission Section */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  🚀 Final Calculation & Submission
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1">
                    Review CIT Calculation
                  </Typography>
                  <Typography variant="body2">
                    Net Profit: AED {citCalculations.netProfit.toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    Allowed Losses: AED {citCalculations.allowedLosses.toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    Taxable Income: AED {citCalculations.taxableIncome.toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    Final CIT Payable: AED {citCalculations.finalCITPayable.toLocaleString()}
                  </Typography>
                </Box>

                <Alert severity="warning" sx={{ mb: 3 }}>
                  Ensure all data is accurate before submission.
                </Alert>

                <Button variant="contained" color="primary">
                  Submit CIT Filing
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default CIT;