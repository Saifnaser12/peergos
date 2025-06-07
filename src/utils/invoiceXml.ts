
export interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  supplierTRN: string;
  businessName: string;
  customerName: string;
  customerTRN?: string;
  serviceDescription: string;
  subtotal: number;
  vat: number;
  total: number;
}

export function generateInvoiceXML(invoice: InvoiceData): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Invoice>
  <InvoiceNumber>${invoice.invoiceNumber}</InvoiceNumber>
  <IssueDate>${invoice.issueDate}</IssueDate>
  <SupplierTRN>${invoice.supplierTRN}</SupplierTRN>
  <SupplierName>${invoice.businessName}</SupplierName>
  <CustomerName>${invoice.customerName}</CustomerName>
  <CustomerTRN>${invoice.customerTRN || ''}</CustomerTRN>
  <Description>${invoice.serviceDescription}</Description>
  <Subtotal>${invoice.subtotal.toFixed(2)}</Subtotal>
  <VAT>${invoice.vat.toFixed(2)}</VAT>
  <Total>${invoice.total.toFixed(2)}</Total>
</Invoice>`;
}

export function downloadInvoiceXML(invoice: InvoiceData, filename?: string): void {
  const xmlContent = generateInvoiceXML(invoice);
  const blob = new Blob([xmlContent], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `invoice-${invoice.invoiceNumber}.xml`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
