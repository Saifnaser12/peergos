
import React from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  Divider
} from '@mui/material';
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
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

interface ExportControlsProps {
  data: FinancialEntry[];
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
    isBalanced: boolean;
  };
}

export const ExportControls: React.FC<ExportControlsProps> = ({ data, summary }) => {
  const { t } = useTranslation();

  const exportToPDF = () => {
    const exportData = {
      profile: {
        legalName: 'Sample Company',
        taxRegistrationNumber: '100123456789003'
      },
      revenues: data.filter(entry => entry.type === 'revenue'),
      expenses: data.filter(entry => entry.type === 'expense'),
      vatDue: summary.totalRevenue * 0.05, // 5% VAT example
      citDue: summary.netIncome * 0.09, // 9% CIT example
      complianceScore: 85
    };
    
    import('../utils/exports').then(({ exportToPDF: exportPDF }) => {
      exportPDF(exportData, 'financial-report.pdf');
    });
  };

  const exportToExcel = () => {
    const exportData = {
      profile: {
        legalName: 'Sample Company',
        taxRegistrationNumber: '100123456789003'
      },
      revenues: data.filter(entry => entry.type === 'revenue'),
      expenses: data.filter(entry => entry.type === 'expense'),
      vatDue: summary.totalRevenue * 0.05,
      citDue: summary.netIncome * 0.09,
      complianceScore: 85
    };
    
    import('../utils/exports').then(({ exportToExcel: exportExcel }) => {
      exportExcel(exportData, 'financial-report.xlsx');
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      console.log('Uploading financial documents:', files);
      // Handle file upload logic here
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        {t('financials.exportControls', 'Export & Import Controls')}
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<PdfIcon />}
            onClick={exportToPDF}
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none',
              height: 48
            }}
          >
            {t('financials.exportPDF', 'Export PDF')}
          </Button>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<ExcelIcon />}
            onClick={exportToExcel}
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none',
              height: 48,
              backgroundColor: '#1976d2'
            }}
          >
            {t('financials.exportExcel', 'Export Excel')}
          </Button>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <input
            accept=".pdf,.xlsx,.xls"
            style={{ display: 'none' }}
            id="upload-financial-docs"
            type="file"
            multiple
            onChange={handleFileUpload}
          />
          <label htmlFor="upload-financial-docs">
            <Button
              fullWidth
              variant="outlined"
              startIcon={<UploadIcon />}
              component="span"
              sx={{ 
                borderRadius: 2, 
                textTransform: 'none',
                height: 48
              }}
            >
              {t('financials.uploadDocs', 'Upload Documents')}
            </Button>
          </label>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => console.log('Download template')}
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none',
              height: 48
            }}
          >
            {t('financials.downloadTemplate', 'Download Template')}
          </Button>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />
      
      <Typography variant="body2" color="text.secondary">
        {t('financials.exportNote', 'Exports include Income Statement, Balance Sheet, and detailed transaction records. Supported formats: PDF, Excel (.xlsx)')}
      </Typography>
    </Paper>
  );
};
