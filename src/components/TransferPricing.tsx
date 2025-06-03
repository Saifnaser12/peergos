import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Chip,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useTransferPricing } from '../context/TransferPricingContext';
import {
  TransactionType,
  TransferPricingMethod,
  RelatedParty,
  TransferPricingTransaction,
  TransferPricingDocument,
  DocumentType
} from '../types/transferPricing';
import { useTranslation } from 'react-i18next';

interface AddRelatedPartyDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (party: Omit<RelatedParty, 'id'>) => void;
}

const AddRelatedPartyDialog: React.FC<AddRelatedPartyDialogProps> = ({ open, onClose, onAdd }) => {
  const { t } = useTranslation();
  const [party, setParty] = useState<Omit<RelatedParty, 'id'>>({
    name: '',
    jurisdiction: '',
    taxId: '',
    relationshipType: '',
    isActive: true
  });

  const handleSubmit = () => {
    onAdd(party);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('transferPricing.addRelatedParty')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            fullWidth
            label={t('transferPricing.partyName')}
            value={party.name}
            onChange={(e) => setParty({ ...party, name: e.target.value })}
          />
          <TextField
            fullWidth
            label={t('transferPricing.jurisdiction')}
            value={party.jurisdiction}
            onChange={(e) => setParty({ ...party, jurisdiction: e.target.value })}
          />
          <TextField
            fullWidth
            label={t('transferPricing.taxId')}
            value={party.taxId}
            onChange={(e) => setParty({ ...party, taxId: e.target.value })}
          />
          <TextField
            fullWidth
            label={t('transferPricing.relationshipType')}
            value={party.relationshipType}
            onChange={(e) => setParty({ ...party, relationshipType: e.target.value })}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button onClick={handleSubmit} variant="contained">
          {t('common.add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface AddTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (transaction: Omit<TransferPricingTransaction, 'id' | 'lastModified'>) => void;
  relatedParties: RelatedParty[];
}

const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({
  open,
  onClose,
  onAdd,
  relatedParties
}) => {
  const { t } = useTranslation();
  const { validateTransaction } = useTransferPricing();
  const [transaction, setTransaction] = useState<Omit<TransferPricingTransaction, 'id' | 'lastModified'>>({
    relatedPartyId: '',
    transactionType: TransactionType.SALE_OF_GOODS,
    transferPricingMethod: TransferPricingMethod.CUP,
    transactionValue: 0,
    currency: 'AED',
    fiscalYear: new Date().getFullYear().toString(),
    description: '',
    documents: [] as TransferPricingDocument[],
    status: 'DRAFT',
    isCompliant: false
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = () => {
    const validationErrors = validateTransaction(transaction);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    onAdd(transaction);
    onClose();
  };

  const handleFileUpload = (type: DocumentType) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const newDocument: TransferPricingDocument = {
        id: '', // Will be set by the context
        type,
        name: file.name,
        url: '', // Will be set after upload
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
        status: 'PENDING'
      };
      setTransaction({
        ...transaction,
        documents: [...transaction.documents, newDocument]
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('transferPricing.addTransaction')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            fullWidth
            select
            label={t('transferPricing.relatedParty')}
            value={transaction.relatedPartyId}
            onChange={(e) => setTransaction({ ...transaction, relatedPartyId: e.target.value })}
          >
            {relatedParties.map((party) => (
              <MenuItem key={party.id} value={party.id}>
                {party.name} ({party.jurisdiction})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            select
            label={t('transferPricing.transactionType')}
            value={transaction.transactionType}
            onChange={(e) => setTransaction({ ...transaction, transactionType: e.target.value as TransactionType })}
          >
            {Object.values(TransactionType).map((type) => (
              <MenuItem key={type} value={type}>
                {t(`transferPricing.transactionTypes.${type}`)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            select
            label={t('transferPricing.pricingMethod')}
            value={transaction.transferPricingMethod}
            onChange={(e) => setTransaction({ ...transaction, transferPricingMethod: e.target.value as TransferPricingMethod })}
          >
            {Object.values(TransferPricingMethod).map((method) => (
              <MenuItem key={method} value={method}>
                {t(`transferPricing.pricingMethods.${method}`)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            type="number"
            label={t('transferPricing.transactionValue')}
            value={transaction.transactionValue}
            onChange={(e) =>
              setTransaction({ ...transaction, transactionValue: parseFloat(e.target.value) })
            }
            InputProps={{
              startAdornment: <InputAdornment position="start">AED</InputAdornment>
            }}
          />

          <TextField
            fullWidth
            label={t('transferPricing.fiscalYear')}
            value={transaction.fiscalYear}
            onChange={(e) => setTransaction({ ...transaction, fiscalYear: e.target.value })}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label={t('transferPricing.description')}
            value={transaction.description}
            onChange={(e) => setTransaction({ ...transaction, description: e.target.value })}
          />

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              {t('transferPricing.documents')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                component="label"
              >
                {t('transferPricing.uploadMasterFile')}
                <input
                  type="file"
                  hidden
                  onChange={handleFileUpload('MASTER_FILE')}
                  accept=".pdf,.doc,.docx"
                />
              </Button>
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                component="label"
              >
                {t('transferPricing.uploadLocalFile')}
                <input
                  type="file"
                  hidden
                  onChange={handleFileUpload('LOCAL_FILE')}
                  accept=".pdf,.doc,.docx"
                />
              </Button>
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                component="label"
              >
                {t('transferPricing.uploadCbcReport')}
                <input
                  type="file"
                  hidden
                  onChange={handleFileUpload('CBC_REPORT')}
                  accept=".pdf,.doc,.docx"
                />
              </Button>
            </Box>
            <List>
              {transaction.documents.map((doc) => (
                <ListItem key={doc.fileName}>
                  <ListItemText
                    primary={doc.fileName}
                    secondary={`${doc.type} - ${(doc.fileSize / 1024 / 1024).toFixed(2)} MB`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => {
                        setTransaction({
                          ...transaction,
                          documents: transaction.documents.filter(d => d.fileName !== doc.fileName)
                        });
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>

          {errors.length > 0 && (
            <Alert severity="error">
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button onClick={handleSubmit} variant="contained">
          {t('common.add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const TransferPricing: React.FC = () => {
  const { t } = useTranslation();
  const {
    relatedParties,
    transactions,
    loading,
    error,
    addRelatedParty,
    deleteRelatedParty,
    addTransaction,
    deleteTransaction
  } = useTransferPricing();

  const [showAddPartyDialog, setShowAddPartyDialog] = useState(false);
  const [showAddTransactionDialog, setShowAddTransactionDialog] = useState(false);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">{t('transferPricing.title')}</Typography>
        <Box>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setShowAddPartyDialog(true)}
            sx={{ mr: 1 }}
          >
            {t('transferPricing.addRelatedParty')}
          </Button>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setShowAddTransactionDialog(true)}
            variant="contained"
          >
            {t('transferPricing.addTransaction')}
          </Button>
        </Box>
      </Box>

      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          {t('transferPricing.relatedParties')}
        </Typography>
        <List>
          {relatedParties.map((party) => (
            <React.Fragment key={party.id}>
              <ListItem>
                <ListItemText
                  primary={party.name}
                  secondary={`${party.jurisdiction} ${party.taxId ? `- ${party.taxId}` : ''}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => deleteRelatedParty(party.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          {t('transferPricing.transactions')}
        </Typography>
        <List>
          {transactions.map((transaction) => (
            <React.Fragment key={transaction.id}>
              <ListItem>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography>
                        {relatedParties.find(p => p.id === transaction.relatedPartyId)?.name}
                      </Typography>
                      <Chip
                        size="small"
                        label={t(`transferPricing.transactionTypes.${transaction.transactionType}`)}
                      />
                      <Chip
                        size="small"
                        label={transaction.transactionValue.toLocaleString('en-AE', {
                          style: 'currency',
                          currency: 'AED'
                        })}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        {t(`transferPricing.pricingMethods.${transaction.transferPricingMethod}`)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {transaction.description}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => deleteTransaction(transaction.id)}
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Box>

      <AddRelatedPartyDialog
        open={showAddPartyDialog}
        onClose={() => setShowAddPartyDialog(false)}
        onAdd={addRelatedParty}
      />

      <AddTransactionDialog
        open={showAddTransactionDialog}
        onClose={() => setShowAddTransactionDialog(false)}
        onAdd={addTransaction}
        relatedParties={relatedParties}
      />
    </Paper>
  );
}; 