export enum TransactionType {
  SALE_OF_GOODS = 'SALE_OF_GOODS',
  SALE_OF_SERVICES = 'SALE_OF_SERVICES',
  PURCHASE_OF_GOODS = 'PURCHASE_OF_GOODS',
  PURCHASE_OF_SERVICES = 'PURCHASE_OF_SERVICES',
  ROYALTIES = 'ROYALTIES',
  INTEREST = 'INTEREST',
  MANAGEMENT_FEES = 'MANAGEMENT_FEES',
  COST_SHARING = 'COST_SHARING',
  OTHER = 'OTHER'
}

export enum TransferPricingMethod {
  CUP = 'CUP', // Comparable Uncontrolled Price
  RESALE_PRICE = 'RESALE_PRICE',
  COST_PLUS = 'COST_PLUS',
  TNMM = 'TNMM', // Transactional Net Margin Method
  PSM = 'PSM', // Profit Split Method
  OTHER = 'OTHER'
}

export interface TransferPricingDocument {
  id: string;
  type: 'MASTER_FILE' | 'LOCAL_FILE' | 'CBC_REPORT';
  fileName: string;
  fileSize: number;
  uploadDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  comments?: string;
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