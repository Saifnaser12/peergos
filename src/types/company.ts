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
} 