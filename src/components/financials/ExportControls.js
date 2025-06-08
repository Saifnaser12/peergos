import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Paper, Typography, Grid, Divider } from '@mui/material';
import { Download as DownloadIcon, PictureAsPdf as PdfIcon, TableChart as ExcelIcon, Upload as UploadIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
export const ExportControls = ({ data, summary }) => {
    const { t } = useTranslation();
    const exportToPDF = () => {
        const exportData = {
            profile: {
                legalName: 'Sample Company',
                taxRegistrationNumber: '100123456789003'
            },
            revenues: data.filter(entry => entry.type === 'revenue'),
            expenses: data.filter(entry => entry.type === 'expense'),
            vatDue: summary.totalRevenue * 0.05, // 5% VAT example
            citDue: summary.netIncome * 0.09, // 9% CIT example
            complianceScore: 85
        };
        import('../utils/exports').then(({ exportToPDF: exportPDF }) => {
            exportPDF(exportData, 'financial-report.pdf');
        });
    };
    const exportToExcel = () => {
        const exportData = {
            profile: {
                legalName: 'Sample Company',
                taxRegistrationNumber: '100123456789003'
            },
            revenues: data.filter(entry => entry.type === 'revenue'),
            expenses: data.filter(entry => entry.type === 'expense'),
            vatDue: summary.totalRevenue * 0.05,
            citDue: summary.netIncome * 0.09,
            complianceScore: 85
        };
        import('../utils/exports').then(({ exportToExcel: exportExcel }) => {
            exportExcel(exportData, 'financial-report.xlsx');
        });
    };
    const handleFileUpload = (event) => {
        const files = event.target.files;
        if (files) {
            console.log('Uploading financial documents:', files);
            // Handle file upload logic here
        }
    };
    return (_jsxs(Paper, { sx: { p: 3, borderRadius: 3, mb: 3 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, sx: { fontWeight: 600 }, children: t('financials.exportControls', 'Export & Import Controls') }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(Button, { fullWidth: true, variant: "contained", startIcon: _jsx(PdfIcon, {}), onClick: exportToPDF, sx: {
                                borderRadius: 2,
                                textTransform: 'none',
                                height: 48
                            }, children: t('financials.exportPDF', 'Export PDF') }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(Button, { fullWidth: true, variant: "contained", startIcon: _jsx(ExcelIcon, {}), onClick: exportToExcel, sx: {
                                borderRadius: 2,
                                textTransform: 'none',
                                height: 48,
                                backgroundColor: '#1976d2'
                            }, children: t('financials.exportExcel', 'Export Excel') }) }), _jsxs(Grid, { item: true, xs: 12, sm: 6, md: 3, children: [_jsx("input", { accept: ".pdf,.xlsx,.xls", style: { display: 'none' }, id: "upload-financial-docs", type: "file", multiple: true, onChange: handleFileUpload }), _jsx("label", { htmlFor: "upload-financial-docs", children: _jsx(Button, { fullWidth: true, variant: "outlined", startIcon: _jsx(UploadIcon, {}), component: "span", sx: {
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        height: 48
                                    }, children: t('financials.uploadDocs', 'Upload Documents') }) })] }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(Button, { fullWidth: true, variant: "outlined", startIcon: _jsx(DownloadIcon, {}), onClick: () => console.log('Download template'), sx: {
                                borderRadius: 2,
                                textTransform: 'none',
                                height: 48
                            }, children: t('financials.downloadTemplate', 'Download Template') }) })] }), _jsx(Divider, { sx: { my: 2 } }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: t('financials.exportNote', 'Exports include Income Statement, Balance Sheet, and detailed transaction records. Supported formats: PDF, Excel (.xlsx)') })] }));
};
