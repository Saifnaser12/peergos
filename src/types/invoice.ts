
import { z } from 'zod';

export enum InvoiceType {
  STANDARD = 'STANDARD',
  SIMPLIFIED = 'SIMPLIFIED',
  DEBIT_NOTE = 'DEBIT_NOTE',
  CREDIT_NOTE = 'CREDIT_NOTE'
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SIGNED = 'SIGNED',
  SUBMITTED = 'SUBMITTED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

export interface TaxBreakdown {
  taxableAmount: number;
  taxRate: number;
  taxAmount: number;
  taxCategory: string;
  exemptionReason?: string;
}

export interface ContactDetails {
  phone?: string;
  email?: string;
}

export interface Address {
  street: string;
  city: string;
  emirate: string;
  country: string;
  postalCode?: string;
}

export interface Party {
  name: string;
  taxRegistrationNumber: string;
  address: Address;
  contactDetails?: ContactDetails;
  trn?: string; // For backward compatibility
  companyID?: string; // For PINT AE
  schemeID?: string; // For PINT AE
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  taxAmount: number;
  taxableAmount: number;
  productCode: string;
  taxCategory: string;
  taxRate: number;
  exemptionReason?: string;
  vatAmount?: number; // For backward compatibility
  total?: number; // For backward compatibility
  vatRate?: number; // For backward compatibility
  // PINT AE specific fields
  unitsOfMeasure?: string;
  classifiedTaxCategory?: string;
  sellersItemIdentification?: string;
}

export interface Invoice {
  id?: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  amount: number;
  vatAmount: number;
  seller: Party;
  buyer: Party;
  items: InvoiceItem[];
  type?: InvoiceType;
  status?: InvoiceStatus;
  total?: number; // For backward compatibility
  vatTotal?: number; // For backward compatibility
  subtotal?: number; // For backward compatibility
  
  // UAE FTA specific fields
  uuid?: string;
  signatureValue?: string;
  signatureDate?: string;
  qrCode?: string;
  previousInvoiceHash?: string;
  invoiceCounterValue?: number;
  
  // PINT AE specific fields
  customizationID?: string; // "urn:cen.eu:en16931:2017#compliant#urn:xeinkauf.de:kosit:xrechnung_3.0"
  profileID?: string; // "urn:fdc:peppol.eu:2017:poacc:billing:01:1.0"
  businessProcessTypeID?: string;
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
  submittedAt?: string;
  acknowledgedAt?: string;
  rejectionReason?: string;
}

// Phase 2 Invoice Data with compliance fields
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

// UAE FTA E-Invoice JSON structure for API submission
export interface FTAEInvoice {
  supplierTRN: string;
  buyerTRN?: string;
  issueDate: string;
  invoiceNumber: string;
  currency: string;
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    taxAmount: number;
    totalAmount: number;
    productCode?: string;
    unitsOfMeasure?: string;
  }>;
  seller: {
    name: string;
    trn: string;
    address: {
      street: string;
      city: string;
      emirate: string;
      country: string;
      postalCode?: string;
    };
    contact?: {
      phone?: string;
      email?: string;
    };
  };
  buyer?: {
    name: string;
    trn?: string;
    address: {
      street: string;
      city: string;
      emirate: string;
      country: string;
      postalCode?: string;
    };
    contact?: {
      phone?: string;
      email?: string;
    };
  };
  // PINT AE compliance
  customizationID: string;
  profileID: string;
  invoiceTypeCode: string;
  documentCurrencyCode: string;
  taxCurrencyCode: string;
  vatBreakdown: Array<{
    taxableAmount: number;
    taxRate: number;
    taxAmount: number;
    taxCategory: string;
  }>;
}

// Zod schema for validation
export const invoiceSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.nativeEnum(InvoiceType).optional(),
  status: z.nativeEnum(InvoiceStatus).optional(),
  issueDate: z.string().datetime(),
  dueDate: z.string().datetime().optional(),
  invoiceNumber: z.string().min(1),
  
  seller: z.object({
    name: z.string().min(1),
    address: z.object({
      street: z.string().min(1),
      city: z.string().min(1),
      emirate: z.string().min(1),
      country: z.string().min(1),
      postalCode: z.string().optional()
    }),
    taxRegistrationNumber: z.string().regex(/^\d{15}$/, 'TRN must be exactly 15 digits'),
    trn: z.string().regex(/^\d{15}$/, 'TRN must be exactly 15 digits').optional(),
    contactDetails: z.object({
      phone: z.string().optional(),
      email: z.string().email().optional()
    }).optional()
  }),
  
  buyer: z.object({
    name: z.string().min(1),
    address: z.object({
      street: z.string().min(1),
      city: z.string().min(1),
      emirate: z.string().min(1),
      country: z.string().min(1),
      postalCode: z.string().optional()
    }),
    taxRegistrationNumber: z.string().regex(/^\d{15}$/, 'TRN must be exactly 15 digits').optional(),
    trn: z.string().regex(/^\d{15}$/, 'TRN must be exactly 15 digits').optional(),
    contactDetails: z.object({
      phone: z.string().optional(),
      email: z.string().email().optional()
    }).optional()
  }),
  
  items: z.array(z.object({
    id: z.string().uuid(),
    description: z.string().min(1),
    quantity: z.number().positive(),
    unitPrice: z.number().nonnegative(),
    totalAmount: z.number().nonnegative(),
    taxAmount: z.number().nonnegative(),
    taxableAmount: z.number().nonnegative(),
    productCode: z.string(),
    taxCategory: z.string(),
    taxRate: z.number().nonnegative(),
    exemptionReason: z.string().optional(),
    vatAmount: z.number().nonnegative().optional(),
    total: z.number().nonnegative().optional(),
    vatRate: z.number().nonnegative().optional()
  })).min(1),
  
  currency: z.string(),
  amount: z.number().nonnegative(),
  vatAmount: z.number().nonnegative(),
  total: z.number().nonnegative().optional(),
  vatTotal: z.number().nonnegative().optional(),
  subtotal: z.number().nonnegative().optional(),
  
  uuid: z.string().uuid().optional(),
  signatureValue: z.string().optional(),
  signatureDate: z.string().datetime().optional(),
  qrCode: z.string().optional(),
  
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  submittedAt: z.string().datetime().optional(),
  acknowledgedAt: z.string().datetime().optional(),
  rejectionReason: z.string().optional()
});
