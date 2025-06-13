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
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { Delete as DeleteIcon, CloudUpload as UploadIcon, CheckCircle as CheckIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { TransactionType, TransferPricingMethod, RelatedPartyTransaction, TransferPricingDisclosure } from '../../types/transferPricing';
import { useTransferPricing } from '../../hooks/useTransferPricing';

const UAE_JURISDICTIONS = [
  'United Arab Emirates',
  'Saudi Arabia',
  'Qatar',
  'Kuwait',
  'Bahrain',
  'Oman',
  'United States',
  'United Kingdom',
  'Germany',
  'France',
  'Netherlands',
  'Singapore',
  'Hong Kong',
  'India',
  'China',
  'Other'
];

const PRICING_METHODS = [
  { value: 'COMPARABLE_UNCONTROLLED_PRICE', label: 'Comparable Uncontrolled Price (CUP)' },
  { value: 'RESALE_PRICE', label: 'Resale Price Method' },
  { value: 'COST_PLUS', label: 'Cost Plus Method' },
  { value: 'TRANSACTIONAL_NET_MARGIN', label: 'Transactional Net Margin Method (TNMM)' },
  { value: 'PROFIT_SPLIT', label: 'Profit Split Method' },
  { value: 'OTHER', label: 'Other Method' }
];

interface FileUploadProps {
  label: string;
  tooltip: string;
  onChange: (file: File | undefined) => void;
  accept?: string;
  required?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, tooltip, onChange, accept = '.pdf', required = false }) => {
  const { t } = useTranslation();
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError('');
    
    if (file) {
      // Check file type (PDF only)
      if (!file.type.includes('pdf')) {
        setError('Only PDF files are allowed');
        return;
      }
      
      // Check file size (max 20MB)
      const maxSize = 20 * 1024 * 1024; // 20MB in bytes
      if (file.size > maxSize) {
        setError('File size must be less than 20MB');
        return;
      }
      
      setFileName(file.name);
      setFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');
      onChange(file);
    }
  };

  const handleRemove = () => {
    setFileName('');
    setFileSize('');
    onChange(undefined);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: required ? 'bold' : 'normal' }}>
          {label} {required && <span style={{ color: 'red' }}>*</span>}
        </Typography>
        <Tooltip title={tooltip}>
          <IconButton size="small">
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      {!fileName ? (
        <Button 
          variant="outlined" 
          component="label"
          startIcon={<UploadIcon />}
          sx={{ mb: 1 }}
        >
          Upload PDF (Max 20MB)
          <input type="file" hidden accept={accept} onChange={handleFileChange} />
        </Button>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 2, 
          border: '1px solid #e0e0e0', 
          borderRadius: 1,
          backgroundColor: '#f5f5f5',
          mb: 1
        }}>
          <CheckIcon color="success" sx={{ mr: 1 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {fileName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {fileSize}
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleRemove} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
      
      <Typography variant="caption" color="text.secondary">
        PDF format only, maximum 20MB
      </Typography>
    </Box>
  );
};

const ProgressTracker: React.FC<{ 
  relatedPartiesCount: number;
  filesUploaded: { masterFile: boolean; localFile: boolean; cbcReport: boolean };
}> = ({ relatedPartiesCount, filesUploaded }) => {
  const totalFiles = Object.values(filesUploaded).filter(Boolean).length;
  const progress = relatedPartiesCount > 0 ? 
    ((relatedPartiesCount > 0 ? 50 : 0) + (totalFiles * 16.67)) : 0; // 50% for having parties, ~17% per file
  
  return (
    <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
      <Typography variant="h6" gutterBottom>
        🧾 Transfer Pricing Readiness
      </Typography>
      <Box sx={{ width: '100%', mb: 2 }}>
        <LinearProgress 
          variant="determinate" 
          value={Math.min(progress, 100)} 
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2">
          {totalFiles === 3 ? '✅' : '📋'} {totalFiles} of 3 documents uploaded • {Math.round(progress)}% Complete
        </Typography>
        <Chip 
          label={progress === 100 ? 'Complete' : 'In Progress'} 
          color={progress === 100 ? 'success' : 'warning'}
          size="small"
        />
      </Box>
    </Paper>
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

  const [relatedParties, setRelatedParties] = useState<any[]>([]);
  
  const filesUploaded = {
    masterFile: !!files.masterFile,
    localFile: !!files.localFile,
    cbcReport: !!files.cbcReport
  };

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
    <Box>
      <ProgressTracker 
        relatedPartiesCount={relatedParties.length}
        filesUploaded={filesUploaded}
      />
      
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
              select
              name="jurisdiction"
              label="Jurisdiction"
              value={formData.jurisdiction}
              onChange={handleInputChange}
              disabled={loading}
            >
              {UAE_JURISDICTIONS.map((jurisdiction) => (
                <MenuItem key={jurisdiction} value={jurisdiction}>
                  {jurisdiction}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box>
            <TextField
              fullWidth
              required
              select
              name="transactionType"
              label="Transaction Type"
              value={formData.transactionType}
              onChange={handleInputChange}
              disabled={loading}
            >
              <MenuItem value="SALE_OF_GOODS">Sale of Goods</MenuItem>
              <MenuItem value="PROVISION_OF_SERVICES">Provision of Services</MenuItem>
              <MenuItem value="FINANCING_LOANS">Financing/Loans</MenuItem>
              <MenuItem value="IP_LICENSING">IP Licensing</MenuItem>
              <MenuItem value="COST_SHARING">Cost Sharing</MenuItem>
              <MenuItem value="MANAGEMENT_FEES">Management Fees</MenuItem>
              <MenuItem value="ROYALTIES">Royalties</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </TextField>
          </Box>

          <Box>
            <TextField
              fullWidth
              required
              select
              name="pricingMethod"
              label="Transfer Pricing Method"
              value={formData.pricingMethod}
              onChange={handleInputChange}
              disabled={loading}
            >
              {PRICING_METHODS.map((method) => (
                <MenuItem key={method.value} value={method.value}>
                  {method.label}
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
            <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
              📎 Supporting Documents
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Upload required transfer pricing documentation as per UAE FTA guidelines
            </Typography>
            
            <FileUpload
              label="📄 Master File"
              tooltip="Group structure documentation for multinational enterprises"
              onChange={handleFileUpload('masterFile')}
              required={true}
            />
            <FileUpload
              label="📄 Local File"
              tooltip="UAE-specific transfer pricing information and local entity details"
              onChange={handleFileUpload('localFile')}
              required={true}
            />
            <FileUpload
              label="📄 CbC Report"
              tooltip="Country-by-Country Reporting (required for groups with consolidated revenue > AED 3.15B)"
              onChange={handleFileUpload('cbcReport')}
              required={false}
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
      
      {/* Contextual Tips Sidebar */}
      <Paper sx={{ p: 3, mt: 3, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom>
          💬 UAE Transfer Pricing Guidelines
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              ℹ️ Master File:
            </Typography>
            <Typography variant="body2">
              Required for UAE entities that are part of multinational groups. Must include organizational structure, business description, and financial activities.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              ℹ️ Local File:
            </Typography>
            <Typography variant="body2">
              UAE-specific documentation covering local entity information, controlled transactions, and financial data.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              ℹ️ CbC Report:
            </Typography>
            <Typography variant="body2">
              Required for ultimate parent entities of multinational groups with consolidated group revenue exceeding AED 3.15 billion.
            </Typography>
          </Box>
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>FTA Reminder:</strong> All transfer pricing documentation must demonstrate arm's length pricing for related party transactions and comply with OECD guidelines.
            </Typography>
          </Alert>
        </Box>
      </Paper>
    </Box>
  );
};