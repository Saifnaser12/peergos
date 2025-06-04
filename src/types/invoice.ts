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
  uuid?: string;
  signatureValue?: string;
  signatureDate?: string;
  qrCode?: string;
  createdAt?: string;
  updatedAt?: string;
  submittedAt?: string;
  acknowledgedAt?: string;
  rejectionReason?: string;
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
    taxRegistrationNumber: z.string().regex(/^\d{15}$/, 'TRN must be exactly 15 digits'),
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