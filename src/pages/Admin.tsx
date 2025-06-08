import React from 'react';
import { Box, Typography, Paper, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Users as UsersIcon,
  Settings as SettingsIcon,
  BarChart3 as AnalyticsIcon,
  Shield as SecurityIcon,
  Database as BackupIcon,
  AlertTriangle as AlertIcon,
  CheckCircle as CheckIcon,
  Clock as ClockIcon,
  Palette as SwatchIcon
} from 'lucide-react';
import { Assignment as AssignmentIcon } from '@mui/icons-material';
import TaxAgentSelector from '../components/TaxAgentSelector';
import POSIntegrationToggle from '../components/POSIntegrationToggle';
import QAChecklist from '../components/QAChecklist';
import AuditTrailLogger from '../components/AuditTrailLogger';
import SystemHealthMonitor from '../components/SystemHealthMonitor';
import BackupManager from '../components/BackupManager';

const Admin: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Administration
      </Typography>
      <Paper sx={{ p: 3 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* QA Checklist Card */}
              <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => navigate('/qa-checklist')}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <AssignmentIcon className="text-green-600 mr-3" sx={{ fontSize: 32 }} />
                    <Typography variant="h6" className="font-semibold">
                      QA Launch Checklist
                    </Typography>
                  </div>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-4">
                    Pre-launch validation checklist for all system components
                  </Typography>
                  <Button variant="outlined" fullWidth>
                    Open Checklist
                  </Button>
                </CardContent>
              </Card>

              {/* Backup & Recovery Card */}
              <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => navigate('/backup')}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <BackupIcon className="text-blue-600 mr-3" sx={{ fontSize: 32 }} />
                    <Typography variant="h6" className="font-semibold">
                      Backup & Recovery
                    </Typography>
                  </div>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-4">
                    Secure data backup and restore for all user-generated content
                  </Typography>
                  <Button variant="outlined" fullWidth>
                    Manage Backups
                  </Button>
                </CardContent>
              </Card>

              {/* Whitelabel Configuration Card */}
              <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => navigate('/whitelabel')}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <SwatchIcon className="text-purple-600 mr-3" sx={{ fontSize: 32 }} />
                    <Typography variant="h6" className="font-semibold">
                      Whitelabel Configuration
                    </Typography>
                  </div>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-4">
                    Customize branding, colors, and appearance for your tenant
                  </Typography>
                  <Button variant="outlined" fullWidth>
                    Configure Branding
                  </Button>
                </CardContent>
              </Card>

          <Typography variant="body1">
            System administration and user management features will be implemented here.
          </Typography>
        </div>
      </Paper>
    </Box>
  );
};

export default Admin;