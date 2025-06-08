
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useFinance } from '../context/FinanceContext';

const FinancialsTest: React.FC = () => {
  console.log('FinancialsTest component rendering...');
  
  try {
    const finance = useFinance();
    console.log('Finance context in test:', finance);
    
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          ✅ Financials Test - SUCCESS
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Finance context loaded successfully!
        </Typography>
        <Typography variant="body2">
          Revenue entries: {finance.revenue?.length || 0}
        </Typography>
        <Typography variant="body2">
          Expense entries: {finance.expenses?.length || 0}
        </Typography>
        <Typography variant="body2">
          Total Revenue: AED {finance.getTotalRevenue?.() || 0}
        </Typography>
        <Typography variant="body2">
          Total Expenses: AED {finance.getTotalExpenses?.() || 0}
        </Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => window.location.href = '/financials'}
        >
          Go to Full Financials Page
        </Button>
      </Box>
    );
  } catch (error) {
    console.error('Error in FinancialsTest:', error);
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" color="error" sx={{ mb: 2 }}>
          ❌ Financials Test - FAILED
        </Typography>
        <Typography variant="body1" color="error">
          Error: {error instanceof Error ? error.message : 'Unknown error'}
        </Typography>
      </Box>
    );
  }
};

export default FinancialsTest;
