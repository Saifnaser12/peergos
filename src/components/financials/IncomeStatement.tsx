
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface FinancialEntry {
  id: string;
  category: string;
  subcategory: string;
  amount: number;
  date: string;
  description: string;
  type: 'revenue' | 'expense' | 'asset' | 'liability' | 'equity';
}

interface IncomeStatementProps {
  data: FinancialEntry[];
}

export const IncomeStatement: React.FC<IncomeStatementProps> = ({ data }) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const revenues = data.filter(item => item.type === 'revenue');
  const expenses = data.filter(item => item.type === 'expense');
  
  const totalRevenue = revenues.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const netIncome = totalRevenue - totalExpenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-AE' : 'en-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  };

  const groupByCategory = (items: FinancialEntry[]) => {
    return items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, FinancialEntry[]>);
  };

  const revenueGroups = groupByCategory(revenues);
  const expenseGroups = groupByCategory(expenses);

  return (
    <Paper sx={{ 
      borderRadius: 3, 
      overflow: 'hidden', 
      boxShadow: theme.shadows[4],
      direction: i18n.language === 'ar' ? 'rtl' : 'ltr'
    }}>
      <Box sx={{ 
        p: 3, 
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: alpha(theme.palette.primary.main, 0.1)
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600, textAlign: 'center' }}>
          {t('financials.incomeStatement', 'Income Statement')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
          {t('financials.subtitle', 'For the period ending')} {new Date().toLocaleDateString()}
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableBody>
            {/* Revenue Section */}
            <TableRow>
              <TableCell colSpan={2} sx={{ backgroundColor: alpha(theme.palette.success.main, 0.1) }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                  {t('financials.revenue', 'Revenue')}
                </Typography>
              </TableCell>
            </TableRow>
            {Object.entries(revenueGroups).map(([category, items]) => (
              <React.Fragment key={category}>
                <TableRow>
                  <TableCell sx={{ pl: 4, fontWeight: 500 }}>{category}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 500 }}>
                    {formatCurrency(items.reduce((sum, item) => sum + item.amount, 0))}
                  </TableCell>
                </TableRow>
                {items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell sx={{ pl: 6, fontSize: '0.875rem', color: 'text.secondary' }}>
                      {item.description}
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                      {formatCurrency(item.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
            <TableRow>
              <TableCell sx={{ fontWeight: 600, borderTop: 2 }}>
                {t('financials.totalRevenue', 'Total Revenue')}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, borderTop: 2, color: theme.palette.success.main }}>
                {formatCurrency(totalRevenue)}
              </TableCell>
            </TableRow>

            {/* Expenses Section */}
            <TableRow>
              <TableCell colSpan={2} sx={{ backgroundColor: alpha(theme.palette.error.main, 0.1), pt: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.error.main }}>
                  {t('financials.expenses', 'Expenses')}
                </Typography>
              </TableCell>
            </TableRow>
            {Object.entries(expenseGroups).map(([category, items]) => (
              <React.Fragment key={category}>
                <TableRow>
                  <TableCell sx={{ pl: 4, fontWeight: 500 }}>{category}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 500 }}>
                    {formatCurrency(items.reduce((sum, item) => sum + item.amount, 0))}
                  </TableCell>
                </TableRow>
                {items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell sx={{ pl: 6, fontSize: '0.875rem', color: 'text.secondary' }}>
                      {item.description}
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                      {formatCurrency(item.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
            <TableRow>
              <TableCell sx={{ fontWeight: 600, borderTop: 2 }}>
                {t('financials.totalExpenses', 'Total Expenses')}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, borderTop: 2, color: theme.palette.error.main }}>
                {formatCurrency(totalExpenses)}
              </TableCell>
            </TableRow>

            {/* Net Income */}
            <TableRow>
              <TableCell sx={{ 
                fontWeight: 700, 
                fontSize: '1.1rem',
                borderTop: 3,
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.05)
              }}>
                {t('financials.netIncome', 'Net Income')}
              </TableCell>
              <TableCell align="right" sx={{ 
                fontWeight: 700, 
                fontSize: '1.1rem',
                borderTop: 3,
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                color: netIncome >= 0 ? theme.palette.success.main : theme.palette.error.main
              }}>
                {formatCurrency(netIncome)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
