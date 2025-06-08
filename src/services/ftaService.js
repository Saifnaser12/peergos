// Mock TRN database
const MOCK_TRN_DATABASE = {
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
    constructor() {
        Object.defineProperty(this, "baseUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'https://api.fta.gov.ae/v1'
        }); // Mock endpoint
        Object.defineProperty(this, "apiKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'mock-api-key'
        });
    }
    // Simulate API delay
    async delay(ms = 1000) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    // Check FTA connection status
    async checkConnection() {
        await this.delay(500);
        return true; // Mock always connected
    }
    // Mock TRN lookup with real-time simulation
    async lookupTRN(trn) {
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
    async submitCIT(data) {
        await this.delay(2000); // Simulate submission processing
        const submissionId = `CIT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const referenceNumber = `FTA-CIT-${new Date().getFullYear()}-${submissionId.substr(-6)}`;
        const response = {
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
    async submitVAT(data) {
        await this.delay(1500); // Simulate submission processing
        const submissionId = `VAT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const referenceNumber = `FTA-VAT-${new Date().getFullYear()}-${submissionId.substr(-6)}`;
        const response = {
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
    async uploadTaxAgentCertificate(file, trn) {
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
    async uploadPaymentSlip(file, trn, amount) {
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
    getSubmissionHistory(trn) {
        const key = `fta_submissions_${trn}`;
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : [];
    }
    // Get FTA integration status
    async getFTAIntegrationStatus(trn) {
        await this.delay(500);
        const submissions = this.getSubmissionHistory(trn);
        const lastSync = submissions.length > 0 ? submissions[submissions.length - 1].timestamp : new Date().toISOString();
        // Mock compliance score based on submission frequency
        const complianceScore = Math.min(100, submissions.length * 15 + 60);
        const alerts = [];
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
    storeSubmission(response, data) {
        const key = `fta_submissions_${data.trn}`;
        const existing = this.getSubmissionHistory(data.trn);
        existing.push({ ...response, data });
        localStorage.setItem(key, JSON.stringify(existing));
    }
    // Check FTA system status (mock)
    async getSystemStatus() {
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
