
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Chip, 
  Typography, 
  Card, 
  CardContent,
  Tooltip 
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { checkFTAIntegrationStatus } from '../utils/fta/utils';

interface FTAIntegrationStatusProps {
  trn?: string;
  showDetails?: boolean;
  variant?: 'badge' | 'card';
}

const FTAIntegrationStatus: React.FC<FTAIntegrationStatusProps> = ({
  trn = '100123456700003',
  showDetails = false,
  variant = 'badge'
}) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<{
    isIntegrated: boolean;
    status: 'Integrated' | 'Pending Setup';
    reason?: string;
  }>({ isIntegrated: false, status: 'Pending Setup' });

  useEffect(() => {
    if (trn) {
      const integrationStatus = checkFTAIntegrationStatus(trn);
      setStatus(integrationStatus);
    }
  }, [trn]);

  const getStatusColor = () => {
    return status.isIntegrated ? 'success' : 'warning';
  };

  const getStatusIcon = () => {
    if (status.isIntegrated) {
      return <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5 }} />;
    } else {
      return <WarningIcon sx={{ fontSize: 16, mr: 0.5 }} />;
    }
  };

  if (variant === 'badge') {
    return (
      <Tooltip title={t('fta.simulation.tooltip', 'Simulation only – not connected to FTA')}>
        <Chip
          icon={getStatusIcon()}
          label={t(`fta.status.${status.status.toLowerCase().replace(' ', '_')}`, status.status)}
          color={getStatusColor()}
          variant="outlined"
          size="small"
        />
      </Tooltip>
    );
  }

  if (variant === 'card') {
    return (
      <Card sx={{ border: 1, borderColor: status.isIntegrated ? 'success.main' : 'warning.main' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {t('fta.integration.title', 'FTA Connection')}
            </Typography>
            <Chip
              icon={getStatusIcon()}
              label={status.status}
              color={getStatusColor()}
              size="small"
            />
          </Box>
          
          {showDetails && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {status.isIntegrated 
                  ? t('fta.integration.connected', 'Successfully connected to FTA systems')
                  : t('fta.integration.pending', 'Setup required to connect to FTA')
                }
              </Typography>
              
              {status.reason && (
                <Typography variant="caption" color="warning.main">
                  {status.reason}
                </Typography>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <InfoIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {t('fta.simulation.note', 'Simulation Mode')}
                </Typography>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default FTAIntegrationStatus;
