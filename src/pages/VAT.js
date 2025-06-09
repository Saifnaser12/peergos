import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Paper, Grid, TextField, Button, Divider, Card, CardContent, InputAdornment, Alert, Switch, FormControlLabel, useTheme, alpha, Chip, Snackbar, Fab, Tooltip } from '@mui/material';
import { WbSunny as Sun, NightlightRound as Moon, Upload, Description as FileText, Calculate, TableChart as TableCells, CloudUpload, } from '@mui/icons-material';
import { BuildingOffice2Icon } from '@heroicons/react/24/outline';
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
    return (_jsxs(Box, { sx: { p: 3, maxWidth: 1200, mx: 'auto' }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }, children: [_jsxs(Box, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2, mb: 1 }, children: [_jsx(Typography, { variant: "h4", sx: { fontWeight: 600, color: theme.palette.text.primary }, children: t('VAT Return Filing') }), isPreviewMode && (_jsx(Chip, { label: `🧪 ${t('vat.preview.mode', 'Draft Filing Mode')}`, color: "info", variant: "outlined", sx: { fontWeight: 600 } }))] }), _jsx(Typography, { variant: "body2", sx: { color: theme.palette.text.secondary }, children: isPreviewMode
                                    ? t('vat.preview.subtitle', `Preview mode - Data sourced from ${draftSource || 'assistant'}`)
                                    : t('UAE FTA-compliant VAT return submission') })] }), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: darkMode, onChange: (e) => setDarkMode(e.target.checked), icon: _jsx(Sun, {}), checkedIcon: _jsx(Moon, {}) }), label: t('Dark Mode') })] }), isPreviewMode && (_jsx(Alert, { severity: "info", sx: { mb: 3 }, children: _jsx(Typography, { variant: "body2", children: t('vat.preview.warning', 'This is a draft filing simulation. No actual submission will be made to FTA. Review the data and make adjustments as needed.') }) })), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, lg: 8, children: _jsxs(Paper, { sx: { p: 3, borderRadius: 3, boxShadow: theme.shadows[2] }, children: [_jsx(Typography, { variant: "h6", sx: { mb: 3, fontWeight: 600 }, children: t('Company Information') }), _jsxs(Grid, { container: true, spacing: 3, sx: { mb: 4 }, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { label: t('Company Name'), placeholder: t('Enter company name'), value: formData.companyName, onChange: (e) => setFormData(prev => ({ ...prev, companyName: e.target.value })), ...inputFieldProps }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { label: t('Tax Registration Number (TRN)'), placeholder: "100123456700003", value: formData.trn, onChange: (e) => setFormData(prev => ({ ...prev, trn: e.target.value })), ...inputFieldProps }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { label: t('Tax Period'), placeholder: "2024-Q1", value: formData.taxPeriod, onChange: (e) => setFormData(prev => ({ ...prev, taxPeriod: e.target.value })), ...inputFieldProps }) })] }), _jsx(Divider, { sx: { my: 4 } }), _jsx(Typography, { variant: "h6", sx: { mb: 3, fontWeight: 600 }, children: t('Designated Zone Information') }), _jsx(Grid, { container: true, spacing: 3, sx: { mb: 4 }, children: _jsx(Grid, { item: true, xs: 12, children: _jsx(FormControlLabel, { control: _jsx(Switch, { checked: formData.isDesignatedZone, onChange: (e) => setFormData(prev => ({
                                                    ...prev,
                                                    isDesignatedZone: e.target.checked,
                                                    designatedZoneImports: e.target.checked ? prev.designatedZoneImports : 0
                                                })), color: "primary" }), label: t('Operating in Designated Zone (applies reverse charge on mainland imports)'), sx: { mb: 2 } }) }) }), _jsx(Divider, { sx: { my: 4 } }), _jsx(Typography, { variant: "h6", sx: { mb: 3, fontWeight: 600 }, children: t('Sales') }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { label: t('Standard-rated Sales (5%)'), placeholder: t('Sales subject to 5% VAT rate'), value: formData.standardRatedSales || '', onChange: handleInputChange('standardRatedSales'), error: !!errors.standardRatedSales, helperText: errors.standardRatedSales, ...inputFieldProps }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { label: t('Zero-rated Sales (0%)'), placeholder: t('Sales with 0% VAT rate (exports, etc.)'), value: formData.zeroRatedSales || '', onChange: handleInputChange('zeroRatedSales'), error: !!errors.zeroRatedSales, helperText: errors.zeroRatedSales, ...inputFieldProps }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { label: t('Exempt Sales'), placeholder: t('Sales exempt from VAT'), value: formData.exemptSales || '', onChange: handleInputChange('exemptSales'), error: !!errors.exemptSales, helperText: errors.exemptSales, ...inputFieldProps }) })] }), _jsx(Divider, { sx: { my: 4 } }), _jsx(Typography, { variant: "h6", sx: { mb: 3, fontWeight: 600 }, children: t('Purchases') }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { label: t('Purchases with Recoverable VAT'), placeholder: t('Business purchases where VAT can be recovered'), value: formData.purchasesWithVAT || '', onChange: handleInputChange('purchasesWithVAT'), error: !!errors.purchasesWithVAT, helperText: errors.purchasesWithVAT, ...inputFieldProps }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { label: t('Purchases without Recoverable VAT'), placeholder: t('Purchases where VAT cannot be recovered'), value: formData.purchasesWithoutVAT || '', onChange: handleInputChange('purchasesWithoutVAT'), error: !!errors.purchasesWithoutVAT, helperText: errors.purchasesWithoutVAT, ...inputFieldProps }) })] }), _jsx(Divider, { sx: { my: 4 } }), _jsx(Typography, { variant: "h6", sx: { mb: 3, fontWeight: 600 }, children: t('Reverse Charge Mechanism') }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { label: t('Imports of Goods/Services'), placeholder: t('Imported goods and services subject to reverse charge'), value: formData.importsGoods || '', onChange: handleInputChange('importsGoods'), error: !!errors.importsGoods, helperText: errors.importsGoods, ...inputFieldProps }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { label: t('Local Services'), placeholder: t('Local services subject to reverse charge'), value: formData.localServices || '', onChange: handleInputChange('localServices'), error: !!errors.localServices, helperText: errors.localServices, ...inputFieldProps }) }), formData.isDesignatedZone && (_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { label: t('Designated Zone Mainland Imports'), placeholder: t('Imports from mainland UAE subject to reverse charge'), value: formData.designatedZoneImports || '', onChange: handleInputChange('designatedZoneImports'), error: !!errors.designatedZoneImports, helperText: errors.designatedZoneImports || t('Reverse charge applies on supplies from mainland UAE'), ...inputFieldProps, sx: {
                                                    ...inputFieldProps.sx,
                                                    '& .MuiOutlinedInput-root': {
                                                        ...inputFieldProps.sx['& .MuiOutlinedInput-root'],
                                                        backgroundColor: alpha(theme.palette.info.main, 0.05),
                                                        borderColor: theme.palette.info.main,
                                                    },
                                                } }) }))] }), _jsx(Divider, { sx: { my: 4 } }), _jsx(Typography, { variant: "h6", sx: { mb: 3, fontWeight: 600 }, children: t('Adjustments') }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(TextField, { label: t('Late Invoices'), placeholder: t('VAT adjustments for late invoices'), value: formData.lateInvoices || '', onChange: handleInputChange('lateInvoices'), error: !!errors.lateInvoices, helperText: errors.lateInvoices, ...inputFieldProps }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(TextField, { label: t('Bad Debt Relief'), placeholder: t('VAT relief for bad debts'), value: formData.badDebtRelief || '', onChange: handleInputChange('badDebtRelief'), error: !!errors.badDebtRelief, helperText: errors.badDebtRelief, ...inputFieldProps }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(TextField, { label: t('VAT Corrections'), placeholder: t('Other VAT corrections and adjustments'), value: formData.vatCorrections || '', onChange: handleInputChange('vatCorrections'), error: !!errors.vatCorrections, helperText: errors.vatCorrections, ...inputFieldProps }) })] }), _jsx(Divider, { sx: { my: 4 } }), _jsx(Typography, { variant: "h6", sx: { mb: 3, fontWeight: 600 }, children: t('Supporting Documents') }), _jsxs(Box, { sx: {
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
                                    }, children: [_jsx(Upload, { sx: { fontSize: 32, color: theme.palette.primary.main } }), _jsx(Typography, { variant: "body1", sx: { mt: 2, fontWeight: 500 }, children: t('Upload invoices, receipts, and reports') }), _jsx(Typography, { variant: "body2", sx: { color: theme.palette.text.secondary }, children: t('PDF, JPEG, PNG, XLSX - Max 10MB per file') })] })] }) }), _jsx(Grid, { item: true, xs: 12, lg: 4, children: _jsx(Card, { sx: { borderRadius: 3, boxShadow: theme.shadows[3] }, children: _jsxs(CardContent, { sx: { p: 3 }, children: [_jsx(Typography, { variant: "h6", sx: { mb: 3, fontWeight: 600 }, children: t('VAT Calculation Summary') }), _jsxs(Box, { sx: { mb: 3, p: 2, bgcolor: 'success.50', borderRadius: 2, border: '1px solid', borderColor: 'success.200' }, children: [_jsx(Typography, { variant: "subtitle2", sx: { fontWeight: 600, mb: 1, color: 'success.main' }, children: isUpdating ? '🔄 UPDATING Live Financial Data...' : '✅ AUTO-SYNC Live Financial Data' }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 }, children: [_jsxs(Typography, { variant: "body2", children: ["Total Revenue (", revenue.length, " entries)"] }), _jsxs(Typography, { variant: "body2", sx: { fontWeight: 600, color: 'success.main' }, children: ["AED ", totalRevenue.toLocaleString()] })] }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 }, children: [_jsxs(Typography, { variant: "body2", children: ["Total Expenses (", expenses.length, " entries)"] }), _jsxs(Typography, { variant: "body2", sx: { fontWeight: 600, color: 'success.main' }, children: ["AED ", totalExpenses.toLocaleString()] })] }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 }, children: [_jsx(Typography, { variant: "body2", sx: { fontWeight: 600 }, children: "Taxable Income" }), _jsxs(Typography, { variant: "body2", sx: { fontWeight: 600, color: 'success.main' }, children: ["AED ", netIncome.toLocaleString()] })] }), _jsxs(Typography, { variant: "caption", sx: { color: 'success.600', fontSize: '0.65rem' }, children: ["Last updated: ", new Date(summary.lastUpdated).toLocaleTimeString()] })] }), _jsxs(Box, { sx: { mb: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 }, children: [_jsx(Typography, { variant: "body2", children: t('Output VAT') }), _jsx(Typography, { variant: "body2", sx: { fontWeight: 600 }, children: formatCurrency(calculations.outputVAT) })] }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 }, children: [_jsx(Typography, { variant: "body2", children: t('Input VAT') }), _jsx(Typography, { variant: "body2", sx: { fontWeight: 600 }, children: formatCurrency(calculations.inputVAT) })] }), formData.isDesignatedZone && formData.designatedZoneImports > 0 && (_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 1 }, children: [_jsx(Typography, { variant: "body2", sx: { fontSize: '0.8rem', color: 'info.main' }, children: t('• Reverse Charge VAT (Designated Zone)') }), _jsx(Typography, { variant: "body2", sx: { fontWeight: 600, fontSize: '0.8rem', color: 'info.main' }, children: formatCurrency(formData.designatedZoneImports * 0.05) })] })), _jsx(Divider, { sx: { my: 2 } }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between' }, children: [_jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: calculations.isRefundable ? t('VAT Refundable') : t('VAT Payable') }), _jsx(Typography, { variant: "h6", sx: {
                                                            fontWeight: 600,
                                                            color: calculations.isRefundable ? theme.palette.success.main : theme.palette.error.main
                                                        }, children: formatCurrency(calculations.netVAT) })] })] }), _jsx(Button, { variant: "outlined", fullWidth: true, startIcon: _jsx(Calculate, {}), sx: { mb: 2 }, onClick: () => { }, children: t('Recalculate') }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 6, children: _jsx(Button, { variant: "outlined", fullWidth: true, startIcon: _jsx(FileText, {}), onClick: handleExportPDF, size: "small", children: t('PDF') }) }), _jsx(Grid, { item: true, xs: 6, children: _jsx(Button, { variant: "outlined", fullWidth: true, startIcon: _jsx(TableCells, {}), onClick: handleExportExcel, size: "small", children: t('Excel') }) })] }), _jsxs(Box, { sx: { mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }, children: [_jsx(Button, { fullWidth: true, variant: "contained", startIcon: _jsx(FileText, {}), onClick: handleGenerateFTAPDF, disabled: !formData.companyName || !formData.trn, sx: {
                                                    bgcolor: '#006A4E',
                                                    '&:hover': { bgcolor: '#005A42' },
                                                    fontWeight: 600,
                                                    py: 2
                                                }, children: t('vat.export.generateFTAPDF', 'Generate FTA PDF') }), _jsx(Button, { fullWidth: true, variant: "contained", color: "primary", startIcon: _jsx(CloudUpload, {}), sx: { py: 2 }, onClick: () => setShowSubmissionModal(true), disabled: isSubmitting, children: isSubmitting ? t('vat.fta.submitting', 'Submitting...') : t('vat.submitReturn') }), _jsx(Button, { variant: "outlined", fullWidth: true, size: "large", onClick: handleSubmitToFTA, disabled: !formData.companyName || !formData.trn, startIcon: _jsx(CloudUpload, {}), sx: { py: 1.5, fontWeight: 600 }, children: t('Submit to FTA') })] }), _jsx(Alert, { severity: "info", sx: { mt: 3, fontSize: '0.875rem' }, children: t('This VAT return complies with UAE Federal Tax Authority requirements. Ensure all amounts are accurate before submission.') })] }) }) })] }), formData.trn && formData.companyName && (_jsx(SubmissionPanel, { trn: formData.trn, companyName: formData.companyName, submissionType: "VAT", formData: formData, calculations: calculations, onSubmit: handleSubmitToFTA })), formData.trn && (_jsx(Box, { sx: { mt: 4 }, children: _jsx(SubmissionHistory, { trn: formData.trn, submissionType: "VAT", maxItems: 5 }) })), _jsx(SubmissionModal, { title: "Confirm VAT Submission", description: "Are you sure you want to submit your VAT return to the FTA? This action cannot be undone and the return will be officially filed.", isOpen: showSubmissionModal, isLoading: isSubmitting, onClose: () => setShowSubmissionModal(false), onConfirm: async () => {
                    await handleSubmitVAT();
                    setShowSubmissionModal(false);
                } }), _jsx(Snackbar, { open: showSuccessAlert, autoHideDuration: 4000, onClose: () => setShowSuccessAlert(false), children: _jsx(Alert, { severity: "success", onClose: () => setShowSuccessAlert(false), children: alertMessage }) }), state.isFreeZone && (_jsx(Fab, { color: "success", onClick: () => setFreeZoneAdvisorOpen(true), className: "fixed bottom-6 right-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700", sx: { zIndex: 1000 }, children: _jsx(Tooltip, { title: t('freeZoneAdvisor.openButton', 'Free Zone Tax Advisor'), children: _jsx(BuildingOffice2Icon, { className: "h-6 w-6 text-white" }) }) })), _jsx(FreeZoneAdvisor, { open: freeZoneAdvisorOpen, onClose: () => setFreeZoneAdvisorOpen(false), context: "vat" })] }));
};
export default VAT;
