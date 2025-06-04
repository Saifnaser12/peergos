
import React from 'react';
import {
  Box,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  Grid,
  InputAdornment,
  Tooltip,
  IconButton,
  Paper,
  alpha,
  useTheme
} from '@mui/material';
// Removed MUI date picker imports - using native HTML date inputs
import { Info as InfoIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { CompanyInfo } from '../../types/transferPricing';

interface CompanyInfoFormProps {
  companyInfo: CompanyInfo;
  onUpdate: (companyInfo: CompanyInfo) => void;
}

export const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({ companyInfo, onUpdate }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const handleChange = (field: keyof CompanyInfo) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    onUpdate({
      ...companyInfo,
      [field]: value
    });
  };

  const handleNumberChange = (field: keyof CompanyInfo) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value ? parseFloat(event.target.value) : undefined;
    onUpdate({
      ...companyInfo,
      [field]: value
    });
  };

  const handleDateChange = (field: keyof CompanyInfo) => (date: Date | null) => {
    onUpdate({
      ...companyInfo,
      [field]: date ? date.toISOString().split('T')[0] : ''
    });
  };

  return (
      <Box>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          {t('transferPricing.companyInformation')}
        </Typography>
        
        <Grid container spacing={3}>
          {/* Basic Company Information */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.02),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                {t('transferPricing.basicInformation')}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label={t('transferPricing.legalName')}
                    value={companyInfo.legalName}
                    onChange={handleChange('legalName')}
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label={t('transferPricing.trn')}
                    value={companyInfo.trn}
                    onChange={handleChange('trn')}
                    variant="outlined"
                    placeholder="100000000000003"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title={t('transferPricing.trnTooltip')}>
                            <IconButton size="small">
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label={t('transferPricing.fiscalYearStart')}
                    value={companyInfo.fiscalYearStart}
                    onChange={handleChange('fiscalYearStart')}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label={t('transferPricing.fiscalYearEnd')}
                    value={companyInfo.fiscalYearEnd}
                    onChange={handleChange('fiscalYearEnd')}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Group Structure Information */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.secondary.main, 0.02),
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>
                {t('transferPricing.groupStructure')}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={companyInfo.isPartOfTaxGroup}
                        onChange={handleChange('isPartOfTaxGroup')}
                        color="secondary"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {t('transferPricing.isPartOfTaxGroup')}
                        <Tooltip title={t('transferPricing.taxGroupTooltip')}>
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={companyInfo.isPartOfMultinationalGroup}
                        onChange={handleChange('isPartOfMultinationalGroup')}
                        color="secondary"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {t('transferPricing.isPartOfMultinationalGroup')}
                        <Tooltip title={t('transferPricing.multinationalGroupTooltip')}>
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                  />
                </Grid>

                {companyInfo.isPartOfMultinationalGroup && (
                  <>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label={t('transferPricing.consolidatedRevenue')}
                        value={companyInfo.consolidatedRevenue || ''}
                        onChange={handleNumberChange('consolidatedRevenue')}
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">AED</InputAdornment>,
                          endAdornment: (
                            <InputAdornment position="end">
                              <Tooltip title={t('transferPricing.consolidatedRevenueTooltip')}>
                                <IconButton size="small">
                                  <InfoIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label={t('transferPricing.consolidatedAssets')}
                        value={companyInfo.consolidatedAssets || ''}
                        onChange={handleNumberChange('consolidatedAssets')}
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">AED</InputAdornment>,
                          endAdornment: (
                            <InputAdornment position="end">
                              <Tooltip title={t('transferPricing.consolidatedAssetsTooltip')}>
                                <IconButton size="small">
                                  <InfoIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
  );
};
