import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { IntercompanyTransaction, RelatedParty } from '../../types/transferPricing';

interface TransactionTableProps {
  transactions: IntercompanyTransaction[];
  relatedParties: RelatedParty[];
  onUpdate: (transactions: IntercompanyTransaction[]) => void;
}

const transactionTypes = [
  'GOODS_SALE',
  'GOODS_PURCHASE', 
  'SERVICE_PROVISION',
  'SERVICE_RECEIPT',
  'ROYALTY_PAYMENT',
  'ROYALTY_RECEIPT',
  'INTEREST_PAYMENT',
  'INTEREST_RECEIPT',
  'MANAGEMENT_FEE',
  'OTHER'
];

export const TransactionTable: React.FC<TransactionTableProps> = ({ 
  transactions, 
  relatedParties, 
  onUpdate 
}) => {
  const [open, setOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<IntercompanyTransaction | null>(null);
  const [formData, setFormData] = useState<Partial<IntercompanyTransaction>>({});

  const handleAdd = () => {
    setEditingTransaction(null);
    setFormData({
      type: 'GOODS_SALE',
      description: '',
      amount: 0,
      currency: 'AED',
      date: new Date().toISOString().split('T')[0],
      relatedPartyId: '',
      armLengthPricing: false,
      documentationAvailable: false
    });
    setOpen(true);
  };

  const handleEdit = (transaction: IntercompanyTransaction) => {
    setEditingTransaction(transaction);
    setFormData(transaction);
    setOpen(true);
  };

  const handleSave = () => {
    if (!formData.relatedPartyId || !formData.amount) return;

    const newTransaction: IntercompanyTransaction = {
      id: editingTransaction?.id || Date.now().toString(),
      type: formData.type!,
      description: formData.description || '',
      amount: Number(formData.amount),
      currency: formData.currency || 'AED',
      date: formData.date!,
      relatedPartyId: formData.relatedPartyId!,
      armLengthPricing: formData.armLengthPricing || false,
      documentationAvailable: formData.documentationAvailable || false
    };

    if (editingTransaction) {
      const updatedTransactions = transactions.map(t => 
        t.id === editingTransaction.id ? newTransaction : t
      );
      onUpdate(updatedTransactions);
    } else {
      onUpdate([...transactions, newTransaction]);
    }

    setOpen(false);
  };

  const handleDelete = (id: string) => {
    const filteredTransactions = transactions.filter(t => t.id !== id);
    onUpdate(filteredTransactions);
  };

  const getRelatedPartyName = (id: string) => {
    const party = relatedParties.find(p => p.id === id);
    return party?.name || 'Unknown';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Intercompany Transactions</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{ borderRadius: 2 }}
        >
          Add Transaction
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Related Party</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Arm's Length</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No transactions added yet
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Chip 
                      label={transaction.type.replace('_', ' ')} 
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{getRelatedPartyName(transaction.relatedPartyId)}</TableCell>
                  <TableCell align="right">
                    {transaction.amount.toLocaleString()} {transaction.currency}
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>
                    <Chip 
                      label={transaction.armLengthPricing ? 'Yes' : 'No'}
                      color={transaction.armLengthPricing ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEdit(transaction)} size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDelete(transaction.id)} 
                      size="small"
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              select
              label="Transaction Type"
              value={formData.type || ''}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              fullWidth
            >
              {transactionTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.replace('_', ' ')}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />

            <TextField
              select
              label="Related Party"
              value={formData.relatedPartyId || ''}
              onChange={(e) => setFormData({ ...formData, relatedPartyId: e.target.value })}
              fullWidth
            >
              {relatedParties.map((party) => (
                <MenuItem key={party.id} value={party.id}>
                  {party.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Amount"
              type="number"
              value={formData.amount || ''}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              fullWidth
            />

            <TextField
              label="Date"
              type="date"
              value={formData.date || ''}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingTransaction ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransactionTable;