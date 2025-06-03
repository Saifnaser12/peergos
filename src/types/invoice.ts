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

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  vatAmount: number;
  taxableAmount: number;
  taxAmount: number;
  productCode: string;
  taxCategory: string;
  taxRate: number;
  exemptionReason?: string;
}

export interface Party {
  name: string;
  taxRegistrationNumber: string;
  address: string;
}

export interface Invoice {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  amount: number;
  vatAmount: number;
  seller: Party;
  buyer: Party;
  items: InvoiceItem[];
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
  
  items: z.array(z.object({
    id: z.string().uuid(),
    description: z.string().min(1),
    quantity: z.number().positive(),
    unitPrice: z.number().nonnegative(),
    vatRate: z.number().nonnegative(),
    vatAmount: z.number().nonnegative(),
    total: z.number().nonnegative()
  })).min(1),
  
  subtotal: z.number().nonnegative(),
  vatTotal: z.number().nonnegative(),
  total: z.number().nonnegative(),
  
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