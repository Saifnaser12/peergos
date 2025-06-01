import React, { useState } from 'react';
import { useTax } from '../context/TaxContext';
import SubmissionModal from '../components/SubmissionModal';
import SuccessAlert from '../components/SuccessAlert';
import { submitToFTA } from '../utils/submission';

const Filing: React.FC = () => {
  const { state } = useTax();
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    message: string;
    referenceNumber: string;
  } | null>(null);

  const handleSubmitToFTA = async () => {
    if (!state.profile) {
      console.error('No profile data available');
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData = {
        trn: state.profile.trnNumber,
        timestamp: new Date().toISOString(),
        referenceNumber: '',
        data: {
          revenues: state.revenues,
          expenses: state.expenses,
          vatDue: state.revenues.reduce((sum, entry) => sum + entry.vatAmount, 0),
          citDue: state.revenues.reduce((sum, entry) => sum + (entry.amount * 0.09), 0),
          complianceScore: 100 // This should be calculated based on your compliance rules
        }
      };

      const referenceNumber = await submitToFTA(submissionData);
      setSubmissionSuccess({
        message: 'Tax report submitted successfully to FTA.',
        referenceNumber
      });
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
      setIsSubmitModalOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {submissionSuccess && (
        <div className="mb-6">
          <SuccessAlert
            message={submissionSuccess.message}
            referenceNumber={submissionSuccess.referenceNumber}
            onClose={() => setSubmissionSuccess(null)}
          />
        </div>
      )}

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Tax Filing</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Review your tax information and submit your report to the FTA.</p>
          </div>
          <div className="mt-5">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={!state.profile}
            >
              Submit to FTA
            </button>
          </div>
        </div>
      </div>

      <SubmissionModal
        isOpen={isSubmitModalOpen}
        isLoading={isSubmitting}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirm={handleSubmitToFTA}
      />
    </div>
  );
};

export default Filing; 