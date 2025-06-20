import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { TFunction } from 'i18next';

interface FinancialEntry {
  id: string;
  category: string;
  subcategory: string;
  amount: number;
  date: string;
  description: string;
  type: 'revenue' | 'expense' | 'asset' | 'liability' | 'equity';
}

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  lastModified: string;
}

interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  isBalanced: boolean;
}

interface ExportData {
  data: FinancialEntry[];
  summary: FinancialSummary;
  notes: Note[];
  companyInfo: {
    name: string;
    trn: string;
    address: string;
    period: string;
    isFreeZone?: boolean; // Added isFreeZone to company info
    qfzpStatus?: boolean; // Added qfzpStatus to company info
  };
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED'
  }).format(amount);
};

const addFTAHeader = (doc: jsPDF, companyInfo: any, title: string, isRTL: boolean = false) => {
  const pageWidth = doc.internal.pageSize.width;
  const margin = 14;
  const centerX = pageWidth / 2;

  // FTA Logo placeholder
  doc.setFillColor(0, 100, 150);
  doc.rect(margin, 10, 25, 15, 'F');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('FTA', margin + 12.5, 19, { align: 'center' });
  doc.setTextColor(0, 0, 0);

  // Company header section
  if (isRTL) {
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(companyInfo.name, pageWidth - margin, 20, { align: 'right' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`${companyInfo.trn} :الرقم الضريبي`, pageWidth - margin, 30, { align: 'right' });
    doc.text(companyInfo.address, pageWidth - margin, 38, { align: 'right' });
  } else {
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(companyInfo.name, margin + 35, 20);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`TRN: ${companyInfo.trn}`, margin + 35, 30);
    doc.text(companyInfo.address, margin + 35, 38);
  }

  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const titleY = 55;
  if (isRTL) {
    doc.text(title, pageWidth - margin, titleY, { align: 'right' });
  } else {
    doc.text(title, centerX, titleY, { align: 'center' });
  }

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const periodText = isRTL ? `${companyInfo.period} :للفترة` : `For the period: ${companyInfo.period}`;
  if (isRTL) {
    doc.text(periodText, pageWidth - margin, 65, { align: 'right' });
  } else {
    doc.text(periodText, centerX, 65, { align: 'center' });
  }

  // FTA Compliance note
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  const complianceText = isRTL 
    ? 'معد وفقاً لمعايير هيئة الضرائب والمعايير الدولية للتقارير المالية'
    : 'Prepared in accordance with FTA guidelines and IFRS standards';
  if (isRTL) {
    doc.text(complianceText, pageWidth - margin, 75, { align: 'right' });
  } else {
    doc.text(complianceText, centerX, 75, { align: 'center' });
  }
  doc.setTextColor(0, 0, 0);

  return 85; // Return Y position for content start
};

const addQFZPFooter = (doc: jsPDF, isRTL: boolean = false, companyInfo: any) => {
  if (companyInfo && companyInfo.isFreeZone && companyInfo.qfzpStatus) {
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 14;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(128, 128, 128); // Grey color
    const footerText = "This entity is a Qualifying Free Zone Person (QFZP) under Article 18 of Federal Decree-Law No. (47) of 2022.";
    const textWidth = doc.getTextWidth(footerText);

    let xPosition = pageWidth - margin - textWidth;

    if (isRTL) {
      xPosition = margin;
      doc.text(footerText, xPosition, pageHeight - 10, { align: 'left' });
    } else {
      doc.text(footerText, pageWidth - margin, pageHeight - 10, { align: 'right' });
    }

    doc.setTextColor(0, 0, 0); // Reset to black
    doc.setFont('helvetica', 'normal'); // Reset font style
  }
};

export const exportIncomeStatementToPDF = (exportData: ExportData, t: TFunction, isRTL: boolean = false): jsPDF => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  let yPosition = addFTAHeader(doc, exportData.companyInfo, t('financials.incomeStatement', 'Income Statement'), isRTL);

  const revenues = exportData.data.filter(item => item.type === 'revenue');
  const expenses = exportData.data.filter(item => item.type === 'expense');

  // Group by category
  const revenueGroups = revenues.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FinancialEntry[]>);

  const expenseGroups = expenses.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FinancialEntry[]>);

  // Revenue section
  const revenueRows: any[] = [];
  Object.entries(revenueGroups).forEach(([category, items]) => {
    revenueRows.push([category, formatCurrency(items.reduce((sum, item) => sum + item.amount, 0))]);
    items.forEach(item => {
      revenueRows.push([`  ${item.description}`, formatCurrency(item.amount)]);
    });
  });
  revenueRows.push(['Total Revenue', formatCurrency(exportData.summary.totalRevenue)]);

  (doc as any).autoTable({
    startY: yPosition,
    head: [['Revenue', 'Amount (AED)']],
    body: revenueRows,
    headStyles: { fillColor: [0, 150, 0] },
    margin: { left: 14, right: 14 }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 20;

  // Expenses section
  const expenseRows: any[] = [];
  Object.entries(expenseGroups).forEach(([category, items]) => {
    expenseRows.push([category, formatCurrency(items.reduce((sum, item) => sum + item.amount, 0))]);
    items.forEach(item => {
      expenseRows.push([`  ${item.description}`, formatCurrency(item.amount)]);
    });
  });
  expenseRows.push(['Total Expenses', formatCurrency(exportData.summary.totalExpenses)]);

  (doc as any).autoTable({
    startY: yPosition,
    head: [['Expenses', 'Amount (AED)']],
    body: expenseRows,
    headStyles: { fillColor: [150, 0, 0] },
    margin: { left: 14, right: 14 }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 20;

  // Net Income
  (doc as any).autoTable({
    startY: yPosition,
    head: [['', 'Amount (AED)']],
    body: [['Net Income', formatCurrency(exportData.summary.netIncome)]],
    headStyles: { fillColor: [50, 50, 150] },
    bodyStyles: { fontStyle: 'bold' },
    margin: { left: 14, right: 14 }
  });

  addQFZPFooter(doc, isRTL, exportData.companyInfo);
  return doc;
};

export const exportBalanceSheetToPDF = (exportData: ExportData, t: TFunction, isRTL: boolean = false): jsPDF => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  let yPosition = addFTAHeader(doc, exportData.companyInfo, t('financials.balanceSheet', 'Balance Sheet'), isRTL);

  const assets = exportData.data.filter(item => item.type === 'asset');
  const liabilities = exportData.data.filter(item => item.type === 'liability');
  const equity = exportData.data.filter(item => item.type === 'equity');

  // Assets section
  const assetRows = assets.map(item => [item.description, formatCurrency(item.amount)]);
  assetRows.push(['Total Assets', formatCurrency(exportData.summary.totalAssets)]);

  (doc as any).autoTable({
    startY: yPosition,
    head: [['Assets', 'Amount (AED)']],
    body: assetRows,
    headStyles: { fillColor: [0, 100, 150] },
    margin: { left: 14, right: 14 }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 20;

  // Liabilities section
  const liabilityRows = liabilities.map(item => [item.description, formatCurrency(item.amount)]);
  liabilityRows.push(['Total Liabilities', formatCurrency(exportData.summary.totalLiabilities)]);

  (doc as any).autoTable({
    startY: yPosition,
    head: [['Liabilities', 'Amount (AED)']],
    body: liabilityRows,
    headStyles: { fillColor: [150, 100, 0] },
    margin: { left: 14, right: 14 }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Equity section
  const equityRows = equity.map(item => [item.description, formatCurrency(item.amount)]);
  equityRows.push(['Retained Earnings', formatCurrency(exportData.summary.netIncome)]);
  equityRows.push(['Total Equity', formatCurrency(exportData.summary.totalEquity)]);

  (doc as any).autoTable({
    startY: yPosition,
    head: [['Equity', 'Amount (AED)']],
    body: equityRows,
    headStyles: { fillColor: [100, 0, 150] },
    margin: { left: 14, right: 14 }
  });

  addQFZPFooter(doc, isRTL, exportData.companyInfo);
  return doc;
};

export const exportCashFlowToPDF = (exportData: ExportData, t: TFunction, isRTL: boolean = false): jsPDF => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  let yPosition = addFTAHeader(doc, exportData.companyInfo, t('financials.cashFlowStatement', 'Cash Flow Statement'), isRTL);

  // Mock cash flow data (in real implementation, derive from actual cash movements)
  const operatingCashFlow = exportData.summary.netIncome + 15000 - 5000 + 8000 - 12000 - 2000;
  const investingCashFlow = -25000 - 10000;
  const financingCashFlow = 20000 - 8000 + 15000 - 5000;
  const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow;

  const cashFlowData = [
    ['Operating Activities', ''],
    ['  Net Income', formatCurrency(exportData.summary.netIncome)],
    ['  Depreciation', formatCurrency(15000)],
    ['  Changes in Working Capital', formatCurrency(-11000)],
    ['Net Cash from Operating Activities', formatCurrency(operatingCashFlow)],
    ['', ''],
    ['Investing Activities', ''],
    ['  Equipment Purchases', formatCurrency(-25000)],
    ['  Investment Purchases', formatCurrency(-10000)],
    ['Net Cash from Investing Activities', formatCurrency(investingCashFlow)],
    ['', ''],
    ['Financing Activities', ''],
    ['  Loan Proceeds', formatCurrency(20000)],
    ['  Loan Repayments', formatCurrency(-8000)],
    ['  Owner Contributions', formatCurrency(15000)],
    ['  Owner Withdrawals', formatCurrency(-5000)],
    ['Net Cash from Financing Activities', formatCurrency(financingCashFlow)],
    ['', ''],
    ['Net Increase in Cash', formatCurrency(netCashFlow)]
  ];

  (doc as any).autoTable({
    startY: yPosition,
    head: [['Cash Flow Item', 'Amount (AED)']],
    body: cashFlowData,
    headStyles: { fillColor: [0, 150, 100] },
    margin: { left: 14, right: 14 }
  });

  addQFZPFooter(doc, isRTL, exportData.companyInfo);
  return doc;
};

export const exportComprehensivePDF = (exportData: ExportData, t: TFunction, isRTL: boolean = false): jsPDF => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.width;
  const centerX = pageWidth / 2;
  const margin = 14;

  // Cover page with FTA branding
  doc.setFillColor(0, 100, 150);
  doc.rect(0, 0, pageWidth, 60, 'F');

  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  const coverTitle = isRTL ? 'البيانات المالية' : 'Financial Statements';
  doc.text(coverTitle, centerX, 35, { align: 'center' });

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'normal');
  doc.text(exportData.companyInfo.name, centerX, 80, { align: 'center' });

  const trnText = isRTL ? `${exportData.companyInfo.trn} :الرقم الضريبي` : `TRN: ${exportData.companyInfo.trn}`;
  doc.text(trnText, centerX, 95, { align: 'center' });
  doc.text(exportData.companyInfo.period, centerX, 110, { align: 'center' });

  doc.setFontSize(12);
  const complianceText = isRTL 
    ? 'معد وفقاً لمعايير هيئة الضرائب والمعايير الدولية للتقارير المالية'
    : 'Prepared in accordance with FTA guidelines and IFRS standards';
  doc.text(complianceText, centerX, 130, { align: 'center' });

  // Generate timestamp
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const timestamp = isRTL 
    ? `تاريخ التوليد: ${new Date().toLocaleDateString('ar-AE')}`
    : `Generated on: ${new Date().toLocaleDateString()}`;
  doc.text(timestamp, centerX, 250, { align: 'center' });

  // Add each statement on separate pages
  doc.addPage();
  const incomeDoc = exportIncomeStatementToPDF(exportData, t, isRTL);

  doc.addPage();
  const balanceDoc = exportBalanceSheetToPDF(exportData, t, isRTL);

  doc.addPage();
  const cashFlowDoc = exportCashFlowToPDF(exportData, t, isRTL);

  // Add notes section with enhanced formatting
  if (exportData.notes.length > 0) {
    doc.addPage();
    const notesTitle = isRTL ? 'ملاحظات على البيانات المالية' : 'Notes to Financial Statements';
    let yPos = addFTAHeader(doc, exportData.companyInfo, notesTitle, isRTL);

    exportData.notes.forEach((note, index) => {
      if (yPos > 240) {
        doc.addPage();
        yPos = 30;
      }

      // Note number and title
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      const noteHeader = isRTL ? `${note.title} .${index + 1}` : `${index + 1}. ${note.title}`;
      if (isRTL) {
        doc.text(noteHeader, pageWidth - margin, yPos, { align: 'right' });
      } else {
        doc.text(noteHeader, margin, yPos);
      }
      yPos += 10;

      // Note content
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const textWidth = pageWidth - (margin * 2);
      const splitContent = doc.splitTextToSize(note.content, textWidth);
      if (isRTL) {
        doc.text(splitContent, pageWidth - margin, yPos, { align: 'right' });
      } else {
        doc.text(splitContent, margin, yPos);
      }
      yPos += splitContent.length * 5 + 10;

      // Tags
      if (note.tags.length > 0) {
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        const tagsText = isRTL ? `العلامات: ${note.tags.join('، ')}` : `Tags: ${note.tags.join(', ')}`;
        if (isRTL) {
          doc.text(tagsText, pageWidth - margin, yPos, { align: 'right' });
        } else {
          doc.text(tagsText, margin, yPos);
        }
        doc.setTextColor(0, 0, 0);
        yPos += 15;
      }

      // Separator line
      if (index < exportData.notes.length - 1) {
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 10;
      }
    });
  }

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const footerText = isRTL 
      ? `صفحة ${i} من ${pageCount} | مولد بواسطة Peergos`
      : `Page ${i} of ${pageCount} | Generated by Peergos`;
    doc.text(footerText, centerX, 285, { align: 'center' });
    addQFZPFooter(doc, isRTL, exportData.companyInfo); // Add QFZP footer to all pages
  }

  return doc;
};

export const exportToExcelFinal = (exportData: ExportData, t: TFunction, isRTL: boolean = false): void => {
  const workbook = XLSX.utils.book_new();

  // Income Statement sheet
  const incomeData = [
    ['Income Statement'],
    ['Company:', exportData.companyInfo.name],
    ['TRN:', exportData.companyInfo.trn],
    ['Period:', exportData.companyInfo.period],
    [''],
    ['REVENUE'],
    ['Description', 'Amount (AED)']
  ];

  const revenues = exportData.data.filter(item => item.type === 'revenue');
  revenues.forEach(item => {
    incomeData.push([item.description, item.amount]);
  });
  incomeData.push(['Total Revenue', exportData.summary.totalRevenue]);
  incomeData.push(['']);
  incomeData.push(['EXPENSES']);
  incomeData.push(['Description', 'Amount (AED)']);

  const expenses = exportData.data.filter(item => item.type === 'expense');
  expenses.forEach(item => {
    incomeData.push([item.description, item.amount]);
  });
  incomeData.push(['Total Expenses', exportData.summary.totalExpenses]);
  incomeData.push(['']);
  incomeData.push(['Net Income', exportData.summary.netIncome]);

  const incomeSheet = XLSX.utils.aoa_to_sheet(incomeData);
  XLSX.utils.book_append_sheet(workbook, incomeSheet, 'Income Statement');

  // Balance Sheet sheet
  const balanceData = [
    ['Balance Sheet'],
    ['Company:', exportData.companyInfo.name],
    ['TRN:', exportData.companyInfo.trn],
    ['Period:', exportData.companyInfo.period],
    [''],
    ['ASSETS'],
    ['Description', 'Amount (AED)']
  ];

  const assets = exportData.data.filter(item => item.type === 'asset');
  assets.forEach(item => {
    balanceData.push([item.description, item.amount]);
  });
  balanceData.push(['Total Assets', exportData.summary.totalAssets]);
  balanceData.push(['']);
  balanceData.push(['LIABILITIES']);
  balanceData.push(['Description', 'Amount (AED)']);

  const liabilities = exportData.data.filter(item => item.type === 'liability');
  liabilities.forEach(item => {
    balanceData.push([item.description, item.amount]);
  });
  balanceData.push(['Total Liabilities', exportData.summary.totalLiabilities]);
  balanceData.push(['']);
  balanceData.push(['EQUITY']);
  balanceData.push(['Description', 'Amount (AED)']);

  const equity = exportData.data.filter(item => item.type === 'equity');
  equity.forEach(item => {
    balanceData.push([item.description, item.amount]);
  });
  balanceData.push(['Retained Earnings', exportData.summary.netIncome]);
  balanceData.push(['Total Equity', exportData.summary.totalEquity]);

  const balanceSheet = XLSX.utils.aoa_to_sheet(balanceData);
  XLSX.utils.book_append_sheet(workbook, balanceSheet, 'Balance Sheet');

  // Notes sheet with enhanced formatting
  if (exportData.notes.length > 0) {
    const notesTitle = isRTL ? 'ملاحظات على البيانات المالية' : 'Notes to Financial Statements';
    const companyLabel = isRTL ? ':الشركة' : 'Company:';
    const noteNumHeader = isRTL ? 'رقم الملاحظة' : 'Note #';
    const titleHeader = isRTL ? 'العنوان' : 'Title';
    const contentHeader = isRTL ? 'المحتوى' : 'Content';
    const tagsHeader = isRTL ? 'العلامات' : 'Tags';
    const modifiedHeader = isRTL ? 'تاريخ التعديل' : 'Last Modified';

    const notesData = [
      [notesTitle],
      [companyLabel, exportData.companyInfo.name],
      ['TRN:', exportData.companyInfo.trn],
      [isRTL ? ':الفترة' : 'Period:', exportData.companyInfo.period],
      [''],
      [noteNumHeader, titleHeader, contentHeader, tagsHeader, modifiedHeader]
    ];

    exportData.notes.forEach((note, index) => {
      notesData.push([
        index + 1,
        note.title,
        note.content,
        note.tags.join(isRTL ? '، ' : ', '),
        new Date(note.lastModified).toLocaleDateString(isRTL ? 'ar-AE' : 'en-AE')
      ]);
    });

    const notesSheet = XLSX.utils.aoa_to_sheet(notesData);

    // Set column widths
    notesSheet['!cols'] = [
      { width: 10 },
      { width: 25 },
      { width: 50 },
      { width: 20 },
      { width: 15 }
    ];

    // Set RTL direction if needed
    if (isRTL) {
      notesSheet['!dir'] = 'rtl';
    }

    XLSX.utils.book_append_sheet(workbook, notesSheet, isRTL ? 'الملاحظات' : 'Notes');
  }

  // Download the file with appropriate filename
  const dateStr = new Date().toISOString().split('T')[0];
  const companyName = exportData.companyInfo.name.replace(/\s+/g, '_');
  const filename = isRTL 
    ? `البيانات_المالية_${companyName}_${dateStr}.xlsx`
    : `Financial_Statements_${companyName}_${dateStr}.xlsx`;

  XLSX.writeFile(workbook, filename);
};
export const exportToPDF = (data: any) => {
  exportComprehensivePDF(data);
};

export const exportToExcel = (data: any) => {
  try {
    // Create CSV content
    let csvContent = "Type,Date,Category,Description,Amount\n";

    // Add revenue data
    if (data.revenues) {
      data.revenues.forEach((item: any) => {
        csvContent += `Revenue,${item.date},${item.category || 'General'},"${item.description}",${item.amount}\n`;
      });
    }

    // Add expense data
    if (data.expenses) {
      data.expenses.forEach((item: any) => {
        csvContent += `Expense,${item.date},${item.category},"${item.description}",${item.amount}\n`;
      });
    }

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `financial-data-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Error generating Excel export:', error);
    throw error;
  }
};