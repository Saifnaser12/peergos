import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { Invoice } from '../../types/invoice';

interface InvoiceDetailProps {
  invoice: Invoice;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
}

export const InvoiceDetail: React.FC<InvoiceDetailProps> = ({
  invoice,
  onEdit,
  onDelete,
}) => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Invoice #{invoice.invoiceNumber}</Typography>
          <Box>
            <IconButton onClick={() => onEdit(invoice)} size="small">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDelete(invoice)} size="small">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">Seller</Typography>
            <Typography>{invoice.seller.name}</Typography>
            <Typography>{invoice.seller.taxRegistrationNumber}</Typography>
            <Typography>
              {invoice.seller.address.street}, {invoice.seller.address.city}
            </Typography>
            <Typography>
              {invoice.seller.address.emirate}, {invoice.seller.address.country}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">Buyer</Typography>
            <Typography>{invoice.buyer.name}</Typography>
            <Typography>{invoice.buyer.taxRegistrationNumber}</Typography>
            <Typography>
              {invoice.buyer.address.street}, {invoice.buyer.address.city}
            </Typography>
            <Typography>
              {invoice.buyer.address.emirate}, {invoice.buyer.address.country}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Items
            </Typography>
            {invoice.items.map((item) => (
              <Box key={item.id} mb={1}>
                <Typography>
                  {item.description} - {item.quantity} x {item.unitPrice.toLocaleString('en-AE', {
                    style: 'currency',
                    currency: 'AED'
                  })}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Tax Rate: {item.taxRate}% - Tax Amount: {item.taxAmount.toLocaleString('en-AE', {
                    style: 'currency',
                    currency: 'AED'
                  })}
                </Typography>
              </Box>
            ))}
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Typography variant="subtitle1">Total Amount</Typography>
              <Typography variant="subtitle1">
                {invoice.amount.toLocaleString('en-AE', {
                  style: 'currency',
                  currency: 'AED'
                })}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="subtitle1">VAT Amount</Typography>
              <Typography variant="subtitle1">
                {invoice.vatAmount.toLocaleString('en-AE', {
                  style: 'currency',
                  currency: 'AED'
                })}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}; 