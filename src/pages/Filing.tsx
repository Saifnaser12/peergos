import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useI18nHelpers from '../hooks/useI18nHelpers';
import { useUserRole } from '../context/UserRoleContext';
import { Box, Typography, Paper } from '@mui/material';

const Filing: React.FC = () => {
  const { t } = useI18nHelpers();
  const { hasPermission } = useUserRole();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);

  // Check setup completion
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  useEffect(() => {
    const setupStatus = localStorage.getItem('peergos_setup_complete');
    setIsSetupComplete(setupStatus === 'true');
  }, []);

const handleSubmit = async (formData: any) => {
    if (!hasPermission('filing', 'submit')) {
      alert('You do not have permission to submit filings');
      return;
    }

    // Block submission if setup is incomplete
    if (!isSetupComplete) {
      if (confirm('Setup is incomplete. Complete setup first to ensure compliance. Navigate to Setup page?')) {
        navigate('/setup');
      }
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate submission
      console.log('Submitting filing:', formData);
      // Add to submissions list
      setSubmissions(prev => [...prev, {
        id: Date.now(),
        type: formData.type,
        date: new Date().toISOString(),
        status: 'submitted'
      }]);
    } catch (error) {
      console.error('Filing submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('nav.filing')}
      </Typography>
      {/* Pre-Filing Checklist */}
      <Paper elevation={0} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-8 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/peergos_slide_14.png)' }}
        />
        <Box className="relative z-10">
          <Typography variant="h6" className="text-gray-900 dark:text-white font-semibold mb-4">
            {t('filing.checklist.title', 'Pre-Filing Checklist')}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Filing;