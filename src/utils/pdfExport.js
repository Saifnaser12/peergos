import jsPDF from 'jspdf';
import 'jspdf-autotable';
const formatCurrency = (amount) => {
    return amount.toLocaleString('en-AE', {
        style: 'currency',
        currency: 'AED'
    });
};
const createAccountRows = (accounts) => {
    return accounts.map(account => ({
        name: account.name,
        balance: formatCurrency(account.balance)
    }));
};
const addSection = (doc, title, rows, total, startY) => {
    doc.setFontSize(12);
    doc.text(title, 14, startY);
    doc.autoTable({
        startY: startY + 10,
        head: [['Account', 'Balance']],
        body: rows.map(row => [row.name, row.balance]),
        foot: [['Total', formatCurrency(total)]],
        theme: 'grid',
        headStyles: { fillColor: [66, 66, 66] },
        footStyles: { fillColor: [239, 239, 239], textColor: [0, 0, 0], fontStyle: 'bold' },
        margin: { top: 10 }
    });
    return doc.lastAutoTable.finalY;
};
export const generateBalanceSheetPDF = (balanceSheet, t, isRTL = false) => {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });
    // Set RTL if needed
    if (isRTL) {
        doc.setR2L(true);
    }
    // Add title
    doc.setFontSize(20);
    doc.text(t('balanceSheet.title'), 14, 20);
    doc.setFontSize(10);
    doc.text(new Date(balanceSheet.asOf).toLocaleDateString(), 14, 30);
    let currentY = 40;
    // Assets section
    const assetRows = [
        ...createAccountRows(balanceSheet.assets.currentAssets),
        ...createAccountRows(balanceSheet.assets.fixedAssets),
        ...createAccountRows(balanceSheet.assets.intangibleAssets),
        ...createAccountRows(balanceSheet.assets.otherAssets)
    ];
    currentY = addSection(doc, t('balanceSheet.assets'), assetRows, balanceSheet.assets.totalAssets, currentY);
    currentY += 20;
    // Liabilities section
    const liabilityRows = [
        ...createAccountRows(balanceSheet.liabilities.currentLiabilities),
        ...createAccountRows(balanceSheet.liabilities.longTermLiabilities),
        ...createAccountRows(balanceSheet.liabilities.otherLiabilities)
    ];
    currentY = addSection(doc, t('balanceSheet.liabilities'), liabilityRows, balanceSheet.liabilities.totalLiabilities, currentY);
    currentY += 20;
    // Equity section
    const equityRows = [
        ...createAccountRows(balanceSheet.equity.shareCapital),
        ...createAccountRows(balanceSheet.equity.retainedEarnings),
        ...createAccountRows(balanceSheet.equity.reserves)
    ];
    currentY = addSection(doc, t('balanceSheet.equity'), equityRows, balanceSheet.equity.totalEquity, currentY);
    // Add total liabilities and equity
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${t('balanceSheet.totalLiabilities')} + ${t('balanceSheet.equity')}: ${formatCurrency(balanceSheet.totalLiabilitiesAndEquity)}`, 14, currentY + 20);
    // Add balanced/not balanced message
    const isBalanced = Math.abs(balanceSheet.assets.totalAssets - balanceSheet.totalLiabilitiesAndEquity) < 0.01;
    doc.setTextColor(isBalanced ? 0 : 255, 0, 0);
    doc.text(isBalanced ? t('balanceSheet.balanced') : t('balanceSheet.notBalanced'), 14, currentY + 30);
    return doc;
};
export const downloadBalanceSheetPDF = (balanceSheet, t, isRTL = false) => {
    const doc = generateBalanceSheetPDF(balanceSheet, t, isRTL);
    doc.save('balance-sheet.pdf');
};
