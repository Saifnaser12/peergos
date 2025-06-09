export interface CompanyProfile {
  trnNumber: string;
  companyName: string;
  licenseType: string;
  vatRegistered: boolean;
  citRegistered: boolean;
  email?: string;
  phone?: string;
  address?: string;
  businessActivity?: string;
  // Enhanced tax category classification
  taxCategory: {
    citExemptionStatus: 'exempt' | 'taxable' | 'small_business_relief';
    vatRegistrationStatus: 'registered' | 'voluntary' | 'not_registered';
    entityType: 'mainland' | 'free_zone' | 'offshore';
    isQualifyingFreeZonePerson: boolean;
    substantialActivitiesTest?: boolean;
  };
  // Document upload tracking
  categoryDocuments: {
    businessLicense?: string;
    trnLetter?: string;
    qfzpDeclaration?: string;
    lastUpdated: string;
    ftaAuditReady: boolean;
  };
  // Free Zone specific details
  freeZoneDetails?: {
    zoneName: string;
    zoneAddress: string;
    employeeCount: number;
    operatingExpenses: number;
    incomeClassification: {
      qualifyingIncome: number;
      nonQualifyingIncome: number;
    };
  };
} 