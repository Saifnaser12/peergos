import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  Chip,
  CircularProgress,
  InputAdornment,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Search as SearchIcon,
  Business as BusinessIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { ftaService, TRNLookupResult } from '../services/ftaService';

interface TRNLookupProps {
  onTRNFound?: (result: TRNLookupResult) => void;
  autoFill?: boolean;
  variant?: 'standalone' | 'embedded';
}

const TRNLookup: React.FC<TRNLookupProps> = ({
  onTRNFound,
  autoFill = false,
  variant = 'standalone'
}) => {
  const { t } = useTranslation();
  const [trn, setTrn] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TRNLookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTRNChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, ''); // Only digits
    if (value.length <= 15) {
      setTrn(value);
      setError(null);
      if (result) setResult(null); // Clear previous result
    }
  }, [result]);

  const handleLookup = async () => {
    if (!trn || trn.length !== 15) {
      setError(t('trn.lookup.invalidFormat'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const lookupResult = await ftaService.lookupTRN(trn);

      if (lookupResult) {
        setResult(lookupResult);
        if (onTRNFound) {
          onTRNFound(lookupResult);
        }
      } else {
        setError(t('trn.lookup.notFound'));
        setResult(null);
      }
    } catch (err: any) {
      setError(err.message || t('trn.lookup.error'));
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleLookup();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'suspended': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon />;
      case 'suspended': return <WarningIcon />;
      case 'cancelled': return <CancelIcon />;
      default: return <AssessmentIcon />;
    }
  };

  const getComplianceColor = (compliance: string) => {
    switch (compliance) {
      case 'compliant': return 'success';
      case 'under-review': return 'warning';
      case 'non-compliant': return 'error';
      default: return 'default';
    }
  };

  const formatTRN = (trnValue: string) => {
    // Format as XXX-XXXX-XXXX-XXXX for display
    if (trnValue.length <= 3) return trnValue;
    if (trnValue.length <= 7) return `${trnValue.slice(0, 3)}-${trnValue.slice(3)}`;
    if (trnValue.length <= 11) return `${trnValue.slice(0, 3)}-${trnValue.slice(3, 7)}-${trnValue.slice(7)}`;
    return `${trnValue.slice(0, 3)}-${trnValue.slice(3, 7)}-${trnValue.slice(7, 11)}-${trnValue.slice(11)}`;
  };

  const LookupForm = (
    <Box>
      <TextField
        fullWidth
        label={t('trn.lookup.label')}
        placeholder="100123456700003"
        value={formatTRN(trn)}
        onChange={handleTRNChange}
        onKeyPress={handleKeyPress}
        error={!!error}
        helperText={error || t('trn.lookup.helperText')}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <BusinessIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: loading && (
            <InputAdornment position="end">
              <CircularProgress size={20} />
            </InputAdornment>
          )
        }}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        fullWidth
        onClick={handleLookup}
        disabled={loading || trn.length !== 15}
        startIcon={<SearchIcon />}
        sx={{ mb: 2 }}
      >
        {loading ? t('trn.lookup.searching') : t('trn.lookup.search')}
      </Button>
    </Box>
  );

  const ResultDisplay = result && (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            {result.companyName}
          </Typography>
          <Chip
            label={result.status.toUpperCase()}
            color={getStatusColor(result.status)}
            size="small"
            icon={getStatusIcon(result.status)}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          TRN: {formatTRN(result.trn)}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <List dense>
          <ListItem disableGutters>
            <ListItemIcon>
              <BusinessIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={t('trn.lookup.businessType')}
              secondary={result.businessType}
            />
          </ListItem>

          <ListItem disableGutters>
            <ListItemIcon>
              <LocationOnIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={t('trn.lookup.emirate')}
              secondary={result.emirate}
            />
          </ListItem>

          <ListItem disableGutters>
            <ListItemIcon>
              <CalendarIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={t('trn.lookup.registrationDate')}
              secondary={new Date(result.registrationDate).toLocaleDateString()}
            />
          </ListItem>

          {result.lastFilingDate && (
            <ListItem disableGutters>
              <ListItemIcon>
                <AssessmentIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={t('trn.lookup.lastFiling')}
                secondary={new Date(result.lastFilingDate).toLocaleDateString()}
              />
            </ListItem>
          )}
        </List>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {t('trn.lookup.complianceStatus')}
          </Typography>
          <Chip
            label={result.complianceStatus.replace('-', ' ').toUpperCase()}
            color={getComplianceColor(result.complianceStatus)}
            size="small"
          />
        </Box>

        {result.complianceStatus === 'non-compliant' && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {t('trn.lookup.nonCompliantWarning')}
          </Alert>
        )}

        {result.status === 'suspended' && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {t('trn.lookup.suspendedWarning')}
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  if (variant === 'embedded') {
    return (
      <Box>
        {LookupForm}
        {ResultDisplay}
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('trn.lookup.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('trn.lookup.description')}
        </Typography>

        {LookupForm}
        {ResultDisplay}
      </CardContent>
    </Card>
  );
};

export default TRNLookup;