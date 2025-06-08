// import jsSHA from 'jssha';
// import QRCode from 'qrcode';

// Simplified hash generation
export function generateHash(invoiceXML: string): string {
  const shaObj = new jsSHA("SHA-256", "TEXT");
  shaObj.update(invoiceXML);
  return shaObj.getHash("HEX");
}

// Simulate a digital signature (replace with real cert later)
export function fakeDigitalSignature(data: string): string {
  return btoa(data + "::signed-by-fake-cert");
}

// Generate QR Code from invoice summary
export async function generateInvoiceQR(data: {
  sellerTRN: string;
  buyerTRN: string;
  invoiceDate: string;
  totalAmount: number;
}): Promise<string> {
  const content = `${data.sellerTRN}|${data.buyerTRN}|${data.invoiceDate}|${data.totalAmount}`;
  return await QRCode.toDataURL(content);
}

// Enhanced invoice processing with Phase 2 compliance
export interface Phase2InvoiceData {
  xml: string;
  hash: string;
  signature: string;
  qrCode: string;
  sellerTRN: string;
  buyerTRN: string;
  invoiceDate: string;
  totalAmount: number;
}

export async function processInvoiceForPhase2(
  invoiceXML: string,
  invoiceData: {
    sellerTRN: string;
    buyerTRN: string;
    invoiceDate: string;
    totalAmount: number;
  }
): Promise<Phase2InvoiceData> {
  // Generate hash
  const hash = generateHash(invoiceXML);

  // Generate digital signature (fake for now)
  const signature = fakeDigitalSignature(hash);

  // Generate QR code
  const qrCode = await generateInvoiceQR(invoiceData);

  return {
    xml: invoiceXML,
    hash,
    signature,
    qrCode,
    ...invoiceData
  };
}

// Validate Phase 2 compliance
export function validatePhase2Compliance(invoiceData: Phase2InvoiceData): {
  isCompliant: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!invoiceData.hash) {
    errors.push("Missing invoice hash");
  }

  if (!invoiceData.signature) {
    errors.push("Missing digital signature");
  }

  if (!invoiceData.qrCode) {
    errors.push("Missing QR code");
  }

  if (!invoiceData.sellerTRN || invoiceData.sellerTRN.length !== 15) {
    errors.push("Invalid seller TRN");
  }

  if (!invoiceData.buyerTRN || invoiceData.buyerTRN.length !== 15) {
    errors.push("Invalid buyer TRN");
  }

  return {
    isCompliant: errors.length === 0,
    errors
  };
}