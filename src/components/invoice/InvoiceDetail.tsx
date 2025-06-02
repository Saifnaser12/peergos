import React, { useEffect } from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import { Invoice, InvoiceStatus } from '../../types/invoice';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Divider
} from '@mui/material';
import { Grid } from '../common/Grid';
import { format } from 'date-fns';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import { TextField } from '@mui/material';
import { IconButton } from '@mui/material';
import { Tooltip } from '@mui/material';

interface InvoiceDetailProps {
  invoiceId: string;
  onEdit?: () => void;
}

const statusColors: Record<InvoiceStatus, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  [InvoiceStatus.DRAFT]: 'default',
  [InvoiceStatus.SIGNED]: 'info',
  [InvoiceStatus.SUBMITTED]: 'primary',
  [InvoiceStatus.ACKNOWLEDGED]: 'success',
  [InvoiceStatus.REJECTED]: 'error',
  [InvoiceStatus.CANCELLED]: 'warning'
};

export const InvoiceDetail: React.FC<InvoiceDetailProps> = ({
  invoiceId,
  onEdit
}) => {
  const {
    currentInvoice,
    loading,
    error,
    getInvoice,
    submitInvoice
  } = useInvoice();

  useEffect(() => {
    getInvoice(invoiceId);
  }, [invoiceId, getInvoice]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!currentInvoice) {
    return (
      <Box p={3}>
        <Alert severity="warning">Invoice not found</Alert>
      </Box>
    );
  }

  const handleSubmit = async () => {
    await submitInvoice(currentInvoice);
  };

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Invoice #{currentInvoice.invoiceNumber}
        </Typography>
        <Box display="flex" gap={2}>
          {currentInvoice.status === InvoiceStatus.DRAFT && (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CloudUploadIcon />}
                onClick={handleSubmit}
              >
                Submit
              </Button>
              <Button
                variant="outlined"
                onClick={onEdit}
              >
                Edit
              </Button>
            </>
          )}
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
          >
            View PDF
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
          >
            Download XML
          </Button>
        </Box>
      </Box>

      {/* Status and Dates */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle2" gutterBottom>
                Status
              </Typography>
              <Chip
                label={currentInvoice.status}
                color={statusColors[currentInvoice.status]}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle2" gutterBottom>
                Issue Date
              </Typography>
              <Typography>
                {format(new Date(currentInvoice.issueDate), 'dd/MM/yyyy')}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle2" gutterBottom>
                Due Date
              </Typography>
              <Typography>
                {currentInvoice.dueDate
                  ? format(new Date(currentInvoice.dueDate), 'dd/MM/yyyy')
                  : 'N/A'}
              </Typography>
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
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" gutterBottom>
                Company Name
              </Typography>
              <Typography>{currentInvoice.seller.name}</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" gutterBottom>
                TRN
              </Typography>
              <Typography>{currentInvoice.seller.trn}</Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" gutterBottom>
                Address
              </Typography>
              <Typography>
                {currentInvoice.seller.address.street}<br />
                {currentInvoice.seller.address.city}, {currentInvoice.seller.address.emirate}<br />
                {currentInvoice.seller.address.country}
                {currentInvoice.seller.address.postalCode && ` - ${currentInvoice.seller.address.postalCode}`}
              </Typography>
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
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" gutterBottom>
                Company Name
              </Typography>
              <Typography>{currentInvoice.buyer.name}</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" gutterBottom>
                TRN
              </Typography>
              <Typography>{currentInvoice.buyer.trn}</Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" gutterBottom>
                Address
              </Typography>
              <Typography>
                {currentInvoice.buyer.address.street}<br />
                {currentInvoice.buyer.address.city}, {currentInvoice.buyer.address.emirate}<br />
                {currentInvoice.buyer.address.country}
                {currentInvoice.buyer.address.postalCode && ` - ${currentInvoice.buyer.address.postalCode}`}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Invoice Lines */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Invoice Lines
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Code</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Net Amount</TableCell>
                  <TableCell align="right">VAT</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentInvoice.lines.map(line => (
                  <TableRow key={line.id}>
                    <TableCell>{line.productCode}</TableCell>
                    <TableCell>{line.description}</TableCell>
                    <TableCell align="right">{line.quantity}</TableCell>
                    <TableCell align="right">AED {line.unitPrice.toFixed(2)}</TableCell>
                    <TableCell align="right">AED {line.netAmount.toFixed(2)}</TableCell>
                    <TableCell align="right">AED {line.taxBreakdown.taxAmount.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      AED {(line.netAmount + line.taxBreakdown.taxAmount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Totals */}
      <Card>
        <CardContent>
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid size={{ xs: 12, md: 4 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle1">Net Amount:</Typography>
                <Typography variant="subtitle1">
                  AED {(currentInvoice.totalAmount - currentInvoice.totalTaxAmount).toFixed(2)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle1">VAT Amount:</Typography>
                <Typography variant="subtitle1">
                  AED {currentInvoice.totalTaxAmount.toFixed(2)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">Total Amount:</Typography>
                <Typography variant="h6">
                  AED {currentInvoice.totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}; 