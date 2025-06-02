import React, { useState } from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import { Invoice, InvoiceLine, InvoiceStatus, InvoiceType, PartyInfo, Address } from '../../types/invoice';
import { v4 as uuidv4 } from 'uuid';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Grid } from '../common/Grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import type { Theme } from '@mui/material/styles';
import type { SystemProps } from '@mui/system';

type GridItemProps = {
  size?: number | {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
} & SystemProps<Theme>;

const GridItem = ({ children, ...props }: GridItemProps & { children: React.ReactNode }) => (
  <Grid {...props}>{children}</Grid>
);

interface InvoiceFormProps {
  initialInvoice?: Invoice;
  onSubmit: (invoice: Invoice) => void;
  onCancel: () => void;
}

const emptyInvoiceLine: InvoiceLine = {
  id: '',
  productCode: '',
  description: '',
  quantity: 0,
  unitPrice: 0,
  netAmount: 0,
  taxBreakdown: {
    taxableAmount: 0,
    taxRate: 5, // Default VAT rate in UAE
    taxAmount: 0,
    taxCategory: 'S'
  }
};

const defaultInvoice: Invoice = {
  id: uuidv4(),
  type: InvoiceType.STANDARD,
  status: InvoiceStatus.DRAFT,
  issueDate: new Date().toISOString(),
  invoiceNumber: '',
  uuid: uuidv4(),
  seller: {
    name: '',
    address: {
      street: '',
      city: '',
      emirate: '',
      country: 'UAE',
      postalCode: ''
    },
    trn: ''
  },
  buyer: {
    name: '',
    address: {
      street: '',
      city: '',
      emirate: '',
      country: 'UAE',
      postalCode: ''
    },
    trn: ''
  },
  lines: [],
  totalAmount: 0,
  totalTaxAmount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  initialInvoice,
  onSubmit,
  onCancel
}) => {
  const [invoice, setInvoice] = useState<Invoice>(initialInvoice || defaultInvoice);
  const [newLine, setNewLine] = useState<InvoiceLine>({
    ...emptyInvoiceLine,
    id: uuidv4()
  });
  const [addLineDialogOpen, setAddLineDialogOpen] = useState(false);

  const handleInputChange = (
    field: keyof Invoice | keyof PartyInfo | keyof Address,
    value: string,
    section?: 'seller' | 'buyer',
    subfield?: keyof PartyInfo
  ) => {
    setInvoice(prev => {
      if (section && subfield) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [subfield]: value
          }
        };
      } else if (section) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        };
      } else {
        return {
          ...prev,
          [field]: value
        };
      }
    });
  };

  const handleAddressChange = (
    field: keyof Address,
    value: string,
    party: 'seller' | 'buyer'
  ) => {
    setInvoice(prev => ({
      ...prev,
      [party]: {
        ...prev[party],
        address: {
          ...prev[party].address,
          [field]: value
        }
      }
    }));
  };

  const handleNewLineChange = (
    field: keyof InvoiceLine | 'taxRate',
    value: string | number
  ) => {
    setNewLine(prev => {
      const updated = { ...prev, [field]: value };
      
      // Recalculate amounts
      if (field === 'quantity' || field === 'unitPrice') {
        const quantity = field === 'quantity' ? +value : prev.quantity;
        const unitPrice = field === 'unitPrice' ? +value : prev.unitPrice;
        const netAmount = quantity * unitPrice;
        const taxAmount = netAmount * (prev.taxBreakdown.taxRate / 100);
        
        return {
          ...updated,
          netAmount,
          taxBreakdown: {
            ...prev.taxBreakdown,
            taxableAmount: netAmount,
            taxAmount
          }
        };
      }
      
      return updated;
    });
  };

  const handleAddLine = () => {
    setInvoice(prev => {
      const updatedLines = [...prev.lines, newLine];
      const totalAmount = updatedLines.reduce((sum, line) => 
        sum + line.netAmount + line.taxBreakdown.taxAmount, 0
      );
      const totalTaxAmount = updatedLines.reduce((sum, line) => 
        sum + line.taxBreakdown.taxAmount, 0
      );
      
      return {
        ...prev,
        lines: updatedLines,
        totalAmount,
        totalTaxAmount
      };
    });
    
    setNewLine({
      ...emptyInvoiceLine,
      id: uuidv4()
    });
    setAddLineDialogOpen(false);
  };

  const handleDeleteLine = (lineId: string) => {
    setInvoice(prev => {
      const updatedLines = prev.lines.filter(line => line.id !== lineId);
      const totalAmount = updatedLines.reduce((sum, line) => 
        sum + line.netAmount + line.taxBreakdown.taxAmount, 0
      );
      const totalTaxAmount = updatedLines.reduce((sum, line) => 
        sum + line.taxBreakdown.taxAmount, 0
      );
      
      return {
        ...prev,
        lines: updatedLines,
        totalAmount,
        totalTaxAmount
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...invoice,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {initialInvoice ? 'Edit Invoice' : 'Create Invoice'}
      </Typography>

      {/* Basic Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Invoice Number"
                value={invoice.invoiceNumber}
                onChange={e => handleInputChange('invoiceNumber', e.target.value)}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Issue Date"
                  value={new Date(invoice.issueDate)}
                  onChange={date => date && handleInputChange('issueDate', date.toISOString())}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Seller Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Seller Information
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Company Name"
                value={invoice.seller.name}
                onChange={e => handleInputChange('name', e.target.value, 'seller')}
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="TRN"
                value={invoice.seller.trn}
                onChange={e => handleInputChange('trn', e.target.value, 'seller')}
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Street Address"
                value={invoice.seller.address.street}
                onChange={e => handleAddressChange('street', e.target.value, 'seller')}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="City"
                value={invoice.seller.address.city}
                onChange={e => handleAddressChange('city', e.target.value, 'seller')}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Emirate"
                value={invoice.seller.address.emirate}
                onChange={e => handleAddressChange('emirate', e.target.value, 'seller')}
                required
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Buyer Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Buyer Information
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Company Name"
                value={invoice.buyer.name}
                onChange={e => handleInputChange('name', e.target.value, 'buyer')}
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="TRN"
                value={invoice.buyer.trn}
                onChange={e => handleInputChange('trn', e.target.value, 'buyer')}
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Street Address"
                value={invoice.buyer.address.street}
                onChange={e => handleAddressChange('street', e.target.value, 'buyer')}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="City"
                value={invoice.buyer.address.city}
                onChange={e => handleAddressChange('city', e.target.value, 'buyer')}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Emirate"
                value={invoice.buyer.address.emirate}
                onChange={e => handleAddressChange('emirate', e.target.value, 'buyer')}
                required
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Invoice Lines */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Invoice Lines
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddLineDialogOpen(true)}
            >
              Add Line
            </Button>
          </Box>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Code</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit Price</TableCell>
                  <TableCell>Net Amount</TableCell>
                  <TableCell>VAT</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoice.lines.map(line => (
                  <TableRow key={line.id}>
                    <TableCell>{line.productCode}</TableCell>
                    <TableCell>{line.description}</TableCell>
                    <TableCell>{line.quantity}</TableCell>
                    <TableCell>AED {line.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>AED {line.netAmount.toFixed(2)}</TableCell>
                    <TableCell>AED {line.taxBreakdown.taxAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      AED {(line.netAmount + line.taxBreakdown.taxAmount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteLine(line.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {invoice.lines.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No items added
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Totals */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="subtitle1">
                Net Amount: AED {(invoice.totalAmount - invoice.totalTaxAmount).toFixed(2)}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="subtitle1">
                VAT Amount: AED {invoice.totalTaxAmount.toFixed(2)}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="h6">
                Total Amount: AED {invoice.totalAmount.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Actions */}
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" type="submit">
          Save
        </Button>
      </Box>

      {/* Add Line Dialog */}
      <Dialog
        open={addLineDialogOpen}
        onClose={() => setAddLineDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Invoice Line</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Product Code"
                value={newLine.productCode}
                onChange={e => handleNewLineChange('productCode', e.target.value)}
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description"
                value={newLine.description}
                onChange={e => handleNewLineChange('description', e.target.value)}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={newLine.quantity}
                onChange={e => handleNewLineChange('quantity', e.target.value)}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Unit Price"
                value={newLine.unitPrice}
                onChange={e => handleNewLineChange('unitPrice', e.target.value)}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle1">
                Net Amount: AED {newLine.netAmount.toFixed(2)}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle1">
                VAT Amount: AED {newLine.taxBreakdown.taxAmount.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddLineDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddLine}
            color="primary"
            disabled={!newLine.productCode || !newLine.description || !newLine.quantity || !newLine.unitPrice}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 