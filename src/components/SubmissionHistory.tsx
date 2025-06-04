
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
  Link
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Launch as LaunchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import { ftaService, FTASubmissionResponse, FTASubmissionData } from '../services/ftaService';

interface SubmissionHistoryProps {
  trn: string;
  submissionType?: 'CIT' | 'VAT' | 'all';
  maxItems?: number;
  showTitle?: boolean;
}

type SubmissionWithData = FTASubmissionResponse & { data: FTASubmissionData };

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

  useEffect(() => {
    const loadSubmissions = () => {
      let allSubmissions = ftaService.getSubmissionHistory(trn);
      
      // Filter by submission type if specified
      if (submissionType !== 'all') {
        allSubmissions = allSubmissions.filter(sub => sub.data.submissionType === submissionType);
      }
      
      // Sort by timestamp (newest first)
      allSubmissions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      // Limit items if specified
      if (maxItems) {
        allSubmissions = allSubmissions.slice(0, maxItems);
      }
      
      setSubmissions(allSubmissions);
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
                <TableCell>{t('fta.submissions.reference')}</TableCell>
                <TableCell>{t('fta.submissions.type')}</TableCell>
                <TableCell>{t('fta.submissions.date')}</TableCell>
                <TableCell>{t('fta.submissions.status')}</TableCell>
                <TableCell align="center">{t('fta.submissions.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((submission) => (
                <React.Fragment key={submission.submissionId}>
                  <TableRow hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {submission.referenceNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={submission.data.submissionType}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(submission.timestamp).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={submission.status.toUpperCase()}
                        color={getStatusColor(submission.status)}
                        size="small"
                      />
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
    </Card>
  );
};

export default SubmissionHistory;
