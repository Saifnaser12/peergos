import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tooltip, Alert, Paper, Collapse, Link } from '@mui/material';
import { Visibility as VisibilityIcon, Download as DownloadIcon, Launch as LaunchIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, FileDownload as FileDownloadIcon, CheckCircle as CheckCircleIcon, Warning as WarningIcon, Upload as UploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ftaService } from '../services/ftaService';
const SubmissionHistory = ({ trn, submissionType = 'all', maxItems, showTitle = true }) => {
    const { t } = useTranslation();
    const [submissions, setSubmissions] = useState([]);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [uploadingDoc, setUploadingDoc] = useState(null);
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    useEffect(() => {
        const loadSubmissions = () => {
            let allSubmissions = ftaService.getSubmissionHistory(trn);
            // Filter by submission type if specified
            if (submissionType !== 'all') {
                allSubmissions = allSubmissions.filter(sub => sub.data.submissionType === submissionType);
            }
            // Sort by timestamp (newest first)
            allSubmissions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            // Enhance submissions with document tracking
            const enhancedSubmissions = allSubmissions.map(sub => ({
                ...sub,
                taxAgentCertificate: {
                    uploaded: Math.random() > 0.3, // Mock: 70% have certificates
                    fileName: Math.random() > 0.3 ? `tax_agent_cert_${sub.referenceNumber}.pdf` : undefined,
                    uploadDate: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined
                },
                bankSlip: {
                    uploaded: Math.random() > 0.4, // Mock: 60% have bank slips
                    fileName: Math.random() > 0.4 ? `bank_slip_${sub.referenceNumber}.pdf` : undefined,
                    uploadDate: Math.random() > 0.4 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined
                }
            }));
            // Limit items if specified
            if (maxItems) {
                setSubmissions(enhancedSubmissions.slice(0, maxItems));
            }
            else {
                setSubmissions(enhancedSubmissions);
            }
        };
        loadSubmissions();
    }, [trn, submissionType, maxItems]);
    const handleViewDetails = (submission) => {
        setSelectedSubmission(submission);
        setShowDetails(true);
    };
    const handleToggleExpand = (submissionId) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(submissionId)) {
            newExpanded.delete(submissionId);
        }
        else {
            newExpanded.add(submissionId);
        }
        setExpandedRows(newExpanded);
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'success';
            case 'submitted':
            case 'processing': return 'info';
            case 'rejected': return 'error';
            default: return 'default';
        }
    };
    const getStatusIcon = (status) => {
        // Could add icons based on status
        return null;
    };
    const handleDownloadReceipt = (submission) => {
        // Simulate receipt download
        const receiptContent = `
FTA SUBMISSION RECEIPT
=====================

Reference Number: ${submission.referenceNumber}
Submission ID: ${submission.submissionId}
Type: ${submission.data.submissionType}
Company: ${submission.data.companyName}
TRN: ${submission.data.trn}
Submission Date: ${new Date(submission.timestamp).toLocaleString()}
Status: ${submission.status.toUpperCase()}

${submission.trackingUrl ? `Track your submission: ${submission.trackingUrl}` : ''}

This is an automatically generated receipt.
Keep this for your records.
    `;
        const element = document.createElement('a');
        const file = new Blob([receiptContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `FTA_Receipt_${submission.referenceNumber}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: 'AED',
            minimumFractionDigits: 0
        }).format(amount);
    };
    const handleDocumentUpload = (submissionId, type) => {
        setUploadingDoc({ submissionId, type });
        setShowUploadDialog(true);
    };
    const handleFileUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file || !uploadingDoc)
            return;
        // Validate file type
        if (file.type !== 'application/pdf') {
            alert(t('submissionHistory.invalidFileType'));
            return;
        }
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert(t('submissionHistory.fileTooLarge'));
            return;
        }
        // Simulate upload
        setTimeout(() => {
            setSubmissions(prev => prev.map(sub => {
                if (sub.submissionId === uploadingDoc.submissionId) {
                    const docKey = uploadingDoc.type === 'certificate' ? 'taxAgentCertificate' : 'bankSlip';
                    return {
                        ...sub,
                        [docKey]: {
                            uploaded: true,
                            fileName: file.name,
                            uploadDate: new Date().toISOString()
                        }
                    };
                }
                return sub;
            }));
            setShowUploadDialog(false);
            setUploadingDoc(null);
        }, 1000);
    };
    const handleDeleteDocument = (submissionId, type) => {
        setSubmissions(prev => prev.map(sub => {
            if (sub.submissionId === submissionId) {
                const docKey = type === 'certificate' ? 'taxAgentCertificate' : 'bankSlip';
                return {
                    ...sub,
                    [docKey]: {
                        uploaded: false
                    }
                };
            }
            return sub;
        }));
    };
    const getMissingDocuments = (submission) => {
        const missing = [];
        if (!submission.taxAgentCertificate?.uploaded)
            missing.push('Tax Agent Certificate');
        if (!submission.bankSlip?.uploaded)
            missing.push('Bank Slip');
        return missing;
    };
    if (submissions.length === 0) {
        return (_jsx(Card, { children: _jsxs(CardContent, { children: [showTitle && (_jsx(Typography, { variant: "h6", gutterBottom: true, children: t('fta.submissions.title') })), _jsx(Alert, { severity: "info", children: t('fta.submissions.noSubmissions') })] }) }));
    }
    return (_jsxs(Card, { children: [_jsxs(CardContent, { children: [showTitle && (_jsxs(Typography, { variant: "h6", gutterBottom: true, children: [t('fta.submissions.title'), " (", submissions.length, ")"] })), _jsx(TableContainer, { component: Paper, variant: "outlined", children: _jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: t('submissionHistory.filingPeriod') }), _jsx(TableCell, { children: t('submissionHistory.amountPayable') }), _jsx(TableCell, { children: t('submissionHistory.status') }), _jsx(TableCell, { align: "center", children: t('submissionHistory.taxAgentCert') }), _jsx(TableCell, { align: "center", children: t('submissionHistory.bankSlip') }), _jsx(TableCell, { align: "center", children: t('submissionHistory.actions') })] }) }), _jsx(TableBody, { children: submissions.map((submission) => {
                                        const missingDocs = getMissingDocuments(submission);
                                        const amount = submission.data.submissionType === 'VAT'
                                            ? submission.data.data.vatDue || 0
                                            : submission.data.data.citDue || 0;
                                        return (_jsxs(React.Fragment, { children: [_jsxs(TableRow, { hover: true, sx: {
                                                        backgroundColor: missingDocs.length > 0 ? 'rgba(255, 152, 0, 0.04)' : 'inherit',
                                                        borderLeft: missingDocs.length > 0 ? '4px solid #ff9800' : 'none'
                                                    }, children: [_jsxs(TableCell, { children: [_jsx(Typography, { variant: "body2", sx: { fontWeight: 500 }, children: submission.data.taxPeriod }), _jsx(Typography, { variant: "caption", color: "text.secondary", sx: { fontFamily: 'monospace' }, children: submission.referenceNumber })] }), _jsxs(TableCell, { children: [_jsx(Typography, { variant: "body2", sx: { fontWeight: 600 }, children: formatCurrency(amount) }), _jsx(Chip, { label: submission.data.submissionType, size: "small", variant: "outlined", sx: { mt: 0.5 } })] }), _jsxs(TableCell, { children: [_jsx(Chip, { label: submission.status.toUpperCase(), color: getStatusColor(submission.status), size: "small" }), missingDocs.length > 0 && (_jsx(Box, { sx: { mt: 0.5 }, children: _jsx(Chip, { icon: _jsx(WarningIcon, {}), label: t('submissionHistory.missingDocs', { count: missingDocs.length }), color: "warning", size: "small", variant: "outlined" }) }))] }), _jsx(TableCell, { align: "center", children: submission.taxAgentCertificate?.uploaded ? (_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 0.5 }, children: [_jsx(CheckCircleIcon, { color: "success", fontSize: "small" }), _jsx(Tooltip, { title: submission.taxAgentCertificate.fileName, children: _jsx(IconButton, { size: "small", onClick: () => handleDeleteDocument(submission.submissionId, 'certificate'), children: _jsx(DeleteIcon, { fontSize: "small" }) }) })] })) : (_jsx(Tooltip, { title: t('submissionHistory.uploadCertificate'), children: _jsx(IconButton, { size: "small", color: "warning", onClick: () => handleDocumentUpload(submission.submissionId, 'certificate'), children: _jsx(UploadIcon, { fontSize: "small" }) }) })) }), _jsx(TableCell, { align: "center", children: submission.bankSlip?.uploaded ? (_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 0.5 }, children: [_jsx(CheckCircleIcon, { color: "success", fontSize: "small" }), _jsx(Tooltip, { title: submission.bankSlip.fileName, children: _jsx(IconButton, { size: "small", onClick: () => handleDeleteDocument(submission.submissionId, 'bankSlip'), children: _jsx(DeleteIcon, { fontSize: "small" }) }) })] })) : (_jsx(Tooltip, { title: t('submissionHistory.uploadBankSlip'), children: _jsx(IconButton, { size: "small", color: "warning", onClick: () => handleDocumentUpload(submission.submissionId, 'bankSlip'), children: _jsx(UploadIcon, { fontSize: "small" }) }) })) }), _jsx(TableCell, { align: "center", children: _jsxs(Box, { sx: { display: 'flex', gap: 0.5 }, children: [_jsx(Tooltip, { title: t('fta.submissions.viewDetails'), children: _jsx(IconButton, { size: "small", onClick: () => handleViewDetails(submission), children: _jsx(VisibilityIcon, { fontSize: "small" }) }) }), _jsx(Tooltip, { title: t('fta.submissions.downloadReceipt'), children: _jsx(IconButton, { size: "small", onClick: () => handleDownloadReceipt(submission), children: _jsx(FileDownloadIcon, { fontSize: "small" }) }) }), submission.trackingUrl && (_jsx(Tooltip, { title: t('fta.submissions.trackOnline'), children: _jsx(IconButton, { size: "small", onClick: () => window.open(submission.trackingUrl, '_blank'), children: _jsx(LaunchIcon, { fontSize: "small" }) }) })), _jsx(Tooltip, { title: expandedRows.has(submission.submissionId) ? t('fta.submissions.collapse') : t('fta.submissions.expand'), children: _jsx(IconButton, { size: "small", onClick: () => handleToggleExpand(submission.submissionId), children: expandedRows.has(submission.submissionId) ?
                                                                                _jsx(ExpandLessIcon, { fontSize: "small" }) :
                                                                                _jsx(ExpandMoreIcon, { fontSize: "small" }) }) })] }) })] }), _jsx(TableRow, { children: _jsx(TableCell, { colSpan: 6, sx: { py: 0 }, children: _jsx(Collapse, { in: expandedRows.has(submission.submissionId), children: _jsxs(Box, { sx: { py: 2, pl: 2, bgcolor: 'action.hover' }, children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: t('fta.submissions.submissionDetails') }), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: [_jsxs("strong", { children: [t('fta.submissions.submissionId'), ":"] }), " ", submission.submissionId] }), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: [_jsxs("strong", { children: [t('fta.submissions.taxPeriod'), ":"] }), " ", submission.data.taxPeriod] }), submission.data.submissionType === 'VAT' && submission.data.data.vatDue && (_jsxs(Typography, { variant: "body2", color: "text.secondary", children: [_jsxs("strong", { children: [t('fta.submissions.vatDue'), ":"] }), " ", formatCurrency(submission.data.data.vatDue)] })), submission.data.submissionType === 'CIT' && submission.data.data.citDue && (_jsxs(Typography, { variant: "body2", color: "text.secondary", children: [_jsxs("strong", { children: [t('fta.submissions.citDue'), ":"] }), " ", formatCurrency(submission.data.data.citDue)] }))] }) }) }) })] }, submission.submissionId));
                                    }) })] }) })] }), _jsxs(Dialog, { open: showDetails, onClose: () => setShowDetails(false), maxWidth: "md", fullWidth: true, children: [_jsxs(DialogTitle, { children: [t('fta.submissions.detailsTitle'), " - ", selectedSubmission?.referenceNumber] }), _jsx(DialogContent, { children: selectedSubmission && (_jsxs(Box, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: t('fta.submissions.generalInfo') }), _jsxs(Box, { sx: { mb: 3 }, children: [_jsxs(Typography, { variant: "body2", children: [_jsxs("strong", { children: [t('fta.submissions.company'), ":"] }), " ", selectedSubmission.data.companyName] }), _jsxs(Typography, { variant: "body2", children: [_jsxs("strong", { children: [t('fta.submissions.trn'), ":"] }), " ", selectedSubmission.data.trn] }), _jsxs(Typography, { variant: "body2", children: [_jsxs("strong", { children: [t('fta.submissions.type'), ":"] }), " ", selectedSubmission.data.submissionType] }), _jsxs(Typography, { variant: "body2", children: [_jsxs("strong", { children: [t('fta.submissions.taxPeriod'), ":"] }), " ", selectedSubmission.data.taxPeriod] }), _jsxs(Typography, { variant: "body2", children: [_jsxs("strong", { children: [t('fta.submissions.submittedOn'), ":"] }), " ", new Date(selectedSubmission.timestamp).toLocaleString()] }), _jsxs(Typography, { variant: "body2", sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsxs("strong", { children: [t('fta.submissions.status'), ":"] }), _jsx(Chip, { label: selectedSubmission.status.toUpperCase(), color: getStatusColor(selectedSubmission.status), size: "small" })] })] }), selectedSubmission.trackingUrl && (_jsxs(Box, { sx: { mb: 3 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: t('fta.submissions.tracking') }), _jsxs(Link, { href: selectedSubmission.trackingUrl, target: "_blank", rel: "noopener", sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [selectedSubmission.trackingUrl, _jsx(LaunchIcon, { fontSize: "small" })] })] })), _jsx(Typography, { variant: "h6", gutterBottom: true, children: t('fta.submissions.submittedData') }), _jsx(Paper, { sx: { p: 2, bgcolor: 'grey.50' }, children: _jsx("pre", { style: { fontSize: '0.875rem', margin: 0, whiteSpace: 'pre-wrap' }, children: JSON.stringify(selectedSubmission.data.data, null, 2) }) })] })) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setShowDetails(false), children: t('common.close') }), selectedSubmission && (_jsx(Button, { variant: "contained", startIcon: _jsx(DownloadIcon, {}), onClick: () => handleDownloadReceipt(selectedSubmission), children: t('fta.submissions.downloadReceipt') }))] })] }), _jsxs(Dialog, { open: showUploadDialog, onClose: () => setShowUploadDialog(false), maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: uploadingDoc?.type === 'certificate'
                            ? t('submissionHistory.uploadCertificate')
                            : t('submissionHistory.uploadBankSlip') }), _jsx(DialogContent, { children: _jsxs(Box, { sx: { textAlign: 'center', py: 3 }, children: [_jsx("input", { accept: "application/pdf", style: { display: 'none' }, id: "document-upload", type: "file", onChange: handleFileUpload }), _jsx("label", { htmlFor: "document-upload", children: _jsx(Button, { variant: "outlined", component: "span", startIcon: _jsx(UploadIcon, {}), size: "large", sx: { mb: 2 }, children: t('submissionHistory.selectFile') }) }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: t('submissionHistory.pdfOnly') }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: t('submissionHistory.maxSize') })] }) }), _jsx(DialogActions, { children: _jsx(Button, { onClick: () => setShowUploadDialog(false), children: t('common.cancel') }) })] })] }));
};
export default SubmissionHistory;
