import React, { useState, useEffect } from 'react';
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
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Pagination
} from '@mui/material';
import { Grid } from '../common/Grid';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { format } from 'date-fns';
import { useInvoice } from '../../context/InvoiceContext';
import { Invoice, InvoiceStatus } from '../../types/invoice';

const statusColors: Record<InvoiceStatus, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  [InvoiceStatus.DRAFT]: 'default',
  [InvoiceStatus.SIGNED]: 'info',
  [InvoiceStatus.SUBMITTED]: 'primary',
  [InvoiceStatus.ACKNOWLEDGED]: 'success',
  [InvoiceStatus.REJECTED]: 'error',
  [InvoiceStatus.CANCELLED]: 'warning'
};

export const InvoiceDashboard: React.FC = () => {
  const {
    invoices,
    loading,
    error,
    total,
    currentPage,
    loadInvoices,
    deleteInvoice,
    submitInvoice
  } = useInvoice();

  const [filters, setFilters] = useState({
    status: '',
    startDate: null as Date | null,
    endDate: null as Date | null
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  useEffect(() => {
    interface InvoiceFilters {
      status?: InvoiceStatus;
      dateRange?: {
        start: string;
        end: string;
      };
    }

    const filterParams: InvoiceFilters = {
      status: filters.status as InvoiceStatus || undefined,
      dateRange: filters.startDate && filters.endDate
        ? {
            start: filters.startDate.toISOString(),
            end: filters.endDate.toISOString()
          }
        : undefined
    };

    loadInvoices(currentPage, filterParams);
  }, [currentPage, filters, loadInvoices]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    loadInvoices(page);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, status: event.target.value }));
  };

  const handleStartDateChange = (date: Date | null) => {
    setFilters(prev => ({ ...prev, startDate: date }));
  };

  const handleEndDateChange = (date: Date | null) => {
    setFilters(prev => ({ ...prev, endDate: date }));
  };

  const handleDeleteClick = (id: string) => {
    setSelectedInvoiceId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedInvoiceId) {
      await deleteInvoice(selectedInvoiceId);
      setDeleteDialogOpen(false);
      setSelectedInvoiceId(null);
    }
  };

  const handleSubmitInvoice = async (invoice: Invoice) => {
    await submitInvoice(invoice);
  };

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Invoice Dashboard
      </Typography>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                select
                fullWidth
                label="Status"
                value={filters.status}
                onChange={handleStatusChange}
              >
                <MenuItem value="">All</MenuItem>
                {Object.values(InvoiceStatus).map(status => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={filters.startDate}
                  onChange={handleStartDateChange}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={filters.endDate}
                  onChange={handleEndDateChange}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Invoice Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice Number</TableCell>
              <TableCell>Issue Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No invoices found
                </TableCell>
              </TableRow>
            ) : (
              invoices.map(invoice => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>
                    {format(new Date(invoice.issueDate), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    AED {invoice.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={invoice.status}
                      color={statusColors[invoice.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => {/* Navigate to detail view */}}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    {invoice.status === InvoiceStatus.DRAFT && (
                      <IconButton
                        color="primary"
                        onClick={() => handleSubmitInvoice(invoice)}
                      >
                        <CloudUploadIcon />
                      </IconButton>
                    )}
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(invoice.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={Math.ceil(total / 10)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this invoice?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 