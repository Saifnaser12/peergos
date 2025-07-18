
export interface FTASubmissionData {
  trn: string;
  companyName: string;
  submissionType: 'CIT' | 'VAT';
  taxPeriod: string;
  data: Record<string, any>;
  documents?: File[];
}

export interface FTASubmissionResponse {
  submissionId: string;
  status: 'submitted' | 'processing' | 'approved' | 'rejected';
  timestamp: string;
  referenceNumber: string;
  trackingUrl?: string;
  taxAgentCertificate?: {
    uploaded: boolean;
    fileName?: string;
    uploadDate?: string;
  };
  bankSlip?: {
    uploaded: boolean;
    fileName?: string;
    uploadDate?: string;
  };
}

export interface TRNLookupResult {
  trn: string;
  companyName: string;
  status: 'active' | 'suspended' | 'cancelled';
  registrationDate: string;
  complianceStatus: 'compliant' | 'non-compliant' | 'under-review';
  businessType: string;
  emirate: string;
  lastFilingDate?: string;
}

export interface FTAIntegrationStatus {
  isConnected: boolean;
  lastSync: string;
  submissionsCount: number;
  complianceScore: number;
  alerts: string[];
}

// Mock TRN database
const MOCK_TRN_DATABASE: Record<string, TRNLookupResult> = {
  '100123456700003': {
    trn: '100123456700003',
    companyName: 'Al Mansouri Trading LLC',
    status: 'active',
    registrationDate: '2018-01-01',
    complianceStatus: 'compliant',
    businessType: 'Trading',
    emirate: 'Dubai',
    lastFilingDate: '2024-01-15'
  },
  '100987654300001': {
    trn: '100987654300001',
    companyName: 'Emirates Tech Solutions FZE',
    status: 'active',
    registrationDate: '2019-06-15',
    complianceStatus: 'compliant',
    businessType: 'Technology Services',
    emirate: 'Abu Dhabi',
    lastFilingDate: '2024-01-20'
  },
  '100555666700002': {
    trn: '100555666700002',
    companyName: 'Gulf Construction Company LLC',
    status: 'active',
    registrationDate: '2017-03-10',
    complianceStatus: 'under-review',
    businessType: 'Construction',
    emirate: 'Sharjah',
    lastFilingDate: '2023-12-28'
  },
  '100111222300004': {
    trn: '100111222300004',
    companyName: 'Desert Rose Hospitality Group',
    status: 'suspended',
    registrationDate: '2020-02-20',
    complianceStatus: 'non-compliant',
    businessType: 'Hospitality',
    emirate: 'Dubai',
    lastFilingDate: '2023-10-15'
  }
};

class FTAService {
  private baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://api.fta.gov.ae/v1' 
    : 'https://api-staging.fta.gov.ae/v1'; // Use staging for dev
  private apiKey = process.env.VITE_FTA_API_KEY || 'mock-api-key';

  // Simulate API delay
  private async delay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Check FTA connection status
  async checkConnection(): Promise<boolean> {
    await this.delay(500);
    return true; // Mock always connected
  }

  // Mock TRN lookup with real-time simulation
  async lookupTRN(trn: string): Promise<TRNLookupResult | null> {
    await this.delay(800); // Simulate network delay
    
    // Clean TRN input
    const cleanTRN = trn.replace(/\D/g, '');
    
    if (cleanTRN.length !== 15) {
      throw new Error('Invalid TRN format. TRN must be 15 digits.');
    }

    const result = MOCK_TRN_DATABASE[cleanTRN];
    if (!result) {
      return null; // TRN not found
    }

    return result;
  }

  // Submit CIT data to FTA
  async submitCIT(data: FTASubmissionData): Promise<FTASubmissionResponse> {
    await this.delay(2000); // Simulate submission processing
    
    const submissionId = `CIT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const referenceNumber = `FTA-CIT-${new Date().getFullYear()}-${submissionId.substr(-6)}`;
    
    const response: FTASubmissionResponse = {
      submissionId,
      status: 'submitted',
      timestamp: new Date().toISOString(),
      referenceNumber,
      trackingUrl: `https://fta.gov.ae/track/${submissionId}`
    };

    // Store submission in localStorage for history
    this.storeSubmission(response, data);
    
    return response;
  }

  // Submit VAT data to FTA
  async submitVAT(data: FTASubmissionData): Promise<FTASubmissionResponse> {
    await this.delay(1500); // Simulate submission processing
    
    const submissionId = `VAT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const referenceNumber = `FTA-VAT-${new Date().getFullYear()}-${submissionId.substr(-6)}`;
    
    const response: FTASubmissionResponse = {
      submissionId,
      status: 'submitted',
      timestamp: new Date().toISOString(),
      referenceNumber,
      trackingUrl: `https://fta.gov.ae/track/${submissionId}`
    };

    // Store submission in localStorage for history
    this.storeSubmission(response, data);
    
    return response;
  }

  // Upload Tax Agent Certificate
  async uploadTaxAgentCertificate(file: File, trn: string): Promise<{uploadId: string; status: string}> {
    await this.delay(1000);
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error('File size exceeds 5MB limit');
    }

    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
      throw new Error('Invalid file type. Only PDF, JPEG, and PNG are allowed.');
    }

    const uploadId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      uploadId,
      status: 'uploaded'
    };
  }

  // Upload Payment Slip
  async uploadPaymentSlip(file: File, trn: string, amount: number): Promise<{uploadId: string; status: string}> {
    await this.delay(1200);
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('File size exceeds 10MB limit');
    }

    const uploadId = `PAYMENT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      uploadId,
      status: 'uploaded'
    };
  }

  // Get submission history
  getSubmissionHistory(trn: string): Array<FTASubmissionResponse & {data: FTASubmissionData}> {
    const key = `fta_submissions_${trn}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }

  // Get FTA integration status
  async getFTAIntegrationStatus(trn: string): Promise<FTAIntegrationStatus> {
    await this.delay(500);
    
    const submissions = this.getSubmissionHistory(trn);
    const lastSync = submissions.length > 0 ? submissions[submissions.length - 1].timestamp : new Date().toISOString();
    
    // Mock compliance score based on submission frequency
    const complianceScore = Math.min(100, submissions.length * 15 + 60);
    
    const alerts: string[] = [];
    if (complianceScore < 80) {
      alerts.push('VAT return due in 5 days');
    }
    if (submissions.length === 0) {
      alerts.push('No submissions found. Complete your first filing.');
    }

    return {
      isConnected: true,
      lastSync,
      submissionsCount: submissions.length,
      complianceScore,
      alerts
    };
  }

  // Store submission in localStorage
  private storeSubmission(response: FTASubmissionResponse, data: FTASubmissionData): void {
    const key = `fta_submissions_${data.trn}`;
    const existing = this.getSubmissionHistory(data.trn);
    existing.push({ ...response, data });
    localStorage.setItem(key, JSON.stringify(existing));
  }

  // Check FTA system status (mock)
  async getSystemStatus(): Promise<{status: 'online' | 'maintenance' | 'offline'; message?: string}> {
    await this.delay(300);
    
    // Simulate 95% uptime
    const isOnline = Math.random() > 0.05;
    
    if (!isOnline) {
      return {
        status: 'maintenance',
        message: 'FTA systems are currently under maintenance. Please try again later.'
      };
    }

    return { status: 'online' };
  }
}

export const ftaService = new FTAService();
