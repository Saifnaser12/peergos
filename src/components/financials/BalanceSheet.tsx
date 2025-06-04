
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
  Grid,
  Alert,
  Chip,
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

interface BalanceSheetProps {
  data: FinancialEntry[];
  netIncome: number;
}

export const BalanceSheet: React.FC<BalanceSheetProps> = ({ data, netIncome }) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const assets = data.filter(item => item.type === 'asset');
  const liabilities = data.filter(item => item.type === 'liability');
  const equity = data.filter(item => item.type === 'equity');
  
  const totalAssets = assets.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilities = liabilities.reduce((sum, item) => sum + item.amount, 0);
  const totalEquity = equity.reduce((sum, item) => sum + item.amount, 0) + netIncome;
  
  const isBalanced = Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01;

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

  const assetGroups = groupByCategory(assets);
  const liabilityGroups = groupByCategory(liabilities);
  const equityGroups = groupByCategory(equity);

  const renderSection = (title: string, groups: Record<string, FinancialEntry[]>, total: number, color: string) => (
    <TableContainer component={Paper} sx={{ mb: 2, borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: alpha(color, 0.1) }}>
            <TableCell colSpan={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, color }}>
                {title}
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(groups).map(([category, items]) => (
            <React.Fragment key={category}>
              <TableRow>
                <TableCell sx={{ pl: 2, fontWeight: 500 }}>{category}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 500 }}>
                  {formatCurrency(items.reduce((sum, item) => sum + item.amount, 0))}
                </TableCell>
              </TableRow>
              {items.map(item => (
                <TableRow key={item.id}>
                  <TableCell sx={{ pl: 4, fontSize: '0.875rem', color: 'text.secondary' }}>
                    {item.description}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    {formatCurrency(item.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
          {/* Add retained earnings for equity section */}
          {title === t('financials.equity', 'Equity') && netIncome !== 0 && (
            <TableRow>
              <TableCell sx={{ pl: 2, fontWeight: 500 }}>
                {t('financials.retainedEarnings', 'Retained Earnings')}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 500 }}>
                {formatCurrency(netIncome)}
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell sx={{ 
              fontWeight: 600, 
              borderTop: 2, 
              borderColor: color,
              backgroundColor: alpha(color, 0.05)
            }}>
              {t('financials.total', 'Total')} {title}
            </TableCell>
            <TableCell align="right" sx={{ 
              fontWeight: 600, 
              borderTop: 2, 
              borderColor: color,
              backgroundColor: alpha(color, 0.05),
              color
            }}>
              {formatCurrency(total)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}>
      <Paper sx={{ 
        borderRadius: 3, 
        overflow: 'hidden', 
        boxShadow: theme.shadows[4],
        mb: 3
      }}>
        <Box sx={{ 
          p: 3, 
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: alpha(theme.palette.secondary.main, 0.1),
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {t('financials.balanceSheet', 'Balance Sheet')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('financials.asOf', 'As of')} {new Date().toLocaleDateString()}
            </Typography>
          </Box>
          <Chip 
            label={isBalanced ? t('financials.balanced', 'Balanced') : t('financials.unbalanced', 'Unbalanced')}
            color={isBalanced ? 'success' : 'error'}
            sx={{ fontSize: '0.9rem', fontWeight: 600 }}
          />
        </Box>

        {!isBalanced && (
          <Alert severity="warning" sx={{ m: 3, borderRadius: 2 }}>
            {t('financials.imbalanceWarning', 'Warning: Balance Sheet is not balanced. Assets must equal Liabilities + Equity.')}
            <br />
            <Typography variant="body2" sx={{ mt: 1 }}>
              {t('financials.difference', 'Difference')}: {formatCurrency(Math.abs(totalAssets - (totalLiabilities + totalEquity)))}
            </Typography>
          </Alert>
        )}

        <Grid container spacing={3} sx={{ p: 3 }}>
          <Grid item xs={12} md={6}>
            {renderSection(
              t('financials.assets', 'Assets'), 
              assetGroups, 
              totalAssets, 
              theme.palette.info.main
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            {renderSection(
              t('financials.liabilities', 'Liabilities'), 
              liabilityGroups, 
              totalLiabilities, 
              theme.palette.warning.main
            )}
            
            {renderSection(
              t('financials.equity', 'Equity'), 
              equityGroups, 
              totalEquity, 
              theme.palette.secondary.main
            )}

            {/* Total Liabilities + Equity */}
            <Paper sx={{ borderRadius: 2, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700,
                  textAlign: 'center',
                  color: theme.palette.primary.main
                }}>
                  {t('financials.totalLiabilitiesEquity', 'Total Liabilities + Equity')}
                </Typography>
                <Typography variant="h5" sx={{ 
                  fontWeight: 700,
                  textAlign: 'center',
                  color: theme.palette.primary.main,
                  mt: 1
                }}>
                  {formatCurrency(totalLiabilities + totalEquity)}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};
