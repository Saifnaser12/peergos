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

const InvoiceDetail: React.FC<InvoiceDetailProps> = ({
  invoice,
  onEdit,
  onDelete,
}) => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          Invoice Details
        </Typography>
        <Box>
          <IconButton
            size="small"
            onClick={() => onEdit(invoice)}
            sx={{ mr: 1 }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(invoice)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Invoice Information
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography>
                  <strong>Invoice Number:</strong> {invoice.invoiceNumber}
                </Typography>
                <Typography>
                  <strong>Issue Date:</strong> {invoice.issueDate}
                </Typography>
                <Typography>
                  <strong>Due Date:</strong> {invoice.dueDate}
                </Typography>
                <Typography>
                  <strong>Currency:</strong> {invoice.currency}
                </Typography>
                <Typography>
                  <strong>Total Amount:</strong> AED {invoice.amount.toLocaleString()}
                </Typography>
                <Typography>
                  <strong>VAT Amount:</strong> AED {invoice.vatAmount.toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Seller Information
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography>
                  <strong>Name:</strong> {invoice.seller.name}
                </Typography>
                <Typography>
                  <strong>Tax Registration Number:</strong> {invoice.seller.taxRegistrationNumber}
                </Typography>
                <Typography>
                  <strong>Address:</strong> {invoice.seller.address.street}, {invoice.seller.address.city}, {invoice.seller.address.emirate}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Items
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                {invoice.items.map((item) => (
                  <Box
                    key={item.id}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p={2}
                    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
                  >
                    <Box>
                      <Typography variant="subtitle1">{item.description}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Quantity: {item.quantity} × AED {item.unitPrice.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="subtitle1">
                        AED {item.totalAmount.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        VAT: AED {item.taxAmount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvoiceDetail; 