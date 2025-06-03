import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useBalanceSheet } from '../context/BalanceSheetContext';
import { Account, AccountType, AccountCategory } from '../types/financials';
import { useTranslation } from 'react-i18next';
import { downloadBalanceSheetPDF } from '../utils/pdfExport';

interface AddAccountDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (account: Omit<Account, 'id'>) => void;
}

const AddAccountDialog: React.FC<AddAccountDialogProps> = ({ open, onClose, onAdd }) => {
  const { t } = useTranslation();
  const [account, setAccount] = useState<Omit<Account, 'id'>>({
    code: '',
    name: '',
    type: AccountType.ASSET,
    category: AccountCategory.CURRENT_ASSETS,
    balance: 0,
    isLocked: false
  });

  const handleSubmit = () => {
    onAdd(account);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('balanceSheet.addAccount')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            fullWidth
            label={t('balanceSheet.accountCode')}
            value={account.code}
            onChange={(e) => setAccount({ ...account, code: e.target.value })}
          />
          <TextField
            fullWidth
            label={t('balanceSheet.accountName')}
            value={account.name}
            onChange={(e) => setAccount({ ...account, name: e.target.value })}
          />
          <TextField
            fullWidth
            select
            label={t('balanceSheet.accountType')}
            value={account.type}
            onChange={(e) => setAccount({ ...account, type: e.target.value as AccountType })}
          >
            {Object.values(AccountType).map((type) => (
              <MenuItem key={type} value={type}>
                {t(`balanceSheet.accountTypes.${type}`)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            select
            label={t('balanceSheet.accountCategory')}
            value={account.category}
            onChange={(e) => setAccount({ ...account, category: e.target.value as AccountCategory })}
          >
            {Object.values(AccountCategory).map((category) => (
              <MenuItem key={category} value={category}>
                {t(`balanceSheet.accountCategories.${category}`)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            type="number"
            label={t('balanceSheet.initialBalance')}
            value={account.balance}
            onChange={(e) => setAccount({ ...account, balance: parseFloat(e.target.value) })}
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

export const BalanceSheetGenerator: React.FC = () => {
  const { t } = useTranslation();
  const {
    accounts,
    currentBalanceSheet,
    addAccount,
    generateBalanceSheet
  } = useBalanceSheet();

  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    generateBalanceSheet();
  }, [accounts, generateBalanceSheet]);

  const handleExportPDF = () => {
    if (currentBalanceSheet) {
      downloadBalanceSheetPDF(currentBalanceSheet, t, false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('balanceSheet.title')}
      </Typography>
      <Button onClick={() => setShowAddDialog(true)}>
        {t('balanceSheet.addAccount')}
      </Button>
      <Button onClick={handleExportPDF}>
        {t('balanceSheet.exportPDF')}
      </Button>
      <AddAccountDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAdd={addAccount}
      />
      {/* Render accounts here */}
    </Box>
  );
}; 