import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import type { CompanyProfile, RevenueEntry, ExpenseEntry } from '../types';
import { calculateComplianceScore } from './compliance';

interface ExportData {
  profile: {
    legalName: string;
    taxRegistrationNumber: string;
  };
  revenues: Array<{
    id: string;
    date: string;
    description: string;
    category?: string;
    amount: number;
  }>;
  expenses: Array<{
    id: string;
    date: string;
    description: string;
    category?: string;
    amount: number;
  }>;
  vatDue: number;
  citDue: number;
  complianceScore: number;
}

const PEERGOS_COLORS = {
  primary: '#4F46E5', // indigo-600
  secondary: '#6366F1', // indigo-500
  text: '#111827', // gray-900
  subtext: '#6B7280', // gray-500
  success: '#059669', // green-600
  warning: '#D97706', // yellow-600
  error: '#DC2626', // red-600
};

const formatCurrency = (amount: number): string => {
  return `AED ${amount.toLocaleString()}`;
};

const getReportingPeriod = (data: ExportData): string => {
  const dates = [...data.revenues, ...data.expenses].map(entry => new Date(entry.date));
  const start = new Date(Math.min(...dates.map(d => d.getTime())));
  const end = new Date(Math.max(...dates.map(d => d.getTime())));
  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
};

const getComplianceColor = (score: number): string => {
  if (score >= 80) return PEERGOS_COLORS.success;
  if (score >= 60) return PEERGOS_COLORS.warning;
  return PEERGOS_COLORS.error;
};

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'revenue' | 'expense';
  amount: number;
}

function formatTransactions(transactions: Transaction[]) {
  return transactions.map(tx => ({
    Date: tx.date,
    Description: tx.description,
    Category: tx.category,
    Type: tx.type === 'revenue' ? 'Revenue' : 'Expense',
    Amount: `${tx.amount.toFixed(2)} AED`
  }));
}

export const exportToPDF = (data: ExportData, filename: string) => {
  const doc = new jsPDF();
  
  // Set title
  doc.setFontSize(20);
  doc.setTextColor(PEERGOS_COLORS.primary);
  doc.text('Financial Report', 20, 20);
  
  // Company info
  doc.setFontSize(12);
  doc.setTextColor(PEERGOS_COLORS.text);
  doc.text(`Company: ${data.profile.legalName}`, 20, 35);
  doc.text(`TRN: ${data.profile.taxRegistrationNumber}`, 20, 45);
  doc.text(`Period: ${getReportingPeriod(data)}`, 20, 55);
  
  // Financial Summary
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Financial Summary', 20, 75);
  
  const summaryData = [
    ['Total Revenue', formatCurrency(data.revenues.reduce((sum, r) => sum + r.amount, 0))],
    ['Total Expenses', formatCurrency(data.expenses.reduce((sum, e) => sum + e.amount, 0))],
    ['Net Income', formatCurrency(data.revenues.reduce((sum, r) => sum + r.amount, 0) - data.expenses.reduce((sum, e) => sum + e.amount, 0))],
    ['VAT Due', formatCurrency(data.vatDue)],
    ['CIT Due', formatCurrency(data.citDue)]
  ];
  
  (doc as any).autoTable({
    startY: 85,
    head: [['Metric', 'Amount']],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] },
    margin: { top: 10 }
  });
  
  // Revenue Transactions
  if (data.revenues.length > 0) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Revenue Transactions', 20, 20);
    
    const revenueData = formatTransactions(data.revenues.map(r => ({
      id: r.id,
      date: r.date,
      description: r.description,
      category: r.category || 'General Revenue',
      type: 'revenue' as const,
      amount: r.amount
    })));
    
    (doc as any).autoTable({
      startY: 30,
      head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
      body: revenueData.map(r => [r.Date, r.Description, r.Category, r.Type, r.Amount]),
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });
  }
  
  // Expense Transactions
  if (data.expenses.length > 0) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Expense Transactions', 20, 20);
    
    const expenseData = formatTransactions(data.expenses.map(e => ({
      id: e.id,
      date: e.date,
      description: e.description,
      category: e.category || 'General Expense',
      type: 'expense' as const,
      amount: e.amount
    })));
    
    (doc as any).autoTable({
      startY: 30,
      head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
      body: expenseData.map(e => [e.Date, e.Description, e.Category, e.Type, e.Amount]),
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });
  }
  
  doc.save(filename);
};

export const exportToExcel = (data: ExportData, filename: string) => {
  const wb = XLSX.utils.book_new();
  
  // Summary Sheet
  const summaryData = [
    ['Metric', 'Amount'],
    ['Total Revenue', data.revenues.reduce((sum, r) => sum + r.amount, 0)],
    ['Total Expenses', data.expenses.reduce((sum, e) => sum + e.amount, 0)],
    ['Net Income', data.revenues.reduce((sum, r) => sum + r.amount, 0) - data.expenses.reduce((sum, e) => sum + e.amount, 0)],
    ['VAT Due', data.vatDue],
    ['CIT Due', data.citDue],
    ['Compliance Score', data.complianceScore]
  ];
  
  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
  
  // Revenue Transactions Sheet
  if (data.revenues.length > 0) {
    const revenueTransactions = formatTransactions(data.revenues.map(r => ({
      id: r.id,
      date: r.date,
      description: r.description,
      category: r.category || 'General Revenue',
      type: 'revenue' as const,
      amount: r.amount
    })));
    
    const revenueWs = XLSX.utils.json_to_sheet(revenueTransactions);
    XLSX.utils.book_append_sheet(wb, revenueWs, 'Revenue');
  }
  
  // Expense Transactions Sheet
  if (data.expenses.length > 0) {
    const expenseTransactions = formatTransactions(data.expenses.map(e => ({
      id: e.id,
      date: e.date,
      description: e.description,
      category: e.category || 'General Expense',
      type: 'expense' as const,
      amount: e.amount
    })));
    
    const expenseWs = XLSX.utils.json_to_sheet(expenseTransactions);
    XLSX.utils.book_append_sheet(wb, expenseWs, 'Expenses');
  }
  
  XLSX.writeFile(wb, filename);
};

export const exportToXML = (data: any, filename: string) => {
  // Add your XML generation logic here
  const xmlString = JSON.stringify(data);
  const blob = new Blob([xmlString], { type: 'application/xml' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const calculateDetailedComplianceScore = (data: any) => {
  // Implementation
  return {
    score: 85,
    breakdown: [
      {
        category: 'Documentation',
        score: 90,
        maxScore: 100,
        issues: []
      },
      {
        category: 'Filing',
        score: 80,
        maxScore: 100,
        issues: []
      }
    ]
  };
}; 