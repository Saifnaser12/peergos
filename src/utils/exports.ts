import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import type { CompanyProfile, RevenueEntry, ExpenseEntry } from '../types';
import { calculateComplianceScore } from './compliance';

interface ExportData {
  profile: CompanyProfile;
  revenues: RevenueEntry[];
  expenses: ExpenseEntry[];
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

export const generatePDFReport = async (data: ExportData): Promise<Blob> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;

  // Add logo and header
  doc.addImage('/assets/logo.png', 'PNG', margin, margin, 40, 15);
  doc.setFontSize(20);
  doc.setTextColor(PEERGOS_COLORS.primary);
  doc.text('Tax Compliance Report', pageWidth / 2, margin + 20, { align: 'center' });

  // Company details
  doc.setFontSize(12);
  doc.setTextColor(PEERGOS_COLORS.text);
  doc.text(`Company: ${data.profile.companyName}`, margin, margin + 40);
  doc.text(`TRN: ${data.profile.trnNumber}`, margin, margin + 48);
  doc.text(`Period: ${getReportingPeriod(data)}`, margin, margin + 56);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, margin + 64);

  // Compliance score gauge
  const scoreY = margin + 80;
  doc.setFillColor(getComplianceColor(data.complianceScore));
  doc.circle(pageWidth / 2, scoreY, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text(`${data.complianceScore}%`, pageWidth / 2, scoreY + 5, { align: 'center' });
  doc.setTextColor(PEERGOS_COLORS.text);
  doc.text('Compliance Score', pageWidth / 2, scoreY + 25, { align: 'center' });

  // Summary section
  const summaryY = scoreY + 40;
  doc.setFontSize(14);
  doc.text('Financial Summary', margin, summaryY);
  doc.setFontSize(12);
  doc.text('Revenue:', margin, summaryY + 15);
  doc.text(formatCurrency(data.revenues.reduce((sum, r) => sum + r.amount, 0)), 120, summaryY + 15);
  doc.text('Expenses:', margin, summaryY + 23);
  doc.text(formatCurrency(data.expenses.reduce((sum, e) => sum + e.amount, 0)), 120, summaryY + 23);
  doc.text('VAT Due:', margin, summaryY + 31);
  doc.text(formatCurrency(data.vatDue), 120, summaryY + 31);
  doc.text('CIT Due:', margin, summaryY + 39);
  doc.text(formatCurrency(data.citDue), 120, summaryY + 39);

  // Transactions tables
  doc.addPage();
  doc.setFontSize(14);
  doc.text('Revenue Transactions', margin, margin);
  doc.setFontSize(10);
  const revenueHeaders = ['Date', 'Source', 'Amount', 'VAT'];
  let y = margin + 15;
  
  // Revenue table
  doc.setTextColor(PEERGOS_COLORS.subtext);
  revenueHeaders.forEach((header, i) => {
    doc.text(header, margin + (i * 40), y);
  });
  
  doc.setTextColor(PEERGOS_COLORS.text);
  data.revenues.forEach((revenue, index) => {
    y += 8;
    if (y > doc.internal.pageSize.height - margin) {
      doc.addPage();
      y = margin + 15;
    }
    doc.text(new Date(revenue.date).toLocaleDateString(), margin, y);
    doc.text(revenue.source, margin + 40, y);
    doc.text(formatCurrency(revenue.amount), margin + 80, y);
    doc.text(formatCurrency(revenue.vatAmount), margin + 120, y);
  });

  // Footer
  const footerText = 'Prepared for submission to Federal Tax Authority (FTA)';
  doc.setFontSize(10);
  doc.setTextColor(PEERGOS_COLORS.subtext);
  doc.text(
    footerText,
    pageWidth / 2,
    doc.internal.pageSize.height - 10,
    { align: 'center' }
  );

  return doc.output('blob');
};

export const generateExcelReport = async (data: ExportData): Promise<Blob> => {
  const workbook = XLSX.utils.book_new();

  // Summary sheet
  const summaryData = [
    ['Peergos Tax Report'],
    [],
    ['Company Details'],
    ['Company Name', data.profile.companyName],
    ['TRN', data.profile.trnNumber],
    ['Period', getReportingPeriod(data)],
    ['Generated', new Date().toLocaleString()],
    [],
    ['Financial Summary'],
    ['Total Revenue', data.revenues.reduce((sum, r) => sum + r.amount, 0)],
    ['Total Expenses', data.expenses.reduce((sum, e) => sum + e.amount, 0)],
    ['VAT Due', data.vatDue],
    ['CIT Due', data.citDue],
    [],
    ['Compliance Score', `${data.complianceScore}%`]
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

  // Revenue sheet
  const revenueData = data.revenues.map(rev => ({
    Date: new Date(rev.date),
    Source: rev.source,
    Amount: rev.amount,
    'VAT Amount': rev.vatAmount
  }));
  const revenueSheet = XLSX.utils.json_to_sheet(revenueData);

  // Expense sheet
  const expenseData = data.expenses.map(exp => ({
    Date: new Date(exp.date),
    Category: exp.category,
    Amount: exp.amount
  }));
  const expenseSheet = XLSX.utils.json_to_sheet(expenseData);

  // Add sheets to workbook
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
  XLSX.utils.book_append_sheet(workbook, revenueSheet, 'Revenue');
  XLSX.utils.book_append_sheet(workbook, expenseSheet, 'Expenses');

  // Apply styles
  ['A1:B1', 'A3:B3', 'A9:B9'].forEach(range => {
    const [start, end] = range.split(':');
    for (let col = start[0]; col <= end[0]; col = String.fromCharCode(col.charCodeAt(0) + 1)) {
      const cell = summarySheet[`${col}${start.slice(1)}`];
      if (cell) {
        cell.s = {
          font: { bold: true, color: { rgb: PEERGOS_COLORS.primary.replace('#', '') } },
          fill: { fgColor: { rgb: 'F3F4F6' } } // gray-100
        };
      }
    }
  });

  // Write workbook to buffer
  const wbout = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  return new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
}; 