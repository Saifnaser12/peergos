
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Chip,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  CloudUpload as CloudUploadIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { ftaService, FTAIntegrationStatus } from '../services/ftaService';

interface FTAIntegrationStatusProps {
  trn: string;
  showDetails?: boolean;
  variant?: 'badge' | 'card' | 'full';
}

const FTAIntegrationStatusComponent: React.FC<FTAIntegrationStatusProps> = ({
  trn,
  showDetails = false,
  variant = 'badge'
}) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<FTAIntegrationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = async () => {
    try {
      const ftaStatus = await ftaService.getFTAIntegrationStatus(trn);
      setStatus(ftaStatus);
    } catch (error) {
      console.error('Failed to fetch FTA status:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (trn) {
      fetchStatus();
    }
  }, [trn]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStatus();
  };

  const getStatusColor = () => {
    if (!status) return 'default';
    if (!status.isConnected) return 'error';
    if (status.alerts.length > 0) return 'warning';
    return 'success';
  };

  const getStatusIcon = () => {
    if (!status) return <InfoIcon />;
    if (!status.isConnected) return <ErrorIcon />;
    if (status.alerts.length > 0) return <WarningIcon />;
    return <CheckCircleIcon />;
  };

  const getStatusText = () => {
    if (!status) return t('fta.status.loading');
    if (!status.isConnected) return t('fta.status.disconnected');
    if (status.alerts.length > 0) return t('fta.status.attention');
    return t('fta.status.connected');
  };

  if (loading) {
    return variant === 'badge' ? (
      <Chip
        size="small"
        label={t('fta.status.loading')}
        color="default"
        icon={<InfoIcon />}
      />
    ) : (
      <Card>
        <CardContent>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1 }}>
            {t('fta.status.loadingDetails')}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'badge') {
    return (
      <>
        <Chip
          size="small"
          label={getStatusText()}
          color={getStatusColor()}
          icon={getStatusIcon()}
          onClick={() => setShowDialog(true)}
          sx={{ cursor: 'pointer' }}
        />
        
        <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getStatusIcon()}
            {t('fta.integration.title')}
            <Box sx={{ ml: 'auto' }}>
              <Tooltip title={t('fta.status.refresh')}>
                <IconButton onClick={handleRefresh} disabled={refreshing}>
                  <RefreshIcon sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
                </IconButton>
              </Tooltip>
            </Box>
          </DialogTitle>
          <DialogContent>
            {status && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('fta.integration.description')}
                </Typography>
                
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {t('fta.status.complianceScore')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={status.complianceScore}
                      sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                      color={status.complianceScore >= 80 ? 'success' : status.complianceScore >= 60 ? 'warning' : 'error'}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {status.complianceScore}%
                    </Typography>
                  </Box>
                </Box>

                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CloudUploadIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={t('fta.status.submissions')}
                      secondary={`${status.submissionsCount} ${t('fta.status.submissionsCount')}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <ScheduleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={t('fta.status.lastSync')}
                      secondary={new Date(status.lastSync).toLocaleString()}
                    />
                  </ListItem>
                </List>

                {status.alerts.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {t('fta.status.alerts')}
                    </Typography>
                    {status.alerts.map((alert, index) => (
                      <Alert key={index} severity="warning" sx={{ mb: 1 }}>
                        {alert}
                      </Alert>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDialog(false)}>
              {t('common.close')}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  if (variant === 'card' && status) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getStatusIcon()}
              {t('fta.integration.title')}
            </Typography>
            <Chip
              size="small"
              label={getStatusText()}
              color={getStatusColor()}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('fta.status.complianceScore')}: {status.complianceScore}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={status.complianceScore}
              sx={{ height: 6, borderRadius: 3 }}
              color={status.complianceScore >= 80 ? 'success' : status.complianceScore >= 60 ? 'warning' : 'error'}
            />
          </Box>

          <Typography variant="body2" color="text.secondary">
            {status.submissionsCount} {t('fta.status.submissionsCount')} • {t('fta.status.lastSync')}: {new Date(status.lastSync).toLocaleDateString()}
          </Typography>

          {status.alerts.length > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              {status.alerts[0]}
              {status.alerts.length > 1 && ` (+${status.alerts.length - 1} more)`}
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default FTAIntegrationStatusComponent;
