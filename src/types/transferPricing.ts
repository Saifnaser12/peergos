export enum TransactionType {
  SALE_OF_GOODS = 'SALE_OF_GOODS',
  PURCHASE_OF_GOODS = 'PURCHASE_OF_GOODS',
  SERVICES = 'SERVICES',
  ROYALTIES = 'ROYALTIES',
  INTEREST = 'INTEREST',
  OTHER = 'OTHER'
}

export enum TransferPricingMethod {
  CUP = 'CUP',
  RESALE_MINUS = 'RESALE_MINUS',
  COST_PLUS = 'COST_PLUS',
  TNMM = 'TNMM',
  PROFIT_SPLIT = 'PROFIT_SPLIT'
}

export type DocumentType = 'MASTER_FILE' | 'LOCAL_FILE' | 'CBC_REPORT';

export interface RelatedPartyTransaction {
  id: string;
  type: TransactionType;
  date: string;
  amount: number;
  currency: string;
  relatedParty: string;
  description: string;
  method: TransferPricingMethod;
  documentation: string[];
}

export interface TransferPricingDisclosure {
  id: string;
  period: string;
  transactions: RelatedPartyTransaction[];
  documentation: string[];
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface TransferPricingDocument {
  id: string;
  type: DocumentType;
  name: string;
  url: string;
  uploadedAt: string;
  fileName: string;
  fileSize: number;
  status: 'PENDING' | 'UPLOADED' | 'FAILED';
}

export interface RelatedParty {
  id: string;
  name: string;
  jurisdiction: string;
  taxId?: string;
  relationshipType: string;
  isActive: boolean;
}

export interface TransferPricingTransaction {
  id: string;
  relatedPartyId: string;
  transactionType: TransactionType;
  transferPricingMethod: TransferPricingMethod;
  transactionValue: number;
  currency: string;
  fiscalYear: string;
  description: string;
  documents: TransferPricingDocument[];
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  submissionDate?: string;
  lastModified: string;
  notes?: string;
  isCompliant: boolean;
  complianceNotes?: string;
}

export interface TransferPricingState {
  relatedParties: RelatedParty[];
  transactions: TransferPricingTransaction[];
  documents: TransferPricingDocument[];
  loading: boolean;
  error: string | null;
} 