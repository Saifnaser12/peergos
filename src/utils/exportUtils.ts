
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface FinancialData {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  revenues: Array<{
    id: string;
    amount: number;
    description: string;
    date: string;
    category?: string;
  }>;
  expenses: Array<{
    id: string;
    amount: number;
    category: string;
    date: string;
    description?: string;
    vendor?: string;
  }>;
}

const formatCurrency = (amount: number): string => {
  return `AED ${amount.toLocaleString()}`;
};

export const exportToPDF = (data: FinancialData) => {
  const doc = new jsPDF();
  
  // Set title
  doc.setFontSize(20);
  doc.setTextColor(79, 70, 229); // Primary color
  doc.text('Financial Summary Report', 20, 20);
  
  // Company info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 35);
  
  // Financial Summary
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Financial Summary', 20, 55);
  
  const summaryData = [
    ['Total Revenue', formatCurrency(data.totalRevenue)],
    ['Total Expenses', formatCurrency(data.totalExpenses)],
    ['Net Income', formatCurrency(data.netIncome)]
  ];
  
  (doc as any).autoTable({
    startY: 65,
    head: [['Metric', 'Amount']],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] },
    margin: { top: 10 }
  });
  
  // Revenue Details
  if (data.revenues.length > 0) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Revenue Transactions', 20, 20);
    
    const revenueData = data.revenues.map(r => [
      r.date,
      r.description,
      r.category || 'General',
      formatCurrency(r.amount)
    ]);
    
    (doc as any).autoTable({
      startY: 30,
      head: [['Date', 'Description', 'Category', 'Amount']],
      body: revenueData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });
  }
  
  // Expense Details
  if (data.expenses.length > 0) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Expense Transactions', 20, 20);
    
    const expenseData = data.expenses.map(e => [
      e.date,
      e.description || '',
      e.category,
      e.vendor || '',
      formatCurrency(e.amount)
    ]);
    
    (doc as any).autoTable({
      startY: 30,
      head: [['Date', 'Description', 'Category', 'Vendor', 'Amount']],
      body: expenseData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });
  }
  
  const filename = `Financial_Summary_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};

export const exportToExcel = (data: FinancialData) => {
  const wb = XLSX.utils.book_new();
  
  // Summary Sheet
  const summaryData = [
    ['Financial Summary', ''],
    ['Metric', 'Amount'],
    ['Total Revenue', data.totalRevenue],
    ['Total Expenses', data.totalExpenses],
    ['Net Income', data.netIncome],
    ['', ''],
    ['Generated Date', new Date().toLocaleDateString()]
  ];
  
  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
  
  // Revenue Sheet
  if (data.revenues.length > 0) {
    const revenueData = data.revenues.map(r => ({
      Date: r.date,
      Description: r.description,
      Category: r.category || 'General',
      Amount: r.amount
    }));
    
    const revenueWs = XLSX.utils.json_to_sheet(revenueData);
    XLSX.utils.book_append_sheet(wb, revenueWs, 'Revenue');
  }
  
  // Expenses Sheet
  if (data.expenses.length > 0) {
    const expenseData = data.expenses.map(e => ({
      Date: e.date,
      Description: e.description || '',
      Category: e.category,
      Vendor: e.vendor || '',
      Amount: e.amount
    }));
    
    const expenseWs = XLSX.utils.json_to_sheet(expenseData);
    XLSX.utils.book_append_sheet(wb, expenseWs, 'Expenses');
  }
  
  const filename = `Financial_Summary_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
};
