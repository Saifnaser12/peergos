import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid as MuiGrid,
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
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PictureAsPdf as PdfIcon,
  BarChart as ChartIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useBalanceSheet } from '../context/BalanceSheetContext';
import { Account, AccountType, AccountCategory } from '../types/financials';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { downloadBalanceSheetPDF } from '../utils/pdfExport';

interface AccountRowProps {
  account: Account;
  onEdit: (account: Account) => void;
}

const AccountRow: React.FC<AccountRowProps> = ({ account, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBalance, setEditedBalance] = useState(account.balance.toString());

  const handleSave = () => {
    onEdit({
      ...account,
      balance: parseFloat(editedBalance)
    });
    setIsEditing(false);
  };

  return (
    <Box display="flex" alignItems="center" my={1}>
      <Typography flex={1}>{account.name}</Typography>
      {isEditing ? (
        <>
          <TextField
            size="small"
            value={editedBalance}
            onChange={(e) => setEditedBalance(e.target.value)}
            type="number"
            sx={{ width: 150, mx: 2 }}
          />
          <IconButton onClick={handleSave} color="primary">
            <SaveIcon />
          </IconButton>
          <IconButton onClick={() => setIsEditing(false)} color="error">
            <CancelIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography sx={{ width: 150, textAlign: 'right', mx: 2 }}>
            {account.balance.toLocaleString('en-AE', {
              style: 'currency',
              currency: 'AED'
            })}
          </Typography>
          {!account.isLocked && (
            <IconButton onClick={() => setIsEditing(true)}>
              <EditIcon />
            </IconButton>
          )}
        </>
      )}
    </Box>
  );
};

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
  const { t, i18n } = useTranslation();
  const {
    accounts,
    currentBalanceSheet,
    loading,
    error,
    addAccount,
    updateAccount,
    generateBalanceSheet
  } = useBalanceSheet();

  const [showChart, setShowChart] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    generateBalanceSheet();
  }, [accounts, generateBalanceSheet]);

  const handleExportPDF = () => {
    if (currentBalanceSheet) {
      downloadBalanceSheetPDF(currentBalanceSheet, t, i18n.language === 'ar');
    }
  };

  const chartData = {
    labels: ['Assets', 'Liabilities', 'Equity'],
    datasets: [
      {
        label: t('balanceSheet.breakdown'),
        data: [
          currentBalanceSheet?.assets.totalAssets || 0,
          currentBalanceSheet?.liabilities.totalLiabilities || 0,
          currentBalanceSheet?.equity.totalEquity || 0
        ],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1
      }
    ]
  };

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

  if (!currentBalanceSheet) {
    return <Alert severity="info">{t('balanceSheet.noData')}</Alert>;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">{t('balanceSheet.title')}</Typography>
        <Box>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setShowAddDialog(true)}
            sx={{ mr: 1 }}
          >
            {t('balanceSheet.addAccount')}
          </Button>
          <Button
            startIcon={<ChartIcon />}
            onClick={() => setShowChart(!showChart)}
            sx={{ mr: 1 }}
          >
            {showChart ? t('balanceSheet.hideChart') : t('balanceSheet.showChart')}
          </Button>
          <Button
            startIcon={<PdfIcon />}
            onClick={handleExportPDF}
          >
            {t('common.export')}
          </Button>
        </Box>
      </Box>

      {showChart && (
        <Box mb={4} height={300}>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </Box>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {/* Assets */}
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <Typography variant="h6" gutterBottom>
            {t('balanceSheet.assets')}
          </Typography>
          <Box>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              {t('balanceSheet.currentAssets')}
            </Typography>
            {currentBalanceSheet.assets.currentAssets.map((account) => (
              <AccountRow key={account.id} account={account} onEdit={updateAccount} />
            ))}
          </Box>
          <Box mt={2}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              {t('balanceSheet.fixedAssets')}
            </Typography>
            {currentBalanceSheet.assets.fixedAssets.map((account) => (
              <AccountRow key={account.id} account={account} onEdit={updateAccount} />
            ))}
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="subtitle1" fontWeight="bold">
              {t('balanceSheet.totalAssets')}
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              {currentBalanceSheet.assets.totalAssets.toLocaleString('en-AE', {
                style: 'currency',
                currency: 'AED'
              })}
            </Typography>
          </Box>
        </Box>

        {/* Liabilities */}
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <Typography variant="h6" gutterBottom>
            {t('balanceSheet.liabilities')}
          </Typography>
          <Box>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              {t('balanceSheet.currentLiabilities')}
            </Typography>
            {currentBalanceSheet.liabilities.currentLiabilities.map((account) => (
              <AccountRow key={account.id} account={account} onEdit={updateAccount} />
            ))}
          </Box>
          <Box mt={2}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              {t('balanceSheet.longTermLiabilities')}
            </Typography>
            {currentBalanceSheet.liabilities.longTermLiabilities.map((account) => (
              <AccountRow key={account.id} account={account} onEdit={updateAccount} />
            ))}
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="subtitle1" fontWeight="bold">
              {t('balanceSheet.totalLiabilities')}
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              {currentBalanceSheet.liabilities.totalLiabilities.toLocaleString('en-AE', {
                style: 'currency',
                currency: 'AED'
              })}
            </Typography>
          </Box>
        </Box>

        {/* Equity */}
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <Typography variant="h6" gutterBottom>
            {t('balanceSheet.equity')}
          </Typography>
          <Box>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              {t('balanceSheet.shareCapital')}
            </Typography>
            {currentBalanceSheet.equity.shareCapital.map((account) => (
              <AccountRow key={account.id} account={account} onEdit={updateAccount} />
            ))}
          </Box>
          <Box mt={2}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              {t('balanceSheet.retainedEarnings')}
            </Typography>
            {currentBalanceSheet.equity.retainedEarnings.map((account) => (
              <AccountRow key={account.id} account={account} onEdit={updateAccount} />
            ))}
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="subtitle1" fontWeight="bold">
              {t('balanceSheet.totalEquity')}
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              {currentBalanceSheet.equity.totalEquity.toLocaleString('en-AE', {
                style: 'currency',
                currency: 'AED'
              })}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box mt={4}>
        <Alert
          severity={
            Math.abs(
              currentBalanceSheet.assets.totalAssets -
              currentBalanceSheet.totalLiabilitiesAndEquity
            ) < 0.01
              ? 'success'
              : 'error'
          }
        >
          {Math.abs(
            currentBalanceSheet.assets.totalAssets -
            currentBalanceSheet.totalLiabilitiesAndEquity
          ) < 0.01
            ? t('balanceSheet.balanced')
            : t('balanceSheet.notBalanced')}
        </Alert>
      </Box>

      <AddAccountDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAdd={addAccount}
      />
    </Paper>
  );
}; 