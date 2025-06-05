
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

interface CashFlowStatementProps {
  data: FinancialEntry[];
  netIncome: number;
}

export const CashFlowStatement: React.FC<CashFlowStatementProps> = ({ data, netIncome }) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-AE' : 'en-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  };

  // Mock cash flow calculations (in a real app, this would be based on actual cash movements)
  const operatingActivities = {
    netIncome,
    depreciation: 15000, // Mock depreciation
    accountsReceivableChange: -5000, // Increase in receivables
    accountsPayableChange: 8000, // Increase in payables
    inventoryChange: -12000, // Increase in inventory
    prepaidExpensesChange: -2000, // Increase in prepaid expenses
  };

  const investingActivities = {
    equipmentPurchases: -25000, // Purchase of equipment
    equipmentSales: 0, // Sale of equipment
    investmentPurchases: -10000, // Purchase of investments
    investmentSales: 0, // Sale of investments
  };

  const financingActivities = {
    loanProceeds: 20000, // New loan proceeds
    loanRepayments: -8000, // Loan repayments
    ownerContributions: 15000, // Owner capital contributions
    ownerWithdrawals: -5000, // Owner withdrawals
    dividendPayments: 0, // Dividend payments
  };

  const operatingCashFlow = Object.values(operatingActivities).reduce((sum, val) => sum + val, 0);
  const investingCashFlow = Object.values(investingActivities).reduce((sum, val) => sum + val, 0);
  const financingCashFlow = Object.values(financingActivities).reduce((sum, val) => sum + val, 0);
  const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow;

  const renderSection = (title: string, items: Record<string, number>, total: number, color: string) => (
    <>
      <TableRow>
        <TableCell colSpan={2} sx={{ backgroundColor: alpha(color, 0.1), py: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color }}>
            {title}
          </Typography>
        </TableCell>
      </TableRow>
      {Object.entries(items).map(([key, value]) => (
        <TableRow key={key}>
          <TableCell sx={{ pl: 4 }}>
            {t(`cashFlow.${key}`, key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))}
          </TableCell>
          <TableCell align="right" sx={{ 
            color: value >= 0 ? theme.palette.success.main : theme.palette.error.main 
          }}>
            {formatCurrency(value)}
          </TableCell>
        </TableRow>
      ))}
      <TableRow>
        <TableCell sx={{ 
          fontWeight: 600, 
          borderTop: 2, 
          borderColor: color,
          backgroundColor: alpha(color, 0.05),
          pl: 2
        }}>
          {t('cashFlow.totalFrom', 'Total from')} {title}
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
    </>
  );

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
        backgroundColor: alpha(theme.palette.info.main, 0.1)
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600, textAlign: 'center' }}>
          {t('financials.cashFlowStatement', 'Cash Flow Statement')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
          {t('financials.subtitle', 'For the period ending')} {new Date().toLocaleDateString()}
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableBody>
            {/* Operating Activities */}
            {renderSection(
              t('cashFlow.operatingActivities', 'Cash Flows from Operating Activities'),
              operatingActivities,
              operatingCashFlow,
              theme.palette.primary.main
            )}

            {/* Investing Activities */}
            {renderSection(
              t('cashFlow.investingActivities', 'Cash Flows from Investing Activities'),
              investingActivities,
              investingCashFlow,
              theme.palette.secondary.main
            )}

            {/* Financing Activities */}
            {renderSection(
              t('cashFlow.financingActivities', 'Cash Flows from Financing Activities'),
              financingActivities,
              financingCashFlow,
              theme.palette.info.main
            )}

            {/* Net Cash Flow */}
            <TableRow>
              <TableCell sx={{ 
                fontWeight: 700, 
                fontSize: '1.1rem',
                borderTop: 3,
                borderColor: theme.palette.warning.main,
                backgroundColor: alpha(theme.palette.warning.main, 0.05),
                py: 2
              }}>
                {t('cashFlow.netCashFlow', 'Net Increase (Decrease) in Cash')}
              </TableCell>
              <TableCell align="right" sx={{ 
                fontWeight: 700, 
                fontSize: '1.1rem',
                borderTop: 3,
                borderColor: theme.palette.warning.main,
                backgroundColor: alpha(theme.palette.warning.main, 0.05),
                color: netCashFlow >= 0 ? theme.palette.success.main : theme.palette.error.main,
                py: 2
              }}>
                {formatCurrency(netCashFlow)}
              </TableCell>
            </TableRow>

            {/* Cash Balance Information */}
            <TableRow>
              <TableCell sx={{ fontWeight: 500, pt: 2 }}>
                {t('cashFlow.beginningCash', 'Cash at Beginning of Period')}
              </TableCell>
              <TableCell align="right" sx={{ pt: 2 }}>
                {formatCurrency(50000)} {/* Mock beginning balance */}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ 
                fontWeight: 600,
                borderTop: 1,
                borderColor: theme.palette.divider
              }}>
                {t('cashFlow.endingCash', 'Cash at End of Period')}
              </TableCell>
              <TableCell align="right" sx={{ 
                fontWeight: 600,
                borderTop: 1,
                borderColor: theme.palette.divider,
                color: theme.palette.primary.main
              }}>
                {formatCurrency(50000 + netCashFlow)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
