import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
const PEERGOS_COLORS = {
    primary: '#4F46E5', // indigo-600
    secondary: '#6366F1', // indigo-500
    text: '#111827', // gray-900
    subtext: '#6B7280', // gray-500
    success: '#059669', // green-600
    warning: '#D97706', // yellow-600
    error: '#DC2626', // red-600
};
const formatCurrency = (amount) => {
    return `AED ${amount.toLocaleString()}`;
};
const getReportingPeriod = (data) => {
    const dates = [...data.revenues, ...data.expenses].map(entry => new Date(entry.date));
    const start = new Date(Math.min(...dates.map(d => d.getTime())));
    const end = new Date(Math.max(...dates.map(d => d.getTime())));
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
};
const getComplianceColor = (score) => {
    if (score >= 80)
        return PEERGOS_COLORS.success;
    if (score >= 60)
        return PEERGOS_COLORS.warning;
    return PEERGOS_COLORS.error;
};
export const exportToPDF = (data, filename) => {
    const doc = new jsPDF();
    // Add your PDF generation logic here
    doc.save(filename);
};
export const exportToExcel = (data, filename) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, filename);
};
export const exportToXML = (data, filename) => {
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
export const calculateDetailedComplianceScore = (data) => {
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
