import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Card, CardContent, Button, Stepper, Step, StepLabel, StepContent, TextField, Select, MenuItem, FormControl, InputLabel, Chip, Alert, LinearProgress, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, FormControlLabel, Accordion, AccordionSummary, AccordionDetails, Switch, InputAdornment, Tooltip } from '@mui/material';
import { Upload as UploadIcon, CloudUpload as CloudUploadIcon, Verified as VerifiedIcon, Payment as PaymentIcon, Receipt as ReceiptIcon, Calculate as CalculateIcon, Send as SendIcon, CheckCircle as CheckCircleIcon, Info as InfoIcon, FileDownload as FileDownloadIcon } from '@mui/icons-material';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { alpha, useTheme } from '@mui/material/styles';
const CIT = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [workflowData, setWorkflowData] = useState({
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
    const [uploadedDocuments, setUploadedDocuments] = useState([]);
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
            icon: _jsx(ReceiptIcon, {}),
            color: '#2196F3'
        },
        {
            id: 2,
            title: 'Document Management',
            description: 'Invoice Scanning, System Integration',
            icon: _jsx(CloudUploadIcon, {}),
            color: '#4CAF50'
        },
        {
            id: 3,
            title: 'CIT Calculation & Reporting',
            description: 'Calculations per FTA, Tax Payable Generation',
            icon: _jsx(CalculateIcon, {}),
            color: '#FF9800'
        },
        {
            id: 4,
            title: 'Submission & Reporting to FTA',
            description: 'FTA Access, Automatic Submission',
            icon: _jsx(SendIcon, {}),
            color: '#9C27B0'
        },
        {
            id: 5,
            title: 'Verification & Payment',
            description: 'Tax Agent Selection, E-sign Verification, Payment Process',
            icon: _jsx(PaymentIcon, {}),
            color: '#F44336'
        },
        {
            id: 6,
            title: 'Data Storage & Access',
            description: 'UAE Cloud Storage, FTA Live Access via TRN',
            icon: _jsx(VerifiedIcon, {}),
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
    const handleDocumentUpload = (event) => {
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
    const renderStepContent = (stepIndex) => {
        switch (stepIndex) {
            case 0: // Revenue Recording
                return (_jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [_jsx(ReceiptIcon, { sx: { mr: 1, verticalAlign: 'middle' } }), "Revenue Sources"] }), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: workflowData.revenueRecording.invoiceGeneration, onChange: (e) => setWorkflowData(prev => ({
                                                    ...prev,
                                                    revenueRecording: {
                                                        ...prev.revenueRecording,
                                                        invoiceGeneration: e.target.checked
                                                    }
                                                })) }), label: "Invoice Generation System" }), _jsx("br", {}), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: workflowData.revenueRecording.posIntegration, onChange: (e) => setWorkflowData(prev => ({
                                                    ...prev,
                                                    revenueRecording: {
                                                        ...prev.revenueRecording,
                                                        posIntegration: e.target.checked
                                                    }
                                                })) }), label: "POS Integration" }), _jsx("br", {}), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: workflowData.revenueRecording.accountingIntegration, onChange: (e) => setWorkflowData(prev => ({
                                                    ...prev,
                                                    revenueRecording: {
                                                        ...prev.revenueRecording,
                                                        accountingIntegration: e.target.checked
                                                    }
                                                })) }), label: "Accounting System Integration" }), _jsx(Alert, { severity: "info", sx: { mt: 2 }, children: "All manual entries must be backed with proof evidence, which could be captured using a phone." })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Revenue Input" }), _jsx(TextField, { fullWidth: true, label: "Annual Taxable Income (AED)", type: "number", value: citData.taxableIncome, onChange: (e) => setCitData(prev => ({
                                                ...prev,
                                                taxableIncome: Number(e.target.value)
                                            })), sx: { mb: 2 } }), _jsx(TextField, { fullWidth: true, label: "Allowable Deductions (AED)", type: "number", value: citData.allowableDeductions, onChange: (e) => setCitData(prev => ({
                                                ...prev,
                                                allowableDeductions: Number(e.target.value)
                                            })), sx: { mb: 2 } }), _jsx(Button, { variant: "contained", onClick: calculateCIT, startIcon: _jsx(CalculateIcon, {}), fullWidth: true, children: "Calculate CIT" })] }) }) })] }));
            case 1: // Document Management
                return (_jsx(Grid, { container: true, spacing: 3, children: _jsx(Grid, { item: true, xs: 12, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [_jsx(CloudUploadIcon, { sx: { mr: 1, verticalAlign: 'middle' } }), "Document Management & Scanning"] }), _jsxs(Box, { sx: {
                                            border: `2px dashed ${theme.palette.divider}`,
                                            borderRadius: 2,
                                            p: 4,
                                            textAlign: 'center',
                                            mb: 3,
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: alpha(theme.palette.primary.main, 0.05)
                                            }
                                        }, children: [_jsx("input", { type: "file", multiple: true, onChange: handleDocumentUpload, style: { display: 'none' }, id: "document-upload", accept: ".pdf,.jpg,.jpeg,.png,.xlsx,.xls" }), _jsxs("label", { htmlFor: "document-upload", children: [_jsx(UploadIcon, { sx: { fontSize: 48, color: theme.palette.primary.main, mb: 2 } }), _jsx(Typography, { variant: "h6", children: "Upload Financial Documents" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Invoices, receipts, bank statements, financial records" })] })] }), uploadedDocuments.length > 0 && (_jsx(TableContainer, { component: Paper, children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Document Name" }), _jsx(TableCell, { children: "Size" }), _jsx(TableCell, { children: "Upload Date" }), _jsx(TableCell, { children: "OCR Status" })] }) }), _jsx(TableBody, { children: uploadedDocuments.map((doc) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: doc.name }), _jsxs(TableCell, { children: [(doc.size / 1024).toFixed(1), " KB"] }), _jsx(TableCell, { children: new Date(doc.uploadDate).toLocaleDateString() }), _jsx(TableCell, { children: _jsx(Chip, { label: "Processed", color: "success", size: "small", icon: _jsx(CheckCircleIcon, {}) }) })] }, doc.id))) })] }) }))] }) }) }) }));
            case 2: // CIT Calculation & Reporting
                return (_jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 8, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [_jsx(CalculateIcon, { sx: { mr: 1, verticalAlign: 'middle' } }), "CIT Calculation & Reporting"] }), _jsx(Alert, { severity: "success", sx: { mb: 3 }, children: "Calculations performed as per FTA requirements" }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 6, children: _jsx(TextField, { fullWidth: true, label: "Taxable Income", value: `AED ${citData.taxableIncome.toLocaleString()}`, InputProps: { readOnly: true } }) }), _jsx(Grid, { item: true, xs: 6, children: _jsx(TextField, { fullWidth: true, label: "Exemption Threshold", value: `AED ${citData.exemptionThreshold.toLocaleString()}`, InputProps: { readOnly: true } }) }), _jsx(Grid, { item: true, xs: 6, children: _jsx(TextField, { fullWidth: true, label: "Tax Rate", value: `${citData.taxRate}%`, InputProps: { readOnly: true } }) }), _jsx(Grid, { item: true, xs: 6, children: _jsx(TextField, { fullWidth: true, label: "Tax Payable", value: `AED ${citData.taxPayable.toLocaleString()}`, InputProps: { readOnly: true }, sx: {
                                                            '& .MuiInputBase-input': {
                                                                fontWeight: 'bold',
                                                                color: theme.palette.primary.main
                                                            }
                                                        } }) })] }), _jsxs(Box, { sx: { mt: 3 }, children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Generated Reports:" }), _jsx(Chip, { label: "Income Statement", color: workflowData.citCalculation.incomeStatementGenerated ? 'success' : 'default', icon: workflowData.citCalculation.incomeStatementGenerated ? _jsx(CheckCircleIcon, {}) : _jsx(InfoIcon, {}), sx: { mr: 1, mb: 1 } }), _jsx(Chip, { label: "Standardized Balance Sheet", color: workflowData.citCalculation.standardizedBalanceSheet ? 'success' : 'default', icon: workflowData.citCalculation.standardizedBalanceSheet ? _jsx(CheckCircleIcon, {}) : _jsx(InfoIcon, {}), sx: { mr: 1, mb: 1 } }), _jsx(Chip, { label: "Tax Payable Calculation", color: workflowData.citCalculation.taxPayableGenerated ? 'success' : 'default', icon: workflowData.citCalculation.taxPayableGenerated ? _jsx(CheckCircleIcon, {}) : _jsx(InfoIcon, {}), sx: { mr: 1, mb: 1 } })] })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Export Options" }), _jsx(Button, { fullWidth: true, variant: "contained", startIcon: _jsx(FileDownloadIcon, {}), onClick: exportFTAPDF, sx: { mb: 2 }, children: "Generate FTA PDF" }), _jsx(Button, { fullWidth: true, variant: "outlined", startIcon: _jsx(FileDownloadIcon, {}), sx: { mb: 2 }, children: "Export Excel" }), _jsx(Button, { fullWidth: true, variant: "outlined", startIcon: _jsx(FileDownloadIcon, {}), children: "Export Financial Statements" })] }) }) })] }));
            case 3: // Submission & Reporting to FTA
                return (_jsx(Grid, { container: true, spacing: 3, children: _jsx(Grid, { item: true, xs: 12, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [_jsx(SendIcon, { sx: { mr: 1, verticalAlign: 'middle' } }), "FTA Submission & Reporting"] }), _jsx(Alert, { severity: "info", sx: { mb: 3 }, children: "All data will be stored in UAE cloud. FTA will have live access to all SME data via TRN number." }), submissionStatus === 'pending' && (_jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Ready for FTA Submission" }), _jsx(Button, { variant: "contained", size: "large", onClick: simulateFTASubmission, startIcon: _jsx(SendIcon, {}), sx: { mt: 2 }, children: "Submit to FTA" })] })), submissionStatus === 'submitting' && (_jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Submitting to FTA..." }), _jsx(LinearProgress, { sx: { mt: 2 } })] })), submissionStatus === 'submitted' && (_jsxs(Box, { children: [_jsx(Alert, { severity: "success", sx: { mb: 2 }, children: "Successfully submitted to FTA" }), _jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Submission Details:" }), _jsx(Chip, { label: "FTA Access: Real-Time", color: "success", sx: { mr: 1, mb: 1 } }), _jsx(Chip, { label: "Automatic Submission: Enabled", color: "success", sx: { mr: 1, mb: 1 } }), _jsx(Chip, { label: "Submission ID: CIT-2024-001", color: "primary", sx: { mr: 1, mb: 1 } })] }))] }) }) }) }));
            case 4: // Verification & Payment
                return (_jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [_jsx(VerifiedIcon, { sx: { mr: 1, verticalAlign: 'middle' } }), "Tax Agent Selection & Verification"] }), _jsxs(FormControl, { fullWidth: true, sx: { mb: 3 }, children: [_jsx(InputLabel, { children: "Select FTA Approved Tax Agent" }), _jsxs(Select, { value: selectedTaxAgent, onChange: (e) => setSelectedTaxAgent(e.target.value), children: [_jsx(MenuItem, { value: "agent1", children: "UAE Tax Consultants LLC" }), _jsx(MenuItem, { value: "agent2", children: "Emirates Tax Advisory" }), _jsx(MenuItem, { value: "agent3", children: "Professional Tax Services" })] })] }), _jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "Required Documents:" }), _jsx(FormControlLabel, { control: _jsx(Checkbox, { checked: workflowData.verificationPayment.certificateUploaded, onChange: (e) => setWorkflowData(prev => ({
                                                    ...prev,
                                                    verificationPayment: {
                                                        ...prev.verificationPayment,
                                                        certificateUploaded: e.target.checked
                                                    }
                                                })) }), label: "Tax Agent Certificate" }), _jsx("br", {}), _jsx(FormControlLabel, { control: _jsx(Checkbox, { checked: workflowData.verificationPayment.bankSlipUploaded, onChange: (e) => setWorkflowData(prev => ({
                                                    ...prev,
                                                    verificationPayment: {
                                                        ...prev.verificationPayment,
                                                        bankSlipUploaded: e.target.checked
                                                    }
                                                })) }), label: "Bank Payment Slip" }), _jsx("br", {}), _jsx(FormControlLabel, { control: _jsx(Checkbox, { checked: workflowData.verificationPayment.eSignVerification, onChange: (e) => setWorkflowData(prev => ({
                                                    ...prev,
                                                    verificationPayment: {
                                                        ...prev.verificationPayment,
                                                        eSignVerification: e.target.checked
                                                    }
                                                })) }), label: "E-sign Verification" })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [_jsx(PaymentIcon, { sx: { mr: 1, verticalAlign: 'middle' } }), "SME Payment Process"] }), _jsxs(Alert, { severity: "warning", sx: { mb: 2 }, children: ["Tax Payable: AED ", citData.taxPayable.toLocaleString()] }), _jsx(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: "Payment methods available:" }), _jsxs("ul", { children: [_jsx("li", { children: "Bank Transfer" }), _jsx("li", { children: "Online Payment Gateway" }), _jsx("li", { children: "Check Payment" })] }), _jsx(Button, { variant: "contained", fullWidth: true, startIcon: _jsx(PaymentIcon, {}), disabled: !workflowData.verificationPayment.certificateUploaded || !workflowData.verificationPayment.eSignVerification, sx: { mt: 2 }, children: "Process Payment" })] }) }) })] }));
            case 5: // Data Storage & Access
                return (_jsx(Grid, { container: true, spacing: 3, children: _jsx(Grid, { item: true, xs: 12, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [_jsx(VerifiedIcon, { sx: { mr: 1, verticalAlign: 'middle' } }), "Data Storage & FTA Access"] }), _jsx(Alert, { severity: "success", sx: { mb: 3 }, children: "All data will be stored in UAE cloud. FTA will have live access to all SME data via TRN number." }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Paper, { elevation: 2, sx: { p: 2, textAlign: 'center' }, children: [_jsx(CheckCircleIcon, { color: "success", sx: { fontSize: 48, mb: 1 } }), _jsx(Typography, { variant: "h6", children: "UAE Cloud Storage" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Data stored in compliance with UAE regulations" })] }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Paper, { elevation: 2, sx: { p: 2, textAlign: 'center' }, children: [_jsx(CheckCircleIcon, { color: "success", sx: { fontSize: 48, mb: 1 } }), _jsx(Typography, { variant: "h6", children: "FTA Live Access" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Real-time access for FTA via TRN" })] }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Paper, { elevation: 2, sx: { p: 2, textAlign: 'center' }, children: [_jsx(CheckCircleIcon, { color: "success", sx: { fontSize: 48, mb: 1 } }), _jsx(Typography, { variant: "h6", children: "Secure & Compliant" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "End-to-end encryption and audit trails" })] }) })] }), _jsxs(Box, { sx: { mt: 3 }, children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "System Status:" }), _jsx(Chip, { label: "UAE Cloud: Active", color: "success", icon: _jsx(CheckCircleIcon, {}), sx: { mr: 1, mb: 1 } }), _jsx(Chip, { label: "FTA Connection: Live", color: "success", icon: _jsx(CheckCircleIcon, {}), sx: { mr: 1, mb: 1 } }), _jsx(Chip, { label: "TRN Linked", color: "success", icon: _jsx(CheckCircleIcon, {}), sx: { mr: 1, mb: 1 } })] })] }) }) }) }));
            default:
                return null;
        }
    };
    return (_jsxs(Box, { sx: { p: 3, maxWidth: 1200, mx: 'auto' }, children: [_jsx(Typography, { variant: "h4", sx: { mb: 4, fontWeight: 600 }, children: "Corporate Income Tax (CIT) Filing" }), _jsxs(Paper, { sx: { p: 3, mb: 4, borderRadius: 3 }, children: [_jsx(Typography, { variant: "h6", sx: { mb: 3, fontWeight: 600 }, children: "\uD83E\uDDED CIT Filing Workflow" }), _jsx(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: filingSteps.map((step, index) => (_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', flex: 1 }, children: [_jsx(Box, { sx: {
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
                                    }, onClick: () => setActiveStep(index), children: step.completed ? '✓' : step.id }), _jsx(Box, { sx: { ml: 2, flex: 1 }, children: _jsx(Typography, { variant: "body2", sx: { fontWeight: step.active ? 600 : 400 }, children: step.title }) }), index < filingSteps.length - 1 && (_jsx(Box, { sx: { width: 40, height: 2, backgroundColor: '#E0E0E0', mx: 2 } }))] }, step.id))) })] }), activeStep === 0 && (_jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 8, children: _jsx(Card, { sx: { borderRadius: 3 }, children: _jsxs(CardContent, { sx: { p: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 3 }, children: [_jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: "\uD83D\uDCB0 Revenue & Expenses (Auto-Synced)" }), _jsx(Chip, { label: "\u2705 AUTO-SYNC", color: "success", size: "small", sx: { ml: 2 } })] }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, label: "Total Revenue", value: citFormData.totalRevenue, onChange: (e) => setCitFormData(prev => ({ ...prev, totalRevenue: parseFloat(e.target.value) || 0 })), InputProps: {
                                                        startAdornment: _jsx(InputAdornment, { position: "start", children: "AED" }),
                                                    }, sx: { mb: 2 } }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, label: "Total Expenses", value: citFormData.totalExpenses, onChange: (e) => setCitFormData(prev => ({ ...prev, totalExpenses: parseFloat(e.target.value) || 0 })), InputProps: {
                                                        startAdornment: _jsx(InputAdornment, { position: "start", children: "AED" }),
                                                    }, sx: { mb: 2 } }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, label: "Tax Adjustments", value: citFormData.taxAdjustments, onChange: (e) => setCitFormData(prev => ({ ...prev, taxAdjustments: parseFloat(e.target.value) || 0 })), InputProps: {
                                                        startAdornment: _jsx(InputAdornment, { position: "start", children: "AED" }),
                                                    }, sx: { mb: 2 } }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, label: "Exempt Income", value: citFormData.exemptIncome, onChange: (e) => setCitFormData(prev => ({ ...prev, exemptIncome: parseFloat(e.target.value) || 0 })), InputProps: {
                                                        startAdornment: _jsx(InputAdornment, { position: "start", children: "AED" }),
                                                    }, sx: { mb: 2 } }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Carried Forward Losses (max 75% offset)", value: citFormData.carriedForwardLosses, onChange: (e) => setCitFormData(prev => ({ ...prev, carriedForwardLosses: parseFloat(e.target.value) || 0 })), InputProps: {
                                                        startAdornment: _jsx(InputAdornment, { position: "start", children: "AED" }),
                                                    }, helperText: "Maximum 75% of current year profit can be offset" }) })] })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { sx: { borderRadius: 3 }, children: _jsxs(CardContent, { sx: { p: 3 }, children: [_jsx(Typography, { variant: "h6", sx: { mb: 3, fontWeight: 600 }, children: "\uD83E\uDDEE CIT Calculation Summary" }), _jsxs(Box, { sx: { space: 2 }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 2 }, children: [_jsx(Typography, { variant: "body2", children: "Net Profit" }), _jsxs(Typography, { variant: "body2", sx: { fontWeight: 600 }, children: ["AED ", citCalculations.netProfit.toLocaleString()] })] }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 2 }, children: [_jsx(Typography, { variant: "body2", children: "Allowed Losses (max 75%)" }), _jsxs(Typography, { variant: "body2", sx: { fontWeight: 600 }, children: ["AED ", citCalculations.allowedLosses.toLocaleString()] })] }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 2 }, children: [_jsx(Typography, { variant: "body2", children: "Taxable Income" }), _jsxs(Typography, { variant: "body2", sx: { fontWeight: 600 }, children: ["AED ", citCalculations.taxableIncome.toLocaleString()] })] }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 2 }, children: [_jsx(Typography, { variant: "body2", children: "Effective Tax Rate" }), "```python This code implements a Corporate Income Tax (CIT) filing workflow with a 5-step banner, input sections, tax elections, supporting documents upload, and a CIT calculation summary.", _jsxs("replit_final_file", { children: ["import React, ", (useState, useEffect), " from 'react'; import ", useTranslation, " from 'react-i18next'; import ", useNavigate, " from 'react-router-dom'; import ", (Box,
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
                                                                Divider), " from '@mui/material'; import ", (ExpandMore,
                                                                Upload,
                                                                CloudUpload,
                                                                Verified,
                                                                Payment,
                                                                Receipt,
                                                                Calculate,
                                                                Send,
                                                                CheckCircle,
                                                                Warning,
                                                                Info,
                                                                FileDownload), " from '@mui/icons-material'; import ", InformationCircleIcon, " from '@heroicons/react/24/outline'; import ", (alpha, useTheme), " from '@mui/material/styles'; interface CITWorkflowData ", revenueRecording, ": ", invoiceGeneration, ": boolean; posIntegration: boolean; accountingIntegration: boolean; manualEntryBackup: boolean; }; documentManagement: ", invoiceScanning, ": boolean; systemIntegration: boolean; ocrProcessing: boolean; }; citCalculation: ", ftaCompliantCalculations, ": boolean; taxPayableGenerated: boolean; incomeStatementGenerated: boolean; standardizedBalanceSheet: boolean; }; submissionReporting: ", ftaAccess, ": boolean; automaticSubmission: boolean; realTimeAccess: boolean; }; verificationPayment: ", taxAgentSelected, ": boolean; eSignVerification: boolean; smePaymentProcess: boolean; certificateUploaded: boolean; bankSlipUploaded: boolean; }; dataStorage: ", uaeCloudStorage, ": boolean; ftaLiveAccess: boolean; trnLinked: boolean; }; } const CIT: React.FC = () => ", , "const ", t, " = useTranslation(); const theme = useTheme(); const navigate = useNavigate(); const [activeStep, setActiveStep] = useState(0); const [workflowData, setWorkflowData] = useState", _jsxs(CITWorkflowData, { children: ["(", revenueRecording, ": ", invoiceGeneration, ": false, posIntegration: false, accountingIntegration: false, manualEntryBackup: true }, documentManagement: ", invoiceScanning, ": false, systemIntegration: false, ocrProcessing: false }, citCalculation: ", ftaCompliantCalculations, ": false, taxPayableGenerated: false, incomeStatementGenerated: false, standardizedBalanceSheet: false }, submissionReporting: ", ftaAccess, ": false, automaticSubmission: false, realTimeAccess: false }, verificationPayment: ", taxAgentSelected, ": false, eSignVerification: false, smePaymentProcess: false, certificateUploaded: false, bankSlipUploaded: false }, dataStorage: ", uaeCloudStorage, ": true, ftaLiveAccess: false, trnLinked: false } }); const [citData, setCitData] = useState(", taxableIncome, ": 0, allowableDeductions: 0, taxPayable: 0, taxRate: 9, // UAE CIT rate 9% exemptionThreshold: 375000 // AED 375k exemption }); const [uploadedDocuments, setUploadedDocuments] = useState", _jsx("any", {}), "[]>([]); const [selectedTaxAgent, setSelectedTaxAgent] = useState(''); const [submissionStatus, setSubmissionStatus] = useState('pending'); const [citFormData, setCitFormData] = useState(", totalRevenue, ": 0, totalExpenses: 0, taxAdjustments: 0, exemptIncome: 0, carriedForwardLosses: 0, smallBusinessRelief: false, taxGroupElection: false, }); const [citCalculations, setCitCalculations] = useState(", netProfit, ": 0, allowedLosses: 0, taxableIncome: 0, effectiveTaxRate: 0, finalCITPayable: 0, }); const [hasAgentCertificate, setHasAgentCertificate] = useState(false); const workflowSteps = [", id, ": 1, title: 'Revenue Recording', description: 'Invoice Generation, POS Integration, Accounting System Integration', icon: ", _jsx(ReceiptIcon, {}), ", color: '#2196F3' },", id, ": 2, title: 'Document Management', description: 'Invoice Scanning, System Integration', icon: ", _jsx(CloudUploadIcon, {}), ", color: '#4CAF50' },", id, ": 3, title: 'CIT Calculation & Reporting', description: 'Calculations per FTA, Tax Payable Generation', icon: ", _jsx(CalculateIcon, {}), ", color: '#FF9800' },", id, ": 4, title: 'Submission & Reporting to FTA', description: 'FTA Access, Automatic Submission', icon: ", _jsx(SendIcon, {}), ", color: '#9C27B0' },", id, ": 5, title: 'Verification & Payment', description: 'Tax Agent Selection, E-sign Verification, Payment Process', icon: ", _jsx(PaymentIcon, {}), ", color: '#F44336' },", id, ": 6, title: 'Data Storage & Access', description: 'UAE Cloud Storage, FTA Live Access via TRN', icon: ", _jsx(VerifiedIcon, {}), ", color: '#607D8B' } ]; const filingSteps = [", id, ": 1, title: 'Revenue & Expenses', completed: activeStep > 0, active: activeStep === 0 },", id, ": 2, title: 'Adjustments & Exemptions', completed: activeStep > 1, active: activeStep === 1 },", id, ": 3, title: 'Tax Elections', completed: activeStep > 2, active: activeStep === 2 },", id, ": 4, title: 'Supporting Documents', completed: activeStep > 3, active: activeStep === 3 },", id, ": 5, title: 'Final Calculation & Submission', completed: false, active: activeStep === 4 }, ]; const calculateCIT = () => ", , "const ", (taxableIncome, exemptionThreshold, taxRate), " = citData; const taxableAmount = Math.max(0, taxableIncome - exemptionThreshold); const calculatedTax = (taxableAmount * taxRate) / 100; setCitData(prev => (", ...(prev,
                                                                        taxPayable), ": calculatedTax })); // Update calculation status setWorkflowData(prev => (", ...(prev,
                                                                        citCalculation), ": ", ...(prev.citCalculation,
                                                                        ftaCompliantCalculations), ": true, taxPayableGenerated: true } })); }; const handleDocumentUpload = (event: React.ChangeEvent", _jsxs(HTMLInputElement, { children: [") => ", , "const files = event.target.files; if (files) ", , "const newDocuments = Array.from(files).map(file => (", id, ": Date.now() + Math.random(), name: file.name, size: file.size, type: file.type, uploadDate: new Date().toISOString() })); setUploadedDocuments(prev => [...prev, ...newDocuments]); // Update document management status setWorkflowData(prev => (", ...(prev,
                                                                                documentManagement), ": ", ...(prev.documentManagement,
                                                                                invoiceScanning), ": true, systemIntegration: true, ocrProcessing: true } })); } }; const simulateFTASubmission = () => ", setSubmissionStatus('submitting'), "; setTimeout(() => ", setSubmissionStatus('submitted'), "; setWorkflowData(prev => (", ...(prev,
                                                                                submissionReporting), ": ", ...(prev.submissionReporting,
                                                                                ftaAccess), ": true, automaticSubmission: true, realTimeAccess: true } })); }, 3000); }; const exportFTAPDF = () => ", 
                                                                            // Simulate FTA-compliant PDF generation
                                                                            , "// Simulate FTA-compliant PDF generation const ftaData = ", companyName, ": 'SME Company Ltd', trn: '100123456789003', taxYear: '2024', taxableIncome: citData.taxableIncome, exemption: citData.exemptionThreshold, taxPayable: citData.taxPayable, submissionDate: new Date().toISOString() }; console.log('Generating FTA-compliant CIT PDF:', ftaData); alert('FTA-compliant CIT PDF generated successfully'); }; const renderStepContent = (stepIndex: number) => ", , "switch (stepIndex) ", , "case 0: // Revenue Recording return (", _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [_jsx(ReceiptIcon, { sx: { mr: 1, verticalAlign: 'middle' } }), "Revenue Sources"] }), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: workflowData.revenueRecording.invoiceGeneration, onChange: (e) => setWorkflowData(prev => ({
                                                                                                                ...prev,
                                                                                                                revenueRecording: {
                                                                                                                    ...prev.revenueRecording,
                                                                                                                    invoiceGeneration: e.target.checked
                                                                                                                }
                                                                                                            })) }), label: "Invoice Generation System" }), _jsx("br", {}), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: workflowData.revenueRecording.posIntegration, onChange: (e) => setWorkflowData(prev => ({
                                                                                                                ...prev,
                                                                                                                revenueRecording: {
                                                                                                                    ...prev.revenueRecording,
                                                                                                                    posIntegration: e.target.checked
                                                                                                                }
                                                                                                            })) }), label: "POS Integration" }), _jsx("br", {}), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: workflowData.revenueRecording.accountingIntegration, onChange: (e) => setWorkflowData(prev => ({
                                                                                                                ...prev,
                                                                                                                revenueRecording: {
                                                                                                                    ...prev.revenueRecording,
                                                                                                                    accountingIntegration: e.target.checked
                                                                                                                }
                                                                                                            })) }), label: "Accounting System Integration" }), _jsx(Alert, { severity: "info", sx: { mt: 2 }, children: "All manual entries must be backed with proof evidence, which could be captured using a phone." })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Revenue Input" }), _jsx(TextField, { fullWidth: true, label: "Annual Taxable Income (AED)", type: "number", value: citData.taxableIncome, onChange: (e) => setCitData(prev => ({
                                                                                                            ...prev,
                                                                                                            taxableIncome: Number(e.target.value)
                                                                                                        })), sx: { mb: 2 } }), _jsx(TextField, { fullWidth: true, label: "Allowable Deductions (AED)", type: "number", value: citData.allowableDeductions, onChange: (e) => setCitData(prev => ({
                                                                                                            ...prev,
                                                                                                            allowableDeductions: Number(e.target.value)
                                                                                                        })), sx: { mb: 2 } }), _jsx(Button, { variant: "contained", onClick: calculateCIT, startIcon: _jsx(CalculateIcon, {}), fullWidth: true, children: "Calculate CIT" })] }) }) })] }), "); case 1: // Document Management return (", _jsx(Grid, { container: true, spacing: 3, children: _jsx(Grid, { item: true, xs: 12, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [_jsx(CloudUploadIcon, { sx: { mr: 1, verticalAlign: 'middle' } }), "Document Management & Scanning"] }), _jsxs(Box, { sx: {
                                                                                                        border: `2px dashed ${theme.palette.divider}`,
                                                                                                        borderRadius: 2,
                                                                                                        p: 4,
                                                                                                        textAlign: 'center',
                                                                                                        mb: 3,
                                                                                                        cursor: 'pointer',
                                                                                                        '&:hover': {
                                                                                                            backgroundColor: alpha(theme.palette.primary.main, 0.05)
                                                                                                        }
                                                                                                    }, children: [_jsx("input", { type: "file", multiple: true, onChange: handleDocumentUpload, style: { display: 'none' }, id: "document-upload", accept: ".pdf,.jpg,.jpeg,.png,.xlsx,.xls" }), _jsxs("label", { htmlFor: "document-upload", children: [_jsx(UploadIcon, { sx: { fontSize: 48, color: theme.palette.primary.main, mb: 2 } }), _jsx(Typography, { variant: "h6", children: "Upload Financial Documents" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Invoices, receipts, bank statements, financial records" })] })] }), uploadedDocuments.length > 0 && (_jsx(TableContainer, { component: Paper, children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Document Name" }), _jsx(TableCell, { children: "Size" }), _jsx(TableCell, { children: "Upload Date" }), _jsx(TableCell, { children: "OCR Status" })] }) }), _jsx(TableBody, { children: uploadedDocuments.map((doc) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: doc.name }), _jsxs(TableCell, { children: [(doc.size / 1024).toFixed(1), " KB"] }), _jsx(TableCell, { children: new Date(doc.uploadDate).toLocaleDateString() }), _jsx(TableCell, { children: _jsx(Chip, { label: "Processed", color: "success", size: "small", icon: _jsx(CheckCircleIcon, {}) }) })] }, doc.id))) })] }) }))] }) }) }) }), "); case 2: // CIT Calculation & Reporting return (", _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 8, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [_jsx(CalculateIcon, { sx: { mr: 1, verticalAlign: 'middle' } }), "CIT Calculation & Reporting"] }), _jsx(Alert, { severity: "success", sx: { mb: 3 }, children: "Calculations performed as per FTA requirements" }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 6, children: _jsx(TextField, { fullWidth: true, label: "Taxable Income", value: `AED ${citData.taxableIncome.toLocaleString()}`, InputProps: { readOnly: true } }) }), _jsx(Grid, { item: true, xs: 6, children: _jsx(TextField, { fullWidth: true, label: "Exemption Threshold", value: `AED ${citData.exemptionThreshold.toLocaleString()}`, InputProps: { readOnly: true } }) }), _jsx(Grid, { item: true, xs: 6, children: _jsx(TextField, { fullWidth: true, label: "Tax Rate", value: `${citData.taxRate}%`, InputProps: { readOnly: true } }) }), _jsx(Grid, { item: true, xs: 6, children: _jsx(TextField, { fullWidth: true, label: "Tax Payable", value: `AED ${citData.taxPayable.toLocaleString()}`, InputProps: { readOnly: true }, sx: {
                                                                                                                        '& .MuiInputBase-input': {
                                                                                                                            fontWeight: 'bold',
                                                                                                                            color: theme.palette.primary.main
                                                                                                                        }
                                                                                                                    } }) })] }), _jsxs(Box, { sx: { mt: 3 }, children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Generated Reports:" }), _jsx(Chip, { label: "Income Statement", color: workflowData.citCalculation.incomeStatementGenerated ? 'success' : 'default', icon: workflowData.citCalculation.incomeStatementGenerated ? _jsx(CheckCircleIcon, {}) : _jsx(InfoIcon, {}), sx: { mr: 1, mb: 1 } }), _jsx(Chip, { label: "Standardized Balance Sheet", color: workflowData.citCalculation.standardizedBalanceSheet ? 'success' : 'default', icon: workflowData.citCalculation.standardizedBalanceSheet ? _jsx(CheckCircleIcon, {}) : _jsx(InfoIcon, {}), sx: { mr: 1, mb: 1 } }), _jsx(Chip, { label: "Tax Payable Calculation", color: workflowData.citCalculation.taxPayableGenerated ? 'success' : 'default', icon: workflowData.citCalculation.taxPayableGenerated ? _jsx(CheckCircleIcon, {}) : _jsx(InfoIcon, {}), sx: { mr: 1, mb: 1 } })] })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Export Options" }), _jsx(Button, { fullWidth: true, variant: "contained", startIcon: _jsx(FileDownloadIcon, {}), onClick: exportFTAPDF, sx: { mb: 2 }, children: "Generate FTA PDF" }), _jsx(Button, { fullWidth: true, variant: "outlined", startIcon: _jsx(FileDownloadIcon, {}), sx: { mb: 2 }, children: "Export Excel" }), _jsx(Button, { fullWidth: true, variant: "outlined", startIcon: _jsx(FileDownloadIcon, {}), children: "Export Financial Statements" })] }) }) })] }), "); case 3: // Submission & Reporting to FTA return (", _jsx(Grid, { container: true, spacing: 3, children: _jsx(Grid, { item: true, xs: 12, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [_jsx(SendIcon, { sx: { mr: 1, verticalAlign: 'middle' } }), "FTA Submission & Reporting"] }), _jsx(Alert, { severity: "info", sx: { mb: 3 }, children: "All data will be stored in UAE cloud. FTA will have live access to all SME data via TRN number." }), submissionStatus === 'pending' && (_jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Ready for FTA Submission" }), _jsx(Button, { variant: "contained", size: "large", onClick: simulateFTASubmission, startIcon: _jsx(SendIcon, {}), sx: { mt: 2 }, children: "Submit to FTA" })] })), submissionStatus === 'submitting' && (_jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Submitting to FTA..." }), _jsx(LinearProgress, { sx: { mt: 2 } })] })), submissionStatus === 'submitted' && (_jsxs(Box, { children: [_jsx(Alert, { severity: "success", sx: { mb: 2 }, children: "Successfully submitted to FTA" }), _jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Submission Details:" }), _jsx(Chip, { label: "FTA Access: Real-Time", color: "success", sx: { mr: 1, mb: 1 } }), _jsx(Chip, { label: "Automatic Submission: Enabled", color: "success", sx: { mr: 1, mb: 1 } }), _jsx(Chip, { label: "Submission ID: CIT-2024-001", color: "primary", sx: { mr: 1, mb: 1 } })] }))] }) }) }) }), "); case 4: // Verification & Payment return (", _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [_jsx(VerifiedIcon, { sx: { mr: 1, verticalAlign: 'middle' } }), "Tax Agent Selection & Verification"] }), _jsxs(FormControl, { fullWidth: true, sx: { mb: 3 }, children: [_jsx(InputLabel, { children: "Select FTA Approved Tax Agent" }), _jsxs(Select, { value: selectedTaxAgent, onChange: (e) => setSelectedTaxAgent(e.target.value), children: [_jsx(MenuItem, { value: "agent1", children: "UAE Tax Consultants LLC" }), _jsx(MenuItem, { value: "agent2", children: "Emirates Tax Advisory" }), _jsx(MenuItem, { value: "agent3", children: "Professional Tax Services" })] })] }), _jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "Required Documents:" }), _jsx(FormControlLabel, { control: _jsx(Checkbox, { checked: workflowData.verificationPayment.certificateUploaded, onChange: (e) => setWorkflowData(prev => ({
                                                                                                                ...prev,
                                                                                                                verificationPayment: {
                                                                                                                    ...prev.verificationPayment,
                                                                                                                    certificateUploaded: e.target.checked
                                                                                                                }
                                                                                                            })) }), label: "Tax Agent Certificate" }), _jsx("br", {}), _jsx(FormControlLabel, { control: _jsx(Checkbox, { checked: workflowData.verificationPayment.bankSlipUploaded, onChange: (e) => setWorkflowData(prev => ({
                                                                                                                ...prev,
                                                                                                                verificationPayment: {
                                                                                                                    ...prev.verificationPayment,
                                                                                                                    bankSlipUploaded: e.target.checked
                                                                                                                }
                                                                                                            })) }), label: "Bank Payment Slip" }), _jsx("br", {}), _jsx(FormControlLabel, { control: _jsx(Checkbox, { checked: workflowData.verificationPayment.eSignVerification, onChange: (e) => setWorkflowData(prev => ({
                                                                                                                ...prev,
                                                                                                                verificationPayment: {
                                                                                                                    ...prev.verificationPayment,
                                                                                                                    eSignVerification: e.target.checked
                                                                                                                }
                                                                                                            })) }), label: "E-sign Verification" })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [_jsx(PaymentIcon, { sx: { mr: 1, verticalAlign: 'middle' } }), "SME Payment Process"] }), _jsxs(Alert, { severity: "warning", sx: { mb: 2 }, children: ["Tax Payable: AED ", citData.taxPayable.toLocaleString()] }), _jsx(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: "Payment methods available:" }), _jsxs("ul", { children: [_jsx("li", { children: "Bank Transfer" }), _jsx("li", { children: "Online Payment Gateway" }), _jsx("li", { children: "Check Payment" })] }), _jsx(Button, { variant: "contained", fullWidth: true, startIcon: _jsx(PaymentIcon, {}), disabled: !workflowData.verificationPayment.certificateUploaded || !workflowData.verificationPayment.eSignVerification, sx: { mt: 2 }, children: "Process Payment" })] }) }) })] }), "); case 5: // Data Storage & Access return (", _jsx(Grid, { container: true, spacing: 3, children: _jsx(Grid, { item: true, xs: 12, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [_jsx(VerifiedIcon, { sx: { mr: 1, verticalAlign: 'middle' } }), "Data Storage & FTA Access"] }), _jsx(Alert, { severity: "success", sx: { mb: 3 }, children: "All data will be stored in UAE cloud. FTA will have live access to all SME data via TRN number." }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Paper, { elevation: 2, sx: { p: 2, textAlign: 'center' }, children: [_jsx(CheckCircleIcon, { color: "success", sx: { fontSize: 48, mb: 1 } }), _jsx(Typography, { variant: "h6", children: "UAE Cloud Storage" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Data stored in compliance with UAE regulations" })] }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Paper, { elevation: 2, sx: { p: 2, textAlign: 'center' }, children: [_jsx(CheckCircleIcon, { color: "success", sx: { fontSize: 48, mb: 1 } }), _jsx(Typography, { variant: "h6", children: "FTA Live Access" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Real-time access for FTA via TRN" })] }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Paper, { elevation: 2, sx: { p: 2, textAlign: 'center' }, children: [_jsx(CheckCircleIcon, { color: "success", sx: { fontSize: 48, mb: 1 } }), _jsx(Typography, { variant: "h6", children: "Secure & Compliant" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "End-to-end encryption and audit trails" })] }) })] }), _jsxs(Box, { sx: { mt: 3 }, children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "System Status:" }), _jsx(Chip, { label: "UAE Cloud: Active", color: "success", icon: _jsx(CheckCircleIcon, {}), sx: { mr: 1, mb: 1 } }), _jsx(Chip, { label: "FTA Connection: Live", color: "success", icon: _jsx(CheckCircleIcon, {}), sx: { mr: 1, mb: 1 } }), _jsx(Chip, { label: "TRN Linked", color: "success", icon: _jsx(CheckCircleIcon, {}), sx: { mr: 1, mb: 1 } })] })] }) }) }) }), "); default: return null; } }; return (", _jsxs(Box, { sx: { p: 3 }, children: [_jsx(Typography, { variant: "h4", gutterBottom: true, children: "Corporate Income Tax (CIT) Workflow" }), _jsx(Typography, { variant: "subtitle1", color: "text.secondary", gutterBottom: true, children: "Comprehensive CIT management for UAE SMEs - From revenue recording to FTA submission" }), _jsx(Paper, { sx: { p: 3, mb: 3 }, children: _jsx(Grid, { container: true, spacing: 1, children: workflowSteps.map((step, index) => (_jsx(Grid, { item: true, xs: 2, children: _jsxs(Box, { sx: {
                                                                                                        textAlign: 'center',
                                                                                                        cursor: 'pointer',
                                                                                                        p: 2,
                                                                                                        borderRadius: 2,
                                                                                                        backgroundColor: activeStep === index ? alpha(step.color, 0.1) : 'transparent',
                                                                                                        border: activeStep === index ? `2px solid ${step.color}` : '2px solid transparent'
                                                                                                    }, onClick: () => setActiveStep(index), children: [_jsx(Box, { sx: {
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
                                                                                                            }, children: step.icon }), _jsx(Typography, { variant: "caption", sx: { fontWeight: activeStep === index ? 'bold' : 'normal' }, children: step.title })] }) }, step.id))) }) }), _jsxs(Paper, { sx: { p: 3 }, children: [_jsx(Typography, { variant: "h5", gutterBottom: true, sx: { color: workflowSteps[activeStep].color }, children: workflowSteps[activeStep].title }), _jsx(Typography, { variant: "body1", color: "text.secondary", gutterBottom: true, children: workflowSteps[activeStep].description }), renderStepContent(activeStep), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mt: 4 }, children: [_jsx(Button, { onClick: () => setActiveStep(Math.max(0, activeStep - 1)), disabled: activeStep === 0, children: "Previous" }), _jsx(Button, { variant: "contained", onClick: () => setActiveStep(Math.min(workflowSteps.length - 1, activeStep + 1)), disabled: activeStep === workflowSteps.length - 1, children: "Next" })] })] })] }), "); }; export default CIT;"] })] })] })] })] })] }) }) })] }))] }));
};
