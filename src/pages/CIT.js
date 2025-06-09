import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, TextField, Button, Grid, Card, CardContent, CardHeader, Switch, FormControlLabel, Alert, Snackbar, Divider, Chip, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, FormHelperText, InputAdornment, Tooltip, Fab } from '@mui/material';
import { Upload as UploadIcon, Download as DownloadIcon, Receipt as ReceiptIcon, Calculate as CalculateIcon, Info as InfoIcon, CheckCircle as CheckCircleIcon, AttachFile as AttachFileIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
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
const CIT = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { selectedAgent, uploadedCertificate } = useTaxAgent();
    const { revenue, expenses, checkDeMinimisThreshold } = useFinance();
    const { summary, isUpdating, totalRevenue, totalExpenses, netIncome } = useFinancialSync();
    // Get de minimis compliance check
    const deMinimisCheck = checkDeMinimisThreshold();
    const [formData, setFormData] = useState({
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
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showWarningAlert, setShowWarningAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isCalculating, setIsCalculating] = useState(false);
    const [showExportDialog, setShowExportDialog] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [draftSource, setDraftSource] = useState(null);
    const [exportMenuAnchor, setExportMenuAnchor] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(null);
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
                }
                catch (error) {
                    console.error('Error loading draft CIT data:', error);
                }
            }
        }
    }, []);
    // Calculate CIT based on form data
    const citCalculation = useMemo(() => {
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
            }
            catch (error) {
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
            }
            else {
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
        const errors = {};
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
    const handleInputChange = (field) => (event) => {
        const value = event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.type === 'number'
                ? parseFloat(event.target.value) || 0
                : event.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const handleFileUpload = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0)
            return;
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
                const uploadedFile = {
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
        }
        catch (error) {
            setAlertMessage(t('cit.upload.error'));
            setShowWarningAlert(true);
        }
        finally {
            setIsUploading(false);
        }
    };
    const handleRemoveFile = (fileId) => {
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
        const file = new Blob([`CIT Return Summary\n\nCompany: ${formData.companyName}\nTRN: ${formData.trn}\nRevenue: AED ${formData.revenue.toLocaleString()}\nCIT Payable: AED ${citCalculation.citPayable.toLocaleString()}`], { type: 'text/plain' });
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
        }
        catch (error) {
            console.error('Error generating FTA PDF:', error);
            setAlertMessage(t('cit.export.ftaPdfError', 'Error generating FTA PDF'));
            setShowWarningAlert(true);
        }
    };
    const handleExportExcel = () => {
        // Simulate Excel export
        const csvContent = `Field,Value\nRevenue,${formData.revenue}\nExpenses,${formData.expenses}\nNet Profit,${citCalculation.netProfit}\nTaxable Income,${citCalculation.taxableIncome}\nCIT Payable,${citCalculation.citPayable}`;
        const element = document.createElement('a');
        const file = new Blob([csvContent], { type: 'text/csv' });
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
                submissionType: 'CIT',
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
        }
        catch (error) {
            setAlertMessage(error.message || t('cit.fta.submitError'));
            setShowWarningAlert(true);
        }
        finally {
            setIsCalculating(false);
        }
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-AE' : 'en-AE', {
            style: 'currency',
            currency: 'AED',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };
    return (_jsxs(Box, { sx: { maxWidth: 1200, mx: 'auto', p: 3 }, children: [_jsxs(Box, { sx: { mb: 4 }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }, children: [_jsxs(Box, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2, mb: 1 }, children: [_jsx(Typography, { variant: "h3", component: "h1", sx: { fontWeight: 300 }, children: t('dashboard.cit.title') }), isPreviewMode && (_jsx(Chip, { label: `🧪 ${t('cit.preview.mode', 'Draft Filing Mode')}`, color: "info", variant: "outlined", sx: { fontWeight: 600 } }))] }), _jsx(Typography, { variant: "subtitle1", color: "text.secondary", children: isPreviewMode
                                            ? t('cit.preview.subtitle', `Preview mode - Data sourced from ${draftSource || 'assistant'}`)
                                            : t('dashboard.cit.subtitle') })] }), formData.trn && (_jsx(FTAIntegrationStatus, { trn: formData.trn, variant: "badge" }))] }), isPreviewMode && (_jsx(Alert, { severity: "info", sx: { mb: 2 }, children: _jsx(Typography, { variant: "body2", children: t('cit.preview.warning', 'This is a draft filing simulation. No actual submission will be made to FTA. Review the data and make adjustments as needed.') }) }))] }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsxs(Grid, { item: true, xs: 12, lg: 8, children: [_jsxs(Card, { sx: { boxShadow: 3, borderRadius: 3 }, children: [_jsx(CardHeader, { title: t('cit.form.title'), avatar: _jsx(ReceiptIcon, { color: "primary" }) }), _jsx(CardContent, { children: _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, children: _jsx(Typography, { variant: "h6", sx: { mb: 2, color: 'primary.main' }, children: t('cit.form.companyInfo') }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: t('cit.form.companyName'), value: formData.companyName, onChange: handleInputChange('companyName'), error: !!validationErrors.companyName, helperText: validationErrors.companyName, dir: isRTL ? 'rtl' : 'ltr' }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: t('cit.form.trn'), value: formData.trn, onChange: handleInputChange('trn'), error: !!validationErrors.trn, helperText: validationErrors.trn, inputProps: { maxLength: 15 } }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, type: "date", label: t('cit.form.financialYearEnd'), value: formData.financialYearEnd, onChange: handleInputChange('financialYearEnd'), InputLabelProps: { shrink: true } }) }), _jsxs(Grid, { item: true, xs: 12, children: [_jsx(Divider, { sx: { my: 2 } }), _jsx(Typography, { variant: "h6", sx: { mb: 2, color: 'primary.main' }, children: t('cit.form.financialData') })] }), _jsxs(Grid, { item: true, xs: 12, sm: 6, children: [_jsx(TextField, { fullWidth: true, type: "number", label: t('cit.form.revenue'), value: formData.revenue, onChange: handleInputChange('revenue'), error: !!validationErrors.revenue, helperText: validationErrors.revenue || `Live data: AED ${totalRevenue.toLocaleString()}`, InputProps: {
                                                                startAdornment: _jsx(InputAdornment, { position: "start", children: "AED" }),
                                                            } }), _jsx(Box, { sx: { mt: 1, p: 2, bgcolor: 'success.50', borderRadius: 1, border: '1px solid', borderColor: 'success.200' }, children: _jsxs(Typography, { variant: "caption", color: "success.main", sx: { fontWeight: 600 }, children: [isUpdating ? '🔄 UPDATING...' : '✅ AUTO-SYNC', ": AED ", totalRevenue.toLocaleString(), " from ", revenue.length, " transactions"] }) })] }), _jsxs(Grid, { item: true, xs: 12, sm: 6, children: [_jsx(TextField, { fullWidth: true, type: "number", label: t('cit.form.expenses'), value: formData.expenses, onChange: handleInputChange('expenses'), error: !!validationErrors.expenses, helperText: validationErrors.expenses || `Live data: AED ${totalExpenses.toLocaleString()}`, InputProps: {
                                                                startAdornment: _jsx(InputAdornment, { position: "start", children: "AED" }),
                                                            } }), _jsx(Box, { sx: { mt: 1, p: 2, bgcolor: 'success.50', borderRadius: 1, border: '1px solid', borderColor: 'success.200' }, children: _jsxs(Typography, { variant: "caption", color: "success.main", sx: { fontWeight: 600 }, children: [isUpdating ? '🔄 UPDATING...' : '✅ AUTO-SYNC', ": AED ", totalExpenses.toLocaleString(), " from ", expenses.length, " transactions"] }) })] }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, type: "number", label: t('cit.form.taxAdjustments'), value: formData.taxAdjustments, onChange: handleInputChange('taxAdjustments'), InputProps: {
                                                            startAdornment: _jsx(InputAdornment, { position: "start", children: "AED" }),
                                                        }, helperText: t('cit.form.taxAdjustmentsHelp') }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, type: "number", label: t('cit.form.exemptIncome'), value: formData.exemptIncome, onChange: handleInputChange('exemptIncome'), InputProps: {
                                                            startAdornment: _jsx(InputAdornment, { position: "start", children: "AED" }),
                                                        } }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, type: "number", label: t('cit.form.carriedForwardLosses'), value: formData.carriedForwardLosses, onChange: handleInputChange('carriedForwardLosses'), error: !!validationErrors.carriedForwardLosses, helperText: validationErrors.carriedForwardLosses || t('cit.form.lossesCapHelp'), InputProps: {
                                                            startAdornment: _jsx(InputAdornment, { position: "start", children: "AED" }),
                                                        } }) }), _jsxs(Grid, { item: true, xs: 12, children: [_jsx(Divider, { sx: { my: 2 } }), _jsx(Typography, { variant: "h6", sx: { mb: 2, color: 'primary.main' }, children: t('cit.form.elections') })] }), _jsxs(Grid, { item: true, xs: 12, children: [_jsx(FormControlLabel, { control: _jsx(Switch, { checked: formData.smallBusinessRelief, onChange: handleInputChange('smallBusinessRelief'), color: "primary" }), label: _jsxs(Box, { children: [_jsx(Typography, { variant: "body1", children: t('cit.form.smallBusinessRelief') }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: t('cit.form.smallBusinessReliefHelp') })] }) }), validationErrors.smallBusinessRelief && (_jsx(FormHelperText, { error: true, sx: { ml: 0 }, children: validationErrors.smallBusinessRelief }))] }), _jsx(Grid, { item: true, xs: 12, children: _jsx(FormControlLabel, { control: _jsx(Switch, { checked: formData.taxGroupElection, onChange: handleInputChange('taxGroupElection'), color: "primary" }), label: _jsxs(Box, { children: [_jsx(Typography, { variant: "body1", children: t('cit.form.taxGroupElection') }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: t('cit.form.taxGroupElectionHelp') })] }) }) })] }) })] }), _jsxs(Card, { sx: { mt: 3, boxShadow: 3, borderRadius: 3 }, children: [_jsx(CardHeader, { title: t('cit.upload.title'), avatar: _jsx(AttachFileIcon, { color: "primary" }) }), _jsxs(CardContent, { children: [_jsxs(Box, { sx: { mb: 3 }, children: [_jsx("input", { accept: ".pdf,.xlsx,.xls,.csv", style: { display: 'none' }, id: "file-upload", type: "file", multiple: true, onChange: handleFileUpload }), _jsx("label", { htmlFor: "file-upload", children: _jsx(Button, { variant: "outlined", component: "span", startIcon: _jsx(UploadIcon, {}), disabled: isUploading, fullWidth: true, sx: { py: 2 }, children: isUploading ? t('cit.upload.uploading') : t('cit.upload.button') }) }), isUploading && _jsx(LinearProgress, { sx: { mt: 1 } })] }), uploadedFiles.length > 0 && (_jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", sx: { mb: 2 }, children: t('cit.upload.uploadedFiles') }), uploadedFiles.map((file) => (_jsx(Chip, { label: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`, onDelete: () => handleRemoveFile(file.id), deleteIcon: _jsx(DeleteIcon, {}), sx: { mr: 1, mb: 1 }, variant: "outlined" }, file.id)))] }))] })] })] }), _jsxs(Grid, { item: true, xs: 12, lg: 4, children: [_jsxs(Card, { sx: { boxShadow: 3, borderRadius: 3, position: 'sticky', top: 24 }, children: [_jsx(CardHeader, { title: t('cit.calculation.title'), avatar: _jsx(CalculateIcon, { color: "primary" }), action: _jsx(Button, { variant: "contained", size: "small", onClick: handleCalculate, disabled: isCalculating, startIcon: isCalculating ? undefined : _jsx(CalculateIcon, {}), children: isCalculating ? t('cit.calculation.calculating') : t('cit.calculation.calculate') }) }), _jsxs(CardContent, { children: [isCalculating && _jsx(LinearProgress, { sx: { mb: 2 } }), _jsxs(Box, { sx: { mb: 3 }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: t('cit.calculation.netProfit') }), _jsx(Typography, { variant: "h6", sx: { fontWeight: 500 }, children: formatCurrency(citCalculation.netProfit) })] }), _jsxs(Box, { sx: { mb: 3 }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: t('cit.calculation.allowedLosses') }), _jsx(Typography, { variant: "body1", children: formatCurrency(citCalculation.allowedLosses) }), formData.carriedForwardLosses > citCalculation.allowedLosses && (_jsx(Typography, { variant: "caption", color: "warning.main", children: t('cit.calculation.lossesCapped') }))] }), _jsxs(Box, { sx: { mb: 3 }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: t('cit.calculation.taxableIncome') }), _jsx(Typography, { variant: "h6", sx: { fontWeight: 500 }, children: formatCurrency(citCalculation.taxableIncome) }), citCalculation.isQFZP && (_jsxs(Box, { sx: { mt: 1, p: 2, bgcolor: 'info.50', borderRadius: 1, border: '1px solid', borderColor: 'info.200' }, children: [_jsx(Typography, { variant: "caption", sx: { fontWeight: 600, color: 'info.main', display: 'block' }, children: "\uD83C\uDFE2 FREE ZONE QFZP STATUS" }), _jsxs(Typography, { variant: "caption", sx: { color: 'info.main', fontSize: '0.75rem' }, children: ["Qualifying Income (0% rate): AED ", citCalculation.qualifyingIncome?.toLocaleString() || 0] }), _jsxs(Typography, { variant: "caption", sx: { display: 'block', color: 'info.main', fontSize: '0.75rem' }, children: ["Non-Qualifying Income (9% rate): AED ", citCalculation.nonQualifyingIncome?.toLocaleString() || 0] })] })), _jsxs(Box, { sx: { mt: 1, p: 2, bgcolor: 'success.50', borderRadius: 1, border: '1px solid', borderColor: 'success.200' }, children: [_jsxs(Typography, { variant: "caption", color: "success.main", sx: { fontWeight: 600 }, children: [isUpdating ? '🔄 UPDATING...' : '✅ AUTO-SYNC', " Live Taxable Income: AED ", netIncome.toLocaleString()] }), _jsxs(Typography, { variant: "caption", sx: { display: 'block', color: 'success.main', fontSize: '0.65rem' }, children: ["Updates automatically from Accounting module \u2022 Last: ", new Date(summary.lastUpdated).toLocaleTimeString()] })] }), citCalculation.isQFZP && (_jsxs(Box, { sx: { mt: 2, p: 3, bgcolor: 'blue.50', borderRadius: 2, border: '1px solid', borderColor: 'blue.200' }, children: [_jsxs(Typography, { variant: "h6", sx: { mb: 2, color: 'blue.main', fontWeight: 600 }, children: ["\uD83C\uDFE2 ", t('cit.freeZone.incomeBreakdown', 'FTA Income Classification (Article 18)')] }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Box, { sx: { p: 2, bgcolor: 'green.50', borderRadius: 1, border: '1px solid', borderColor: 'green.200' }, children: [_jsxs(Typography, { variant: "subtitle2", sx: { color: 'green.main', fontWeight: 600, mb: 1 }, children: [t('cit.freeZone.qualifyingIncome', 'Qualifying Income'), " (0% CIT)"] }), _jsxs(Typography, { variant: "h6", sx: { color: 'green.main', fontWeight: 700 }, children: ["AED ", citCalculation.qualifyingIncome?.toLocaleString() || 0] }), _jsx(Typography, { variant: "caption", sx: { color: 'green.600', fontSize: '0.75rem', display: 'block', mb: 1 }, children: "Per Article 18 & Cabinet Decision No. 55:" }), _jsxs("ul", { style: { margin: 0, paddingLeft: '1rem', fontSize: '0.7rem', color: 'green.600' }, children: [_jsx("li", { children: "Export of goods/services outside UAE" }), _jsx("li", { children: "Intra-Free Zone trade" }), _jsx("li", { children: "Qualifying activities per FTA list" })] })] }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Box, { sx: { p: 2, bgcolor: 'orange.50', borderRadius: 1, border: '1px solid', borderColor: 'orange.200' }, children: [_jsxs(Typography, { variant: "subtitle2", sx: { color: 'orange.main', fontWeight: 600, mb: 1 }, children: [t('cit.freeZone.nonQualifyingIncome', 'Non-Qualifying Income'), " (9% CIT)"] }), _jsxs(Typography, { variant: "h6", sx: { color: 'orange.main', fontWeight: 700 }, children: ["AED ", citCalculation.nonQualifyingIncome?.toLocaleString() || 0] }), _jsx(Typography, { variant: "caption", sx: { color: 'orange.600', fontSize: '0.75rem', display: 'block', mb: 1 }, children: "Standard CIT treatment:" }), _jsxs("ul", { style: { margin: 0, paddingLeft: '1rem', fontSize: '0.7rem', color: 'orange.600' }, children: [_jsx("li", { children: "Mainland/domestic sales" }), _jsx("li", { children: "Local consumption in UAE" }), _jsx("li", { children: "Non-qualifying business income" })] })] }) })] }), _jsxs(Box, { sx: { mt: 2, p: 2, bgcolor: deMinimisCheck.isCompliant ? 'green.100' : 'red.100', borderRadius: 1 }, children: [_jsxs(Typography, { variant: "caption", sx: {
                                                                            color: deMinimisCheck.isCompliant ? 'green.main' : 'red.main',
                                                                            fontWeight: 600,
                                                                            fontSize: '0.8rem',
                                                                            display: 'block'
                                                                        }, children: ["\uD83D\uDCCA De Minimis Threshold: ", deMinimisCheck.isCompliant ? '✅ Compliant' : '❌ Exceeded'] }), _jsxs(Typography, { variant: "caption", sx: {
                                                                            color: deMinimisCheck.isCompliant ? 'green.600' : 'red.600',
                                                                            fontSize: '0.7rem'
                                                                        }, children: ["Non-qualifying: ", deMinimisCheck.percentage.toFixed(1), "% of total (limit: 5%) | AED ", deMinimisCheck.amount.toLocaleString(), " (limit: AED 5M)"] })] }), _jsx(Box, { sx: { mt: 2, p: 2, bgcolor: 'blue.100', borderRadius: 1 }, children: _jsxs(Typography, { variant: "caption", sx: { color: 'blue.main', fontWeight: 600, fontSize: '0.8rem' }, children: ["\uD83D\uDCC4 ", t('cit.freeZone.footnote', 'Classification per UAE Corporate Tax Law Article 18 & Cabinet Decision No. 55 of 2023')] }) })] }))] }), _jsx(Divider, { sx: { my: 2 } }), _jsxs(Box, { sx: { mb: 3 }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: t('cit.calculation.citPayable') }), _jsx(Typography, { variant: "h4", sx: {
                                                            fontWeight: 600,
                                                            color: citCalculation.citPayable > 0 ? 'error.main' : 'success.main'
                                                        }, children: formatCurrency(citCalculation.citPayable) }), citCalculation.smallBusinessReliefApplied && (_jsx(Chip, { label: t('cit.calculation.smallBusinessReliefApplied'), color: "success", size: "small", sx: { mt: 1 } }))] }), _jsxs(Box, { sx: { mb: 3 }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: t('cit.calculation.effectiveRate') }), _jsxs(Typography, { variant: "h6", sx: { fontWeight: 500 }, children: [citCalculation.effectiveRate.toFixed(2), "%"] })] }), _jsxs(Box, { sx: { mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }, children: [_jsx(Button, { fullWidth: true, variant: "contained", startIcon: _jsx(ReceiptIcon, {}), onClick: handleGenerateFTAPDF, disabled: isCalculating || !formData.companyName || !formData.trn, sx: {
                                                            bgcolor: '#006A4E',
                                                            '&:hover': { bgcolor: '#005A42' },
                                                            fontWeight: 600
                                                        }, children: t('cit.export.generateFTAPDF', 'Generate FTA PDF') }), _jsx(Button, { fullWidth: true, variant: "outlined", startIcon: _jsx(DownloadIcon, {}), onClick: () => setShowExportDialog(true), disabled: isCalculating, children: t('cit.export.button') }), _jsx(Button, { fullWidth: true, variant: "outlined", color: "primary", onClick: () => setShowSubmissionModal(true), disabled: isCalculating || !formData.companyName || !formData.trn, startIcon: _jsx(UploadIcon, {}), children: isCalculating ? t('cit.fta.submitting') : t('cit.fta.submitToFTA') })] }), _jsx(Alert, { severity: citCalculation.citPayable === 0 ? "success" : "info", sx: { mt: 2 }, icon: citCalculation.citPayable === 0 ? _jsx(CheckCircleIcon, {}) : _jsx(InfoIcon, {}), children: _jsx(Typography, { variant: "body2", children: citCalculation.citPayable === 0
                                                        ? (citCalculation.isQFZP
                                                            ? 'No CIT due - QFZP benefits applied to qualifying income'
                                                            : t('cit.compliance.noCitDue'))
                                                        : (citCalculation.isQFZP
                                                            ? `CIT due on non-qualifying income only (QFZP)`
                                                            : t('cit.compliance.citDue')) }) })] })] }), _jsx(TaxAgentSelector, { variant: "full" })] })] }), formData.trn && formData.companyName && (_jsx(SubmissionPanel, { trn: formData.trn, companyName: formData.companyName, submissionType: "CIT", formData: formData, calculations: citCalculation, onSubmit: handleSubmitToFTA, disabled: isCalculating })), formData.trn && (_jsx(Box, { sx: { mt: 4 }, children: _jsx(SubmissionHistory, { trn: formData.trn, submissionType: "CIT", maxItems: 5 }) })), _jsxs(Dialog, { open: showExportDialog, onClose: () => setShowExportDialog(false), children: [_jsx(DialogTitle, { children: t('cit.export.title') }), _jsxs(DialogContent, { children: [_jsx(Typography, { variant: "body2", sx: { mb: 3 }, children: t('cit.export.description') }), _jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', gap: 2 }, children: [_jsx(Button, { variant: "outlined", startIcon: _jsx(DownloadIcon, {}), onClick: handleExportPDF, fullWidth: true, children: t('cit.export.pdf') }), _jsx(Button, { variant: "outlined", startIcon: _jsx(DownloadIcon, {}), onClick: handleExportExcel, fullWidth: true, children: t('cit.export.excel') })] })] }), _jsx(DialogActions, { children: _jsx(Button, { onClick: () => setShowExportDialog(false), children: t('common.cancel') }) })] }), _jsx(SubmissionModal, { title: "Confirm CIT Submission", description: "Are you sure you want to submit your Corporate Income Tax return to the FTA? This action cannot be undone and the return will be officially filed.", isOpen: showSubmissionModal, isLoading: isCalculating, onClose: () => setShowSubmissionModal(false), onConfirm: async () => {
                    await handleSubmitToFTA();
                    setShowSubmissionModal(false);
                } }), _jsx(Snackbar, { open: showSuccessAlert, autoHideDuration: 4000, onClose: () => setShowSuccessAlert(false), children: _jsx(Alert, { severity: "success", onClose: () => setShowSuccessAlert(false), children: alertMessage }) }), _jsx(Snackbar, { open: showWarningAlert, autoHideDuration: 4000, onClose: () => setShowWarningAlert(false), children: _jsx(Alert, { severity: "warning", onClose: () => setShowWarningAlert(false), children: alertMessage }) }), false && (_jsx(Fab, { color: "success", onClick: () => setFreeZoneAdvisorOpen(true), className: "fixed bottom-6 right-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700", sx: { zIndex: 1000 }, children: _jsx(Tooltip, { title: t('freeZoneAdvisor.openButton', 'Free Zone Tax Advisor'), children: _jsx(BuildingOffice2Icon, { className: "h-6 w-6 text-white" }) }) })), _jsx(FreeZoneAdvisor, { open: freeZoneAdvisorOpen, onClose: () => setFreeZoneAdvisorOpen(false), context: "cit" })] }));
};

export default CIT;