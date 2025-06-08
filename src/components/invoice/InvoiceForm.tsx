import React, { useState } from 'react';
import { Invoice, InvoiceItem, InvoiceStatus, InvoiceType, Party, Address } from '../../types/invoice';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from '@mui/material';
// Using native HTML date inputs instead of MUI date pickers
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface InvoiceFormProps {
  initialInvoice?: Invoice;
  onSubmit: (invoice: Invoice) => void;
  onCancel: () => void;
}

const emptyInvoiceItem: InvoiceItem = {
  id: '',
  description: '',
  quantity: 0,
  unitPrice: 0,
  totalAmount: 0,
  taxAmount: 0,
  taxableAmount: 0,
  productCode: '',
  taxCategory: '',
  taxRate: 5, // Default VAT rate in UAE
  vatAmount: 0,
  vatRate: 5
};

const defaultInvoice: Invoice = {
  id: uuidv4(),
  type: InvoiceType.STANDARD,
  status: InvoiceStatus.DRAFT,
  issueDate: new Date().toISOString(),
  dueDate: new Date().toISOString(),
  invoiceNumber: '',
  currency: 'AED',
  amount: 0,
  vatAmount: 0,
  seller: {
    name: '',
    taxRegistrationNumber: '',
    address: {
      street: '',
      city: '',
      emirate: '',
      country: 'UAE',
      postalCode: ''
    }
  },
  buyer: {
    name: '',
    taxRegistrationNumber: '',
    address: {
      street: '',
      city: '',
      emirate: '',
      country: 'UAE',
      postalCode: ''
    }
  },
  items: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isFreeZoneCompany: false,
  customerLocation: 'UAE_MAINLAND'
};

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  initialInvoice,
  onSubmit,
  onCancel
}) => {
  const [invoice, setInvoice] = useState<Invoice>(initialInvoice || defaultInvoice);
  const [newItem, setNewItem] = useState<InvoiceItem>({
    ...emptyInvoiceItem,
    id: uuidv4()
  });
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [freeZoneVATNote, setFreeZoneVATNote] = useState<string | null>(null);

  const calculateFreeZoneVAT = (isFreeZoneCompany: boolean, customerLocation: string) => {
    let vatNote = null;

    if (isFreeZoneCompany) {
      if (customerLocation === 'OUTSIDE_UAE' || customerLocation === 'DESIGNATED_ZONE') {
        vatNote = "VAT not applicable – Export from UAE Free Zone (FTA-compliant)";
      } else if (customerLocation === 'SAME_FREE_ZONE') {
        vatNote = "Intra-free zone supply – VAT deferred per FTA ruling.";
      }
    }

    return { vatNote };
  };

  const handleInputChange = (
    field: keyof Invoice | keyof Party | keyof Address,
    value: string,
    section?: 'seller' | 'buyer',
    subfield?: keyof Party
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

  const handleNewItemChange = (
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setNewItem(prev => {
      const updated = { ...prev, [field]: value };

      // Recalculate amounts
      if (field === 'quantity' || field === 'unitPrice' || field === 'taxRate') {
        const quantity = field === 'quantity' ? +value : prev.quantity;
        const unitPrice = field === 'unitPrice' ? +value : prev.unitPrice;
        const taxRate = field === 'taxRate' ? +value : prev.taxRate;
        const taxableAmount = quantity * unitPrice;
        const taxAmount = taxableAmount * (taxRate / 100);
        const totalAmount = taxableAmount + taxAmount;

        return {
          ...updated,
          taxableAmount,
          taxAmount,
          totalAmount,
          vatAmount: taxAmount,
          vatRate: taxRate
        };
      }

      return updated;
    });
  };

  const handleAddItem = () => {
    setInvoice(prev => {
      const updatedItems = [...prev.items, newItem];
      const amount = updatedItems.reduce((sum, item) => sum + item.totalAmount, 0);
      const vatAmount = updatedItems.reduce((sum, item) => sum + item.taxAmount, 0);

      return {
        ...prev,
        items: updatedItems,
        amount,
        vatAmount,
        updatedAt: new Date().toISOString()
      };
    });

    setNewItem({
      ...emptyInvoiceItem,
      id: uuidv4()
    });
    setAddItemDialogOpen(false);
  };

  const handleDeleteItem = (itemId: string) => {
    setInvoice(prev => {
      const updatedItems = prev.items.filter(item => item.id !== itemId);
      const amount = updatedItems.reduce((sum, item) => sum + item.totalAmount, 0);
      const vatAmount = updatedItems.reduce((sum, item) => sum + item.taxAmount, 0);

      return {
        ...prev,
        items: updatedItems,
        amount,
        vatAmount,
        updatedAt: new Date().toISOString()
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(invoice);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* Basic Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Invoice Number"
                value={invoice.invoiceNumber}
                onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Issue Date"
                value={invoice.issueDate.split('T')[0]}
                onChange={(e) => handleInputChange('issueDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Free Zone Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Free Zone Configuration
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Is this a Free Zone company?"
                value={invoice.isFreeZoneCompany ? 'true' : 'false'}
                onChange={(e) => {
                  const isFreeZone = e.target.value === 'true';
                  setInvoice(prev => ({ ...prev, isFreeZoneCompany: isFreeZone }));

                  // Recalculate VAT note
                  const freeZoneVAT = calculateFreeZoneVAT(isFreeZone, invoice.customerLocation || 'UAE_MAINLAND');
                  setFreeZoneVATNote(freeZoneVAT.vatNote);
                }}
                SelectProps={{ native: true }}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Customer Location"
                value={invoice.customerLocation || 'UAE_MAINLAND'}
                onChange={(e) => {
                  const location = e.target.value;
                  setInvoice(prev => ({ ...prev, customerLocation: location }));

                  // Recalculate VAT note
                  const freeZoneVAT = calculateFreeZoneVAT(invoice.isFreeZoneCompany || false, location);
                  setFreeZoneVATNote(freeZoneVAT.vatNote);
                }}
                SelectProps={{ native: true }}
              >
                <option value="UAE_MAINLAND">UAE Mainland</option>
                <option value="DESIGNATED_ZONE">Designated Zone</option>
                <option value="OUTSIDE_UAE">Outside UAE</option>
                <option value="SAME_FREE_ZONE">Same Free Zone</option>
              </TextField>
            </Grid>
            {freeZoneVATNote && (
              <Grid item xs={12}>
                <Box sx={{ 
                  backgroundColor: 'info.light', 
                  color: 'info.contrastText', 
                  p: 2, 
                  borderRadius: 1,
                  fontStyle: 'italic'
                }}>
                  <Typography variant="body2">
                    <strong>VAT Treatment:</strong> {freeZoneVATNote}
                  </Typography>
                </Box>
              </Grid>
            )}
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={invoice.seller.name}
                onChange={(e) => handleInputChange('name', e.target.value, 'seller')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="TRN"
                value={invoice.seller.taxRegistrationNumber}
                onChange={(e) => handleInputChange('taxRegistrationNumber', e.target.value, 'seller')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street"
                value={invoice.seller.address.street}
                onChange={(e) => handleAddressChange('street', e.target.value, 'seller')}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                value={invoice.seller.address.city}
                onChange={(e) => handleAddressChange('city', e.target.value, 'seller')}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Emirate"
                value={invoice.seller.address.emirate}
                onChange={(e) => handleAddressChange('emirate', e.target.value, 'seller')}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Postal Code"
                value={invoice.seller.address.postalCode}
                onChange={(e) => handleAddressChange('postalCode', e.target.value, 'seller')}
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={invoice.buyer.name}
                onChange={(e) => handleInputChange('name', e.target.value, 'buyer')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="TRN"
                value={invoice.buyer.taxRegistrationNumber}
                onChange={(e) => handleInputChange('taxRegistrationNumber', e.target.value, 'buyer')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street"
                value={invoice.buyer.address.street}
                onChange={(e) => handleAddressChange('street', e.target.value, 'buyer')}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                value={invoice.buyer.address.city}
                onChange={(e) => handleAddressChange('city', e.target.value, 'buyer')}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Emirate"
                value={invoice.buyer.address.emirate}
                onChange={(e) => handleAddressChange('emirate', e.target.value, 'buyer')}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Postal Code"
                value={invoice.buyer.address.postalCode}
                onChange={(e) => handleAddressChange('postalCode', e.target.value, 'buyer')}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Invoice Items */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Invoice Items
            </Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={() => setAddItemDialogOpen(true)}
            >
              Add Item
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Tax Rate</TableCell>
                  <TableCell align="right">Tax Amount</TableCell>
                  <TableCell align="right">Total Amount</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoice.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">
                      {item.unitPrice.toLocaleString('en-AE', {
                        style: 'currency',
                        currency: 'AED'
                      })}
                    </TableCell>
                    <TableCell align="right">{item.taxRate}%</TableCell>
                    <TableCell align="right">
                      {item.taxAmount.toLocaleString('en-AE', {
                        style: 'currency',
                        currency: 'AED'
                      })}
                    </TableCell>
                    <TableCell align="right">
                      {item.totalAmount.toLocaleString('en-AE', {
                        style: 'currency',
                        currency: 'AED'
                      })}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleDeleteItem(item.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box mt={2}>
            <Grid container spacing={2} sx={{ justifyContent: 'flex-end' }}>
              <Grid item xs={12} md={4}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography>Total Amount</Typography>
                  <Typography>
                    {invoice.amount.toLocaleString('en-AE', {
                      style: 'currency',
                      currency: 'AED'
                    })}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography>VAT Amount</Typography>
                  <Typography>
                    {invoice.vatAmount.toLocaleString('en-AE', {
                      style: 'currency',
                      currency: 'AED'
                    })}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Add Item Dialog */}
      <Dialog
        open={addItemDialogOpen}
        onClose={() => setAddItemDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Invoice Item</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={newItem.description}
                  onChange={(e) => handleNewItemChange('description', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Quantity"
                  value={newItem.quantity}
                  onChange={(e) => handleNewItemChange('quantity', +e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Unit Price"
                  value={newItem.unitPrice}
                  onChange={(e) => handleNewItemChange('unitPrice', +e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Tax Rate (%)"
                  value={newItem.taxRate}
                  onChange={(e) => handleNewItemChange('taxRate', +e.target.value)}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddItemDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddItem} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Form Actions */}
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained">Save</Button>
      </Box>
    </Box>
  );
};