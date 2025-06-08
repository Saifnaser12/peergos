
import React, { useState } from 'react';
import { Container, Paper, Typography, Tabs, Tab, Box, Button, Grid, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Alert, LinearProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CloudUploadIcon, CheckCircleIcon, XCircleIcon, DocumentTextIcon, UserGroupIcon, BuildingOfficeIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`substance-tabpanel-${index}`}
      aria-labelledby={`substance-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface FileUploadState {
  [key: string]: {
    file: File | null;
    uploaded: boolean;
    uploadDate?: string;
  };
}

export const FreeZoneSubstance: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [uploads, setUploads] = useState<FileUploadState>({
    officeLease: { file: null, uploaded: false },
    salaryPayrolls: { file: null, uploaded: false },
    staffCounts: { file: null, uploaded: false },
    auditedFinancials: { file: null, uploaded: false },
    transferPricingDeclaration: { file: null, uploaded: false },
    transferPricingDocs: { file: null, uploaded: false }
  });

  const [checklist, setChecklist] = useState({
    physicalOffice: false,
    adequateStaff: false,
    coreActivities: false,
    auditedFinancials: false,
    transferPricingCompliance: false
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleFileUpload = (key: string, file: File) => {
    setUploads(prev => ({
      ...prev,
      [key]: {
        file,
        uploaded: true,
        uploadDate: new Date().toISOString()
      }
    }));
  };

  const handleChecklistChange = (key: string, checked: boolean) => {
    setChecklist(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const calculateCompliancePercentage = () => {
    const totalItems = Object.keys(uploads).length + Object.keys(checklist).length;
    const completedUploads = Object.values(uploads).filter(item => item.uploaded).length;
    const completedChecklist = Object.values(checklist).filter(Boolean).length;
    return Math.round(((completedUploads + completedChecklist) / totalItems) * 100);
  };

  const compliancePercentage = calculateCompliancePercentage();

  const FileUploadCard = ({ 
    title, 
    description, 
    uploadKey, 
    icon: Icon 
  }: { 
    title: string; 
    description: string; 
    uploadKey: string; 
    icon: any;
  }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon className="w-6 h-6 mr-2 text-indigo-600" />
          <Typography variant="h6">{title}</Typography>
          {uploads[uploadKey].uploaded && (
            <CheckCircleIcon className="w-5 h-5 ml-auto text-green-600" />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <input
            accept=".pdf,.doc,.docx,.xlsx,.xls"
            style={{ display: 'none' }}
            id={`upload-${uploadKey}`}
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(uploadKey, file);
            }}
          />
          <label htmlFor={`upload-${uploadKey}`}>
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon className="w-4 h-4" />}
              size="small"
            >
              {uploads[uploadKey].uploaded ? t('freeZone.substance.reupload', 'Re-upload') : t('freeZone.substance.upload', 'Upload')}
            </Button>
          </label>
          {uploads[uploadKey].uploaded && (
            <Typography variant="caption" color="text.secondary">
              {t('freeZone.substance.uploadedOn', 'Uploaded on')}: {new Date(uploads[uploadKey].uploadDate!).toLocaleDateString()}
            </Typography>
          )}
        </Box>
        {uploads[uploadKey].file && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {uploads[uploadKey].file!.name}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const ChecklistItem = ({ 
    title, 
    description, 
    checkKey 
  }: { 
    title: string; 
    description: string; 
    checkKey: string;
  }) => (
    <ListItem>
      <ListItemIcon>
        <input
          type="checkbox"
          checked={checklist[checkKey as keyof typeof checklist]}
          onChange={(e) => handleChecklistChange(checkKey, e.target.checked)}
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
      </ListItemIcon>
      <ListItemText
        primary={title}
        secondary={description}
      />
    </ListItem>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {t('freeZone.substance.title', 'Free Zone Economic Substance')}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {t('freeZone.substance.description', 'Manage your Free Zone economic substance requirements and documentation to maintain QFZP status and compliance with UAE regulations.')}
        </Typography>
        
        {/* Compliance Progress */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2">
              {t('freeZone.substance.complianceProgress', 'Compliance Progress')}
            </Typography>
            <Typography variant="subtitle2" color={compliancePercentage >= 80 ? 'success.main' : compliancePercentage >= 50 ? 'warning.main' : 'error.main'}>
              {compliancePercentage}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={compliancePercentage}
            sx={{ 
              height: 8, 
              borderRadius: 4,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                bgcolor: compliancePercentage >= 80 ? 'success.main' : compliancePercentage >= 50 ? 'warning.main' : 'error.main'
              }
            }}
          />
        </Box>

        {compliancePercentage < 100 && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {t('freeZone.substance.incompleteWarning', 'Please complete all substance requirements to maintain your QFZP status and avoid penalties.')}
          </Alert>
        )}
      </Paper>

      <Paper sx={{ p: 0 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="substance requirements tabs">
          <Tab label={t('freeZone.substance.tabs.documentation', 'Documentation')} />
          <Tab label={t('freeZone.substance.tabs.checklist', 'Compliance Checklist')} />
          <Tab label={t('freeZone.substance.tabs.transferPricing', 'Transfer Pricing')} />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Typography variant="h6" gutterBottom>
            {t('freeZone.substance.documentation.title', 'Required Documentation')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('freeZone.substance.documentation.subtitle', 'Upload the following documents to demonstrate economic substance in your Free Zone operations.')}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FileUploadCard
                title={t('freeZone.substance.officeLease.title', 'Office Lease Agreement')}
                description={t('freeZone.substance.officeLease.description', 'Valid lease agreement demonstrating physical office presence in the Free Zone')}
                uploadKey="officeLease"
                icon={BuildingOfficeIcon}
              />
              
              <FileUploadCard
                title={t('freeZone.substance.salaryPayrolls.title', 'Salary & Payroll Records')}
                description={t('freeZone.substance.salaryPayrolls.description', 'Monthly payroll records showing adequate qualified staff')}
                uploadKey="salaryPayrolls"
                icon={CurrencyDollarIcon}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FileUploadCard
                title={t('freeZone.substance.staffCounts.title', 'Staff Count Records')}
                description={t('freeZone.substance.staffCounts.description', 'Detailed staff records including qualifications and roles')}
                uploadKey="staffCounts"
                icon={UserGroupIcon}
              />
              
              <FileUploadCard
                title={t('freeZone.substance.auditedFinancials.title', 'Audited Financial Statements')}
                description={t('freeZone.substance.auditedFinancials.description', 'Latest audited financial statements as required by regulations')}
                uploadKey="auditedFinancials"
                icon={DocumentTextIcon}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>
            {t('freeZone.substance.checklist.title', 'Economic Substance Checklist')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('freeZone.substance.checklist.subtitle', 'Confirm that your Free Zone entity meets all economic substance requirements.')}
          </Typography>

          <List>
            <ChecklistItem
              title={t('freeZone.substance.checklist.physicalOffice', 'Physical Office Presence')}
              description={t('freeZone.substance.checklist.physicalOfficeDesc', 'Maintained adequate physical office space in the Free Zone')}
              checkKey="physicalOffice"
            />
            
            <ChecklistItem
              title={t('freeZone.substance.checklist.adequateStaff', 'Adequate Qualified Staff')}
              description={t('freeZone.substance.checklist.adequateStaffDesc', 'Employed sufficient number of qualified staff to conduct core activities')}
              checkKey="adequateStaff"
            />
            
            <ChecklistItem
              title={t('freeZone.substance.checklist.coreActivities', 'Core Income Generating Activities')}
              description={t('freeZone.substance.checklist.coreActivitiesDesc', 'Conducted core income generating activities in the UAE')}
              checkKey="coreActivities"
            />
            
            <ChecklistItem
              title={t('freeZone.substance.checklist.auditedFinancials', 'Audited Financial Statements')}
              description={t('freeZone.substance.checklist.auditedFinancialsDesc', 'Prepared audited financial statements in accordance with international standards')}
              checkKey="auditedFinancials"
            />
            
            <ChecklistItem
              title={t('freeZone.substance.checklist.transferPricingCompliance', 'Transfer Pricing Compliance')}
              description={t('freeZone.substance.checklist.transferPricingComplianceDesc', 'Maintained proper transfer pricing documentation for related party transactions')}
              checkKey="transferPricingCompliance"
            />
          </List>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>
            {t('freeZone.substance.transferPricing.title', 'Transfer Pricing Documentation')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('freeZone.substance.transferPricing.subtitle', 'Upload transfer pricing documentation and declarations as required for Free Zone entities.')}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FileUploadCard
                title={t('freeZone.substance.transferPricingDeclaration.title', 'Transfer Pricing Declaration')}
                description={t('freeZone.substance.transferPricingDeclaration.description', 'Completed transfer pricing declaration form for related party transactions')}
                uploadKey="transferPricingDeclaration"
                icon={DocumentTextIcon}
              />
              
              <FileUploadCard
                title={t('freeZone.substance.transferPricingDocs.title', 'Transfer Pricing Documentation')}
                description={t('freeZone.substance.transferPricingDocs.description', 'Supporting documentation including local file, master file, and economic analysis')}
                uploadKey="transferPricingDocs"
                icon={DocumentTextIcon}
              />
            </Grid>
          </Grid>

          <Alert severity="warning" sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              {t('freeZone.substance.transferPricing.warning', 'Important Notice')}
            </Typography>
            <Typography variant="body2">
              {t('freeZone.substance.transferPricing.warningText', 'Ensure all transfer pricing documentation complies with UAE guidelines and demonstrates arm\'s length pricing for transactions with related parties.')}
            </Typography>
          </Alert>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default FreeZoneSubstance;
