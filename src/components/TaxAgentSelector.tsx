
import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Chip,
  Alert,
  Link,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
  Rating,
  Divider
} from '@mui/material';
import {
  Upload as UploadIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  Security as CertificateIcon,
  Star as StarIcon,
  Clear as ClearIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useTaxAgent, mockTaxAgents } from '../context/TaxAgentContext';

interface TaxAgentSelectorProps {
  showTitle?: boolean;
  variant?: 'full' | 'compact';
}

const TaxAgentSelector: React.FC<TaxAgentSelectorProps> = ({ 
  showTitle = true, 
  variant = 'full' 
}) => {
  const { t } = useTranslation();
  const { 
    selectedAgent, 
    uploadedCertificate, 
    certificateUrl,
    selectAgent, 
    uploadCertificate, 
    clearAgent 
  } = useTaxAgent();

  const [showCertificatePreview, setShowCertificatePreview] = useState(false);

  const handleAgentSelect = (agentId: string) => {
    const agent = mockTaxAgents.find(a => a.id === agentId);
    if (agent) {
      selectAgent(agent);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert(t('taxAgent.upload.invalidFileType', 'Please upload a PDF or image file'));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(t('taxAgent.upload.fileTooLarge', 'File size must be less than 5MB'));
        return;
      }

      uploadCertificate(file);
    }
  };

  const isCompleteSelection = selectedAgent && uploadedCertificate;

  if (variant === 'compact' && isCompleteSelection) {
    return (
      <Alert 
        severity="success" 
        icon={<CheckCircleIcon />}
        action={
          <IconButton size="small" onClick={clearAgent}>
            <ClearIcon />
          </IconButton>
        }
      >
        <Typography variant="body2" fontWeight="medium">
          {t('taxAgent.selected', 'FTA Approved Agent Selected')}: {selectedAgent.name}
        </Typography>
      </Alert>
    );
  }

  return (
    <Card sx={{ mt: variant === 'full' ? 3 : 0 }}>
      {showTitle && (
        <CardHeader 
          title={t('taxAgent.title', 'Tax Agent Selection')}
          subheader={t('taxAgent.subtitle', 'Select an FTA-approved tax agent to assist with your submissions')}
          avatar={<PersonIcon color="primary" />}
        />
      )}
      <CardContent>
        {/* Agent Selection Dropdown */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>{t('taxAgent.selectAgent', 'Select Tax Agent')}</InputLabel>
          <Select
            value={selectedAgent?.id || ''}
            onChange={(e) => handleAgentSelect(e.target.value)}
            label={t('taxAgent.selectAgent', 'Select Tax Agent')}
          >
            <MenuItem value="">
              <em>{t('taxAgent.noAgent', 'No agent selected')}</em>
            </MenuItem>
            {mockTaxAgents.map((agent) => (
              <MenuItem key={agent.id} value={agent.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" fontWeight="medium">
                      {agent.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {agent.certificateId}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating size="small" value={agent.rating} readOnly precision={0.1} />
                    <Typography variant="caption">
                      {agent.rating}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Selected Agent Details */}
        {selectedAgent && (
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.50' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedAgent.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Certificate ID: {selectedAgent.certificateId}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Rating size="small" value={selectedAgent.rating} readOnly precision={0.1} />
                  <Typography variant="body2">
                    {selectedAgent.rating} / 5.0
                  </Typography>
                </Box>
              </Box>
              <Chip 
                label={t('taxAgent.ftaApproved', 'FTA Approved')}
                color="success"
                size="small"
                icon={<CheckCircleIcon />}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('taxAgent.specializations', 'Specializations')}:
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {selectedAgent.specialization.map((spec, index) => (
                  <Chip 
                    key={index} 
                    label={spec} 
                    size="small" 
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>

            <Link 
              href={selectedAgent.ftaProfileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ fontSize: '0.875rem' }}
            >
              {t('taxAgent.viewProfile', 'View FTA Profile')} →
            </Link>
          </Paper>
        )}

        {/* Certificate Upload */}
        {selectedAgent && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CertificateIcon />
              {t('taxAgent.uploadCertificate', 'Upload Tax Agent Certificate')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('taxAgent.uploadDescription', 'Upload the official certificate or authorization document')}
            </Typography>

            <input
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              id="certificate-upload"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="certificate-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadIcon />}
                fullWidth
                sx={{ mb: 2 }}
              >
                {uploadedCertificate 
                  ? t('taxAgent.replaceCertificate', 'Replace Certificate')
                  : t('taxAgent.uploadCertificate', 'Upload Certificate')
                }
              </Button>
            </label>

            {uploadedCertificate && (
              <Paper sx={{ p: 2, bgcolor: 'success.50' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {uploadedCertificate.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(uploadedCertificate.size / 1024).toFixed(1)} KB
                    </Typography>
                  </Box>
                  <Box>
                    <Tooltip title={t('taxAgent.viewCertificate', 'View Certificate')}>
                      <IconButton 
                        size="small" 
                        onClick={() => setShowCertificatePreview(true)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Paper>
            )}
          </>
        )}

        {/* Success Message */}
        {isCompleteSelection && (
          <Alert 
            severity="success" 
            sx={{ mt: 3 }}
            icon={<CheckCircleIcon />}
          >
            <Typography variant="body2" fontWeight="medium">
              {t('taxAgent.selectionComplete', 'Tax agent selection completed successfully!')}
            </Typography>
            <Typography variant="caption">
              {t('taxAgent.selectionCompleteDesc', 'Your selected agent can now assist with tax submissions and compliance.')}
            </Typography>
          </Alert>
        )}

        {/* Info Alert */}
        <Alert severity="info" sx={{ mt: 2 }} icon={<InfoIcon />}>
          <Typography variant="body2">
            {t('taxAgent.info', 'All listed agents are pre-approved by the FTA and authorized to represent taxpayers in the UAE.')}
          </Typography>
        </Alert>

        {/* Certificate Preview Dialog - Simple implementation */}
        {showCertificatePreview && certificateUrl && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999
            }}
            onClick={() => setShowCertificatePreview(false)}
          >
            <Box sx={{ maxWidth: '90%', maxHeight: '90%', bgcolor: 'white', p: 2, borderRadius: 1 }}>
              {uploadedCertificate?.type.startsWith('image/') ? (
                <img 
                  src={certificateUrl} 
                  alt="Certificate Preview"
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
              ) : (
                <iframe 
                  src={certificateUrl}
                  style={{ width: '800px', height: '600px' }}
                  title="Certificate Preview"
                />
              )}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TaxAgentSelector;
