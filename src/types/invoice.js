import { z } from 'zod';
export var InvoiceType;
(function (InvoiceType) {
    InvoiceType["STANDARD"] = "STANDARD";
    InvoiceType["SIMPLIFIED"] = "SIMPLIFIED";
    InvoiceType["DEBIT_NOTE"] = "DEBIT_NOTE";
    InvoiceType["CREDIT_NOTE"] = "CREDIT_NOTE";
})(InvoiceType || (InvoiceType = {}));
export var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["DRAFT"] = "DRAFT";
    InvoiceStatus["SIGNED"] = "SIGNED";
    InvoiceStatus["SUBMITTED"] = "SUBMITTED";
    InvoiceStatus["ACKNOWLEDGED"] = "ACKNOWLEDGED";
    InvoiceStatus["REJECTED"] = "REJECTED";
    InvoiceStatus["CANCELLED"] = "CANCELLED";
})(InvoiceStatus || (InvoiceStatus = {}));
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
