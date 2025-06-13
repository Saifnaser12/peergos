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
  Switch
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Corporate Income Tax (CIT) Workflow
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Comprehensive CIT management for UAE SMEs - From revenue recording to FTA submission
      </Typography>

      {/* Workflow Progress */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={1}>
          {workflowSteps.map((step, index) => (
            <Grid item xs={2} key={step.id}>
              <Box
                sx={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: activeStep === index ? alpha(step.color, 0.1) : 'transparent',
                  border: activeStep === index ? `2px solid ${step.color}` : '2px solid transparent'
                }}
                onClick={() => setActiveStep(index)}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: step.color,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 1
                  }}
                >
                  {step.icon}
                </Box>
                <Typography variant="caption" sx={{ fontWeight: activeStep === index ? 'bold' : 'normal' }}>
                  {step.title}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Step Content */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ color: workflowSteps[activeStep].color }}>
          {workflowSteps[activeStep].title}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {workflowSteps[activeStep].description}
        </Typography>

        {renderStepContent(activeStep)}

        {/* Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={() => setActiveStep(Math.min(workflowSteps.length - 1, activeStep + 1))}
            disabled={activeStep === workflowSteps.length - 1}
          >
            Next
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CIT;