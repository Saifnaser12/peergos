import React, { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { TransactionType, TransferPricingMethod, RelatedPartyTransaction, TransferPricingDisclosure } from '../../types/transferPricing';
import { useTransferPricing } from '../../hooks/useTransferPricing';

interface FileUploadProps {
  label: string;
  tooltip: string;
  onChange: (file: File | undefined) => void;
  accept?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, tooltip, onChange, accept = '.pdf,.doc,.docx' }) => {
  const { t } = useTranslation();
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onChange(file);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2">{label}</Typography>
        <Tooltip title={tooltip}>
          <IconButton size="small">
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button variant="outlined" component="label">
          {t('transferPricing.uploadFile')}
          <input type="file" hidden accept={accept} onChange={handleFileChange} />
        </Button>
        {fileName && (
          <Typography variant="body2" sx={{ ml: 2 }}>
            {fileName}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export const TransferPricingForm: React.FC = () => {
  const { t } = useTranslation();
  const {
    loading,
    error,
    createDisclosure,
    uploadFile,
  } = useTransferPricing();

  const [formData, setFormData] = useState({
    relatedPartyName: '',
    jurisdiction: '',
    transactionType: '',
    pricingMethod: '',
    transactionValue: '',
    notes: '',
  });

  const [files, setFiles] = useState<{
    masterFile?: File;
    localFile?: File;
    cbcReport?: File;
  }>({});

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (field: 'masterFile' | 'localFile' | 'cbcReport') => (file: File | undefined) => {
    setFiles((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // Create the disclosure first
      const transaction: Omit<RelatedPartyTransaction, 'id' | 'createdAt' | 'updatedAt'> = {
        relatedPartyName: formData.relatedPartyName,
        jurisdiction: formData.jurisdiction,
        transactionType: formData.transactionType as TransactionType,
        pricingMethod: formData.pricingMethod as TransferPricingMethod,
        transactionValue: Number(formData.transactionValue),
        notes: formData.notes,
      };

      const disclosure = await createDisclosure({
        taxYear: new Date().getFullYear(),
        transactions: [transaction],
      });

      // Upload files if they exist
      if (files.masterFile) {
        await uploadFile(disclosure.id, 'masterFile', files.masterFile);
      }
      if (files.localFile) {
        await uploadFile(disclosure.id, 'localFile', files.localFile);
      }
      if (files.cbcReport) {
        await uploadFile(disclosure.id, 'cbcReport', files.cbcReport);
      }

      // Reset form
      setFormData({
        relatedPartyName: '',
        jurisdiction: '',
        transactionType: '',
        pricingMethod: '',
        transactionValue: '',
        notes: '',
      });
      setFiles({});
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <TextField
              fullWidth
              required
              name="relatedPartyName"
              label={t('transferPricing.relatedPartyName')}
              value={formData.relatedPartyName}
              onChange={handleInputChange}
              disabled={loading}
            />
          </Box>

          <Box>
            <TextField
              fullWidth
              required
              name="jurisdiction"
              label={t('transferPricing.jurisdiction')}
              value={formData.jurisdiction}
              onChange={handleInputChange}
              disabled={loading}
            />
          </Box>

          <Box>
            <TextField
              fullWidth
              required
              select
              name="transactionType"
              label={t('transferPricing.transactionType')}
              value={formData.transactionType}
              onChange={handleInputChange}
              disabled={loading}
            >
              {Object.entries(TransactionType).map(([key, value]) => (
                <MenuItem key={key} value={value}>
                  {t(`transferPricing.transactionTypes.${key}`)}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box>
            <TextField
              fullWidth
              required
              select
              name="pricingMethod"
              label={t('transferPricing.pricingMethod')}
              value={formData.pricingMethod}
              onChange={handleInputChange}
              disabled={loading}
            >
              {Object.entries(TransferPricingMethod).map(([key, value]) => (
                <MenuItem key={key} value={value}>
                  {t(`transferPricing.pricingMethods.${key}`)}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box>
            <TextField
              fullWidth
              required
              type="number"
              name="transactionValue"
              label={t('transferPricing.transactionValue')}
              value={formData.transactionValue}
              onChange={handleInputChange}
              disabled={loading}
              InputProps={{
                startAdornment: <Typography variant="body2">AED</Typography>,
              }}
            />
          </Box>

          <Box sx={{ gridColumn: '1 / -1' }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              name="notes"
              label={t('transferPricing.notes')}
              value={formData.notes}
              onChange={handleInputChange}
              disabled={loading}
            />
          </Box>

          <Box sx={{ gridColumn: '1 / -1' }}>
            <FileUpload
              label={t('transferPricing.masterFile')}
              tooltip={t('transferPricing.masterFileTooltip')}
              onChange={handleFileUpload('masterFile')}
            />
            <FileUpload
              label={t('transferPricing.localFile')}
              tooltip={t('transferPricing.localFileTooltip')}
              onChange={handleFileUpload('localFile')}
            />
            <FileUpload
              label={t('transferPricing.cbcReport')}
              tooltip={t('transferPricing.cbcReportTooltip')}
              onChange={handleFileUpload('cbcReport')}
            />
          </Box>

          <Box sx={{ gridColumn: '1 / -1' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {t('transferPricing.submit')}
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};