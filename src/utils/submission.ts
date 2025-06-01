interface SubmissionData {
  trn: string;
  timestamp: string;
  referenceNumber: string;
  data: {
    revenues: any[];
    expenses: any[];
    vatDue: number;
    citDue: number;
    complianceScore: number;
  };
}

export const submitToFTA = async (data: SubmissionData): Promise<string> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generate reference number
  const referenceNumber = `FTA-${Date.now()}`;

  // Store submission in localStorage
  const submissions = JSON.parse(localStorage.getItem(`submissions_${data.trn}`) || '[]');
  submissions.push({
    ...data,
    referenceNumber,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem(`submissions_${data.trn}`, JSON.stringify(submissions));

  // Update tax state to mark as submitted
  const taxState = JSON.parse(localStorage.getItem('taxState') || '{}');
  taxState.lastSubmission = {
    timestamp: new Date().toISOString(),
    referenceNumber
  };
  localStorage.setItem('taxState', JSON.stringify(taxState));

  return referenceNumber;
};

export const getSubmissionHistory = (trn: string): Array<{
  referenceNumber: string;
  timestamp: string;
  data: any;
}> => {
  return JSON.parse(localStorage.getItem(`submissions_${trn}`) || '[]');
}; 