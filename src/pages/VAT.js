import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Paper, Grid, TextField, Button, Alert, Card, CardContent, Switch, FormControlLabel, Chip, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider } from '@mui/material';
import { Calculate as CalculateIcon, Upload as UploadIcon, Send as SendIcon, Assessment as AssessmentIcon, CheckCircle as CheckCircleIcon, AccountBalance as BankIcon, Scanner as ScanIcon, Integration as IntegrationIcon, Payment as PaymentIcon, Description as ReportIcon } from '@mui/icons-material';
import { WbSunny as Sun, NightlightRound as Moon, Description as FileText, TableChart as TableCells, } from '@mui/icons-material';
import { ExclamationTriangleIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { alpha, useTheme, InputAdornment, Snackbar } from '@mui/material';
import SubmissionHistory from '../components/SubmissionHistory';
import SubmissionPanel from '../components/fta/SubmissionPanel';
import { ftaService } from '../services/ftaService';
import { useFinance } from '../context/FinanceContext';
import { useTax } from '../context/TaxContext';
import { useFinancialSync } from '../hooks/useFinancialSync';
import SubmissionModal from '../components/SubmissionModal';
import FreeZoneAdvisor from '../components/FreeZoneAdvisor';
const VAT = () => {
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const [darkMode, setDarkMode] = useState(false);
    const [errors, setErrors] = useState({});
    const { revenue, expenses } = useFinance();
    const { state } = useTax();
    const { summary, isUpdating, totalRevenue, totalExpenses, netIncome } = useFinancialSync();
    const [formData, setFormData] = useState({
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
    const validateField = useCallback((name, value) => {
        if (isNaN(value)) {
            return t('Invalid number format');
        }
        if (value < 0) {
            return t('Amount cannot be negative');
        }
        return '';
    }, [t]);
    const handleInputChange = useCallback((field) => (event) => {
        const value = parseFloat(event.target.value) || 0;
        const error = validateField(field, value);
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: error }));
    }, [validateField]);
    const calculateVAT = useCallback(() => {
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
    const formatCurrency = (amount) => {
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
        }
        catch (error) {
            setAlertMessage(t('vat.fta.submitError', 'Error submitting VAT return'));
            setShowWarningAlert(true);
        }
        finally {
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
        }
        catch (error) {
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
                submissionType: 'VAT',
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
        }
        catch (error) {
            console.error('FTA submission failed:', error);
        }
    };
    const inputFieldProps = {
        variant: 'outlined',
        fullWidth: true,
        type: 'number',
        InputProps: {
            startAdornment: _jsx(InputAdornment, { position: "start", children: "AED" }),
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
    const [draftSource, setDraftSource] = useState(null);
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
                }
                catch (error) {
                    console.error('Error loading draft VAT data:', error);
                }
            }
        }
    }, []);
    const [activeStep, setActiveStep] = useState(0);
    const [vatData, setVatData] = useState({
        standardSales: 0,
        zeroRatedSales: 0,
        exemptSales: 0,
        recoverablePurchases: 0,
        nonRecoverablePurchases: 0,
        reverseChargeImports: 0,
        reverseChargeServices: 0,
        lateInvoiceAdjustments: 0,
        badDebtRelief: 0,
        otherAdjustments: 0
    });
    const [workflowStatus, setWorkflowStatus] = useState({
        dataCollection: {
            posIntegration: false,
            directPosIntegration: true,
            systemCompatibility: true,
            scanInvoices: false,
            accountingIntegration: false,
            dataVerification: false
        },
        documentManagement: {
            invoiceScanning: false,
            systemIntegration: false,
            manualEntryBackup: true
        },
        vatCalculation: {
            vatCalculationEngine: false,
            vatReturnGeneration: false,
            detailedReports: false
        },
        submissionReporting: {
            ftaAccess: false,
            automaticSubmission: false,
            realTimeAccess: false
        },
        vatSettlement: {
            netVatCalculation: false,
            uploadBankSlip: false,
            vatRefunds: false
        }
    });
    const [uploadedDocuments, setUploadedDocuments] = useState([]);
    const [submissionStatus, setSubmissionStatus] = useState('pending');
    const vatWorkflowSteps = [
        {
            id: 1,
            title: 'Data Collection',
            description: 'POS Integration (Automated), Direct POS Integration, System Compatibility',
            icon: _jsx(IntegrationIcon, {}),
            color: '#2196F3',
            features: ['POS Integration (Automated)', 'Direct POS Integration', 'System Compatibility', 'For SMEs Without POS', 'FTA Approved Accounting System', 'Data Verification']
        },
        {
            id: 2,
            title: 'Document Management',
            description: 'Invoice Scanning, System Integration',
            icon: _jsx(ScanIcon, {}),
            color: '#4CAF50',
            features: ['Invoice Scanning', 'System Integration']
        },
        {
            id: 3,
            title: 'VAT Calculation & Reporting',
            description: 'VAT Calculation Engine, VAT Return Generation, Detailed Reports',
            icon: _jsx(CalculateIcon, {}),
            color: '#FF9800',
            features: ['VAT Calculation Engine', 'VAT Return Generation', 'Detailed Reports']
        },
        {
            id: 4,
            title: 'Submission & Reporting to FTA',
            description: 'FTA Access (Real-Time), Automatic Submission',
            icon: _jsx(SendIcon, {}),
            color: '#9C27B0',
            features: ['FTA Access (Real-Time)', 'Detailed Financials Report', 'VAT Payable', 'Payment Transfer Slip', 'Automatic Submission']
        },
        {
            id: 5,
            title: 'VAT Settlement & Calculation',
            description: 'Net VAT Calculation, Upload Bank Slip',
            icon: _jsx(PaymentIcon, {}),
            color: '#F44336',
            features: ['Net VAT Calculation', 'Upload Bank Slip', 'VAT Refunds (if applicable)']
        }
    ];
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
            setWorkflowStatus(prev => ({
                ...prev,
                documentManagement: {
                    ...prev.documentManagement,
                    invoiceScanning: true,
                    systemIntegration: true
                }
            }));
        }
    };
    const simulateVATCalculation = () => {
        const outputVAT = (vatData.standardSales * 0.05) + (vatData.reverseChargeImports * 0.05);
        const inputVAT = (vatData.recoverablePurchases * 0.05);
        const netVAT = outputVAT - inputVAT;
        setWorkflowStatus(prev => ({
            ...prev,
            vatCalculation: {
                ...prev.vatCalculation,
                vatCalculationEngine: true,
                vatReturnGeneration: true,
                detailedReports: true
            }
        }));
        return { outputVAT, inputVAT, netVAT };
    };
    const simulateFTASubmission = () => {
        setSubmissionStatus('submitting');
        setTimeout(() => {
            setSubmissionStatus('submitted');
            setWorkflowStatus(prev => ({
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
    const renderStepContent = (stepIndex) => {
        switch (stepIndex) {
            case 0: // Data Collection
                return (_jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [_jsx(IntegrationIcon, { sx: { mr: 1, verticalAlign: 'middle' } }), "Data Collection Systems"] }), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: workflowStatus.dataCollection.posIntegration, onChange: (e) => setWorkflowStatus(prev => ({
                                                    ...prev,
                                                    dataCollection: {
                                                        ...prev.dataCollection,
                                                        posIntegration: e.target.checked
                                                    }
                                                })) }), label: "POS Integration (Automated)" }), _jsx("br", {}), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: workflowStatus.dataCollection.directPosIntegration, onChange: (e) => setWorkflowStatus(prev => ({
                                                    ...prev,
                                                    dataCollection: {
                                                        ...prev.dataCollection,
                                                        directPosIntegration: e.target.checked
                                                    }
                                                })) }), label: "Direct POS Integration" }), _jsx("br", {}), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: workflowStatus.dataCollection.systemCompatibility, onChange: (e) => setWorkflowStatus(prev => ({
                                                    ...prev,
                                                    dataCollection: {
                                                        ...prev.dataCollection,
                                                        systemCompatibility: e.target.checked
                                                    }
                                                })) }), label: "System Compatibility" }), _jsx(Alert, { severity: "info", sx: { mt: 2 }, children: "All Manual Entry shall be backed with proof evidence, which could be captured using a phone." })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Sales Data Input" }), _jsx(TextField, { fullWidth: true, label: "Standard-rated Sales (5%) - AED", type: "number", value: vatData.standardSales, onChange: (e) => handleInputChange('standardSales', e.target.value), sx: { mb: 2 } }), _jsx(TextField, { fullWidth: true, label: "Zero-rated Sales (0%) - AED", type: "number", value: vatData.zeroRatedSales, onChange: (e) => handleInputChange('zeroRatedSales', e.target.value), sx: { mb: 2 } }), _jsx(TextField, { fullWidth: true, label: "Exempt Sales - AED", type: "number", value: vatData.exemptSales, onChange: (e) => handleInputChange('exemptSales', e.target.value), sx: { mb: 2 } })] }) }) })] }));
            case 1: // Document Management
                return (_jsx(Grid, { container: true, spacing: 3, children: _jsx(Grid, { item: true, xs: 12, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [_jsx(ScanIcon, { sx: { mr: 1, verticalAlign: 'middle' } }), "Document Management & Invoice Scanning"] }), _jsxs(Box, { sx: {
                                            border: `2px dashed #ccc`,
                                            borderRadius: 2,
                                            p: 4,
                                            textAlign: 'center',
                                            mb: 3,
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0,0,0,0.05)'
                                            }
                                        }, children: [_jsx("input", { type: "file", multiple: true, onChange: handleDocumentUpload, style: { display: 'none' }, id: "vat-document-upload", accept: ".pdf,.jpg,.jpeg,.png,.xlsx,.xls" }), _jsxs("label", { htmlFor: "vat-document-upload", children: [_jsx(UploadIcon, { sx: { fontSize: 48, color: '#2196F3', mb: 2 } }), _jsx(Typography, { variant: "h6", children: "Upload VAT Documents" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Invoices, receipts, bank statements, purchase records" })] })] }), uploadedDocuments.length > 0 && (_jsx(TableContainer, { component: Paper, children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Document Name" }), _jsx(TableCell, { children: "Size" }), _jsx(TableCell, { children: "Upload Date" }), _jsx(TableCell, { children: "Scan Status" })] }) }), _jsx(TableBody, { children: uploadedDocuments.map((doc) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: doc.name }), _jsxs(TableCell, { children: [(doc.size / 1024).toFixed(1), " KB"] }), _jsx(TableCell, { children: new Date(doc.uploadDate).toLocaleDateString() }), _jsx(TableCell, { children: _jsx(Chip, { label: "Scanned & Processed", color: "success", size: "small", icon: _jsx(CheckCircleIcon, {}) }) })] }, doc.id))) })] }) }))] }) }) }) }));
            case 2: // VAT Calculation & Reporting
                return (_jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 8, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [_jsx(CalculateIcon, { sx: { mr: 1, verticalAlign: 'middle' } }), "VAT Calculation Engine"] }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 6, children: _jsx(TextField, { fullWidth: true, label: "Recoverable Purchases - AED", type: "number", value: vatData.recoverablePurchases, onChange: (e) => handleInputChange('recoverablePurchases', e.target.value) }) }), _jsx(Grid, { item: true, xs: 6, children: _jsx(TextField, { fullWidth: true, label: "Reverse Charge Imports - AED", type: "number", value: vatData.reverseChargeImports, onChange: (e) => handleInputChange('reverseChargeImports', e.target.value) }) })] }), _jsx(Button, { variant: "contained", onClick: simulateVATCalculation, startIcon: _jsx(CalculateIcon, {}), sx: { mt: 3 }, fullWidth: true, children: "Calculate VAT" }), _jsxs(Box, { sx: { mt: 3 }, children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Generated Reports:" }), _jsx(Chip, { label: "VAT Return Generation", color: workflowStatus.vatCalculation.vatReturnGeneration ? 'success' : 'default', icon: workflowStatus.vatCalculation.vatReturnGeneration ? _jsx(CheckCircleIcon, {}) : _jsx(ReportIcon, {}), sx: { mr: 1, mb: 1 } }), _jsx(Chip, { label: "Detailed Reports", color: workflowStatus.vatCalculation.detailedReports ? 'success' : 'default', icon: workflowStatus.vatCalculation.detailedReports ? _jsx(CheckCircleIcon, {}) : _jsx(AssessmentIcon, {}), sx: { mr: 1, mb: 1 } })] })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "VAT Summary" }), (() => {
                                            const calc = simulateVATCalculation();
                                            return (_jsxs(_Fragment, { children: [_jsxs(Typography, { variant: "body2", children: ["Output VAT: AED ", calc.outputVAT.toFixed(2)] }), _jsxs(Typography, { variant: "body2", children: ["Input VAT: AED ", calc.inputVAT.toFixed(2)] }), _jsxs(Typography, { variant: "h6", color: "primary", children: ["Net VAT: AED ", calc.netVAT.toFixed(2)] })] }));
                                        })()] }) }) })] }));
            case 3: // Submission & Reporting to FTA
                return (_jsx(Grid, { container: true, spacing: 3, children: _jsx(Grid, { item: true, xs: 12, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [_jsx(SendIcon, { sx: { mr: 1, verticalAlign: 'middle' } }), "FTA Submission & Reporting"] }), _jsx(Alert, { severity: "info", sx: { mb: 3 }, children: "All data will be stored in UAE cloud. FTA will have live access to all SME data via TRN number." }), submissionStatus === 'pending' && (_jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Ready for FTA Submission" }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Paper, { elevation: 2, sx: { p: 2, textAlign: 'center' }, children: [_jsx(ReportIcon, { sx: { fontSize: 40, color: '#9C27B0', mb: 1 } }), _jsx(Typography, { variant: "body2", children: "Detailed Financials Report" })] }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Paper, { elevation: 2, sx: { p: 2, textAlign: 'center' }, children: [_jsx(PaymentIcon, { sx: { fontSize: 40, color: '#9C27B0', mb: 1 } }), _jsx(Typography, { variant: "body2", children: "VAT Payable" })] }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Paper, { elevation: 2, sx: { p: 2, textAlign: 'center' }, children: [_jsx(BankIcon, { sx: { fontSize: 40, color: '#9C27B0', mb: 1 } }), _jsx(Typography, { variant: "body2", children: "Payment Transfer Slip" })] }) })] }), _jsx(Button, { variant: "contained", size: "large", onClick: simulateFTASubmission, startIcon: _jsx(SendIcon, {}), sx: { mt: 3 }, fullWidth: true, children: "Submit to FTA" })] })), submissionStatus === 'submitting' && (_jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Submitting to FTA..." }), _jsx(LinearProgress, { sx: { mt: 2 } })] })), submissionStatus === 'submitted' && (_jsxs(Box, { children: [_jsx(Alert, { severity: "success", sx: { mb: 2 }, children: "Successfully submitted to FTA" }), _jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Submission Status:" }), _jsx(Chip, { label: "FTA Access: Real-Time \u2705", color: "success", sx: { mr: 1, mb: 1 } }), _jsx(Chip, { label: "Automatic Submission: Active \u2705", color: "success", sx: { mr: 1, mb: 1 } }), _jsx(Chip, { label: "Submission ID: VAT-2024-001", color: "primary", sx: { mr: 1, mb: 1 } })] }))] }) }) }) }));
            case 4: // VAT Settlement & Calculation
                return (_jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [_jsx(PaymentIcon, { sx: { mr: 1, verticalAlign: 'middle' } }), "VAT Settlement & Calculation"] }), _jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "Net VAT Calculation" }), (() => {
                                            const calc = simulateVATCalculation();
                                            return (_jsxs(Alert, { severity: calc.netVAT > 0 ? "warning" : "success", sx: { mb: 2 }, children: ["Net VAT ", calc.netVAT > 0 ? 'Payable' : 'Refundable', ": AED ", Math.abs(calc.netVAT).toFixed(2)] }));
                                        })(), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: workflowStatus.vatSettlement.uploadBankSlip, onChange: (e) => setWorkflowStatus(prev => ({
                                                    ...prev,
                                                    vatSettlement: {
                                                        ...prev.vatSettlement,
                                                        uploadBankSlip: e.target.checked
                                                    }
                                                })) }), label: "Upload Bank Slip" }), _jsx("br", {}), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: workflowStatus.vatSettlement.vatRefunds, onChange: (e) => setWorkflowStatus(prev => ({
                                                    ...prev,
                                                    vatSettlement: {
                                                        ...prev.vatSettlement,
                                                        vatRefunds: e.target.checked
                                                    }
                                                })) }), label: "VAT Refunds Processing" })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "PEERGOS VAT Refunds" }), _jsx(Alert, { severity: "info", sx: { mb: 2 }, children: "PEERGOS allows VAT Refunds (if any). Notifications will be available on the system" }), _jsx(Button, { variant: "contained", fullWidth: true, startIcon: _jsx(BankIcon, {}), disabled: !workflowStatus.vatSettlement.uploadBankSlip, children: "Process VAT Settlement" })] }) }) })] }));
            default:
                return null;
        }
    };
    return (_jsxs(Box, { sx: { p: 3, maxWidth: 1200, mx: 'auto' }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }, children: [_jsxs(Box, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2, mb: 1 }, children: [_jsx(Typography, { variant: "h4", sx: { fontWeight: 600, color: theme.palette.text.primary }, children: t('VAT Return Filing') }), isPreviewMode && (_jsx(Chip, { label: `🧪 ${t('vat.preview.mode', 'Draft Filing Mode')}`, color: "info", variant: "outlined", sx: { fontWeight: 600 } }))] }), _jsx(Typography, { variant: "body2", sx: { color: theme.palette.text.secondary }, children: isPreviewMode
                                    ? t('vat.preview.subtitle', `Preview mode - Data sourced from ${draftSource || 'assistant'}`)
                                    : t('UAE FTA-compliant VAT return submission') })] }), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: darkMode, onChange: (e) => setDarkMode(e.target.checked), icon: _jsx(Sun, {}), checkedIcon: _jsx(Moon, {}) }), label: t('Dark Mode') })] }), isPreviewMode && (_jsx(Alert, { severity: "info", sx: { mb: 3 }, children: _jsx(Typography, { variant: "body2", children: t('vat.preview.warning', 'This is a draft filing simulation. No actual submission will be made to FTA. Review the data and make adjustments as needed.') }) })), _jsx(Paper, { sx: { p: 3, mb: 3 }, children: _jsx(Grid, { container: true, spacing: 1, children: vatWorkflowSteps.map((step, index) => (_jsx(Grid, { item: true, xs: 2.4, children: _jsxs(Box, { sx: {
                                textAlign: 'center',
                                cursor: 'pointer',
                                p: 2,
                                borderRadius: 2,
                                backgroundColor: activeStep === index ? `${step.color}20` : 'transparent',
                                border: activeStep === index ? `2px solid ${step.color}` : '2px solid transparent'
                            }, onClick: () => setActiveStep(index), children: [_jsx(Box, { sx: {
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        backgroundColor: step.color,
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center', mx: 'auto',
                                        mb: 1
                                    }, children: step.icon }), _jsx(Typography, { variant: "caption", sx: { fontWeight: activeStep === index ? 'bold' : 'normal' }, children: step.title })] }) }, step.id))) }) }), _jsxs(Paper, { sx: { p: 3 }, children: [_jsx(Typography, { variant: "h5", gutterBottom: true, sx: { color: vatWorkflowSteps[activeStep].color }, children: vatWorkflowSteps[activeStep].title }), _jsx(Typography, { variant: "body1", color: "text.secondary", gutterBottom: true, children: vatWorkflowSteps[activeStep].description }), renderStepContent(activeStep), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mt: 4 }, children: [_jsx(Button, { onClick: () => setActiveStep(Math.max(0, activeStep - 1)), disabled: activeStep === 0, children: "Previous" }), _jsx(Button, { variant: "contained", onClick: () => setActiveStep(Math.min(vatWorkflowSteps.length - 1, activeStep + 1)), disabled: activeStep === vatWorkflowSteps.length - 1, children: "Next" })] })] }), _jsx(Alert, { severity: "info", sx: { mt: 3 }, children: "All data will be stored in UAE cloud. FTA will have live access to all SME data via TRN number." }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, lg: 8, children: _jsxs(Paper, { sx: { p: 3, borderRadius: 3, boxShadow: theme.shadows[2] }, children: [_jsx(Card, { sx: { mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }, children: _jsxs(CardContent, { sx: { p: 3 }, children: [_jsxs(Typography, { variant: "h6", sx: { mb: 3, fontWeight: 600, color: 'primary.main' }, children: ["\uD83C\uDFE2 ", t('Company Information')] }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(TextField, { label: t('Company Name'), placeholder: t('Enter company name'), value: formData.companyName, onChange: (e) => setFormData(prev => ({ ...prev, companyName: e.target.value })), ...inputFieldProps }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(TextField, { label: t('Tax Registration Number (TRN)'), placeholder: "100123456700003", value: formData.trn, onChange: (e) => setFormData(prev => ({ ...prev, trn: e.target.value })), ...inputFieldProps }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(TextField, { label: t('Tax Period'), placeholder: "2024-Q1", value: formData.taxPeriod, onChange: (e) => setFormData(prev => ({ ...prev, taxPeriod: e.target.value })), ...inputFieldProps }) })] })] }) }), _jsx(Card, { sx: { mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }, children: _jsxs(CardContent, { sx: { p: 3 }, children: [_jsxs(Typography, { variant: "h6", sx: { mb: 3, fontWeight: 600, color: 'success.main' }, children: ["\uD83D\uDCB0 ", t('Sales')] }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(TextField, { label: t('Standard-rated Sales (5%)'), placeholder: t('Sales subject to 5% VAT rate'), value: formData.standardRatedSales || '', onChange: handleInputChange('standardRatedSales'), error: !!errors.standardRatedSales, helperText: errors.standardRatedSales, ...inputFieldProps }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(TextField, { label: t('Zero-rated Sales (0%)'), placeholder: t('Sales with 0% VAT rate (exports, etc.)'), value: formData.zeroRatedSales || '', onChange: handleInputChange('zeroRatedSales'), error: !!errors.zeroRatedSales, helperText: errors.zeroRatedSales, ...inputFieldProps }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(TextField, { label: t('Exempt Sales'), placeholder: t('Sales exempt from VAT'), value: formData.exemptSales || '', onChange: handleInputChange('exemptSales'), error: !!errors.exemptSales, helperText: errors.exemptSales, ...inputFieldProps }) })] })] }) }), _jsx(Card, { sx: { mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }, children: _jsxs(CardContent, { sx: { p: 3 }, children: [_jsxs(Typography, { variant: "h6", sx: { mb: 3, fontWeight: 600, color: 'warning.main' }, children: ["\uD83D\uDED2 ", t('Purchases')] }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { label: t('Purchases with Recoverable VAT'), placeholder: t('Business purchases where VAT can be recovered'), value: formData.purchasesWithVAT || '', onChange: handleInputChange('purchasesWithVAT'), error: !!errors.purchasesWithVAT, helperText: errors.purchasesWithVAT, ...inputFieldProps }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { label: t('Purchases without Recoverable VAT'), placeholder: t('Purchases where VAT cannot be recovered'), value: formData.purchasesWithoutVAT || '', onChange: handleInputChange('purchasesWithoutVAT'), error: !!errors.purchasesWithoutVAT, helperText: errors.purchasesWithoutVAT, ...inputFieldProps }) })] })] }) }), _jsx(Card, { sx: { mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }, children: _jsxs(CardContent, { sx: { p: 3 }, children: [_jsxs(Typography, { variant: "h6", sx: { mb: 3, fontWeight: 600, color: 'info.main' }, children: ["\uD83D\uDD04 ", t('Reverse Charge')] }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { label: t('Imports of Goods or Services'), placeholder: t('Imported goods and services subject to reverse charge'), value: formData.importsGoods || '', onChange: handleInputChange('importsGoods'), error: !!errors.importsGoods, helperText: errors.importsGoods, ...inputFieldProps }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { label: t('Local Reverse Charge Services'), placeholder: t('Local services subject to reverse charge'), value: formData.localServices || '', onChange: handleInputChange('localServices'), error: !!errors.localServices, helperText: errors.localServices, ...inputFieldProps }) }), formData.isDesignatedZone && (_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { label: t('Designated Zone Mainland Imports'), placeholder: t('Imports from mainland UAE subject to reverse charge'), value: formData.designatedZoneImports || '', onChange: handleInputChange('designatedZoneImports'), error: !!errors.designatedZoneImports, helperText: errors.designatedZoneImports || t('Reverse charge applies on supplies from mainland UAE'), ...inputFieldProps, sx: {
                                                                ...inputFieldProps.sx,
                                                                '& .MuiOutlinedInput-root': {
                                                                    ...inputFieldProps.sx['& .MuiOutlinedInput-root'],
                                                                    backgroundColor: alpha(theme.palette.info.main, 0.05),
                                                                    borderColor: theme.palette.info.main,
                                                                },
                                                            } }) })), _jsx(Grid, { item: true, xs: 12, children: _jsx(FormControlLabel, { control: _jsx(Switch, { checked: formData.isDesignatedZone, onChange: (e) => setFormData(prev => ({
                                                                    ...prev,
                                                                    isDesignatedZone: e.target.checked,
                                                                    designatedZoneImports: e.target.checked ? prev.designatedZoneImports : 0
                                                                })), color: "primary" }), label: t('Operating in Designated Zone (applies reverse charge on mainland imports)') }) })] })] }) }), _jsx(Card, { sx: { mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }, children: _jsxs(CardContent, { sx: { p: 3 }, children: [_jsxs(Typography, { variant: "h6", sx: { mb: 3, fontWeight: 600, color: 'error.main' }, children: ["\u2696\uFE0F ", t('Adjustments')] }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(TextField, { label: t('Late Invoices'), placeholder: t('VAT adjustments for late invoices'), value: formData.lateInvoices || '', onChange: handleInputChange('lateInvoices'), error: !!errors.lateInvoices, helperText: errors.lateInvoices, ...inputFieldProps }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(TextField, { label: t('Bad Debt Relief'), placeholder: t('VAT relief for bad debts'), value: formData.badDebtRelief || '', onChange: handleInputChange('badDebtRelief'), error: !!errors.badDebtRelief, helperText: errors.badDebtRelief, ...inputFieldProps }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(TextField, { label: t('VAT Corrections'), placeholder: t('Other VAT corrections and adjustments'), value: formData.vatCorrections || '', onChange: handleInputChange('vatCorrections'), error: !!errors.vatCorrections, helperText: errors.vatCorrections, ...inputFieldProps }) })] })] }) }), _jsx(Card, { sx: { mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }, children: _jsxs(CardContent, { sx: { p: 3 }, children: [_jsxs(Typography, { variant: "h6", sx: { mb: 3, fontWeight: 600, color: 'secondary.main' }, children: ["\uD83D\uDCC1 ", t('Supporting Documents')] }), _jsx("input", { type: "file", multiple: true, id: "vat-file-upload", accept: ".pdf,.jpg,.jpeg,.png,.xlsx", style: { display: 'none' }, onChange: (e) => {
                                                    const files = e.target.files;
                                                    if (files && files.length > 0) {
                                                        console.log('Files uploaded:', Array.from(files).map(f => f.name));
                                                    }
                                                } }), _jsx("label", { htmlFor: "vat-file-upload", children: _jsxs(Box, { sx: {
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
                                                    }, children: [_jsx(UploadIcon, { sx: { fontSize: 48, color: theme.palette.primary.main, mb: 2 } }), _jsx(Typography, { variant: "h6", sx: { fontWeight: 600, mb: 1 }, children: t('Upload invoices, receipts, and reports') }), _jsx(Typography, { variant: "body2", sx: { color: theme.palette.text.secondary }, children: t('PDF, JPEG, PNG, XLSX - Max 10MB per file') }), _jsxs(Box, { sx: { mt: 2, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }, children: [_jsx(Chip, { label: "PDF", size: "small", variant: "outlined" }), _jsx(Chip, { label: "JPEG", size: "small", variant: "outlined" }), _jsx(Chip, { label: "PNG", size: "small", variant: "outlined" }), _jsx(Chip, { label: "XLSX", size: "small", variant: "outlined" })] })] }) })] }) })] }) }), _jsxs(Grid, { item: true, xs: 12, lg: 4, children: [_jsx(Card, { sx: { borderRadius: 3, boxShadow: theme.shadows[3] }, children: _jsxs(CardContent, { sx: { p: 3 }, children: [_jsxs(Box, { className: "flex items-center gap-4 mb-4", children: [_jsx("img", { src: "/images/peergos_slide_6.png", alt: "VAT Compliance", className: "w-16 h-16 object-cover rounded-lg opacity-80" }), _jsxs(Typography, { variant: "h6", sx: { mb: 3, fontWeight: 600 }, children: ["\uD83D\uDCCA ", t('VAT Summary')] })] }), _jsx(Alert, { severity: revenue.length > 0 && expenses.length > 0 ? "success" : "warning", sx: { mb: 3 }, icon: revenue.length > 0 && expenses.length > 0 ? _jsx(CheckCircleIcon, {}) : _jsx(ExclamationTriangleIcon, {}), children: _jsx(Typography, { variant: "body2", sx: { fontWeight: 600 }, children: revenue.length > 0 && expenses.length > 0
                                                    ? '✅ AUTO-SYNC: Live Financial Data Connected'
                                                    : '❗WARNING: No Accounting Data Available' }) }), _jsxs(Box, { sx: { mb: 3, p: 2, bgcolor: 'success.50', borderRadius: 2, border: '1px solid', borderColor: 'success.200' }, children: [_jsx(Typography, { variant: "subtitle2", sx: { fontWeight: 600, mb: 1, color: 'success.main' }, children: "\uD83D\uDCB0 Financial Overview" }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 }, children: [_jsxs(Typography, { variant: "body2", children: ["Total Revenue (", revenue.length, " entries)"] }), _jsxs(Typography, { variant: "body2", sx: { fontWeight: 600, color: 'success.main' }, children: ["AED ", totalRevenue.toLocaleString()] })] }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 }, children: [_jsxs(Typography, { variant: "body2", children: ["Total Expenses (", expenses.length, " entries)"] }), _jsxs(Typography, { variant: "body2", sx: { fontWeight: 600, color: 'success.main' }, children: ["AED ", totalExpenses.toLocaleString()] })] }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 }, children: [_jsx(Typography, { variant: "body2", sx: { fontWeight: 600 }, children: "Taxable Income" }), _jsxs(Typography, { variant: "body2", sx: { fontWeight: 600, color: netIncome >= 0 ? 'success.main' : 'error.main' }, children: ["AED ", netIncome.toLocaleString(), netIncome >= 0 ? ' ✅' : ' ❌'] })] }), _jsxs(Typography, { variant: "caption", sx: { color: 'success.600', fontSize: '0.65rem' }, children: ["\uD83D\uDD53 Last updated: ", new Date(summary.lastUpdated).toLocaleTimeString()] })] }), _jsxs(Box, { sx: { mb: 3, p: 2, bgcolor: 'info.50', borderRadius: 2, border: '1px solid', borderColor: 'info.200' }, children: [_jsx(Typography, { variant: "subtitle2", sx: { fontWeight: 600, mb: 2, color: 'info.main' }, children: "\uD83E\uDDEE VAT Calculations" }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 }, children: [_jsx(Typography, { variant: "body2", children: t('Output VAT') }), _jsx(Typography, { variant: "body2", sx: { fontWeight: 600 }, children: formatCurrency(calculations.outputVAT) })] }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 }, children: [_jsx(Typography, { variant: "body2", children: t('Input VAT') }), _jsx(Typography, { variant: "body2", sx: { fontWeight: 600 }, children: formatCurrency(calculations.inputVAT) })] }), formData.isDesignatedZone && formData.designatedZoneImports > 0 && (_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 }, children: [_jsx(Typography, { variant: "body2", sx: { fontSize: '0.8rem', color: 'info.main' }, children: t('• Reverse Charge VAT (Designated Zone)') }), _jsx(Typography, { variant: "body2", sx: { fontWeight: 600, fontSize: '0.8rem', color: 'info.main' }, children: formatCurrency(formData.designatedZoneImports * 0.05) })] })), _jsx(Divider, { sx: { my: 2 } }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between' }, children: [_jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: calculations.isRefundable ? t('Net VAT Refundable') : t('Net VAT Payable') }), _jsxs(Typography, { variant: "h6", sx: {
                                                                fontWeight: 600,
                                                                color: calculations.isRefundable ? theme.palette.success.main : theme.palette.error.main
                                                            }, children: [formatCurrency(calculations.netVAT), calculations.isRefundable ? ' ✅' : ' ❌'] })] })] }), _jsx(Typography, { variant: "subtitle2", sx: { fontWeight: 600, mb: 2 }, children: "\uD83D\uDCC1 Download Tools" }), _jsxs(Grid, { container: true, spacing: 2, sx: { mb: 3 }, children: [_jsx(Grid, { item: true, xs: 6, children: _jsx(Button, { variant: "outlined", fullWidth: true, startIcon: _jsx(FileText, {}), onClick: handleGenerateFTAPDF, size: "small", disabled: !formData.companyName || !formData.trn, children: "\uD83D\uDCC4 PDF" }) }), _jsx(Grid, { item: true, xs: 6, children: _jsx(Button, { variant: "outlined", fullWidth: true, startIcon: _jsx(TableCells, {}), onClick: handleExportExcel, size: "small", children: "\uD83D\uDCCA Excel" }) })] }), _jsxs(Button, { fullWidth: true, variant: "contained", size: "large", startIcon: _jsx(SendIcon, {}), onClick: () => setShowSubmissionModal(true), disabled: isSubmitting || !formData.companyName || !formData.trn, sx: {
                                                bgcolor: '#006A4E',
                                                '&:hover': { bgcolor: '#005A42' },
                                                fontWeight: 600,
                                                py: 2,
                                                mb: 2
                                            }, children: ["\uD83D\uDCE8 ", isSubmitting ? t('Submitting...') : t('Submit VAT Return')] }), _jsx(Alert, { severity: "info", sx: { fontSize: '0.875rem' }, children: t('This VAT return complies with UAE Federal Tax Authority requirements. Ensure all amounts are accurate before submission.') })] }) }), _jsx(Card, { sx: { borderRadius: 3, boxShadow: theme.shadows[2], mt: 3 }, children: _jsxs(CardContent, { sx: { p: 3 }, children: [_jsx(Typography, { variant: "h6", sx: { mb: 2, fontWeight: 600, color: 'secondary.main' }, children: "\uD83D\uDCA1 Compliance Tips" }), _jsxs(Box, { sx: { space: 2 }, children: [_jsx(Alert, { severity: "info", sx: { mb: 2, fontSize: '0.8rem' }, children: "\uD83D\uDCBC Ensure invoices over AED 10,000 include TRN and line VAT breakdown." }), _jsx(Alert, { severity: "warning", sx: { mb: 2, fontSize: '0.8rem' }, children: "\uD83D\uDCC5 VAT returns must be filed within 28 days of the tax period end." }), _jsx(Alert, { severity: "success", sx: { fontSize: '0.8rem' }, children: "\u2705 Keep all supporting documents for 5 years as per FTA requirements." })] })] }) })] })] }), formData.trn && formData.companyName && (_jsx(SubmissionPanel, { trn: formData.trn, companyName: formData.companyName, submissionType: "VAT", formData: formData, calculations: calculations, onSubmit: handleSubmitToFTA })), formData.trn && (_jsx(Box, { sx: { mt: 4 }, children: _jsx(SubmissionHistory, { trn: formData.trn, submissionType: "VAT", maxItems: 5 }) })), _jsx(SubmissionModal, { title: "Confirm VAT Submission", description: "Are you sure you want to submit your VAT return to the FTA? This action cannot be undone and the return will be officially filed.", isOpen: showSubmissionModal, isLoading: isSubmitting, onClose: () => setShowSubmissionModal(false), onConfirm: async () => {
                    await handleSubmitVAT();
                    setShowSubmissionModal(false);
                } }), _jsx(Snackbar, { open: showSuccessAlert, autoHideDuration: 4000, onClose: () => setShowSuccessAlert(false), children: _jsx(Alert, { severity: "success", onClose: () => setShowSuccessAlert(false), children: alertMessage }) }), state.isFreeZone && (_jsx(Fab, { color: "success", onClick: () => setFreeZoneAdvisorOpen(true), className: "fixed bottom-6 right-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700", sx: { zIndex: 1000 }, children: _jsx(Tooltip, { title: t('freeZoneAdvisor.openButton', 'Free Zone Tax Advisor'), children: _jsx(BuildingOffice2Icon, { className: "h-6 w-6 text-white" }) }) })), _jsx(FreeZoneAdvisor, { open: freeZoneAdvisorOpen, onClose: () => setFreeZoneAdvisorOpen(false), context: "vat" })] }));
};
export default VAT;
