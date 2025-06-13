import React, { useState } from 'react';
import { Box, Typography, Paper, Checkbox, FormControlLabel, Button, Alert } from '@mui/material';

interface QAItem {
  id: string;
  label: string;
  checked: boolean;
  critical: boolean;
}

interface QASection {
  id: string;
  title: string;
  description: string;
  items: QAItem[];
}

const QAChecklist: React.FC = () => {
  const [sections, setSections] = useState<QASection[]>([
    {
      id: 'auth-security',
      title: '🔐 Authentication & Security',
      description: 'Verify user authentication and authorization systems',
      items: [
        { id: 'login-required', label: 'Login required for protected pages', checked: false, critical: true },
        { id: 'role-permissions', label: 'Role-based permissions enforced correctly', checked: false, critical: true },
        { id: 'unauthorized-redirect', label: 'Unauthorized users redirected to /unauthorized', checked: false, critical: true }
      ]
    },
    {
      id: 'dashboard-sync',
      title: '📊 Dashboard Integration',
      description: 'Ensure dashboard reflects real-time data from accounting inputs',
      items: [
        { id: 'revenue-sync', label: 'Adding revenue in Accounting updates Dashboard', checked: false, critical: true },
        { id: 'expense-sync', label: 'Adding expenses in Accounting updates Dashboard', checked: false, critical: true },
        { id: 'net-income-calc', label: 'Net income calculation updates automatically', checked: false, critical: true },
        { id: 'tax-due-calc', label: 'Tax due calculations reflect current data', checked: false, critical: true },
        { id: 'currency-format', label: 'All currency formats display as AED properly', checked: false, critical: false }
      ]
    },
    {
      id: 'theme-ui',
      title: '🎨 Theme & UI Validation',
      description: 'Verify dark/light mode functionality and UI consistency',
      items: [
        { id: 'theme-toggle', label: 'Theme toggle button visible and functional', checked: false, critical: false },
        { id: 'dark-mode', label: 'Dark mode applies consistently across all pages', checked: false, critical: false },
        { id: 'light-mode', label: 'Light mode applies consistently across all pages', checked: false, critical: false }
      ]
    },
    {
      id: 'translations',
      title: '🏷️ Translation & Labels',
      description: 'Validate all labels are properly translated and no placeholders remain',
      items: [
        { id: 'no-placeholders', label: 'No "Title" or "Subtitle" placeholder text visible', checked: false, critical: true },
        { id: 'nav-labels', label: 'All navigation menu items have proper labels', checked: false, critical: true },
        { id: 'button-labels', label: 'All button labels are translated', checked: false, critical: true },
        { id: 'form-labels', label: 'All form field labels are translated', checked: false, critical: true },
        { id: 'arabic-switch', label: 'Switch to Arabic language works', checked: false, critical: false },
        { id: 'arabic-fallback', label: 'Missing Arabic translations fall back to English', checked: false, critical: true },
        { id: 'rtl-layout', label: 'RTL layout applies correctly for Arabic', checked: false, critical: false }
      ]
    },
    {
      id: 'exports',
      title: '📤 Export Functionality',
      description: 'Test all export features for PDF, Excel, and XML formats',
      items: [
        { id: 'pdf-financials', label: 'Financials PDF export generates successfully', checked: false, critical: true },
        { id: 'pdf-vat', label: 'VAT PDF export generates successfully', checked: false, critical: true },
        { id: 'pdf-cit', label: 'CIT PDF export generates successfully', checked: false, critical: true },
        { id: 'excel-financials', label: 'Financials Excel export generates successfully', checked: false, critical: true },
        { id: 'excel-vat', label: 'VAT Excel export generates successfully', checked: false, critical: true },
        { id: 'xml-invoice', label: 'XML invoice generation works (Phase 2 compliance)', checked: false, critical: true },
        { id: 'download-naming', label: 'All exports download with correct file naming', checked: false, critical: false }
      ]
    },
    {
      id: 'simulation',
      title: '🎭 Simulation Mode',
      description: 'Verify simulation mode is clearly indicated and prevents real submissions',
      items: [
        { id: 'simulation-banner', label: '"Simulation Mode - Demo Only" banner visible', checked: false, critical: true },
        { id: 'simulation-tooltip', label: 'Simulation tooltip shows proper warning', checked: false, critical: true },
        { id: 'submission-blocked', label: 'All submission buttons disabled in simulation', checked: false, critical: true },
        { id: 'mock-data', label: 'Mock data displays correctly', checked: false, critical: false },
        { id: 'fta-disconnected', label: 'FTA integration shows as disconnected', checked: false, critical: true }
      ]
    },
    {
      id: 'trn-lookup',
      title: '🔍 TRN Lookup Functionality',
      description: 'Test TRN validation and lookup functionality',
      items: [
        { id: 'trn-format', label: 'TRN input accepts 15-digit format', checked: false, critical: true },
        { id: 'trn-validation', label: 'TRN validation shows error for invalid format', checked: false, critical: true },
        { id: 'trn-lookup-data', label: 'TRN lookup returns mock company data', checked: false, critical: false },
        { id: 'trn-clear', label: 'TRN field clears and resets properly', checked: false, critical: false },
        { id: 'trn-error-handling', label: 'Error handling for invalid TRN numbers', checked: false, critical: true }
      ]
    }
  ]);

  const handleItemCheck = (sectionId: string, itemId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            items: section.items.map(item =>
              item.id === itemId ? { ...item, checked: !item.checked } : item
            )
          }
        : section
    ));
  };

  const getTotalProgress = () => {
    const totalItems = sections.reduce((sum, section) => sum + section.items.length, 0);
    const checkedItems = sections.reduce((sum, section) => 
      sum + section.items.filter(item => item.checked).length, 0
    );
    return totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;
  };

  const getCriticalProgress = () => {
    const criticalItems = sections.reduce((sum, section) => 
      sum + section.items.filter(item => item.critical).length, 0
    );
    const checkedCriticalItems = sections.reduce((sum, section) => 
      sum + section.items.filter(item => item.critical && item.checked).length, 0
    );
    return criticalItems > 0 ? (checkedCriticalItems / criticalItems) * 100 : 0;
  };

  const getSectionProgress = (section: QASection) => {
    const totalItems = section.items.length;
    const checkedItems = section.items.filter(item => item.checked).length;
    return totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;
  };

  const isReadyForLaunch = () => {
    return getCriticalProgress() === 100;
  };

  const exportChecklist = () => {
    const checklistData = {
      timestamp: new Date().toISOString(),
      totalProgress: getTotalProgress(),
      criticalProgress: getCriticalProgress(),
      readyForLaunch: isReadyForLaunch(),
      sections: sections.map(section => ({
        title: section.title,
        progress: getSectionProgress(section),
        items: section.items.map(item => ({
          label: item.label,
          checked: item.checked,
          critical: item.critical
        }))
      }))
    };
    
    const blob = new Blob([JSON.stringify(checklistData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qa-checklist-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Paper elevation={2} className="p-6 mb-6">
          <Box className="flex items-center justify-between mb-4">
            <Box className="flex items-center gap-3">
              <Typography variant="h4" className="font-bold text-gray-900 dark:text-white">
                QA Launch Checklist
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={exportChecklist}
              className="text-sm"
            >
              Export Report
            </Button>
          </Box>
          
          <Typography variant="body1" className="text-gray-600 dark:text-gray-400 mb-4">
            Pre-launch validation checklist for Peergos UAE Compliance Engine
          </Typography>

          {/* Progress Overview */}
          <Alert severity="info">
            Complete all critical items before launching to production. Export this report for sign-off documentation.
          </Alert>
          <Button 
            variant="contained" 
            onClick={exportChecklist}
            className="mt-3"
          >
            Export QA Report
          </Button>
        </Paper>

        {/* QA Sections */}
        {sections.map((section, index) => (
          <Paper key={section.id} elevation={2} className="mb-4 p-4">
            <Typography variant="h6" className="mb-2">{section.title}</Typography>
            <Typography variant="body2" className="mb-3 text-gray-600">{section.description}</Typography>

            {section.items.map((item) => (
              <FormControlLabel
                key={item.id}
                control={
                  <Checkbox
                    checked={item.checked}
                    onChange={() => handleItemCheck(section.id, item.id)}
                    color={item.critical ? 'error' : 'primary'}
                  />
                }
                label={
                  <span className={item.critical ? 'font-semibold text-red-600' : ''}>
                    {item.label} {item.critical && '(Critical)'}
                  </span>
                }
                className="block mb-2"
              />
            ))}
          </Paper>
        ))}

        {/* Footer */}
        <Paper elevation={1} className="p-4 mt-6">
          <Typography variant="body2" className="text-center text-gray-600 dark:text-gray-400">
            Complete all critical items before launching to production. 
            Export this report for sign-off documentation.
          </Typography>
        </Paper>
      </div>
    </Box>
  );
};

export default QAChecklist;