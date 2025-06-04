import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

interface FinancialData {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
}

const Financials: React.FC = () => {
  const [financialData, setFinancialData] = useState<FinancialData[]>([
    {
      id: '1',
      category: 'Revenue',
      amount: 50000,
      date: '2024-01-01',
      description: 'Sales Revenue'
    },
    {
      id: '2', 
      category: 'Expenses',
      amount: -15000,
      date: '2024-01-02',
      description: 'Office Rent'
    }
  ]);

  const [newEntry, setNewEntry] = useState({
    category: '',
    amount: 0,
    description: ''
  });

  const handleAddEntry = () => {
    if (newEntry.category && newEntry.amount && newEntry.description) {
      const entry: FinancialData = {
        id: Date.now().toString(),
        category: newEntry.category,
        amount: newEntry.amount,
        date: new Date().toISOString().split('T')[0],
        description: newEntry.description
      };
      setFinancialData([...financialData, entry]);
      setNewEntry({ category: '', amount: 0, description: '' });
    }
  };

  const totalRevenue = financialData
    .filter(item => item.amount > 0)
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpenses = financialData
    .filter(item => item.amount < 0)
    .reduce((sum, item) => sum + Math.abs(item.amount), 0);

  const netIncome = totalRevenue - totalExpenses;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Financial Management
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Total Revenue
              </Typography>
              <Typography variant="h4" color="success.main">
                ${totalRevenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Total Expenses
              </Typography>
              <Typography variant="h4" color="error.main">
                ${totalExpenses.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Net Income
              </Typography>
              <Typography 
                variant="h4" 
                color={netIncome >= 0 ? "success.main" : "error.main"}
              >
                ${netIncome.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add New Entry Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add Financial Entry
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Category"
              value={newEntry.category}
              onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={newEntry.amount}
              onChange={(e) => setNewEntry({ ...newEntry, amount: parseFloat(e.target.value) || 0 })}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Description"
              value={newEntry.description}
              onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={handleAddEntry}
              sx={{ height: '56px' }}
            >
              Add Entry
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Financial Data Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Financial Records
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {financialData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell 
                    align="right" 
                    sx={{ 
                      color: row.amount >= 0 ? 'success.main' : 'error.main',
                      fontWeight: 'bold'
                    }}
                  >
                    ${Math.abs(row.amount).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Financials;