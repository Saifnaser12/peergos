
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export async function generateInvoiceWithQR(data: {
  invoiceNumber: string;
  date: string;
  customer: string;
  amount: number;
  freeZoneVATNote?: string;
  isFreeZoneCompany?: boolean;
}) {
  const qrContent = `INV:${data.invoiceNumber}|DATE:${data.date}|AED:${data.amount}`;
  const qrDataURL = await QRCode.toDataURL(qrContent);

  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('TAX INVOICE', 20, 20);
  
  // Invoice details
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(`Invoice #${data.invoiceNumber}`, 20, 40);
  doc.text(`Date: ${data.date}`, 20, 50);
  doc.text(`Customer: ${data.customer}`, 20, 60);
  doc.text(`Amount: AED ${data.amount.toLocaleString()}`, 20, 70);
  
  // Free Zone VAT Note
  if (data.freeZoneVATNote) {
    doc.setFontSize(10);
    doc.setFont(undefined, 'italic');
    doc.text(data.freeZoneVATNote, 20, 85);
  }
  
  // QR Code with border
  doc.setDrawColor(200, 200, 200);
  doc.rect(145, 15, 50, 50);
  doc.addImage(qrDataURL, "PNG", 150, 20, 40, 40);
  
  // QR Code label
  doc.setFontSize(8);
  doc.text('Scan for verification', 150, 75);

  // Free Zone footer note if applicable
  if (data.isFreeZoneCompany) {
    doc.setFontSize(8);
    doc.setFont(undefined, 'italic');
    doc.setTextColor(128, 128, 128);
    doc.text('This entity operates in a UAE Free Zone under FTA regulations', 20, 280);
  }

  doc.save(`invoice_${data.invoiceNumber}.pdf`);
}

// Enhanced QR code generation for FTA compliance
export async function generateFTACompliantQR(data: {
  sellerTRN: string;
  buyerTRN?: string;
  invoiceDate: string;
  totalAmount: number;
  vatAmount: number;
  invoiceHash?: string;
}) {
  // FTA-compliant QR format
  const qrContent = [
    data.sellerTRN,
    data.buyerTRN || '',
    data.invoiceDate,
    data.totalAmount.toFixed(2),
    data.vatAmount.toFixed(2),
    data.invoiceHash || ''
  ].join('|');
  
  return await QRCode.toDataURL(qrContent, {
    errorCorrectionLevel: 'M',
    type: 'image/png',
    quality: 0.92,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
}
