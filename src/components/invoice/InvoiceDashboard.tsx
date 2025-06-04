import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { Invoice } from '../../types/invoice';

interface InvoiceDashboardProps {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
  onAdd: () => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
}

export const InvoiceDashboard: React.FC<InvoiceDashboardProps> = ({
  invoices,
  loading,
  error,
  onAdd,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mb={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          Invoices
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAdd}
        >
          New Invoice
        </Button>
      </Box>

      <Grid container spacing={3}>
        {invoices.map((invoice) => (
          <Grid item xs={12} md={6} lg={4} key={invoice.id}>
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

                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {new Date(invoice.issueDate).toLocaleDateString()}
                </Typography>

                <Typography variant="body1" gutterBottom>
                  {invoice.seller.name}
                </Typography>

                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Typography variant="subtitle1">Amount</Typography>
                  <Typography variant="subtitle1">
                    {invoice.amount.toLocaleString('en-AE', {
                      style: 'currency',
                      currency: 'AED'
                    })}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="subtitle1">VAT</Typography>
                  <Typography variant="subtitle1">
                    {invoice.vatAmount.toLocaleString('en-AE', {
                      style: 'currency',
                      currency: 'AED'
                    })}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}; 