import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFinance } from '../context/FinanceContext';

// Simple financial sync without external dependencies
const useSimpleFinancialData = () => {
  const { revenue, expenses, getTotalRevenue, getTotalExpenses, getNetIncome } = useFinance();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Simulate loading state
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    } catch (err) {
      console.error('Error in financial sync:', err);
      setError('Failed to load financial data');
      setIsLoading(false);
    }
  }, []);

  return {
    revenue: revenue || [],
    expenses: expenses || [],
    totalRevenue: getTotalRevenue() || 0,
    totalExpenses: getTotalExpenses() || 0,
    netIncome: getNetIncome() || 0,
    isLoading,
    error
  };
};

const Financials: React.FC = () => {
  const { t } = useTranslation();
  const { revenue, expenses, totalRevenue, totalExpenses, netIncome, isLoading, error } = useSimpleFinancialData();

  console.log('Financials page rendering with data:', {
    revenueCount: revenue.length,
    expenseCount: expenses.length,
    totalRevenue,
    totalExpenses,
    netIncome,
    isLoading,
    error
  });

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
        >
          Reload Page
        </Button>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography>Loading financial data...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Financial Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Real-time financial data and analytics
        </Typography>
      </Box>

      {/* Financial Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'success.main', mb: 1 }}>
                Total Revenue
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                AED {totalRevenue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {revenue.length} revenue entries
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'error.main', mb: 1 }}>
                Total Expenses
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                AED {totalExpenses.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {expenses.length} expense entries
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: netIncome >= 0 ? 'success.main' : 'error.main', mb: 1 }}>
                Net Income
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                AED {netIncome.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {netIncome >= 0 ? 'Profit' : 'Loss'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Revenue Details */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Revenue
            </Typography>
            {revenue.length > 0 ? (
              revenue.slice(0, 5).map((item) => (
                <Box key={item.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.category}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                      AED {item.amount.toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {item.description} • {new Date(item.date).toLocaleDateString()}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">No revenue entries found</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Expenses
            </Typography>
            {expenses.length > 0 ? (
              expenses.slice(0, 5).map((item) => (
                <Box key={item.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.category}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 600 }}>
                      AED {item.amount.toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {item.description} • {new Date(item.date).toLocaleDateString()}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">No expense entries found</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Status Info */}
      <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary">
          Last updated: {new Date().toLocaleTimeString()} • 
          Data synced from accounting module
        </Typography>
      </Box>
    </Box>
  );
};

export default Financials;