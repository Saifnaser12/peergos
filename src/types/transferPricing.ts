
export enum TransactionType {
  SALE_OF_GOODS = 'SALE_OF_GOODS',
  PROVISION_OF_SERVICES = 'PROVISION_OF_SERVICES',
  FINANCING_LOANS = 'FINANCING_LOANS',
  IP_LICENSING = 'IP_LICENSING',
  COST_SHARING = 'COST_SHARING',
  MANAGEMENT_FEES = 'MANAGEMENT_FEES',
  ROYALTIES = 'ROYALTIES',
  OTHER = 'OTHER'
}

export enum TransferPricingMethod {
  COMPARABLE_UNCONTROLLED_PRICE = 'COMPARABLE_UNCONTROLLED_PRICE',
  RESALE_PRICE = 'RESALE_PRICE',
  COST_PLUS = 'COST_PLUS',
  TRANSACTIONAL_NET_MARGIN = 'TRANSACTIONAL_NET_MARGIN',
  PROFIT_SPLIT = 'PROFIT_SPLIT',
  OTHER = 'OTHER'
}

export enum RelationshipType {
  SUBSIDIARY = 'SUBSIDIARY',
  PARENT_COMPANY = 'PARENT_COMPANY',
  SISTER_COMPANY = 'SISTER_COMPANY',
  ASSOCIATED_ENTERPRISE = 'ASSOCIATED_ENTERPRISE',
  BRANCH = 'BRANCH',
  PERMANENT_ESTABLISHMENT = 'PERMANENT_ESTABLISHMENT',
  OTHER = 'OTHER'
}

export enum DocumentType {
  MASTER_FILE = 'MASTER_FILE',
  LOCAL_FILE = 'LOCAL_FILE',
  CBC_REPORT = 'CBC_REPORT',
  AGREEMENT = 'AGREEMENT',
  BENCHMARKING_STUDY = 'BENCHMARKING_STUDY',
  ECONOMIC_ANALYSIS = 'ECONOMIC_ANALYSIS',
  SUPPORTING_DOCUMENT = 'SUPPORTING_DOCUMENT'
}

export interface CompanyInfo {
  legalName: string;
  trn: string;
  fiscalYearStart: string;
  fiscalYearEnd: string;
  isPartOfTaxGroup: boolean;
  isPartOfMultinationalGroup: boolean;
  consolidatedRevenue?: number;
  consolidatedAssets?: number;
}

export interface RelatedParty {
  id: string;
  name: string;
  country: string;
  relationshipType: RelationshipType;
  ownershipPercentage?: number;
  taxIdentificationNumber?: string;
  isActive: boolean;
  description?: string;
}

export interface IntercompanyTransaction {
  id: string;
  relatedPartyId: string;
  relatedPartyName: string;
  transactionType: TransactionType;
  amount: number;
  currency: string;
  transferPricingMethod: TransferPricingMethod;
  hasDocumentation: boolean;
  documentationDescription?: string;
  dateOfTransaction: string;
  description: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  notes?: string;
}

export interface ComplianceAnswers {
  requiresMasterFile: boolean;
  hasPreparedLocalFile: boolean;
  meetsConsolidatedThreshold: boolean; // AED 200M
  hasCbCRFiled: boolean;
  hasTransferPricingPolicy: boolean;
  hasDocumentedArmLength: boolean;
  hasEconomicAnalysis: boolean;
}

export interface TransferPricingDocument {
  id: string;
  type: DocumentType;
  name: string;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  status: 'PENDING' | 'UPLOADED' | 'FAILED';
  url?: string;
}

export interface TransferPricingRisk {
  id: string;
  type: 'HIGH_VALUE_TRANSACTION' | 'MISSING_DOCUMENTATION' | 'COMPLEX_STRUCTURE' | 'TAX_HAVEN_JURISDICTION' | 'RELATED_PARTY_LOANS' | 'IP_WITHOUT_SUPPORT';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  recommendation: string;
  transactionId?: string;
  relatedPartyId?: string;
}

export interface TransferPricingSummary {
  totalTransactionsByType: Record<TransactionType, { count: number; amount: number }>;
  totalValue: number;
  riskFlags: TransferPricingRisk[];
  complianceScore: number;
  requiredDocuments: DocumentType[];
  uploadedDocuments: TransferPricingDocument[];
}

export interface TransferPricingDisclosure {
  id: string;
  companyInfo: CompanyInfo;
  relatedParties: RelatedParty[];
  transactions: IntercompanyTransaction[];
  complianceAnswers: ComplianceAnswers;
  documents: TransferPricingDocument[];
  summary: TransferPricingSummary;
  status: 'DRAFT' | 'REVIEW' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  reviewedAt?: string;
}

export interface TransferPricingState {
  currentDisclosure: TransferPricingDisclosure | null;
  disclosures: TransferPricingDisclosure[];
  loading: boolean;
  error: string | null;
}
