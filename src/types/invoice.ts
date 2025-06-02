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

export interface PartyInfo {
  name: string;
  address: Address;
  trn: string;
  customerId?: string;
  contactDetails?: ContactDetails;
}

export interface InvoiceLine {
  id: string;
  productCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discountAmount?: number;
  netAmount: number;
  taxBreakdown: TaxBreakdown;
}

export interface Invoice {
  id: string;
  type: InvoiceType;
  status: InvoiceStatus;
  issueDate: string;
  dueDate?: string;
  invoiceNumber: string;
  purchaseOrderRef?: string;
  
  seller: PartyInfo;
  buyer: PartyInfo;
  
  lines: InvoiceLine[];
  
  totalAmount: number;
  totalTaxAmount: number;
  totalDiscountAmount?: number;
  
  paymentTerms?: string;
  notes?: string;
  
  // E-invoicing specific fields
  uuid: string;
  signatureValue?: string;
  signatureDate?: string;
  qrCode?: string;
  
  // Audit fields
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  acknowledgedAt?: string;
  rejectionReason?: string;
}

// Zod schema for validation
export const invoiceSchema = z.object({
  id: z.string().uuid(),
  type: z.nativeEnum(InvoiceType),
  status: z.nativeEnum(InvoiceStatus),
  issueDate: z.string().datetime(),
  dueDate: z.string().datetime().optional(),
  invoiceNumber: z.string().min(1),
  purchaseOrderRef: z.string().optional(),
  
  seller: z.object({
    name: z.string().min(1),
    address: z.object({
      street: z.string().min(1),
      city: z.string().min(1),
      emirate: z.string().min(1),
      country: z.string().min(1),
      postalCode: z.string().optional()
    }),
    trn: z.string().regex(/^\d{15}$/, 'TRN must be exactly 15 digits'),
    customerId: z.string().optional(),
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
    trn: z.string().regex(/^\d{15}$/, 'TRN must be exactly 15 digits'),
    customerId: z.string().optional(),
    contactDetails: z.object({
      phone: z.string().optional(),
      email: z.string().email().optional()
    }).optional()
  }),
  
  lines: z.array(z.object({
    id: z.string().uuid(),
    productCode: z.string().min(1),
    description: z.string().min(1),
    quantity: z.number().positive(),
    unitPrice: z.number().nonnegative(),
    discountAmount: z.number().nonnegative().optional(),
    netAmount: z.number().nonnegative(),
    taxBreakdown: z.object({
      taxableAmount: z.number().nonnegative(),
      taxRate: z.number().nonnegative(),
      taxAmount: z.number().nonnegative(),
      taxCategory: z.string().min(1),
      exemptionReason: z.string().optional()
    })
  })).min(1),
  
  totalAmount: z.number().nonnegative(),
  totalTaxAmount: z.number().nonnegative(),
  totalDiscountAmount: z.number().nonnegative().optional(),
  
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  
  uuid: z.string().uuid(),
  signatureValue: z.string().optional(),
  signatureDate: z.string().datetime().optional(),
  qrCode: z.string().optional(),
  
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  submittedAt: z.string().datetime().optional(),
  acknowledgedAt: z.string().datetime().optional(),
  rejectionReason: z.string().optional()
}); 