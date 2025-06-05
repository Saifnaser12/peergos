
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Alert,
  Paper,
  Collapse,
  Link,
  Stack,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Launch as LaunchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  FileDownload as FileDownloadIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { ftaService, FTASubmissionResponse, FTASubmissionData } from '../services/ftaService';

interface SubmissionHistoryProps {
  trn: string;
  submissionType?: 'CIT' | 'VAT' | 'all';
  maxItems?: number;
  showTitle?: boolean;
}

type SubmissionWithData = FTASubmissionResponse & { 
  data: FTASubmissionData;
  taxAgentCertificate?: {
    uploaded: boolean;
    fileName?: string;
    uploadDate?: string;
  };
  bankSlip?: {
    uploaded: boolean;
    fileName?: string;
    uploadDate?: string;
  };
};

const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({
  trn,
  submissionType = 'all',
  maxItems,
  showTitle = true
}) => {
  const { t } = useTranslation();
  const [submissions, setSubmissions] = useState<SubmissionWithData[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionWithData | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [uploadingDoc, setUploadingDoc] = useState<{ submissionId: string; type: 'certificate' | 'bankSlip' } | null>(null);
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
      } else {
        setSubmissions(enhancedSubmissions);
      }
    };

    loadSubmissions();
  }, [trn, submissionType, maxItems]);

  const handleViewDetails = (submission: SubmissionWithData) => {
    setSelectedSubmission(submission);
    setShowDetails(true);
  };

  const handleToggleExpand = (submissionId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(submissionId)) {
      newExpanded.delete(submissionId);
    } else {
      newExpanded.add(submissionId);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'submitted': case 'processing': return 'info';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    // Could add icons based on status
    return null;
  };

  const handleDownloadReceipt = (submission: SubmissionWithData) => {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleDocumentUpload = (submissionId: string, type: 'certificate' | 'bankSlip') => {
    setUploadingDoc({ submissionId, type });
    setShowUploadDialog(true);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !uploadingDoc) return;

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

  const handleDeleteDocument = (submissionId: string, type: 'certificate' | 'bankSlip') => {
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

  const getMissingDocuments = (submission: SubmissionWithData) => {
    const missing = [];
    if (!submission.taxAgentCertificate?.uploaded) missing.push('Tax Agent Certificate');
    if (!submission.bankSlip?.uploaded) missing.push('Bank Slip');
    return missing;
  };

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent>
          {showTitle && (
            <Typography variant="h6" gutterBottom>
              {t('fta.submissions.title')}
            </Typography>
          )}
          <Alert severity="info">
            {t('fta.submissions.noSubmissions')}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        {showTitle && (
          <Typography variant="h6" gutterBottom>
            {t('fta.submissions.title')} ({submissions.length})
          </Typography>
        )}
        
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('submissionHistory.filingPeriod')}</TableCell>
                <TableCell>{t('submissionHistory.amountPayable')}</TableCell>
                <TableCell>{t('submissionHistory.status')}</TableCell>
                <TableCell align="center">{t('submissionHistory.taxAgentCert')}</TableCell>
                <TableCell align="center">{t('submissionHistory.bankSlip')}</TableCell>
                <TableCell align="center">{t('submissionHistory.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((submission) => {
                const missingDocs = getMissingDocuments(submission);
                const amount = submission.data.submissionType === 'VAT' 
                  ? submission.data.data.vatDue || 0
                  : submission.data.data.citDue || 0;
                
                return (
                  <React.Fragment key={submission.submissionId}>
                    <TableRow hover sx={{ 
                      backgroundColor: missingDocs.length > 0 ? 'rgba(255, 152, 0, 0.04)' : 'inherit',
                      borderLeft: missingDocs.length > 0 ? '4px solid #ff9800' : 'none'
                    }}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {submission.data.taxPeriod}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                          {submission.referenceNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatCurrency(amount)}
                        </Typography>
                        <Chip
                          label={submission.data.submissionType}
                          size="small"
                          variant="outlined"
                          sx={{ mt: 0.5 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={submission.status.toUpperCase()}
                          color={getStatusColor(submission.status)}
                          size="small"
                        />
                        {missingDocs.length > 0 && (
                          <Box sx={{ mt: 0.5 }}>
                            <Chip
                              icon={<WarningIcon />}
                              label={t('submissionHistory.missingDocs', { count: missingDocs.length })}
                              color="warning"
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {submission.taxAgentCertificate?.uploaded ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CheckCircleIcon color="success" fontSize="small" />
                            <Tooltip title={submission.taxAgentCertificate.fileName}>
                              <IconButton size="small" onClick={() => handleDeleteDocument(submission.submissionId, 'certificate')}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ) : (
                          <Tooltip title={t('submissionHistory.uploadCertificate')}>
                            <IconButton 
                              size="small" 
                              color="warning"
                              onClick={() => handleDocumentUpload(submission.submissionId, 'certificate')}
                            >
                              <UploadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {submission.bankSlip?.uploaded ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CheckCircleIcon color="success" fontSize="small" />
                            <Tooltip title={submission.bankSlip.fileName}>
                              <IconButton size="small" onClick={() => handleDeleteDocument(submission.submissionId, 'bankSlip')}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ) : (
                          <Tooltip title={t('submissionHistory.uploadBankSlip')}>
                            <IconButton 
                              size="small" 
                              color="warning"
                              onClick={() => handleDocumentUpload(submission.submissionId, 'bankSlip')}
                            >
                              <UploadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title={t('fta.submissions.viewDetails')}>
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(submission)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title={t('fta.submissions.downloadReceipt')}>
                          <IconButton
                            size="small"
                            onClick={() => handleDownloadReceipt(submission)}
                          >
                            <FileDownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        {submission.trackingUrl && (
                          <Tooltip title={t('fta.submissions.trackOnline')}>
                            <IconButton
                              size="small"
                              onClick={() => window.open(submission.trackingUrl, '_blank')}
                            >
                              <LaunchIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        <Tooltip title={expandedRows.has(submission.submissionId) ? t('fta.submissions.collapse') : t('fta.submissions.expand')}>
                          <IconButton
                            size="small"
                            onClick={() => handleToggleExpand(submission.submissionId)}
                          >
                            {expandedRows.has(submission.submissionId) ? 
                              <ExpandLessIcon fontSize="small" /> : 
                              <ExpandMoreIcon fontSize="small" />
                            }
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell colSpan={5} sx={{ py: 0 }}>
                      <Collapse in={expandedRows.has(submission.submissionId)}>
                        <Box sx={{ py: 2, pl: 2, bgcolor: 'action.hover' }}>
                          <Typography variant="subtitle2" gutterBottom>
                            {t('fta.submissions.submissionDetails')}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>{t('fta.submissions.submissionId')}:</strong> {submission.submissionId}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>{t('fta.submissions.taxPeriod')}:</strong> {submission.data.taxPeriod}
                          </Typography>
                          {submission.data.submissionType === 'VAT' && submission.data.data.vatDue && (
                            <Typography variant="body2" color="text.secondary">
                              <strong>{t('fta.submissions.vatDue')}:</strong> {formatCurrency(submission.data.data.vatDue)}
                            </Typography>
                          )}
                          {submission.data.submissionType === 'CIT' && submission.data.data.citDue && (
                            <Typography variant="body2" color="text.secondary">
                              <strong>{t('fta.submissions.citDue')}:</strong> {formatCurrency(submission.data.data.citDue)}
                            </Typography>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      {/* Details Dialog */}
      <Dialog
        open={showDetails}
        onClose={() => setShowDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {t('fta.submissions.detailsTitle')} - {selectedSubmission?.referenceNumber}
        </DialogTitle>
        <DialogContent>
          {selectedSubmission && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {t('fta.submissions.generalInfo')}
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>{t('fta.submissions.company')}:</strong> {selectedSubmission.data.companyName}
                </Typography>
                <Typography variant="body2">
                  <strong>{t('fta.submissions.trn')}:</strong> {selectedSubmission.data.trn}
                </Typography>
                <Typography variant="body2">
                  <strong>{t('fta.submissions.type')}:</strong> {selectedSubmission.data.submissionType}
                </Typography>
                <Typography variant="body2">
                  <strong>{t('fta.submissions.taxPeriod')}:</strong> {selectedSubmission.data.taxPeriod}
                </Typography>
                <Typography variant="body2">
                  <strong>{t('fta.submissions.submittedOn')}:</strong> {new Date(selectedSubmission.timestamp).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <strong>{t('fta.submissions.status')}:</strong>
                  <Chip
                    label={selectedSubmission.status.toUpperCase()}
                    color={getStatusColor(selectedSubmission.status)}
                    size="small"
                  />
                </Typography>
              </Box>

              {selectedSubmission.trackingUrl && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {t('fta.submissions.tracking')}
                  </Typography>
                  <Link
                    href={selectedSubmission.trackingUrl}
                    target="_blank"
                    rel="noopener"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    {selectedSubmission.trackingUrl}
                    <LaunchIcon fontSize="small" />
                  </Link>
                </Box>
              )}

              <Typography variant="h6" gutterBottom>
                {t('fta.submissions.submittedData')}
              </Typography>
              
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <pre style={{ fontSize: '0.875rem', margin: 0, whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(selectedSubmission.data.data, null, 2)}
                </pre>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>
            {t('common.close')}
          </Button>
          {selectedSubmission && (
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => handleDownloadReceipt(selectedSubmission)}
            >
              {t('fta.submissions.downloadReceipt')}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Document Upload Dialog */}
      <Dialog open={showUploadDialog} onClose={() => setShowUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {uploadingDoc?.type === 'certificate' 
            ? t('submissionHistory.uploadCertificate')
            : t('submissionHistory.uploadBankSlip')
          }
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <input
              accept="application/pdf"
              style={{ display: 'none' }}
              id="document-upload"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="document-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadIcon />}
                size="large"
                sx={{ mb: 2 }}
              >
                {t('submissionHistory.selectFile')}
              </Button>
            </label>
            <Typography variant="body2" color="text.secondary">
              {t('submissionHistory.pdfOnly')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('submissionHistory.maxSize')}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUploadDialog(false)}>
            {t('common.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default SubmissionHistory;
