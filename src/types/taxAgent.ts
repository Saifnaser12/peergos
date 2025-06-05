
export interface TaxAgent {
  id: string;
  name: string;
  certificateId: string;
  ftaProfileUrl: string;
  specialization: string[];
  rating: number;
}

export interface TaxAgentState {
  selectedAgent: TaxAgent | null;
  uploadedCertificate: File | null;
  certificateUrl: string | null;
}
