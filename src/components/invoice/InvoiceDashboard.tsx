import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Tooltip,
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

const InvoiceDashboard: React.FC<InvoiceDashboardProps> = ({
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
      <Box mt={2}>
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
          <Grid item xs={12} sm={6} md={4} key={invoice.invoiceNumber}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {invoice.invoiceNumber}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {invoice.issueDate}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {invoice.seller.name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" color="primary">
                      AED {invoice.amount.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      VAT: AED {invoice.vatAmount.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(invoice)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(invoice)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default InvoiceDashboard; 