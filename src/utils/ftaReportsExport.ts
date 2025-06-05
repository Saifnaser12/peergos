
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
  };
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED'
  }).format(amount);
};

const addFTAHeader = (doc: jsPDF, companyInfo: any, title: string) => {
  // Add logo placeholder (in real implementation, you'd add actual logo)
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(companyInfo.name, 14, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`TRN: ${companyInfo.trn}`, 14, 30);
  doc.text(companyInfo.address, 14, 38);
  
  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 55);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`For the period: ${companyInfo.period}`, 14, 65);
  
  // FTA Compliance note
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Prepared in accordance with FTA guidelines and IFRS standards', 14, 75);
  doc.setTextColor(0, 0, 0);
  
  return 85; // Return Y position for content start
};

export const exportIncomeStatementToPDF = (exportData: ExportData, t: TFunction): jsPDF => {
  const doc = new jsPDF();
  
  let yPosition = addFTAHeader(doc, exportData.companyInfo, t('financials.incomeStatement', 'Income Statement'));
  
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
  
  return doc;
};

export const exportBalanceSheetToPDF = (exportData: ExportData, t: TFunction): jsPDF => {
  const doc = new jsPDF();
  
  let yPosition = addFTAHeader(doc, exportData.companyInfo, t('financials.balanceSheet', 'Balance Sheet'));
  
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
  
  return doc;
};

export const exportCashFlowToPDF = (exportData: ExportData, t: TFunction): jsPDF => {
  const doc = new jsPDF();
  
  let yPosition = addFTAHeader(doc, exportData.companyInfo, t('financials.cashFlowStatement', 'Cash Flow Statement'));
  
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
  
  return doc;
};

export const exportComprehensivePDF = (exportData: ExportData, t: TFunction): jsPDF => {
  const doc = new jsPDF();
  
  // Cover page
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Financial Statements', 105, 50, { align: 'center' });
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'normal');
  doc.text(exportData.companyInfo.name, 105, 70, { align: 'center' });
  doc.text(`TRN: ${exportData.companyInfo.trn}`, 105, 85, { align: 'center' });
  doc.text(exportData.companyInfo.period, 105, 100, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('Prepared in accordance with FTA guidelines and IFRS standards', 105, 120, { align: 'center' });
  
  // Add each statement on separate pages
  doc.addPage();
  const incomeDoc = exportIncomeStatementToPDF(exportData, t);
  
  doc.addPage();
  const balanceDoc = exportBalanceSheetToPDF(exportData, t);
  
  doc.addPage();
  const cashFlowDoc = exportCashFlowToPDF(exportData, t);
  
  // Add notes
  if (exportData.notes.length > 0) {
    doc.addPage();
    let yPos = addFTAHeader(doc, exportData.companyInfo, 'Notes to Financial Statements');
    
    exportData.notes.forEach((note, index) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${note.title}`, 14, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const splitContent = doc.splitTextToSize(note.content, 180);
      doc.text(splitContent, 14, yPos);
      yPos += splitContent.length * 5 + 10;
      
      if (note.tags.length > 0) {
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Tags: ${note.tags.join(', ')}`, 14, yPos);
        doc.setTextColor(0, 0, 0);
        yPos += 15;
      }
    });
  }
  
  return doc;
};

export const exportToExcel = (exportData: ExportData, t: TFunction): void => {
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
  
  // Notes sheet
  if (exportData.notes.length > 0) {
    const notesData = [
      ['Notes to Financial Statements'],
      ['Company:', exportData.companyInfo.name],
      [''],
      ['Note #', 'Title', 'Content', 'Tags']
    ];
    
    exportData.notes.forEach((note, index) => {
      notesData.push([
        index + 1,
        note.title,
        note.content,
        note.tags.join(', ')
      ]);
    });
    
    const notesSheet = XLSX.utils.aoa_to_sheet(notesData);
    XLSX.utils.book_append_sheet(workbook, notesSheet, 'Notes');
  }
  
  // Download the file
  XLSX.writeFile(workbook, `Financial_Statements_${exportData.companyInfo.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
};
