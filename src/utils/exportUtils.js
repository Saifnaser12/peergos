import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
const formatCurrency = (amount) => {
    return `AED ${amount.toLocaleString()}`;
};
export function exportToPDF(data) {
    const doc = new jsPDF();
    // Set title
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229); // Primary color
    doc.text('FTA-Compliant Financial Summary Report', 20, 20);
    // Company info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 35);
    // Financial Summary
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Financial Summary', 20, 55);
    const summaryData = data ? [
        ['Total Revenue', formatCurrency(data.totalRevenue)],
        ['Total Expenses', formatCurrency(data.totalExpenses)],
        ['Net Income', formatCurrency(data.netIncome)]
    ] : [
        ['Total Revenue', 'AED 100,000'],
        ['Total Expenses', 'AED 30,000'],
        ['Net Income', 'AED 70,000']
    ];
    autoTable(doc, {
        startY: 65,
        head: [['Section', 'Amount (AED)']],
        body: summaryData,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] },
        margin: { top: 10 }
    });
    // Revenue Details
    if (data && data.revenues.length > 0) {
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
        autoTable(doc, {
            startY: 30,
            head: [['Date', 'Description', 'Category', 'Amount']],
            body: revenueData,
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229] }
        });
    }
    // Expense Details
    if (data && data.expenses.length > 0) {
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
        autoTable(doc, {
            startY: 30,
            head: [['Date', 'Description', 'Category', 'Vendor', 'Amount']],
            body: expenseData,
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229] }
        });
    }
    const filename = `FTA_Financial_Summary_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
}
export function exportToExcel(data) {
    const wb = XLSX.utils.book_new();
    // Summary Sheet
    const summaryData = data ? [
        ['FTA-Compliant Financial Summary', ''],
        ['Section', 'Amount (AED)'],
        ['Total Revenue', data.totalRevenue],
        ['Total Expenses', data.totalExpenses],
        ['Net Income', data.netIncome],
        ['', ''],
        ['Generated Date', new Date().toLocaleDateString()]
    ] : [
        ['FTA-Compliant Financial Summary', ''],
        ['Section', 'Amount (AED)'],
        ['Total Revenue', 100000],
        ['Total Expenses', 30000],
        ['Net Income', 70000],
        ['', ''],
        ['Generated Date', new Date().toLocaleDateString()]
    ];
    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
    // Revenue Sheet
    if (data && data.revenues.length > 0) {
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
    if (data && data.expenses.length > 0) {
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
    const filename = `FTA_Financial_Summary_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, filename);
}
export function exportFTAReturnPDF(data) {
    const doc = new jsPDF();
    // Set title with FTA branding
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229); // Primary color
    doc.text("FTA Corporate Tax Return Summary", 20, 20);
    // Company info and timestamp
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 35);
    doc.text("UAE Federal Tax Authority - CIT Return", 20, 45);
    // FTA compliance note
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Prepared in accordance with UAE Corporate Tax Law", 20, 55);
    doc.setTextColor(0, 0, 0);
    autoTable(doc, {
        startY: 70,
        head: [["الفئة", "المبلغ (درهم)"]],
        body: [
            ["الإيرادات", `AED ${data.revenue.toLocaleString()}`],
            ["المصروفات", `AED ${data.expenses.toLocaleString()}`],
            ["صافي الربح الخاضع للضريبة", `AED ${data.taxableIncome.toLocaleString()}`],
            ["ضريبة الشركات المستحقة", `AED ${data.taxDue.toLocaleString()}`]
        ],
        theme: 'grid',
        headStyles: {
            fillColor: [79, 70, 229],
            textColor: [255, 255, 255],
            fontSize: 12,
            fontStyle: 'bold'
        },
        bodyStyles: {
            fontSize: 11
        },
        columnStyles: {
            0: { halign: 'right', cellWidth: 80 },
            1: { halign: 'left', cellWidth: 60 }
        }
    });
    // Add footer with FTA compliance
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("This document is generated for UAE FTA compliance purposes", 20, pageHeight - 20);
    doc.text(`Tax Period: ${new Date().getFullYear()}`, 20, pageHeight - 10);
    doc.save("FTA_CIT_Return.pdf");
}
export function exportVATReturnPDF(data) {
    const doc = new jsPDF();
    // Set title with FTA branding
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229); // Primary color
    doc.text("VAT Return Summary (FTA Format)", 20, 20);
    // Company info and timestamp
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 35);
    doc.text("UAE Federal Tax Authority - VAT Return", 20, 45);
    // FTA compliance note
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Prepared in accordance with UAE VAT Law", 20, 55);
    doc.setTextColor(0, 0, 0);
    autoTable(doc, {
        startY: 70,
        head: [["Section", "Amount (AED)"]],
        body: [
            ["Tax Period", data.period],
            ["Output VAT", `AED ${data.outputVAT.toLocaleString()}`],
            ["Input VAT", `AED ${data.inputVAT.toLocaleString()}`],
            ["Net VAT Payable", `AED ${data.netVAT.toLocaleString()}`]
        ],
        theme: 'grid',
        headStyles: {
            fillColor: [79, 70, 229],
            textColor: [255, 255, 255],
            fontSize: 12,
            fontStyle: 'bold'
        },
        bodyStyles: {
            fontSize: 11
        },
        columnStyles: {
            0: { halign: 'left', cellWidth: 80 },
            1: { halign: 'right', cellWidth: 60 }
        }
    });
    // Add footer with FTA compliance
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("This document is generated for UAE FTA VAT compliance purposes", 20, pageHeight - 20);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, pageHeight - 10);
    doc.save("VAT_Return_Summary.pdf");
}
// Legacy exports for backward compatibility
export { exportToPDF as exportFinancialsToPDF, exportToExcel as exportFinancialsToExcel };
